import React, { useRef, useState, useEffect } from "react";
import "./Chatbot.css";

// Updated responses and resources for a wider range of topics
const responses = {
  "hi": "Hey there! I'm here for you. What's on your mind today?",
  "hello": "Hi dost! I'm glad you're here. How are you feeling?",
  "help": "I'm always here to help. What's going on?",
  "stressed": "Oh, I'm sorry to hear that. Stress is tough. Let's talk about it, or would you like some quick relaxation tips?",
  "anxious": "Anxiety can feel really overwhelming. Just remember to breathe. How about some coping strategies to help you right now?",
  "overwhelmed": "It's totally okay to feel overwhelmed. How about we break things down? Or maybe you just need a short break?",
  "study help": "Studying can be a lot. Try the Pomodoro technique. Or tell me what's difficult and we can find some other tips.",
  "lonely": "Feeling lonely is a valid emotion. Remember you are not alone. Maybe reach out to a friend or family member?",
  "sad": "I'm sorry you're feeling sad. It's important to acknowledge your feelings. Would you like to try some grounding exercises?",
  "concentration": "Losing focus is common. Try to remove distractions and set small goals. You can also try a quick mindfulness exercise.",
  "motivation": "It can be tough to find motivation. Start with a tiny task, no matter how small. A little progress can create momentum.",
  "insomnia": "Having trouble sleeping? Try a warm drink before bed and keep your phone away. Relaxation tips might also help.",
  "bye": "Take care! Remember, I'm just a click away if you need to talk again.",
};

const resources = {
  "relaxation tips": `<ul>
    <li>Take a few deep breaths, in for 4, hold for 4, out for 6.</li>
    <li>Go for a short walk and notice the things around you.</li>
    <li>Listen to your favorite calming music.</li>
    <li>Try a short guided meditation on YouTube.</li>
  </ul>`,
  "coping strategies": `<ul>
    <li>Talk to a friend or family member. Sharing helps.</li>
    <li>Write down your thoughts in a journal. It can clear your head.</li>
    <li>Practice mindfulness. Focus on one thing for a minute.</li>
    <li>Step away from your work and do something you love, even for a little while.</li>
  </ul>`,
  "study tips": `<ul>
    <li>Set small, achievable goals, don't try to do everything at once.</li>
    <li>Use the Pomodoro technique: 25 minutes focused work, 5 minutes break.</li>
    <li>Remove all distractions from your study area.</li>
    <li>Reward yourself after completing a tough task!</li>
  </ul>`,
  "grounding exercises": `<ul>
    <li>5-4-3-2-1 Method: Name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, and 1 you can taste.</li>
    <li>Hold a cool object in your hand and focus on its temperature and texture.</li>
  </ul>`,
  "mindfulness exercises": `<ul>
    <li>Focus on your breathing. Notice each inhale and exhale.</li>
    <li>Take a short walk and focus on the sensation of your feet on the ground.</li>
  </ul>`,
};

function getResponse(message) {
  const msg = message.toLowerCase();
  if (msg.includes("relax") || msg.includes("relaxation")) {
    return { text: "Hey, here are a few things that might help you relax:", resources: resources["relaxation tips"] };
  }
  if (msg.includes("cope") || msg.includes("coping")) {
    return { text: "I have some coping strategies that could be useful:", resources: resources["coping strategies"] };
  }
  if (msg.includes("study")) {
    return { text: "I have a few study tips that might make things easier:", resources: resources["study tips"] };
  }
  if (msg.includes("grounding") || msg.includes("5-4-3-2-1")) {
    return { text: "Grounding can really help when things feel tough. Here are some exercises:", resources: resources["grounding exercises"] };
  }
  if (msg.includes("mindful")) {
    return { text: "Mindfulness is a great tool. Here are some exercises to get started:", resources: resources["mindfulness exercises"] };
  }
  for (let key in responses) {
    if (msg.includes(key)) {
      return { text: responses[key] };
    }
  }
  return { text: "I'm not sure about that, but I'm a good listener. Can you tell me more about what you're thinking?" };
}

export default function Chatbot() {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: `Hi dost! I'm your friendly companion, here for your mental health. How are you feeling today? 🌟`,
      quick: true,
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const chatRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, typing]);

  const handleSend = (msg) => {
    if (!msg.trim()) return;
    setMessages((prev) => [...prev, { sender: "user", text: msg }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      const response = getResponse(msg);
      let fullResponse = response.text;
      if (response.resources) fullResponse += response.resources;
      setMessages((prev) => [...prev, { sender: "bot", text: fullResponse }]);
      setTyping(false);
    }, 1200 + Math.random() * 800);
  };

  const handleQuick = (msg) => handleSend(msg);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSend(input);
  };

  const handleExit = () => {
    setIsOpen(false);
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button className="floating-chat-button" onClick={toggleChat}>
        💬
      </button>
      <div className={`chatbot-container ${isOpen ? "active" : ""}`}>
        <div className="chatbot-header">
          <div className="header-content">
            <div className="status-indicator"></div>
            <div>
              <h2>Friend Assistant</h2>
              <p>Your Mental Health Support Companion</p>
            </div>
          </div>
          <button className="exit-button" onClick={handleExit}>×</button>
        </div>
        <div className="chat-messages" ref={chatRef}>
          {messages.map((m, i) => (
            <div className={`message ${m.sender}`} key={i}>
              <div className={`avatar ${m.sender === "bot" ? "bot-avatar" : "user-avatar"}`}>
                {m.sender === "bot" ? "Fr" : "You"}
              </div>
              <div className="message-bubble" dangerouslySetInnerHTML={{ __html: m.text }} />
              {m.quick && (
                <div className="quick-responses">
                  <button className="quick-response" onClick={() => handleQuick("I'm feeling stressed")}>Feeling Stressed</button>
                  <button className="quick-response" onClick={() => handleQuick("I'm anxious")}>Anxious</button>
                  <button className="quick-response" onClick={() => handleQuick("Feeling lonely")}>Lonely</button>
                  <button className="quick-response" onClick={() => handleQuick("Need study help")}>Study Help</button>
                </div>
              )}
            </div>
          ))}
          {typing && (
            <div className="typing-indicator">
              <div className="message bot">
                <div className="avatar bot-avatar">Fr</div>
                <div className="message-bubble">...</div>
              </div>
            </div>
          )}
        </div>
        <div className="input-container">
          <input
            type="text"
            className="message-input"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button className="send-button" onClick={() => handleSend(input)}>Send</button>
        </div>
      </div>
    </>
  );
}