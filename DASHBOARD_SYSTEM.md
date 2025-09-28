# Role-Based Dashboard System

## Overview

This EventSponsor platform now includes a comprehensive role-based dashboard system with proper authentication and authorization controls.

## Features Implemented

### 🔐 Authentication & Authorization

- **ProtectedRoute Component**: Handles route protection and role-based access
- **Role-based Navigation**: Different navigation items for each user type
- **Automatic Redirects**: Users are redirected to appropriate dashboards based on their role

### 📊 Dashboard Types

#### Organizer Dashboard (`/dashboard`)

- **Overview**: Event statistics, revenue tracking, sponsor management
- **My Events**: Event list with management capabilities
- **Analytics**: Event performance metrics
- **Settings**: Profile and account management

#### Sponsor Dashboard (`/dashboard`)

- **Overview**: Sponsorship statistics, ROI tracking, reach analytics
- **My Sponsorships**: Active and pending sponsorships
- **Browse Events**: Event discovery for sponsorship opportunities
- **Company Profile**: Brand management
- **Settings**: Profile and account management

#### Admin Dashboard (`/dashboard`)

- **Overview**: Platform-wide statistics and system health
- **Users**: User management and analytics
- **All Events**: Platform event oversight
- **Platform Analytics**: System-wide metrics
- **Settings**: System and account management

### 🎯 Role-Based Features

#### Route Protection

```tsx
<ProtectedRoute requireAuth={true} allowedRoles={["organizer"]}>
  {/* Only organizers can access */}
</ProtectedRoute>
```

#### Dynamic Navigation

- Organizers see: Overview, My Events, Analytics, Settings
- Sponsors see: Overview, My Sponsorships, Browse Events, Company Profile, Settings
- Admins see: Overview, Users, All Events, Platform Analytics, Settings

#### Smart Redirects

- Users are automatically redirected to their role-appropriate dashboard
- Invalid role access attempts redirect to the correct dashboard

### 📱 Pages Available

#### Protected Dashboard Pages

- `/dashboard` - Main dashboard (role-based content)
- `/dashboard/events` - Events management (organizers only)
- `/dashboard/sponsorships` - Sponsorship management (sponsors only)
- `/dashboard/settings` - Account settings (all roles)

#### Public Pages

- `/auth/signin` - Sign in page
- `/auth/signup` - Registration with role selection

## Usage Examples

### Setting up Protected Routes

```tsx
// Require authentication
<ProtectedRoute requireAuth={true}>
  <YourComponent />
</ProtectedRoute>

// Require specific roles
<ProtectedRoute requireAuth={true} allowedRoles={["organizer", "admin"]}>
  <OrganizerOnlyComponent />
</ProtectedRoute>
```

### Using Dashboard Layout

```tsx
<DashboardLayout title="Page Title">
  <YourPageContent />
</DashboardLayout>
```

### Accessing User Context

```tsx
const { userProfile, isAuthenticated } = useAuth();

if (userProfile?.userType === "organizer") {
  // Show organizer-specific content
}
```

## Next Steps

1. **API Integration**: Replace mock data with real API calls
2. **Advanced Analytics**: Add charts and detailed metrics
3. **Real-time Updates**: Implement WebSocket connections for live data
4. **Mobile Optimization**: Enhance responsive design for mobile devices
5. **Advanced Permissions**: Add granular permission system within roles

## File Structure

```
src/
├── components/
│   ├── auth/
│   │   ├── ProtectedRoute.tsx     # Route protection component
│   │   ├── SignInForm.tsx         # Sign in form
│   │   └── SignUpForm.tsx         # Registration form
│   └── layout/
│       └── DashboardLayout.tsx    # Dashboard layout with sidebar
├── pages/
│   ├── dashboard/
│   │   ├── index.tsx              # Main dashboard (role-based)
│   │   ├── events.tsx             # Events dashboard (organizers)
│   │   ├── sponsorships.tsx       # Sponsorships dashboard (sponsors)
│   │   └── settings.tsx           # Settings page (all roles)
│   └── auth/
│       ├── signin.tsx             # Sign in page
│       └── signup.tsx             # Registration page
└── context/
    └── AuthContext.tsx            # Authentication context
```

## Security Features

- ✅ Route-level authentication required
- ✅ Role-based access control
- ✅ Automatic redirects for unauthorized access
- ✅ Loading states during authentication checks
- ✅ Type-safe user profile handling

## Demo Data

The dashboard currently uses mock data to demonstrate functionality. Replace the mock data in each dashboard component with actual API calls when backend is ready.

---

The role-based dashboard system is now fully implemented and ready for use! 🚀
