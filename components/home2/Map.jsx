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
  Animated,
  FlatList,
  ScrollView
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
  'LJP': { name: 'Lok Janshakti Party', color: '#0066CC' }
};

// Mock data for areas and their constituencies
const AREA_CONSTITUENCIES = {
  "Valmiki Nagar": ["Valmiki Nagar", "Ramnagar (SC)", "Narkatiaganj", "Bagaha", "Lauriya", "Nautan"],
  "Paschim Champaran": ["Nautan", "Chanpatia", "Bettiah", "Raxaul", "Sugauli", "Narkatiya"],
  "Purvi Champaran": ["Harsidhi (SC)", "Govindganj", "Kesaria", "Kalyanpur", "Pipra", "Motihari"],
  "Sheohar": ["Sheohar", "Riga", "Bathnaha (SC)", "Parihar", "Sursand", "Bajpatti"],
  "Sitamarhi": ["Sitamarhi", "Runnisaidpur", "Belsand", "Harlakhi", "Benipatti", "Khajauli"],
  "Madhubani": ["Bisfi", "Madhubani", "Rajnagar (SC)", "Jhanjharpur", "Phulparas", "Laukaha"],
  "Jhanjharpur": ["Jhanjharpur", "Phulparas", "Laukaha", "Nirmali", "Pipra (Supaul)", "Supaul"],
  "Supaul": ["Pipra (Supaul)", "Supaul", "Triveniganj (SC)", "Chhatapur", "Narpatganj", "Raniganj (SC)"],
  "Araria": ["Forbesganj", "Araria", "Jokihat", "Sikti", "Bahadurganj", "Thakurganj"],
  "Kishanganj": ["Kishanganj", "Kochadhaman", "Amour", "Baisi", "Kasba", "Banmankhi (SC)"],
  "Katihar": ["Katihar", "Kadwa", "Balrampur", "Pranpur", "Manihari (ST)", "Barari"],
  "Purnia": ["Kasba", "Banmankhi (SC)", "Rupauli", "Dhamdaha", "Purnia", "Madhepura"],
  "Madhepura": ["Madhepura", "Singheshwar (SC)", "Bihariganj", "Alamnagar"],
  "Darbhanga": ["Kusheshwar Asthan (SC)", "Gaura Bauram", "Benipur", "Alinagar", "Darbhanga Rural", "Darbhanga"],
  "Muzaffarpur": ["Gaighat", "Aurai", "Minapur", "Bochahan (SC)", "Sakra (SC)", "Kurhani", "Muzaffarpur"],
  "Vaishali": ["Muzaffarpur (Rural)", "Sahebganj", "Mahua", "Bachhwara", "Phulparas", "Vaishali"],
  "Gopalganj (SC)": ["Gopalganj", "Uchkagaon", "Kuchaikote", "Bhoreyya", "Pachdewa", "Harsidhi"],
  "Siwan": ["Siwan", "Goriakothi", "Gopalganj Rural", "Zira", "Khirhari", "Tarwara"],
  "Maharajganj": ["Maharajganj", "Sikta", "Chandwara", "Chakia", "Bansgaon", "Belari"],
  "Saran": ["Saran", "Marhaura", "Amnour", "Pipra", "Chapra", "Dighwara", "Digha"],
  "Hajipur (SC)": ["Hajipur (SC)", "Rajiv Nagar", "Mahnar", "Jandaha", "Laheriasarai", "Samastipur"],
  "Ujiarpur": ["Ujiarpur", "Sarairanjan", "Morwa", "Chehrakala", "Phulwari", "Paliganj"],
  "Samastipur (SC)": ["Samastipur (SC)", "Rosera", "Singhia", "Phulparas", "Bibhutipur", "Motuha"],
  "Begusarai": ["Cheria‑Bariarpur", "Bachhwara", "Teghra", "Matihani", "Sahebpur Kamal", "Begusarai", "Bakhri (SC)"],
  "Khagaria": ["Khagaria", "Beldaur", "Parbatta", "Bihpur"],
  "Bhagalpur": ["Bihpur", "Pirpainti (SC)", "Kahalgaon", "Bhagalpur", "Sultanganj", "Nathnagar"],
  "Banka": ["Amarpur", "Dhauraiya (SC)", "Banka"],
  "Munger": ["Tarapur", "Munger", "Jamalpur", "Suryagarha", "Lakhisarai", "Sheikhpura"],
  "Nalanda": ["Asthawan", "Biharsharif", "Rajgir (SC)", "Islampur", "Hilsa", "Nalanda", "Harnaut"],
  "Patna Sahib": ["Bakhtiarpur", "Digha", "Bankipur", "Kumhrar", "Patna Sahib", "Fatuha"],
  "Pataliputra": ["Danapur", "Maner", "Phulwari (SC)", "Masaurhi (SC)", "Paliganj", "Bikram"],
  "Arrah": ["Sandesh", "Barhara", "Arrah", "Agiaon (SC)", "Tarari", "Jagdishpur", "Shahpur", "Brahampur"],
  "Buxar": ["Buxar", "Dumraon", "Rajpur (SC)", "Ramgarh", "Mohania (SC)", "Bhabua", "Chainpur", "Chenari (SC)", "Sasaram"],
  "Sasaram (SC)": ["Sasaram", "Kargahar", "Dinara", "Nokha", "Dehri", "Karakat"],
  "Karakat": ["Karakat", "Arwal", "Kurtha", "Jehanabad", "Ghosi", "Makhdumpur (SC)", "Goh", "Obra", "Nabinagar", "Kutumba (SC)"],
  "Jehanabad": ["Jehanabad", "Ghosi", "Makhdumpur (SC)", "Goh", "Obra", "Nabinagar", "Kutumba (SC)"],
  "Aurangabad": ["Aurangabad", "Rafiganj", "Gurua", "Sherghati", "Imamganj (SC)", "Barachatti (SC)"],
  "Gaya (SC)": ["Barachatti (SC)", "Bodh Gaya (SC)", "Gaya Town", "Tikari", "Belaganj", "Atri", "Wazirganj"],
  "Nawada": ["Rajauli (SC)", "Hisua", "Nawada", "Gobindpur", "Warsaliganj", "Sikandra (SC)"],
  "Jamui (SC)": ["Jamui", "Jhajha", "Chakai"]
};


