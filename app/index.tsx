// app/index.tsx
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator, 
  FlatList, 
  StyleSheet 
} from 'react-native';
import { FlatDTO } from './types/FlatDTO';
import FlatCard from './components/FlatCard';

const BACKEND_HOST = "3.67.172.45:8080";

export default function HomeScreen() {
  const [flats, setFlats] = useState<FlatDTO[]>([]);
  const [loading, setLoading] = useState(false);

  // Filter states
  const [locationFilter, setLocationFilter] = useState('');
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(3000);
  const [roomNumberFilter, setRoomNumberFilter] = useState<number>(0);
  const [selectedDistance, setSelectedDistance] = useState<number>(0);

  const handleSearch = async () => {
    setLoading(true);
    try {
      // Construct query parameters based on filter state.
      const params = new URLSearchParams();
      if (locationFilter) params.append('location', locationFilter);
      if (minPrice) params.append('minPrice', minPrice.toString());
      if (maxPrice) params.append('maxPrice', maxPrice.toString());
      if (roomNumberFilter) params.append('roomNumber', roomNumberFilter.toString());
      // Use selectedDistance as maxDistance filter if provided.
      if (selectedDistance && selectedDistance !== 0) {
        params.append('maxDistance', selectedDistance.toString());
      }

      // Build the URL using the fixed backend host.
      const url = `http://${BACKEND_HOST}/api/flats/filter?${params.toString()}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data: FlatDTO[] = await response.json();
      setFlats(data);
    } catch (error) {
      console.error('Error fetching flats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Search for Flats or Services</Text>
      
      {/* Filter inputs */}
      <TextInput
        style={styles.input}
        placeholder="Enter location"
        value={locationFilter}
        onChangeText={setLocationFilter}
      />
      <TextInput
        style={styles.input}
        placeholder="Min Price"
        value={minPrice ? minPrice.toString() : ''}
        keyboardType="numeric"
        onChangeText={(text) => setMinPrice(Number(text))}
      />
      <TextInput
        style={styles.input}
        placeholder="Max Price"
        value={maxPrice ? maxPrice.toString() : ''}
        keyboardType="numeric"
        onChangeText={(text) => setMaxPrice(Number(text))}
      />
      <TextInput
        style={styles.input}
        placeholder="Room Number"
        value={roomNumberFilter ? roomNumberFilter.toString() : ''}
        keyboardType="numeric"
        onChangeText={(text) => setRoomNumberFilter(Number(text))}
      />
      <TextInput
        style={styles.input}
        placeholder="Max Distance (km)"
        value={selectedDistance ? selectedDistance.toString() : ''}
        keyboardType="numeric"
        onChangeText={(text) => setSelectedDistance(Number(text))}
      />
      
      <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
        <Text style={styles.searchButtonText}>SEARCH</Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator size="large" color="#007BFF" />}

      {flats.length === 0 && !loading ? (
        <Text style={styles.noFlatsText}>No flats found.</Text>
      ) : (
        <FlatList
          data={flats}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <FlatCard flat={item} />}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 16, 
    backgroundColor: '#FFF' 
  },
  title: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    marginBottom: 16 
  },
  input: { 
    borderWidth: 1, 
    borderColor: '#ccc', 
    padding: 8, 
    marginBottom: 12, 
    borderRadius: 4 
  },
  searchButton: { 
    backgroundColor: 'green', 
    paddingVertical: 12, 
    borderRadius: 8, 
    alignItems: 'center', 
    marginBottom: 16 
  },
  searchButtonText: { 
    color: '#fff', 
    fontWeight: 'bold' 
  },
  listContainer: { 
    paddingBottom: 20 
  },
  noFlatsText: { 
    marginTop: 16, 
    textAlign: 'center', 
    color: '#888' 
  },
});
