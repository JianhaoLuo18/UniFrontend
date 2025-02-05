import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  ActivityIndicator,
  Image,
  Platform
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useLocalSearchParams, useRouter } from 'expo-router';

const RESERVATION_URL = "https://officely-epdmeqcbe7c0a8gq.polandcentral-01.azurewebsites.net/reservations/office";
const OFFICE_DETAILS_URL = "https://officely-epdmeqcbe7c0a8gq.polandcentral-01.azurewebsites.net/offices";

export default function OfficeBookingScreen() {
  const params = useLocalSearchParams() as { officeId: string };
  const router = useRouter();

  const [office, setOffice] = useState<any>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  useEffect(() => {
    const fetchOfficeDetails = async () => {
      try {
        const response = await fetch(`${OFFICE_DETAILS_URL}/${params.officeId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch office details');
        }
        const data = await response.json();
        setOffice(data);
      } catch (error) {
        console.error('Error fetching office details:', error);
      }
    };

    if (params.officeId) {
      fetchOfficeDetails();
    }
  }, [params.officeId]);

  const handleBooking = async () => {
    if (!userEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userEmail)) {
      setErrorMessage('Please enter a valid email.');
      return;
    }
    if (!startDate || !endDate) {
      setErrorMessage('Start Date and End Date cannot be empty.');
      return;
    }

    const reservationData = {
      officeId: params.officeId,
      startTime: startDate.toISOString().split('T')[0],
      endTime: endDate.toISOString().split('T')[0],
      status: 'PENDING',
      paymentType: 'CARD',
      comments: 'No special requests',
      paid: false
    };

    setLoading(true);
    try {
      const response = await fetch(`${RESERVATION_URL}/${params.officeId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reservationData)
      });
      if (!response.ok) {
        throw new Error('Booking request failed');
      }
      alert('Office booked successfully!');
      router.back();
    } catch (error) {
      setErrorMessage(error.message || 'Error processing booking.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {office ? (
        <>
          <Text style={styles.title}>Book: {office.name}</Text>
          {office.images && office.images.length > 0 && (
            <Image source={{ uri: `data:image/png;base64,${office.images[0].data}` }} style={styles.image} />
          )}
          <Text style={styles.label}>Location: {office.address}, {office.city}</Text>
          <Text style={styles.label}>Price: ${office.price} / day</Text>
        </>
      ) : (
        <ActivityIndicator size="large" color="#007BFF" />
      )}
      <Text style={styles.label}>User Email:</Text>
      <TextInput style={styles.input} placeholder="Enter your email" value={userEmail} onChangeText={setUserEmail} keyboardType="email-address" autoCapitalize="none" />
      <TouchableOpacity style={styles.dateInput} onPress={() => setShowStartPicker(true)}>
        <Text>{startDate ? startDate.toISOString().split('T')[0] : 'Select Start Date'}</Text>
      </TouchableOpacity>
      {showStartPicker && <DateTimePicker value={startDate || new Date()} mode="date" onChange={(event, date) => { setShowStartPicker(false); if (date) setStartDate(date); }} />}
      <TouchableOpacity style={styles.dateInput} onPress={() => setShowEndPicker(true)}>
        <Text>{endDate ? endDate.toISOString().split('T')[0] : 'Select End Date'}</Text>
      </TouchableOpacity>
      {showEndPicker && <DateTimePicker value={endDate || new Date()} mode="date" onChange={(event, date) => { setShowEndPicker(false); if (date) setEndDate(date); }} />}
      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
      <TouchableOpacity onPress={handleBooking} style={styles.bookButton} disabled={loading}>
        <Text style={styles.bookButtonText}>{loading ? 'Booking...' : 'Confirm Booking'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#FFF' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  label: { fontSize: 16, fontWeight: 'bold', marginTop: 12 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 8, marginTop: 8, borderRadius: 4 },
  bookButton: { backgroundColor: 'green', paddingVertical: 12, borderRadius: 8, alignItems: 'center', marginTop: 24 },
  bookButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  errorText: { color: 'red', fontSize: 16, marginTop: 12, textAlign: 'center' },
  dateInput: { borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 8, marginTop: 8, alignItems: 'center' },
  image: { width: '100%', height: 200, borderRadius: 8, marginBottom: 12, resizeMode: 'cover' },
});
