import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useEffect } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

export default function Index() {
  // Shared values for animations
  const fadeAnim = useSharedValue(0);
  const slideAnim = useSharedValue(300);

  useEffect(() => {
    // Animate the opacity and position on component mount
    fadeAnim.value = withTiming(1, { duration: 1000 });
    slideAnim.value = withTiming(0, { duration: 1000 });
  }, []);

  // Animated styles
  const fadeStyle = useAnimatedStyle(() => ({
    opacity: fadeAnim.value,
  }));

  const slideStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: slideAnim.value }],
  }));

  return (
    <ScrollView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Home</Text>
        <TouchableOpacity>
          <FontAwesome name="search" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* EXCLUSIVE Section with slide animation */}
      <Animated.View style={[styles.sectionHeader, slideStyle]}>
        <Text style={styles.sectionHeaderText}>EXCLUSIVE</Text>
      </Animated.View>

      {/* Horizontal Scroll Cards with fade animation */}
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
        <Animated.View style={[styles.card, fadeStyle]}>
          <Image source={{ uri: 'https://via.placeholder.com/150' }} style={styles.cardImage} />
          <Text style={styles.cardText}>Geometry of Life</Text>
        </Animated.View>

        <Animated.View style={[styles.card, fadeStyle]}>
          <Image source={{ uri: 'https://via.placeholder.com/150' }} style={styles.cardImage} />
          <Text style={styles.cardText}>Intimate Moments with Sadhguru</Text>
        </Animated.View>
      </ScrollView>

      {/* Explore Section */}
      <View style={styles.sectionHeader}>
  <Text style={styles.sectionHeaderText}>Bhagavad gita adhyay</Text>
</View>

<ScrollView 
  horizontal={true} 
  showsHorizontalScrollIndicator={false} 
  style={styles.exploreSlider}
  contentContainerStyle={{ paddingHorizontal: 16 }}
>
  {/* Card 1 */}
  <TouchableOpacity style={styles.exploreCard}>
    <Image source={{ uri: 'https://via.placeholder.com/150' }} style={styles.exploreImage} />
    <Text style={styles.exploreText}>Creation & Mysticism</Text>
  </TouchableOpacity>

  {/* Card 2 */}
  <TouchableOpacity style={styles.exploreCard}>
    <Image source={{ uri: 'https://via.placeholder.com/150' }} style={styles.exploreImage} />
    <Text style={styles.exploreText}>Spirituality & Seeking</Text>
  </TouchableOpacity>

  {/* Add more cards here */}
  <TouchableOpacity style={styles.exploreCard}>
    <Image source={{ uri: 'https://via.placeholder.com/150' }} style={styles.exploreImage} />
    <Text style={styles.exploreText}>Inner Engineering</Text>
  </TouchableOpacity>

  <TouchableOpacity style={styles.exploreCard}>
    <Image source={{ uri: 'https://via.placeholder.com/150' }} style={styles.exploreImage} />
    <Text style={styles.exploreText}>Yoga & Meditation</Text>
  </TouchableOpacity>

</ScrollView>


      {/* Bottom Navigation */}
      {/* <View style={styles.bottomNav}>
        <TouchableOpacity>
          <FontAwesome name="home" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity>
          <FontAwesome name="book" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity>
          <FontAwesome name="search" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity>
          <FontAwesome name="user" size={24} color="white" />
        </TouchableOpacity>
      </View> */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#333',
  },
  headerText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  sectionHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  horizontalScroll: {
    paddingLeft: 16,
  },
  card: {
    marginRight: 16,
    width: 150,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  cardImage: {
    width: '100%',
    height: 100,
  },
  cardText: {
    padding: 8,
    fontSize: 14,
    color: '#333',
  },
  exploreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  exploreCard: {
    width: '48%',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  exploreImage: {
    width: '100%',
    height: 100,
  },
  exploreText: {
    padding: 8,
    fontSize: 14,
    color: '#333',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    backgroundColor: '#333',
  },
  exploreSlider: {
    marginVertical: 16,
  },
  exploreCard: {
    marginRight: 16, // Space between cards
    width: 150,      // Set a fixed width for each card
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  exploreImage: {
    width: '100%',
    height: 100,
  },
  exploreText: {
    padding: 8,
    fontSize: 14,
    color: '#333',
  },
});
