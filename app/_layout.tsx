// app/_layout.tsx
import { Stack } from 'expo-router';
import { Linking, Text, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import React from 'react';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Flatly App',
          headerRight: () => (
            <>
              <Link href="/bookings" style={{ marginRight: 15 }}>
                <Text style={{ color: '#007BFF', fontWeight: '600' }}>
                  Booking Summary →
                </Text>
              </Link>
              <Link href="/offices" style={{ marginRight: 15 }}>
                <Text style={{ color: '#28A745', fontWeight: '600' }}>
                  Open Officely →
                </Text>
              </Link>
            </>
          ),
        }}
      />
      <Stack.Screen
        name="bookings"  // Must match the file name: bookings.tsx or bookings/index.tsx
        options={{
          title: 'Booking Summary',
        }}
      />
      <Stack.Screen
        name="offices"
        options={{
          title: 'Available Offices',
        }}
      />
    </Stack>
  );
}
