import { Timestamp } from "firebase/firestore";

// Base interface for all documents
export interface BaseDocument {
  id?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// User interfaces
export interface User extends BaseDocument {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: "organizer" | "sponsor" | "admin";
  isEmailVerified: boolean;
}

// User profile interface for Firestore documents
export interface UserProfile extends BaseDocument {
  email: string;
  firstName: string;
  lastName: string;
  userType: "organizer" | "sponsor" | "admin";
  profileImage?: string;
  displayName?: string;
}

// Event interfaces
export interface Event extends BaseDocument {
  title: string;
  description: string;
  startDate: Timestamp;
  endDate: Timestamp;
  location: {
    venue: string;
    address: string;
    city: string;
    country: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  organizerId: string;
  category: string;
  tags: string[];
  imageUrl?: string;
  website?: string;
  status: "draft" | "published" | "ongoing" | "completed" | "cancelled";
  attendeeCount?: number;
  maxAttendees?: number;
  sponsorshipPackages: SponsorshipPackage[];
  // Auto-calculated requirements based on sponsorship packages
  requirements: {
    minBudget?: number; // Minimum price from sponsorship packages
    sponsorshipTypes?: string[]; // Names of all sponsorship packages
  };
  sponsors?: EventSponsor[];
}

// Event sponsor interface
export interface EventSponsor {
  sponsorId: string;
  enquiryId: string;
  packageId: string;
  packageName: string;
  companyName: string;
  contactEmail: string;
  amount: number;
  addedAt: Timestamp;
  status: "active" | "completed" | "cancelled";
}

// Sponsorship interfaces
export interface SponsorshipPackage {
  id: string;
  name: string;
  description: string;
  price: number;
  benefits: string[];
  maxSponsors?: number;
  currentSponsors: number;
  isAvailable: boolean;
}

export interface SponsorProfile extends BaseDocument {
  userId: string;
  companyName: string;
  industry: string;
  website?: string;
  logoUrl?: string;
  description: string;
  budget: {
    min: number;
    max: number;
  };
  preferredEvents: string[];
  contactInfo: {
    name: string;
    email: string;
    phone?: string;
    position: string;
  };
}

export interface SponsorshipApplication extends BaseDocument {
  eventId: string;
  sponsorId: string;
  packageId: string;
  status: "pending" | "approved" | "rejected" | "completed";
  proposedAmount?: number;
  message?: string;
  organizerNotes?: string;
  contractUrl?: string;
  paymentStatus?: "pending" | "paid" | "refunded";
}

// Analytics interfaces
export interface EventAnalytics extends BaseDocument {
  eventId: string;
  metrics: {
    views: number;
    sponsorshipApplications: number;
    totalSponsorship: number;
    averagePackagePrice: number;
  };
  topSponsorshipPackages: string[];
  sponsorInteractions: {
    sponsorId: string;
    interactions: number;
    lastInteraction: Timestamp;
  }[];
}

// Form interfaces
export interface EventFormData {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  venue: string;
  address: string;
  city: string;
  country: string;
  category: string;
  tags: string;
  website?: string;
  maxAttendees?: number;
}

// CRUD operation interfaces
export interface CreateEventData {
  title: string;
  description: string;
  date: Date;
  location: string;
  category: string;
  tags: string[];
  imageUrl?: string;
  website?: string;
  ticketPrice?: number;
  maxAttendees?: number;
}

export interface UpdateEventData extends Partial<CreateEventData> {
  id: string;
}

export interface SponsorFormData {
  companyName: string;
  industry: string;
  website?: string;
  description: string;
  minBudget: number;
  maxBudget: number;
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  contactPosition: string;
}

// API Response interfaces
export interface APIResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}

// Filter and search interfaces
export interface EventFilters {
  category?: string;
  location?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  budgetRange?: {
    min: number;
    max: number;
  };
  tags?: string[];
  status?: string[];
}

export interface SponsorFilters {
  industry?: string;
  budgetRange?: {
    min: number;
    max: number;
  };
  location?: string;
}
