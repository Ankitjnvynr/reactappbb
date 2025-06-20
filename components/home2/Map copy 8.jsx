import React, { useEffect, useState, useRef } from 'react';
import { 
  View, 
  Alert, 
  ActivityIndicator, 
  Dimensions, 
  Text, 
  TouchableOpacity, 
  StyleSheet,
  Modal,
  PanResponder,
  Animated
} from 'react-native';
import Svg, { Path, G } from 'react-native-svg';
import biharGeoJSON from '@/assets/data/bihar.json';

const screen = Dimensions.get('window');

// Political parties with their colors
const PARTIES = {
  'BJP': { name: 'Bharatiya Janata Party', color: '#FF9933' },
  'JDU': { name: 'Janata Dal (United)', color: '#138808' },
  'RJD': { name: 'Rashtriya Janata Dal', color: '#008000' },
  'INC': { name: 'Indian National Congress', color: '#19AAED' },
  'LJP': { name: 'Lok Janshakti Party', color: '#0066CC' },
  'CPI': { name: 'Communist Party of India', color: '#FF0000' },
  'AIMIM': { name: 'All India Majlis-e-Ittehadul Muslimeen', color: '#00FF00' },
  'HAM': { name: 'Hindustani Awam Morcha', color: '#800080' },
  'VIP': { name: 'Vikassheel Insaan Party', color: '#FFD700' },
  'NOTA': { name: 'None of the Above', color: '#808080' }
};

