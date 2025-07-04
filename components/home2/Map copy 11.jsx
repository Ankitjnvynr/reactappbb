import { useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Svg, { G, Path } from 'react-native-svg';

// Import your GeoJSON files
import biharAssemblyData from '../../assets/bihar_assembly.json';
import biharDistrictsData from '../../assets/data/bihar.json';

const BiharVotingMap = () => {
  const [currentView, setCurrentView] = useState('districts'); // 'districts' or 'assembly'
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedConstituency, setSelectedConstituency] = useState(null);
  const [geoData, setGeoData] = useState(null);
  const [filteredAssemblyData, setFilteredAssemblyData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showVotingModal, setShowVotingModal] = useState(false);
  const [votingData, setVotingData] = useState({
    constituency: '',
    candidateName: '',
    partyName: '',
    voterName: '',
    voterId: ''
  });
  const [votes, setVotes] = useState([]); // Store all votes
  const [mapDimensions, setMapDimensions] = useState({
    width: 400,
    height: 300,
    viewBox: '0 0 400 300'
  });

  const screenWidth = Dimensions.get('window').width;

  useEffect(() => {
    loadDistrictsData();
  }, []);

  const loadDistrictsData = () => {
    try {
      setGeoData(biharDistrictsData);
      setCurrentView('districts');
      if (biharDistrictsData && biharDistrictsData.features) {
        calculateMapBounds(biharDistrictsData);
      }
    } catch (error) {
      console.error('Error loading districts data:', error);
      Alert.alert('Error', 'Failed to load Bihar districts data.');
    }
  };

  const loadAssemblyData = (districtName) => {
    try {
      setLoading(true);
      
      // Filter assembly constituencies for the selected district
      const filteredFeatures = biharAssemblyData.features.filter(feature => {
        const featureDistrict = feature.properties?.DISTRICT || 
                               feature.properties?.district ||
                               feature.properties?.District;
        return featureDistrict && 
               featureDistrict.toLowerCase().includes(districtName.toLowerCase());
      });

      if (filteredFeatures.length === 0) {
        Alert.alert('No Data', `No assembly constituencies found for ${districtName} district.`);
        setLoading(false);
        return;
      }

      const filteredData = {
        ...biharAssemblyData,
        features: filteredFeatures
      };

      setFilteredAssemblyData(filteredData);
      setGeoData(filteredData);
      setCurrentView('assembly');
      calculateMapBounds(filteredData);
      setLoading(false);
    } catch (error) {
      console.error('Error loading assembly data:', error);
      Alert.alert('Error', 'Failed to load assembly data.');
      setLoading(false);
    }
  };

  const calculateMapBounds = (geoData) => {
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    
    geoData.features.forEach(feature => {
      if (feature.geometry && feature.geometry.coordinates) {
        const coordinates = feature.geometry.coordinates;
        
        const processCoordinates = (coords) => {
          if (Array.isArray(coords) && coords.length > 0) {
            if (Array.isArray(coords[0])) {
              coords.forEach(processCoordinates);
            } else if (coords.length >= 2 && typeof coords[0] === 'number' && typeof coords[1] === 'number') {
              const [x, y] = coords;
              minX = Math.min(minX, x);
              maxX = Math.max(maxX, x);
              minY = Math.min(minY, y);
              maxY = Math.max(maxY, y);
            }
          }
        };
        
        if (feature.geometry.type === 'Polygon') {
          coordinates.forEach(processCoordinates);
        } else if (feature.geometry.type === 'MultiPolygon') {
          coordinates.forEach(polygon => {
            polygon.forEach(processCoordinates);
          });
        }
      }
    });

    if (minX !== Infinity && maxX !== -Infinity && minY !== Infinity && maxY !== -Infinity) {
      const width = maxX - minX;
      const height = maxY - minY;
      const padding = 0.05;
      
      const aspectRatio = width / height;
      let svgWidth = screenWidth - 40;
      let svgHeight = svgWidth / aspectRatio;
      
      if (svgHeight < 250) {
        svgHeight = 250;
        svgWidth = svgHeight * aspectRatio;
      }
      
      setMapDimensions({
        width: svgWidth,
        height: svgHeight,
        viewBox: `${minX - width * padding} ${minY - height * padding} ${width * (1 + 2 * padding)} ${height * (1 + 2 * padding)}`
      });
    }
  };

  const createPathFromCoordinates = (geometry) => {
    if (!geometry || !geometry.coordinates) return '';
    
    let pathData = '';
    const coordinates = geometry.coordinates;
    
    const processRing = (ring) => {
      if (!ring || ring.length === 0) return '';
      
      pathData += `M ${ring[0][0]} ${ring[0][1]} `;
      
      for (let i = 1; i < ring.length; i++) {
        if (ring[i] && ring[i].length >= 2) {
          pathData += `L ${ring[i][0]} ${ring[i][1]} `;
        }
      }
      
      pathData += 'Z ';
    };
    
    try {
      if (geometry.type === 'Polygon') {
        coordinates.forEach(ring => {
          if (Array.isArray(ring)) {
            processRing(ring);
          }
        });
      } else if (geometry.type === 'MultiPolygon') {
        coordinates.forEach(polygon => {
          if (Array.isArray(polygon)) {
            polygon.forEach(ring => {
              if (Array.isArray(ring)) {
                processRing(ring);
              }
            });
          }
        });
      }
    } catch (error) {
      console.error('Error creating path:', error);
      return '';
    }
    
    return pathData;
  };

  const handleDistrictPress = async (feature) => {
    try {
      setLoading(true);
      setSelectedDistrict(null);
      setSelectedConstituency(null);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const properties = feature.properties || {};
      const districtName = properties.NAME || 
                          properties.name || 
                          properties.DISTRICT ||
                          properties.district ||
                          'Unknown District';
      
      setSelectedDistrict({
        name: districtName,
        code: properties.CODE || properties.code || 'N/A',
        ...properties
      });
      
      // Load assembly data for this district
      loadAssemblyData(districtName);
      
    } catch (error) {
      console.error('Error handling district press:', error);
      setLoading(false);
    }
  };

  const handleConstituencyPress = async (feature) => {
    try {
      setLoading(true);
      setSelectedConstituency(null);
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const properties = feature.properties || {};
      const constituencyName = properties.AC_NAME || 
                             properties.name || 
                             properties.NAME ||
                             properties.constituency ||
                             'Unknown Constituency';
      
      setSelectedConstituency({
        name: constituencyName,
        code: properties.AC_NO || properties.code || properties.id || 'N/A',
        district: properties.DISTRICT || properties.district || selectedDistrict?.name || 'N/A',
        ...properties
      });
      
      setLoading(false);
    } catch (error) {
      console.error('Error handling constituency press:', error);
      setLoading(false);
    }
  };

  const handleVote = () => {
    if (!selectedConstituency) {
      Alert.alert('Error', 'Please select a constituency first.');
      return;
    }
    
    setVotingData({
      ...votingData,
      constituency: selectedConstituency.name
    });
    setShowVotingModal(true);
  };

  const submitVote = () => {
    if (!votingData.candidateName || !votingData.partyName || !votingData.voterName || !votingData.voterId) {
      Alert.alert('Error', 'Please fill all required fields.');
      return;
    }
    
    // Check if voter ID already exists
    const existingVote = votes.find(vote => vote.voterId === votingData.voterId);
    if (existingVote) {
      Alert.alert('Error', 'This Voter ID has already been used to vote.');
      return;
    }
    
    const newVote = {
      ...votingData,
      timestamp: new Date().toISOString(),
      id: Date.now().toString()
    };
    
    setVotes([...votes, newVote]);
    setShowVotingModal(false);
    setVotingData({
      constituency: '',
      candidateName: '',
      partyName: '',
      voterName: '',
      voterId: ''
    });
    
    Alert.alert('Success', 'Your vote has been recorded successfully!');
  };

  const goBackToDistricts = () => {
    setCurrentView('districts');
    setSelectedDistrict(null);
    setSelectedConstituency(null);
    setFilteredAssemblyData(null);
    loadDistrictsData();
  };

  const getVoteCount = (constituencyName) => {
    return votes.filter(vote => vote.constituency === constituencyName).length;
  };

  if (!geoData || !geoData.features) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading Bihar Map...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.mapContainer}>
        <Text style={styles.title}>
          {currentView === 'districts' ? 'Bihar Districts' : `${selectedDistrict?.name || 'Assembly'} Constituencies`}
        </Text>
        <Text style={styles.subtitle}>
          {currentView === 'districts' 
            ? `Total Districts: ${geoData.features.length}` 
            : `Total Constituencies: ${geoData.features.length} | Total Votes: ${votes.length}`
          }
        </Text>
        
        {currentView === 'assembly' && (
          <TouchableOpacity style={styles.backButton} onPress={goBackToDistricts}>
            <Text style={styles.backButtonText}>← Back to Districts</Text>
          </TouchableOpacity>
        )}
        
        <ScrollView 
          horizontal={true}
          showsHorizontalScrollIndicator={true}
          showsVerticalScrollIndicator={true}
          style={styles.mapScrollView}
          contentContainerStyle={styles.scrollContent}
          minimumZoomScale={0.5}
          maximumZoomScale={3}
          scrollEnabled={!loading}
        >
          <Svg
            width={mapDimensions.width}
            height={mapDimensions.height}
            viewBox={mapDimensions.viewBox}
            style={styles.svg}
          >
            <G>
              {geoData.features.map((feature, index) => {
                const pathData = createPathFromCoordinates(feature.geometry);
                if (!pathData) return null;
                
                let isSelected = false;
                let fillColor = "#E8F4FD";
                
                if (currentView === 'districts') {
                  isSelected = selectedDistrict && 
                    (feature.properties?.NAME === selectedDistrict.name ||
                     feature.properties?.name === selectedDistrict.name);
                  fillColor = isSelected ? "#FF6B6B" : "#E8F4FD";
                } else {
                  isSelected = selectedConstituency && 
                    (feature.properties?.AC_NAME === selectedConstituency.name ||
                     feature.properties?.name === selectedConstituency.name);
                  
                  // Color constituencies based on vote count
                  const constituencyName = feature.properties?.AC_NAME || feature.properties?.name || '';
                  const voteCount = getVoteCount(constituencyName);
                  
                  if (isSelected) {
                    fillColor = "#FF6B6B";
                  } else if (voteCount > 0) {
                    fillColor = voteCount > 5 ? "#4CAF50" : "#FFC107";
                  } else {
                    fillColor = "#E8F4FD";
                  }
                }
                
                return (
                  <Path
                    key={`feature-${index}`}
                    d={pathData}
                    fill={fillColor}
                    stroke="#2C3E50"
                    strokeWidth="0.005"
                    onPress={() => {
                      if (!loading) {
                        if (currentView === 'districts') {
                          handleDistrictPress(feature);
                        } else {
                          handleConstituencyPress(feature);
                        }
                      }
                    }}
                  />
                );
              })}
            </G>
          </Svg>
        </ScrollView>

        <View style={styles.instructions}>
          <Text style={styles.instructionText}>
            {loading 
              ? 'Loading...' 
              : currentView === 'districts'
                ? 'Tap on any district to view its constituencies'
                : 'Tap on any constituency to select it • Green = High votes • Yellow = Some votes • Blue = No votes'
            }
          </Text>
        </View>

        {loading && (
          <View style={styles.loadingOverlay}>
            <Text style={styles.loadingOverlayText}>Loading...</Text>
          </View>
        )}

        {selectedDistrict && currentView === 'districts' && !loading && (
          <View style={styles.infoPanel}>
            <Text style={styles.infoTitle}>Selected District</Text>
            <Text style={styles.infoText}>Name: {selectedDistrict.name}</Text>
            <Text style={styles.infoText}>Code: {selectedDistrict.code}</Text>
            
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => setSelectedDistrict(null)}
            >
              <Text style={styles.clearButtonText}>Clear Selection</Text>
            </TouchableOpacity>
          </View>
        )}

        {selectedConstituency && currentView === 'assembly' && !loading && (
          <View style={styles.infoPanel}>
            <Text style={styles.infoTitle}>Selected Constituency</Text>
            <Text style={styles.infoText}>Name: {selectedConstituency.name}</Text>
            <Text style={styles.infoText}>Code: {selectedConstituency.code}</Text>
            <Text style={styles.infoText}>District: {selectedConstituency.district}</Text>
            <Text style={styles.infoText}>
              Votes Cast: {getVoteCount(selectedConstituency.name)}
            </Text>
            
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.voteButton} onPress={handleVote}>
                <Text style={styles.voteButtonText}>Cast Vote</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.clearButton}
                onPress={() => setSelectedConstituency(null)}
              >
                <Text style={styles.clearButtonText}>Clear</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Voting Modal */}
        <Modal
          visible={showVotingModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowVotingModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Cast Your Vote</Text>
              <Text style={styles.modalSubtitle}>
                Constituency: {votingData.constituency}
              </Text>
              
              <TextInput
                style={styles.input}
                placeholder="Voter Name *"
                value={votingData.voterName}
                onChangeText={(text) => setVotingData({...votingData, voterName: text})}
              />
              
              <TextInput
                style={styles.input}
                placeholder="Voter ID *"
                value={votingData.voterId}
                onChangeText={(text) => setVotingData({...votingData, voterId: text})}
              />
              
              <TextInput
                style={styles.input}
                placeholder="Candidate Name *"
                value={votingData.candidateName}
                onChangeText={(text) => setVotingData({...votingData, candidateName: text})}
              />
              
              <TextInput
                style={styles.input}
                placeholder="Party Name *"
                value={votingData.partyName}
                onChangeText={(text) => setVotingData({...votingData, partyName: text})}
              />
              
              <View style={styles.modalButtonRow}>
                <TouchableOpacity style={styles.submitButton} onPress={submitVote}>
                  <Text style={styles.submitButtonText}>Submit Vote</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.cancelButton} 
                  onPress={() => setShowVotingModal(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingTop: 20,
    paddingHorizontal: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  loadingText: {
    fontSize: 18,
    color: '#333',
    fontWeight: '500',
    textAlign: 'center',
  },
  mapContainer: {
    paddingTop: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  backButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  mapScrollView: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    maxHeight: 400,
  },
  scrollContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  svg: {
    backgroundColor: '#FFFFFF',
  },
  instructions: {
    marginTop: 15,
    paddingHorizontal: 20,
  },
  instructionText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  infoPanel: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    width: '100%',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
    lineHeight: 22,
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 15,
    gap: 10,
  },
  voteButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  voteButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  clearButton: {
    flex: 1,
    backgroundColor: '#333',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  clearButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  loadingOverlay: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#FFF9C4',
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  loadingOverlayText: {
    fontSize: 16,
    color: '#F57F17',
    fontWeight: '500',
    textAlign: 'center',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 25,
    width: '100%',
    maxWidth: 400,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: '#F9F9F9',
  },
  modalButtonRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  submitButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F44336',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default BiharVotingMap;