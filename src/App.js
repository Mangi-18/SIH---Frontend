import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

// --- STYLES ---
// I've consolidated all styles here for a cleaner component structure.
const GlobalStyles = () => (
    <style>{`
        :root {
            --bg-start: #0f0c29;
            --bg-mid: #302b63;
            --bg-end: #24243e;
            --glass-bg: rgba(36, 36, 62, 0.6);
            --border-color: rgba(255, 255, 255, 0.15);
            --text-primary: #f0f0f5;
            --text-secondary: #a0a0b0;
            --positive: #22c55e;
            --negative: #ef4444;
            --neutral: #facc15;
            --brand: #8e44ad;
        }

        body {
            background: linear-gradient(-45deg, var(--bg-start), var(--bg-mid), var(--bg-end));
            background-size: 400% 400%;
            animation: gradientBG 15s ease infinite;
            color: var(--text-primary);
            font-family: 'Inter', sans-serif;
            margin: 0;
        }

        @keyframes gradientBG {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }

        .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 2rem 1rem;
        }

        header {
            text-align: center;
            margin-bottom: 2.5rem;
        }

        header h1 {
            font-size: 2.5rem;
            font-weight: 700;
            color: white;
            letter-spacing: -1px;
        }

        header p {
            font-size: 1.1rem;
            color: var(--text-secondary);
        }

        .form-card, .analysis-card, .placeholder-card {
            background: var(--glass-bg);
            backdrop-filter: blur(12px);
            border: 1px solid var(--border-color);
            border-radius: 16px;
            padding: 1.5rem 2rem;
            box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
            margin-bottom: 1.5rem;
        }

        .form-card form {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }

        .form-card input {
            background: rgba(0,0,0,0.2);
            border: 1px solid var(--border-color);
            border-radius: 8px;
            padding: 0.75rem 1rem;
            color: var(--text-primary);
            font-size: 1rem;
            transition: all 0.3s ease;
        }

        .form-card input:focus {
            outline: none;
            border-color: var(--brand);
            box-shadow: 0 0 0 3px rgba(142, 68, 173, 0.3);
        }

        .form-card button {
            background: var(--brand);
            border: none;
            border-radius: 8px;
            padding: 0.75rem 1rem;
            color: white;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .form-card button:hover:not(:disabled) {
            background: #9b59b6;
            transform: translateY(-2px);
        }

        .form-card button:disabled {
            background: #5a5a7a;
            cursor: not-allowed;
        }

        .analysis-card {
            border-left-width: 5px;
        }
        
        .card-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 1rem;
        }
        
        .card-header h3 {
             margin: 0;
             color: white;
             font-size: 1.5rem;
        }
        .card-header p {
             margin: 0;
        }
        
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
            gap: 1rem;
            margin-top: 1.5rem;
            text-align: center;
        }

        .sentiment-box, .total-box {
            background: rgba(0,0,0,0.2);
            border-radius: 12px;
            padding: 1rem;
            transition: all 0.3s ease;
        }
        .sentiment-box p:first-child, .total-box p:first-child {
             font-size: 2rem;
             font-weight: 700;
             margin: 0;
        }
        .sentiment-box p { margin: 0.2rem 0; }
        
        .total-box p { margin: 0.2rem 0; color: white; }

        .positive { color: var(--positive); }
        .negative { color: var(--negative); }
        .neutral { color: var(--neutral); }
        .no_reviews { color: var(--text-secondary); }

        .expand-btn {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            padding: 0.5rem 1rem;
            text-align: center;
            margin-top: 1.5rem;
            cursor: pointer;
            user-select: none;
            transition: background 0.2s ease;
        }

        .expand-btn:hover {
            background: rgba(255, 255, 255, 0.2);
        }

        .reviews-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 1.5rem;
            margin-top: 1.5rem;
            padding-top: 1.5rem;
            border-top: 1px solid var(--border-color);
        }

        .review-column h4 {
            margin-top: 0;
            margin-bottom: 1rem;
            font-size: 1.1rem;
            border-bottom: 2px solid;
            padding-bottom: 0.5rem;
        }
        .review-column .positive { border-color: var(--positive); }
        .review-column .negative { border-color: var(--negative); }
        .review-column .neutral { border-color: var(--neutral); }

        .review-item {
            background: rgba(0,0,0,0.2);
            border-radius: 8px;
            padding: 0.75rem 1rem;
            font-size: 0.9rem;
            margin-bottom: 0.75rem;
            color: var(--text-secondary);
            border-left: 3px solid;
        }
        .review-item.positive { border-color: var(--positive); }
        .review-item.negative { border-color: var(--negative); }
        .review-item.neutral { border-color: var(--neutral); }

        .review-item .score {
            font-weight: 600;
            color: var(--text-primary);
        }
        
        .empty-column {
            color: var(--text-secondary);
            font-style: italic;
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
            .reviews-grid {
                grid-template-columns: 1fr;
            }
            .stats-grid {
                 grid-template-columns: repeat(2, 1fr);
            }
        }
    `}</style>
);

