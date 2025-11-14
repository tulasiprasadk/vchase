# 🧪 Manual Testing Guide - Event Sponsor Platform

## 📋 **Testing Overview**

This comprehensive manual testing guide covers all features and user flows in the Event Sponsor Platform. Test each section systematically to ensure full functionality.

---

## 🔧 **Pre-Testing Setup**

### **Environment Preparation**

- [ ] Start development server: `npm run dev`
- [ ] Verify server running at: `http://localhost:3000`
- [ ] Clear browser cache and cookies
- [ ] Test in multiple browsers: Chrome, Firefox, Safari
- [ ] Test responsive design: Desktop, Tablet, Mobile

### **Test Data Preparation**

Create test accounts for each user type:

- [ ] **Test Organizer**: `test-organizer@example.com`
- [ ] **Test Sponsor**: `test-sponsor@example.com`
- [ ] **Test Admin**: `test-admin@example.com`

---

## 🔐 **1. Authentication System Testing**

### **1.1 User Registration (Sign Up)**

**Test Location**: `/auth/signup`

#### **Organizer Registration**

- [ ] Navigate to signup page
- [ ] Fill valid organizer details:
  - First Name: `John`
  - Last Name: `Organizer`
  - Company Name: `Event Co Ltd`
  - Contact Number: `+1234567890`
  - Email: `test-organizer-{timestamp}@example.com`
  - Password: `SecurePass123!`
  - User Type: `Event Organizer`
- [ ] Submit form
- [ ] **Expected**: Account created successfully
- [ ] **Expected**: Redirected to organizer dashboard (`/dashboard`)
- [ ] **Expected**: Success toast notification

#### **Sponsor Registration**

- [ ] Sign out if logged in
- [ ] Navigate to signup page
- [ ] Fill valid sponsor details:
  - First Name: `Jane`
  - Last Name: `Sponsor`
  - Company Name: `Sponsor Corp`
  - Contact Number: `+0987654321`
  - Email: `test-sponsor-{timestamp}@example.com`
  - Password: `SecurePass123!`
  - User Type: `Sponsor`
- [ ] Submit form
- [ ] **Expected**: Account created successfully
- [ ] **Expected**: Redirected to sponsor dashboard (`/dashboard/sponsorships`)
- [ ] **Expected**: Success toast notification

#### **Form Validation Testing**

- [ ] Submit empty form
- [ ] **Expected**: Validation errors displayed
- [ ] Enter invalid email format
- [ ] **Expected**: Email validation error
- [ ] Enter weak password
- [ ] **Expected**: Password validation error
- [ ] Enter mismatched password confirmation
- [ ] **Expected**: Password mismatch error

### **1.2 User Sign In**

**Test Location**: `/auth/signin`

#### **Valid Login Testing**

- [ ] Enter organizer credentials
- [ ] **Expected**: Successful login
- [ ] **Expected**: Redirected to appropriate dashboard
- [ ] Sign out and test sponsor login
- [ ] **Expected**: Redirected to `/dashboard/sponsorships`

#### **Invalid Login Testing**

- [ ] Enter incorrect email
- [ ] **Expected**: Login error message
- [ ] Enter incorrect password
- [ ] **Expected**: Login error message
- [ ] Enter non-existent email
- [ ] **Expected**: User not found error

### **1.3 Password Reset**

- [ ] Click "Forgot Password" link
- [ ] Enter valid email address
- [ ] **Expected**: Password reset email sent
- [ ] Check email and follow reset link
- [ ] **Expected**: Password reset successful

### **1.4 Sign Out**

- [ ] Click sign out from any dashboard
- [ ] **Expected**: Logged out successfully
- [ ] **Expected**: Redirected to home page
- [ ] **Expected**: No access to protected routes

---

## 📊 **2. Dashboard Testing by User Role**

### **2.1 Organizer Dashboard**

**Test Location**: `/dashboard` (organizer only)

#### **Dashboard Access & Layout**

- [ ] Login as organizer
- [ ] **Expected**: Dashboard loads correctly
- [ ] **Expected**: Sidebar shows organizer navigation:
  - Overview
  - My Events
  - Sponsorship Enquiries
  - Messages
  - Settings

#### **Dashboard Statistics**

- [ ] Check statistics cards display:
  - [ ] Active Events count
  - [ ] Total Revenue
  - [ ] Active Sponsors
  - [ ] Total Attendees