export default function BiharVotingMap() {
  const [paths, setPaths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [votes, setVotes] = useState({}); // Store votes for each constituency
  const [lockedVotes, setLockedVotes] = useState({}); // Store locked status for each constituency
  const [selectedArea, setSelectedArea] = useState(null);
  const [selectedConstituency, setSelectedConstituency] = useState(null);
  const [showAreaModal, setShowAreaModal] = useState(false);
  const [showVotingModal, setShowVotingModal] = useState(false);
  const [showLockConfirmModal, setShowLockConfirmModal] = useState(false);
  const [voteCounts, setVoteCounts] = useState({});
  const [coins, setCoins] = useState(0);
  const [sparkles, setSparkles] = useState([]);
  const [pendingLockConstituency, setPendingLockConstituency] = useState(null);

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
        const scaleY = (screen.height - 250) / (maxY - minY); // Account for header and summary
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

          // Assign area based on feature properties or index
          const areaNames = Object.keys(AREA_CONSTITUENCIES);
          const assignedArea = feature.properties.district || areaNames[index % areaNames.length];

          return {
            path: pathString,
            name: feature.properties.constituency || `Area ${index + 1}`,
            area: assignedArea,
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

  const handleAreaPress = (areaInfo) => {
    // Only handle press if not zooming/panning
    if (!isZooming.current) {
      setSelectedArea(areaInfo.area);
      setShowAreaModal(true);
    }
  };

  const handleConstituencySelect = (constituency) => {
    // Check if this constituency's vote is locked
    if (lockedVotes[constituency]) {
      Alert.alert(
        '🔒 Vote Locked',
        `Your vote for ${constituency} is already locked and cannot be changed.`,
        [{ text: 'OK' }]
      );
      setShowAreaModal(false);
      return;
    }

    setSelectedConstituency(constituency);
    setShowAreaModal(false);
    setShowVotingModal(true);
  };

  // Create sparkle effect
  const createSparkles = () => {
    const newSparkles = [];
    for (let i = 0; i < 12; i++) {
      const sparkle = {
        id: Math.random(),
        x: Math.random() * screen.width,
        y: Math.random() * (screen.height * 0.6) + 100,
        scale: new Animated.Value(0),
        opacity: new Animated.Value(1),
        rotation: new Animated.Value(0),
      };
      newSparkles.push(sparkle);
    }
    setSparkles(newSparkles);

    // Animate sparkles
    newSparkles.forEach((sparkle, index) => {
      Animated.parallel([
        Animated.sequence([
          Animated.timing(sparkle.scale, {
            toValue: 1,
            duration: 300,
            delay: index * 50,
            useNativeDriver: true,
          }),
          Animated.timing(sparkle.scale, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(sparkle.opacity, {
          toValue: 0,
          duration: 800,
          delay: index * 50,
          useNativeDriver: true,
        }),
        Animated.timing(sparkle.rotation, {
          toValue: 360,
          duration: 800,
          delay: index * 50,
          useNativeDriver: true,
        }),
      ]).start();
    });

    // Clear sparkles after animation
    setTimeout(() => {
      setSparkles([]);
    }, 1500);
  };

  // Generate table data for export
  const generateTableData = () => {
    const sortedVotes = Object.entries(votes).sort(([a], [b]) => a.localeCompare(b));
    
    // Create formatted table string
    let tableData = "BIHAR ELECTION VOTING DATA\n";
    tableData += "=" + "=".repeat(70) + "\n\n";
    tableData += "Sr. | Constituency                    | Voted Party                     | Status\n";
    tableData += "----|--------------------------------|---------------------------------|--------\n";
    
    sortedVotes.forEach(([constituency, partyCode], index) => {
      const party = PARTIES[partyCode];
      const sr = String(index + 1).padEnd(3);
      const constName = constituency.padEnd(30);
      const partyInfo = `${partyCode} - ${party.name}`.padEnd(31);
      const status = lockedVotes[constituency] ? 'LOCKED' : 'UNLOCKED';
      
      tableData += `${sr} | ${constName} | ${partyInfo} | ${status}\n`;
    });
    
    tableData += "\n" + "=".repeat(70) + "\n";
    tableData += `Total Constituencies: ${sortedVotes.length}\n`;
    tableData += `Locked Votes: ${Object.keys(lockedVotes).filter(key => lockedVotes[key]).length}\n`;
    tableData += `Total Coins Earned: ${coins}\n`;
    tableData += `Generated: ${new Date().toLocaleString()}\n`;
    
    return tableData;
  };

  const castVote = (partyCode) => {
    if (selectedConstituency) {
      const previousVote = votes[selectedConstituency];
      
      // Update votes
      const newVotes = { ...votes };
      newVotes[selectedConstituency] = partyCode;
      setVotes(newVotes);

      // Update vote counts
      const newCounts = { ...voteCounts };
      if (previousVote) {
        newCounts[previousVote] = Math.max(0, newCounts[previousVote] - 1);
      }
      newCounts[partyCode] = newCounts[partyCode] + 1;
      setVoteCounts(newCounts);

      // Award coins (5 coins for new vote, 3 for changing vote)
      const coinsEarned = previousVote ? 3 : 5;
      setCoins(prev => prev + coinsEarned);

      // Create sparkle effect
      createSparkles();

      setShowVotingModal(false);
      setSelectedConstituency(null);
      setSelectedArea(null);

      Alert.alert(
        '🎉 Vote Cast Successfully!', 
        `Your vote for ${PARTIES[partyCode].name} in ${selectedConstituency} has been recorded.\n\n💰 You earned ${coinsEarned} coins!\n\n🔓 You can lock this vote to make it permanent.`,
        [{ text: 'OK' }]
      );
    }
  };

  const handleLockVote = (constituency) => {
    if (!votes[constituency]) {
      Alert.alert(
        'No Vote Cast',
        'Please cast your vote first before locking it.',
        [{ text: 'OK' }]
      );
      return;
    }

    if (lockedVotes[constituency]) {
      Alert.alert(
        'Already Locked',
        'This vote is already locked and cannot be changed.',
        [{ text: 'OK' }]
      );
      return;
    }

    setPendingLockConstituency(constituency);
    setShowLockConfirmModal(true);
  };

  const confirmLockVote = () => {
    if (pendingLockConstituency) {
      const newLockedVotes = { ...lockedVotes };
      newLockedVotes[pendingLockConstituency] = true;
      setLockedVotes(newLockedVotes);

      // Award bonus coins for locking
      setCoins(prev => prev + 10);

      Alert.alert(
        '🔒 Vote Locked Successfully!',
        `Your vote for ${pendingLockConstituency} is now permanently locked.\n\n💰 You earned 10 bonus coins for locking your vote!`,
        [{ text: 'OK' }]
      );

      setShowLockConfirmModal(false);
      setPendingLockConstituency(null);
    }
  };

  const getAreaColor = (area) => {
    // Get constituencies for this area
    const constituencies = AREA_CONSTITUENCIES[area] || [];
    const votedConstituencies = constituencies.filter(constituency => votes[constituency]);
    const lockedConstituencies = constituencies.filter(constituency => lockedVotes[constituency]);
    
    if (lockedConstituencies.length > 0) {
      return '#FFD700'; // Gold for locked constituencies
    } else if (votedConstituencies.length === 0) {
      return '#FFFFFF'; // White for no votes
    } else if (votedConstituencies.length === constituencies.length) {
      return '#90EE90'; // Light green for all constituencies voted
    } else {
      return '#FFE4B5'; // Light orange for partial voting
    }
  };

  const resetVotes = () => {
    const lockedCount = Object.keys(lockedVotes).filter(key => lockedVotes[key]).length;
    
    if (lockedCount > 0) {
      Alert.alert(
        'Cannot Reset',
        `You have ${lockedCount} locked vote(s) that cannot be reset. Only unlocked votes can be cleared.`,
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Reset Unlocked Only', 
            onPress: () => {
              // Only reset unlocked votes
              const newVotes = {};
              const newCounts = {};
              
              // Keep locked votes
              Object.keys(votes).forEach(constituency => {
                if (lockedVotes[constituency]) {
                  newVotes[constituency] = votes[constituency];
                }
              });
              
              // Recalculate vote counts
              Object.keys(PARTIES).forEach(party => {
                newCounts[party] = 0;
              });
              
              Object.values(newVotes).forEach(partyCode => {
                newCounts[partyCode] = (newCounts[partyCode] || 0) + 1;
              });
              
              setVotes(newVotes);
              setVoteCounts(newCounts);
            }
          }
        ]
      );
    } else {
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
    }
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
        <View style={styles.headerRight}>
          <View style={styles.lockStatsContainer}>
            <Text style={styles.lockStatsText}>
              🔒 {Object.keys(lockedVotes).filter(key => lockedVotes[key]).length} Locked
            </Text>
          </View>
          <View style={styles.coinContainer}>
            <Text style={styles.coinText}>💰 {coins}</Text>
          </View>
        </View>
      </View>

      {/* Vote Summary */}
      <View style={styles.summaryContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.summaryRow}>
            {Object.entries(PARTIES).map(([code, party]) => (
              <View key={code} style={styles.summaryItem}>
                <View style={[styles.colorBox, { backgroundColor: party.color }]} />
                <Text style={styles.summaryText}>{code}: {voteCounts[code] || 0}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Voting History Table - Always Visible with Two Columns */}
      {Object.keys(votes).length > 0 && (
        <View style={styles.votingTableSection}>
          <Text style={styles.tableTitle}>📊 Voting History ({Object.keys(votes).length} votes)</Text>
          <ScrollView style={styles.tableScrollContainer}>
            <View style={styles.tableContainer}>
              {/* Table Header */}
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderText, styles.constituencyColumnWide]}>Constituency</Text>
                <Text style={[styles.tableHeaderText, styles.votedPartyColumn]}>Voted Party</Text>
                <Text style={[styles.tableHeaderText, styles.actionColumn]}>Action</Text>
              </View>
              
              {/* Table Rows */}
              <ScrollView style={styles.tableBodyContainer}>
                {Object.entries(votes)
                  .sort(([a], [b]) => a.localeCompare(b))
                  .map(([constituency, partyCode], index) => {
                    const party = PARTIES[partyCode];
                    const isLocked = lockedVotes[constituency];
                    return (
                      <View 
                        key={constituency} 
                        style={[
                          styles.tableRow,
                          index % 2 === 0 ? styles.evenRow : styles.oddRow,
                          isLocked && styles.lockedRow
                        ]}
                      >
                        <Text style={[styles.tableCellText, styles.constituencyColumnWide]}>
                          {constituency}
                        </Text>
                        <View style={[styles.tableCell, styles.votedPartyColumn]}>
                          <View style={styles.partyDisplayContainer}>
                            <View 
                              style={[
                                styles.partyColorDot, 
                                { backgroundColor: party.color }
                              ]} 
                            />
                            <View style={styles.partyTextContainer}>
                              <Text style={styles.partyCodeText}>{partyCode}</Text>
                              <Text style={styles.partyNameText}>{party.name}</Text>
                            </View>
                          </View>
                        </View>
                        <View style={[styles.tableCell, styles.actionColumn]}>
                          {isLocked ? (
                            <View style={styles.lockedIndicator}>
                              <Text style={styles.lockedText}>🔒</Text>
                            </View>
                          ) : (
                            <TouchableOpacity
                              style={styles.lockButton}
                              onPress={() => handleLockVote(constituency)}
                            >
                              <Text style={styles.lockButtonText}>🔓 Lock</Text>
                            </TouchableOpacity>
                          )}
                        </View>
                      </View>
                    );
                  })
                }
              </ScrollView>
            </View>
          </ScrollView>
        </View>
      )}

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
                  fill={getAreaColor(item.area)}
                  stroke="#264653"
                  strokeWidth={0.5}
                  onPress={() => handleAreaPress(item)}
                />
              ))}
            </G>
          </Svg>
        </Animated.View>

        {/* Sparkle Effects */}
        {sparkles.map((sparkle) => (
          <Animated.View
            key={sparkle.id}
            style={[
              styles.sparkle,
              {
                left: sparkle.x,
                top: sparkle.y,
                transform: [
                  { scale: sparkle.scale },
                  { 
                    rotate: sparkle.rotation.interpolate({
                      inputRange: [0, 360],
                      outputRange: ['0deg', '360deg'],
                    })
                  }
                ],
                opacity: sparkle.opacity,
              },
            ]}
          >
            <Text style={styles.sparkleText}>✨</Text>
          </Animated.View>
        ))}
      </View>

      {/* Area Selection Modal */}
      <Modal
        visible={showAreaModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAreaModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              Select Constituency
            </Text>
            <Text style={styles.modalSubtitle}>
              {selectedArea} Area
            </Text>

            <FlatList
              data={AREA_CONSTITUENCIES[selectedArea] || []}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.constituencyButton,
                    votes[item] && styles.votedConstituency,
                    lockedVotes[item] && styles.lockedConstituencyButton
                  ]}
                  onPress={() => handleConstituencySelect(item)}
                >
                  <View style={styles.constituencyRow}>
                    <Text style={styles.constituencyName}>{item}</Text>
                    {lockedVotes[item] && (
                      <Text style={styles.lockIcon}>🔒</Text>
                    )}
                  </View>
                  {votes[item] && (
                    <View style={styles.votedIndicator}>
                      <Text style={styles.votedText}>
                        ✓ {PARTIES[votes[item]].name}
                        {lockedVotes[item] && ' (LOCKED)'}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              )}
              style={styles.constituencyList}
            />

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowAreaModal(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
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
              {selectedConstituency}
            </Text>
            
            {votes[selectedConstituency] && (
              <Text style={styles.currentVoteText}>
                Current Vote: {PARTIES[votes[selectedConstituency]].name}
              </Text>
            )}

            <View style={styles.coinRewardText}>
              <Text style={styles.rewardText}>
                💰 Earn {votes[selectedConstituency] ? '3' : '5'} coins for voting!
              </Text>
              <Text style={styles.rewardSubText}>
                🔒 Lock your vote later to earn 10 bonus coins!
              </Text>
            </View>

            <ScrollView style={styles.partyList}>
              {Object.entries(PARTIES).map(([code, party]) => (
                <TouchableOpacity
                  key={code}
                  style={[
                    styles.partyButton,
                    { borderColor: party.color },
                    votes[selectedConstituency] === code && styles.selectedParty
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
            </ScrollView>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowVotingModal(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Lock Confirmation Modal */}
      <Modal
        visible={showLockConfirmModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowLockConfirmModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.confirmModalContainer}>
            <Text style={styles.confirmTitle}>🔒 Lock Vote</Text>
            <Text style={styles.confirmMessage}>
              Are you sure you want to lock your vote for {pendingLockConstituency}?
            </Text>
            <Text style={styles.confirmSubMessage}>
              Once locked, you cannot change this vote again. You will earn 10 bonus coins for locking.
            </Text>
            
            <View style={styles.confirmButtons}>
              <TouchableOpacity
                style={styles.cancelConfirmButton}
                onPress={() => {
                  setShowLockConfirmModal(false);
                  setPendingLockConstituency(null);
                }}
              >
                <Text style={styles.cancelConfirmText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.lockConfirmButton}
                onPress={confirmLockVote}
              >
                <Text style={styles.lockConfirmText}>🔒 Lock Vote</Text>
              </TouchableOpacity>
            </View>
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
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  lockStatsContainer: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  lockStatsText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000',
  },
  votingTableSection: {
    backgroundColor: 'white',
    margin: 10,
    borderRadius: 10,
    padding: 15,
    maxHeight: 300,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  tableTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#264653',
    marginBottom: 10,
    textAlign: 'center',
  },
  tableScrollContainer: {
    maxHeight: 250,
  },
  tableBodyContainer: {
    maxHeight: 200,
  },
  coinContainer: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  coinText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  summaryContainer: {
    backgroundColor: 'white',
    paddingVertical: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    paddingHorizontal: 10,
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
  sparkle: {
    position: 'absolute',
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sparkleText: {
    fontSize: 20,
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
  constituencyList: {
    maxHeight: 300,
  },
  constituencyButton: {
    padding: 15,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fafafa',
  },
  votedConstituency: {
    backgroundColor: '#e8f5e8',
    borderColor: '#4CAF50',
  },
  lockedConstituencyButton: {
    backgroundColor: '#fff8dc',
    borderColor: '#FFD700',
    borderWidth: 2,
  },
  constituencyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  constituencyName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#264653',
    flex: 1,
  },
  lockIcon: {
    fontSize: 18,
    marginLeft: 10,
  },
  votedIndicator: {
    marginTop: 5,
  },
  votedText: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '500',
  },
  currentVoteText: {
    textAlign: 'center',
    marginBottom: 10,
    padding: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    fontWeight: '500',
  },
  coinRewardText: {
    backgroundColor: '#FFF8DC',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  rewardText: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#B8860B',
  },
  rewardSubText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#B8860B',
    marginTop: 3,
  },
  partyList: {
    maxHeight: 250,
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
  // Updated table styles for three columns
  tableContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#264653',
    paddingVertical: 12,
  },
  tableHeaderText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingHorizontal: 5,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  evenRow: {
    backgroundColor: '#f8f9fa',
  },
  oddRow: {
    backgroundColor: 'white',
  },
  lockedRow: {
    backgroundColor: '#fff8dc',
  },
  tableCell: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingHorizontal: 5,
  },
  tableCellText: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
  },
  // Three column layout
  constituencyColumnWide: {
    flex: 1.3,
    paddingHorizontal: 8,
  },
  votedPartyColumn: {
    flex: 1.5,
    paddingHorizontal: 5,
  },
  actionColumn: {
    flex: 0.8,
    paddingHorizontal: 5,
  },
  // Party display in table
  partyDisplayContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  partyColorDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginRight: 6,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  partyTextContainer: {
    flex: 1,
  },
  partyCodeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#264653',
  },
  partyNameText: {
    fontSize: 10,
    color: '#666',
    marginTop: 1,
  },
  // Lock button and indicator
  lockButton: {
    backgroundColor: '#2a9d8f',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    minWidth: 50,
  },
  lockButtonText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  lockedIndicator: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 50,
  },
  lockedText: {
    fontSize: 16,
  },
  // Lock confirmation modal
  confirmModalContainer: {
    backgroundColor: 'white',
    margin: 30,
    borderRadius: 15,
    padding: 25,
    width: '85%',
    alignItems: 'center',
  },
  confirmTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#264653',
    marginBottom: 15,
    textAlign: 'center',
  },
  confirmMessage: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
    lineHeight: 22,
  },
  confirmSubMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 20,
  },
  confirmButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  cancelConfirmButton: {
    backgroundColor: '#ccc',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 100,
  },
  cancelConfirmText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  lockConfirmButton: {
    backgroundColor: '#e76f51',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 100,
  },
  lockConfirmText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});