# Annadata: Smart Farming Assistant

**Created by Aryan | Powered by Firebase**

Annadata is an intelligent, modern farming assistant designed to empower Indian farmers with actionable, data-driven insights. This Next.js application provides personalized crop recommendations, real-time weather alerts and forecasts, and dynamic agricultural guidance in multiple languages.

## Key Features

- **Smart Weather Alert System**: A production-ready, rule-based system that displays high-priority alerts for heatwaves, rain, frost, or dry spells using real-time forecast data from the Weather API. If no risks are detected, it clearly displays a "Normal" weather status, providing peace of mind.
- **Dynamic Farming Tips**: Delivers context-aware farming tips that change on every refresh based on live weather conditions, providing relevant advice when it's needed most.
- **Seasonal & Location-Aware Crop Recommendations**: Suggests the most suitable crops based on the user's state, the current agricultural season (Kharif, Rabi, Zaid), and local soil type.
- **Real-Time Weather Dashboard**: Displays current weather conditions and a 7-day forecast, including temperature, humidity, and wind speed, based on the user's location.
- **Secure Admin Panel**: A comprehensive and secure dashboard for a single administrator to manage all application data.
    - **Secure Login**: Access is protected by a dedicated username and password.
    - **Data Management**: Easily add, edit, and delete crops, farming tips, and weather alert rules.
    - **Direct Image Uploads**: Upload crop images directly from your device, ensuring they are never lost or broken.
- **Multi-Language Support**: The UI seamlessly switches between English, Hindi, and other regional languages to serve a diverse user base.
- **Detailed Crop Guides**: Offers comprehensive lifecycle information for over 10 major Indian crops, covering everything from sowing to harvesting.
- **Modern, Responsive UI**: Built with Tailwind CSS and shadcn/ui, the application features a beautiful, clean design that works flawlessly on both desktop and mobile devices.

## Technology Stack

- **Framework**: [Next.js](https://nextjs.org/) 15 (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/)
- **Database**: [Cloud Firestore](https://firebase.google.com/products/firestore)
- **Authentication**: [Firebase Authentication](https://firebase.google.com/products/auth)
- **Hosting**: [Firebase App Hosting](https://firebase.google.com/products/app-hosting)

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js (v18 or later recommended)
- npm or yarn

### Installation

1.  **Clone the repository:**
    ```sh
    git clone <your-repository-url>
    cd annadata
    ```

2.  **Install NPM packages:**
    ```sh
    npm install
    ```

3.  **Set up Environment Variables:**
    - Create a file named `.env.local` in the root of your project.
    - Add your WeatherAPI.com key to this file to enable the weather features:
      ```
      NEXT_PUBLIC_WEATHER_API_KEY=your_weather_api_key_here
      ```

4.  **Set up Firebase:**
    - The project is configured to work with Firebase App Hosting's zero-config setup. For local development, ensure your `src/firebase/config.ts` file contains your Firebase project's configuration object.

5.  **Run the development server:**
    ```sh
    npm run dev
    ```

Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.
