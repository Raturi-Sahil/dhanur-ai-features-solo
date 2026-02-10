# Dhanur AI App Features

A React Native mobile application built with Expo that provides voice-to-text recording and teleprompter functionality for content creators.

## Features

### 🎙️ Voice Script Recorder
- **Voice-to-Text Conversion**: Real-time speech recognition while recording
- **Audio Recording**: High-quality audio capture with pause/resume functionality
- **Live Transcription**: See your words appear as you speak
- **Manual Editing**: Edit transcribed text before saving
- **Script Management**: Save and manage multiple scripts with titles

### 📺 Teleprompter
- **Auto-Scroll**: Smooth automatic scrolling at customizable speeds
- **Script Navigation**: Browse through saved scripts with prev/next controls
- **Speed Control**: Adjust scroll speed from 0.5x to 5x with +/- buttons
- **Font Size Control**: Change text size from 16px to 64px for optimal readability
- **Mirror Mode**: Flip text horizontally for front-camera recording
- **Settings Panel**: Dropdown menu with all customization options

## Tech Stack

- **Framework**: React Native with Expo SDK 54
- **Navigation**: React Navigation (Bottom Tabs)
- **Storage**: AsyncStorage for local data persistence
- **Speech Recognition**: Expo Speech Recognition
- **Audio Recording**: Expo AV (Audio)
- **UI Components**: React Native core components + Ionicons
- **Fonts**: Jost (Google Fonts)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd dhanur-ai-app-features
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npx expo start
   ```

4. **Run on device**
   - Scan QR code with Expo Go app (Android/iOS)
   - Or press `a` for Android emulator / `i` for iOS simulator

## Project Structure

```
src/
├── components/
│   └── FeatureCard.tsx       # Reusable card component for home screen
├── screens/
│   ├── HomeScreen.tsx         # Landing page with feature cards
│   ├── RecorderScreen.tsx     # Voice recording & transcription
│   └── TeleprompterScreen.tsx # Teleprompter with controls
├── services/
│   └── audioService.ts        # Audio recording service
├── types/
│   └── index.ts               # TypeScript type definitions
└── App.tsx                    # Root component with navigation
```

## Usage

### Recording a Script

1. Navigate to the **Record** tab
2. Tap the **microphone icon** to start recording
3. Speak your script - text appears in real-time
4. Tap **pause** to pause recording, **stop** to finish
5. Edit the transcribed text if needed
6. Enter a title and tap **Save Script**

### Using the Teleprompter

1. Navigate to the **Teleprompter** tab
2. Use **< >** arrows to select a saved script
3. Tap **⚙️ Settings** to adjust:
   - **Speed**: Control scroll speed
   - **Font Size**: Adjust text size
   - **Mirror Mode**: Flip text for front camera
4. Tap **Start** to begin auto-scrolling
5. Tap **Stop** to pause, **Reset** to return to top

## Key Features Implementation

### Auto-Scroll Mechanism
- Uses `useRef` for scroll position tracking
- `setInterval` for continuous smooth scrolling
- Dynamic speed control (0.5x - 5x)

### Speech Recognition
- Real-time transcription with `expo-speech-recognition`
- Event-driven updates with `useSpeechRecognitionEvent`
- Continuous recognition during recording

### Script Persistence
- AsyncStorage for local data storage
- JSON serialization of script objects
- `useFocusEffect` for automatic reload on tab navigation

### Mirror Mode
- CSS transform `scaleX(-1)` for horizontal flip
- Useful for reading while recording with front camera

## Color Theme

- **Primary**: Cyan (#00D9E1, #00B8D4)
- **Background**: Dark Navy (#0f0f1e)
- **Text**: Soft White (#F5F5F5)
- **Accents**: Teal gradients with glowing effects

## Requirements

- Node.js 16+
- Expo CLI
- iOS 13+ / Android 5+
- Microphone permissions for recording
- Speech recognition support on device

## Known Issues

- `expo-av` deprecation warning (will migrate to `expo-audio` in future)
- Native slider component replaced with custom +/- controls for Expo Go compatibility

## Future Enhancements

- Cloud sync for scripts
- Audio playback of recordings
- Export scripts to PDF/TXT
- Custom color themes
- Gesture controls for teleprompter

## License

MIT

## Author

Built with ❤️ using React Native and Expo