- [ ] **Expected**: Numbers reflect actual data
- [ ] **Expected**: Trend indicators show up/down arrows

#### **Recent Enquiries Section**

- [ ] Check enquiries list
- [ ] **Expected**: Shows recent sponsorship requests
- [ ] **Expected**: Status badges (pending, accepted, rejected)
- [ ] Click "View All Enquiries"
- [ ] **Expected**: Redirects to enquiries management

#### **Quick Actions**

- [ ] Click "Create New Event"
- [ ] **Expected**: Redirects to event creation
- [ ] Click "View All Events"
- [ ] **Expected**: Redirects to events management

### **2.2 Sponsor Dashboard**

**Test Location**: `/dashboard/sponsorships` (sponsor only)

#### **Dashboard Access & Layout**

- [ ] Login as sponsor
- [ ] **Expected**: Dashboard loads correctly
- [ ] **Expected**: Sidebar shows sponsor navigation:
  - Sponsorships
  - Messages
  - Settings

#### **Sponsorship Tabs**

- [ ] **Discover Tab**:

  - [ ] Events list displays
  - [ ] Filter functionality works
  - [ ] Event cards show complete information
  - [ ] "Apply for Sponsorship" buttons present

- [ ] **Submitted Tab**:

  - [ ] Shows submitted enquiries
  - [ ] Status indicators correct
  - [ ] Action buttons appropriate for status

- [ ] **Current Tab**:
  - [ ] Shows active sponsorships
  - [ ] Payment status indicators
  - [ ] Message organizer functionality

#### **Event Discovery**

- [ ] Browse available events
- [ ] **Expected**: Only published events shown
- [ ] **Expected**: Sponsorship packages visible
- [ ] **Expected**: Organizer information displayed

### **2.3 Admin Dashboard**

**Test Location**: `/dashboard/admin` (admin only)

#### **Dashboard Access & Layout**

- [ ] Login as admin
- [ ] **Expected**: Dashboard loads correctly
- [ ] **Expected**: Sidebar shows admin navigation:
  - Overview
  - Moderate
  - Users
  - Verification Requests
  - Reports
  - Settings

#### **Admin Statistics**

- [ ] Check platform statistics:
  - [ ] Total users count
  - [ ] Organizers/Sponsors breakdown
  - [ ] Events count
  - [ ] Recent signups
- [ ] **Expected**: Real-time data display

#### **User Management**

- [ ] Navigate to Users section
- [ ] **Expected**: All users listed
- [ ] **Expected**: User type badges
- [ ] **Expected**: Verification status visible
- [ ] **Expected**: Approval controls work

---

## 🎫 **3. Event Management Testing**

### **3.1 Event Creation (Organizers)**

**Test Location**: `/dashboard/events`

#### **Event Form Testing**

- [ ] Login as organizer
- [ ] Navigate to "My Events"
- [ ] Click "Create New Event"
- [ ] Fill event details:
  - [ ] Title: `Test Tech Conference 2025`
  - [ ] Description: `Comprehensive tech conference description`
  - [ ] Date: Future date
  - [ ] Time: `09:00`
  - [ ] Venue: `Convention Center`
  - [ ] City: `San Francisco`
  - [ ] Country: `USA`
  - [ ] Category: `Technology`
  - [ ] Max Attendees: `500`
  - [ ] Ticket Price: `99`

#### **Sponsorship Packages Creation**

- [ ] Add sponsorship packages:
  - **Bronze Package**:
    - Name: `Bronze`
    - Price: `5000`
    - Benefits: `Logo on website, Newsletter mention`
  - **Silver Package**:
    - Name: `Silver`
    - Price: `10000`
    - Benefits: `Logo on banners, Speaking slot`
  - **Gold Package**:
    - Name: `Gold`
    - Price: `20000`
    - Benefits: `Keynote slot, Premium booth`

#### **Image Upload Testing**

- [ ] Upload event image
- [ ] **Expected**: Image uploads successfully
- [ ] **Expected**: Cloudinary integration works
- [ ] **Expected**: Preview displays correctly

#### **Event Submission**

- [ ] Save as draft
- [ ] **Expected**: Event saved with "draft" status
- [ ] Publish event
- [ ] **Expected**: Event status changes to "published"
- [ ] **Expected**: Event appears in public listings

