# Annadata AI v2.0

**Created by Aryan | Powered by Firebase**

Annadata AI is an intelligent, modern farming assistant designed to empower Indian farmers with data-driven insights. This Next.js application provides personalized crop recommendations, real-time weather information, and detailed agricultural guidance in multiple languages.

## Features

- **Seasonal & Location-Aware Crop Recommendations**: Suggests the most suitable crops based on the user's state, the current agricultural season (Kharif, Rabi, Zaid), and local soil type.
- **Dynamic Weather Dashboard**: Displays current weather conditions, including temperature, humidity, and wind speed, based on the user's location.
- **Manual Location Selection**: Users can manually set their state and district to receive tailored advice.
- **Multi-Language Support**: The UI seamlessly switches between English, Hindi, and other regional languages.
- **Detailed Crop Guides**: Offers comprehensive lifecycle information for over 10 major Indian crops, covering everything from sowing to harvesting.
- **Comprehensive Admin Panel**: A secure area for administrators to manage all application data, including crops, weather alerts, farming tips, states, and seasons.
- **Modern, Responsive UI**: Built with Tailwind CSS and shadcn/ui, the application features a beautiful, glassmorphism-inspired design that works flawlessly on both desktop and mobile devices.

## Technology Stack

- **Framework**: [Next.js](https://nextjs.org/) 15 (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/)
- **Database**: [Cloud Firestore](https://firebase.google.com/products/firestore)
- **Authentication**: [Firebase Authentication](https://firebase.google.com/products/auth)
- **Hosting**: [Firebase App Hosting](https://firebase.google.com/products/app-hosting)
- **AI**: [Genkit](https://firebase.google.com/docs/genkit) (scaffolding in place)

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js (v18 or later recommended)
- npm or yarn

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your-username/annadata-ai.git
    cd annadata-ai
    ```

2.  **Install NPM packages:**
    ```sh
    npm install
    ```

3.  **Set up Firebase:**
    - The project is configured to work with Firebase App Hosting's zero-config setup. For local development, ensure your `src/firebase/config.ts` file contains your Firebase project's configuration object.

4.  **Run the development server:**
    ```sh
    npm run dev
    ```

Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

### Seeding the Database

To populate the Firestore database with initial sample data (crops, seasons, etc.), navigate to the Admin Dashboard in the app and click the **"Seed Database"** button.
