import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";

// --- ICONS ---
const TrashIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg> );
const ClearIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg> );
const CopyIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg> );
const ShareIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg> );
const SunIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg> );
const MoonIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg> );


// --- STYLES ---
const GlobalStyles = () => (
    <style>{`
        :root {
            --bg-start: #0f0c29; --bg-mid: #302b63; --bg-end: #24243e;
            --glass-bg: rgba(36, 36, 62, 0.6); --border-color: rgba(255, 255, 255, 0.15);
            --text-primary: #f0f0f5; --text-secondary: #a0a0b0;
            --positive: #22c55e; --negative: #ef4444; --neutral: #facc15; --brand: #8e44ad;
            --shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
            --button-bg: rgba(0,0,0,0.1);
        }
        body.light-mode {
            --bg-start: #a1c4fd; --bg-mid: #c2e9fb; --bg-end: #ffecd2;
            --glass-bg: rgba(255, 255, 255, 0.65); 
            --border-color: rgba(0, 0, 0, 0.12);
            --text-primary: #17202a;
            --text-secondary: #5d6d7e;
            --shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.1);
            --button-bg: rgba(0,0,0,0.05);
        }
        body { background: var(--bg-start); color: var(--text-primary); font-family: 'Inter', sans-serif; margin: 0; transition: background 0.5s ease; }
        .background-wrapper { position: fixed; top: 0; left: 0; width: 100%; height: 100vh; z-index: -1; }
        .gradient-bg { width: 100%; height: 100%; background: linear-gradient(-45deg, var(--bg-start), var(--bg-mid), var(--bg-end)); background-size: 400% 400%; animation: gradientBG 20s ease infinite; }
        @keyframes gradientBG { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        #particle-canvas { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }

        .container { max-width: 800px; margin: 0 auto; padding: 2rem 1rem; position: relative; z-index: 1;}
        .app-header { display: flex; justify-content: space-between; align-items: center; text-align: center; margin-bottom: 2.5rem; }
        .app-header > div { flex: 1; }
        .app-header h1 { font-size: 2.5rem; font-weight: 700; color: var(--text-primary); letter-spacing: -1px; margin:0; }
        .app-header p { font-size: 1.1rem; color: var(--text-secondary); margin: 0.5rem 0 0; }
        
        .form-card, .analysis-card, .placeholder-card, .skeleton-card {
            background: var(--glass-bg); backdrop-filter: blur(12px); border: 1px solid var(--border-color);
            border-radius: 16px; padding: 1.5rem 2rem; box-shadow: var(--shadow);
            margin-bottom: 1.5rem; position: relative;
        }
        .input-container { position: relative; }
        .input-wrapper { position: relative; display: flex; flex-direction: column; gap: 1rem; }
        .form-card input {
            background: var(--button-bg); border: 1px solid var(--border-color); border-radius: 8px;
            padding: 0.75rem 1rem; color: var(--text-primary); font-size: 1rem; transition: all 0.3s ease;
            width: 100%; box-sizing: border-box; padding-right: 3rem;
        }
        .clear-btn {
            position: absolute; right: 12px; top: 13px; background: rgba(0,0,0,0.2); border-radius: 50%;
            width: 22px; height: 22px; display: flex; align-items: center; justify-content: center;
            border: none; cursor: pointer; color: var(--text-secondary); transition: all 0.2s ease;
        }
        .clear-btn:hover { background: rgba(0,0,0,0.3); color: var(--text-primary); }
        .form-card input:focus { outline: none; border-color: var(--brand); box-shadow: 0 0 0 3px color-mix(in srgb, var(--brand) 30%, transparent); }
        .form-card button {
            background: var(--brand); border: none; border-radius: 8px; padding: 0.75rem 1rem; color: white;
            font-size: 1rem; font-weight: 600; cursor: pointer; transition: all 0.3s ease;
        }
        .form-card button:hover:not(:disabled) { background: #9b59b6; transform: translateY(-2px); box-shadow: 0 4px 15px color-mix(in srgb, var(--brand) 40%, transparent); }
        .form-card button:disabled { background: var(--text-secondary); opacity: 0.7; cursor: not-allowed; }
        .suggestions-list {
            list-style: none; padding: 0; margin: 0.5rem 0 0; background: var(--glass-bg);
            border: 1px solid var(--border-color); border-radius: 8px; max-height: 200px; overflow-y: auto;
        }
        .suggestion-item { padding: 0.75rem 1rem; cursor: pointer; transition: background 0.2s ease; }
        .suggestion-item:not(:last-child) { border-bottom: 1px solid var(--border-color); }
        .suggestion-item:hover { background: color-mix(in srgb, var(--brand) 20%, transparent); }
        body.light-mode .suggestion-item:hover { background: color-mix(in srgb, var(--brand) 10%, transparent); }

        .analysis-card { border-left-width: 5px; transform-style: preserve-3d; }
        .card-header-controls { display: flex; gap: 0.5rem; }
        .card-control-btn {
            background: var(--button-bg); border: none; border-radius: 50%; width: 30px; height: 30px;
            display: flex; align-items: center; justify-content: center; cursor: pointer; color: var(--text-secondary);
            opacity: 0.6; transition: all 0.3s ease;
        }
        .analysis-card:hover .card-control-btn { opacity: 1; }
        .card-control-btn:hover { background: var(--brand); color: white; transform: scale(1.1); }
        .card-control-btn.delete:hover { background: var(--negative); }
        
        .toast-container { position: fixed; bottom: 20px; right: 20px; z-index: 1000; }
        .toast { background: var(--glass-bg); backdrop-filter: blur(10px); border: 1px solid var(--border-color); color: var(--text-primary); padding: 12px 20px; border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.4); margin-bottom: 10px; display: flex; align-items: center; gap: 10px; border-left: 4px solid; }
        .toast.success { border-left-color: var(--positive); } .toast.error { border-left-color: var(--negative); } .toast.info { border-left-color: var(--brand); }

        .theme-toggle { background: var(--glass-bg); border: 1px solid var(--border-color); border-radius: 20px; cursor: pointer; display: flex; padding: 4px; position: relative; width: 50px; height: 26px; }
        .toggle-thumb { background: var(--brand); border-radius: 50%; width: 22px; height: 22px; position: absolute; transition: transform 0.3s ease; }
        .theme-toggle svg { position: absolute; top: 50%; transform: translateY(-50%); color: var(--text-secondary); }
        .theme-toggle .sun { left: 6px; } .theme-toggle .moon { right: 6px; }

        .sentiment-chart-container { display: flex; justify-content: center; align-items: center; margin-top: 1.5rem; }
        .doughnut-chart-text { font-size: 2rem; font-weight: bold; fill: var(--text-primary); }

        /* Other inherited styles */
        .positive { color: var(--positive); } .negative { color: var(--negative); } .neutral { color: var(--neutral); }
        footer{text-align: center; margin-top: 3rem; color: var(--text-secondary); font-size: 0.9rem;} footer a{color: var(--brand); text-decoration: none;} footer a:hover{text-decoration: underline;}
        .card-header{display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem;} .card-header h3{margin: 0; color: var(--text-primary); font-size: 1.5rem;} .card-header p{margin: 0;}
        .stats-grid{display: grid; grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); gap: 1rem; margin-top: 1.5rem; text-align: center;}
        .sentiment-box, .total-box{background: var(--button-bg); border-radius: 12px; padding: 1rem; transition: all 0.3s ease;} .sentiment-box p:first-child, .total-box p:first-child{font-size: 2rem; font-weight: 700; margin: 0;}
        .sentiment-box p, .total-box p{margin: 0.2rem 0;} .total-box p { color: var(--text-primary); }
        .expand-btn, .show-more-btn {background: var(--button-bg); }
        .expand-btn:hover, .show-more-btn:hover {background: color-mix(in srgb, var(--button-bg) 10%, #000 10%); }
        .reviews-grid{display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid var(--border-color);}
        .review-column h4{margin-top: 0; margin-bottom: 1rem; font-size: 1.1rem; border-bottom: 2px solid; padding-bottom: 0.5rem;}
        .review-column .positive{border-color: var(--positive);} .review-column .negative{border-color: var(--negative);} .review-column .neutral{border-color: var(--neutral);}
        .review-item{background: var(--button-bg); border-radius: 8px; padding: 0.75rem 1rem; font-size: 0.9rem; margin-bottom: 0.75rem; color: var(--text-secondary); border-left: 3px solid; line-height: 1.5;}
        .review-item.positive{border-color: var(--positive);} .review-item.negative{border-color: var(--negative);} .review-item.neutral{border-color: var(--neutral);}
        .review-item .score{font-weight: 600; color: var(--text-primary);} .empty-column{color: var(--text-secondary); font-style: italic;}
        .read-more-link{background: none; border: none; color: var(--brand); cursor: pointer; padding: 0 0 0 5px; margin-left: 5px; font-weight: 600; font-size: 0.85rem; display: inline;}
        .read-more-link:hover{text-decoration: underline;} 
        .expand-btn, .show-more-btn {border-radius: 8px; padding: 0.5rem 1rem; text-align: center; margin-top: 1.5rem; cursor: pointer; user-select: none; transition: background 0.2s ease; width: 100%; border: 1px solid var(--border-color); color: var(--text-secondary);}
        .skeleton-card{padding: 1.5rem;} .skeleton-line{height: 20px; border-radius: 4px; background: linear-gradient(90deg, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite;}
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
        @media (max-width: 768px) { .reviews-grid { grid-template-columns: 1fr; } .stats-grid { grid-template-columns: repeat(2, 1fr); } .app-header { flex-direction: column; gap: 1rem; } }
    `}</style>
);
// --- HELPER HOOKS & COMPONENTS ---
const useLocalStorage = (key, initialValue) => {
    const [storedValue, setStoredValue] = useState(() => { try { const item = window.localStorage.getItem(key); return item ? JSON.parse(item) : initialValue; } catch (error) { return initialValue; } });
    const setValue = (value) => { try { const valueToStore = value instanceof Function ? value(storedValue) : value; setStoredValue(valueToStore); window.localStorage.setItem(key, JSON.stringify(valueToStore)); } catch (error) { console.log(error); } };
    return [storedValue, setValue];
};

