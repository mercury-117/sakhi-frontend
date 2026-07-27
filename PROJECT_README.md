# Sakhi - Voice-First Healthcare Navigation

<p align="center">
  <strong>Making healthcare accessible through voice and simplicity</strong>
</p>

## 🎯 Vision

Sakhi is a voice-first healthcare navigation platform designed to help patients navigate their healthcare journey in India, with a focus on accessibility and simplicity.

## 🚀 Features

### 1. **User Registration**
- Simple phone-based OTP authentication
- Multi-language support (English & Hindi)
- Bilingual interface

### 2. **Health Journey Tracking**
- Record symptoms and concerns
- Track referrals and hospital visits
- Monitor treatment progress
- Timeline view of medical history

### 3. **Referral Management**
- Scan medical referral documents
- OCR text extraction
- Intelligent parsing of referral information
  - Specialist type detection
  - Urgency classification
  - Symptom extraction
- Structured referral data storage

### 4. **Voice Interface**
- Voice-guided navigation
- Text-to-speech assistance
- Voice commands for quick actions
- Accessible for low-literacy users

### 5. **Hospital Discovery**
- Find nearby healthcare facilities
- Filter by department/specialty
- View ambulance availability
- Get operational hours

## 📱 Architecture

```
┌─────────────────┐
│  React Native   │  Mobile App (iOS/Android)
│   Frontend      │  - Voice Interface
│   (Expo)        │  - Journey Tracking
└────────┬────────┘  - Referral Scanning
         │
         │ HTTP/REST
         ▼
┌─────────────────┐
│  FastAPI        │  Backend API
│  Python         │  - Authentication
│  PostgreSQL     │  - Data Management
└─────────────────┘  - OCR Integration
```

## 🛠️ Tech Stack

### Frontend
- **React Native** + Expo
- React Navigation
- Axios (API client)
- Expo Speech (text-to-speech)
- Material Community Icons

### Backend
- **FastAPI** (Python web framework)
- **PostgreSQL** / SQLite
- **SQLAlchemy** (ORM)
- **Tesseract OCR** (document scanning)
- **Pillow** (image processing)

## 📖 Getting Started

### Backend Setup
```bash
cd sakhi-backend
pip install -r requirements.txt
cp .env.example .env
python -m app.main
```

Server runs at: `http://localhost:8000`

### Frontend Setup
```bash
cd sakhi-frontend
npm install
npm start
```

## 🔐 MVP Testing Credentials

- **Phone**: `9999999999`
- **OTP**: `000000`

## 📊 Data Models

### Users
- Phone number (unique)
- Name, Age, Language preference
- Registration timestamp

### Journey Steps
- Type: symptom, referral, hospital_visit, treatment
- Description, Timestamp
- User association

### Hospitals
- Name, District, Coordinates
- Services offered
- Operating hours
- Ambulance availability

## 🎨 Design Philosophy

- **Voice-First**: Designed for users with low digital literacy
- **Bilingual**: Support for English & Hindi
- **Accessible**: Clear, simple interface
- **Privacy-Focused**: User data security
- **Offline-Ready**: Core features work without internet

## 🚦 Next Steps

- [ ] Integration with real Tesseract OCR
- [ ] Implement voice recognition (speech-to-text)
- [ ] Add hospital database integration
- [ ] Push notifications for referrals
- [ ] Government integration (NDHM)
- [ ] Advanced analytics dashboard

## 👥 Team

Built with ❤️ for better healthcare access

## 📄 License

MIT License - See LICENSE file for details

---

**Status**: MVP Ready | **Last Updated**: 2026-07-27
