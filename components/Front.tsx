import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import MapView, { Polygon, PROVIDER_GOOGLE } from 'react-native-maps';

export default function BiharGoogleMap() {
  const [loading, setLoading] = useState(false);

  // Sample simplified data for demo — 2 example constituencies
  const polygons = [
    {
      id: '1',
      name: 'Patna Sahib',
      coordinates: [
        { latitude: 25.615, longitude: 85.141 },
        { latitude: 25.620, longitude: 85.170 },
        { latitude: 25.640, longitude: 85.150 },
        { latitude: 25.625, longitude: 85.120 },
        { latitude: 25.615, longitude: 85.141 }, // Closing loop
      ],
    },
    {
      id: '2',
      name: 'Gaya',
      coordinates: [
        { latitude: 24.792, longitude: 85.004 },
        { latitude: 24.805, longitude: 85.050 },
        { latitude: 24.830, longitude: 85.030 },
        { latitude: 24.810, longitude: 84.990 },
        { latitude: 24.792, longitude: 85.004 },
      ],
    },
    // You can add more constituencies here similarly
  ];

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text>Loading map...</Text>
      </View>
    );
  }

  return (
    <MapView
      provider={PROVIDER_GOOGLE}
      style={styles.map}
      initialRegion={{
        latitude: 25.5,
        longitude: 85.1,
        latitudeDelta: 3,
        longitudeDelta: 3,
      }}
    >
      {polygons.map((poly) => (
        <Polygon
          key={poly.id}
          coordinates={poly.coordinates}
          strokeColor="#000"
          fillColor="rgba(255, 100, 100, 0.4)"
          strokeWidth={2}
          tappable={true}
          onPress={() => alert(`Constituency: ${poly.name}`)}
        />
      ))}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
