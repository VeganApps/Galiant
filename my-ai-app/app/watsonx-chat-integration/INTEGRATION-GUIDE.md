# 🚀 Integration Guide - IBM watsonx.ai Chat Module

This guide will help you integrate the watsonx.ai chat module into your existing application step by step.

## 📋 Pre-Integration Checklist

- [ ] Node.js version 16 or higher installed
- [ ] Basic understanding of async/await in JavaScript
- [ ] Access to your application's codebase

## 🔧 Step-by-Step Integration

### Step 1: Copy Files to Your Project

Copy these files to your project directory:

```bash
# Essential files
watsonx-chat-module.js     # Main module (required)
package.json              # Dependencies (optional if you manage deps separately)

# Optional files for reference
chat-example-usage.js     # Usage examples
quick-start.js           # Quick test
README.md               # Full documentation
```

### Step 2: Install Dependencies

```bash
# In your project directory
npm install node-fetch@^3.3.2
```

### Step 3: Test the Integration

Run the quick start to verify everything works:

```bash
node quick-start.js
```

Expected output:

```
🚀 IBM watsonx.ai Chat - Quick Start Demo

📝 Step 1: Creating chat instance...
✅ Chat instance created successfully!

📝 Step 2: Sending first message...
👤 User: Hello! Can you introduce yourself?
🤖 AI: [AI response]
📊 Tokens used: [number]
✅ First message successful!
...
```

### Step 4: Basic Integration

Add to your application:

```javascript
// Import the module
const WatsonxChat = require("./watsonx-chat-module");

// Create a chat instance (do this once, reuse throughout your app)
const chat = new WatsonxChat({
  systemPrompt: "You are a helpful assistant for my application.",
});

// Use in your application
async function handleUserMessage(userInput) {
  const response = await chat.sendMessage(userInput);

  if (response.success) {
    return response.message;
  } else {
    console.error("Chat error:", response.error);
    return "Sorry, I encountered an error. Please try again.";
  }
}
```

## 🏗️ Architecture Patterns

### Pattern 1: Single Global Chat Instance

Best for: Simple applications, single-user scenarios

```javascript
// app.js
const WatsonxChat = require("./watsonx-chat-module");

// Create global chat instance
const globalChat = new WatsonxChat({
  systemPrompt: "You are a helpful assistant.",
});

// Use throughout your app
async function processMessage(message) {
  const response = await globalChat.sendMessage(message);
  return response.success ? response.message : "Error occurred";
}

module.exports = { processMessage };
```

### Pattern 2: Chat Service Class

Best for: Larger applications, better organization

```javascript
// services/ChatService.js
const WatsonxChat = require("../watsonx-chat-module");

class ChatService {
  constructor() {
    this.chat = new WatsonxChat({
      systemPrompt: "You are a helpful assistant for our application.",
      maxTokens: 300,
    });
  }

  async sendMessage(message) {
    try {
      const response = await this.chat.sendMessage(message);

      if (response.success) {
        return {
          success: true,
          message: response.message,
          tokens: response.usage.totalTokens,
        };
      } else {
        return {
          success: false,
          error: response.error,
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async clearHistory() {
    return this.chat.clearConversation();
  }

  getStats() {
    return {
      conversationLength: this.chat.getConversationLength(),
      history: this.chat.getConversation(),
    };
  }
}

module.exports = ChatService;
```

Usage:

```javascript
// In your app
const ChatService = require("./services/ChatService");
const chatService = new ChatService();

async function handleChat(userMessage) {
  const result = await chatService.sendMessage(userMessage);
  if (result.success) {
    console.log("AI:", result.message);
    console.log("Tokens:", result.tokens);
  } else {
    console.error("Error:", result.error);
  }
}
```

### Pattern 3: Per-User Chat Sessions

Best for: Multi-user applications, session management

```javascript
// services/ChatSessionManager.js
const WatsonxChat = require("../watsonx-chat-module");

class ChatSessionManager {
  constructor() {
    this.sessions = new Map(); // userId -> WatsonxChat instance
  }

  getSession(userId) {
    if (!this.sessions.has(userId)) {
      this.sessions.set(
        userId,
        new WatsonxChat({
          systemPrompt: `You are helping user ${userId}. Be personalized and helpful.`,
        })
      );
    }
    return this.sessions.get(userId);
  }

  async sendMessage(userId, message) {
    const chat = this.getSession(userId);
    return await chat.sendMessage(message);
  }

  clearSession(userId) {
    if (this.sessions.has(userId)) {
      this.sessions.get(userId).clearConversation();
    }
  }

  deleteSession(userId) {
    this.sessions.delete(userId);
  }

  getSessionStats(userId) {
    const chat = this.getSession(userId);
    return {
      conversationLength: chat.getConversationLength(),
      history: chat.getConversation(),
    };
  }
}

module.exports = ChatSessionManager;
```

