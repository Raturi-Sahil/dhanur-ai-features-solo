# Dhanur AI – App Feature Implementations

## Overview

This repository contains independent feature implementations developed for the Dhanur AI mobile application as part of the internship assignment. The goal of this work is to design, implement, and document core app-level features with a focus on usability, permissions handling, and media controls.

## Features Implemented

### 1. Live Captioning
- Real-time speech-to-text conversion
- Dynamic caption rendering on screen
- Handles start, pause, and stop states
- Graceful handling of permission and runtime errors

### 2. Microphone Control & Permissions
- Runtime microphone permission handling
- User-controlled mic enable/disable
- Safe release of microphone resources
- Handles permission denial and revocation cases

### 3. Overlay Player & Playback Speed Control
- Floating overlay (picture-in-picture style) playback
- Playback speed control (0.5x – 2x)
- Persistent speed selection
- Lifecycle-safe overlay handling

## Tech Stack

- **Platform**: React Native (Expo)
- **Language**: TypeScript/JavaScript
- **Key Libraries**: 
  - Expo Speech Recognition (Live Captioning)
  - React Native Video (Overlay Player)
  - Expo AV (Microphone Control)
- **Version Control**: Git

## Repository Structure

Currently, all feature implementations are integrated into a single React Native application for demonstration and evaluation purposes.

## Setup & Run

1. **Clone the repository**
   ```bash
   git clone [repository-url]
   cd dhanur-ai-app-features
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the application**
   ```bash
   npx expo start
   ```

4. **Test on device**
   - Scan the QR code with Expo Go app (iOS/Android)
   - Or press `i` for iOS simulator / `a` for Android emulator

## Notes

- Each feature is implemented with modularity in mind for easy integration into the main application
- All features handle runtime permissions and edge cases gracefully
- This repository is intended for evaluation and learning purposes as part of the Dhanur AI internship assignment

## Requirements

- Node.js 16+ 
- Expo CLI
- iOS Simulator (macOS) or Android Emulator
- Physical device with Expo Go app (recommended for testing microphone and overlay features)