export default function BiharVotingMap() {
  const [paths, setPaths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [votes, setVotes] = useState({}); // Store votes for each constituency
  const [selectedConstituency, setSelectedConstituency] = useState(null);
  const [showVotingModal, setShowVotingModal] = useState(false);
  const [voteCounts, setVoteCounts] = useState({});

  // Zoom and pan state
  const scale = useRef(new Animated.Value(1)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const [currentScale, setCurrentScale] = useState(1);
  const [currentTranslateX, setCurrentTranslateX] = useState(0);
  const [currentTranslateY, setCurrentTranslateY] = useState(0);

  // Touch tracking for pinch and pan
  const lastDistance = useRef(0);
  const lastScale = useRef(1);
  const lastPan = useRef({ x: 0, y: 0 });
  const isZooming = useRef(false);

  useEffect(() => {
    const convertGeoJSONToPaths = async () => {
      try {
        const features = biharGeoJSON.features;

        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

        // First, get bounds
        features.forEach((feature) => {
          const coords = feature.geometry.coordinates;
          const all = feature.geometry.type === 'Polygon' ? coords : coords.flat();

          all.forEach((ring) => {
            ring.forEach(([x, y]) => {
              minX = Math.min(minX, x);
              minY = Math.min(minY, y);
              maxX = Math.max(maxX, x);
              maxY = Math.max(maxY, y);
            });
          });
        });

        const scaleX = screen.width / (maxX - minX);
        const scaleY = (screen.height - 200) / (maxY - minY); // Account for header and summary
        const mapScale = Math.min(scaleX, scaleY) * 0.9;

        const translateXOffset = -minX * mapScale + (screen.width - (maxX - minX) * mapScale) / 2;
        const translateYOffset = -minY * mapScale + 20;

        const pathData = features.map((feature, index) => {
          const coords = feature.geometry.coordinates;
          let pathString = "";

          const drawPolygon = (polygon) => {
            const [firstX, firstY] = polygon[0];
            pathString += `M ${firstX * mapScale + translateXOffset},${firstY * mapScale + translateYOffset} `;
            polygon.slice(1).forEach(([x, y]) => {
              pathString += `L ${x * mapScale + translateXOffset},${y * mapScale + translateYOffset} `;
            });
            pathString += "Z ";
          };

          if (feature.geometry.type === 'Polygon') {
            coords.forEach(drawPolygon);
          } else if (feature.geometry.type === 'MultiPolygon') {
            coords.forEach((poly) => poly.forEach(drawPolygon));
          }

          return {
            path: pathString,
            name: feature.properties.constituency || `Area ${index + 1}`,
            id: index,
          };
        });

        setPaths(pathData);
        
        // Initialize vote counts
        const initialCounts = {};
        Object.keys(PARTIES).forEach(party => {
          initialCounts[party] = 0;
        });
        setVoteCounts(initialCounts);
        
        setLoading(false);
      } catch (err) {
        console.error("Error parsing GeoJSON:", err);
        setLoading(false);
      }
    };

    convertGeoJSONToPaths();
  }, []);

  // Calculate distance between two touches
  const getDistance = (touches) => {
    if (touches.length < 2) return 0;
    const [first, second] = touches;
    return Math.sqrt(
      Math.pow(second.pageX - first.pageX, 2) + 
      Math.pow(second.pageY - first.pageY, 2)
    );
  };

  // Get center point of two touches
  const getCenter = (touches) => {
    if (touches.length < 2) return { x: 0, y: 0 };
    const [first, second] = touches;
    return {
      x: (first.pageX + second.pageX) / 2,
      y: (first.pageY + second.pageY) / 2
    };
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        const touches = evt.nativeEvent.touches;
        if (touches.length === 2) {
          // Start pinch gesture
          isZooming.current = true;
          lastDistance.current = getDistance(touches);
          lastScale.current = currentScale;
        } else if (touches.length === 1) {
          // Start pan gesture
          isZooming.current = false;
          lastPan.current = {
            x: currentTranslateX,
            y: currentTranslateY
          };
        }
      },
      onPanResponderMove: (evt, gestureState) => {
        const touches = evt.nativeEvent.touches;
        
        if (touches.length === 2) {
          // Handle pinch-to-zoom
          isZooming.current = true;
          const currentDistance = getDistance(touches);
          const center = getCenter(touches);
          
          if (lastDistance.current > 0) {
            const newScale = Math.max(0.5, Math.min(5, lastScale.current * (currentDistance / lastDistance.current)));
            
            setCurrentScale(newScale);
            scale.setValue(newScale);
          }
        } else if (touches.length === 1 && !isZooming.current) {
          // Handle pan (single finger drag)
          const newTranslateX = lastPan.current.x + gestureState.dx;
          const newTranslateY = lastPan.current.y + gestureState.dy;
          
          setCurrentTranslateX(newTranslateX);
          setCurrentTranslateY(newTranslateY);
          translateX.setValue(newTranslateX);
          translateY.setValue(newTranslateY);
        }
      },
      onPanResponderRelease: (evt) => {
        const touches = evt.nativeEvent.touches;
        if (touches.length === 0) {
          isZooming.current = false;
        }
      },
    })
  ).current;

  const handleConstituencyPress = (constituency) => {
    // Only handle press if not zooming/panning
    if (!isZooming.current) {
      setSelectedConstituency(constituency);
      setShowVotingModal(true);
    }
  };

  const castVote = (partyCode) => {
    if (selectedConstituency) {
      const previousVote = votes[selectedConstituency.id];
      
      // Update votes
      const newVotes = { ...votes };
      newVotes[selectedConstituency.id] = partyCode;
      setVotes(newVotes);

      // Update vote counts
      const newCounts = { ...voteCounts };
      if (previousVote) {
        newCounts[previousVote] = Math.max(0, newCounts[previousVote] - 1);
      }
      newCounts[partyCode] = newCounts[partyCode] + 1;
      setVoteCounts(newCounts);

      setShowVotingModal(false);
      setSelectedConstituency(null);

      Alert.alert(
        'Vote Cast Successfully!', 
        `Your vote for ${PARTIES[partyCode].name} in ${selectedConstituency.name} has been recorded.`,
        [{ text: 'OK' }]
      );
    }
  };

  const getConstituencyColor = (constituencyId) => {
    const votedParty = votes[constituencyId];
    if (votedParty) {
      return PARTIES[votedParty].color;
    }
    return '#FFFFFF'; // Default white color for unvoted constituencies
  };

  const resetVotes = () => {
    Alert.alert(
      'Reset All Votes',
      'Are you sure you want to reset all votes? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reset', 
          style: 'destructive',
          onPress: () => {
            setVotes({});
            const initialCounts = {};
            Object.keys(PARTIES).forEach(party => {
              initialCounts[party] = 0;
            });
            setVoteCounts(initialCounts);
          }
        }
      ]
    );
  };

  const resetZoom = () => {
    Animated.parallel([
      Animated.timing(scale, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(translateX, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
    
    setCurrentScale(1);
    setCurrentTranslateX(0);
    setCurrentTranslateY(0);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#264653" />
        <Text style={styles.loadingText}>Loading Bihar Map...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bihar Election Map</Text>
        <View style={styles.headerButtons}>
          {/* <TouchableOpacity style={styles.zoomResetButton} onPress={resetZoom}>
            <Text style={styles.buttonText}>🔍 Reset</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.resetButton} onPress={resetVotes}>
            <Text style={styles.resetButtonText}>Reset Votes</Text>
          </TouchableOpacity> */}
        </View>
      </View>

      {/* Vote Summary */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryRow}>
          {Object.entries(PARTIES).map(([code, party]) => (
            <View key={code} style={styles.summaryItem}>
              <View style={[styles.colorBox, { backgroundColor: party.color }]} />
              <Text style={styles.summaryText}>{code}: {voteCounts[code] || 0}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Zoom Instructions */}
      {/* <View style={styles.instructionsContainer}>
        <Text style={styles.instructionsText}>
          📍 Tap to vote • 🤏 Pinch to zoom • ✋ Drag to pan
        </Text>
      </View> */}

      {/* Map */}
      <View style={styles.mapContainer} {...panResponder.panHandlers}>
        <Animated.View
          style={[
            styles.svgContainer,
            {
              transform: [
                { scale: scale },
                { translateX: translateX },
                { translateY: translateY },
              ],
            },
          ]}
        >
          <Svg width={screen.width} height={screen.height} style={styles.svg}>
            <G>
              {paths.map((item, idx) => (
                <Path
                  key={idx}
                  d={item.path}
                  fill={getConstituencyColor(item.id)}
                  stroke="#264653"
                  strokeWidth={0.5}
                  onPress={() => handleConstituencyPress(item)}
                />
              ))}
            </G>
          </Svg>
        </Animated.View>
      </View>

      {/* Voting Modal */}
      <Modal
        visible={showVotingModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowVotingModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              Cast Your Vote
            </Text>
            <Text style={styles.modalSubtitle}>
              {selectedConstituency?.name}
            </Text>
            
            {votes[selectedConstituency?.id] && (
              <Text style={styles.currentVoteText}>
                Current Vote: {PARTIES[votes[selectedConstituency.id]].name}
              </Text>
            )}

            <View style={styles.partyList}>
              {Object.entries(PARTIES).map(([code, party]) => (
                <TouchableOpacity
                  key={code}
                  style={[
                    styles.partyButton,
                    { borderColor: party.color },
                    votes[selectedConstituency?.id] === code && styles.selectedParty
                  ]}
                  onPress={() => castVote(code)}
                >
                  <View style={[styles.partyColorIndicator, { backgroundColor: party.color }]} />
                  <View style={styles.partyInfo}>
                    <Text style={styles.partyCode}>{code}</Text>
                    <Text style={styles.partyName}>{party.name}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowVotingModal(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 50,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#264653',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#264653',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  zoomResetButton: {
    backgroundColor: '#2a9d8f',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 5,
  },
  resetButton: {
    backgroundColor: '#e76f51',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  resetButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  summaryContainer: {
    backgroundColor: 'white',
    paddingVertical: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    flexWrap: 'wrap',
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
    marginBottom: 4,
  },
  colorBox: {
    width: 10,
    height: 10,
    marginRight: 4,
    borderRadius: 2,
  },
  summaryText: {
    fontSize: 11,
    fontWeight: '500',
  },
  instructionsContainer: {
    backgroundColor: '#e9f7ef',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  instructionsText: {
    fontSize: 12,
    color: '#2d5016',
    textAlign: 'center',
    fontWeight: '500',
  },
  mapContainer: {
    flex: 1,
    backgroundColor: '#f0f8ff',
    overflow: 'hidden',
  },
  svgContainer: {
    flex: 1,
  },
  svg: {
    backgroundColor: 'transparent',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 10,
    padding: 20,
    maxHeight: '80%',
    width: '90%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
    color: '#264653',
  },
  modalSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 15,
    color: '#666',
  },
  currentVoteText: {
    textAlign: 'center',
    marginBottom: 15,
    padding: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    fontWeight: '500',
  },
  partyList: {
    maxHeight: 350,
  },
  partyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginVertical: 3,
    borderWidth: 2,
    borderRadius: 8,
    backgroundColor: '#fafafa',
  },
  selectedParty: {
    backgroundColor: '#e8f5e8',
  },
  partyColorIndicator: {
    width: 18,
    height: 18,
    borderRadius: 9,
    marginRight: 10,
  },
  partyInfo: {
    flex: 1,
  },
  partyCode: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#264653',
  },
  partyName: {
    fontSize: 11,
    color: '#666',
    marginTop: 1,
  },
  cancelButton: {
    backgroundColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginTop: 15,
  },
  cancelButtonText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
});