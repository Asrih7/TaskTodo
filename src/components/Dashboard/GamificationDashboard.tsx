import React from "react";
import XPBar from "../Gamification/XPBar";
import StreakCounter from "../Gamification/StreakCounter";
import BadgeDisplay from "../Gamification/BadgeDisplay";
import MoodTracker from "../Mood/MoodTracker";
import VoiceInput from "../Voice/VoiceInput";
import AnalyticsDashboard from "../Analytics/AnalyticsDashboard";
import FocusMode from "../Focus/FocusMode";
import SmartTaskInput from "../SmartInput/SmartTaskInput";
import ThemeSelector from "../Theme/ThemeSelector";
import DailyQuote from "../Motivational/DailyQuote";

const GamificationDashboard: React.FC = () => {
  return (
    <div className="space-y-4 p-4 max-w-6xl mx-auto">
      {/* Daily Quote */}
      <DailyQuote />

      {/* XP and Streak */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <XPBar />
        <StreakCounter />
      </div>

      {/* Mood and Voice */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <MoodTracker />
        <VoiceInput />
      </div>

      {/* Smart Input */}
      <SmartTaskInput />

      {/* Focus Mode */}
      <FocusMode />

      {/* Badges */}
      <BadgeDisplay />

      {/* Analytics */}
      <AnalyticsDashboard />

      {/* Theme Selector */}
    </div>
  );
};

export default GamificationDashboard;
