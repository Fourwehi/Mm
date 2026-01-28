export interface Studio {
  id: string;
  name: string;
  location: string;
  description: string;
}

export interface HobbyClass {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // in minutes
  category: string;
  studio: Studio;
  imageUrl?: string;
}

export interface TimeSlot {
  id: string;
  classId: string;
  date: string;
  startTime: string;
  maxCapacity: number;
  currentBookings: number;
}

export type ReservationStatus = "PENDING" | "CONFIRMED" | "CANCELLED";

export interface Reservation {
  id: string;
  classId: string;
  className: string;
  timeSlotId: string;
  date: string;
  startTime: string;
  guests: number;
  status: ReservationStatus;
  studioName: string;
  createdAt: string;
}

export const CATEGORIES = [
  "전체",
  "요리",
  "공예",
  "미술",
  "음악",
  "운동",
  "사진",
  "댄스",
] as const;

export const LOCATIONS = [
  "전체",
  "서울 강남",
  "서울 홍대",
  "서울 성수",
  "서울 잠실",
  "부산 해운대",
  "대구 동성로",
] as const;
