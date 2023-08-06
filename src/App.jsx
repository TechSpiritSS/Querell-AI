import React, { useState, useRef, useEffect } from 'react';

import './App.css';

function App() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hi, start by giving a brief introduction about yourself.',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [speechRecognitionSupported, setSpeechRecognitionSupported] =
    useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    let synth = window.speechSynthesis;
    let utterance = new SpeechSynthesisUtterance(
      'Hi, start by giving a brief introduction about yourself.'
    );
    let femaleVoices = synth
      .getVoices()
      .filter((voice) => voice.gender === 'female');
    utterance.voice = femaleVoices[0];
    synth.speak(utterance);

    return () => {
      // Clean up function to stop the speech when the component unmounts
      synth.cancel();
    };
  }, []);

  useEffect(() => {
    scrollToBottom();

    // check if speech recognition is supported by the browser
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      setSpeechRecognitionSupported(true);
    }
  }, [messages]);

  const sendMessage = async () => {
    // prevent empty messages
    if (!inputValue) return;

    const newMessage = { content: inputValue, role: 'user' };
    setMessages([...messages, newMessage]); // add user content here

    const jsonVal = {
      text: inputValue,
      userId: Math.floor(Math.random() * 1000000).toString(),
    };

    setLoading(true);

    try {
      const response = await fetch('http://localhost:3000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: [...messages, newMessage] }), // Send the content history as part of the request
      });

      if (!response.ok) {
        throw new Error('Failed to send message history to OpenAI SDK backend.');
      }

      const responseData = await response.json();

      const botMessage = { content: responseData.botMessage, role: 'assistant' };
      setLoading(false);
      setMessages([...messages, newMessage, botMessage]); // add assistant content here

      // speak the assistant content
      const synth = window.speechSynthesis;
      const utterance = new SpeechSynthesisUtterance(responseData.botMessage);
      const femaleVoices = synth.getVoices().filter((voice) => voice.gender === 'female');
      utterance.voice = femaleVoices[0];
      synth.speak(utterance);
    } catch (error) {
      console.error(error);
      setLoading(false);
      // Handle any error or display an error content to the user
    }

    setInputValue('');
  };
  
  const startSpeechRecognition = () => {
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    setIsListening(true);
    recognitionRef.current = new (window.SpeechRecognition ||
      window.webkitSpeechRecognition)();
    recognitionRef.current.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInputValue(transcript);
      setIsListening(false);
    };
    recognitionRef.current.start();
  };

  return (
    <div className="App">
      <div className="header">
        <div className="header-info">
          <img src="./logo.jpeg" alt="User Profile" className="profile-image" />
          <div className="username">Querell AI</div>
        </div>
      </div>
      <div className="messages-container">
        {messages.map((message, index) => (
          <div
            className={`message ${
              message.role === 'user' ? 'user-message' : 'bot-message'
            }`}
            key={index}
          >
            {message.content}
          </div>
        ))}
        <div ref={messagesEndRef}></div>
        {loading && (
          <div className="message bot-message">
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
      </div>
      <div className="input-container">
        <form onSubmit={(e) => e.preventDefault()}>
          <input
            className="input"
            type="text"
            placeholder="Type your message here..."
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
          />
          <button
            className="send-button"
            onClick={(e) => {
              e.preventDefault();
              sendMessage();
            }}
          >
            Send
          </button>
          <button
            className="microphone-button"
            onClick={startSpeechRecognition}
            style={{
              display: speechRecognitionSupported ? 'inline' : 'none',
              color: isListening ? 'red' : 'black',
            }}
          >
            <i className="fa fa-microphone" aria-hidden="true"></i>
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;

