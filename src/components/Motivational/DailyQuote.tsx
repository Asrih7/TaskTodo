import React, { useState, useEffect } from "react";

const QUOTES = [
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { text: "The future depends on what you do today.", author: "Mahatma Gandhi" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Start where you are. Use what you have. Do what you can.", author: "Arthur Ashe" },
  { text: "Every moment is a fresh beginning.", author: "T.S. Eliot" },
  { text: "The harder you work for something, the greater you'll feel when you achieve it.", author: "Anonymous" },
];

const DailyQuote: React.FC = () => {
  const [quote, setQuote] = useState(QUOTES[0]);

  useEffect(() => {
    // Select quote based on day of year for consistency
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    setQuote(QUOTES[dayOfYear % QUOTES.length]);
  }, []);

  return (
    <div className="bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-lg p-4 shadow-md">
      <div className="flex items-start gap-3">
        <span className="text-3xl">💫</span>
        <div>
          <p className="text-slate-700 dark:text-slate-300 italic mb-2">
            "{quote.text}"
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            — {quote.author}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DailyQuote;
