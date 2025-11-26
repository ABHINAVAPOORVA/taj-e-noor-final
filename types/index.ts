export interface Room {
  id: string;
  name: string;
  type: "Dream's Classic Room" | "Nizam Delux Room" | "Begum Chamber" | "Emperor's Chamber";
  pricePerNight: number;
  available: boolean;
  petFriendly: boolean;
  vip: boolean;
}

export interface Service {
  id: string;
  name: string;
  price: number;
  icon: string;
}

export interface Customer {
  name: string;
  age: number;
  gender: string;
  contactNo: string;
  validId: string;
  email: string;
}

export interface Booking {
  id: string;
  roomId: string;
  customer: Customer;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  selectedServices: string[];
  totalStayDays: number;
  roomCharges: number;
  serviceCharges: number;
  gst: number;
  grandTotal: number;
  status: "active" | "cancelled";
  createdAt: string;
}
