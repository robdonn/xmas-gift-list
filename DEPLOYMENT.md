# Christmas Gift List - Deployment Guide

## 🎄 Quick Start

Your Christmas Gift List app is now ready for deployment! Follow these steps to get it live.

## 📋 Pre-Deployment Checklist

### 1. Environment Setup

Make sure you have your `.env.local` file with Firebase configuration:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### 2. Firebase Services Enabled

Ensure these Firebase services are enabled in your console:

- ✅ Authentication (Email/Password + Google)
- ✅ Firestore Database
- ✅ Cloud Storage
- ✅ Hosting

### 3. App Icons

Generate proper PWA icons for production:

- Use a tool like [PWA Asset Generator](https://github.com/elegantapp/pwa-asset-generator)
- Replace placeholder icons in `/public/icons/`
- Recommended: 512x512 source image with your app logo

## 🚀 Deployment Options

### Option 1: Firebase Hosting (Recommended)

1. **Build the application**:

   ```bash
   npm run build
   ```

2. **Deploy to Firebase**:

   ```bash
   npm run firebase deploy
   ```

3. **Your app will be live at**:
   `https://your-project-id.web.app`

### Option 2: Vercel

1. **Connect to Vercel**:

   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository

2. **Add environment variables** in Vercel dashboard:

   - Add all Firebase config variables

3. **Deploy**:
   - Vercel will auto-deploy on push to main branch

### Option 3: Manual Deployment

1. **Build for production**:

   ```bash
   npm run build
   ```

2. **Serve the build**:
   ```bash
   npm start
   ```

## 🔧 Post-Deployment Configuration

### 1. Update Firebase Auth Domain

In Firebase Console > Authentication > Settings:

- Add your deployment domain to authorized domains
- Example: `your-project-id.web.app`

### 2. Update Firestore Security Rules

```bash
npm run firebase deploy --only firestore:rules
```

### 3. Update Storage Rules

```bash
npm run firebase deploy --only storage
```

### 4. Test PWA Features

- Test install prompt on mobile
- Verify offline functionality
- Check service worker registration in DevTools

## 🧪 Testing Your Deployment

### Core Features Checklist:

- [ ] User registration/login
- [ ] Google OAuth sign-in
- [ ] Create gift groups
- [ ] Add/manage group members
- [ ] Create gift lists
- [ ] Add/edit gift items
- [ ] Budget tracking
- [ ] Real-time collaboration
- [ ] PWA install prompt
- [ ] Offline functionality

### PWA Testing:

1. **Chrome DevTools > Application Tab**:

   - Verify Manifest loads correctly
   - Check Service Worker registration
   - Test offline mode

2. **Mobile Testing**:
   - Visit site on mobile browser
   - Look for "Add to Home Screen" prompt
   - Test app icon and splash screen

## 🎯 Performance Optimization

### Pre-Launch:

1. **Lighthouse Audit**:

   ```bash
   npx lighthouse https://your-app-url --view
   ```

2. **Bundle Analysis**:

   ```bash
   npm run build -- --analyze
   ```

3. **Firebase Performance Monitoring**:
   - Enable in Firebase Console
   - Monitor real user metrics

## 🔒 Security Considerations

### Production Firestore Rules:

Update your Firestore rules for production:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Group members can read/write group data
    match /giftGroups/{groupId} {
      allow read, write: if request.auth != null &&
        (request.auth.uid == resource.data.ownerId ||
         request.auth.uid in resource.data.memberIds);
    }

    // Similar rules for giftLists and giftItems...
  }
}
```

### Environment Variables:

- Never commit `.env.local` to version control
- Use your deployment platform's environment variable system
- Rotate Firebase keys periodically

## 📱 Mobile App Store (Optional)

### PWA to App Store:

1. **PWA Builder** (Microsoft):

   - Visit [pwabuilder.com](https://pwabuilder.com)
   - Enter your PWA URL
   - Generate app store packages

2. **Capacitor** (For native features):
   ```bash
   npm install @capacitor/core @capacitor/cli
   npx cap init
   npx cap add ios
   npx cap add android
   ```

## 🐛 Troubleshooting

### Common Issues:

1. **Firebase Auth Domain Error**:

   - Add your domain to Firebase Console > Authentication > Settings

2. **PWA Not Installing**:

   - Check HTTPS requirement
   - Verify manifest.json is accessible
   - Ensure service worker registers successfully

3. **Offline Mode Not Working**:

   - Check service worker cache strategy
   - Verify network requests in DevTools

4. **Real-time Updates Not Working**:
   - Check Firestore security rules
   - Verify WebSocket connections aren't blocked

## 📞 Support

If you encounter issues:

1. Check browser console for errors
2. Review Firebase Console logs
3. Test in incognito/private mode
4. Verify all environment variables are set correctly

## 🎉 You're Ready!

Your Christmas Gift List app is now production-ready with:

- ✅ Full authentication system
- ✅ Real-time collaboration
- ✅ Budget tracking
- ✅ Progressive Web App features
- ✅ Offline support
- ✅ Mobile-responsive design

Happy holidays and enjoy organizing your Christmas gifts! 🎄🎁
