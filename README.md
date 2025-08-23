# 🎄 Christmas Gift List App

A collaborative Christmas gift list organizer built with Next.js 15, Firebase, and PWA technology. Perfect for families and groups who want to coordinate their holiday gift-giving!

![Christmas Theme](https://img.shields.io/badge/Theme-Christmas-red?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square)
![Next.js](https://img.shields.io/badge/Next.js-15.0-black?style=flat-square)
![Firebase](https://img.shields.io/badge/Firebase-orange?style=flat-square)
![PWA](https://img.shields.io/badge/PWA-Ready-green?style=flat-square)

## ✨ Features

### 🔐 Authentication

- Email/password signup and login
- Google OAuth integration
- Password reset functionality
- Protected routes and user sessions

### 👥 Group Management

- Create annual gift groups/sessions
- Invite family members and friends
- Role-based permissions (owner/member)
- Real-time member updates

### 📝 Gift List Management

- Create personalized gift lists for recipients
- Set individual budgets per list
- Add collaborators to lists
- Real-time collaboration features

### 🎁 Gift Item Tracking

- Rich item details (title, description, links, images)
- Priority system (high/medium/low)
- Mark items as purchased
- Price tracking and budget monitoring
- Upload item images to Firebase Storage

### 💰 Budget Tracking

- Visual budget progress indicators
- Spending summaries and analytics
- Budget alerts and overspending warnings
- Priority-based spending breakdown

### 📱 Progressive Web App (PWA)

- Install on mobile devices
- Offline functionality with service worker
- Push notifications (ready for implementation)
- Native app-like experience
- Background sync capabilities

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Firebase account
- Firebase CLI installed globally

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/robdonn/xmas-gift-list.git
   cd xmas-gift-list
   ```

2. **Install dependencies**:

   ```bash
   npm install
   cd functions && npm install && cd ..
   ```

3. **Set up Firebase**:

   ```bash
   # Login to Firebase
   npm run firebase login

   # Create a new Firebase project
   npm run firebase projects:create your-project-name

   # Initialize Firebase in your project
   npm run firebase init
   ```

4. **Configure environment variables**:
   Create `.env.local` in the project root:

   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```

5. **Deploy Firestore rules and start development**:

   ```bash
   npm run firebase deploy --only firestore:rules,storage
   npm run dev
   ```

6. **Visit your app**:
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗 Architecture

### Tech Stack

- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS
- **Backend**: Firebase (Firestore, Auth, Storage, Functions)
- **PWA**: Service Worker, Web App Manifest
- **State Management**: React Context API
- **Forms**: React Hook Form + Zod validation
- **Icons**: Lucide React
- **Deployment**: Firebase Hosting / Vercel

### Project Structure

```
src/
├── app/                 # Next.js App Router pages
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   ├── budget/         # Budget tracking components
│   ├── groups/         # Group management components
│   ├── items/          # Gift item components
│   ├── lists/          # Gift list components
│   └── ui/             # Base UI components
├── context/            # React Context providers
├── hooks/              # Custom React hooks
├── lib/                # Utilities and Firebase config
└── types/              # TypeScript type definitions
```

### Firebase Collections

- `users` - User profiles and preferences
- `giftGroups` - Annual gift groups/sessions
- `giftLists` - Individual recipient lists
- `giftItems` - Gift items with details

## 🔒 Security

### Firestore Security Rules

The app uses comprehensive Firestore security rules that ensure:

- Users can only access their own data
- Group members can only access their groups' data
- List collaborators can only access shared lists
- No unauthorized data access

### Authentication

- Secure Firebase Authentication integration
- Protected routes with automatic redirects
- Session management with persistent login
- Password reset functionality

## 📱 PWA Features

### Service Worker

- Caches critical app resources
- Provides offline functionality
- Handles network failures gracefully
- Automatic updates with user notification

### Installation

- "Add to Home Screen" prompt
- Native app icon and splash screen
- Standalone display mode
- Desktop and mobile installation support

### Offline Support

- Cached pages work offline
- Graceful degradation for network requests
- Offline indicator for user awareness
- Background sync for future data updates

## 🎨 Design System

### Christmas Theme

- **Primary Red**: `#dc2626` (Christmas red)
- **Secondary Green**: `#166534` (Christmas green)
- **Gold Accent**: `#d97706` (Christmas gold)
- **Background**: `#f9fafb` (Light gray)

### Typography

- **Font**: Inter (Google Fonts)
- **Headings**: Font weights 600-700
- **Body**: Font weight 400
- **Emphasis**: Font weight 500

### Components

- Consistent spacing using Tailwind's scale
- Accessible color contrasts
- Focus states for keyboard navigation
- Mobile-first responsive design

## 🧪 Testing

### Manual Testing Checklist

- [ ] User authentication flows
- [ ] Group creation and management
- [ ] List and item CRUD operations
- [ ] Budget calculations and displays
- [ ] Real-time collaboration
- [ ] PWA installation and offline mode
- [ ] Mobile responsiveness

### Automated Testing (Future Enhancement)

```bash
# Unit tests with Jest
npm run test

# E2E tests with Cypress
npm run test:e2e

# Lighthouse audit
npm run audit
```

## 🚀 Deployment

### Firebase Hosting (Recommended)

```bash
npm run build
npm run firebase deploy
```

### Vercel

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Guidelines

- Follow TypeScript best practices
- Use Tailwind CSS for styling
- Write meaningful commit messages
- Test your changes thoroughly
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Firebase team for the excellent backend services
- Next.js team for the amazing React framework
- Tailwind CSS for the utility-first styling approach
- Lucide team for the beautiful icons
- All the open source contributors who made this possible

## 📞 Support

If you encounter any issues or have questions:

1. Check the [DEPLOYMENT.md](./DEPLOYMENT.md) guide
2. Review the Firebase Console for any service issues
3. Open an issue in this repository
4. Check browser developer console for client-side errors

---

Happy holidays and enjoy organizing your Christmas gifts! 🎄🎁✨
