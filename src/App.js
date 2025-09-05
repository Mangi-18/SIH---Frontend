import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Animated Sentiment Score Box
const SentimentScore = ({ label, count, total, colorClass }) => {
  const percentage = total > 0 ? ((count / total) * 100).toFixed(1) : 0;

  return (
    <motion.div
      className={`sentiment-box`}
      whileHover={{ scale: 1.08 }}
    >
      <motion.p
        className={colorClass}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {count}
      </motion.p>
      <p style={{ fontSize: "0.75rem", color: "#d1d5db" }}>{label}</p>
      <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "#f3f4f6" }}>
        {percentage}%
      </p>
    </motion.div>
  );
};

// Expandable Analysis Card
const AnalysisResultCard = ({ result }) => {
  const { placeName, input, analysis, analyzedComments, timestamp } = result;
  const { positive, negative, neutral, total, overallSentiment } = analysis;

  const [expanded, setExpanded] = useState(false);

  const sentimentColorMap = {
    positive: "positive",
    negative: "negative",
    neutral: "neutral",
    no_reviews: "no_reviews",
  };

  const sentimentBorderMap = {
    positive: "#22c55e",
    negative: "#ef4444",
    neutral: "#facc15",
    no_reviews: "#9ca3af",
  };

  return (
    <motion.div
      layout
      className="analysis-card"
      style={{ borderLeftColor: sentimentBorderMap[overallSentiment], borderLeftStyle: "solid" }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
        <div>
          <h3 style={{ color: "#f3f4f6", fontSize: "1.25rem", fontWeight: "bold" }}>{placeName}</h3>
          <p style={{ fontSize: "0.85rem", color: "#d1d5db", wordBreak: "break-all", marginBottom: "8px" }}>Input: {input}</p>
        </div>
        <div style={{ textAlign: "right" }}>
          <p style={{ fontSize: "0.85rem", fontWeight: 600, textTransform: "capitalize" }}>
            Overall: <span className={sentimentColorMap[overallSentiment]}>{overallSentiment.replace("_", " ")}</span>
          </p>
          <p style={{ fontSize: "0.75rem", color: "#9ca3af" }}>{new Date(timestamp).toLocaleString()}</p>
        </div>
      </div>

      {/* Sentiment Stats */}
      <div style={{ display: "flex", justifyContent: "space-around", marginTop: "12px", flexWrap: "wrap" }}>
        <SentimentScore label="Positive" count={positive} total={total} colorClass="positive" />
        <SentimentScore label="Negative" count={negative} total={total} colorClass="negative" />
        <SentimentScore label="Neutral" count={neutral} total={total} colorClass="neutral" />
        <div className="total-box">
          <p style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#f3f4f6" }}>{total}</p>
          <p style={{ fontSize: "0.75rem", color: "#d1d5db" }}>Total Reviews</p>
        </div>
      </div>

      {/* Expandable Reviews */}
      {analyzedComments && analyzedComments.length > 0 && (
        <div>
          <div className="expand-btn" onClick={() => setExpanded(!expanded)}>
            {expanded ? "Hide Reviews ▲" : `Show Reviews ▼ (${analyzedComments.length})`}
          </div>
          <AnimatePresence>
            {expanded && (
              <motion.ul
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.5 }}
                className="review-list"
              >
                {analyzedComments.map((c, i) => (
                  <li key={i}>
                    "{c.text}" - <b className={sentimentColorMap[c.sentiment]}>{c.sentiment}</b> (Score: {c.score})
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
export default function App() {
  const [input, setInput] = useState("");
  const [analysisResults, setAnalysisResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

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
    <div style={{ minHeight: "100vh", padding: "20px" }}>
      <div className="container">
        <header>
          <motion.h1 initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            🌍 Location Sentiment Analysis
          </motion.h1>
          <p>Enter a Google Maps URL or a place name to analyze its reviews.</p>
        </header>

        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.4 }} className="form-card">
          <form onSubmit={handleAnalyze}>
            <label htmlFor="url-input" style={{ color: "rgba(255,255,255,0.9)", fontSize: "0.9rem", fontWeight: 500 }}>Location Name or URL</label>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <input id="url-input" type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="E.g., 'Eiffel Tower' or maps link" disabled={isLoading} />
              <button type="submit" disabled={isLoading}>{isLoading ? "Analyzing..." : "Analyze"}</button>
            </div>
          </form>
          {error && <p style={{ color: "#f87171", marginTop: "8px", fontSize: "0.85rem" }}>{error}</p>}
        </motion.div>

        <main>
          <h2 style={{ color: "rgba(255,255,255,0.9)", fontSize: "1.5rem", fontWeight: 600, marginBottom: "16px", borderBottom: "1px solid rgba(255,255,255,0.3)", paddingBottom: "6px" }}>Analysis History</h2>
          <AnimatePresence>
            {analysisResults.length > 0 ? (
              analysisResults.map((result) => <AnalysisResultCard key={result._id} result={result} />)
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: "center", padding: "40px 24px", background: "rgba(255,255,255,0.2)", backdropFilter: "blur(12px)", borderRadius: "24px", boxShadow: "0 10px 30px rgba(0,0,0,0.2)", color: "rgba(255,255,255,0.7)" }}>
                No analyses yet. Enter a location above to get started!
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
