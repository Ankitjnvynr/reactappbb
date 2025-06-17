import React, { useState, useRef } from 'react';
import {
  Dimensions,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  StatusBar,
  ImageBackground,
  PanResponder
} from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Bihar districts with more accurate coordinates
const biharDistricts = [
  { id: 'Patna', x: '45%', y: '60%', name: 'Patna' },
  { id: 'Gaya', x: '40%', y: '75%', name: 'Gaya' },
  { id: 'Nalanda', x: '42%', y: '65%', name: 'Nalanda' },
  { id: 'Nawada', x: '48%', y: '70%', name: 'Nawada' },
  { id: 'Sheikhpura', x: '50%', y: '62%', name: 'Sheikhpura' },
  { id: 'Lakhisarai', x: '55%', y: '63%', name: 'Lakhisarai' },
  { id: 'Jehanabad', x: '43%', y: '67%', name: 'Jehanabad' },
  { id: 'Arwal', x: '38%', y: '65%', name: 'Arwal' },
  { id: 'Aurangabad', x: '35%', y: '72%', name: 'Aurangabad' },
  { id: 'Rohtas', x: '30%', y: '68%', name: 'Rohtas' },
  { id: 'Kaimur', x: '25%', y: '65%', name: 'Kaimur' },
  { id: 'Buxar', x: '20%', y: '62%', name: 'Buxar' },
  { id: 'Bhojpur', x: '30%', y: '60%', name: 'Bhojpur' },
  { id: 'Saran', x: '32%', y: '50%', name: 'Saran' },
  { id: 'Siwan', x: '28%', y: '45%', name: 'Siwan' },
  { id: 'Gopalganj', x: '25%', y: '40%', name: 'Gopalganj' },
  { id: 'Vaishali', x: '40%', y: '55%', name: 'Vaishali' },
  { id: 'Muzaffarpur', x: '42%', y: '48%', name: 'Muzaffarpur' },
  { id: 'Sitamarhi', x: '45%', y: '38%', name: 'Sitamarhi' },
  { id: 'Sheohar', x: '43%', y: '42%', name: 'Sheohar' },
  { id: 'Darbhanga', x: '50%', y: '43%', name: 'Darbhanga' },
  { id: 'Madhubani', x: '55%', y: '35%', name: 'Madhubani' },
  { id: 'Samastipur', x: '50%', y: '50%', name: 'Samastipur' },
  { id: 'Begusarai', x: '55%', y: '55%', name: 'Begusarai' },
  { id: 'Khagaria', x: '60%', y: '60%', name: 'Khagaria' },
  { id: 'Saharsa', x: '65%', y: '52%', name: 'Saharsa' },
  { id: 'Supaul', x: '68%', y: '43%', name: 'Supaul' },
  { id: 'Madhepura', x: '65%', y: '48%', name: 'Madhepura' },
  { id: 'Araria', x: '72%', y: '38%', name: 'Araria' },
  { id: 'Kishanganj', x: '78%', y: '33%', name: 'Kishanganj' },
  { id: 'Purnia', x: '72%', y: '48%', name: 'Purnia' },
  { id: 'Katihar', x: '75%', y: '52%', name: 'Katihar' },
  { id: 'Bhagalpur', x: '65%', y: '65%', name: 'Bhagalpur' },
  { id: 'Banka', x: '60%', y: '70%', name: 'Banka' },
  { id: 'Munger', x: '57%', y: '65%', name: 'Munger' },
  { id: 'Jamui', x: '52%', y: '72%', name: 'Jamui' },
  { id: 'West Champaran', x: '20%', y: '32%', name: 'West Champaran' },
  { id: 'East Champaran', x: '25%', y: '35%', name: 'East Champaran' }
];

const politicalParties = [
  { name: 'Bharatiya Janata Party (BJP)', color: '#FF6B35', symbol: '🏺' },
  { name: 'Rashtriya Janata Dal (RJD)', color: '#00A550', symbol: '🏮' },
  { name: 'Janata Dal (United)', color: '#138808', symbol: '🏹' },
  { name: 'Indian National Congress', color: '#19AAED', symbol: '✋' },
  { name: 'Communist Party of India', color: '#FF0000', symbol: '🌾' },
  { name: 'Lok Janshakti Party', color: '#87CEEB', symbol: '🏠' }
];

