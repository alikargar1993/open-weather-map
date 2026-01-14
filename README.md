# Weather MVP 🌤️

A beautiful, feature-rich weather application built with React Native, Expo Router, Redux Toolkit, and TypeScript. Get real-time weather data, forecasts, and more!

## Features

- 🌍 **Automatic Location Detection** - Automatically detects your location and shows local weather on app launch
- 🔍 **City Search** - Search for weather in any city worldwide with real-time search functionality
- 📊 **Current Weather** - Comprehensive weather display including:
  - Current temperature with "feels like" temperature
  - Weather condition with animated icons
  - Humidity percentage
  - Wind speed and direction
  - Atmospheric pressure
  - Visibility distance
- 📅 **5-Day Forecast** - Daily high/low temperatures grouped by day with weather conditions
- ⏰ **Hourly Forecast** - Next 24 hours forecast with hourly temperature and conditions
- 🔄 **Pull-to-Refresh** - Swipe down to refresh weather data
- 📍 **Location FAB** - Floating action button to quickly get weather for your current location
- 🕐 **Real-time Clock** - Live clock display showing current date and time
- 📝 **Last Updated Indicator** - Shows when weather data was last refreshed
- 🌙 **Dark Mode Support** - Automatic dark mode based on system preferences
- 💾 **Offline Support** - Caches weather data for offline viewing (10-minute cache expiry)
- ✨ **Smooth Animations** - Beautiful animated transitions using React Native Reanimated
- 🎨 **Modern UI** - Clean, intuitive interface with weather icons and haptic feedback
- 📱 **Tab Navigation** - Easy navigation between Home and Info screens

## Tech Stack

- **React Native 0.81.5** with **Expo ~54.0.31** - Cross-platform mobile development
- **Expo Router ~6.0.21** - File-based routing and navigation
- **TypeScript ~5.9.2** - Type-safe code
- **Redux Toolkit 2.11.2** - State management
- **Redux Persist 6.0.0** with **AsyncStorage** - Persistent storage for offline support
- **React Native Reanimated ~4.1.1** - Smooth animations and transitions
- **Expo Location ~19.0.8** - Geolocation services
- **React Native Gesture Handler** - Touch gestures and pull-to-refresh
- **OpenWeatherMap API** - Weather data provider
- **Jest** - Testing framework
- **React Testing Library** - Component testing utilities

## How It Works

### App Architecture

The app uses **Expo Router** for file-based routing, providing a native navigation experience:

- **Home Tab (`app/(tabs)/index.tsx`)**: Main weather screen displaying current weather, hourly forecast, and daily forecast
- **Info Tab (`app/(tabs)/info.tsx`)**: Information screen with API details and developer information

### State Management

- **Redux Toolkit** manages all weather-related state
- **Redux Persist** automatically saves weather data to AsyncStorage
- Weather data is cached for 10 minutes to reduce API calls and enable offline viewing
- On app launch, cached data is loaded first (if available and not expired), then fresh data is fetched

### Data Flow

1. **App Launch**:
   - Loads cached weather data from AsyncStorage (if available and not expired)
   - Automatically fetches weather for user's current location
2. **City Search**:
   - User searches for a city
   - App fetches current weather and forecast for that city
   - Updates Redux store and caches the data
3. **Location Update**:

   - User taps the location FAB button
   - App requests current location permission
   - Fetches weather for current coordinates
   - Updates Redux store and caches the data

4. **Pull-to-Refresh**:
   - User pulls down on the home screen
   - App fetches fresh weather data for the current city/location
   - Updates display with new data

### Caching Strategy

- Weather data is cached in AsyncStorage with a 10-minute expiry
- Cache includes: current weather, forecast, hourly forecast, and city name
- Expired cache is automatically refreshed when online
- Offline mode shows last cached data if available

## Setup

### Prerequisites

