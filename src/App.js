import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";

// Animated Sentiment Score Box
const SentimentScore = ({ label, count, total, colorClass }) => {
  const percentage = total > 0 ? ((count / total) * 100).toFixed(1) : 0;

  return (
    <motion.div
      className="text-center p-3 flex-1 rounded-xl bg-white/30 backdrop-blur-md shadow-md"
      whileHover={{ scale: 1.05 }}
    >
      <motion.p
        className={`text-2xl font-extrabold ${colorClass}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {count}
      </motion.p>
      <p className="text-xs text-gray-700 uppercase tracking-wider">{label}</p>
      <p className="text-sm font-semibold text-gray-800">{percentage}%</p>
    </motion.div>
  );
};

// Expandable Analysis Card
const AnalysisResultCard = ({ result }) => {
  const { placeName, input, analysis, analyzedComments, timestamp } = result;
  const { positive, negative, neutral, total, overallSentiment } = analysis;

  const [expanded, setExpanded] = useState(false);

  const sentimentColorMap = {
    positive: "text-green-500",
    negative: "text-red-500",
    neutral: "text-yellow-500",
    no_reviews: "text-gray-500",
  };

  const sentimentBorderMap = {
    positive: "border-green-500",
    negative: "border-red-500",
    neutral: "border-yellow-500",
    no_reviews: "border-gray-500",
  };

  return (
    <motion.div
      layout
      className={`bg-gradient-to-r from-blue-50 to-purple-100 shadow-lg rounded-2xl p-6 mb-6 border-l-8 ${sentimentBorderMap[overallSentiment]}`}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-bold text-gray-900">{placeName}</h3>
          <p className="text-sm text-gray-600 break-all mb-2">
            Input: {input}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold capitalize">
            Overall:{" "}
            <span className={sentimentColorMap[overallSentiment]}>
              {overallSentiment.replace("_", " ")}
            </span>
          </p>
          <p className="text-xs text-gray-500">
            {new Date(timestamp).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Sentiment Stats */}
      <div className="bg-white/40 backdrop-blur-md rounded-xl my-4 p-3 flex justify-around items-center gap-2">
        <SentimentScore
          label="Positive"
          count={positive}
          total={total}
          colorClass="text-green-500"
        />
        <SentimentScore
          label="Negative"
          count={negative}
          total={total}
          colorClass="text-red-500"
        />
        <SentimentScore
          label="Neutral"
          count={neutral}
          total={total}
          colorClass="text-yellow-500"
        />
        <div className="text-center p-2 flex-1">
          <p className="text-2xl font-bold text-gray-800">{total}</p>
          <p className="text-xs text-gray-500 uppercase tracking-wider">
            Total Reviews
          </p>
        </div>
      </div>

      {/* Expandable Reviews */}
      {analyzedComments && analyzedComments.length > 0 && (
        <div className="mt-4">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:underline cursor-pointer"
          >
            {expanded ? (
              <>
                <ChevronUp size={16} /> Hide Reviews
              </>
            ) : (
              <>
                <ChevronDown size={16} /> Show Reviews ({analyzedComments.length})
              </>
            )}
          </button>

          <AnimatePresence>
            {expanded && (
              <motion.ul
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4 }}
                className="mt-4 pl-5 list-disc space-y-3 max-h-60 overflow-y-auto pr-2"
              >
                {analyzedComments.map((c, i) => (
                  <li key={i} className="text-gray-700 text-sm">
                    "{c.text}" -{" "}
                    <b className={sentimentColorMap[c.sentiment]}>
                      {c.sentiment}
                    </b>{" "}
                    (Score: {c.score})
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
};

// Main App
function App() {
  const [input, setInput] = useState("");
  const [analysisResults, setAnalysisResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch previous analyses
  useEffect(() => {
    const fetchAnalyses = async () => {
      try {
        const res = await fetch("http://localhost:5000/analyses");
        if (!res.ok) throw new Error("Failed to fetch previous analyses.");
        const data = await res.json();
        setAnalysisResults(data);
      } catch (err) {
        setError(err.message || "Could not connect to the server.");
        console.error(err);
      }
    };
    fetchAnalyses();
  }, []);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!input.trim()) {
      setError("Please enter a place name or a Google Maps URL.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:5000/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Unknown error occurred.");

      setAnalysisResults((prev) => {
        const exists = prev.some((r) => r._id === data._id);
        return exists ? prev : [data, ...prev];
      });
      setInput("");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 min-h-screen font-sans">
      <div className="container mx-auto p-4 md:p-8 max-w-3xl">
        {/* Header */}
        <header className="text-center mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-extrabold text-gray-900"
          >
            🌍 Location Sentiment Analysis
          </motion.h1>
          <p className="text-gray-700 mt-2">
            Enter a Google Maps URL or a place name to analyze its reviews.
          </p>
        </header>

        {/* Input Form */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-white/70 backdrop-blur-md p-6 rounded-2xl shadow-xl mb-8"
        >
          <form onSubmit={handleAnalyze}>
            <label
              htmlFor="url-input"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Location Name or URL
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                id="url-input"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="E.g., 'Eiffel Tower' or maps link"
                className="flex-grow p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition"
                disabled={isLoading}
              />
              <button
                type="submit"
                className="bg-purple-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
                disabled={isLoading}
              >
                {isLoading ? "Analyzing..." : "Analyze"}
              </button>
            </div>
          </form>
          {error && <p className="text-red-600 mt-3 text-sm">{error}</p>}
        </motion.div>

        {/* Analysis History */}
        <main>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4 border-b pb-2">
            Analysis History
          </h2>
          <AnimatePresence>
            {analysisResults.length > 0 ? (
              analysisResults.map((result) => (
                <AnalysisResultCard key={result._id} result={result} />
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-10 px-6 bg-white/60 rounded-2xl shadow-md"
              >
                <p className="text-gray-500">
                  No analyses yet. Enter a location above to get started!
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

export default App;
