/**
 * IBM watsonx.ai Chat Module
 * A clean, reusable chat client for multi-message conversations
 * Ready to integrate into any Node.js application
 */

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

class WatsonxChat {
    constructor(config = {}) {
        // Default configuration with your credentials
        this.config = {
            apikey: config.apikey || 'jqCMGruSAsgUVMSB3FMjMEiXq1ttTYKXETrf-wBQlU4g',
            serviceUrl: config.serviceUrl || 'https://eu-de.ml.cloud.ibm.com',
            projectId: config.projectId || '678c1792-7376-4f7e-bebb-5bb187ba32fd',
            model: config.model || 'meta-llama/llama-2-13b-chat',
            version: config.version || '2023-05-29',
            maxTokens: config.maxTokens || 512,
            temperature: config.temperature || 0.7,
            topP: config.topP || 0.95,
            repetitionPenalty: config.repetitionPenalty || 1.1,
            systemPrompt: config.systemPrompt || "You are a helpful AI assistant. Provide clear, concise, and accurate responses.",
            ...config
        };
        
        this.tokenCache = {};
        this.messages = []; // Conversation history
        this.isInitialized = false;
        
        // Add system message if provided
        if (this.config.systemPrompt) {
            this.messages.push({
                role: 'system',
                content: this.config.systemPrompt,
                timestamp: Date.now()
            });
        }
    }

    /**
     * Initialize the chat client (optional - called automatically on first use)
     */
    async initialize() {
        if (this.isInitialized) return;
        
        try {
            await this.getToken(); // Test token generation
            this.isInitialized = true;
            return { success: true, message: 'Chat client initialized successfully' };
        } catch (error) {
            throw new Error(`Failed to initialize chat client: ${error.message}`);
        }
    }

    /**
     * Send a message and get response
     */
    async sendMessage(userMessage) {
        try {
            if (!this.isInitialized) {
                await this.initialize();
            }

            // Add user message to conversation
            const userMsg = {
                role: 'user',
                content: userMessage,
                timestamp: Date.now()
            };
            this.messages.push(userMsg);

            // Generate response
            const prompt = this.formatMessagesAsPrompt(this.messages);
            const response = await this.generateText(prompt);

            // Add assistant response to conversation
            const assistantMsg = {
                role: 'assistant',
                content: response.text,
                timestamp: Date.now()
            };
            this.messages.push(assistantMsg);

            return {
                success: true,
                message: response.text,
                messageId: assistantMsg.timestamp,
                usage: {
                    inputTokens: response.input_token_count,
                    outputTokens: response.generated_token_count,
                    totalTokens: response.input_token_count + response.generated_token_count
                },
                conversationLength: this.getConversationLength()
            };

        } catch (error) {
            return {
                success: false,
                error: error.message,
                message: null
            };
        }
    }

    /**
     * Send multiple messages in sequence
     */
    async sendMessages(messages) {
        const responses = [];
        
        for (const message of messages) {
            const response = await this.sendMessage(message);
            responses.push(response);
            
            // If any message fails, stop processing
            if (!response.success) {
                break;
            }
        }
        
        return responses;
    }

    /**
     * Get conversation history
     */
    getConversation() {
        return this.messages.filter(msg => msg.role !== 'system').map(msg => ({
            role: msg.role,
            content: msg.content,
            timestamp: msg.timestamp,
            time: new Date(msg.timestamp).toLocaleTimeString()
        }));
    }

    /**
     * Get conversation length (excluding system messages)
     */
    getConversationLength() {
        return this.messages.filter(msg => msg.role !== 'system').length;
    }

    /**
     * Clear conversation history (keeps system prompt)
     */
    clearConversation() {
        const systemMessages = this.messages.filter(msg => msg.role === 'system');
        this.messages = systemMessages;
        return { success: true, message: 'Conversation cleared' };
    }

    /**
     * Update system prompt
     */
    setSystemPrompt(newPrompt) {
        // Remove old system messages
        this.messages = this.messages.filter(msg => msg.role !== 'system');
        
        // Add new system message
        if (newPrompt) {
            this.messages.unshift({
                role: 'system',
                content: newPrompt,
                timestamp: Date.now()
            });
        }
        
        this.config.systemPrompt = newPrompt;
        return { success: true, message: 'System prompt updated' };
    }

