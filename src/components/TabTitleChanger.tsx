"use client";

import { useEffect } from "react";

export default function TabTitleChanger() {
  useEffect(() => {
    const originalTitle = document.title;
    const awayTitle = "Připraveni začít proměnu? 🍎";
    let intervalId: NodeJS.Timeout | null = null;

    const startAlternating = () => {
      let showAwayTitle = true;
      document.title = awayTitle;

      intervalId = setInterval(() => {
        document.title = showAwayTitle ? originalTitle : awayTitle;
        showAwayTitle = !showAwayTitle;
      }, 2000); // Change every 2 seconds
    };

    const stopAlternating = () => {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
      document.title = originalTitle;
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        // User left the tab - start alternating
        startAlternating();
      } else {
        // User returned to the tab - stop alternating
        stopAlternating();
      }
    };

    const handleFocus = () => {
      stopAlternating();
    };

    const handleBlur = () => {
      startAlternating();
    };

    // Add event listeners
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);
    window.addEventListener("blur", handleBlur);

    // Cleanup function
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("blur", handleBlur);
      if (intervalId) {
        clearInterval(intervalId);
      }
      // Reset title when component unmounts
      document.title = originalTitle;
    };
  }, []);

  return null; // This component doesn't render anything
}