Usage:

```javascript
const ChatSessionManager = require("./services/ChatSessionManager");
const chatManager = new ChatSessionManager();

// In your route handler
app.post("/chat", async (req, res) => {
  const { userId, message } = req.body;

  const response = await chatManager.sendMessage(userId, message);

  if (response.success) {
    res.json({
      reply: response.message,
      usage: response.usage,
    });
  } else {
    res.status(500).json({ error: response.error });
  }
});
```

## 🌐 Web Framework Integrations

### Express.js Integration

```javascript
const express = require("express");
const WatsonxChat = require("./watsonx-chat-module");

const app = express();
app.use(express.json());

const chat = new WatsonxChat({
  systemPrompt: "You are a web assistant. Help users with their questions.",
});

app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const response = await chat.sendMessage(message);

    if (response.success) {
      res.json({
        reply: response.message,
        tokens: response.usage.totalTokens,
        conversationLength: response.conversationLength,
      });
    } else {
      res.status(500).json({ error: response.error });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log("Chat API running on port 3000");
});
```

### Socket.io Integration (Real-time Chat)

```javascript
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const WatsonxChat = require("./watsonx-chat-module");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Per-socket chat instances
const chatSessions = new Map();

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Create chat instance for this user
  chatSessions.set(
    socket.id,
    new WatsonxChat({
      systemPrompt:
        "You are a real-time chat assistant. Be conversational and helpful.",
    })
  );

  socket.on("message", async (data) => {
    const chat = chatSessions.get(socket.id);
    const response = await chat.sendMessage(data.message);

    if (response.success) {
      socket.emit("response", {
        message: response.message,
        tokens: response.usage.totalTokens,
      });
    } else {
      socket.emit("error", { error: response.error });
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    chatSessions.delete(socket.id);
  });
});

server.listen(3000, () => {
  console.log("Real-time chat server running on port 3000");
});
```

## 📱 Frontend Integration Examples

### HTML/JavaScript

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Chat with AI</title>
  </head>
  <body>
    <div id="chat-container">
      <div id="messages"></div>
      <input
        type="text"
        id="message-input"
        placeholder="Type your message..."
      />
      <button onclick="sendMessage()">Send</button>
    </div>

    <script>
      async function sendMessage() {
        const input = document.getElementById("message-input");
        const message = input.value.trim();

        if (!message) return;

        // Add user message to chat
        addMessage("You", message);
        input.value = "";

        try {
          const response = await fetch("/api/chat", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ message }),
          });

          const data = await response.json();

          if (response.ok) {
            addMessage("AI", data.reply);
          } else {
            addMessage("Error", data.error);
          }
        } catch (error) {
          addMessage("Error", "Failed to send message");
        }
      }

      function addMessage(sender, message) {
        const messagesDiv = document.getElementById("messages");
        const messageDiv = document.createElement("div");
        messageDiv.innerHTML = `<strong>${sender}:</strong> ${message}`;
        messagesDiv.appendChild(messageDiv);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
      }

      // Send message on Enter key
      document
        .getElementById("message-input")
        .addEventListener("keypress", function (e) {
          if (e.key === "Enter") {
            sendMessage();
          }
        });
    </script>
  </body>
</html>
```

### React Component

```jsx
import React, { useState, useEffect, useRef } from "react";

function ChatComponent() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();

      if (response.ok) {
        const aiMessage = { sender: "ai", text: data.reply };
        setMessages((prev) => [...prev, aiMessage]);
      } else {
        const errorMessage = { sender: "error", text: data.error };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch (error) {
      const errorMessage = { sender: "error", text: "Failed to send message" };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            <strong>
              {msg.sender === "user"
                ? "You"
                : msg.sender === "ai"
                ? "AI"
                : "Error"}
              :
            </strong>
            <span>{msg.text}</span>
          </div>
        ))}
        {loading && <div className="message loading">AI is thinking...</div>}
        <div ref={messagesEndRef} />
      </div>

      <div className="input-container">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type your message..."
          disabled={loading}
        />
        <button onClick={sendMessage} disabled={loading || !input.trim()}>
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatComponent;
```

## 🔒 Production Considerations

### Error Handling

```javascript
class RobustChatService {
  constructor() {
    this.chat = new WatsonxChat({
      systemPrompt: "You are a helpful assistant.",
    });
    this.retryCount = 3;
    this.retryDelay = 1000; // 1 second
  }

