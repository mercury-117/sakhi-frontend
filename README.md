# Sakhi Frontend

Voice-first healthcare navigation mobile app built with React Native and Expo.

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the App
```bash
npm start
```

### 3. Run on Device/Emulator
- **Android**: `npm run android`
- **iOS**: `npm run ios`
- **Web**: `npm run web`

## Project Structure

```
sakhi-frontend/
├── App.js                 # Main navigation and auth flow
├── screens/
│   ├── AuthScreen.js      # Login/OTP/Registration
│   ├── HomeScreen.js      # Dashboard with voice input
│   ├── JourneyScreen.js   # Health journey tracking
│   ├── ReferralScreen.js  # Scan and parse referrals
│   └── ProfileScreen.js   # User settings
├── services/
│   └── api.js             # Backend API client
└── package.json
```

## Features

### 🎤 Voice-First Interface
- Voice commands for navigation
- Text-to-speech guidance
- Multi-language support (English & Hindi)

### 🏥 Healthcare Management
- Patient registration with OTP
- Health journey tracking
- Medical referral scanning (OCR)
- Referral parsing & analysis

### 📍 Hospital Navigation
- Find nearby healthcare facilities
- Ambulance availability
- Department information

## API Integration

Backend API: `http://localhost:8000/api`

- **Authentication**: `/auth/*`
- **Journey**: `/journey/*`
- **Referrals**: `/referral/*`

## Testing

Use these credentials for testing:
- **Phone**: 9999999999
- **OTP**: 000000

## Technologies

- **React Native** - Cross-platform mobile framework
- **Expo** - React Native development platform
- **Axios** - HTTP client
- **React Navigation** - App navigation
- **Expo Speech** - Text-to-speech
- **Material Community Icons** - UI icons
