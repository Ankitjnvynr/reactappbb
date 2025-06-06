import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

// Define the App component
export default function chantsScreen() {
  const [showChants, setShowChants] = useState(false);

  // Conditional rendering based on showChants state
  if (showChants) {
    return <ChantsScreen setShowChants={setShowChants} />;
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Namaskaram</Text>
        <MaterialIcons name="notifications-off" size={24} color="black" />
      </View>

      {/* Quote Section */}
      <View style={styles.quoteContainer}>
        <Image
          source={{ uri: 'https://your-image-url.com' }} // Replace with your image link
          style={styles.image}
        />
        <View style={styles.quoteTextContainer}>
          <Text style={styles.quoteText}>
            "People who have made a hell out of themselves want to go to heaven. People who have made heaven out..."
          </Text>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Start Your Day</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Livestream Section */}
      <View style={styles.livestreamContainer}>
        <Text style={styles.livestreamTitle}>Livestream</Text>
        <Image
          source={{ uri: 'https://your-livestream-image-url.com' }} // Replace with your livestream image link
          style={styles.livestreamImage}
        />
        <Text style={styles.livestreamDescription}>
          Loneliness: In is the Only Way Out | A conversation between Vivek Murthy & Sadhguru
        </Text>
      </View>

      {/* Button to Show Chants */}
      <TouchableOpacity
        style={styles.chantsButton}
        onPress={() => setShowChants(true)}>
        <Text style={styles.chantsButtonText}>Go to Chants</Text>
      </TouchableOpacity>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity>
          <MaterialIcons name="home" size={30} color="black" />
        </TouchableOpacity>
        <TouchableOpacity>
          <MaterialIcons name="explore" size={30} color="black" />
        </TouchableOpacity>
        <TouchableOpacity>
          <MaterialIcons name="fitness-center" size={30} color="black" />
        </TouchableOpacity>
        <TouchableOpacity>
          <MaterialIcons name="engineering" size={30} color="black" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// Define types for ChantsScreen
type ChantsScreenProps = {
  setShowChants: (show) => void;
};

// ChantsScreen component
function ChantsScreen({ setShowChants }: ChantsScreenProps) {
  return (
    <View style={chantsStyles.container}>
      <Text style={chantsStyles.text}>Chants</Text>
      <TouchableOpacity
        style={chantsStyles.backButton}
        onPress={() => setShowChants(false)}>
        <Text style={chantsStyles.backButtonText}>Go Back</Text>
      </TouchableOpacity>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFEECC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    alignItems: 'center',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  quoteContainer: {
    backgroundColor: '#FFF7E5',
    marginHorizontal: 20,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: 200,
  },
  quoteTextContainer: {
    padding: 20,
  },
  quoteText: {
    fontSize: 16,
    marginBottom: 10,
    color: '#555',
  },
  button: {
    backgroundColor: '#66C2FF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  livestreamContainer: {
    padding: 20,
  },
  livestreamTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  livestreamImage: {
    width: '100%',
    height: 150,
    marginBottom: 10,
  },
  livestreamDescription: {
    fontSize: 16,
    color: '#555',
  },
  chantsButton: {
    backgroundColor: '#66C2FF',
    padding: 15,
    marginHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  chantsButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderColor: '#DDD',
  },
});

const chantsStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFEECC',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  backButton: {
    marginTop: 20,
    backgroundColor: '#66C2FF',
    padding: 10,
    borderRadius: 5,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
