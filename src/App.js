import { Link } from "react-router-dom";
import "./App.css";
import { useState } from "react";

function App() {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState([]);

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const generateAIResponse = async (userMessage) => {
    const API_KEY = process.env.REACT_APP_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

    const requestBody = {
      contents: [
        {
          parts: [{ text: userMessage  }],
        },
      ],
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      return data.candidates[0]?.content?.parts[0]?.text || "I couldn't generate a response.";
    } catch (error) {
      console.error("Error generating content:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = inputValue.trim();
    setMessages([...messages, { sender: "User", text: userMessage }]); // Add user message
    setInputValue("");

    const aiResponse = await generateAIResponse(userMessage);
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: "AI", text: aiResponse },
    ]);
  };

  return (
    <div className="App">
      <div className="container">
        <header className="">
          <nav>
            <div className="logo">
              <Link to="/">Chat AI</Link>
            </div>
            <div className="icons"></div>
          </nav>
        </header>

        <main className="chatArea">
          {messages.map((message, index) => (
            <div
              key={index}
              className={message.sender === "User" ? "person" : "ai"}
            >
              {message.text}
            </div>
          ))}
        </main>

        <footer>
          <form className="messageBoxWrapper" onSubmit={handleSubmit}>
            <input
              className="messageBox"
              type="text"
              value={inputValue}
              onChange={handleChange}
              placeholder="Type your query"
            />
            <button className="btn" type="submit" disabled={!inputValue.trim()}>
              <i className="fa-solid fa-chevron-up" />
            </button>
          </form>
        </footer>
      </div>
    </div>
  );
}

export default App;
