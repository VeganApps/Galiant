/**
 * Quick Start Example for IBM watsonx.ai Chat Integration
 * Copy this file to test the integration quickly
 */

const WatsonxChat = require('./watsonx-chat-module');

async function quickStartDemo() {
    console.log('🚀 IBM watsonx.ai Chat - Quick Start Demo\n');
    
    try {
        // 1. Create a chat instance
        console.log('📝 Step 1: Creating chat instance...');
        const chat = new WatsonxChat({
            systemPrompt: "You are a helpful AI assistant. Keep responses clear and concise."
        });
        console.log('✅ Chat instance created successfully!\n');
        
        // 2. Send your first message
        console.log('📝 Step 2: Sending first message...');
        const response1 = await chat.sendMessage("Hello! Can you introduce yourself?");
        
        if (response1.success) {
            console.log('👤 User: Hello! Can you introduce yourself?');
            console.log('🤖 AI:', response1.message);
            console.log('📊 Tokens used:', response1.usage.totalTokens);
            console.log('✅ First message successful!\n');
        } else {
            console.log('❌ Error:', response1.error);
            return;
        }
        
        // 3. Continue the conversation
        console.log('📝 Step 3: Continuing conversation...');
        const response2 = await chat.sendMessage("What can you help me with?");
        
        if (response2.success) {
            console.log('👤 User: What can you help me with?');
            console.log('🤖 AI:', response2.message);
            console.log('📊 Tokens used:', response2.usage.totalTokens);
            console.log('✅ Conversation successful!\n');
        } else {
            console.log('❌ Error:', response2.error);
            return;
        }
        
        // 4. Show conversation summary
        console.log('📝 Step 4: Conversation summary');
        console.log('Total exchanges:', chat.getConversationLength());
        console.log('Full conversation:');
        const history = chat.getConversation();
        history.forEach((msg, index) => {
            const speaker = msg.role === 'user' ? '👤' : '🤖';
            console.log(`  ${speaker} ${msg.role}: ${msg.content.substring(0, 50)}...`);
        });
        
        console.log('\n🎉 Quick start demo completed successfully!');
        console.log('\n💡 Next steps:');
        console.log('1. Check out the full examples in chat-example-usage.js');
        console.log('2. Read the README.md for complete API documentation');
        console.log('3. Integrate the module into your own application');
        console.log('4. Customize the system prompt for your use case');
        
    } catch (error) {
        console.error('❌ Demo failed:', error.message);
        console.log('\n🔧 Troubleshooting:');
        console.log('1. Make sure node-fetch is installed: npm install node-fetch@^3.3.2');
        console.log('2. Check your internet connection');
        console.log('3. Verify the module files are in the correct location');
    }
}

// Run the quick start demo
if (require.main === module) {
    quickStartDemo();
}

module.exports = quickStartDemo;
