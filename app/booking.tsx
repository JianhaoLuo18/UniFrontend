// app/booking.tsx
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView 
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { BookingDTO } from './types/BookingDTO';

const BACKEND_HOST = "3.67.172.45:8080";

export default function BookingScreen() {
  // Retrieve booking-related parameters from the route.
  const params = useLocalSearchParams() as { flatId: string; userId: string; userEmail: string };
  const router = useRouter();

  // Use hard-coded user data if not provided.
  const userId = params.userId ? Number(params.userId) : 1;
  const userEmail = params.userEmail || 'john.doe@example.com';
  const flatId = params.flatId ? Number(params.flatId) : null;

  // Local state for booking dates and error message.
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleBooking = async () => {
    // Validate that startDate and endDate are provided.
    if (!startDate || !endDate) {
      setErrorMessage('Start Date and End Date cannot be empty.');
      return;
    } else {
      setErrorMessage('');
    }

    if (!flatId) {
      setErrorMessage('Flat ID is missing.');
      return;
    }

    // Construct the booking data payload.
    const bookingData: BookingDTO = {
      flatId: flatId,
      userId: userId,
      userEmail: userEmail,
      startDate, // Expected in ISO format, e.g., "2025-03-01"
      endDate,   // Expected in ISO format, e.g., "2025-03-10"
      status: 'ACTIVE',
      system: 'Flatly'
    };

    setLoading(true);
    try {
      const response = await fetch(`http://${BACKEND_HOST}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookingData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Network response was not ok: ${errorText}`);
      }

      await response.json();
      // Optionally, you could display a success message here.
      router.back();
    } catch (error: any) {
      setErrorMessage(error.message || "An error occurred while submitting your booking.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Book Flat #{flatId || 'N/A'}</Text>
      
      <Text style={styles.label}>User Email:</Text>
      <Text style={styles.value}>{userEmail}</Text>

      <Text style={styles.label}>Start Date (YYYY-MM-DD):</Text>
      <TextInput
        style={styles.input}
        placeholder="2025-03-01"
        value={startDate}
        onChangeText={setStartDate}
      />

      <Text style={styles.label}>End Date (YYYY-MM-DD):</Text>
      <TextInput
        style={styles.input}
        placeholder="2025-03-10"
        value={endDate}
        onChangeText={setEndDate}
      />

      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}

      <TouchableOpacity onPress={handleBooking} style={styles.bookButton} disabled={loading}>
        <Text style={styles.bookButtonText}>
          {loading ? 'Booking...' : 'Confirm Booking'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#FFF' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  label: { fontSize: 16, fontWeight: 'bold', marginTop: 12 },
  value: { fontSize: 16, marginTop: 4 },
  input: { 
    borderWidth: 1, 
    borderColor: '#ccc', 
    padding: 8, 
    marginTop: 8, 
    borderRadius: 4 
  },
  bookButton: {
    backgroundColor: 'green',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  bookButtonText: { 
    color: '#fff', 
    fontWeight: 'bold', 
    fontSize: 18 
  },
  errorText: { 
    color: 'red', 
    fontSize: 16, 
    marginTop: 12, 
    textAlign: 'center' 
  },
});
