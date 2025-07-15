export interface BookingConfirmation {
  id: string;
  status: string;
  amount: string;
  currency: string;
  authCode: string;
  date: string;
  cardNumber: string;
  cardExpirationMonth: string;
  cardExpirationYear: string;
}

export interface FlightInfo {
  airline: string;
  flightNumber: string;
  price: string;
  totalCost: string;
  fees: string;
}

export interface Flight {
  flightNumber: string;
  airline: string;
  departure: string;
  arrival: string;
  price: string;
}
