export interface FlightSearchData {
  departureCity: string;
  destinationCity: string;
}

export interface FlightDetails {
  flightNumber: string;
  airline: string;
  departureTime: string;
  arrivalTime: string;
  price: string;
}

export interface BookingData {
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  cardType: string;
  creditCardNumber: string;
  month: string;
  year: string;
  nameOnCard: string;
}

export interface BookingConfirmation {
  id: string;
  status: string;
  amount: string;
  currency: string;
  cardNumber: string;
  authCode: string;
  date: string;
}

export interface ExpectedBookingResult {
  expectedAmount: string;
  currency: string;
  status: string;
}
