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
  Animated,
  ScrollView,
  BackHandler,
  PanResponder
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

// Mock data for assembly constituencies within districts
const DISTRICT_ASSEMBLIES = {
  'Patna': {
    assemblies: [
      { name: 'Patna Sahib', id: 'PS001', voters: 245000 },
      { name: 'Patliputra', id: 'PP002', voters: 198000 },
      { name: 'Bankipore', id: 'BK003', voters: 167000 },
      { name: 'Kumhrar', id: 'KH004', voters: 203000 },
      { name: 'Patna Women', id: 'PW005', voters: 189000 },
      { name: 'Danapur', id: 'DP006', voters: 221000 },
      { name: 'Maner', id: 'MN007', voters: 178000 },
      { name: 'Phulwari', id: 'PH008', voters: 156000 }
    ]
  },
  'Gaya': {
    assemblies: [
      { name: 'Gaya Town', id: 'GT001', voters: 187000 },
      { name: 'Belaganj', id: 'BL002', voters: 165000 },
      { name: 'Bodh Gaya', id: 'BG003', voters: 198000 },
      { name: 'Tikari', id: 'TK004', voters: 142000 },
      { name: 'Tan Kuppa', id: 'TU005', voters: 134000 },
      { name: 'Atri', id: 'AT006', voters: 156000 }
    ]
  },
  'Muzaffarpur': {
    assemblies: [
      { name: 'Muzaffarpur', id: 'MZ001', voters: 234000 },
      { name: 'Aurai', id: 'AR002', voters: 167000 },
      { name: 'Minapur', id: 'MP003', voters: 145000 },
      { name: 'Bochahan', id: 'BC004', voters: 178000 },
      { name: 'Sakra', id: 'SK005', voters: 134000 }
    ]
  },
  'Bhagalpur': {
    assemblies: [
      { name: 'Bhagalpur', id: 'BH001', voters: 201000 },
      { name: 'Sultanganj', id: 'SG002', voters: 123000 },
      { name: 'Nathnagar', id: 'NN003', voters: 167000 },
      { name: 'Gopalpur', id: 'GP004', voters: 145000 }
    ]
  },
  'Darbhanga': {
    assemblies: [
      { name: 'Darbhanga Rural', id: 'DR001', voters: 189000 },
      { name: 'Darbhanga', id: 'DB002', voters: 223000 },
      { name: 'Kusheshwar Asthan', id: 'KA003', voters: 156000 },
      { name: 'Ghanshyampur', id: 'GS004', voters: 134000 },
      { name: 'Baheri', id: 'BH005', voters: 178000 }
    ]
  }
};

// Animated coin component
const AnimatedCoin = ({ x, y, delay }) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const rotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animate = () => {
      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(rotate, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(translateY, {
            toValue: -150,
            duration: 1200,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0,
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    };

    animate();
  }, [delay, opacity, scale, rotate, translateY]);

  const rotateInterpolate = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View
      style={[
        styles.coin,
        {
          left: x,
          top: y,
          opacity,
          transform: [
            { scale },
            { translateY },
            { rotate: rotateInterpolate }
          ],
        },
      ]}
    >
      <Text style={styles.coinText}>🪙</Text>
    </Animated.View>
  );
};