const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => { setDebouncedValue(value); }, delay);
        return () => { clearTimeout(handler); };
    }, [value, delay]);
    return debouncedValue;
};

const AnimatedBackground = ({ theme }) => {
    useEffect(() => {
        const canvas = document.getElementById('particle-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        // --- Weather Simulation State ---
        let particles = [];
        let shootingStars = [];
        let raindrops = [];
        let stormState = { active: false, timer: 0, duration: 12000, intensity: 0 };

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        // --- Dark Mode Effects ---
        const createStars = () => {
            particles = [];
            let starCount = Math.floor(canvas.width / 10);
            for (let i = 0; i < starCount; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    radius: Math.random() * 1.5 + 0.5,
                    opacity: Math.random() * 0.5 + 0.5,
                    twinkleSpeed: Math.random() * 0.05
                });
            }
        };
        const createShootingStar = () => {
             if (Math.random() < 0.02) { // Probability
                shootingStars.push({
                    x: Math.random() * canvas.width, y: 0,
                    len: Math.random() * 80 + 50,
                    speed: Math.random() * 8 + 6,
                    opacity: 1,
                });
            }
        };
        const createSnow = () => {
            let snowCount = Math.floor(canvas.width / 3);
            for (let i = 0; i < snowCount; i++) {
                raindrops.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    speed: Math.random() * 1 + 0.5,
                    radius: Math.random() * 2 + 1,
                });
            }
        };

        // --- Light Mode Effects ---
        const createMotes = () => {
             particles = [];
             let moteCount = Math.floor(canvas.width / 25);
             for(let i = 0; i < moteCount; i++){
                 particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    vx: Math.random() * 0.4 - 0.2,
                    vy: Math.random() * 0.4 - 0.2,
                    radius: Math.random() * 4 + 2,
                 });
             }
        };
        const createRain = (intensity) => {
            raindrops = [];
            let rainCount = Math.floor(canvas.width / 2) * intensity;
            for(let i = 0; i < rainCount; i++){
                 raindrops.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    speed: Math.random() * 5 + 5,
                    len: Math.random() * 15 + 10,
                });
            }
        };

        // --- Universal Animation Loop ---
        const animate = (timestamp) => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            if (theme === 'dark') {
                // Draw stars
                particles.forEach(p => {
                    p.opacity += Math.sin(timestamp * p.twinkleSpeed) * 0.05;
                    p.opacity = Math.max(0.3, Math.min(1, p.opacity));
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
                    ctx.fill();
                });
                
                // Draw and update shooting stars
                createShootingStar();
                shootingStars.forEach((s, index) => {
                    s.x += s.speed; s.y += s.speed * 0.5; s.opacity -= 0.02;
                    if (s.opacity <= 0) shootingStars.splice(index, 1);
                    ctx.beginPath();
                    ctx.moveTo(s.x, s.y);
                    ctx.lineTo(s.x - s.len, s.y - s.len * 0.5);
                    ctx.strokeStyle = `rgba(255, 255, 255, ${s.opacity})`;
                    ctx.lineWidth = 2;
                    ctx.stroke();
                });

                // Draw and update snow
                raindrops.forEach(flake => {
                    flake.y += flake.speed;
                    if (flake.y > canvas.height) { flake.x = Math.random() * canvas.width; flake.y = -5; }
                    ctx.beginPath();
                    ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
                    ctx.fill();
                });
                
                // Lightning
                if(Math.random() < 0.001){
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                    ctx.fillRect(0,0, canvas.width, canvas.height);
                }

            } else { // Light Mode
                 // Handle storm
                if (!stormState.active && Math.random() < 0.001) {
                    stormState.active = true;
                    stormState.timer = Date.now();
                }
                if(stormState.active){
                    const elapsed = Date.now() - stormState.timer;
                    if(elapsed < stormState.duration){
                        const progress = elapsed / stormState.duration;
                        stormState.intensity = Math.sin(progress * Math.PI); // ease in and out
                        ctx.fillStyle = `rgba(0,0,0,${stormState.intensity * 0.5})`;
                        ctx.fillRect(0,0,canvas.width, canvas.height);
                        createRain(stormState.intensity);
                    } else {
                        stormState.active = false;
                        raindrops = [];
                    }
                }
                
                // Draw Motes
                 particles.forEach(p => {
                    p.x += p.vx; p.y += p.vy;
                    if (p.x < 0 || p.x > canvas.width) p.vx = -p.vx;
                    if (p.y < 0 || p.y > canvas.height) p.vy = -p.vy;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
                    ctx.fill();
                });

                // Draw Rain
                raindrops.forEach(drop => {
                    drop.y += drop.speed;
                    if (drop.y > canvas.height) { drop.y = -drop.len; drop.x = Math.random() * canvas.width; }
                    ctx.beginPath();
                    ctx.moveTo(drop.x, drop.y);
                    ctx.lineTo(drop.x, drop.y + drop.len);
                    ctx.strokeStyle = `rgba(255, 255, 255, 0.5)`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                });
            }

            animationFrameId = requestAnimationFrame(animate);
        };
        
        // Initialize based on theme
        window.addEventListener('resize', resize);
        resize();
        if (theme === 'dark') {
            createStars();
            createSnow();
        } else {
            createMotes();
        }
        animate();
        
        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, [theme]);

    return (
        <div className="background-wrapper">
            <div className="gradient-bg" />
            <canvas id="particle-canvas" />
        </div>
    );
};

