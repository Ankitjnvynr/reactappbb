import React, { useState, useEffect } from 'react';
import {
  View,
  Alert,
  StyleSheet,
  Dimensions,
  ScrollView,
  Text,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import Svg, { G, Path } from 'react-native-svg';

const screen = Dimensions.get('window');

// Embedded Bihar constituencies data with sample SVG paths
// Replace this with actual Bihar constituency boundary data
const BIHAR_MAP_DATA = {
  "type": "FeatureCollection",
  "features": [
    {
      "properties": {
        "name": "Valmiki Nagar",
        "id": "1",
        "district": "West Champaran",
        "type": "Lok Sabha"
      },
      "geometry": {
        "d": "M50,50 L150,60 L140,150 L40,140 Z"
      }
    },
    {
      "properties": {
        "name": "Paschim Champaran",
        "id": "2",
        "district": "West Champaran",
        "type": "Lok Sabha"
      },
      "geometry": {
        "d": "M150,60 L250,70 L240,160 L140,150 Z"
      }
    },
    {
      "properties": {
        "name": "Purvi Champaran",
        "id": "3",
        "district": "East Champaran",
        "type": "Lok Sabha"
      },
      "geometry": {
        "d": "M250,70 L350,80 L340,170 L240,160 Z"
      }
    },
    {
      "properties": {
        "name": "Sheohar",
        "id": "4",
        "district": "Sheohar",
        "type": "Lok Sabha"
      },
      "geometry": {
        "d": "M350,80 L450,90 L440,180 L340,170 Z"
      }
    },
    {
      "properties": {
        "name": "Sitamarhi",
        "id": "5",
        "district": "Sitamarhi",
        "type": "Lok Sabha"
      },
      "geometry": {
        "d": "M450,90 L550,100 L540,190 L440,180 Z"
      }
    },
    {
      "properties": {
        "name": "Madhubani",
        "id": "6",
        "district": "Madhubani",
        "type": "Lok Sabha"
      },
      "geometry": {
        "d": "M40,140 L140,150 L130,240 L30,230 Z"
      }
    },
    {
      "properties": {
        "name": "Jhanjharpur",
        "id": "7",
        "district": "Madhubani",
        "type": "Lok Sabha"
      },
      "geometry": {
        "d": "M140,150 L240,160 L230,250 L130,240 Z"
      }
    },
    {
      "properties": {
        "name": "Supaul",
        "id": "8",
        "district": "Supaul",
        "type": "Lok Sabha"
      },
      "geometry": {
        "d": "M240,160 L340,170 L330,260 L230,250 Z"
      }
    },
    {
      "properties": {
        "name": "Araria",
        "id": "9",
        "district": "Araria",
        "type": "Lok Sabha"
      },
      "geometry": {
        "d": "M340,170 L440,180 L430,270 L330,260 Z"
      }
    },
    {
      "properties": {
        "name": "Kishanganj",
        "id": "10",
        "district": "Kishanganj",
        "type": "Lok Sabha"
      },
      "geometry": {
        "d": "M440,180 L540,190 L530,280 L430,270 Z"
      }
    },
    {
      "properties": {
        "name": "Katihar",
        "id": "11",
        "district": "Katihar",
        "type": "Lok Sabha"
      },
      "geometry": {
        "d": "M540,190 L640,200 L630,290 L530,280 Z"
      }
    },
    {
      "properties": {
        "name": "Purnia",
        "id": "12",
        "district": "Purnia",
        "type": "Lok Sabha"
      },
      "geometry": {
        "d": "M630,290 L640,200 L740,210 L730,300 Z"
      }
    },
    {
      "properties": {
        "name": "Madhepura",
        "id": "13",
        "district": "Madhepura",
        "type": "Lok Sabha"
      },
      "geometry": {
        "d": "M30,230 L130,240 L120,330 L20,320 Z"
      }
    },
    {
      "properties": {
        "name": "Darbhanga",
        "id": "14",
        "district": "Darbhanga",
        "type": "Lok Sabha"
      },
      "geometry": {
        "d": "M130,240 L230,250 L220,340 L120,330 Z"
      }
    },
    {
      "properties": {
        "name": "Muzaffarpur",
        "id": "15",
        "district": "Muzaffarpur",
        "type": "Lok Sabha"
      },
      "geometry": {
        "d": "M230,250 L330,260 L320,350 L220,340 Z"
      }
    },
    {
      "properties": {
        "name": "Vaishali",
        "id": "16",
        "district": "Vaishali",
        "type": "Lok Sabha"
      },
      "geometry": {
        "d": "M330,260 L430,270 L420,360 L320,350 Z"
      }
    },
    {
      "properties": {
        "name": "Gopalganj",
        "id": "17",
        "district": "Gopalganj",
        "type": "Lok Sabha"
      },
      "geometry": {
        "d": "M20,320 L120,330 L110,420 L10,410 Z"
      }
    },
    {
      "properties": {
        "name": "Siwan",
        "id": "18",
        "district": "Siwan",
        "type": "Lok Sabha"
      },
      "geometry": {
        "d": "M120,330 L220,340 L210,430 L110,420 Z"
      }
    },
    {
      "properties": {
        "name": "Maharajganj",
        "id": "19",
        "district": "Siwan",
        "type": "Lok Sabha"
      },
      "geometry": {
        "d": "M220,340 L320,350 L310,440 L210,430 Z"
      }
    },
    {
      "properties": {
        "name": "Saran",
        "id": "20",
        "district": "Saran",
        "type": "Lok Sabha"
      },
      "geometry": {
        "d": "M320,350 L420,360 L410,450 L310,440 Z"
      }
    },
    {
      "properties": {
        "name": "Hajipur",
        "id": "21",
        "district": "Vaishali",
        "type": "Lok Sabha"
      },
      "geometry": {
        "d": "M420,360 L520,370 L510,460 L410,450 Z"
      }
    },
    {
      "properties": {
        "name": "Ujiarpur",
        "id": "22",
        "district": "Samastipur",
        "type": "Lok Sabha"
      },
      "geometry": {
        "d": "M520,370 L620,380 L610,470 L510,460 Z"
      }
    },
    {
      "properties": {
        "name": "Samastipur",
        "id": "23",
        "district": "Samastipur",
        "type": "Lok Sabha"
      },
      "geometry": {
        "d": "M610,470 L620,380 L720,390 L710,480 Z"
      }
    },
    {
      "properties": {
        "name": "Begusarai",
        "id": "24",
        "district": "Begusarai",
        "type": "Lok Sabha"
      },
      "geometry": {
        "d": "M430,270 L530,280 L520,370 L420,360 Z"
      }
    },
    {
      "properties": {
        "name": "Khagaria",
        "id": "25",
        "district": "Khagaria",
        "type": "Lok Sabha"
      },
      "geometry": {
        "d": "M530,280 L630,290 L620,380 L520,370 Z"
      }
    },
    {
      "properties": {
        "name": "Bhagalpur",
        "id": "26",
        "district": "Bhagalpur",
        "type": "Lok Sabha"
      },
      "geometry": {
        "d": "M630,290 L730,300 L720,390 L620,380 Z"
      }
    },
    {
      "properties": {
        "name": "Banka",
        "id": "27",
        "district": "Banka",
        "type": "Lok Sabha"
      },
      "geometry": {
        "d": "M720,390 L730,300 L830,310 L820,400 Z"
      }
    },
    {
      "properties": {
        "name": "Munger",
        "id": "28",
        "district": "Munger",
        "type": "Lok Sabha"
      },
      "geometry": {
        "d": "M710,480 L720,390 L820,400 L810,490 Z"
      }
    },
    {
      "properties": {
        "name": "Lakhisarai",
        "id": "29",
        "district": "Lakhisarai",
        "type": "Lok Sabha"
      },
      "geometry": {
        "d": "M610,470 L710,480 L700,570 L600,560 Z"
      }
    },
    {
      "properties": {
        "name": "Sheikhpura",
        "id": "30",
        "district": "Sheikhpura",
        "type": "Lok Sabha"
      },
      "geometry": {
        "d": "M500,460 L600,470 L590,560 L490,550 Z"
      }
    },
    {
      "properties": {
        "name": "Nalanda",
        "id": "31",
        "district": "Nalanda",
        "type": "Lok Sabha"
      },
      "geometry": {
        "d": "M400,450 L500,460 L490,550 L390,540 Z"
      }
    },
    {
      "properties": {
        "name": "Patna Sahib",
        "id": "32",
        "district": "Patna",
        "type": "Lok Sabha"
      },
      "geometry": {
        "d": "M300,440 L400,450 L390,540 L290,530 Z"
      }
    },
    {
      "properties": {
        "name": "Patliputra",
        "id": "33",
        "district": "Patna",
        "type": "Lok Sabha"
      },
      "geometry": {
        "d": "M200,430 L300,440 L290,530 L190,520 Z"
      }
    },
    {
      "properties": {
        "name": "Arrah",
        "id": "34",
        "district": "Bhojpur",
        "type": "Lok Sabha"
      },
      "geometry": {
        "d": "M100,420 L200,430 L190,520 L90,510 Z"
      }
    },
    {
      "properties": {
        "name": "Buxar",
        "id": "35",
        "district": "Buxar",
        "type": "Lok Sabha"
      },
      "geometry": {
        "d": "M90,510 L190,520 L180,610 L80,600 Z"
      }
    },
    {
      "properties": {
        "name": "Sasaram",
        "id": "36",
        "district": "Rohtas",
        "type": "Lok Sabha"
      },
      "geometry": {
        "d": "M190,520 L290,530 L280,620 L180,610 Z"
      }
    },
    {
      "properties": {
        "name": "Karakat",
        "id": "37",
        "district": "Rohtas",
        "type": "Lok Sabha"
      },
      "geometry": {
        "d": "M290,530 L390,540 L380,630 L280,620 Z"
      }
    },
    {
      "properties": {
        "name": "Jahanabad",
        "id": "38",
        "district": "Jahanabad",
        "type": "Lok Sabha"
      },
      "geometry": {
        "d": "M390,540 L490,550 L480,640 L380,630 Z"
      }
    },
    {
      "properties": {
        "name": "Aurangabad",
        "id": "39",
        "district": "Aurangabad",
        "type": "Lok Sabha"
      },
      "geometry": {
        "d": "M490,550 L590,560 L580,650 L480,640 Z"
      }
    },
    {
      "properties": {
        "name": "Nawada",
        "id": "40",
        "district": "Nawada",
        "type": "Lok Sabha"
      },
      "geometry": {
        "d": "M590,560 L690,570 L680,660 L580,650 Z"
      }
    }
  ]
};

export default function BiharMap() {
  const [selected, setSelected] = useState(null);
  const [constituencies, setConstituencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all'); // 'all', 'selected'

  useEffect(() => {
    const loadMapData = async () => {
      try {
        console.log("Loading Bihar map data...");

        if (BIHAR_MAP_DATA && BIHAR_MAP_DATA.features) {
          console.log("Features found:", BIHAR_MAP_DATA.features.length);

          const formattedConstituencies = BIHAR_MAP_DATA.features.map(
            (feature, index) => {
              console.log("Processing feature:", feature.properties?.name);
              
              // Handle different possible data structures
              let pathData = '';
              let name = '';
              let id = '';
              let district = '';
              let type = '';

              // Extract path data
              if (feature.geometry) {
                if (feature.geometry.d) {
                  pathData = feature.geometry.d;
                } else if (feature.geometry.coordinates) {
                  console.log("Converting coordinates to path for:", feature.properties?.name);
                  pathData = convertCoordinatesToPath(feature.geometry.coordinates);
                }
              } else if (feature.d) {
                pathData = feature.d;
              }

              // Extract properties
              if (feature.properties) {
                name = feature.properties.name || 
                       feature.properties.NAME || 
                       feature.properties.constituency || 
                       feature.properties.CONSTITUENCY ||
                       `Constituency ${index + 1}`;
                id = feature.properties.id || 
                     feature.properties.ID || 
                     feature.properties.code ||
                     (index + 1).toString();
                district = feature.properties.district || 
                          feature.properties.DISTRICT || 
                          'Unknown District';
                type = feature.properties.type || 'Lok Sabha';
              } else {
                name = feature.name || `Constituency ${index + 1}`;
                id = feature.id || (index + 1).toString();
                district = 'Unknown District';
                type = 'Lok Sabha';
              }

              return {
                id: id,
                name: name,
                district: district,
                type: type,
                d: pathData,
              };
            }
          );
          
          // Filter out constituencies without valid path data
          const validConstituencies = formattedConstituencies.filter(
            constituency => constituency.d && constituency.d.length > 0
          );
          
          console.log("Valid constituencies loaded:", validConstituencies.length);
          setConstituencies(validConstituencies);
          
          if (validConstituencies.length === 0) {
            Alert.alert(
              'Warning',
              'No valid constituency data found. Please check your JSON structure.'
            );
          }
        } else {
          Alert.alert(
            'Error',
            'Failed to load Bihar map data. Invalid data structure.'
          );
        }
      } catch (error) {
        console.error('Error loading map data:', error);
        Alert.alert('Error', 'An unexpected error occurred while loading the map.');
      } finally {
        setLoading(false);
      }
    };

    loadMapData();
  }, []);

  // Helper function to convert coordinates to SVG path (if needed)
  const convertCoordinatesToPath = (coordinates) => {
    if (!coordinates || !Array.isArray(coordinates)) return '';
    
    try {
      let path = '';
      coordinates.forEach((ring, ringIndex) => {
        if (Array.isArray(ring)) {
          ring.forEach((point, pointIndex) => {
            if (Array.isArray(point) && point.length >= 2) {
              const [x, y] = point;
              if (pointIndex === 0) {
                path += `M ${x} ${y} `;
              } else {
                path += `L ${x} ${y} `;
              }
            }
          });
          path += 'Z ';
        }
      });
      return path;
    } catch (error) {
      console.error('Error converting coordinates to path:', error);
      return '';
    }
  };

  const handlePress = (constituency) => {
    console.log("Constituency pressed:", constituency.name);
    Alert.alert(
      `Constituency Selected`, 
      `Name: ${constituency.name}\nDistrict: ${constituency.district}\nType: ${constituency.type}\nID: ${constituency.id}`,
      [
        {
          text: "OK",
          onPress: () => setSelected(constituency.id)
        }
      ]
    );
  };

  const calculateViewBox = (constituencies) => {
    if (!constituencies || constituencies.length === 0) {
      return '0 0 1000 800'; // Default viewBox
    }

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    constituencies.forEach((constituency) => {
      const pathData = constituency.d;
      if (pathData) {
        // More robust path parsing using regex
        const numbers = pathData.match(/-?\d+\.?\d*/g);
        if (numbers) {
          for (let i = 0; i < numbers.length; i += 2) {
            const x = parseFloat(numbers[i]);
            const y = parseFloat(numbers[i + 1]);

            if (!isNaN(x) && !isNaN(y)) {
              minX = Math.min(minX, x);
              minY = Math.min(minY, y);
              maxX = Math.max(maxX, x);
              maxY = Math.max(maxY, y);
            }
          }
        }
      }
    });

    if (
      minX === Infinity ||
      minY === Infinity ||
      maxX === -Infinity ||
      maxY === -Infinity
    ) {
      return '0 0 1000 800'; // Default viewBox if parsing fails
    }

    const padding = 20;
    const width = maxX - minX + 2 * padding;
    const height = maxY - minY + 2 * padding;
    
    return `${minX - padding} ${minY - padding} ${width} ${height}`;
  };

  const getFilteredConstituencies = () => {
    if (filterType === 'selected' && selected) {
      return constituencies.filter(c => c.id === selected);
    }
    return constituencies;
  };

  const resetSelection = () => {
    setSelected(null);
    setFilterType('all');
  };

  const viewBox = calculateViewBox(constituencies);
  const filteredConstituencies = getFilteredConstituencies();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading Bihar map...</Text>
        </View>
      ) : constituencies.length > 0 ? (
        <View style={styles.mapContainer}>
          {/* Header */}
          <Text style={styles.title}>Bihar Constituencies Map</Text>
          <Text style={styles.subtitle}>
            Total Constituencies: {constituencies.length}
          </Text>
          
          {/* Controls */}
          <View style={styles.controlsContainer}>
            <TouchableOpacity 
              style={[styles.controlButton, filterType === 'all' && styles.activeButton]}
              onPress={() => setFilterType('all')}
            >
              <Text style={[styles.controlButtonText, filterType === 'all' && styles.activeButtonText]}>
                Show All
              </Text>
            </TouchableOpacity>
            
            {selected && (
              <TouchableOpacity 
                style={[styles.controlButton, filterType === 'selected' && styles.activeButton]}
                onPress={() => setFilterType('selected')}
              >
                <Text style={[styles.controlButtonText, filterType === 'selected' && styles.activeButtonText]}>
                  Show Selected
                </Text>
              </TouchableOpacity>
            )}
            
            {selected && (
              <TouchableOpacity 
                style={styles.resetButton}
                onPress={resetSelection}
              >
                <Text style={styles.resetButtonText}>Reset</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Map */}
          <View style={styles.mapWrapper}>
            <Svg
              width={screen.width - 20}
              height={screen.width * 1.2}
              viewBox={viewBox}
              style={styles.svg}
            >
              <G>
                {filteredConstituencies.map((constituency) => (
                  <Path
                    key={constituency.id}
                    d={constituency.d}
                    fill={selected === constituency.id ? '#FF6B6B' : '#4ECDC4'}
                    stroke="#2C3E50"
                    strokeWidth={selected === constituency.id ? 2 : 0.8}
                    onPress={() => handlePress(constituency)}
                  />
                ))}
              </G>
            </Svg>
          </View>

          {/* Selected constituency info */}
          {selected && (
            <View style={styles.selectedInfo}>
              {(() => {
                const selectedConstituency = constituencies.find(c => c.id === selected);
                return selectedConstituency ? (
                  <View>
                    <Text style={styles.selectedTitle}>Selected Constituency:</Text>
                    <Text style={styles.selectedName}>{selectedConstituency.name}</Text>
                    <Text style={styles.selectedDetails}>District: {selectedConstituency.district}</Text>
                    <Text style={styles.selectedDetails}>Type: {selectedConstituency.type}</Text>
                  </View>
                ) : null;
              })()}
            </View>
          )}
          
          {/* Constituencies List */}
          <View style={styles.listContainer}>
            <Text style={styles.listTitle}>
              Constituencies List ({filteredConstituencies.length}):
            </Text>
            {filteredConstituencies.map((constituency, index) => (
              <TouchableOpacity
                key={constituency.id}
                style={[
                  styles.listItem,
                  selected === constituency.id && styles.selectedListItem
                ]}
                onPress={() => handlePress(constituency)}
              >
                <View style={styles.listItemContent}>
                  <Text style={[
                    styles.listItemName,
                    selected === constituency.id && styles.selectedListItemText
                  ]}>
                    {index + 1}. {constituency.name}
                  </Text>
                  <Text style={[
                    styles.listItemDistrict,
                    selected === constituency.id && styles.selectedListItemText
                  ]}>
                    {constituency.district}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ) : (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            Failed to load map data. Please check your data structure.
          </Text>
          <Text style={styles.errorHint}>
            Expected structure: {`{ "features": [{ "properties": { "name": "...", "id": "..." }, "geometry": { "d": "..." } }] }`}
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollContent: {
    paddingBottom: 30,
  },
  mapContainer: {
    alignItems: 'center',
    padding: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#7F8C8D',
    marginBottom: 20,
    textAlign: 'center',
  },
  controlsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 10,
  },
  controlButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#4ECDC4',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  activeButton: {
    backgroundColor: '#4ECDC4',
  },
  controlButtonText: {
    color: '#4ECDC4',
    fontWeight: '600',
    fontSize: 14,
  },
  activeButtonText: {
    color: '#FFFFFF',
  },
  resetButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#FF6B6B',
    borderRadius: 25,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  mapWrapper: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    marginBottom: 20,
  },
  svg: {
    borderRadius: 15,
  },
  selectedInfo: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    width: '90%',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  selectedTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 8,
  },
  selectedName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6B6B',
    marginBottom: 8,
  },
  selectedDetails: {
    fontSize: 16,
    color: '#7F8C8D',
    marginBottom: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 400,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#555',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    minHeight: 400,
  },
  errorText: {
    fontSize: 18,
    color: '#E74C3C',
    textAlign: 'center',
    marginBottom: 15,
    fontWeight: '600',
  },
  errorHint: {
    fontSize: 14,
    color: '#7F8C8D',
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 20,
  },
  listContainer: {
    marginTop: 20,
    width: '100%',
    paddingHorizontal: 10,
  },
  listTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 15,
    textAlign: 'center',
  },
  listItem: {
    backgroundColor: '#FFFFFF',
    marginVertical: 3,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  selectedListItem: {
    backgroundColor: '#FF6B6B',
  },
  listItemContent: {
    padding: 15,
  },
  listItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 4,
  },
  listItemDistrict: {
    fontSize: 14,
    color: '#7F8C8D',
    fontStyle: 'italic',
  },
  selectedListItemText: {
    color: '#FFFFFF',
  },
});