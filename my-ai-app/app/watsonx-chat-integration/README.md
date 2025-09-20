# IBM watsonx.ai Chat Integration

A simple, production-ready chat module for integrating IBM watsonx.ai into your Node.js applications. This package provides an easy-to-use interface for multi-message conversations with IBM's watsonx.ai language models.

## ✨ Features

- 🔥 **Ready to use** - Hardcoded credentials, no configuration needed
- 💬 **Multi-message conversations** - Automatic context management
- 🚀 **Simple API** - Easy integration with just a few lines of code
- 📊 **Token tracking** - Monitor API usage and costs
- 🛡️ **Error handling** - Graceful failure with detailed error messages
- 🔧 **Configurable** - Customize model parameters and system prompts
- 💾 **Export/Import** - Save and restore conversations

## 🚀 Quick Start

### 1. Installation

Copy the integration files to your project:

```bash
# Copy these files to your project directory
- watsonx-chat-module.js
- package.json (optional)
```

### 2. Install Dependencies

```bash
npm install node-fetch@^3.3.2
```

### 3. Basic Usage

```javascript
const WatsonxChat = require("./watsonx-chat-module");

async function chatExample() {
  // Create a chat instance
  const chat = new WatsonxChat();

  // Send a message
  const response = await chat.sendMessage("Hello! How are you?");

  if (response.success) {
    console.log("AI:", response.message);
    console.log("Tokens used:", response.usage.totalTokens);
  } else {
    console.log("Error:", response.error);
  }
}

chatExample();
```

## 📖 Complete API Reference

### Creating a Chat Instance

```javascript
const chat = new WatsonxChat({
  // Optional configuration
  maxTokens: 512, // Max response length
  temperature: 0.7, // Creativity (0.0-1.0)
  systemPrompt: "You are a helpful assistant.",
  model: "meta-llama/llama-2-13b-chat", // Model to use
});
```

### Sending Messages

#### Single Message

```javascript
const response = await chat.sendMessage("What is JavaScript?");

if (response.success) {
  console.log("Response:", response.message);
  console.log("Usage:", response.usage);
} else {
  console.log("Error:", response.error);
}
```

#### Multiple Messages (Batch)

```javascript
const messages = [
  "What is Python?",
  "How do I install packages?",
  "What is pip?",
];

const responses = await chat.sendMessages(messages);
responses.forEach((response, index) => {
  if (response.success) {
    console.log(`Q: ${messages[index]}`);
    console.log(`A: ${response.message}\n`);
  }
});
```

### Conversation Management

#### Get Conversation History

```javascript
const history = chat.getConversation();
console.log("Messages:", history.length);
```

#### Clear Conversation

```javascript
chat.clearConversation();
console.log("Conversation cleared");
```

#### Export/Import Conversations

```javascript
// Export
const exportData = chat.exportConversation();
const jsonString = JSON.stringify(exportData);

// Import
const result = chat.importConversation(JSON.parse(jsonString));
if (result.success) {
  console.log("Conversation imported successfully");
}
```

### Configuration Management

#### Update System Prompt

```javascript
chat.setSystemPrompt("You are a coding expert. Provide clear examples.");
```

#### Update Configuration

```javascript
chat.updateConfig({
  maxTokens: 256,
  temperature: 0.5,
});
```

#### Get Current Configuration

```javascript
const config = chat.getConfig();
console.log("Current settings:", config);
```

## 💡 Usage Examples

### Example 1: Simple Q&A Bot

```javascript
const WatsonxChat = require("./watsonx-chat-module");

async function qaBot() {
  const chat = new WatsonxChat({
    systemPrompt: "You are a helpful Q&A assistant. Keep answers concise.",
  });

  const questions = [
    "What is Node.js?",
    "How do I install npm packages?",
    "What is package.json?",
  ];

  for (const question of questions) {
    const response = await chat.sendMessage(question);
    if (response.success) {
      console.log(`Q: ${question}`);
      console.log(`A: ${response.message}\n`);
    }
  }
}

qaBot();
```

### Example 2: Coding Assistant

```javascript
async function codingAssistant() {
  const chat = new WatsonxChat({
    systemPrompt:
      "You are a coding tutor. Provide practical examples with code.",
    maxTokens: 300,
  });

  console.log("👨‍💻 Coding Assistant Started\n");

  const response = await chat.sendMessage(
    "How do I create a REST API with Express.js?"
  );

  if (response.success) {
    console.log("🤖 Assistant:", response.message);

    // Follow up question
    const followUp = await chat.sendMessage(
      "Can you show me how to add middleware?"
    );

    if (followUp.success) {
      console.log("\n🤖 Follow-up:", followUp.message);
    }
  }
}

codingAssistant();
```

### Example 3: Interactive Chat Loop