    /**
     * Update model configuration
     */
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        return { success: true, message: 'Configuration updated' };
    }

    /**
     * Get current configuration (excluding sensitive data)
     */
    getConfig() {
        const { apikey, ...safeConfig } = this.config;
        return {
            ...safeConfig,
            apikey: apikey ? '***hidden***' : 'not set'
        };
    }

    /**
     * Export conversation as JSON
     */
    exportConversation() {
        return {
            config: this.getConfig(),
            messages: this.getConversation(),
            exportTime: new Date().toISOString()
        };
    }

    /**
     * Import conversation from JSON
     */
    importConversation(data) {
        try {
            if (data.messages && Array.isArray(data.messages)) {
                // Keep system prompt, add imported messages
                const systemMessages = this.messages.filter(msg => msg.role === 'system');
                this.messages = [
                    ...systemMessages,
                    ...data.messages.map(msg => ({
                        ...msg,
                        timestamp: msg.timestamp || Date.now()
                    }))
                ];
                return { success: true, message: 'Conversation imported successfully' };
            } else {
                throw new Error('Invalid conversation data format');
            }
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // --- Internal Methods ---

    /**
     * Get IBM Cloud IAM token
     */
    async getToken() {
        const cachedToken = this.tokenCache.access_token;
        const expiry = this.tokenCache.expires_at || 0;
        const now = Date.now() / 1000;
        
        if (cachedToken && now < expiry - 60) {
            return cachedToken;
        }

        const formData = new URLSearchParams();
        formData.append('grant_type', 'urn:ibm:params:oauth:grant-type:apikey');
        formData.append('apikey', this.config.apikey);

        const response = await fetch('https://iam.cloud.ibm.com/identity/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: formData
        });

        if (!response.ok) {
            throw new Error(`Token request failed: ${response.status}`);
        }

        const payload = await response.json();
        this.tokenCache = {
            access_token: payload.access_token,
            expires_at: now + (payload.expires_in || 3600)
        };
        
        return payload.access_token;
    }

    /**
     * Format messages into a prompt for text generation
     */
    formatMessagesAsPrompt(messages) {
        const lines = [];
        
        for (const message of messages) {
            if (message.role === 'system') {
                lines.push(message.content);
            } else if (message.role === 'user') {
                lines.push(`Human: ${message.content}`);
            } else if (message.role === 'assistant') {
                lines.push(`Assistant: ${message.content}`);
            }
        }
        
        // Ensure we end with Assistant: to get a response
        if (!lines[lines.length - 1].startsWith('Assistant:')) {
            lines.push('Assistant:');
        }
        
        return lines.join('\n');
    }

    /**
     * Generate text using watsonx.ai API
     */
    async generateText(prompt) {
        const token = await this.getToken();
        
        const payload = {
            input: prompt,
            parameters: {
                max_new_tokens: this.config.maxTokens,
                temperature: this.config.temperature,
                top_p: this.config.topP,
                repetition_penalty: this.config.repetitionPenalty
            },
            model_id: this.config.model,
            project_id: this.config.projectId
        };

        const url = `${this.config.serviceUrl}/ml/v1/text/generation?version=${this.config.version}`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Generation failed (${response.status}): ${errorText}`);
        }

        const data = await response.json();
        
        if (data.results && data.results.length > 0) {
            const result = data.results[0];
            return {
                text: result.generated_text.trim(),
                input_token_count: result.input_token_count || 0,
                generated_token_count: result.generated_token_count || 0,
                stop_reason: result.stop_reason
            };
        } else {
            throw new Error('No results in response');
        }
    }
}

// Export the class
module.exports = WatsonxChat;

// Example usage when run directly
if (require.main === module) {
    async function demo() {
        console.log('🚀 WatsonxChat Module Demo\n');
        
        // Create chat instance
        const chat = new WatsonxChat({
            systemPrompt: "You are a helpful coding assistant. Keep responses concise but informative."
        });
        
        console.log('📋 Configuration:', chat.getConfig());
        console.log('');
        
        try {
            // Initialize
            await chat.initialize();
            console.log('✅ Chat initialized successfully\n');
            
            // Send some messages
            const messages = [
                "Hello! What is JavaScript?",
                "Can you give me a simple example?",
                "What about async/await?",
                "Thank you!"
            ];
            
            for (const message of messages) {
                console.log(`👤 User: ${message}`);
                const response = await chat.sendMessage(message);
                
                if (response.success) {
                    console.log(`🤖 Assistant: ${response.message}`);
                    console.log(`📊 Tokens: ${response.usage.totalTokens} total\n`);
                } else {
                    console.log(`❌ Error: ${response.error}\n`);
                }
            }
            
            // Show conversation summary
            console.log('📝 Conversation Summary:');
            console.log(`- Total exchanges: ${chat.getConversationLength()}`);
            console.log(`- Export data available: ${JSON.stringify(chat.exportConversation()).length} characters`);
            
        } catch (error) {
            console.error('❌ Demo failed:', error.message);
        }
    }
    
    demo();
}
