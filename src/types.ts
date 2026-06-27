export interface Product {
  id: string;
  name: string;
  category: 'crop-health' | 'animal-health' | 'equipment' | 'seeds';
  price: number; // selling price
  buyingPrice?: number; // cost price, used for profit calculations
  rating: number;
  reviewsCount: number;
  image: string;
  tag?: string; // e.g. "Best Seller", "-20% Sale", "In Stock"
  description: string;
  stockStatus: 'In Stock' | 'Low Stock' | 'Out of Stock';
  stockQuantity?: number; // drives stockStatus automatically
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
  content?: string; // full article body; paragraphs separated by blank lines
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface CPDModule {
  id: string;
  title: string;
  code: string;
  credits?: number;
  ratePerDay: number;
  duration: string;
  fromDate: string;
  toDate: string;
  difficulty: string;
  description: string;
}

export interface Workshop {
  id: string;
  title: string;
  county: string;
  venue: string;
  date: string;
  time: string;
  agronomist: string;
}

export interface EnrollmentRecord {
  moduleId: string;
  dates: string[];
  amount: number;
  phone: string;
  reference: string;
  submittedAt: string;
  verified: boolean;
  memberName?: string;
  kvb?: string;
}

// Per-lesson admin overrides for the Farmers Academy (price + video link)
export interface LessonSetting {
  price?: number;
  videoUrl?: string;
}
