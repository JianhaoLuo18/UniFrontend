// app/index.tsx
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator, 
  FlatList, 
  StyleSheet, 
  Image, 
  Dimensions 
} from 'react-native';
import { FlatDTO } from './types/FlatDTO';
import FlatCard from './components/FlatCard';

const BACKEND_HOST = "3.67.172.45:8080";
const { width } = Dimensions.get('window'); 

export default function HomeScreen() {
  const [flats, setFlats] = useState<FlatDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [locationFilter, setLocationFilter] = useState('');
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [roomNumberFilter, setRoomNumberFilter] = useState<number | null>(null);
  const [selectedDistance, setSelectedDistance] = useState<number | null>(null);

  const fetchFlats = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://${BACKEND_HOST}/api/flats`);
      if (!response.ok) throw new Error('Failed to fetch flats');
      const data: FlatDTO[] = await response.json();
      setFlats(data);
    } catch (error) {
      console.error('Error fetching flats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (locationFilter) params.append('location', locationFilter);
      if (minPrice !== null) params.append('minPrice', minPrice.toString());
      if (maxPrice !== null) params.append('maxPrice', maxPrice.toString());
      if (roomNumberFilter !== null) params.append('roomNumber', roomNumberFilter.toString());
      if (selectedDistance !== null) params.append('maxDistance', selectedDistance.toString());

      const url = `http://${BACKEND_HOST}/api/flats/filter?${params.toString()}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Network response was not ok');
      const data: FlatDTO[] = await response.json();
      setFlats(data);
    } catch (error) {
      console.error('Error fetching flats:', error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchFlats();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Search for Flats</Text>
    
      <TouchableOpacity onPress={() => setShowFilters(!showFilters)} style={styles.filterButton}>
        <Text style={styles.filterButtonText}>{showFilters ? 'Hide Filters' : 'Show Filters'}</Text>
      </TouchableOpacity>

      {showFilters && (
        <View style={styles.filtersContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter location"
            placeholderTextColor="#666"
            value={locationFilter}
            onChangeText={setLocationFilter}
          />
          <TextInput
            style={styles.input}
            placeholder="Min Price"
            placeholderTextColor="#666"
            value={minPrice !== null ? minPrice.toString() : ''}
            keyboardType="numeric"
            onChangeText={(text) => setMinPrice(text ? Number(text) : null)}
          />
          <TextInput
            style={styles.input}
            placeholder="Max Price"
            placeholderTextColor="#666"
            value={maxPrice !== null ? maxPrice.toString() : ''}
            keyboardType="numeric"
            onChangeText={(text) => setMaxPrice(text ? Number(text) : null)}
          />
          <TextInput
            style={styles.input}
            placeholder="Room Number"
            placeholderTextColor="#666"
            value={roomNumberFilter !== null ? roomNumberFilter.toString() : ''}
            keyboardType="numeric"
            onChangeText={(text) => setRoomNumberFilter(text ? Number(text) : null)}
          />
          <TextInput
            style={styles.input}
            placeholder="Max Distance (km)"
            placeholderTextColor="#666"
            value={selectedDistance !== null ? selectedDistance.toString() : ''}
            keyboardType="numeric"
            onChangeText={(text) => setSelectedDistance(text ? Number(text) : null)}
          />

          <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
            <Text style={styles.searchButtonText}>Apply Filters</Text>
          </TouchableOpacity>
        </View>
      )}

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
    backgroundColor: '#f2f2f2'  
  },
  title: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    marginBottom: 16,
    textAlign: 'center'
  },
  filterButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  filterButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  filtersContainer: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  input: { 
    borderWidth: 1, 
    borderColor: '#ccc', 
    backgroundColor: '#fff',
    padding: 8, 
    marginBottom: 10, 
    borderRadius: 6,
    color: '#000'
  },
  searchButton: { 
    backgroundColor: 'green', 
    paddingVertical: 12, 
    borderRadius: 8, 
    alignItems: 'center', 
    marginTop: 8
  },
  searchButtonText: { 
    color: '#fff', 
    fontWeight: 'bold', 
    fontSize: 16
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