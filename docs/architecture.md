# Christmas Gift List App - Architecture Design

## Firebase Spark Plan Constraints

- **Firestore**: 50k reads/day, 20k writes/day, 20k deletes/day, 1GB storage
- **Authentication**: Unlimited social sign-in, 10k/month phone auth
- **Hosting**: 10GB bandwidth/month, 1GB storage
- **Functions**: Not available on Spark plan
- **Storage**: 5GB total, 1GB download/day
- **No Cloud Functions**: Must use client-side logic only

## Database Schema

### Collections Structure

```
users/
  {userId}/
    - email: string
    - displayName: string
    - photoURL: string
    - createdAt: timestamp
    - preferences: {
        notifications: boolean
        theme: 'light' | 'dark'
      }

giftGroups/
  {groupId}/
    - name: string (e.g., "Christmas 2025")
    - year: number
    - ownerId: string
    - memberIds: string[]
    - overallBudget: number
    - createdAt: timestamp
    - isActive: boolean

giftLists/
  {listId}/
    - groupId: string
    - recipientName: string
    - recipientId: string (optional - if they're a user)
    - budget: number
    - createdBy: string
    - collaboratorIds: string[]
    - createdAt: timestamp
    - updatedAt: timestamp

giftItems/
  {itemId}/
    - listId: string
    - title: string
    - description: string
    - imageUrl: string
    - links: [{url: string, label: string}]
    - estimatedPrice: number
    - isPurchased: boolean
    - purchasedBy: string
    - purchaseDate: timestamp
    - notes: string
    - priority: 'low' | 'medium' | 'high'
    - createdBy: string
    - createdAt: timestamp
    - updatedAt: timestamp
```

### Security Rules Strategy

- Users can only access groups they're members of
- Users can only edit lists they created or are collaborators on
- Gift items inherit permissions from their parent list
- Real-time updates for collaboration within groups

## App Architecture

### Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **State Management**: React Context + useReducer
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth (Google OAuth + Email/Password)
- **Hosting**: Firebase Hosting
- **PWA**: Next.js PWA plugin with service worker

### Component Structure

```
src/
  components/
    auth/
      - LoginForm.tsx
      - SignupForm.tsx
      - ProtectedRoute.tsx

    groups/
      - GroupList.tsx
      - GroupCard.tsx
      - CreateGroupForm.tsx
      - GroupMemberManager.tsx

    lists/
      - ListOverview.tsx
      - ListCard.tsx
      - CreateListForm.tsx
      - ListCollaborators.tsx

    items/
      - ItemList.tsx
      - ItemCard.tsx
      - AddItemForm.tsx
      - EditItemForm.tsx
      - ItemDetails.tsx

    budget/
      - BudgetTracker.tsx
      - BudgetProgress.tsx

    ui/
      - Button.tsx
      - Input.tsx
      - Modal.tsx
      - LoadingSpinner.tsx

  context/
    - AuthContext.tsx
    - AppStateContext.tsx

  hooks/
    - useFirestore.ts
    - useAuth.ts
    - usePWA.ts

  utils/
    - firebase.ts
    - helpers.ts
```

### User Flow

1. **Authentication**: Google OAuth or email/password signup
2. **Group Management**: Create/join annual gift groups
3. **List Creation**: Create lists for different recipients within a group
4. **Collaboration**: Invite others to collaborate on specific lists
5. **Item Management**: Add/edit gift items with rich metadata
6. **Budget Tracking**: Monitor spending against budgets
7. **Purchase Tracking**: Mark items as purchased to avoid duplicates

### PWA Features

- **Offline Support**: Cache critical data for offline browsing
- **Install Prompt**: Add to home screen functionality
- **Push Notifications**: Updates when collaborators make changes
- **Responsive Design**: Mobile-first approach

### Data Optimization (Spark Plan)

- **Batch Operations**: Minimize Firestore operations
- **Pagination**: Load data in chunks to stay under daily limits
- **Caching**: Use React Query/SWR for client-side caching
- **Image Optimization**: Use external URLs, resize on client
- **Lazy Loading**: Load components and data as needed

### Collaboration Features

- Real-time list updates using Firestore listeners
- User presence indicators
- Activity feed for group changes
- Email notifications (via client-side email services)

### Budget Management

- Per-list and overall group budgets
- Visual progress indicators
- Budget alerts (client-side calculations)
- Spending summaries by category/recipient

## Implementation Phases

1. **Core Setup**: Project init, auth, basic navigation
2. **Data Layer**: Firestore schema, security rules, CRUD operations
3. **UI Components**: Core screens and forms
4. **Collaboration**: Real-time updates, user management
5. **PWA Features**: Service worker, caching, install prompt
6. **Polish**: Budget tracking, notifications, error handling
