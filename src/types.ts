export interface Product {
  id: string;
  name: string;
  category: 'crop-health' | 'animal-health' | 'equipment' | 'seeds';
  price: number;
  rating: number;
  reviewsCount: number;
  image: string;
  tag?: string; // e.g. "Best Seller", "-20% Sale", "In Stock"
  description: string;
  stockStatus: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Booking {
  name: string;
  phone: string;
  email: string;
  date: string;
  serviceType: 'vet' | 'soil' | 'agronomy' | 'delivery';
  location: string;
  message: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}
