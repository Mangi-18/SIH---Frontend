import React, { useState, useEffect } from 'react';

function App() {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [url, setUrl] = useState('');
  const [analyzedComments, setAnalyzedComments] = useState([]);

  // Fetch manual comments from /comments route
  useEffect(() => {
    fetch('http://localhost:5000/comments')
      .then(res => res.json())
      .then(data => setComments(data));
  }, []);

  // Submit a manual comment
  const submitComment = async () => {
    if (!comment) return alert('Enter comment');
    const res = await fetch('http://localhost:5000/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ commentText: comment }),
    });
    const data = await res.json();
    setComments([data, ...comments]);
    setComment('');
  };

  // Submit a Well-Key Health URL to /analyze
  const analyzeUrl = async () => {
    if (!url) return alert('Enter a Well-Key Health URL');
    try {
      const res = await fetch('http://localhost:5000/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      setAnalyzedComments(data.analyzedComments);
    } catch (err) {
      console.error(err);
      alert('Error analyzing URL. Make sure it is a valid Well-Key Health URL.');
    }
  };

  return (
    <div style={{ margin: '20px' }}>
      <h2>E-Consultation Comment Sentiment Analysis</h2>

      {/* Manual Comment Input */}
      <textarea
        rows="4"
        cols="50"
        value={comment}
        onChange={e => setComment(e.target.value)}
        placeholder="Type your comment here"
      />
      <br />
      <button onClick={submitComment}>Submit Comment</button>

      <hr />

      {/* Well-Key Health URL Analysis */}
      <h3>Analyze Well-Key Health URL</h3>
      <input
        type="text"
        value={url}
        onChange={e => setUrl(e.target.value)}
        placeholder="Paste Well-Key Health URL here"
        style={{ width: '400px' }}
      />
      <br />
      <button onClick={analyzeUrl}>Analyze URL</button>

      <hr />

      {/* Display Manual Comments */}
      <h3>Manual Comments</h3>
      <ul>
        {comments.map(c => (
          <li key={c._id}>
            "{c.commentText}" - <b>{c.sentiment}</b> (
            {new Date(c.timestamp).toLocaleString()})
          </li>
        ))}
      </ul>

      <hr />

      {/* Display Analyzed Comments from URL */}
      <h3>Top 20 Reviews from URL</h3>
      <ul>
        {analyzedComments.map((c, idx) => (
          <li key={idx}>
            "{c.text}" - <b>{c.sentiment}</b>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
