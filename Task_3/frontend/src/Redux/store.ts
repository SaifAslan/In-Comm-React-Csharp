// Importing Redux Toolkit for store configuration
import { configureStore } from '@reduxjs/toolkit'; 

// Importing Redux Persist for state persistence
import { persistStore, persistReducer } from 'redux-persist'; 
import storage from 'redux-persist/lib/storage'; 

// Importing reducers from slices
import userReducer from './features/user/userSlice'; 
import enrollmentReducer from './features/Enrollments/enrollmentsSlice'; 

// Importing types for persistence configuration
import { PersistConfig } from 'redux-persist/es/types'; 

// Configuration for Redux Persist
const persistConfig: PersistConfig<any> = {
    key: 'root', // Key for the persisted store
    storage, // Storage engine (default: localStorage)
};

// Creating a persisted reducer for user state
const persistedUserReducer = persistReducer(persistConfig, userReducer);

// Configuring the Redux store
export const store = configureStore({
    reducer: {
        user: persistedUserReducer, // Using the persisted user reducer
        enrollment: enrollmentReducer, // Adding enrollment reducer
    },
});

// Creating a persistor for the store
export const persistor = persistStore(store);

// Defining RootState and AppDispatch types for TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
