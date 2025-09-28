# EventSponsor Platform

An event sponsorship platform connecting event organizers with sponsors. Built with Next.js, TypeScript, and Firebase.

## 🚀 Features

- **Event Management**: Create, manage, and publish events with detailed sponsorship packages
- **Sponsor Matching**: Intelligent matching between events and potential sponsors
- **User Authentication**: Secure authentication with email/password and Google OAuth
- **Real-time Updates**: Live updates for event applications and sponsorship status
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Type Safety**: Full TypeScript support throughout the application

## 🛠 Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Firebase (Authentication, Firestore, Storage)
- **Forms**: React Hook Form
- **UI Components**: Custom components with Tailwind CSS
- **Notifications**: React Hot Toast
- **Icons**: Lucide React

## 📁 Project Structure

```
src/
├── components/          # Reusable React components
│   ├── auth/           # Authentication components
│   ├── events/         # Event-related components
│   ├── layout/         # Layout components (Header, Footer, etc.)
│   ├── sponsors/       # Sponsor-related components
│   └── ui/            # Basic UI components (Button, Input, Card)
├── context/           # React Context providers
├── hooks/             # Custom React hooks
├── lib/               # Library configurations and utilities
│   └── firebase/      # Firebase configuration and helpers
├── pages/             # Next.js pages
│   ├── api/          # API routes
│   ├── auth/         # Authentication pages
│   ├── dashboard/    # Dashboard pages
│   └── events/       # Event pages
├── styles/            # Global styles
├── types/             # TypeScript type definitions
└── utils/             # Utility functions
```

## 🔧 Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd mvp-structure-event-sponsor-platform
```

### 2. Install Dependencies

**Note**: This project requires Node.js 18+ for full compatibility.

```bash
npm install
```

### 3. Firebase Setup

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)

2. Enable the following services:

   - **Authentication** (Email/Password and Google providers)
   - **Firestore Database**
   - **Storage** (for file uploads)

3. Get your Firebase configuration:

   - Go to Project Settings > General
   - Scroll to "Your apps" and click the web app icon
   - Copy the Firebase config object

4. Set up environment variables:

   ```bash
   cp .env.example .env.local
   ```

5. Fill in your Firebase configuration in `.env.local`:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

### 4. Firestore Setup

Create the following collections in your Firestore database:

- `users` - User profiles
- `events` - Event listings
- `sponsorProfiles` - Sponsor company profiles
- `sponsorshipApplications` - Sponsorship applications
- `eventAnalytics` - Event analytics data

### 5. Authentication Setup

In Firebase Console > Authentication:

1. Enable Email/Password sign-in method
2. Enable Google sign-in method (add your OAuth 2.0 client IDs)

### 6. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🚀 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🏗 Key Components

### Authentication

- Email/password authentication
- Google OAuth integration
- Protected routes and user context

### Event Management

- Create and edit events
- Define sponsorship packages
- Set event requirements and categories

### Sponsor Matching

- Browse available events
- Filter by budget, industry, location
- Apply for sponsorship packages

### Dashboard

- Separate dashboards for organizers and sponsors
- Real-time updates and notifications
- Analytics and insights

## 🔐 Security Features

- Firebase Authentication integration
- Protected API routes
- Input validation and sanitization
- Environment variable protection

## 📱 Responsive Design

The application is fully responsive and optimized for:

- Desktop browsers
- Tablets
- Mobile devices

## 🧪 Development Notes

- The project uses TypeScript for type safety
- Firebase rules should be configured for production security
- Environment variables are required for Firebase integration
- Components follow atomic design principles

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms

- Ensure Node.js 18+ is available
- Set all environment variables
- Run `npm run build` before deployment

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For support and questions, please open an issue in the repository or contact the development team.
