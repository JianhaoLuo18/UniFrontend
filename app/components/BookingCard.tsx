// app/components/BookingCard.tsx
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator,
  Image 
} from 'react-native';
import { BookingDTO } from '../types/BookingDTO';
import { useRouter } from 'expo-router';

const BACKEND_HOST = "3.67.172.45:8080";

interface BookingCardProps {
  booking: BookingDTO;
  onCancel?: () => void; // Optional callback to update the booking list after cancellation.
}

export default function BookingCard({ booking, onCancel }: BookingCardProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [flatName, setFlatName] = useState<string | null>(null); // ✅ Flat name state
  const [flatImage, setFlatImage] = useState<string | null>(null); // ✅ Store the flat image

  // ✅ Fetch Flat Name When Component Mounts
  useEffect(() => {
    const fetchFlatDetails = async () => {
      try {
        const response = await fetch(`http://${BACKEND_HOST}/api/flats/${booking.flatId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch flat details");
        }
        const flatData = await response.json();
        setFlatName(flatData.name); // ✅ Set the flat name
        setFlatImage(flatData.images?.length > 0 ? flatData.images[0] : null); // ✅ Get the first image

      } catch (error) {
        console.error("Error fetching flat details:", error);
        setFlatName("Unknown Flat"); // Handle missing data gracefully
        setFlatImage(null);

      }
    };

    if (booking.flatId) {
      fetchFlatDetails();
    }
  }, [booking.flatId]);


  const handleCancel = async () => {
    // Clear any previous messages.
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(`http://${BACKEND_HOST}/api/bookings/${booking.id}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Cancellation failed: ${errorText}`);
      }

      // Update message on success.
      setMessage("Booking cancelled successfully.");
      // Call the optional callback to update the booking list.
      if (onCancel) {
        onCancel();
      }
    } catch (error: any) {
      // Update message with error details.
      setMessage(error.message || "Cancellation failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewFlatDetails = () => {
    // Navigate to the flat detail screen using booking.flatId.
    // This assumes your flat detail route is defined as /flat/[id].
    if (booking.flatId) {
      router.push(`/flat/${booking.flatId}`);
    } else {
      setMessage("Flat details are not available for this booking.");
    }
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{flatName}</Text>
      {/* 🔹 Display Flat Image */}
      {flatImage ? (
        <Image source={{ uri: flatImage }} style={styles.flatImage} />
      ) : (
        <Image source={{ uri: 'https://via.placeholder.com/300' }} style={styles.flatImage} />
      )}
      {/* Removed User Email and System from display */}
      <Text style={styles.detail}>Start Date: {booking.startDate}</Text>
      <Text style={styles.detail}>End Date: {booking.endDate}</Text>
      <Text style={styles.detail}>Status: {booking.status}</Text>

      {/* Display feedback message in red text */}
      {message ? (
        <Text style={styles.message}>{message}</Text>
      ) : null}

      <TouchableOpacity onPress={handleCancel} style={styles.cancelButton} disabled={loading}>
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.cancelButtonText}>Cancel Booking</Text>
        )}
      </TouchableOpacity>

      {/* New button to view flat details */}
      <TouchableOpacity onPress={handleViewFlatDetails} style={styles.detailButton}>
        <Text style={styles.detailButtonText}>View Flat Details</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  detail: {
    fontSize: 16,
    marginVertical: 2,
  },
  cancelButton: {
    backgroundColor: 'red',
    paddingVertical: 10,
    borderRadius: 6,
    marginTop: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  detailButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    borderRadius: 6,
    marginTop: 12,
    alignItems: 'center',
  },
  detailButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  message: {
    marginTop: 10,
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
  flatImage: {
    width: '100%', 
    height: 150, 
    borderRadius: 8,
    marginBottom: 8,
    resizeMode: 'cover',
  },
});
