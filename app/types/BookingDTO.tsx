// app/types/BookingDTO.ts
export interface BookingDTO {
  id?: number; // optional when creating a new booking
  flatId: number;
  userId: number;
  userEmail: string;
  startDate: string; // ISO date string (e.g., "2025-03-01")
  endDate: string;   // ISO date string (e.g., "2025-03-10")
  status: 'ACTIVE' | 'CANCELLED'; // example statuses
  system: string;
}
