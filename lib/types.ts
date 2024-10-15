export interface RestaurantDocument {
  _id: string;
  name: string;
  description: string;
  location: string;
  timing: {
    start: string;
    end: string;
  };
  banner: string;
}

export interface HotelDocument {
  _id: string;
  name: string;
  description: string;
  location: string;
  timing: {
    start: string;
    end: string;
  };
  banner: string;
}

export interface IUser {
  _id: string;
  email: string;
  username: string;
}

interface Review {
  _id: string;
  author: string;
  content: string;
  rating: number;
  createdAt: string;
}

export interface LocationDocument {
  name: string;
  description: string;
  location: string;
  price: string;
  bestTime: string;
  hours: string;
  rating: number;
  imageUrl: [string];
  attractions: string[];
  nearbyPlaces: string[];
  hotels: HotelDocument[];
  restaurants: RestaurantDocument[];
  reviews: Review[];
}
