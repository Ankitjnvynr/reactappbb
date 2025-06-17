import React, { useState } from 'react';
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
  ImageBackground
} from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Bihar districts with accurate coordinates based on the provided map
const biharDistricts = [
  // Northern Districts
  { id: 'West Champaran', x: '12%', y: '25%', name: 'West Champaran', color: '#90EE90' },
  { id: 'East Champaran', x: '22%', y: '28%', name: 'East Champaran', color: '#90EE90' },
  { id: 'Sitamarhi', x: '35%', y: '20%', name: 'Sitamarhi', color: '#90EE90' },
  { id: 'Sheohar', x: '28%', y: '25%', name: 'Sheohar', color: '#FFFFFF' },
  { id: 'Madhubani', x: '45%', y: '18%', name: 'Madhubani', color: '#DEB887' },
  { id: 'Supaul', x: '58%', y: '22%', name: 'Supaul', color: '#FFB347' },
  { id: 'Araria', x: '68%', y: '25%', name: 'Araria', color: '#FFB347' },
  { id: 'Kishanganj', x: '78%', y: '18%', name: 'Kishanganj', color: '#FFB347' },
  
  // Central-North Districts
  { id: 'Gopalganj', x: '18%', y: '35%', name: 'Gopalganj', color: '#9370DB' },
  { id: 'Siwan', x: '12%', y: '42%', name: 'Siwan', color: '#9370DB' },
  { id: 'Saran', x: '22%', y: '45%', name: 'Saran', color: '#9370DB' },
  { id: 'Muzaffarpur', x: '32%', y: '35%', name: 'Muzaffarpur', color: '#90EE90' },
  { id: 'Vaishali', x: '35%', y: '45%', name: 'Vaishali', color: '#90EE90' },
  { id: 'Darbhanga', x: '42%', y: '32%', name: 'Darbhanga', color: '#DEB887' },
  { id: 'Samastipur', x: '42%', y: '42%', name: 'Samastipur', color: '#DEB887' },
  { id: 'Madhepura', x: '58%', y: '35%', name: 'Madhepura', color: '#87CEEB' },
  { id: 'Saharsa', x: '62%', y: '42%', name: 'Saharsa', color: '#87CEEB' },
  { id: 'Purnia', x: '72%', y: '35%', name: 'Purnia', color: '#FFB347' },
  { id: 'Katihar', x: '78%', y: '42%', name: 'Katihar', color: '#FFB347' },
  
  // Central Districts
  { id: 'Patna', x: '35%', y: '55%', name: 'Patna', color: '#90EE90' },
  { id: 'Begusarai', x: '48%', y: '52%', name: 'Begusarai', color: '#87CEEB' },
  { id: 'Khagaria', x: '55%', y: '52%', name: 'Khagaria', color: '#87CEEB' },
  { id: 'Bhagalpur', x: '68%', y: '52%', name: 'Bhagalpur', color: '#90EE90' },
  { id: 'Munger', x: '58%', y: '58%', name: 'Munger', color: '#87CEEB' },
  { id: 'Lakhisarai', x: '52%', y: '62%', name: 'Lakhisarai', color: '#87CEEB' },
  { id: 'Sheikhpura', x: '45%', y: '62%', name: 'Sheikhpura', color: '#FFFFFF' },
  { id: 'Nalanda', x: '38%', y: '62%', name: 'Nalanda', color: '#FFFFFF' },
  
  // Western Districts
  { id: 'Bhojpur', x: '25%', y: '55%', name: 'Bhojpur', color: '#FFFACD' },
  { id: 'Buxar', x: '15%', y: '52%', name: 'Buxar', color: '#FFFACD' },
  { id: 'Kaimur', x: '8%', y: '62%', name: 'Kaimur', color: '#FFFACD' },
  { id: 'Rohtas', x: '18%', y: '65%', name: 'Rohtas', color: '#FFFACD' },
  
  // Southern Districts
  { id: 'Arwal', x: '28%', y: '68%', name: 'Arwal', color: '#FFB6C1' },
  { id: 'Jehanabad', x: '35%', y: '72%', name: 'Jehanabad', color: '#FFB6C1' },
  { id: 'Aurangabad', x: '22%', y: '75%', name: 'Aurangabad', color: '#FFB6C1' },
  { id: 'Gaya', x: '35%', y: '82%', name: 'Gaya', color: '#FFB6C1' },
  { id: 'Nawada', x: '45%', y: '75%', name: 'Nawada', color: '#FFB6C1' },
  { id: 'Jamui', x: '55%', y: '72%', name: 'Jamui', color: '#90EE90' },
  { id: 'Banka', x: '65%', y: '68%', name: 'Banka', color: '#90EE90' }
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

  const getDistrictVoteColor = (districtId) => {
    const vote = votes[districtId];
    if (!vote) return 'transparent';
    const party = politicalParties.find(p => p.name === vote);
    return party ? party.color + '80' : 'transparent'; // Adding transparency
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
  };

  const resetZoom = () => {
    setZoomLevel(1);
  };

  const renderDistrictAreas = () => {
    const mapWidth = 600 * zoomLevel;
    const mapHeight = 450 * zoomLevel;
    
    return biharDistricts.map((district) => {
      const voteColor = getDistrictVoteColor(district.id);
      const isVoted = votes[district.id];
      
      return (
        <TouchableOpacity
          key={district.id}
          style={[
            styles.districtArea,
            {
              left: district.x,
              top: district.y,
              backgroundColor: isVoted ? voteColor : 'rgba(255,255,255,0.1)',
              borderColor: isVoted ? '#2c3e50' : 'rgba(44, 62, 80, 0.3)',
              borderWidth: isVoted ? 2 : 1,
              minWidth: Math.max(60 * zoomLevel, 50),
              minHeight: Math.max(30 * zoomLevel, 25),
              transform: [
                { translateX: -Math.max(30 * zoomLevel, 25) }, 
                { translateY: -Math.max(15 * zoomLevel, 12.5) }
              ],
            }
          ]}
          onPress={() => handleDistrictPress(district)}
          activeOpacity={0.7}
        >
          <Text style={[
            styles.districtText, 
            { 
              fontSize: Math.max(8 * zoomLevel, 7),
              color: isVoted ? '#fff' : '#2c3e50'
            }
          ]}>
            {district.name.length > (zoomLevel > 2 ? 15 : 10) 
              ? district.name.substring(0, zoomLevel > 2 ? 15 : 10) + '...' 
              : district.name}
          </Text>
          
          {isVoted && (
            <View style={[styles.voteCheckmark, {
              width: Math.max(16 * zoomLevel, 14),
              height: Math.max(16 * zoomLevel, 14),
            }]}>
              <Text style={[styles.checkmarkText, { fontSize: Math.max(10 * zoomLevel, 8) }]}>✓</Text>
            </View>
          )}
        </TouchableOpacity>
      );
    });
  };

  const mapWidth = 600 * zoomLevel;
  const mapHeight = 450 * zoomLevel;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bihar Interactive Election Map</Text>
        <Text style={styles.headerSubtitle}>
          Click on any district to vote • Zoom: {zoomLevel.toFixed(1)}x
        </Text>
      </View>

      {/* Control Panel */}
      <View style={styles.controlPanel}>
        <View style={styles.controlRow}>
          <TouchableOpacity 
            style={[styles.controlButton, { backgroundColor: '#3498db' }]}
            onPress={() => setShowResults(!showResults)}
          >
            <Text style={styles.controlButtonText}>
              {showResults ? 'Hide Results' : 'Show Results'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.controlButton, { backgroundColor: '#e74c3c' }]}
            onPress={resetVotes}
          >
            <Text style={styles.controlButtonText}>Reset All</Text>
          </TouchableOpacity>
        </View>

        {/* Zoom Controls */}
        <View style={styles.zoomRow}>
          <TouchableOpacity 
            style={[styles.zoomButton, { backgroundColor: '#27ae60' }]}
            onPress={handleZoomIn}
            disabled={zoomLevel >= 3}
          >
            <Text style={styles.zoomButtonText}>Zoom +</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.zoomButton, { backgroundColor: '#f39c12' }]}
            onPress={resetZoom}
          >
            <Text style={styles.zoomButtonText}>Reset</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.zoomButton, { backgroundColor: '#e67e22' }]}
            onPress={handleZoomOut}
            disabled={zoomLevel <= 1}
          >
            <Text style={styles.zoomButtonText}>Zoom -</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Vote Counter */}
      <View style={styles.voteCounter}>
        <Text style={styles.voteCountText}>
          Districts Voted: {getTotalVotes()}/{biharDistricts.length} • 
          Progress: {((getTotalVotes() / biharDistricts.length) * 100).toFixed(1)}%
        </Text>
      </View>

      {/* Map Container */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={true}
        style={styles.mapContainer}
        contentContainerStyle={{ alignItems: 'center' }}
        bounces={false}
      >
        <ScrollView 
          showsVerticalScrollIndicator={true}
          contentContainerStyle={{ alignItems: 'center' }}
          bounces={false}
        >
          <View style={[styles.mapWrapper, { 
            width: mapWidth + 50, 
            height: mapHeight + 50,
          }]}>
            {/* Map Background */}
            <View style={[styles.mapBackground, { 
              width: mapWidth, 
              height: mapHeight,
              backgroundColor: '#f0f8ff'
            }]}>
              {/* District Areas */}
              {renderDistrictAreas()}
              
              {/* Map Border */}
              <View style={styles.mapBorder} />
              
              {/* Map Title */}
              <View style={styles.mapTitleContainer}>
                <Text style={styles.mapTitle}>BIHAR</Text>
                <Text style={styles.mapSubtitle}>38 Districts</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </ScrollView>

      {/* Results Panel */}
      {showResults && (
        <View style={styles.resultsPanel}>
          <Text style={styles.resultsPanelTitle}>🗳️ Live Election Results</Text>
          <ScrollView style={styles.resultsScroll} horizontal showsHorizontalScrollIndicator={false}>
            {politicalParties.map((party) => {
              const voteCount = getVoteCount(party.name);
              const percentage = getTotalVotes() > 0 ? ((voteCount / getTotalVotes()) * 100).toFixed(1) : 0;
              
              return (
                <View key={party.name} style={[styles.resultCard, { backgroundColor: party.color + '20' }]}>
                  <View style={[styles.partyColorIndicator, { backgroundColor: party.color }]} />
                  <Text style={styles.partySymbol}>{party.symbol}</Text>
                  <Text style={styles.resultPartyName}>{party.name.split(' ')[0]}</Text>
                  <Text style={styles.resultVoteCount}>{voteCount}</Text>
                  <Text style={styles.resultPercentage}>{percentage}%</Text>
                </View>
              );
            })}
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
            <Text style={styles.modalTitle}>🗳️ {selectedDistrict}</Text>
            <Text style={styles.modalSubtitle}>Select Your Vote</Text>
            
            {votes[selectedDistrict] && (
              <View style={styles.currentVoteIndicator}>
                <Text style={styles.currentVoteText}>
                  ✅ Current Vote: {votes[selectedDistrict]}
                </Text>
              </View>
            )}
            
            <ScrollView style={styles.partyList} showsVerticalScrollIndicator={false}>
              {politicalParties.map((party) => (
                <TouchableOpacity
                  key={party.name}
                  style={[styles.partyVoteButton, { 
                    backgroundColor: party.color,
                    opacity: votes[selectedDistrict] === party.name ? 1 : 0.9
                  }]}
                  onPress={() => handleVote(party)}
                >
                  <Text style={styles.partySymbolLarge}>{party.symbol}</Text>
                  <View style={styles.partyTextContainer}>
                    <Text style={styles.partyVoteButtonText}>{party.name}</Text>
                    {votes[selectedDistrict] === party.name && (
                      <Text style={styles.selectedIndicator}>✅ SELECTED</Text>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
            
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>❌ Cancel</Text>
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
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#bdc3c7',
    textAlign: 'center',
  },
  controlPanel: {
    backgroundColor: '#ecf0f1',
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  controlRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  controlButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    flex: 0.45,
    alignItems: 'center',
  },
  controlButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },
  zoomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  zoomButton: {
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 15,
    flex: 0.3,
    alignItems: 'center',
  },
  zoomButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 11,
  },
  voteCounter: {
    backgroundColor: '#34495e',
    paddingVertical: 8,
    alignItems: 'center',
  },
  voteCountText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  mapContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  mapWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 25,
  },
  mapBackground: {
    position: 'relative',
    borderWidth: 3,
    borderColor: '#2c3e50',
    borderRadius: 10,
    overflow: 'hidden',
  },
  mapBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderWidth: 2,
    borderColor: '#34495e',
    borderRadius: 8,
  },
  mapTitleContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(44, 62, 80, 0.9)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  mapTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  mapSubtitle: {
    color: '#bdc3c7',
    fontSize: 12,
    textAlign: 'center',
  },
  districtArea: {
    position: 'absolute',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    paddingVertical: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  districtText: {
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 12,
  },
  voteCheckmark: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#27ae60',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  checkmarkText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  resultsPanel: {
    backgroundColor: '#2c3e50',
    paddingVertical: 15,
    paddingHorizontal: 10,
    maxHeight: screenHeight * 0.2,
  },
  resultsPanelTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  resultsScroll: {
    flexDirection: 'row',
  },
  resultCard: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginHorizontal: 5,
    borderRadius: 10,
    minWidth: 80,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  partyColorIndicator: {
    width: 20,
    height: 4,
    borderRadius: 2,
    marginBottom: 5,
  },
  partySymbol: {
    fontSize: 16,
    marginBottom: 2,
  },
  resultPartyName: {
    color: '#2c3e50',
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 2,
  },
  resultVoteCount: {
    color: '#2c3e50',
    fontSize: 14,
    fontWeight: 'bold',
  },
  resultPercentage: {
    color: '#7f8c8d',
    fontSize: 10,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    width: screenWidth - 40,
    maxHeight: screenHeight * 0.8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
    color: '#2c3e50',
  },
  modalSubtitle: {
    fontSize: 16,
    marginBottom: 15,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  currentVoteIndicator: {
    backgroundColor: '#d5f4e6',
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#27ae60',
  },
  currentVoteText: {
    color: '#27ae60',
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 14,
  },
  partyList: {
    maxHeight: screenHeight * 0.45,
  },
  partyVoteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 15,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  partySymbolLarge: {
    fontSize: 24,
    marginRight: 15,
  },
  partyTextContainer: {
    flex: 1,
  },
  partyVoteButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
  selectedIndicator: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 2,
  },
  cancelButton: {
    backgroundColor: '#95a5a6',
    borderRadius: 12,
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