  async sendMessageWithRetry(message, retries = this.retryCount) {
    try {
      const response = await this.chat.sendMessage(message);

      if (response.success) {
        return response;
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      if (retries > 0) {
        console.log(`Retrying... ${retries} attempts left`);
        await new Promise((resolve) => setTimeout(resolve, this.retryDelay));
        return this.sendMessageWithRetry(message, retries - 1);
      } else {
        throw error;
      }
    }
  }
}
```

### Rate Limiting

```javascript
class RateLimitedChatService {
  constructor() {
    this.chat = new WatsonxChat();
    this.userLimits = new Map(); // userId -> { count, resetTime }
    this.maxRequestsPerHour = 60;
  }

  checkRateLimit(userId) {
    const now = Date.now();
    const userLimit = this.userLimits.get(userId);

    if (!userLimit || now > userLimit.resetTime) {
      this.userLimits.set(userId, {
        count: 1,
        resetTime: now + 60 * 60 * 1000, // 1 hour
      });
      return true;
    }

    if (userLimit.count >= this.maxRequestsPerHour) {
      return false;
    }

    userLimit.count++;
    return true;
  }

  async sendMessage(userId, message) {
    if (!this.checkRateLimit(userId)) {
      return {
        success: false,
        error: "Rate limit exceeded. Please try again later.",
      };
    }

    return await this.chat.sendMessage(message);
  }
}
```

### Logging and Monitoring

```javascript
const fs = require("fs");

class MonitoredChatService {
  constructor() {
    this.chat = new WatsonxChat();
    this.logFile = "chat-logs.json";
  }

  async sendMessage(message, userId = "anonymous") {
    const startTime = Date.now();

    try {
      const response = await this.chat.sendMessage(message);

      this.logInteraction({
        timestamp: new Date().toISOString(),
        userId,
        message,
        response: response.message,
        tokens: response.usage?.totalTokens,
        duration: Date.now() - startTime,
        success: response.success,
      });

      return response;
    } catch (error) {
      this.logInteraction({
        timestamp: new Date().toISOString(),
        userId,
        message,
        error: error.message,
        duration: Date.now() - startTime,
        success: false,
      });

      throw error;
    }
  }

  logInteraction(data) {
    const logEntry = JSON.stringify(data) + "\n";
    fs.appendFileSync(this.logFile, logEntry);
  }
}
```

## 🧪 Testing

### Unit Tests (Jest)

```javascript
// chat.test.js
const WatsonxChat = require("./watsonx-chat-module");

describe("WatsonxChat", () => {
  let chat;

  beforeEach(() => {
    chat = new WatsonxChat({
      systemPrompt: "You are a test assistant.",
    });
  });

  test("should send a message successfully", async () => {
    const response = await chat.sendMessage("Hello");

    expect(response.success).toBe(true);
    expect(response.message).toBeDefined();
    expect(typeof response.message).toBe("string");
    expect(response.usage).toBeDefined();
  }, 30000); // 30 second timeout

  test("should maintain conversation history", async () => {
    await chat.sendMessage("My name is John");
    const response = await chat.sendMessage("What is my name?");

    expect(response.success).toBe(true);
    expect(response.message.toLowerCase()).toContain("john");
  }, 30000);

  test("should clear conversation", () => {
    chat.sendMessage("Hello");
    const result = chat.clearConversation();

    expect(result.success).toBe(true);
    expect(chat.getConversationLength()).toBe(0);
  });
});
```

## 📊 Performance Optimization

### Token Management

```javascript
class TokenOptimizedChat {
  constructor() {
    this.chat = new WatsonxChat({
      maxTokens: 150, // Start with lower tokens
      temperature: 0.3, // More focused responses
    });
  }

  async sendOptimizedMessage(message) {
    // Truncate very long messages
    const truncatedMessage =
      message.length > 500 ? message.substring(0, 500) + "..." : message;

    const response = await this.chat.sendMessage(truncatedMessage);

    // Log token usage for monitoring
    if (response.success) {
      console.log(`Tokens used: ${response.usage.totalTokens}`);
    }

    return response;
  }
}
```

## 🎯 Next Steps

1. **Choose the right pattern** for your application architecture
2. **Implement error handling** and retry logic
3. **Add rate limiting** for production use
4. **Set up monitoring** and logging
5. **Write tests** for your integration
6. **Optimize for performance** based on your needs

## 📞 Support Checklist

Before asking for help:

- [ ] Verified Node.js version (16+)
- [ ] Installed node-fetch dependency
- [ ] Tested with quick-start.js
- [ ] Checked error messages in console
- [ ] Reviewed the troubleshooting section in README.md
- [ ] Tested network connectivity

---

**You're ready to integrate! Start with the quick-start.js file and build from there.** 🚀
