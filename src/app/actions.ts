'use server';

export async function getWeatherData(location: string) {
  try {
    const apiKey = process.env.WEATHER_API_KEY;
    if (!apiKey) {
      console.error("Weather API key is not configured on the server.");
      // Do not expose detailed error messages to the client for security reasons.
      throw new Error("Could not fetch weather data due to a server configuration issue.");
    }
    const res = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=7&aqi=no&alerts=no`);
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData?.error?.message || 'Failed to fetch weather data.');
    }
    const data = await res.json();
    return { success: true, data };
  } catch (error) {
    console.error("Error in getWeatherData server action:", error);
    if (error instanceof Error) {
        return { success: false, error: error.message };
    }
    return { success: false, error: 'An unknown error occurred while fetching weather.' };
  }
}
