import React, { useRef } from 'react';
import { Button, Dimensions, StyleSheet, Text, View } from 'react-native';
import MapView, { Callout, Marker } from 'react-native-maps';

// Get screen dimensions for responsive map size
const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;

// Approximate initial region for Bihar, India
// These values might need fine-tuning based on desired initial zoom level
const BIHAR_REGION = {
  latitude: 25.5941, // Central latitude for Bihar
  longitude: 85.1376, // Central longitude for Bihar
  latitudeDelta: 3.5, // Adjust this for initial vertical zoom (smaller value = more zoom)
  longitudeDelta: 3.5 * ASPECT_RATIO, // Adjust this for initial horizontal zoom
};

// Mock data for election parties in Bihar with approximate coordinates and symbols
// In a real application, you would fetch real data and use actual party logos (images)
const electionParties = [
  {
    id: 'rjd',
    name: 'Rashtriya Janata Dal (RJD)',
    symbol: '🏮', // Lantern emoji
    coordinates: { latitude: 25.61, longitude: 85.14 }, // Patna (RJD stronghold)
    description: 'Bihar-based political party, led by Lalu Prasad Yadav.',
  },
  {
    id: 'jdu',
    name: 'Janata Dal (United) (JD(U))',
    symbol: '🏹', // Arrow emoji
    coordinates: { latitude: 25.70, longitude: 85.20 }, // Slightly north of Patna
    description: 'Ruling political party in Bihar, led by Nitish Kumar.',
  },
  {
    id: 'bjp',
    name: 'Bharatiya Janata Party (BJP)',
    symbol: '🌸', // Lotus emoji
    coordinates: { latitude: 25.40, longitude: 84.90 }, // Near Gaya
    description: 'Major national political party, alliance partner in Bihar.',
  },
  {
    id: 'inc',
    name: 'Indian National Congress (INC)',
    symbol: '✋', // Hand emoji
    coordinates: { latitude: 25.80, longitude: 85.50 }, // Near Hajipur
    description: 'Major national political party, opposition in Bihar.',
  },
  {
    id: 'ljp',
    name: 'Lok Janshakti Party (LJP)',
    symbol: '🏠', // House emoji
    coordinates: { latitude: 25.20, longitude: 85.00 }, // Central Bihar
    description: 'Bihar-based political party.',
  },
];

export default function MapScreen() {
  const mapRef = useRef(null); // Ref to access MapView methods

  // Function to fit all markers into the visible map area
  const fitAllMarkers = () => {
    if (mapRef.current) {
      // Get all marker identifiers
      const markerIdentifiers = electionParties.map(party => party.id);
      mapRef.current.fitToSuppliedMarkers(markerIdentifiers, {
        edgePadding: { top: 100, right: 50, bottom: 50, left: 50 }, // Padding around markers
        animated: true, // Animate the zoom
      });
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef} // Assign ref to MapView
        style={styles.map}
        initialRegion={BIHAR_REGION} // Set initial region to Bihar
        // Optional: enable user gestures for zooming and panning
        zoomEnabled={true}
        scrollEnabled={true}
        showsUserLocation={false} // Adjust as needed
      >
        {/* Render markers for each election party */}
        {electionParties.map(party => (
          <Marker
            key={party.id}
            identifier={party.id} // Important for fitToSuppliedMarkers
            coordinate={party.coordinates}
            title={party.name}
            // You can customize the marker itself using a View component
            // For custom image, use <Image source={require('path/to/image.png')} style={{width: 30, height: 30}} />
          >
            {/* Custom Marker View (using emoji as symbol) */}
            <View style={styles.customMarker}>
              <Text style={styles.markerSymbol}>{party.symbol}</Text>
            </View>

            {/* Callout that appears when marker is tapped */}
            <Callout style={styles.callout}>
              <View>
                <Text style={styles.calloutTitle}>{party.name}</Text>
                <Text style={styles.calloutDescription}>{party.description}</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

      {/* Button to programmatically zoom to fit all markers */}
      <View style={styles.buttonContainer}>
        <Button title="Show All Party Symbols" onPress={fitAllMarkers} color="#007bff" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: width, // Map takes full width
    height: height, // Map takes full height
  },
  customMarker: {
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  markerSymbol: {
    fontSize: 24, // Size of the emoji
  },
  callout: {
    width: 200,
    padding: 10,
  },
  calloutTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  calloutDescription: {
    fontSize: 14,
    color: '#555',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
});
