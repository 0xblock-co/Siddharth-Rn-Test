# Dynamic Kanban Workflow System

A high-performance, API-driven Kanban management application built with React Native. This system features dynamic lead/candidate management, real-time synchronization, and a highly customizable workflow engine.

## 🚀 Features

### 1. Dynamic Kanban Board
- **Infinite Scrolling**: Smooth loading of items per status column.
- **Interactive Status Management**: Move items between columns with real-time API sync.
- **Visual Priority**: Items show values, assignees, and key metadata at a glance.

### 2. Intelligent Lead/Candidate Profiling
- **Dynamic Detail Views**: Screens automatically adapt their fields based on the workflow type (Leads, Candidates, etc.).
- **Inline Editing**: Quickly update any dynamic field through an integrated form modal.
- **Assignee Management**: Seamlessly reassign items to different team members.

### 3. Power Filtering
- **Owner Filter**: Drill down into items managed by specific team members.
- **Stage Filter**: Focused "List View" mode by filtering the board to a specific status.
- **Interactive Filter Bar**: Clean, chip-based UI for managing active filters.

### 4. Technical Excellence
- **Real-Time Data Sync**: Powered by **RTK Query** with optimistic updates for an "instant" feel.
- **Robust Caching**: 5-minute global cache persistence to eliminate redundant loading.
- **Safety First**: Secure item deletion with double-confirmation alerts.

---

## 🛠 Tech Stack

- **Framework**: React Native (TypeScript)
- **State & Data**: Redux Toolkit (RTK Query)
- **Navigation**: React Navigation (Drawer & Stack hybrid)
- **Styling**: Vanilla StyleSheet with Responsive Utilities
- **Modals**: react-native-modal
- **Selects**: react-native-element-dropdown
- **Icons & Assets**: Custom Image system with responsive scaling

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js (v16+)
- Watchman (for macOS)
- CocoaPods (for iOS)
- Android Studio / Xcode

### 1. Clone & Install
```bash
# Clone the repository
git clone <repository-url>
cd Siddharth-Rn-Test

# Install dependencies
npm install
```

### 2. iOS Setup
```bash
cd ios
pod install
cd ..
```

### 3. Run the Application

**For iOS:**
```bash
npx react-native run-ios
```

**For Android:**
```bash
npx react-native run-android
```

---

## 📂 Project Structure

- `src/redux/api/`: API slice and endpoint definitions.
- `src/components/`: Reusable UI components (Kanban, Modals, Forms).
- `src/screens/`: Feature-specific screens (Home, Workflow, Details).
- `src/navigation/`: Navigation configuration and screen names.
- `src/theme/`: Shared colors and general styling.
- `src/utils/`: Responsive functions and API constants.

---

## 📝 Recent Improvements
- **Optimistic Updates**: UI updates instantly before API confirmation.
- **Reference Stability**: Fixed infinite re-render loops in dynamic forms.
- **Key Prop Fixes**: Optimized list rendering performance across detail screens.
