import { FlightSearchData, BookingData, ExpectedBookingResult } from '../types';

export const flightSearchData: FlightSearchData = {
  departureCity: 'Paris',
  destinationCity: 'Rome'
};

export const bookingData: BookingData = {
  name: 'John Smith',
  address: '123 Main Street',
  city: 'New York',
  state: 'NY',
  zipCode: '10001',
  cardType: 'Visa',
  creditCardNumber: '4111111111111111',
  month: '12',
  year: '2027',
  nameOnCard: 'John Smith'
};

export const expectedBookingResult: ExpectedBookingResult = {
  expectedAmount: '555',
  currency: 'USD',
  status: 'PendingCapture'
};

// Additional test data sets for different scenarios
export const alternativeBookingData: BookingData = {
  name: 'Jane Doe',
  address: '456 Oak Avenue',
  city: 'Los Angeles',
  state: 'CA',
  zipCode: '90210',
  cardType: 'American Express',
  creditCardNumber: '378282246310005',
  month: '06',
  year: '2028',
  nameOnCard: 'Jane Doe'
};

export const testFlightRoutes: FlightSearchData[] = [
  { departureCity: 'Paris', destinationCity: 'Rome' },
  { departureCity: 'Boston', destinationCity: 'London' },
  { departureCity: 'San Diego', destinationCity: 'New York' }
];
