import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import OfficeCard from './components/OfficeCard';

const API_URL = "https://officely-epdmeqcbe7c0a8gq.polandcentral-01.azurewebsites.net/offices";

export default function OfficesScreen() {
  const [offices, setOffices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const fetchOffices = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error('Failed to fetch offices.');
      }
      const data = await response.json();
      setOffices(data);
    } catch (error) {
      console.error('Error fetching offices:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOffices();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchOffices();
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#007BFF" />
      ) : offices.length === 0 ? (
        <Text style={styles.noOfficesText}>No offices available.</Text>
      ) : (
        <FlatList
          data={offices}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <OfficeCard office={item} />}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF', paddingTop: 16 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 16 },
  noOfficesText: { textAlign: 'center', color: '#888', fontSize: 16, marginTop: 20 },
});
