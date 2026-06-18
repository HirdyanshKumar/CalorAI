<p align="center">
  <img src="./assets/icon.png" alt="CalorAI Logo" width="120" height="120" style="border-radius: 24px;" />
</p>

<h1 align="center">🥗 CalorAI</h1>
<p align="center">
  <b>AI-Powered Calorie Tracking & Smart Food Discovery App</b><br/>
  Built with React Native · Expo · TypeScript
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React_Native-0.79-61DAFB?logo=react&logoColor=white&style=for-the-badge" />
  <img src="https://img.shields.io/badge/Expo-53-000020?logo=expo&logoColor=white&style=for-the-badge" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white&style=for-the-badge" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" />
</p>

---

## 📋 Table of Contents

- [About the App](#about-the-app)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Walkthrough Video](#-walkthrough-video)
- [License](#license)

---

## 📖 About the App

**CalorAI** is a beautifully designed React Native mobile application that helps users discover and track food based on their personal taste profile. Users swipe through food cards (Tinder-style), build a unique taste fingerprint, and get AI-powered calorie + nutrition summaries tailored to their preferences.

---

## ✨ Features

- 🍕 **Swipe-based Food Discovery** — Like or skip foods with smooth gesture-driven UI
- 🎯 **Taste Profile Builder** — Dynamically computes user taste fingerprints
- 📊 **Results Dashboard** — Detailed calorie & macro breakdowns
- 🎨 **Glassmorphism Design** — Premium UI with dark theme & blur effects
- 🚀 **Cross-Platform** — Runs on iOS & Android via Expo
- 🧭 **Bottom Navigation** — Smooth tab-based navigation system

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React Native 0.79 + Expo 53 |
| Language | TypeScript 5.x |
| Navigation | React Navigation v7 |
| Animations | React Native Reanimated |
| Gestures | React Native Gesture Handler |
| Blur Effects | Expo Blur |
| Bundler | Babel + Metro |

---

## 🗂 Project Structure

```
CalorAI/
├── App.tsx                        # Root app component & navigation setup
├── index.ts                       # App entry point
├── app.json                       # Expo configuration
├── package.json                   # Dependencies & scripts
├── package-lock.json              # Lockfile
├── tsconfig.json                  # TypeScript config
├── babel.config.js                # Babel config
├── .gitignore                     # Git ignore rules
├── LICENSE                        # MIT License
├── AGENTS.md                      # Agent configuration
├── CLAUDE.md                      # Claude AI config
│
├── assets/                        # Static image assets
│   ├── icon.png                   # App icon
│   ├── favicon.png                # Web favicon
│   ├── splash-icon.png            # Splash screen icon
│   ├── android-icon-background.png
│   ├── android-icon-foreground.png
│   └── android-icon-monochrome.png
│
└── src/                           # Application source code
    ├── components/                # Reusable UI components
    │   ├── BottomNav.tsx          # Bottom tab navigation bar
    │   ├── FoodCard.tsx           # Swipeable food card component
    │   └── GlassCard.tsx          # Glassmorphism card wrapper
    │
    ├── screens/                   # App screens / pages
    │   ├── IntroScreen.tsx        # Onboarding / intro screen
    │   ├── SwipeScreen.tsx        # Main swipe food discovery screen
    │   └── ResultsScreen.tsx      # Calorie results & taste profile screen
    │
    ├── data/                      # Static & seed data
    │   └── foods.ts               # Food database with nutrition info
    │
    ├── theme/                     # Design system
    │   └── colors.ts              # Color palette & theme tokens
    │
    └── utils/                     # Utility / helper functions
        └── tasteProfile.ts        # Taste profile computation logic
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 18
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (Mac) or Android Emulator

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/CalorAI.git
cd CalorAI

# 2. Install dependencies
npm install

# 3. Start the Expo dev server
npx expo start

# 4. Scan QR code with Expo Go app on your phone
#    OR press 'i' for iOS simulator / 'a' for Android emulator
```

---

## 🎬 Walkthrough Video

Watch the full app demo and walkthrough on Google Drive:

[![CalorAI Walkthrough Video](https://img.shields.io/badge/▶_Watch_Demo-Google_Drive-4285F4?logo=googledrive&logoColor=white&style=for-the-badge)](https://drive.google.com/file/d/1OHVLlR6XO6ZYTVlNjqnpMph1sX2ypMs9/view?usp=sharing)

> 🔗 **Direct Link:** [https://drive.google.com/file/d/1OHVLlR6XO6ZYTVlNjqnpMph1sX2ypMs9/view?usp=sharing](https://drive.google.com/file/d/1OHVLlR6XO6ZYTVlNjqnpMph1sX2ypMs9/view?usp=sharing)

The walkthrough covers:
- 🚀 App launch & onboarding (IntroScreen)
- 🍕 Swipe-based food discovery (SwipeScreen)
- 📊 Calorie & taste profile results (ResultsScreen)

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](./LICENSE) file for details.

---

<p align="center">
  Made with ❤️ using React Native & Expo
</p>