### **3.2 Event Management**

#### **Event Listing**

- [ ] View events list
- [ ] **Expected**: All organizer's events displayed
- [ ] **Expected**: Status indicators correct
- [ ] **Expected**: Action buttons appropriate

#### **Event Editing**

- [ ] Click edit on existing event
- [ ] Modify event details
- [ ] **Expected**: Changes saved successfully
- [ ] **Expected**: Updated information displays

#### **Event Publishing/Unpublishing**

- [ ] Toggle event status
- [ ] **Expected**: Status changes correctly
- [ ] **Expected**: Published events appear publicly
- [ ] **Expected**: Draft events hidden from public

#### **Event Deletion**

- [ ] Delete test event
- [ ] **Expected**: Confirmation dialog appears
- [ ] **Expected**: Event removed after confirmation

---

## 🤝 **4. Sponsorship Workflow Testing**

### **4.1 Event Discovery (Sponsors)**

**Test Location**: `/dashboard/sponsorships` (Discover tab)

#### **Event Browsing**

- [ ] Login as sponsor
- [ ] Browse available events
- [ ] **Expected**: Only published events shown
- [ ] **Expected**: Event details complete
- [ ] **Expected**: Sponsorship packages visible

#### **Event Filtering**

- [ ] Test filter functionality:
  - [ ] Budget range filter
  - [ ] Category filter
  - [ ] Location filter
  - [ ] Date range filter
- [ ] **Expected**: Results update correctly

#### **Event Details**

- [ ] Click on event card
- [ ] **Expected**: Full event information
- [ ] **Expected**: Organizer details visible
- [ ] **Expected**: All sponsorship packages listed

### **4.2 Sponsorship Application**

#### **Package Selection**

- [ ] Select sponsorship package
- [ ] **Expected**: Package details displayed
- [ ] **Expected**: Price and benefits clear

#### **Enquiry Submission**

- [ ] Fill enquiry form:
  - [ ] Company information
  - [ ] Message to organizer
  - [ ] Contact details
- [ ] Submit enquiry
- [ ] **Expected**: Enquiry submitted successfully
- [ ] **Expected**: Status shows "pending"

#### **Enquiry Tracking**

- [ ] Check "Submitted" tab
- [ ] **Expected**: Enquiry appears in list
- [ ] **Expected**: Status tracking works
- [ ] **Expected**: Update notifications received

### **4.3 Enquiry Management (Organizers)**

**Test Location**: `/dashboard/manage-enquiries`

#### **Enquiry Review**

- [ ] Login as organizer
- [ ] Navigate to "Sponsorship Enquiries"
- [ ] **Expected**: All enquiries for organizer's events
- [ ] **Expected**: Sponsor details visible
- [ ] **Expected**: Enquiry messages readable

#### **Enquiry Actions**

- [ ] Accept enquiry
- [ ] **Expected**: Status changes to "accepted"
- [ ] **Expected**: Sponsor receives notification
- [ ] Reject enquiry with reason
- [ ] **Expected**: Status changes to "rejected"
- [ ] **Expected**: Rejection reason stored

#### **Communication**

- [ ] Message sponsor from enquiry
- [ ] **Expected**: Conversation started
- [ ] **Expected**: Message delivered

---

## 💬 **5. Messaging System Testing**

### **5.1 Message Interface**

**Test Location**: `/dashboard/messages`

#### **Chat List**

- [ ] Access messages from both organizer and sponsor accounts
- [ ] **Expected**: Conversations listed
- [ ] **Expected**: Unread count displayed
- [ ] **Expected**: Last message preview

#### **Chat Interface**

- [ ] Open conversation
- [ ] **Expected**: Message history loads
- [ ] **Expected**: Participant info displayed with verification badges
- [ ] **Expected**: Online status indicators

#### **Message Sending**

- [ ] Send text message
- [ ] **Expected**: Message appears immediately
- [ ] **Expected**: Message delivered to recipient
- [ ] **Expected**: Read receipts work

#### **Real-time Updates**

- [ ] Send message from one account
- [ ] Check other account (different browser)
- [ ] **Expected**: Message appears in real-time
- [ ] **Expected**: Unread count updates

### **5.2 Message Features**

#### **Message Types**

- [ ] Send regular text message
- [ ] Send message with special characters
- [ ] Send long message
- [ ] **Expected**: All message types handled correctly

