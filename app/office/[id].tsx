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

const API_URL = "https://officely-epdmeqcbe7c0a8gq.polandcentral-01.azurewebsites.net/offices";

export default function OfficeDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();
  const [office, setOffice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchOfficeDetails = async () => {
      try {
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setOffice(data);
      } catch (error) {
        console.error('Error fetching office details:', error);
        setErrorMessage('Error fetching office details.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOfficeDetails();
    }
  }, [id]);

  const handleBook = () => {
    if (!office) return;
    navigation.navigate('office_booking', { officeId: office.id });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  if (!office) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{errorMessage || 'Office details not available.'}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{office.name}</Text>
      {office.images && office.images.length > 0 && (
        <ScrollView horizontal style={styles.imagesContainer}>
          {office.images.map((img, index) => (
            <Image
              key={index}
              source={{ uri: `data:image/png;base64,${img.data}` }}
              style={styles.image}
            />
          ))}
        </ScrollView>
      )}
      <Text style={styles.label}>Location:</Text>
      <Text style={styles.value}>{office.address}, {office.city}, {office.country}</Text>
      <Text style={styles.label}>Price:</Text>
      <Text style={styles.value}>${office.price} / day</Text>
      <Text style={styles.label}>Room Number:</Text>
      <Text style={styles.value}>{office.roomNumber}</Text>
      <Text style={styles.label}>Floor:</Text>
      <Text style={styles.value}>{office.floor}</Text>
      <Text style={styles.label}>Amenities:</Text>
      {office.amenities && office.amenities.length > 0 ? (
        office.amenities.map((amenity, index) => (
          <Text key={index} style={styles.value}>• {amenity.name}</Text>
        ))
      ) : (
        <Text style={styles.value}>No amenities listed.</Text>
      )}
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
