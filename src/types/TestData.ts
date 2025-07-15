export interface SearchData {
  departureCity: string;
  destinationCity: string;
}

export interface CustomerData {
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  cardType: string;
  cardNumber: string;
  expirationMonth: string;
  expirationYear: string;
  nameOnCard: string;
}

export interface ExpectedResult {
  expectedAmount: string;
  currency: string;
  status: string;
}
