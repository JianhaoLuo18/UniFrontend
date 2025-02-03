// app/_layout.tsx
import { Stack } from 'expo-router';
import { Text } from 'react-native';
import { Link } from 'expo-router';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Flatly App',
          headerRight: () => (
            <Link href="/bookings" style={{ marginRight: 15 }}>
              <Text style={{ color: '#007BFF', fontWeight: '600' }}>
                Booking Summary →
              </Text>
            </Link>
          ),
        }}
      />
      <Stack.Screen
        name="bookings"  // Must match the file name: bookings.tsx or bookings/index.tsx
        options={{
          title: 'Booking Summary',
        }}
      />
    </Stack>
  );
}
