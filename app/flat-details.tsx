import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';

// Mock data for flats (replace this with actual data fetching)
const flats = [
  {
    id: '1',
    location: 'Warsaw',
    price: '$1200/month',
    description: 'Spacious 2-bedroom apartment in the city center.',
    amenities: ['WiFi', 'AC', 'Parking'],
    images: ['https://via.placeholder.com/300', 'https://via.placeholder.com/300'],
  },
  {
    id: '2',
    location: 'Berlin',
    price: '$1500/month',
    description: 'Modern 1-bedroom apartment near the park.',
    amenities: ['WiFi', 'Gym', 'Balcony'],
    images: ['https://via.placeholder.com/300', 'https://via.placeholder.com/300'],
  },
  {
    id: '3',
    location: 'Paris',
    price: '$2000/month',
    description: 'Luxurious 3-bedroom apartment with a view of the Eiffel Tower.',
    amenities: ['WiFi', 'AC', 'Pool', 'Parking'],
    images: ['https://via.placeholder.com/300', 'https://via.placeholder.com/300'],
  },
];

export default function FlatDetailsScreen() {
  const { id } = useLocalSearchParams();

  // Find the flat details based on the ID
  const flat = flats.find((f) => f.id === id);

  if (!flat) {
    return (
      <View style={styles.container}>
        <Text>Flat not found!</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Image Carousel */}
      <Image source={{ uri: flat.images[0] }} style={styles.image} />

      {/* Flat Details */}
      <Text style={styles.location}>{flat.location}</Text>
      <Text style={styles.price}>{flat.price}</Text>
      <Text style={styles.description}>{flat.description}</Text>

      {/* Amenities */}
      <Text style={styles.sectionTitle}>Amenities</Text>
      <View style={styles.amenitiesContainer}>
        {flat.amenities.map((amenity, index) => (
          <Text key={index} style={styles.amenity}>
            • {amenity}
          </Text>
        ))}
      </View>

      {/* Book Now Button */}
      <TouchableOpacity
        style={styles.bookNowButton}
        onPress={() => router.push(`/booking-summary?id=${flat.id}`)}
      >
        <Text style={styles.bookNowButtonText}>Book Now</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  location: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  price: {
    fontSize: 20,
    color: '#007BFF',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  amenitiesContainer: {
    marginBottom: 16,
  },
  amenity: {
    fontSize: 16,
    color: '#888',
  },
  bookNowButton: {
    backgroundColor: '#007BFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  bookNowButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
