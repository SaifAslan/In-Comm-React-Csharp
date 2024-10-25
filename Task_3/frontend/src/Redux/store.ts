// src/store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import userReducer from './features/user/userSlice';
import { PersistConfig } from 'redux-persist/es/types';

const persistConfig: PersistConfig<any> = {
    key: 'root', // key for the persist store
    storage, // storage engine
};

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, userReducer);

export const store = configureStore({
    reducer: {
        user: persistedReducer // Use the persisted reducer
    }
});

export const persistor = persistStore(store); // Create a persistor

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
