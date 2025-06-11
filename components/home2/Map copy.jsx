import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import Svg, { Path, G, Text as SvgText, Polygon } from 'react-native-svg';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const App = () => {
  const [selectedConstituency, setSelectedConstituency] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Bihar constituency data matching the image
  const constituencyData = {
    1: { name: 'Valmiki Nagar', category: 'General', district: 'West Champaran', description: 'Northwestern constituency bordering Nepal' },
    2: { name: 'Paschim Champaran', category: 'General', district: 'West Champaran', description: 'Western part of Champaran district' },
    3: { name: 'Purvi Champaran', category: 'General', district: 'East Champaran', description: 'Eastern part of Champaran district' },
    4: { name: 'Sheohar', category: 'General', district: 'Sheohar', description: 'Small district in northern Bihar' },
    5: { name: 'Sitamarhi', category: 'General', district: 'Sitamarhi', description: 'Known for Janaki Temple' },
    6: { name: 'Madhubani', category: 'General', district: 'Madhubani', description: 'Famous for Madhubani paintings' },
    7: { name: 'Jhanjharpur', category: 'General', district: 'Madhubani', description: 'Part of Madhubani district' },
    8: { name: 'Supaul', category: 'General', district: 'Supaul', description: 'Northeastern constituency' },
    9: { name: 'Araria', category: 'General', district: 'Araria', description: 'Border district with West Bengal' },
    10: { name: 'Kishanganj', category: 'General', district: 'Kishanganj', description: 'Easternmost district of Bihar' },
    11: { name: 'Katihar', category: 'General', district: 'Katihar', description: 'Important railway junction' },
    12: { name: 'Purnia', category: 'General', district: 'Purnia', description: 'Major city in northeast Bihar' },
    13: { name: 'Madhepura', category: 'General', district: 'Madhepura', description: 'Known for brass industry' },
    14: { name: 'Darbhanga', category: 'General', district: 'Darbhanga', description: 'Cultural capital of Mithila' },
    15: { name: 'Muzaffarpur', category: 'General', district: 'Muzaffarpur', description: 'Litchi capital of Bihar' },
    16: { name: 'Vaishali', category: 'General', district: 'Vaishali', description: 'Birthplace of Lord Mahavira' },
    17: { name: 'Gopalganj', category: 'SC', district: 'Gopalganj', description: 'SC reserved constituency' },
    18: { name: 'Siwan', category: 'General', district: 'Siwan', description: 'Western Bihar constituency' },
    19: { name: 'Maharajganj', category: 'General', district: 'Siwan', description: 'Part of Siwan district' },
    20: { name: 'Saran', category: 'General', district: 'Saran', description: 'Ancient Saran region' },
    21: { name: 'Chapra', category: 'General', district: 'Saran', description: 'District headquarters of Saran' },
    22: { name: 'Samastipur', category: 'SC', district: 'Samastipur', description: 'SC reserved constituency' },
    23: { name: 'Begusarai', category: 'General', district: 'Begusarai', description: 'Industrial hub of Bihar' },
    24: { name: 'Khagaria', category: 'General', district: 'Khagaria', description: 'Ganges river constituency' },
    25: { name: 'Bhagalpur', category: 'General', district: 'Bhagalpur', description: 'Silk city of Bihar' },
    26: { name: 'Banka', category: 'General', district: 'Banka', description: 'Hilly terrain constituency' },
    27: { name: 'Munger', category: 'General', district: 'Munger', description: 'Historic gun manufacturing center' },
    28: { name: 'Lakhisarai', category: 'SC', district: 'Lakhisarai', description: 'SC reserved constituency' },
    29: { name: 'Sheikhpura', category: 'General', district: 'Sheikhpura', description: 'Small district in central Bihar' },
    30: { name: 'Nalanda', category: 'General', district: 'Nalanda', description: 'Site of ancient Nalanda University' },
    31: { name: 'Patna Sahib', category: 'General', district: 'Patna', description: 'Urban Patna constituency' },
    32: { name: 'Pataliputra', category: 'General', district: 'Patna', description: 'Named after ancient Pataliputra' },
    33: { name: 'Arrah', category: 'General', district: 'Bhojpur', description: 'Historic town of Arrah' },
    34: { name: 'Buxar', category: 'General', district: 'Buxar', description: 'Site of Battle of Buxar' },
    35: { name: 'Sasaram', category: 'SC', district: 'Rohtas', description: 'SC reserved, Sher Shah Suri birthplace' },
    36: { name: 'Karakat', category: 'General', district: 'Rohtas', description: 'Part of Rohtas district' },
    37: { name: 'Jahanabad', category: 'General', district: 'Jahanabad', description: 'Central Bihar constituency' },
    38: { name: 'Aurangabad', category: 'General', district: 'Aurangabad', description: 'Southern Bihar constituency' },
    39: { name: 'Gaya', category: 'SC', district: 'Gaya', description: 'SC reserved, Buddhist pilgrimage site' },
    40: { name: 'Nawada', category: 'General', district: 'Nawada', description: 'Southernmost constituency' },
  };

  // Authentic Bihar state outline matching the image
  const biharOutline = `
    M 80 120 
    L 85 115 L 95 110 L 110 108 L 130 105 L 150 103 L 170 102 L 190 101 L 210 100 L 230 99 L 250 98 L 270 97 L 290 96 L 310 95 L 330 94 L 350 93 L 370 92 L 390 91 L 410 90 L 430 89 L 450 88 L 470 89 L 485 92 L 495 96 L 502 102 L 507 110 L 510 120 L 512 130 L 515 140 L 518 150 L 520 160 L 522 170 L 524 180 L 525 190 L 526 200 L 527 210 L 528 220 L 529 230 L 530 240 L 531 250 L 532 260 L 533 270 L 534 280 L 535 290 L 534 300 L 532 310 L 530 320 L 527 330 L 523 340 L 518 350 L 512 360 L 505 370 L 497 380 L 488 390 L 478 400 L 467 410 L 455 420 L 442 430 L 428 440 L 413 450 L 397 460 L 380 470 L 362 480 L 343 490 L 323 500 L 302 510 L 280 520 L 257 530 L 233 540 L 208 550 L 182 560 L 155 570 L 127 580 L 98 590 L 68 600 L 38 610 L 20 605 L 15 598 L 12 590 L 10 580 L 9 570 L 8 560 L 7 550 L 6 540 L 5 530 L 4 520 L 3 510 L 2 500 L 1 490 L 0 480 L 1 470 L 3 460 L 6 450 L 10 440 L 15 430 L 21 420 L 28 410 L 36 400 L 45 390 L 55 380 L 66 370 L 78 360 L 91 350 L 105 340 L 120 330 L 136 320 L 153 310 L 171 300 L 190 290 L 210 280 L 231 270 L 253 260 L 276 250 L 300 240 L 325 230 L 351 220 L 378 210 L 406 200 L 435 190 L 465 180 L 496 170 L 528 160 L 561 150 L 595 140 L 630 130 L 666 120 L 703 110 L 741 100 L 780 90 L 820 80 L 861 70 L 903 60 L 946 50 L 990 40 L 1035 30 L 1081 20 L 1128 10 L 1176 0
    L 78 125 L 80 120 Z
  `;

  // Constituency paths based on the image layout
  const constituencyPaths = {
    // Top row - Northern Bihar
    1: "80,120 140,115 140,145 80,150 Z", // Valmiki Nagar
    2: "140,115 200,110 200,140 140,145 Z", // Paschim Champaran  
    3: "200,110 260,105 260,135 200,140 Z", // Purvi Champaran
    4: "260,105 300,102 300,132 260,135 Z", // Sheohar
    5: "300,102 350,100 350,130 300,132 Z", // Sitamarhi
    6: "350,100 400,98 400,128 350,130 Z", // Madhubani
    7: "400,98 440,96 440,126 400,128 Z", // Jhanjharpur
    8: "440,96 480,95 480,125 440,126 Z", // Supaul
    9: "480,95 520,94 520,124 480,125 Z", // Araria
    10: "520,94 535,120 520,124 Z", // Kishanganj
    
    // Second row
    11: "520,124 535,160 500,165 480,150 Z", // Katihar
    12: "480,125 520,124 480,150 440,155 Z", // Purnia
    13: "440,126 480,125 440,155 400,160 Z", // Madhepura
    14: "350,130 400,128 400,160 350,165 Z", // Darbhanga
    15: "300,132 350,130 350,165 300,170 Z", // Muzaffarpur
    16: "260,135 300,132 300,170 260,175 Z", // Vaishali
    17: "200,140 260,135 260,175 200,180 Z", // Gopalganj (SC)
    18: "140,145 200,140 200,180 140,185 Z", // Siwan
    19: "80,150 140,145 140,185 80,190 Z", // Maharajganj
    20: "80,190 140,185 140,220 80,225 Z", // Saran
    
    // Third row
    21: "140,185 200,180 200,220 140,220 Z", // Chapra
    22: "200,180 260,175 260,215 200,220 Z", // Samastipur (SC)
    23: "260,175 300,170 300,210 260,215 Z", // Begusarai
    24: "300,170 350,165 350,205 300,210 Z", // Khagaria
    25: "350,165 400,160 400,200 350,205 Z", // Bhagalpur
    26: "400,160 440,155 440,195 400,200 Z", // Banka
    27: "440,155 480,150 480,190 440,195 Z", // Munger
    28: "300,210 350,205 350,245 300,250 Z", // Lakhisarai (SC)
    29: "260,215 300,210 300,250 260,255 Z", // Sheikhpura
    30: "200,220 260,215 260,255 200,260 Z", // Nalanda
    
    // Fourth row
    31: "140,220 200,220 200,260 140,265 Z", // Patna Sahib
    32: "80,225 140,220 140,265 80,270 Z", // Pataliputra
    33: "80,270 140,265 140,305 80,310 Z", // Arrah
    34: "65,310 80,270 80,310 65,345 Z", // Buxar
    35: "140,265 200,260 200,300 140,305 Z", // Sasaram (SC)
    36: "200,260 260,255 260,295 200,300 Z", // Karakat
    37: "260,255 300,250 300,290 260,295 Z", // Jahanabad
    38: "300,250 350,245 350,285 300,290 Z", // Aurangabad
    39: "200,300 260,295 260,335 200,340 Z", // Gaya (SC)
    40: "260,295 300,290 300,330 260,335 Z", // Nawada
  };

  const handleConstituencyPress = (constituencyId) => {
    setSelectedConstituency({
      id: constituencyId,
      ...constituencyData[constituencyId]
    });
    setModalVisible(true);
  };

  const getConstituencyColor = (category) => {
    switch (category) {
      case 'SC':
        return '#FFE066'; // Yellow for SC (matching image)
      case 'ST':
        return '#FFB3B3'; // Light pink for ST (matching image)
      default:
        return '#F5F5F5'; // Light gray for General (matching image)
    }
  };

  const getStrokeColor = () => {
    return '#8B4513'; // Brown border (matching image)
  };

  const renderConstituency = (id) => {
    const data = constituencyData[id];
    if (!data || !constituencyPaths[id]) return null;

    const pathData = constituencyPaths[id];
    const coords = pathData.replace(/[MLZ]/g, '').split(' ').filter(coord => coord.includes(',')).map(coord => coord.split(','));
    
    // Calculate center for text placement
    const centerX = coords.reduce((sum, coord) => sum + parseFloat(coord[0]), 0) / coords.length;
    const centerY = coords.reduce((sum, coord) => sum + parseFloat(coord[1]), 0) / coords.length;

    return (
      <G key={id}>
        <Path
          d={`M ${pathData}`}
          fill={getConstituencyColor(data.category)}
          stroke={getStrokeColor()}
          strokeWidth="0.8"
          onPress={() => handleConstituencyPress(id)}
        />
        <SvgText
          x={centerX}
          y={centerY + 2}
          fontSize="9"
          fill="#000"
          textAnchor="middle"
          fontWeight="500"
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
        <Text style={styles.subtitle}>40 Parliamentary Constituencies</Text>
      </View>

      <ScrollView style={styles.mapContainer} showsVerticalScrollIndicator={false}>
        {/* Main Map */}
        <View style={styles.svgContainer}>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={true} style={styles.mapScrollView}>
            <View style={styles.mapWrapper}>
              <Svg height="420" width="600" viewBox="0 0 600 420" style={styles.mapSvg}>
                {/* State outline */}
                <Path
                  d={biharOutline}
                  fill="none"
                  stroke="#8B4513"
                  strokeWidth="2.5"
                  strokeDasharray="none"
                />
                
                {/* Render all constituencies */}
                {Object.keys(constituencyData).map(id => renderConstituency(parseInt(id)))}
              </Svg>
              
              {/* Legend positioned like in the image */}
              <View style={styles.mapLegend}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendBox, { backgroundColor: '#FFE066' }]} />
                  <Text style={styles.legendLabel}>SC</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendBox, { backgroundColor: '#FFB3B3' }]} />
                  <Text style={styles.legendLabel}>ST</Text>
                </View>
              </View>
            </View>
          </ScrollView>
          
          <Text style={styles.mapNote}>👆 Scroll horizontally and tap constituencies for details</Text>
        </View>

        {/* Statistics Card */}
        <View style={styles.statsContainer}>
          <Text style={styles.statsTitle}>Constituency Breakdown</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>40</Text>
              <Text style={styles.statLabel}>Total Seats</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>34</Text>
              <Text style={styles.statLabel}>General</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={[styles.statNumber, { color: '#f39c12' }]}>6</Text>
              <Text style={styles.statLabel}>SC Reserved</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>ST Reserved</Text>
            </View>
          </View>
        </View>

        {/* Constituency List */}
        <View style={styles.listContainer}>
          <Text style={styles.listTitle}>All Constituencies</Text>
          {Object.entries(constituencyData).map(([id, data]) => (
            <TouchableOpacity
              key={id}
              style={[styles.listItem, { borderLeftColor: data.category === 'SC' ? '#f39c12' : '#3498db' }]}
              onPress={() => handleConstituencyPress(id)}
            >
              <View style={styles.listItemContent}>
                <View style={[styles.constituencyNumberBadge, { 
                  backgroundColor: data.category === 'SC' ? '#f39c12' : '#3498db' 
                }]}>
                  <Text style={styles.numberBadgeText}>{id}</Text>
                </View>
                <View style={styles.constituencyDetails}>
                  <Text style={styles.constituencyName}>{data.name}</Text>
                  <Text style={styles.constituencyDistrict}>{data.district} District</Text>
                  <Text style={[styles.constituencyCategory, {
                    color: data.category === 'SC' ? '#f39c12' : '#7f8c8d'
                  }]}>
                    {data.category === 'SC' ? 'SC Reserved' : 'General'}
                  </Text>
                </View>
                <View style={[styles.categoryDot, { 
                  backgroundColor: getConstituencyColor(data.category) 
                }]} />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Detailed Modal */}
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
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>{selectedConstituency.name}</Text>
                  <Text style={styles.modalConstituencyNumber}>Constituency #{selectedConstituency.id}</Text>
                </View>
                
                <View style={styles.modalBody}>
                  <View style={styles.detailSection}>
                    <Text style={styles.sectionTitle}>Basic Information</Text>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>District:</Text>
                      <Text style={styles.detailValue}>{selectedConstituency.district}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Category:</Text>
                      <Text style={[styles.detailValue, {
                        color: selectedConstituency.category === 'SC' ? '#f39c12' : '#2c3e50',
                        fontWeight: 'bold'
                      }]}>
                        {selectedConstituency.category === 'SC' ? 'SC (Scheduled Caste)' : 'General'}
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.detailSection}>
                    <Text style={styles.sectionTitle}>Description</Text>
                    <Text style={styles.descriptionText}>{selectedConstituency.description}</Text>
                  </View>
                </View>

                <View style={styles.modalFooter}>
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
    borderBottomWidth: 3,
    borderBottomColor: '#34495e',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#bdc3c7',
    textAlign: 'center',
    marginTop: 5,
  },
  mapContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  svgContainer: {
    backgroundColor: '#fff',
    margin: 15,
    borderRadius: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    overflow: 'hidden',
  },
  mapScrollView: {
    backgroundColor: '#f9f9f9',
  },
  mapWrapper: {
    position: 'relative',
    backgroundColor: '#fff',
    padding: 20,
  },
  mapSvg: {
    backgroundColor: 'transparent',
  },
  mapLegend: {
    position: 'absolute',
    top: 30,
    right: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    elevation: 3,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  legendBox: {
    width: 16,
    height: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#8B4513',
  },
  legendLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  mapNote: {
    fontSize: 12,
    color: '#7f8c8d',
    textAlign: 'center',
    padding: 15,
    backgroundColor: '#f8f9fa',
    fontStyle: 'italic',
  },
  statsContainer: {
    backgroundColor: '#fff',
    margin: 15,
    marginTop: 0,
    borderRadius: 15,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statCard: {
    alignItems: 'center',
    padding: 10,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3498db',
  },
  statLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    textAlign: 'center',
    marginTop: 5,
  },
  listContainer: {
    backgroundColor: '#fff',
    margin: 15,
    marginTop: 0,
    borderRadius: 15,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  listItem: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  listItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  constituencyNumberBadge: {
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  numberBadgeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  constituencyDetails: {
    flex: 1,
    marginLeft: 15,
  },
  constituencyName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  constituencyDistrict: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 2,
  },
  constituencyCategory: {
    fontSize: 12,
    marginTop: 3,
    fontWeight: '500',
  },
  categoryDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#8B4513',
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
    margin: 20,
    width: screenWidth - 40,
    maxHeight: screenHeight - 100,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  modalHeader: {
    backgroundColor: '#3498db',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  modalConstituencyNumber: {
    fontSize: 16,
    color: '#ecf0f1',
    marginTop: 5,
  },
  modalBody: {
    padding: 25,
  },
  detailSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#3498db',
    paddingBottom: 5,
  },
  detailRow: {
    flexDirection: 'row',
  }
})