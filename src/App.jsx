import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]); // store chat history
  const [editIndex, setEditIndex] = useState(null);
  const [editValue, setEditValue] = useState("");

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    // Save user's message first
    const userMessage = { title: input, body: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);

    try {
      // POST request to jsonplaceholder
      const response = await axios.post(
        "https://jsonplaceholder.typicode.com/posts",
        {
          title: input,
          body: `AI Response to: ${input}`,
          userId: 1,
        }
      );

      // Save AI response
      const aiMessage = { ...response.data, sender: "ai" };
      setMessages((prev) => [...prev, aiMessage]);

      // Clear input
      setInput("");
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };

  // Delete message from history
  const handleDelete = (index) => {
    setMessages((prev) => prev.filter((_, i) => i !== index));
  };

  // Start renaming
  const handleRename = (index, currentTitle) => {
    setEditIndex(index);
    setEditValue(currentTitle);
  };

  // Save rename
  const handleRenameSave = (index) => {
    setMessages((prev) =>
      prev.map((msg, i) =>
        i === index ? { ...msg, title: editValue, body: editValue } : msg
      )
    );
    setEditIndex(null);
    setEditValue("");
  };

  // Share (just copies to clipboard)
  const handleShare = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  return (
    <>
      {/* Sidebar toggle */}
      <div className="hamburger" onClick={toggleSidebar}>
        ☰
      </div>

      {/* Sidebar */}
      <div className={`sidebar ${isSidebarOpen ? "open" : "closed"}`}>
        <p>Chat History</p>
        <ul>
          {messages.map((msg, index) => (
            <li key={index} className="history-item">
              {editIndex === index ? (
                <>
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                  />
                  <button onClick={() => handleRenameSave(index)}>Save</button>
                </>
              ) : (
                <>
                  <span>
                    {msg.sender === "user"
                      ? `You: ${msg.title}`
                      : `AI: ${msg.title}`}
                  </span>
                  <div className="history-actions">
                    <button onClick={() => handleDelete(index)}>🗑️</button>
                    <button onClick={() => handleRename(index, msg.title)}>
                      ✏️
                    </button>
                    <button onClick={() => handleShare(msg.title)}>📤</button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
      {isSidebarOpen && <div className="overlay" onClick={toggleSidebar}></div>}

      {/* Main Content */}
      <div className="content-area">
        {/* Show welcome only if no messages */}
        {messages.length === 0 ? (
          <div className="content">
            <h1>Welcome to Diagram GPT</h1>
            <p>Create your system design with a single click</p>
          </div>
        ) : (
          <div className="messages-box">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`message ${msg.sender === "user" ? "user" : "ai"}`}
              >
                <p>
                  <strong>{msg.sender === "user" ? "You" : "AI"}</strong>
                </p>
                <p>{msg.body}</p>
              </div>
            ))}
          </div>
        )}

        {/* Input area */}
        <div className="input-container">
          <textarea
            placeholder="Type your message..."
            className="message-input"
            rows={2}
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button className="enhancer">AI Enhancer</button>
          <button className="send" onClick={handleSend}>
            →
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="footer-text">
        For best output use AI powered prompt enhancer
      </div>
    </>
  );
}

export default App;
