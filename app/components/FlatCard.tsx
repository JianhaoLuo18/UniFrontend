// app/components/FlatCard.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { FlatDTO } from '../types/FlatDTO';
import { Link } from 'expo-router';

interface FlatCardProps {
  flat: FlatDTO;
}

const BACKEND_HOST = "3.67.172.45:8080";

// Helper function to correctly get the full image URL.
const getImageUrl = (img: string) => {
  // If the image URL already starts with http, return it directly.
  if (img.startsWith("http")) {
    return img;
  }
  // Otherwise, assume it's a relative path that needs the backend host prepended.
  return `http://${BACKEND_HOST}/${img}`;
};

const FlatCard: React.FC<FlatCardProps> = ({ flat }) => {
  // Get the first image as a thumbnail if available.
  const thumbnail = flat.images && flat.images.length > 0 ? getImageUrl(flat.images[0]) : null;

  return (
    // asChild makes the TouchableOpacity the clickable element
    <Link href={`/flat/${flat.id}`} asChild state={flat}>
      <TouchableOpacity style={styles.card}>
        {thumbnail && (
          <Image source={{ uri: thumbnail }} style={styles.thumbnail} />
        )}
        <Text style={styles.title}>{flat.name}</Text>
        <Text style={styles.subtitle}>{flat.location}</Text>
        <Text style={styles.price}>${flat.price}/month</Text>
        <Text style={styles.roomNumber}>{flat.roomNumber} rooms</Text>
        {flat.distance !== null && (
          <Text style={styles.distance}>{flat.distance} km away</Text>
        )}
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
    width: 120,    // Adjust width as needed
    height: 90,    // Adjust height as needed
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
  roomNumber: {
    fontSize: 14,
    color: '#888',
  },
  distance: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
});

export default FlatCard;
