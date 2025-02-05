import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Link } from 'expo-router';

interface OfficeCardProps {
  office: {
    id: string;
    name: string;
    metricArea: number;
    floor: number;
    roomNumber: number;
    country: string;
    city: string;
    postalCode: string;
    address: string;
    price: number;
    images: { id: number; data: string | null }[];
  };
}

const getImageUrl = (images: { id: number; data: string | null }[]) => {
    if (images.length > 0 && images[0].data) {
      return `data:image/png;base64,${images[0].data}`; // Convert Base64 to image source
    }
    return 'https://via.placeholder.com/300'; // Fallback image
  };

const OfficeCard: React.FC<OfficeCardProps> = ({ office }) => {
  const thumbnail = getImageUrl(office.images);

  return (
    <Link href={`/office/${office.id}`} asChild state={office}>
      <TouchableOpacity style={styles.card}>
        {thumbnail && <Image source={{ uri: thumbnail }} style={styles.thumbnail} />}
        <Text style={styles.title}>{office.name}</Text>
        <Text style={styles.subtitle}>{office.address}, {office.city}</Text>
        <Text style={styles.price}>${office.price}/day</Text>
        <Text style={styles.details}>Area: {office.metricArea} sqm | Floor: {office.floor} | Room: {office.roomNumber}</Text>
      </TouchableOpacity>
    </Link>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  thumbnail: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 8,
    resizeMode: 'cover',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  price: {
    fontSize: 16,
    color: '#666',
    marginVertical: 4,
  },
  details: {
    fontSize: 14,
    color: '#888',
  },
});

export default OfficeCard;