const Toasts = ({ toasts, setToasts }) => { /* ... same as before */ useEffect(() => {if (toasts.length > 0) {const timer = setTimeout(() => setToasts(ts => ts.slice(1)), 3000); return () => clearTimeout(timer);}}, [toasts, setToasts]); return (<div className="toast-container"><AnimatePresence>{toasts.map((toast) => (<motion.div key={toast.id} className={`toast ${toast.type}`} initial={{ opacity: 0, y: 50, scale: 0.3 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}>{toast.message}</motion.div>))}</AnimatePresence></div>);};
const AnimatedCounter = ({ value }) => { const count = useMotionValue(0); const rounded = useTransform(count, latest => Math.round(latest)); useEffect(() => { const animation = motion.div.animate(count, value, { duration: 1.5, ease: "easeOut" }); return animation.stop; }, [value, count]); return <motion.p>{rounded}</motion.p>; };
const REVIEW_TRUNCATE_LENGTH = 280;
const ReviewItem = ({ text, score, sentiment }) => { const [isExpanded, setIsExpanded] = useState(false); const isLongReview = text.length > REVIEW_TRUNCATE_LENGTH; const displayedText = isLongReview && !isExpanded ? `${text.substring(0, REVIEW_TRUNCATE_LENGTH)}...` : text; return (<motion.div layout className={`review-item ${sentiment}`}>"{displayedText}"{isLongReview && <button className="read-more-link" onClick={() => setIsExpanded(!isExpanded)}>{isExpanded ? 'Show Less' : 'Read More'}</button>}<span className="score"> (Score: {score})</span></motion.div>);};
const ThemeToggle = ({ theme, setTheme }) => { const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark'); return (<div className="theme-toggle" onClick={toggleTheme}><motion.div className="toggle-thumb" layout transition={{ type: "spring", stiffness: 700, damping: 30 }} style={{ x: theme === 'dark' ? 0 : 24 }} /><SunIcon className="sun" /><MoonIcon className="moon" /></div>); };
const SentimentChart = ({ data }) => {
    const { positive, negative, neutral, total } = data;
    if (total === 0) return null;
    const size = 120; const strokeWidth = 15; const radius = (size - strokeWidth) / 2; const circumference = 2 * Math.PI * radius;
    const posOffset = 0; const negOffset = (positive / total) * circumference; const neuOffset = ((positive + negative) / total) * circumference;
    const posPercent = (positive / total) * circumference; const negPercent = (negative / total) * circumference; const neuPercent = (neutral / total) * circumference;
    return (
        <div className="sentiment-chart-container">
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                <circle cx={size / 2} cy={size / 2} r={radius} fill="transparent" stroke="var(--border-color)" strokeWidth={strokeWidth} />
                <motion.circle cx={size / 2} cy={size / 2} r={radius} fill="transparent" stroke="var(--positive)" strokeWidth={strokeWidth} strokeDasharray={circumference} strokeDashoffset={posOffset} initial={{ strokeDasharray: `0 ${circumference}` }} animate={{ strokeDasharray: `${posPercent} ${circumference}` }} transition={{ duration: 1, ease: "circOut" }} transform={`rotate(-90 ${size/2} ${size/2})`} />
                <motion.circle cx={size / 2} cy={size / 2} r={radius} fill="transparent" stroke="var(--negative)" strokeWidth={strokeWidth} strokeDasharray={circumference} strokeDashoffset={-negOffset} initial={{ strokeDasharray: `0 ${circumference}` }} animate={{ strokeDasharray: `${negPercent} ${circumference}` }} transition={{ duration: 1, ease: "circOut", delay: 0.2 }} transform={`rotate(-90 ${size/2} ${size/2})`} />
                <motion.circle cx={size / 2} cy={size / 2} r={radius} fill="transparent" stroke="var(--neutral)" strokeWidth={strokeWidth} strokeDasharray={circumference} strokeDashoffset={-neuOffset} initial={{ strokeDasharray: `0 ${circumference}` }} animate={{ strokeDasharray: `${neuPercent} ${circumference}` }} transition={{ duration: 1, ease: "circOut", delay: 0.4 }} transform={`rotate(-90 ${size/2} ${size/2})`} />
                <text x="50%" y="50%" textAnchor="middle" dy=".3em" className="doughnut-chart-text">{total}</text>
            </svg>
        </div>
    );
};

// --- MAIN COMPONENTS ---
const AnalysisResultCard = ({ result, onDelete, addToast }) => {
    const { _id, placeName, input, analysis, analyzedComments, timestamp } = result;
    const { positive, negative, neutral, total, overallSentiment } = analysis;
    const [expanded, setExpanded] = useState(false);
    const [visibleCounts, setVisibleCounts] = useState({ positive: 2, negative: 2, neutral: 2 });
    const categorizedComments = useMemo(() => ({ positive: analyzedComments?.filter(c => c.sentiment === 'positive') || [], negative: analyzedComments?.filter(c => c.sentiment === 'negative') || [], neutral: analyzedComments?.filter(c => c.sentiment === 'neutral') || [] }), [analyzedComments]);
    const handleShowMore = (category) => setVisibleCounts(prev => ({ ...prev, [category]: prev[category] + 5 }));
    const handleCopy = () => { navigator.clipboard.writeText(input); addToast("Input copied to clipboard!", "info"); };
    const handleShare = () => { const summary = `Sentiment Analysis for ${placeName}:\n- Overall: ${overallSentiment.replace("_", " ")}\n- Positive: ${positive} (${((positive/total)*100).toFixed(1)}%)\n- Negative: ${negative} (${((negative/total)*100).toFixed(1)}%)\n- Neutral: ${neutral} (${((neutral/total)*100).toFixed(1)}%)\n- Total Reviews: ${total}`; navigator.clipboard.writeText(summary); addToast("Summary copied to clipboard!", "success"); };
    const { ref, rotateX, rotateY, handleMouseMove, handleMouseLeave } = useCardTilt();
    const ReviewColumn = ({ sentiment }) => ( <div className="review-column"><h4 className={sentiment}>{sentiment.charAt(0).toUpperCase() + sentiment.slice(1)} Reviews</h4>{categorizedComments[sentiment].length > 0 ? (<>{categorizedComments[sentiment].slice(0, visibleCounts[sentiment]).map((c, i) => (<ReviewItem key={`${sentiment}-${i}`} text={c.text} score={c.score} sentiment={c.sentiment} />))}{categorizedComments[sentiment].length > visibleCounts[sentiment] && (<button className="show-more-btn" onClick={() => handleShowMore(sentiment)}>Show More</button>)}</>) : <p className="empty-column">No {sentiment} reviews found.</p>}</div>);

    return (
        <motion.div ref={ref} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            layout className="analysis-card"
            initial={{ opacity: 0, y: 50, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.3 } }} transition={{ duration: 0.5, type: "spring" }}
        >
            <div className="card-header">
                <div><h3>{placeName}</h3><p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", wordBreak: "break-all", paddingRight: '90px' }}>Input: {input}</p></div>
                <div style={{ textAlign: "right", flexShrink: 0, paddingLeft: '1rem' }}>
                    <div className="card-header-controls"><button className="card-control-btn" onClick={handleCopy} title="Copy Input"><CopyIcon /></button><button className="card-control-btn" onClick={handleShare} title="Share Summary"><ShareIcon /></button><button className="card-control-btn delete" onClick={() => onDelete(_id)} title="Delete"><TrashIcon /></button></div>
                    <p style={{ fontSize: "0.9rem", fontWeight: 600, textTransform: "capitalize", marginTop: '0.5rem' }}>Overall: <span className={overallSentiment.replace("_", " ")}>{overallSentiment.replace("_", " ")}</span></p>
                    <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>{new Date(timestamp).toLocaleString()}</p>
                </div>
            </div>
            <SentimentChart data={analysis} />
            {analyzedComments?.length > 0 && (<><div className="expand-btn" onClick={() => setExpanded(!expanded)}>{expanded ? "Hide Reviews ▲" : `Show Detailed Reviews ▼ (${analyzedComments.length})`}</div><AnimatePresence>{expanded && (<motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.4, ease: "easeInOut" }} style={{ overflow: 'hidden' }}><div className="reviews-grid"><ReviewColumn sentiment="positive" /><ReviewColumn sentiment="negative" /><ReviewColumn sentiment="neutral" /></div></motion.div>)}</AnimatePresence></>)}
        </motion.div>
    );
};
const useCardTilt = () => { const ref = useRef(null); const x = useMotionValue(0); const y = useMotionValue(0); const xSpring = useSpring(x, { stiffness: 300, damping: 40 }); const ySpring = useSpring(y, { stiffness: 300, damping: 40 }); const rotateX = useTransform(ySpring, [-0.5, 0.5], ["7.5deg", "-7.5deg"]); const rotateY = useTransform(xSpring, [-0.5, 0.5], ["-7.5deg", "7.5deg"]); const handleMouseMove = (e) => { if(!ref.current) return; const rect = ref.current.getBoundingClientRect(); const width = rect.width; const height = rect.height; const mouseX = e.clientX - rect.left; const mouseY = e.clientY - rect.top; const xPct = mouseX / width - 0.5; const yPct = mouseY / height - 0.5; x.set(xPct); y.set(yPct); }; const handleMouseLeave = () => { x.set(0); y.set(0); }; return { ref, rotateX, rotateY, handleMouseMove, handleMouseLeave }; };

