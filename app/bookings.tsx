import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { BookingDTO } from './types/BookingDTO';
import BookingCard from './components/BookingCard';

const BACKEND_HOST = "3.67.172.45:8080";
// Hard-coded user email for demo purposes.
const USER_EMAIL = "john.doe@example.com";

export default function BookingSummaryScreen() {
  const [bookings, setBookings] = useState<BookingDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  // Fetch active bookings by user email.
  const fetchActiveBookings = useCallback(async () => {
    setLoading(true);
    try {
      const url = `http://${BACKEND_HOST}/api/bookings/active?userEmail=${encodeURIComponent(USER_EMAIL)}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch bookings.');
      }
      const data: BookingDTO[] = await response.json();
      setBookings(data);
    } catch (error: any) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchActiveBookings();
  }, [fetchActiveBookings]);

  // Callback passed to BookingCard to refresh list after cancellation.
  const handleCancelRefresh = () => {
    fetchActiveBookings();
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchActiveBookings();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Active Bookings</Text>
      {loading && !refreshing ? (
        <ActivityIndicator size="large" color="#007BFF" />
      ) : bookings.length === 0 ? (
        <Text style={styles.noBookingsText}>No active bookings found.</Text>
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <BookingCard booking={item} onCancel={handleCancelRefresh} />
          )}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF', paddingTop: 16 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 16 },
  listContainer: { paddingBottom: 20 },
  noBookingsText: { textAlign: 'center', color: '#888', fontSize: 16, marginTop: 20 },
});
