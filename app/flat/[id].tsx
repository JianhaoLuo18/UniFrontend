// app/flat/[id].tsx
import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  ActivityIndicator, 
  TouchableOpacity,
  Image
} from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { FlatDTO } from '../../types/FlatDTO';

const BACKEND_HOST = "3.67.172.45:8080";

export default function FlatDetailScreen() {
  // Retrieve the 'id' parameter from the URL.
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();
  const [flat, setFlat] = useState<FlatDTO | null>(null);
  const [loading, setLoading] = useState(true);

  // Helper function to correctly determine the image URL.
  const getImageUrl = (img: string) => {
    // If the image URL already starts with http, return it directly.
    if (img.startsWith("http")) {
      return img;
    }
    // Otherwise, assume it's a relative URL from the backend.
    return `http://${BACKEND_HOST}/${img}`;
  };

  useEffect(() => {
    const fetchFlatDetails = async () => {
      try {
        const response = await fetch(`http://${BACKEND_HOST}/api/flats/${id}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data: FlatDTO = await response.json();
        setFlat(data);
      } catch (error) {
        console.error('Error fetching flat details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchFlatDetails();
    }
  }, [id]);

  // Update the header title to the flat's name.
  useEffect(() => {
    if (flat) {
      navigation.setOptions({ title: flat.name });
    }
  }, [flat, navigation]);

  // Handler for the "Book Now" button.
  const handleBook = () => {
    // Fixed user context
    // Navigate to the booking page, passing the flatId.
    navigation.navigate('booking', { flatId: flat?.id });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  if (!flat) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Flat details not available.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Display the flat name as the main title */}
      <Text style={styles.title}>{flat.name}</Text>
      
      {/* Display Images if available */}
      {flat.images && flat.images.length > 0 && (
        <>
          <Text style={styles.label}>Images:</Text>
          <ScrollView horizontal style={styles.imagesContainer}>
            {flat.images.map((img, index) => (
              <Image
                key={index}
                source={{ uri: getImageUrl(img) }}
                style={styles.image}
              />
            ))}
          </ScrollView>
        </>
      )}

      <Text style={styles.label}>Location:</Text>
      <Text style={styles.value}>{flat.location}</Text>
      
      <Text style={styles.label}>Price:</Text>
      <Text style={styles.value}>${flat.price} / month</Text>
      
      <Text style={styles.label}>Room Number:</Text>
      <Text style={styles.value}>{flat.roomNumber}</Text>
      
      <Text style={styles.label}>Distance:</Text>
      <Text style={styles.value}>{flat.distance} km away</Text>
      
      <Text style={styles.label}>Description:</Text>
      <Text style={styles.value}>{flat.description}</Text>
      
      <Text style={styles.label}>Amenities:</Text>
      {flat.amenities && flat.amenities.length > 0 ? (
        flat.amenities.map((amenity, index) => (
          <Text key={index} style={styles.value}>• {amenity}</Text>
        ))
      ) : (
        <Text style={styles.value}>No amenities listed.</Text>
      )}

      {/* "Book Now" button */}
      <TouchableOpacity onPress={handleBook} style={styles.bookButton}>
        <Text style={styles.bookButtonText}>Book Now</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#FFF' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  label: { fontSize: 16, fontWeight: 'bold', marginTop: 12 },
  value: { fontSize: 16, marginTop: 4 },
  errorText: { fontSize: 18, color: 'red', textAlign: 'center', marginTop: 20 },
  bookButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 20,
  },
  bookButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  imagesContainer: {
    marginVertical: 12,
  },
  image: {
    width: 300,
    height: 200,
    marginRight: 10,
    borderRadius: 8,
    resizeMode: 'cover',
  },
});
