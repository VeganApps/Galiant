/**
 * IBM watsonx.ai Chat Module - React Native Compatible
 * A clean, reusable chat client for multi-message conversations
 */

interface WatsonConfig {
  apikey?: string;
  serviceUrl?: string;
  projectId?: string;
  model?: string;
  version?: string;
  maxTokens?: number;
  temperature?: number;
  topP?: number;
  repetitionPenalty?: number;
  systemPrompt?: string;
  contextWindowSize?: number; // Maximum number of recent messages to include in context
}

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface ChatResponse {
  success: boolean;
  message?: string;
  messageId?: number;
  usage?: {
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
  };
  conversationLength?: number;
  error?: string;
}

interface TokenCache {
  access_token?: string;
  expires_at?: number;
}

class WatsonxChat {
  private config: Required<WatsonConfig>;
  private tokenCache: TokenCache = {};
  private messages: ChatMessage[] = [];
  private isInitialized = false;

  constructor(config: WatsonConfig = {}) {
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
      systemPrompt: config.systemPrompt || "You are Galiant, a helpful AI finance assistant. You help users take control of their finances, create budgets, set financial goals, and provide personalized financial advice. Be friendly, encouraging, and use emojis appropriately to make financial planning fun and engaging.",
      contextWindowSize: config.contextWindowSize || 10, // Keep last 10 messages (5 user + 5 assistant pairs)
      ...config
    };

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
  async initialize(): Promise<{ success: boolean; message: string }> {
    if (this.isInitialized) return { success: true, message: 'Already initialized' };

    try {
      await this.getToken(); // Test token generation
      this.isInitialized = true;
      return { success: true, message: 'Chat client initialized successfully' };
    } catch (error) {
      throw new Error(`Failed to initialize chat client: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Send a message and get response
   */
  async sendMessage(userMessage: string): Promise<ChatResponse> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      // Add user message to conversation
      const userMsg: ChatMessage = {
        role: 'user',
        content: userMessage,
        timestamp: Date.now()
      };
      this.messages.push(userMsg);

      // Generate response using only relevant context window
      const contextMessages = this.getRelevantContext();
      const prompt = this.formatMessagesAsPrompt(contextMessages);
      const response = await this.generateText(prompt);

      // Add assistant response to conversation
      const assistantMsg: ChatMessage = {
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
        error: error instanceof Error ? error.message : 'Unknown error',
        message: undefined
      };
    }
  }

  /**
   * Get relevant context window for API calls (system prompt + recent messages)
   */
  private getRelevantContext(): ChatMessage[] {
    const systemMessages = this.messages.filter(msg => msg.role === 'system');
    const conversationMessages = this.messages.filter(msg => msg.role !== 'system');
    
    // Get the most recent messages within the context window
    const recentMessages = conversationMessages.slice(-this.config.contextWindowSize);
    
    // Always include system messages + recent conversation
    return [...systemMessages, ...recentMessages];
  }

  /**
   * Get conversation history
   */
  getConversation(): Array<{ role: string; content: string; timestamp: number; time: string }> {
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
  getConversationLength(): number {
    return this.messages.filter(msg => msg.role !== 'system').length;
  }

  /**
   * Clear conversation history (keeps system prompt)
   */
  clearConversation(): { success: boolean; message: string } {
    const systemMessages = this.messages.filter(msg => msg.role === 'system');
    this.messages = systemMessages;
    return { success: true, message: 'Conversation cleared' };
  }

  /**
   * Update system prompt
   */
  setSystemPrompt(newPrompt: string): { success: boolean; message: string } {
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
   * Get context window statistics for debugging
   */
  getContextStats(): { 
    totalMessages: number; 
    contextWindowSize: number; 
    messagesInContext: number;
    systemMessages: number;
  } {
    const contextMessages = this.getRelevantContext();
    return {
      totalMessages: this.messages.length,
      contextWindowSize: this.config.contextWindowSize,
      messagesInContext: contextMessages.length,
      systemMessages: this.messages.filter(msg => msg.role === 'system').length
    };
  }

  // --- Internal Methods ---

  /**
   * Get IBM Cloud IAM token
   */
  private async getToken(): Promise<string> {
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
      body: formData.toString()
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
  private formatMessagesAsPrompt(messages: ChatMessage[]): string {
    const lines: string[] = [];

    for (const message of messages) {
      if (message.role === 'system') {
        // Format system messages as assistant context, not user context
        lines.push(`Assistant: ${message.content}`);
      } else if (message.role === 'user') {
        lines.push(`Human: ${message.content}`);
      } else if (message.role === 'assistant') {
        lines.push(`Assistant: ${message.content}`);
      }
    }

    // Ensure we end with Assistant: to get a response
    if (!lines[lines.length - 1]?.startsWith('Assistant:')) {
      lines.push('Assistant:');
    }

    return lines.join('\n');
  }

  /**
   * Generate text using watsonx.ai API
   */
  private async generateText(prompt: string): Promise<{
    text: string;
    input_token_count: number;
    generated_token_count: number;
    stop_reason?: string;
  }> {
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

export default WatsonxChat;
