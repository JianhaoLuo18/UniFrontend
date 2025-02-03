// app/components/FlatCard.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FlatDTO } from '../types/FlatDTO';
import { Link } from 'expo-router';

interface FlatCardProps {
  flat: FlatDTO;
}

const FlatCard: React.FC<FlatCardProps> = ({ flat }) => {
  return (
    // asChild makes the TouchableOpacity the clickable element
    <Link href={`/flat/${flat.id}`} asChild state={flat}>
      <TouchableOpacity style={styles.card}>
        <Text style={styles.location}>{flat.location}</Text>
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
  location: {
    fontSize: 18,
    fontWeight: 'bold',
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
