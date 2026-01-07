# Spinta Mobile App - Simple Explanation

This document explains how the Spinta mobile app works in simple terms, even if you're not a mobile developer.

---

## What is Spinta?

Spinta is a football (soccer) training and team management app with two types of users:
- **Coaches**: Manage teams, track player performance, create training plans
- **Players**: View their stats, training plans, and match history

---

## How the App is Organized

Think of the app like a house with different rooms. Here's the layout:

```
📱 Your App
│
├── 🏠 Entrance (App.tsx)
│   └── Loads fonts and sets up the whole app
│
├── 🚪 Front Door (RootNavigator)
│   └── Decides which part of the house you can access
│
├── 🔐 Guest Area (Auth Screens)
│   ├── Login
│   ├── Choose Role (Coach or Player)
│   └── Sign Up
│
├── ⚽ Player Wing (Player Screens)
│   ├── Home
│   ├── Training Plans
│   ├── My Stats
│   └── Profile
│
└── 👨‍🏫 Coach Wing (Coach Screens)
    ├── Club Overview
    ├── Players Management
    ├── AI Chatbot
    └── Profile
```

---

## The Flow: How Users Move Through the App

### 1. **Starting the App**
- App opens → Shows loading screen while fonts load
- Then checks: "Is this person logged in?"

### 2. **Not Logged In?**
You see the **Auth Screens**:
1. **Login Screen** - Enter email and password
2. OR **Sign Up** - Choose if you're a Coach or Player
   - **Coach**: Fill in your info + club info (2 steps)
   - **Player**: Enter invitation code from coach + your info (2 steps)
3. Success screen → "Welcome!" → Go to your dashboard

### 3. **Logged In as Player?**
You get **4 tabs at the bottom**:
- **Home**: See a welcome message
- **Training**: View training plans assigned by coach
- **Profile**: Your player info and stats
- **Settings**: App settings

### 4. **Logged In as Coach?**
You get **4 tabs at the bottom**:
- **Club**: Your team's overview, matches, and stats
- **Players**: List of all your players
- **Chatbot**: AI assistant for tactics and training
- **Profile**: Your coach info and team stats

From these screens, you can tap on things to see more details (like tapping a player to see their full profile).

---

## The Building Blocks

### 🧱 Components (Reusable Pieces)

Think of components like LEGO blocks you can reuse:

#### **Common Components** (Used Everywhere)
- **Button**: Orange, black, or outlined buttons
- **Input**: Text boxes for typing (email, password, etc.)
- **Card**: White boxes with shadows that hold information
- **Loading**: Spinning circle when something is loading

#### **Auth Components** (For Logging In)
- **LoginForm**: Email + password form
- **RoleSelector**: Choose Coach or Player
- **RegistrationForm**: Sign-up forms

#### **Coach Components**
- **AttributeRadar**: The hexagon chart showing player skills

---

## How Data Moves Around

### 📦 **Storage (Where Data Lives)**

1. **On Your Phone (AsyncStorage)**
   - When you log in, the app saves your login info
   - Even if you close the app, it remembers you

2. **On the Server (Backend API)**
   - All the real data (players, matches, stats) lives on a server
   - The app talks to the server to get and update data

### 🔄 **The Data Journey**

Let's say a coach wants to see their players:

```
1. Coach taps "Players" tab
   ↓
2. App says "Give me the player list" to the server
   ↓
3. Server sends back the list
   ↓
4. App saves it temporarily (caching)
   ↓
5. App shows the players on screen
```

The app uses **React Query** to handle this. It's smart:
- Keeps a copy of data so it loads instantly next time
- Updates automatically when data changes
- Shows loading spinners while fetching

---

## State Management (Remembering Things)

The app uses **Zustand** - think of it as the app's memory:

### **authStore** (Who's logged in?)
- Stores: Your user info, login tokens
- Actions:
  - `setUser()` - Remember who you are
  - `logout()` - Forget everything and go back to login

