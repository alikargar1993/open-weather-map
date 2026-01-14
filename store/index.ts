import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import { asyncStorage } from "./persistence";

import weatherReducer from "./slices/weatherSlice";

// Combine all reducers
const rootReducer = combineReducers({
  weather: weatherReducer,
});

// Configure persist
const persistConfig = {
  key: "root",
  storage: asyncStorage,
  // Optionally whitelist or blacklist specific reducers
  // whitelist: ['example'], // only persist these reducers
  // blacklist: ['example'], // don't persist these reducers
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