```javascript
const readline = require("readline");

async function interactiveChat() {
  const chat = new WatsonxChat({
    systemPrompt:
      "You are a friendly conversational AI. Be helpful and engaging.",
  });

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log('🤖 Chat started! Type "exit" to quit.\n');

  const askQuestion = () => {
    rl.question("You: ", async (userInput) => {
      if (userInput.toLowerCase() === "exit") {
        console.log("\n👋 Goodbye!");
        rl.close();
        return;
      }

      const response = await chat.sendMessage(userInput);

      if (response.success) {
        console.log("🤖 AI:", response.message);
        console.log(`📊 Tokens: ${response.usage.totalTokens}\n`);
      } else {
        console.log("❌ Error:", response.error, "\n");
      }

      askQuestion(); // Continue the loop
    });
  };

  askQuestion();
}

interactiveChat();
```

## 🔧 Configuration Options

### Model Parameters

| Parameter           | Default | Description                |
| ------------------- | ------- | -------------------------- |
| `maxTokens`         | 512     | Maximum tokens in response |
| `temperature`       | 0.7     | Creativity (0.0-1.0)       |
| `topP`              | 0.95    | Nucleus sampling parameter |
| `repetitionPenalty` | 1.1     | Repetition penalty         |

### Available Models

- `meta-llama/llama-2-13b-chat` (default)
- `ibm/granite-13b-instruct-v2`
- `mistralai/mixtral-8x7b-instruct-v01`

### System Prompts Examples

```javascript
// For coding assistance
"You are a senior software engineer. Provide clear, practical coding advice with examples.";

// For customer support
"You are a helpful customer service representative. Be polite and solve problems efficiently.";

// For creative writing
"You are a creative writing assistant. Help users craft engaging stories and content.";

// For education
"You are a patient tutor. Explain complex concepts in simple terms with examples.";
```

## 📊 Response Format

Every method returns a standardized response:

```javascript
{
    success: true,          // Boolean: operation success
    message: "AI response", // String: the AI's response
    messageId: 1234567890,  // Number: unique message ID
    usage: {                // Object: token usage
        inputTokens: 25,
        outputTokens: 150,
        totalTokens: 175
    },
    conversationLength: 4   // Number: total exchanges
}
```

On error:

```javascript
{
    success: false,
    error: "Error description",
    message: null
}
```

## 🛠️ Troubleshooting

### Common Issues

1. **"fetch is not a function"**

   - Make sure you have `node-fetch` installed: `npm install node-fetch@^3.3.2`

2. **Token/Authentication errors**

   - The module uses hardcoded credentials that are pre-configured
   - No additional setup required

3. **Model not supported errors**

   - Try different models in the configuration
   - Check if your Watson project has access to the model

4. **Network timeouts**
   - The module handles retries automatically
   - Check your internet connection

### Performance Tips

1. **Token Management**

   - Monitor `response.usage.totalTokens` to track costs
   - Use lower `maxTokens` for shorter responses

2. **Memory Management**

   - Use `chat.clearConversation()` for long-running apps
   - Conversation history is automatically limited to 20 messages

3. **Error Handling**
   - Always check `response.success` before using the response
   - Implement retry logic for critical applications

## 📁 File Structure

```
your-project/
├── watsonx-chat-module.js      # Main chat module
├── chat-example-usage.js       # Usage examples
├── package.json               # Dependencies (optional)
└── your-app.js               # Your application code
```

## 🤝 Integration Checklist

- [ ] Copy `watsonx-chat-module.js` to your project
- [ ] Install `node-fetch` dependency
- [ ] Create a chat instance in your code
- [ ] Test with a simple message
- [ ] Implement error handling
- [ ] Configure system prompt for your use case
- [ ] Test conversation flow
- [ ] Monitor token usage

## 📝 Example Integration

Here's a complete example for integrating into an Express.js API:

```javascript
const express = require("express");
const WatsonxChat = require("./watsonx-chat-module");

const app = express();
app.use(express.json());

// Create chat instance
const chat = new WatsonxChat({
  systemPrompt: "You are a helpful API assistant.",
});

// Chat endpoint
app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const response = await chat.sendMessage(message);

    if (response.success) {
      res.json({
        reply: response.message,
        usage: response.usage,
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

## 🎯 Next Steps

1. **Test the module** with the provided examples
2. **Customize the system prompt** for your use case
3. **Integrate into your application** using the API reference
4. **Monitor token usage** to manage costs
5. **Implement proper error handling** for production use

## 🆘 Support

If you encounter any issues:

1. Check the troubleshooting section above
2. Review the example usage files
3. Test with the basic examples first
4. Ensure all dependencies are installed correctly

---

**Ready to chat with AI? Start with the basic example and build from there!** 🚀