- Node.js 18+ installed
- Yarn package manager (or npm)
- Expo CLI (`npm install -g expo-cli` or use `npx expo`)
- OpenWeatherMap API key (free tier available at https://openweathermap.org/api)
- iOS Simulator (for macOS) or Android Emulator (for development)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/alikargar1993/open-weather-map.git
   cd OpenWeatherMap
   ```

2. **Install dependencies**

   ```bash
   yarn install
   ```

   or

   ```bash
   npm install
   ```

3. **Configure API Key**

   Create a `.env` file in the root directory:

   ```bash
   EXPO_PUBLIC_WEATHER_API_KEY=your_api_key_here
   ```

   Get your free API key from [OpenWeatherMap](https://openweathermap.org/api)

4. **Start the app**

   ```bash
   yarn start
   ```

   or

   ```bash
   npm start
   ```

   Then press:

   - `i` for iOS simulator
   - `a` for Android emulator
   - `w` for web browser

### Platform-Specific Setup

#### iOS

```bash
yarn ios
```

or

```bash
npm run ios
```

#### Android

```bash
yarn android
```

or

```bash
npm run android
```

## Running Tests

```bash
# Run all tests
yarn test

# Run tests in watch mode
yarn test:watch

# Run tests with coverage
yarn test:coverage
```

## Project Structure

```
OpenWeatherMap/
├── app/                          # Expo Router app directory
│   ├── (tabs)/                  # Tab navigation screens
│   │   ├── _layout.tsx         # Tab layout configuration
│   │   ├── index.tsx           # Home screen (main weather display)
│   │   └── info.tsx            # Info screen (about and API info)
│   ├── _layout.tsx              # Root layout with Redux Provider
│   └── modal.tsx                # Modal screen
├── components/                   # Reusable components
│   ├── weather/                 # Weather-specific components
│   │   ├── CurrentWeather.tsx   # Current weather display
│   │   ├── DailyForecast.tsx   # 5-day forecast component
│   │   ├── HourlyForecast.tsx  # 24-hour forecast component
│   │   ├── SearchBar.tsx       # City search input
│   │   ├── WeatherIcon.tsx     # Weather icon component
│   │   ├── LoadingSpinner.tsx  # Loading indicator
│   │   └── ErrorMessage.tsx    # Error display component
│   ├── themed-text.tsx          # Themed text component
│   ├── themed-view.tsx          # Themed view component
│   └── ui/                      # UI components
├── services/                     # API services
│   ├── weatherApi.ts            # OpenWeatherMap API client
│   └── locationService.ts       # Geolocation service
├── store/                        # Redux store
│   ├── index.ts                 # Store configuration
│   ├── hooks.ts                 # Typed Redux hooks
│   ├── persistence.ts           # AsyncStorage persistence setup
│   └── slices/
│       └── weatherSlice.ts      # Weather state slice
├── types/                        # TypeScript type definitions
│   └── weather.ts               # Weather-related types
├── utils/                        # Utility functions
│   ├── dateUtils.ts             # Date formatting utilities
│   └── weatherUtils.ts          # Weather data processing utilities
├── constants/                    # App constants
│   └── theme.ts                 # Theme colors and styles
├── hooks/                        # Custom React hooks
│   ├── use-color-scheme.ts      # Color scheme hook
│   └── use-theme-color.ts       # Theme color hook
├── assets/                       # Static assets
│   └── images/                  # App icons and images
├── android/                      # Android-specific files
├── ios/                          # iOS-specific files
└── __tests__/                    # Test files
    ├── components/
    ├── services/
    └── utils/
```

## Features in Detail

### Weather Data Display

The app displays comprehensive weather information:

- **Current Weather Card**:

  - City name and country
  - Current temperature (large display)
  - "Feels like" temperature
  - Weather condition description
  - Animated weather icon
  - Humidity, wind speed, pressure, and visibility

- **Hourly Forecast**:

  - Next 24 hours displayed horizontally
  - Time, temperature, and weather icon for each hour
  - Scrollable horizontal list

- **Daily Forecast**:
  - 5-day forecast grouped by day
  - Day name, high/low temperatures
  - Weather condition and icon
  - Additional details (humidity, wind speed)

### User Interactions

- **Search**: Type city name in search bar to get weather for any location
- **Pull-to-Refresh**: Swipe down on home screen to refresh weather data
- **Location FAB**: Tap floating action button to get weather for current location
- **Tab Navigation**: Switch between Home and Info tabs using bottom navigation

### Offline Support

Weather data is automatically cached using AsyncStorage. Cached data expires after 10 minutes and is automatically refreshed when online. If offline, the app displays the last cached data (if available).

### Dark Mode

The app automatically adapts to your system's dark mode preference using React Native's built-in theming system. All components support both light and dark themes.

### Animations

The app uses React Native Reanimated for smooth, performant animations:

- Fade-in animations for components on load
- Staggered delays for sequential component appearance
- Smooth transitions between states

## API Usage

This app uses the OpenWeatherMap Free Tier API:

- **Base URL**: `https://api.openweathermap.org/data/2.5`
- **Rate Limits**:
  - 60 calls per minute
  - 1,000,000 calls per month
- **Endpoints Used**:
  - `/weather` - Current weather data
  - `/forecast` - 5-day weather forecast

## Developer Information

- **Developer**: Ali Kargar
- **Email**: kargar.ali.1993@gmail.com
- **GitHub**: [alikargar1993/open-weather-map](https://github.com/alikargar1993/open-weather-map)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is private and proprietary.

## TODO

- Improve API request logic, using "react-query" instead of "axios"
- Add new page to see the list of searched cities

## Learn more

- [Expo documentation](https://docs.expo.dev/)
- [Expo Router documentation](https://docs.expo.dev/router/introduction/)
- [React Native documentation](https://reactnative.dev/)
- [Redux Toolkit documentation](https://redux-toolkit.js.org/)
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)
- [OpenWeatherMap API](https://openweathermap.org/api)
