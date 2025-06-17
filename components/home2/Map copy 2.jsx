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
} from 'react-native';
import Svg, { G, Path, Polygon, Text as SvgText } from 'react-native-svg';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const App = () => {
  const [selectedConstituency, setSelectedConstituency] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Bihar constituency data based on your image
  const constituencyData = {
    1: { name: 'Valmiki Nagar', category: 'General', district: 'West Champaran', population: '1,796,356' },
    2: { name: 'Paschim Champaran', category: 'General', district: 'West Champaran', population: '1,796,356' },
    3: { name: 'Purvi Champaran', category: 'General', district: 'East Champaran', population: '1,729,227' },
    4: { name: 'Sheohar', category: 'General', district: 'Sheohar', population: '656,916' },
    5: { name: 'Sitamarhi', category: 'General', district: 'Sitamarhi', population: '3,423,574' },
    6: { name: 'Madhubani', category: 'General', district: 'Madhubani', population: '4,487,379' },
    7: { name: 'Jhanjharpur', category: 'General', district: 'Madhubani', population: '4,487,379' },
    8: { name: 'Supaul', category: 'General', district: 'Supaul', population: '2,229,076' },
    9: { name: 'Araria', category: 'General', district: 'Araria', population: '2,811,569' },
    10: { name: 'Kishanganj', category: 'General', district: 'Kishanganj', population: '1,690,400' },
    11: { name: 'Katihar', category: 'General', district: 'Katihar', population: '3,071,029' },
    12: { name: 'Purnia', category: 'General', district: 'Purnia', population: '3,264,619' },
    13: { name: 'Madhepura', category: 'General', district: 'Madhepura', population: '1,994,618' },
    14: { name: 'Darbhanga', category: 'General', district: 'Darbhanga', population: '3,937,385' },
    15: { name: 'Muzaffarpur', category: 'General', district: 'Muzaffarpur', population: '4,801,062' },
    16: { name: 'Vaishali', category: 'General', district: 'Vaishali', population: '3,495,021' },
    17: { name: 'Gopalganj', category: 'SC', district: 'Gopalganj', population: '2,562,012' },
    18: { name: 'Siwan', category: 'General', district: 'Siwan', population: '3,318,176' },
    19: { name: 'Maharajganj', category: 'General', district: 'Siwan', population: '3,318,176' },
    20: { name: 'Saran', category: 'General', district: 'Saran', population: '3,951,862' },
    21: { name: 'Chapra', category: 'General', district: 'Saran', population: '3,951,862' },
    22: { name: 'Samastipur', category: 'SC', district: 'Samastipur', population: '4,261,566' },
    23: { name: 'Begusarai', category: 'General', district: 'Begusarai', population: '2,970,541' },
    24: { name: 'Khagaria', category: 'General', district: 'Khagaria', population: '1,666,886' },
    25: { name: 'Bhagalpur', category: 'General', district: 'Bhagalpur', population: '3,037,766' },
    26: { name: 'Banka', category: 'General', district: 'Banka', population: '2,034,763' },
    27: { name: 'Munger', category: 'General', district: 'Munger', population: '1,367,765' },
    28: { name: 'Lakhisarai', category: 'SC', district: 'Lakhisarai', population: '1,000,912' },
    29: { name: 'Sheikhpura', category: 'General', district: 'Sheikhpura', population: '634,927' },
    30: { name: 'Nalanda', category: 'General', district: 'Nalanda', population: '2,877,653' },
    31: { name: 'Patna Sahib', category: 'General', district: 'Patna', population: '5,838,465' },
    32: { name: 'Pataliputra', category: 'General', district: 'Patna', population: '5,838,465' },
    33: { name: 'Arrah', category: 'General', district: 'Bhojpur', population: '2,728,407' },
    34: { name: 'Buxar', category: 'General', district: 'Buxar', population: '1,706,352' },
    35: { name: 'Sasaram', category: 'SC', district: 'Rohtas', population: '2,962,593' },
    36: { name: 'Karakat', category: 'General', district: 'Rohtas', population: '2,962,593' },
    37: { name: 'Jahanabad', category: 'General', district: 'Jahanabad', population: '1,125,313' },
    38: { name: 'Aurangabad', category: 'General', district: 'Aurangabad', population: '2,540,073' },
    39: { name: 'Gaya', category: 'SC', district: 'Gaya', population: '4,391,418' },
    40: { name: 'Nawada', category: 'General', district: 'Nawada', population: '2,219,146' },
  };

  // Simplified Bihar state outline with constituencies (approximate positions)
  const biharOutline = "M50,100 L400,100 L450,120 L480,150 L500,200 L520,250 L500,300 L480,350 L450,380 L400,400 L350,420 L300,400 L250,380 L200,360 L150,340 L100,320 L80,300 L60,280 L50,250 L40,200 L50,150 Z";

  // Constituency polygons arranged to form Bihar map outline
  const constituencyPaths = {
    // Top row (Northern Bihar)
    1: "50,100 120,100 120,140 50,140",
    2: "120,100 190,100 190,140 120,140",
    3: "190,100 260,100 260,140 190,140",
    4: "260,100 330,100 330,140 260,140",
    5: "330,100 400,100 400,140 330,140",
    6: "400,100 450,100 450,140 400,140",
    7: "450,100 500,120 480,160 430,140",
    8: "500,120 520,150 500,180 480,160",
    9: "520,150 520,200 480,200 500,180",
    10: "520,200 520,250 480,250 480,200",
    
    // Second row
    11: "480,250 520,250 500,300 460,280",
    12: "460,280 500,300 480,320 440,300",
    13: "440,300 480,320 460,340 420,320",
    14: "270,140 340,140 340,180 270,180",
    15: "200,140 270,140 270,180 200,180",
    16: "130,140 200,140 200,180 130,180",
    17: "60,140 130,140 130,180 60,180",
    18: "50,140 60,140 60,200 50,200",
    19: "60,180 130,180 130,220 60,220",
    20: "130,180 200,180 200,220 130,220",
    
    // Third row
    21: "200,180 270,180 270,220 200,220",
    22: "270,180 340,180 340,220 270,220",
    23: "340,180 410,180 410,220 340,220",
    24: "410,180 460,180 460,220 410,220",
    25: "460,180 480,180 480,220 460,220",
    26: "460,220 480,220 480,260 460,260",
    27: "410,220 460,220 460,260 410,260",
    28: "340,220 410,220 410,260 340,260",
    29: "270,220 340,220 340,260 270,260",
    30: "200,220 270,220 270,260 200,260",
    
    // Fourth row
    31: "130,220 200,220 200,260 130,260",
    32: "60,220 130,220 130,260 60,260",
    33: "60,260 130,260 130,300 60,300",
    34: "50,200 60,200 60,260 50,260",
    35: "130,260 200,260 200,300 130,300",
    36: "200,260 270,260 270,300 200,300",
    37: "270,260 340,260 340,300 270,300",
    38: "340,260 410,260 410,300 340,300",
    39: "200,300 270,300 270,340 200,340",
    40: "270,300 340,300 340,340 270,340",
  };

  const handleConstituencyPress = (constituencyId) => {
    setSelectedConstituency(constituencyData[constituencyId]);
    setModalVisible(true);
  };

  const getConstituencyColor = (category) => {
    switch (category) {
      case 'SC':
        return '#FFE066'; // Yellow for SC
      case 'ST':
        return '#FFB3B3'; // Light pink for ST
      default:
        return '#E6E6E6'; // Light gray for General
    }
  };

  const renderConstituency = (id) => {
    const data = constituencyData[id];
    if (!data || !constituencyPaths[id]) return null;

    const points = constituencyPaths[id];
    const coords = points.split(' ').map(point => point.split(','));
    
    // Calculate center for text placement
    const centerX = coords.reduce((sum, coord) => sum + parseFloat(coord[0]), 0) / coords.length;
    const centerY = coords.reduce((sum, coord) => sum + parseFloat(coord[1]), 0) / coords.length;

    return (
      <G key={id}>
        <Polygon
          points={points}
          fill={getConstituencyColor(data.category)}
          stroke="#8B4513"
          strokeWidth="1"
          onPress={() => handleConstituencyPress(id)}
        />
        <SvgText
          x={centerX}
          y={centerY + 3}
          fontSize="8"
          fill="#000"
          textAnchor="middle"
          fontWeight="bold"
          onPress={() => handleConstituencyPress(id)}
        >
          {id}
        </SvgText>
      </G>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Bihar Lok Sabha Constituencies</Text>
        <Text style={styles.subtitle}>Interactive Map - 40 Constituencies</Text>
      </View>

      <ScrollView style={styles.mapContainer} showsVerticalScrollIndicator={false}>
        {/* Main Map */}
        <View style={styles.svgContainer}>
          <Text style={styles.mapTitle}>Bihar State Map</Text>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            <Svg height="350" width="550" viewBox="40 90 500 280">
              {/* State outline */}
              <Path
                d={biharOutline}
                fill="none"
                stroke="#2c3e50"
                strokeWidth="3"
                strokeDasharray="5,5"
              />
              
              {/* Render all constituencies */}
              {Object.keys(constituencyData).map(id => renderConstituency(parseInt(id)))}
            </Svg>
          </ScrollView>
          <Text style={styles.mapNote}>👆 Tap on any constituency to view details</Text>
        </View>

        {/* Legend */}
        <View style={styles.legendContainer}>
          <Text style={styles.legendTitle}>Category Legend</Text>
          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View style={[styles.colorBox, { backgroundColor: '#E6E6E6' }]} />
              <Text style={styles.legendText}>General (34)</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.colorBox, { backgroundColor: '#FFE066' }]} />
              <Text style={styles.legendText}>SC (6)</Text>
            </View>
          </View>
        </View>

        {/* Statistics */}
        <View style={styles.statsContainer}>
          <Text style={styles.statsTitle}>Quick Stats</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>40</Text>
              <Text style={styles.statLabel}>Total Seats</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>34</Text>
              <Text style={styles.statLabel}>General</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>6</Text>
              <Text style={styles.statLabel}>SC Reserved</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>ST Reserved</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Modal for constituency details */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedConstituency && (
              <>
                <Text style={styles.modalTitle}>{selectedConstituency.name}</Text>
                <Text style={styles.modalSubtitle}>Lok Sabha Constituency</Text>
                
                <View style={styles.modalDetails}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>District:</Text>
                    <Text style={styles.detailValue}>{selectedConstituency.district}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Category:</Text>
                    <Text style={[styles.detailValue, {
                      color: selectedConstituency.category === 'SC' ? '#f39c12' : '#2c3e50'
                    }]}>
                      {selectedConstituency.category === 'SC' ? 'SC (Reserved)' : 'General'}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Population:</Text>
                    <Text style={styles.detailValue}>{selectedConstituency.population}</Text>
                  </View>
                </View>

                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.closeButtonText}>Close</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
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
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#bdc3c7',
    textAlign: 'center',
    marginTop: 5,
  },
  mapContainer: {
    flex: 1,
    padding: 15,
  },
  svgContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  mapTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 10,
  },
  mapNote: {
    fontSize: 12,
    color: '#7f8c8d',
    textAlign: 'center',
    marginTop: 10,
    fontStyle: 'italic',
  },
  legendContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  legendTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#2c3e50',
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorBox: {
    width: 20,
    height: 20,
    marginRight: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#8B4513',
  },
  legendText: {
    fontSize: 14,
    color: '#34495e',
    fontWeight: '500',
  },
  statsContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#2c3e50',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3498db',
  },
  statLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  listContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#2c3e50',
  },
  listItem: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#3498db',
  },
  listItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  constituencyNumber: {
    backgroundColor: '#3498db',
    borderRadius: 20,
    width: 35,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  numberText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  constituencyInfo: {
    flex: 1,
    marginLeft: 15,
  },
  constituencyName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
  constituencyDistrict: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 2,
  },
  constituencyCategory: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 1,
  },
  categoryIndicator: {
    width: 15,
    height: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#8B4513',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    margin: 20,
    width: screenWidth - 40,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 5,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalDetails: {
    marginBottom: 25,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#34495e',
  },
  detailValue: {
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: '500',
  },
  modalButtons: {
    alignItems: 'center',
  },
  closeButton: {
    backgroundColor: '#3498db',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 30,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default App;