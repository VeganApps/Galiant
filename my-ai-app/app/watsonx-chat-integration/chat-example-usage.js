/**
 * Example: How to use the WatsonxChat module in your app
 */

const WatsonxChat = require('./watsonx-chat-module');

async function basicChatExample() {
    console.log('=== Basic Chat Example ===\n');
    
    // Create a chat instance
    const chat = new WatsonxChat({
        systemPrompt: "You are a helpful assistant that provides clear, concise answers."
    });
    
    try {
        // Send a message
        const response = await chat.sendMessage("What is artificial intelligence?");
        
        if (response.success) {
            console.log('User: What is artificial intelligence?');
            console.log('AI:', response.message);
            console.log('Tokens used:', response.usage.totalTokens);
        } else {
            console.log('Error:', response.error);
        }
        
    } catch (error) {
        console.log('Error:', error.message);
    }
}

async function conversationExample() {
    console.log('\n=== Multi-Message Conversation Example ===\n');
    
    const chat = new WatsonxChat({
        systemPrompt: "You are a helpful coding tutor. Keep explanations simple and practical."
    });
    
    const questions = [
        "What is Python?",
        "How do I create a function in Python?",
        "Can you show me an example with parameters?",
        "What about return values?"
    ];
    
    try {
        for (const question of questions) {
            console.log(`👤 User: ${question}`);
            
            const response = await chat.sendMessage(question);
            
            if (response.success) {
                console.log(`🤖 AI: ${response.message}\n`);
            } else {
                console.log(`❌ Error: ${response.error}\n`);
                break;
            }
        }
        
        // Show conversation stats
        console.log('📊 Conversation Stats:');
        console.log(`- Total messages: ${chat.getConversationLength()}`);
        console.log(`- Full conversation:`, chat.getConversation().length, 'exchanges');
        
    } catch (error) {
        console.log('Error:', error.message);
    }
}

async function chatWithCustomConfigExample() {
    console.log('\n=== Custom Configuration Example ===\n');
    
    // Create chat with custom settings
    const chat = new WatsonxChat({
        maxTokens: 100,        // Shorter responses
        temperature: 0.3,      // More focused responses
        systemPrompt: "You are a concise technical expert. Answer in bullet points when possible."
    });
    
    try {
        const response = await chat.sendMessage("What are the benefits of using TypeScript over JavaScript?");
        
        if (response.success) {
            console.log('Question: What are the benefits of using TypeScript over JavaScript?');
            console.log('Answer:', response.message);
            console.log('Configuration used:', chat.getConfig().maxTokens, 'max tokens');
        }
        
    } catch (error) {
        console.log('Error:', error.message);
    }
}

async function conversationManagementExample() {
    console.log('\n=== Conversation Management Example ===\n');
    
    const chat = new WatsonxChat();
    
    try {
        // Send some messages
        await chat.sendMessage("Hello!");
        await chat.sendMessage("What's 2+2?");
        
        console.log('Before clearing - Messages:', chat.getConversationLength());
        
        // Clear conversation
        const clearResult = chat.clearConversation();
        console.log('Clear result:', clearResult.message);
        console.log('After clearing - Messages:', chat.getConversationLength());
        
        // Continue with fresh conversation
        const response = await chat.sendMessage("This is a new conversation. Who are you?");
        if (response.success) {
            console.log('New conversation response:', response.message);
        }
        
        // Export conversation
        const exportData = chat.exportConversation();
        console.log('Export data size:', JSON.stringify(exportData).length, 'characters');
        
    } catch (error) {
        console.log('Error:', error.message);
    }
}

async function batchMessagesExample() {
    console.log('\n=== Batch Messages Example ===\n');
    
    const chat = new WatsonxChat({
        systemPrompt: "You are a helpful assistant. Keep responses brief."
    });
    
    const messages = [
        "What is Node.js?",
        "How do I install npm packages?",
        "What is package.json?"
    ];
    
    try {
        console.log('Sending multiple messages in sequence...\n');
        
        const responses = await chat.sendMessages(messages);
        
        responses.forEach((response, index) => {
            console.log(`Q${index + 1}: ${messages[index]}`);
            if (response.success) {
                console.log(`A${index + 1}: ${response.message}\n`);
            } else {
                console.log(`Error: ${response.error}\n`);
            }
        });
        
    } catch (error) {
        console.log('Error:', error.message);
    }
}

// Run all examples
async function runAllExamples() {
    try {
        await basicChatExample();
        await conversationExample();
        await chatWithCustomConfigExample();
        await conversationManagementExample();
        await batchMessagesExample();
        
        console.log('\n🎉 All examples completed successfully!');
        console.log('\n💡 Integration Tips:');
        console.log('- Import: const WatsonxChat = require("./watsonx-chat-module");');
        console.log('- Create: const chat = new WatsonxChat();');
        console.log('- Send: const response = await chat.sendMessage("Hello");');
        console.log('- Check: if (response.success) { ... }');
        
    } catch (error) {
        console.error('❌ Example failed:', error.message);
    }
}

// Run examples if this file is executed directly
if (require.main === module) {
    runAllExamples();
}

// Export for use in other files
module.exports = {
    basicChatExample,
    conversationExample,
    chatWithCustomConfigExample,
    conversationManagementExample,
    batchMessagesExample
};