// Animated Sentiment Score Box
const SentimentScore = ({ label, count, total, colorClass }) => {
    const percentage = total > 0 ? ((count / total) * 100).toFixed(1) : 0;

    return (
        <motion.div
            className="sentiment-box"
            whileHover={{ scale: 1.05, background: 'rgba(0,0,0,0.3)' }}
        >
            <motion.p
                className={colorClass}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                {count}
            </motion.p>
            <p style={{ fontSize: "0.8rem", color: "#d1d5db" }}>{label}</p>
            <p style={{ fontSize: "0.9rem", fontWeight: 600, color: "#f3f4f6" }}>
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

    // Memoize the categorized comments to avoid re-calculating on every render
    const categorizedComments = useMemo(() => {
        const lists = { positive: [], negative: [], neutral: [] };
        if (analyzedComments) {
            analyzedComments.forEach(comment => {
                lists[comment.sentiment]?.push(comment);
            });
        }
        return lists;
    }, [analyzedComments]);

    const sentimentColorMap = {
        positive: "positive",
        negative: "negative",
        neutral: "neutral",
        no_reviews: "no_reviews",
    };

    const sentimentBorderMap = {
        positive: "var(--positive)",
        negative: "var(--negative)",
        neutral: "var(--neutral)",
        no_reviews: "var(--text-secondary)",
    };

    return (
        <motion.div
            layout
            className="analysis-card"
            style={{ borderLeftColor: sentimentBorderMap[overallSentiment] }}
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, type: "spring" }}
        >
            <div className="card-header">
                <div>
                    <h3>{placeName}</h3>
                    <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", wordBreak: "break-all" }}>
                        Input: {input}
                    </p>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0, paddingLeft: '1rem' }}>
                    <p style={{ fontSize: "0.9rem", fontWeight: 600, textTransform: "capitalize" }}>
                        Overall: <span className={sentimentColorMap[overallSentiment]}>{overallSentiment.replace("_", " ")}</span>
                    </p>
                    <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                        {new Date(timestamp).toLocaleString()}
                    </p>
                </div>
            </div>

            <div className="stats-grid">
                <SentimentScore label="Positive" count={positive} total={total} colorClass="positive" />
                <SentimentScore label="Negative" count={negative} total={total} colorClass="negative" />
                <SentimentScore label="Neutral" count={neutral} total={total} colorClass="neutral" />
                <div className="total-box">
                    <p>{total}</p>
                    <p style={{ fontSize: "0.8rem", color: "#d1d5db" }}>Total Reviews</p>
                </div>
            </div>

            {analyzedComments && analyzedComments.length > 0 && (
                <>
                    <div className="expand-btn" onClick={() => setExpanded(!expanded)}>
                        {expanded ? "Hide Reviews ▲" : `Show Reviews ▼ (${analyzedComments.length})`}
                    </div>
                    <AnimatePresence>
                        {expanded && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.4, ease: "easeInOut" }}
                                style={{ overflow: 'hidden' }}
                            >
                                <div className="reviews-grid">
                                    {/* Positive Column */}
                                    <div className="review-column">
                                        <h4 className="positive">Positive Reviews</h4>
                                        {categorizedComments.positive.length > 0 ? (
                                            categorizedComments.positive.map((c, i) => (
                                                <div key={`pos-${i}`} className="review-item positive">
                                                    "{c.text}" <span className="score">(Score: {c.score})</span>
                                                </div>
                                            ))
                                        ) : <p className="empty-column">No positive reviews found.</p>}
                                    </div>
                                    {/* Negative Column */}
                                    <div className="review-column">
                                        <h4 className="negative">Negative Reviews</h4>
                                        {categorizedComments.negative.length > 0 ? (
                                            categorizedComments.negative.map((c, i) => (
                                                <div key={`neg-${i}`} className="review-item negative">
                                                    "{c.text}" <span className="score">(Score: {c.score})</span>
                                                </div>
                                            ))
                                        ) : <p className="empty-column">No negative reviews found.</p>}
                                    </div>
                                    {/* Neutral Column */}
                                    <div className="review-column">
                                        <h4 className="neutral">Neutral Reviews</h4>
                                        {categorizedComments.neutral.length > 0 ? (
                                            categorizedComments.neutral.map((c, i) => (
                                                <div key={`neu-${i}`} className="review-item neutral">
                                                    "{c.text}" <span className="score">(Score: {c.score})</span>
                                                </div>
                                            ))
                                        ) : <p className="empty-column">No neutral reviews found.</p>}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </>
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
            setIsLoading(true);
            try {
                const res = await fetch("http://localhost:5000/analyses");
                if (!res.ok) throw new Error("Failed to fetch previous analyses.");
                const data = await res.json();
                setAnalysisResults(data);
            } catch (err) {
                setError(err.message || "Could not connect to the server.");
                console.error(err);
            } finally {
                setIsLoading(false);
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
            if (!res.ok) throw new Error(data.message || "An unknown error occurred on the server.");
            
            setAnalysisResults((prev) => [data, ...prev.filter(r => r._id !== data._id)]);
            setInput("");
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <GlobalStyles />
            <div className="container">
                <header>
                    <motion.h1 initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                        🌍 Location Sentiment Analysis
                    </motion.h1>
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                        Enter a Google Maps URL or a place name to analyze public sentiment.
                    </motion.p>
                </header>

                <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.4 }} className="form-card">
                    <form onSubmit={handleAnalyze}>
                        <input
                            id="url-input"
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="E.g., 'Eiffel Tower' or a Google Maps link"
                            disabled={isLoading}
                        />
                        <button type="submit" disabled={isLoading}>
                            {isLoading ? "Analyzing..." : "Analyze Sentiment"}
                        </button>
                    </form>
                    {error && <p style={{ color: "#f87171", marginTop: "1rem", fontSize: "0.9rem", textAlign: 'center' }}>{error}</p>}
                </motion.div>

                <main>
                    <h2 style={{ color: "white", fontSize: "1.75rem", fontWeight: 600, marginBottom: "1rem" }}>
                        Analysis History
                    </h2>
                    <AnimatePresence>
                        {analysisResults.length > 0 ? (
                            analysisResults.map((result) => <AnalysisResultCard key={result._id} result={result} />)
                        ) : (
                            !isLoading && <motion.div 
                                className="placeholder-card"
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                                style={{ textAlign: "center", color: "var(--text-secondary)" }}
                            >
                                No analyses yet. Enter a location above to get started!
                            </motion.div>
                        )}
                    </AnimatePresence>
                </main>
            </div>
        </>
    );
}