export default function App() {
    const [input, setInput] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [analysisResults, setAnalysisResults] = useLocalStorage("sentimentHistory", []);
    const [isLoading, setIsLoading] = useState(true);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [toasts, setToasts] = useState([]);
    const [theme, setTheme] = useLocalStorage('theme', 'dark');
    const debouncedSearchTerm = useDebounce(input, 300);
    const addToast = (message, type = "info") => setToasts(prev => [...prev, { id: Date.now(), message, type }]);

    useEffect(() => { 
        document.body.className = theme === 'light' ? 'light-mode' : ''; 
    }, [theme]);
    
    useEffect(() => {
        // This effect runs only once on mount to set initial loading state
        const timer = setTimeout(() => setIsLoading(false), 1000); // Simulate loading
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const fetchSuggestions = async () => {
            if (debouncedSearchTerm.length < 3 || debouncedSearchTerm.startsWith('http')) { setSuggestions([]); return; }
            try {
                const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(debouncedSearchTerm)}&format=json&limit=5`);
                const data = await response.json();
                setSuggestions(data.map(item => ({ id: item.place_id, name: item.display_name })));
            } catch (error) { console.error("Failed to fetch suggestions:", error); }
        };
        fetchSuggestions();
    }, [debouncedSearchTerm]);

    const handleAnalyze = async (analyzeInput) => {
        if (!analyzeInput.trim()) return addToast("Please enter a location or URL.", "error");
        setIsAnalyzing(true); setSuggestions([]);
        try {
            const res = await fetch("http://localhost:5000/analyze", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ input: analyzeInput }) });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "An unknown server error occurred.");
            setAnalysisResults(prev => [data, ...prev.filter(r => r.placeId !== data.placeId)]);
            setInput(""); addToast(`Analyzed "${data.placeName}"!`, "success");
        } catch (err) { addToast(err.message, "error"); } finally { setIsAnalyzing(false); }
    };
    const handleDelete = (idToDelete) => { setAnalysisResults(prev => prev.filter(result => result._id !== idToDelete)); addToast("Analysis removed from history.", "info"); };
    const handleClearHistory = () => { setAnalysisResults([]); addToast("Analysis history cleared.", "info"); };

    return (
        <>
            <GlobalStyles />
            <AnimatedBackground theme={theme} />
            <Toasts toasts={toasts} setToasts={setToasts} />
            <div className="container">
                <header className="app-header">
                    <div style={{flex: 1, textAlign: 'left'}}></div>
                    <div style={{flex: 2}}>
                        <motion.h1 initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>🌍 Location Sentiment Explorer</motion.h1>
                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>Discover public opinion by analyzing Google Maps reviews.</motion.p>
                    </div>
                    <div style={{flex: 1, display: 'flex', justifyContent: 'flex-end'}}>
                        <ThemeToggle theme={theme} setTheme={setTheme} />
                    </div>
                </header>
                <motion.div layout initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.4 }} className="form-card">
                    <form onSubmit={(e) => {e.preventDefault(); handleAnalyze(input)}}>
                        <div className="input-container">
                            <div className="input-wrapper">
                                <input id="url-input" type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="E.g., 'Eiffel Tower' or a Google Maps link" disabled={isAnalyzing} autoComplete="off" />
                                {input && !isAnalyzing && <button type="button" className="clear-btn" onClick={() => setInput("")}><ClearIcon /></button>}
                            </div>
                            <AnimatePresence>
                                {suggestions.length > 0 && (
                                    <motion.ul initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="suggestions-list">
                                        {suggestions.map(s => <li key={s.id} className="suggestion-item" onClick={() => {setInput(s.name); handleAnalyze(s.name);}}>{s.name}</li>)}
                                    </motion.ul>
                                )}
                            </AnimatePresence>
                        </div>
                        <button style={{marginTop: '1rem'}} type="submit" disabled={isAnalyzing}>{isAnalyzing ? "Analyzing..." : "Analyze Sentiment"}</button>
                    </form>
                </motion.div>
                <main>
                    <div className="history-header"><h2>Analysis History</h2>{analysisResults.length > 0 && <button className="clear-history-btn" onClick={handleClearHistory}>Clear History</button>}</div>
                    <AnimatePresence>
                        {isLoading ? ([...Array(2)].map((_, i) => <div key={i} className="skeleton-card"><div className="skeleton-line" style={{width: '60%', height: '28px', marginBottom: '0.5rem'}}/><div className="skeleton-line" style={{width: '40%', height: '16px', marginBottom: '1.5rem'}}/><div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '1rem'}}><div className="skeleton-line" style={{height: '70px'}}/><div className="skeleton-line" style={{height: '70px'}}/><div className="skeleton-line" style={{height: '70px'}}/><div className="skeleton-line" style={{height: '70px'}}/></div></div>)) 
                        : analysisResults.length > 0 ? (analysisResults.map((result) => <AnalysisResultCard key={result._id} result={result} onDelete={handleDelete} addToast={addToast} />)) 
                        : (<motion.div className="placeholder-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: "center", color: "var(--text-secondary)" }}>No analyses yet. Enter a location to get started!</motion.div>)}
                    </AnimatePresence>
                </main>
                <footer><p>Explore the code on <a href="https://github.com/Mangi-18" target="_blank" rel="noopener noreferrer">GitHub</a>.</p></footer>
            </div>
        </>
    );
}