### **playerStore & coachStore** (Future)
- Currently empty placeholders
- Will store role-specific data later

---

## The Technology Stack (What it's Built With)

### **Core Framework**
- **Expo**: Makes building mobile apps easier
- **React Native**: Write code once, works on iPhone and Android

### **Navigation**
- **React Navigation**: Moves between screens
- Like a GPS for the app - knows where you are and where you can go

### **Forms**
- **react-hook-form**: Makes forms easy to build
- **Zod**: Checks if you typed valid information (like "is this a real email?")

### **Styling**
- **Custom Colors**: Orange (#FF3000), Black, White
- **Custom Font**: Franklin Gothic (bold, modern look)

---

## Key Folders Explained

```
src/
├── screens/          → Full pages you see (Login, Home, Profile, etc.)
├── components/       → Reusable pieces (Buttons, Inputs, Cards)
├── navigation/       → How you move between screens
├── api/             → Talks to the server
├── stores/          → App's memory (Zustand)
├── hooks/           → Custom reusable functions
├── constants/       → Colors, routes, config (things that don't change)
├── types/           → TypeScript definitions (what shape data should have)
└── utils/           → Helper functions (formatting dates, validation, etc.)
```

---

## Common Patterns You'll See

### **Pattern 1: Reading Data**
```javascript
// Get the current user
const { user, isAuthenticated } = useAuth();

// Show user's name
<Text>Welcome, {user.firstName}!</Text>
```

### **Pattern 2: Forms**
```javascript
// Create a form
const form = useForm();

// When submitted
const onSubmit = (data) => {
  // Send to server
  login(data);
};
```

### **Pattern 3: Navigation**
```javascript
// Go to another screen
navigation.navigate('PlayerDetail');

// Go back
navigation.goBack();
```

---

## How a Feature Works End-to-End

### Example: Coach Views a Player's Stats

1. **Screen**: Coach taps on "Marcus Silva" in Players list
2. **Navigation**: App navigates to `PlayerDetailScreen`
3. **Data Fetch**: Screen calls `usePlayerStats(playerId)`
4. **API Call**: React Query sends request to `/players/10/stats`
5. **Server**: Returns Marcus's stats (goals, assists, etc.)
6. **Cache**: React Query saves it for 5 minutes
7. **Display**: Screen shows:
   - Radar chart with attributes
   - Season statistics
   - Match history
8. **User Interaction**: Coach can now:
   - Create a training plan
   - View individual match performance
   - See training progress

---

## The Visual Identity

### **Colors**
- **Primary**: Bright orange-red (#FF3000) - Used for buttons, highlights
- **Secondary**: Black (#000000) - Text and secondary buttons
- **Success**: Green - For wins, completed items
- **Error**: Red - For losses, errors

### **Typography**
- **Font**: Franklin Gothic (currently using fallback system fonts)
- **Sizes**: 12px to 36px depending on importance

### **Design Principles**
- Bold and energetic
- High contrast (easy to read)
- Clean and modern
- Touch-friendly (minimum 48px for buttons)

---

## What Makes This App Special

1. **Role-Based**: Completely different experience for coaches vs players
2. **AI Assistant**: Coaches get a chatbot for tactics and training advice
3. **Real-Time Stats**: Track detailed football statistics
4. **Training Plans**: Custom, AI-generated training programs
5. **Radar Charts**: Visual representation of player attributes

---

## Current Limitations

- **Mock Data**: Most screens show placeholder data
- **API Not Connected**: Login currently bypasses the real API
- **Missing Features**: Some screens from the design aren't built yet
- **Player Store Empty**: No player-specific state management yet

---

## Next Steps for Development

1. Connect screens to real API endpoints
2. Build missing screens from UI design
3. Implement player store with real data
4. Add AI chatbot functionality
5. Enable training plan creation
6. Add match statistics tracking

---

This app is a work in progress, with a solid foundation in place. The architecture is clean, scalable, and ready for the remaining features to be added!