#### **Search Functionality**

- [ ] Search conversations
- [ ] **Expected**: Relevant conversations found
- [ ] **Expected**: Search highlighting works

#### **Message Filters**

- [ ] Test priority filters
- [ ] Test tag filters
- [ ] **Expected**: Results filter correctly

---

## ✅ **6. Verification System Testing**

### **6.1 Verification Request Submission**

**Test Location**: `/dashboard/settings`

#### **Organizer Verification**

- [ ] Login as organizer
- [ ] Navigate to Settings
- [ ] Click "Request Verification"
- [ ] Fill verification form:
  - [ ] Business registration documents
  - [ ] Previous events list
  - [ ] Portfolio/website
  - [ ] Additional documents
- [ ] Submit request
- [ ] **Expected**: Request submitted successfully
- [ ] **Expected**: Status shows "pending"

#### **Sponsor Verification**

- [ ] Login as sponsor
- [ ] Submit sponsor verification:
  - [ ] Company registration
  - [ ] Sponsorship budget details
  - [ ] Previous sponsorships
  - [ ] Marketing materials
- [ ] **Expected**: Request processed correctly

### **6.2 Verification Management (Admin)**

**Test Location**: `/dashboard/admin/verification-requests`

#### **Request Review**

- [ ] Login as admin
- [ ] Navigate to verification requests
- [ ] **Expected**: All pending requests listed
- [ ] **Expected**: Request details accessible

#### **Request Processing**

- [ ] Review verification documents
- [ ] Approve request
- [ ] **Expected**: Status changes to "approved"
- [ ] **Expected**: User receives notification
- [ ] **Expected**: Verified badge appears

#### **Rejection Testing**

- [ ] Reject request with reason
- [ ] **Expected**: Status changes to "rejected"
- [ ] **Expected**: Rejection reason stored
- [ ] **Expected**: User can resubmit

### **6.3 Verified Badge Display**

#### **Badge Visibility Testing**

- [ ] Check verified user's profile in:
  - [ ] Dashboard sidebar
  - [ ] Dashboard header
  - [ ] Messages interface
  - [ ] User listings
- [ ] **Expected**: Green verified badge displayed
- [ ] **Expected**: Badge shows "Verified" text where appropriate

---

## 💰 **7. Payment & Sponsorship Completion**

### **7.1 Payment Proof Upload**

**Test Location**: `/dashboard/sponsorships`

#### **Payment Process**

- [ ] As sponsor with accepted enquiry
- [ ] Click "Upload Payment Proof"
- [ ] Upload payment document/screenshot
- [ ] **Expected**: File uploads successfully
- [ ] **Expected**: Status changes to "payment_uploaded"

#### **Payment Verification (Organizer)**

- [ ] Login as organizer
- [ ] Check enquiry with payment proof
- [ ] Verify payment
- [ ] **Expected**: Status changes to "payment_verified"
- [ ] **Expected**: Sponsorship becomes active

### **7.2 Sponsorship Completion**

#### **Active Sponsorship Display**

- [ ] Check "Current" tab as sponsor
- [ ] **Expected**: Active sponsorships listed
- [ ] **Expected**: Event details accessible
- [ ] **Expected**: Communication tools available

---

## 🔧 **8. Settings & Profile Management**

### **8.1 Profile Settings**

**Test Location**: `/dashboard/settings`

#### **Profile Information**

- [ ] Update profile details:
  - [ ] Name changes
  - [ ] Company information
  - [ ] Contact details
- [ ] **Expected**: Changes saved successfully
- [ ] **Expected**: Updates reflected across platform

#### **Profile Picture**

- [ ] Upload profile picture
- [ ] **Expected**: Image uploads successfully
- [ ] **Expected**: Profile picture displays correctly

#### **Password Change**

- [ ] Change password
- [ ] **Expected**: Password updated successfully
- [ ] **Expected**: Can login with new password

### **8.2 Notification Settings**

- [ ] Toggle email notifications
- [ ] Toggle push notifications
- [ ] **Expected**: Preferences saved
- [ ] **Expected**: Notifications respect settings

---

## 🎯 **9. Public Pages Testing**

### **9.1 Home Page**

**Test Location**: `/`

#### **Landing Page**