const App = () => {
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [votes, setVotes] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  
  const scrollViewRef = useRef(null);
  const verticalScrollViewRef = useRef(null);

  const getDistrictColor = (districtId) => {
    const vote = votes[districtId];
    if (!vote) return 'rgba(240, 229, 216, 0.8)';
    const party = politicalParties.find(p => p.name === vote);
    return party ? party.color + 'DD' : 'rgba(240, 229, 216, 0.8)';
  };

  const handleDistrictPress = (district) => {
    setSelectedDistrict(district.id);
    setModalVisible(true);
  };

  const handleVote = (party) => {
    setVotes(prev => ({
      ...prev,
      [selectedDistrict]: party.name
    }));
    
    Alert.alert(
      'Vote Successfully Cast!', 
      `You voted for ${party.name} in ${selectedDistrict} district.`,
      [
        {
          text: 'OK',
          onPress: () => setModalVisible(false)
        }
      ]
    );
  };

  const getVoteCount = (partyName) => {
    return Object.values(votes).filter(vote => vote === partyName).length;
  };

  const getTotalVotes = () => {
    return Object.keys(votes).length;
  };

  const resetVotes = () => {
    Alert.alert(
      'Reset All Votes',
      'Are you sure you want to reset all votes?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reset', 
          style: 'destructive',
          onPress: () => setVotes({})
        }
      ]
    );
  };

  const handleZoomIn = () => {
    const newZoom = Math.min(zoomLevel + 0.5, 3);
    setZoomLevel(newZoom);
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(zoomLevel - 0.5, 1);
    setZoomLevel(newZoom);
    if (newZoom === 1) {
      setPanOffset({ x: 0, y: 0 });
    }
  };

  const resetZoom = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  // Get dynamic sizes based on zoom level
  const getMarkerSize = () => {
    const baseSize = Math.max(60 * zoomLevel, 40);
    const maxSize = 120;
    return Math.min(baseSize, maxSize);
  };

  const getTextSize = () => {
    const baseSize = Math.max(8 * zoomLevel, 6);
    const maxSize = 14;
    return Math.min(baseSize, maxSize);
  };

  const renderDistrictMarkers = () => {
    const markerSize = getMarkerSize();
    const textSize = getTextSize();
    
    return biharDistricts.map((district) => (
      <TouchableOpacity
        key={district.id}
        style={[
          styles.districtMarker,
          {
            left: district.x,
            top: district.y,
            backgroundColor: getDistrictColor(district.id),
            minWidth: markerSize,
            minHeight: markerSize * 0.6,
            transform: [{ translateX: -markerSize/2 }, { translateY: -markerSize*0.3 }],
          }
        ]}
        onPress={() => handleDistrictPress(district)}
        activeOpacity={0.7}
      >
        <Text style={[styles.districtText, { fontSize: textSize }]}>
          {district.name.length > (zoomLevel > 2 ? 12 : 8) 
            ? district.name.substring(0, zoomLevel > 2 ? 12 : 8) + '...' 
            : district.name}
        </Text>
        {votes[district.id] && (
          <View style={styles.voteIndicator}>
            <Text style={[styles.voteIndicatorText, { fontSize: textSize - 2 }]}>✓</Text>
          </View>
        )}
      </TouchableOpacity>
    ));
  };

  const mapWidth = 520 * zoomLevel;
  const mapHeight = 450 * zoomLevel;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bihar Election Map</Text>
        <Text style={styles.headerSubtitle}>
          Tap on any district to cast your vote • Zoom: {zoomLevel.toFixed(1)}x
        </Text>
      </View>

      {/* Control Buttons */}
      <View style={styles.controlButtons}>
        <TouchableOpacity 
          style={[styles.controlButton, { backgroundColor: '#3498db' }]}
          onPress={() => setShowResults(!showResults)}
        >
          <Text style={styles.controlButtonText}>
            {showResults ? 'Hide Results' : 'Show Results'}
          </Text>
        </TouchableOpacity>
        
      </View>

      {/* Zoom Controls */}
      <View style={styles.zoomControls}>
        {/* <TouchableOpacity 
          style={[styles.zoomButton, { backgroundColor: '#27ae60' }]}
          onPress={handleZoomIn}
          disabled={zoomLevel >= 3}
        >
          <Text style={styles.zoomButtonText}>Zoom +</Text>
        </TouchableOpacity> */}
        
        {/* <TouchableOpacity 
          style={[styles.zoomButton, { backgroundColor: '#f39c12' }]}
          onPress={resetZoom}
        >
          <Text style={styles.zoomButtonText}>Reset</Text>
        </TouchableOpacity> */}
        
        {/* <TouchableOpacity 
          style={[styles.zoomButton, { backgroundColor: '#e67e22' }]}
          onPress={handleZoomOut}
          disabled={zoomLevel <= 1}
        >
          <Text style={styles.zoomButtonText}>Zoom -</Text>
        </TouchableOpacity> */}
      </View>

      {/* Vote Count */}
      <View style={styles.voteCounter}>
        <Text style={styles.voteCountText}>
          Total Districts Voted: {getTotalVotes()}/{biharDistricts.length}
        </Text>
      </View>

      {/* Map Container */}
      <ScrollView 
        ref={scrollViewRef}
        horizontal 
        showsHorizontalScrollIndicator={true}
        showsVerticalScrollIndicator={false}
        style={styles.mapContainer}
        contentContainerStyle={styles.mapContentContainer}
        maximumZoomScale={1}
        minimumZoomScale={1}
        bounces={false}
      >
        <ScrollView 
          ref={verticalScrollViewRef}
          showsVerticalScrollIndicator={true}
          showsHorizontalScrollIndicator={false}
          style={styles.mapVerticalScroll}
          contentContainerStyle={styles.mapVerticalContentContainer}
          bounces={false}
        >
          <View style={[styles.mapWrapper, { 
            width: mapWidth + 100, 
            height: mapHeight + 100,
            alignItems: 'center',
            justifyContent: 'center'
          }]}>
            <ImageBackground
  source={require('@/assets/images/bb.png')}
  style={[styles.mapImage, { 
    width: mapWidth, 
    height: mapHeight 
  }]}
  resizeMode="contain"
            >
              {/* District Markers Overlay */}
              {renderDistrictMarkers()}
            </ImageBackground>
          </View>
        </ScrollView>
      </ScrollView>

      {/* Results Panel */}
      {showResults && (
        <View style={styles.resultsPanel}>
          <Text style={styles.resultsPanelTitle}>Live Results</Text>
          <ScrollView style={styles.resultsScroll}>
            {politicalParties.map((party) => (
              <View key={party.name} style={styles.resultItem}>
                <View style={styles.resultPartyInfo}>
                  <View style={[styles.colorBox, { backgroundColor: party.color }]} />
                  <Text style={styles.resultPartyName}>{party.symbol} {party.name}</Text>
                </View>
                <Text style={styles.resultVoteCount}>{getVoteCount(party.name)} votes</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Voting Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedDistrict} District</Text>
            
            {votes[selectedDistrict] && (
              <View style={styles.currentVoteIndicator}>
                <Text style={styles.currentVoteText}>
                  Current Vote: {votes[selectedDistrict]}
                </Text>
              </View>
            )}
            
            <Text style={styles.modalSubtitle}>Select a Political Party:</Text>
            
            <ScrollView style={styles.partyList}>
              {politicalParties.map((party) => (
                <TouchableOpacity
                  key={party.name}
                  style={[styles.partyButton, { backgroundColor: party.color }]}
                  onPress={() => handleVote(party)}
                >
                  <Text style={styles.partyButtonText}>
                    {party.symbol} {party.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#2c3e50',
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#bdc3c7',
    textAlign: 'center',
  },
  controlButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#ecf0f1',
  },
  controlButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    flex: 0.4,
    alignItems: 'center',
  },
  controlButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  zoomControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
    backgroundColor: '#d5dbdb',
  },
  zoomButton: {
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 15,
    flex: 0.28,
    alignItems: 'center',
  },
  zoomButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },
  voteCounter: {
    backgroundColor: '#34495e',
    paddingVertical: 8,
    alignItems: 'center',
  },
  voteCountText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  mapContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  mapContentContainer: {
    flexGrow: 1,
  },
  mapVerticalScroll: {
    flex: 1,
  },
  mapVerticalContentContainer: {
    flexGrow: 1,
  },
  mapWrapper: {
    position: 'relative',
    padding: 20,
  },
  mapImage: {
    position: 'relative',
  },
  districtMarker: {
    position: 'absolute',
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#2c3e50',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    paddingVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 5,
  },
  districtText: {
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    lineHeight: 10,
  },
  voteIndicator: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#27ae60',
    borderRadius: 10,
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  voteIndicatorText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  resultsPanel: {
    backgroundColor: '#2c3e50',
    maxHeight: screenHeight * 0.25,
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  resultsPanelTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  resultsScroll: {
    maxHeight: screenHeight * 0.2,
  },
  resultItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#34495e',
  },
  resultPartyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  colorBox: {
    width: 20,
    height: 20,
    marginRight: 10,
    borderRadius: 3,
  },
  resultPartyName: {
    color: '#fff',
    fontSize: 14,
    flex: 1,
  },
  resultVoteCount: {
    color: '#bdc3c7',
    fontSize: 14,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    width: screenWidth - 40,
    maxHeight: screenHeight * 0.8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#2c3e50',
  },
  currentVoteIndicator: {
    backgroundColor: '#e8f5e8',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#27ae60',
  },
  currentVoteText: {
    color: '#27ae60',
    fontWeight: '600',
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 16,
    marginBottom: 15,
    color: '#34495e',
    textAlign: 'center',
  },
  partyList: {
    maxHeight: screenHeight * 0.4,
  },
  partyButton: {
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginVertical: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  partyButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'center',
  },
  cancelButton: {
    backgroundColor: '#95a5a6',
    borderRadius: 10,
    paddingVertical: 12,
    marginTop: 15,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default App;