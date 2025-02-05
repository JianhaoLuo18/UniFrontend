// app/booking.tsx
import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  Platform,
  Image
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { BookingDTO } from './types/BookingDTO';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BACKEND_HOST = "3.67.172.45:8080";

export default function BookingScreen() {
  const params = useLocalSearchParams() as { flatId: string; userId: string; userEmail: string };
  const router = useRouter();

  const userId = params.userId ? Number(params.userId) : 1;
  const flatId = params.flatId ? Number(params.flatId) : null;

  const [flatName, setFlatName] = useState<string | null>(null); 
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [userEmail, setUserEmail] = useState(params.userEmail || '');
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [flatImage, setFlatImage] = useState<string | null>(null); 
  

  useEffect(() => {
    const fetchFlatDetails = async () => {
      try {
        const response = await fetch(`http://${BACKEND_HOST}/api/flats/${flatId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch flat details');
        }
        const data = await response.json();
        setFlatName(data.name);
        setFlatImage(data.images?.length > 0 ? data.images[0] : null); 

      } catch (error) {
        console.error('Error fetching flat details:', error);
        setFlatName("Unknown Flat"); 
        setFlatImage(null);
      }
    };

    if (flatId) {
      fetchFlatDetails();
    }
  }, [flatId]);
  
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const onChangeStartDate = (event: any, selectedDate?: Date) => {
    setShowStartPicker(false); 
    if (selectedDate) {
      setStartDate(selectedDate);
    }
  };

  const onChangeEndDate = (event: any, selectedDate?: Date) => {
    setShowEndPicker(false); 
    if (selectedDate) {
      setEndDate(selectedDate);
    }
  };
  
  const handleBooking = async () => {

    if (!userEmail || !isValidEmail(userEmail)) {
      setErrorMessage('Please enter a valid email.');
      return;
    }

    try {
      await AsyncStorage.setItem('userEmail', userEmail);
      console.log("✅ User email saved:", userEmail);
    } catch (error) {
      console.error("Error storing user email:", error);
    }


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

    const bookingData: BookingDTO = {
      flatId: flatId,
      userId: userId,
      userEmail: userEmail,
      startDate: startDate ? startDate.toISOString().split('T')[0] : '', // Convert to "YYYY-MM-DD"
      endDate: endDate ? endDate.toISOString().split('T')[0] : '',     // Convert to "YYYY-MM-DD"
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
      alert('Booking confirmed!');
      router.back();
    } catch (error: any) {
      setErrorMessage(error.message || "An error occurred while submitting your booking.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
        <>
          <Text style={styles.title}>Book: {flatName}</Text>
          {flatImage ? (
              <Image source={{ uri: flatImage }} style={styles.flatImage} />
            ) : (
              <Image source={{ uri: 'https://via.placeholder.com/300' }} style={styles.flatImage} />
            )}
    
        </>
      <Text style={styles.label}>User Email:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        value={userEmail}
        onChangeText={setUserEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={styles.label}>Start Date:</Text>
      <TouchableOpacity style={styles.dateInput} onPress={() => setShowStartPicker(true)}>
        <Text style={styles.dateText}>{startDate ? startDate.toISOString().split('T')[0] : 'Select Start Date'}</Text>
      </TouchableOpacity>
      {showStartPicker && <DateTimePicker value={startDate || new Date()} mode="date" onChange={onChangeStartDate} />}

      <Text style={styles.label}>End Date:</Text>
      <TouchableOpacity style={styles.dateInput} onPress={() => setShowEndPicker(true)}>
        <Text style={styles.dateText}>{endDate ? endDate.toISOString().split('T')[0] : 'Select End Date'}</Text>
      </TouchableOpacity>
      {showEndPicker && <DateTimePicker value={endDate || new Date()} mode="date" onChange={onChangeEndDate} />}


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
  flatImage: {
    width: '100%', 
    height: 150, 
    borderRadius: 8,
    marginBottom: 8,
    resizeMode: 'cover',
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
  dateInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    alignItems: 'center',
  },
  dateText: { fontSize: 16, color: '#333' },
});