- [ ] Visit home page
- [ ] **Expected**: Professional layout
- [ ] **Expected**: Clear call-to-action buttons
- [ ] **Expected**: Feature highlights visible

#### **Navigation**

- [ ] Test all navigation links
- [ ] **Expected**: All links work correctly
- [ ] **Expected**: Responsive design works

### **9.2 Public Events Page**

**Test Location**: `/events`

#### **Event Listings**

- [ ] View public events
- [ ] **Expected**: Only published events shown
- [ ] **Expected**: Event cards complete
- [ ] **Expected**: Category filters work

#### **Event Details**

- [ ] Click on event
- [ ] **Expected**: Full event information
- [ ] **Expected**: Sponsorship options visible
- [ ] **Expected**: Contact information available

---

## 📱 **10. Mobile & Responsive Testing**

### **10.1 Mobile Navigation**

- [ ] Test on mobile device/emulator
- [ ] **Expected**: Hamburger menu works
- [ ] **Expected**: All features accessible
- [ ] **Expected**: Touch interactions work

### **10.2 Responsive Design**

- [ ] Test at different screen sizes:
  - [ ] 320px (mobile)
  - [ ] 768px (tablet)
  - [ ] 1024px (desktop)
  - [ ] 1920px (large desktop)
- [ ] **Expected**: Layout adapts correctly
- [ ] **Expected**: All functionality preserved

---

## 🔍 **11. Error Handling & Edge Cases**

### **11.1 Network Issues**

- [ ] Test with slow internet connection
- [ ] Test with intermittent connectivity
- [ ] **Expected**: Loading states display
- [ ] **Expected**: Error messages helpful

### **11.2 Data Validation**

- [ ] Submit forms with invalid data
- [ ] Test with special characters
- [ ] Test with very long inputs
- [ ] **Expected**: Proper validation messages
- [ ] **Expected**: Data integrity maintained

### **11.3 Permission Testing**

- [ ] Try accessing admin pages as regular user
- [ ] Try accessing organizer features as sponsor
- [ ] **Expected**: Access denied appropriately
- [ ] **Expected**: Proper error messages

---

## 🛡️ **12. Security Testing**

### **12.1 Authentication Security**

- [ ] Test session persistence
- [ ] Test logout security
- [ ] Test route protection
- [ ] **Expected**: Unauthorized access prevented
- [ ] **Expected**: Sessions managed correctly

### **12.2 Data Security**

- [ ] Test input sanitization
- [ ] Test file upload security
- [ ] **Expected**: Malicious inputs rejected
- [ ] **Expected**: File types validated

---

## 📊 **13. Performance Testing**

### **13.1 Page Load Times**

- [ ] Measure dashboard load times
- [ ] Measure event listing load times
- [ ] **Expected**: Pages load within 3 seconds
- [ ] **Expected**: Images optimized

### **13.2 Real-time Features**

- [ ] Test message delivery speed
- [ ] Test notification delays
- [ ] **Expected**: Real-time updates within 1 second

---

## ✅ **Testing Checklist Summary**

### **Critical Path Testing** (Must Pass)

- [ ] User registration and login
- [ ] Event creation and publishing
- [ ] Sponsorship enquiry submission
- [ ] Message sending and receiving
- [ ] Payment proof upload
- [ ] Verification badge display

### **Secondary Features** (Should Work)

- [ ] Advanced filtering
- [ ] Admin dashboard
- [ ] Verification system
- [ ] Public pages
- [ ] Mobile responsiveness

### **Nice-to-Have** (Good if Working)

- [ ] Advanced analytics
- [ ] Export functionality
- [ ] Integration features

---

## 🐛 **Bug Reporting Template**

When you find issues, document them as:

**Bug Title**: Clear, specific title

**Steps to Reproduce**:

1. Step 1
2. Step 2
3. Step 3

**Expected Result**: What should happen

**Actual Result**: What actually happened

**Browser/Device**: Browser version and device info

**Screenshots**: Include if visual issue

**Priority**: High/Medium/Low

---

## 🎯 **Test Completion**

- [ ] All critical path tests pass
- [ ] All user roles tested
- [ ] All major features verified
- [ ] Mobile responsiveness confirmed
- [ ] Security measures validated
- [ ] Performance acceptable

**Testing Complete! 🎉**

---

_Last Updated: December 2024_  
_Platform Version: Latest_  
_Testing Coverage: Complete Feature Set_