export default function BiharVotingMap() {
  const [paths, setPaths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [votes, setVotes] = useState({});
  const [selectedConstituency, setSelectedConstituency] = useState(null);
  const [showVotingModal, setShowVotingModal] = useState(false);
  const [showDistrictModal, setShowDistrictModal] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [voteCounts, setVoteCounts] = useState({});
  const [assemblyVotes, setAssemblyVotes] = useState({});
  const [coins, setCoins] = useState(0);
  const [animatedCoins, setAnimatedCoins] = useState([]);

  // Gesture and zoom state
  const scale = useRef(new Animated.Value(1)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  
  const [lastScale, setLastScale] = useState(1);
  const [lastOffset, setLastOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [isPinching, setIsPinching] = useState(false);

  // Coin wallet animation
  const coinWalletScale = useRef(new Animated.Value(1)).current;

  // Constants for gesture detection
  const MIN_SCALE = 0.5;
  const MAX_SCALE = 4;

  // Pan responder for handling touch gestures
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (evt) => {
        return evt.nativeEvent.touches.length <= 2;
      },
      onPanResponderGrant: () => {
        setIsPanning(true);
      },
      onPanResponderMove: (evt) => {
        const touches = evt.nativeEvent.touches;
        
        if (touches.length === 2) {
          setIsPinching(true);
          const touch1 = touches[0];
          const touch2 = touches[1];
          
          const distance = Math.sqrt(
            Math.pow(touch2.pageX - touch1.pageX, 2) +
            Math.pow(touch2.pageY - touch1.pageY, 2)
          );
          
          if (!lastScale) {
            setLastScale(distance);
            return;
          }
          
          const newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, (distance / lastScale) * scale._value));
          
          scale.setValue(newScale);
        } else if (touches.length === 1 && !isPinching) {
          const { dx, dy } = evt.nativeEvent;
          
          translateX.setValue(lastOffset.x + dx);
          translateY.setValue(lastOffset.y + dy);
        }
      },
      onPanResponderRelease: (evt) => {
        setIsPanning(false);
        setIsPinching(false);
        
        setLastScale(scale._value);
        setLastOffset({
          x: translateX._value,
          y: translateY._value
        });
        
        const touches = evt.nativeEvent.touches;
        if (touches.length === 0 && !isPanning && !isPinching) {
          handleMapTap(evt.nativeEvent);
        }
      },
    })
  ).current;

  const handleMapTap = (event) => {
    const { locationX, locationY } = event;
    
    if (paths.length > 0) {
      const tappedIndex = Math.floor(Math.random() * paths.length);
      const tappedConstituency = paths[tappedIndex];
      handleConstituencyPress(tappedConstituency);
    }
  };

  useEffect(() => {
    const convertGeoJSONToPaths = async () => {
      try {
        const features = biharGeoJSON.features;

        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

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
        const scaleY = (screen.height - 200) / (maxY - minY);
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
            name: feature.properties.constituency || feature.properties.district || `Area ${index + 1}`,
            id: index,
            type: 'district',
          };
        });

        setPaths(pathData);
        
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

  useEffect(() => {
    const backAction = () => {
      if (showDistrictModal) {
        setShowDistrictModal(false);
        setSelectedDistrict(null);
        return true;
      }
      if (showVotingModal) {
        setShowVotingModal(false);
        setSelectedConstituency(null);
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [showDistrictModal, showVotingModal]);

  const createCoinAnimation = () => {
    const newCoins = [];
    for (let i = 0; i < 8; i++) {
      newCoins.push({
        id: Date.now() + i,
        x: Math.random() * screen.width,
        y: Math.random() * (screen.height * 0.7),
        delay: i * 150,
      });
    }
    setAnimatedCoins(newCoins);

    setTimeout(() => {
      setAnimatedCoins([]);
    }, 2500);
  };

  const animateCoinWallet = () => {
    Animated.sequence([
      Animated.timing(coinWalletScale, {
        toValue: 1.4,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(coinWalletScale, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleConstituencyPress = (constituency) => {
    console.log('District clicked:', constituency.name);
    
    const districtData = DISTRICT_ASSEMBLIES[constituency.name];
    
    if (districtData) {
      setSelectedDistrict({
        ...constituency,
        assemblies: districtData.assemblies
      });
      setShowDistrictModal(true);
    } else {
      setSelectedConstituency(constituency);
      setShowVotingModal(true);
    }
  };

  const handleAssemblyPress = (assembly) => {
    setSelectedConstituency({
      ...assembly,
      parentDistrict: selectedDistrict.name,
      type: 'assembly'
    });
    setShowDistrictModal(false);
    setShowVotingModal(true);
  };

  const castVote = (partyCode) => {
    if (selectedConstituency) {
      const voteKey = selectedConstituency.type === 'assembly' 
        ? `assembly_${selectedConstituency.id}` 
        : `district_${selectedConstituency.id}`;
      
      const previousVote = selectedConstituency.type === 'assembly' 
        ? assemblyVotes[voteKey] 
        : votes[selectedConstituency.id];
      
      if (selectedConstituency.type === 'assembly') {
        const newAssemblyVotes = { ...assemblyVotes };
        newAssemblyVotes[voteKey] = partyCode;
        setAssemblyVotes(newAssemblyVotes);
      } else {
        const newVotes = { ...votes };
        newVotes[selectedConstituency.id] = partyCode;
        setVotes(newVotes);
      }

      const newCounts = { ...voteCounts };
      if (previousVote) {
        newCounts[previousVote] = Math.max(0, newCounts[previousVote] - 1);
      }
      newCounts[partyCode] = newCounts[partyCode] + 1;
      setVoteCounts(newCounts);

      const coinReward = previousVote ? 5 : (selectedConstituency.type === 'assembly' ? 15 : 10);
      setCoins(prev => prev + coinReward);

      animateCoinWallet();
      createCoinAnimation();

      setShowVotingModal(false);
      setSelectedConstituency(null);

      const constituencyType = selectedConstituency.type === 'assembly' ? 'Assembly' : 'District';
      const constituencyName = selectedConstituency.type === 'assembly' 
        ? `${selectedConstituency.name} (${selectedConstituency.parentDistrict})`
        : selectedConstituency.name;

      Alert.alert(
        'Vote Cast Successfully!', 
        `Your vote for ${PARTIES[partyCode].name} in ${constituencyName} ${constituencyType} has been recorded.\n\n🪙 +${coinReward} coins earned!`,
        [{ text: 'Awesome!' }]
      );
    }
  };

  const getConstituencyColor = (constituencyId) => {
    const votedParty = votes[constituencyId];
    if (votedParty) {
      return PARTIES[votedParty].color;
    }
    return '#FFFFFF';
  };

  const getAssemblyColor = (assemblyId) => {
    const voteKey = `assembly_${assemblyId}`;
    const votedParty = assemblyVotes[voteKey];
    if (votedParty) {
      return PARTIES[votedParty].color;
    }
    return '#FFFFFF';
  };

  const resetVotes = () => {
    Alert.alert(
      'Reset All Votes',
      'Are you sure you want to reset all votes? This will also reset your coins.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reset', 
          style: 'destructive',
          onPress: () => {
            setVotes({});
            setAssemblyVotes({});
            setCoins(0);
            const initialCounts = {};
            Object.keys(PARTIES).forEach(party => {
              initialCounts[party] = 0;
            });
            setVoteCounts(initialCounts);
            
            scale.setValue(1);
            translateX.setValue(0);
            translateY.setValue(0);
            setLastScale(1);
            setLastOffset({ x: 0, y: 0 });
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
    
    setLastScale(1);
    setLastOffset({ x: 0, y: 0 });
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
      {/* Header with Coin Wallet */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bihar Election Map</Text>
        <View style={styles.headerButtons}>
          <Animated.View style={[styles.coinWallet, { transform: [{ scale: coinWalletScale }] }]}>
            <Text style={styles.coinText}>🪙 {coins}</Text>
          </Animated.View>
          {/* <TouchableOpacity style={styles.resetButton} onPress={resetVotes}>
            <Text style={styles.resetButtonText}>Reset All</Text>
          </TouchableOpacity> */}
          <TouchableOpacity style={styles.homeButton} onPress={resetZoom}>
            <Text style={styles.homeButtonText}>🏠</Text>
          </TouchableOpacity>
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

      {/* Instructions */}
      <View style={styles.instructionsContainer}>
        <Text style={styles.instructionsText}>
          📍 Tap district to see assemblies • Pinch to zoom • Drag to pan • Vote for bonus coins!
        </Text>
      </View>

      {/* Map with Gesture Handling */}
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

        {/* Coin Animation Overlay */}
        {animatedCoins.map((coin) => (
          <AnimatedCoin
            key={coin.id}
            x={coin.x}
            y={coin.y}
            delay={coin.delay}
          />
        ))}
      </View>

      {/* District Assembly Modal */}
      <Modal
        visible={showDistrictModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowDistrictModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              {selectedDistrict?.name} District
            </Text>
            <Text style={styles.modalSubtitle}>
              Assembly Constituencies ({selectedDistrict?.assemblies?.length || 0})
            </Text>
            
            <View style={styles.districtInfo}>
              <Text style={styles.districtInfoText}>
                💼 Total Assemblies: {selectedDistrict?.assemblies?.length || 0}
              </Text>
              <Text style={styles.districtInfoText}>
                👥 Total Voters: {selectedDistrict?.assemblies?.reduce((sum, assembly) => sum + assembly.voters, 0).toLocaleString()}
              </Text>
            </View>

            <ScrollView style={styles.assemblyList} showsVerticalScrollIndicator={false}>
              {selectedDistrict?.assemblies?.map((assembly) => (
                <TouchableOpacity
                  key={assembly.id}
                  style={[
                    styles.assemblyItem,
                    { backgroundColor: getAssemblyColor(assembly.id) || '#f9f9f9' }
                  ]}
                  onPress={() => handleAssemblyPress(assembly)}
                >
                  <View style={styles.assemblyHeader}>
                    <Text style={styles.assemblyName}>{assembly.name}</Text>
                    <Text style={styles.assemblyCode}>#{assembly.id}</Text>
                  </View>
                  <Text style={styles.assemblyVoters}>
                    👥 {assembly.voters.toLocaleString()} voters
                  </Text>
                  {assemblyVotes[`assembly_${assembly.id}`] && (
                    <View style={styles.voteStatus}>
                      <Text style={styles.voteStatusText}>
                        ✅ Voted: {PARTIES[assemblyVotes[`assembly_${assembly.id}`]].name}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.voteDistrictButton}
                onPress={() => {
                  setSelectedConstituency({
                    ...selectedDistrict,
                    type: 'district'
                  });
                  setShowDistrictModal(false);
                  setShowVotingModal(true);
                }}
              >
                <Text style={styles.voteDistrictButtonText}>Vote for District</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowDistrictModal(false)}
              >
                <Text style={styles.cancelButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

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
              {selectedConstituency?.type === 'assembly' 
                ? `${selectedConstituency?.name} Assembly (${selectedConstituency?.parentDistrict})`
                : `${selectedConstituency?.name} District`
              }
            </Text>
            
            <View style={styles.rewardInfo}>
              <Text style={styles.rewardText}>
                🪙 Earn {
                  (selectedConstituency?.type === 'assembly' ? assemblyVotes[`assembly_${selectedConstituency?.id}`] : votes[selectedConstituency?.id]) 
                    ? '5' 
                    : (selectedConstituency?.type === 'assembly' ? '15' : '10')
                } coins for voting!
              </Text>
            </View>
            
            {selectedConstituency?.voters && (
              <View style={styles.voterInfo}>
                <Text style={styles.voterInfoText}>
                  👥 {selectedConstituency.voters.toLocaleString()} eligible voters
                </Text>
              </View>
            )}
            
            {((selectedConstituency?.type === 'assembly' && assemblyVotes[`assembly_${selectedConstituency?.id}`]) ||
              (selectedConstituency?.type !== 'assembly' && votes[selectedConstituency?.id])) && (
              <Text style={styles.currentVoteText}>
                Current Vote: {PARTIES[
                  selectedConstituency?.type === 'assembly' 
                    ? assemblyVotes[`assembly_${selectedConstituency.id}`]
                    : votes[selectedConstituency.id]
                ].name}
              </Text>
            )}

            <View style={styles.partyList}>
              {Object.entries(PARTIES).map(([code, party]) => (
                <TouchableOpacity
                  key={code}
                  style={[
                    styles.partyButton,
                    { borderColor: party.color },
                    ((selectedConstituency?.type === 'assembly' ? assemblyVotes[`assembly_${selectedConstituency?.id}`] : votes[selectedConstituency?.id]) === code) && styles.selectedParty
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
    alignItems: 'center',
    gap: 10,
  },
  coinWallet: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  coinText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  resetButton: {
    backgroundColor: '#e76f51',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 5,
  },
  resetButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  homeButton: {
    backgroundColor: '#2a9d8f',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 5,
  },
  homeButtonText: {
    fontSize: 14,
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
  coin: {
    position: 'absolute',
    zIndex: 1000,
  },
  coinText: {
    fontSize: 24,
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
  districtInfo: {
    backgroundColor: '#e8f5e8',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  districtInfoText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2d5016',
    marginBottom: 4,
  },
  assemblyList: {
    maxHeight: 300,
    marginBottom: 15,
  },
  assemblyItem: {
    padding: 12,
    marginVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  assemblyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  assemblyName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#264653',
    flex: 1,
  },
  assemblyCode: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  assemblyVoters: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  voteStatus: {
    backgroundColor: '#d4edda',
    padding: 4,
    borderRadius: 4,
    marginTop: 4,
  },
  voteStatusText: {
    fontSize: 11,
    color: '#155724',
    fontWeight: '500',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  voteDistrictButton: {
    flex: 1,
    backgroundColor: '#264653',
    padding: 12,
    borderRadius: 8,
  },
  voteDistrictButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 'bold',
  },
  rewardInfo: {
    backgroundColor: '#FFD700',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    alignItems: 'center',
  },
  rewardText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  voterInfo: {
    backgroundColor: '#e3f2fd',
    padding: 8,
    borderRadius: 6,
    marginBottom: 10,
    alignItems: 'center',
  },
  voterInfoText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1565c0',
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
    flex: 1,
  },
  cancelButtonText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
});