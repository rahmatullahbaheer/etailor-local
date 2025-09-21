# Redux Toolkit Setup - Required Dependencies

## Install the following packages:

```bash
# Redux Toolkit and React Redux
npm install @reduxjs/toolkit react-redux

# Redux Persist for data persistence
npm install redux-persist

# AsyncStorage for React Native persistence
npm install @react-native-async-storage/async-storage

# If using Expo (recommended for React Native)
expo install @react-native-async-storage/async-storage
```

## Package Versions (Latest as of 2024):

- @reduxjs/toolkit: ^2.0.1
- react-redux: ^9.0.4
- redux-persist: ^6.0.0
- @react-native-async-storage/async-storage: ^1.21.0

## Installation Command:

```bash
npm install @reduxjs/toolkit react-redux redux-persist @react-native-async-storage/async-storage
```

## For Expo projects:

```bash
expo install @reduxjs/toolkit react-redux redux-persist @react-native-async-storage/async-storage
```

## What's Included:

### 1. Store Configuration (`src/store/index.js`)

- Configured Redux store with Redux Toolkit
- Redux Persist setup with AsyncStorage
- Proper middleware configuration
- TypeScript-ready types

### 2. Slices:

- **authSlice**: User authentication state
- **customerSlice**: Customer management with CRUD operations
- **orderSlice**: Order management with status tracking
- **measurementSlice**: Measurement templates and data
- **notificationSlice**: In-app notifications

### 3. Custom Hooks (`src/hooks/useRedux.js`)

- useAuth(): Authentication state and actions
- useCustomers(): Customer data with computed values
- useOrders(): Order data with filtering and stats
- useMeasurements(): Measurement data by category
- useNotifications(): Notification management

### 4. Features:

- ✅ Data persistence across app restarts
- ✅ Optimistic updates
- ✅ Loading and error states
- ✅ Search and filtering
- ✅ Computed selectors
- ✅ Bulk operations
- ✅ Auto-generated notifications
- ✅ TypeScript-ready structure

## Usage Example:

```javascript
import { useCustomers } from '../hooks/useRedux';
import { addCustomer } from '../store/slices/customerSlice';

const MyComponent = () => {
  const { customers, filteredCustomers, customerStats, dispatch } = useCustomers();

  const handleAddCustomer = (customerData) => {
    dispatch(addCustomer(customerData));
  };

  return (
    // Your component JSX
  );
};
```
