// Sample data script to populate Firestore with test data
// Run this once to create sample sponsorships and events

import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

// Sample sponsorship applications
const sampleSponsorships = [
  {
    eventId: "event-1",
    eventTitle: "Tech Summit 2025",
    packageId: "pkg-premium",
    packageName: "Premium Package",
    amount: 15000,
    status: "approved",
    eventDate: Timestamp.fromDate(new Date("2025-03-15")),
    location: "San Francisco, CA",
    reach: 50000,
    leads: 245,
    organizerId: "organizer-1",
    sponsorId: "sponsor-1", // Replace with actual user ID
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
  {
    eventId: "event-2",
    eventTitle: "Marketing Conference",
    packageId: "pkg-gold",
    packageName: "Gold Package",
    amount: 8500,
    status: "active",
    eventDate: Timestamp.fromDate(new Date("2025-05-10")),
    location: "New York, NY",
    reach: 35000,
    leads: 180,
    organizerId: "organizer-2",
    sponsorId: "sponsor-1", // Replace with actual user ID
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
  {
    eventId: "event-3",
    eventTitle: "AI Workshop Series",
    packageId: "pkg-silver",
    packageName: "Silver Package",
    amount: 5000,
    status: "pending",
    eventDate: Timestamp.fromDate(new Date("2025-04-22")),
    location: "Austin, TX",
    reach: 0,
    leads: 0,
    organizerId: "organizer-3",
    sponsorId: "sponsor-1", // Replace with actual user ID
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
];

// Sample events for discovery
const sampleEvents = [
  {
    title: "Data Science Bootcamp",
    description:
      "Intensive 3-day bootcamp covering machine learning, AI, and data analysis techniques.",
    startDate: Timestamp.fromDate(new Date("2025-06-15")),
    endDate: Timestamp.fromDate(new Date("2025-06-17")),
    location: {
      venue: "Convention Center",
      address: "123 Convention Ave",
      city: "Seattle",
      country: "USA",
    },
    category: "Technology",
    status: "published",
    attendeeCount: 800,
    maxAttendees: 1000,
    organizerId: "organizer-4",
    tags: ["data science", "machine learning", "AI"],
    sponsorshipPackages: [
      {
        id: "pkg-ds-platinum",
        name: "Platinum",
        description: "Premium sponsorship with maximum visibility",
        price: 12000,
        benefits: [
          "Keynote speaking slot",
          "Premium booth",
          "Logo on all materials",
        ],
        maxSponsors: 2,
        currentSponsors: 0,
        isAvailable: true,
      },
      {
        id: "pkg-ds-gold",
        name: "Gold",
        description: "High visibility sponsorship package",
        price: 7500,
        benefits: ["Exhibition booth", "Program listing", "VIP networking"],
        maxSponsors: 5,
        currentSponsors: 1,
        isAvailable: true,
      },
    ],
    requirements: {
      minBudget: 5000,
      sponsorshipTypes: ["Bronze", "Silver", "Gold", "Platinum"],
    },
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
  {
    title: "Startup Pitch Competition",
    description:
      "Annual competition where emerging startups pitch to investors and industry leaders.",
    startDate: Timestamp.fromDate(new Date("2025-07-20")),
    endDate: Timestamp.fromDate(new Date("2025-07-20")),
    location: {
      venue: "Tech Hub",
      address: "456 Innovation St",
      city: "Austin",
      country: "USA",
    },
    category: "Business",
    status: "published",
    attendeeCount: 500,
    maxAttendees: 600,
    organizerId: "organizer-5",
    tags: ["startup", "pitch", "investment", "business"],
    sponsorshipPackages: [
      {
        id: "pkg-pitch-investor",
        name: "Investor Package",
        description: "Join as a judge and mentor",
        price: 10000,
        benefits: [
          "Judge panel seat",
          "Mentor session access",
          "Startup deal flow",
        ],
        maxSponsors: 3,
        currentSponsors: 0,
        isAvailable: true,
      },
      {
        id: "pkg-pitch-partner",
        name: "Partner Package",
        description: "Visibility and networking opportunities",
        price: 5000,
        benefits: [
          "Exhibition space",
          "Networking reception",
          "Brand visibility",
        ],
        maxSponsors: 10,
        currentSponsors: 2,
        isAvailable: true,
      },
    ],
    requirements: {
      minBudget: 3000,
      sponsorshipTypes: ["Partner", "Investor"],
    },
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
];

export async function addSampleData() {
  try {
    console.log("Adding sample sponsorship applications...");

    // Add sponsorship applications
    for (const sponsorship of sampleSponsorships) {
      const docRef = await addDoc(
        collection(db, "sponsorshipApplications"),
        sponsorship
      );
      console.log("Added sponsorship with ID: ", docRef.id);
    }

    console.log("Adding sample events...");

    // Add events
    for (const event of sampleEvents) {
      const docRef = await addDoc(collection(db, "events"), event);
      console.log("Added event with ID: ", docRef.id);
    }

    console.log("✅ Sample data added successfully!");
    return true;
  } catch (error) {
    console.error("Error adding sample data: ", error);
    return false;
  }
}

// Export the data for manual use
export { sampleSponsorships, sampleEvents };
