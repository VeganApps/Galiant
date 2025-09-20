// Configuration constants and utilities
export const AVAILABLE_MODELS = [
    "meta-llama/llama-2-13b-chat"
];

/**
 * Sanitizes and validates parameters for Watson API
 * @param {Object} params - Raw parameters object
 * @returns {Object} Sanitized parameters
 */
function sanitizeParams(params: any = {}) {
    const sanitized: any = {};
    
    // Common parameters with validation
    if (params.max_new_tokens !== undefined) {
        sanitized.max_new_tokens = Math.max(1, Math.min(4096, parseInt(params.max_new_tokens) || 256));
    }
    if (params.temperature !== undefined) {
        sanitized.temperature = Math.max(0, Math.min(2, parseFloat(params.temperature) || 0.7));
    }
    if (params.top_p !== undefined) {
        sanitized.top_p = Math.max(0, Math.min(1, parseFloat(params.top_p) || 1));
    }
    if (params.top_k !== undefined) {
        sanitized.top_k = Math.max(1, parseInt(params.top_k) || 50);
    }
    if (params.repetition_penalty !== undefined) {
        sanitized.repetition_penalty = Math.max(1, Math.min(2, parseFloat(params.repetition_penalty) || 1));
    }
    if (params.stop_sequences !== undefined && Array.isArray(params.stop_sequences)) {
        sanitized.stop_sequences = params.stop_sequences.slice(0, 5); // Limit to 5 sequences
    }
    
    return sanitized;
}

/**
 * Collects system messages from the message history
 * @param {Array} messages - Array of message objects
 * @returns {Array} Array of system message contents
 */
function collectSystemMessages(messages: any[]) {
    return messages
        .filter(item => item.role === 'system' && item.content)
        .map(item => item.content.trim());
}

/**
 * Formats message history into a prompt string
 * @param {Array} messages - Array of message objects
 * @returns {string} Formatted prompt string
 */
function formatHistory(messages: any[]) {
    const lines = [];
    const systemPrompts = collectSystemMessages(messages);
    
    if (systemPrompts.length > 0) {
        lines.push(systemPrompts.join('\n'));
    }

    for (const message of messages) {
        const role = message.role;
        let content = '';
        
        // Handle different content formats
        if (typeof message.content === 'string') {
            content = message.content.trim();
        } else if (Array.isArray(message.content)) {
            // Handle array content (from convertToModelMessages)
            content = message.content
                .filter((part: any) => part.type === 'text')
                .map((part: any) => part.text)
                .join(' ')
                .trim();
        } else if (message.content && typeof message.content === 'object' && message.content.text) {
            content = message.content.text.trim();
        }
        
        if (!content || role === 'system') {
            continue;
        }
        
        const prefix = role === 'user' ? 'User' : 'Assistant';
        lines.push(`${prefix}: ${content}`);
    }

    if (lines.length === 0 || !lines[lines.length - 1].startsWith('Assistant:')) {
        lines.push('Assistant:');
    }
    
    return lines.join('\n');
}

export interface WatsonXConfig {
    apikey: string;
    url: string;
    project_id?: string;
    space_id?: string;
    model_id: string;
    params?: any;
}

export interface ChatMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

/**
 * Watson X AI Client for JavaScript/Node.js
 */
export class WatsonXClient {
    static IAM_TOKEN_URL = 'https://iam.cloud.ibm.com/identity/token';
    static GENERATION_VERSION = '2023-05-29';

    private config: WatsonXConfig;
    private params: any;
    private _mode = 'rest'; // JavaScript version uses REST API only
    private _client = null;
    private _model = null;
    private _tokenCache: { access_token?: string; expires_at?: number } = {};

    constructor(config: WatsonXConfig) {
        this.config = config;
        this.params = sanitizeParams(config.params || {});
    }

    /**
     * Send chat messages and get response
     * @param {Array} messages - Array of message objects with role and content
     * @returns {Promise<string>} Generated response text
     */
    async chat(messages: ChatMessage[]): Promise<string> {
        if (!this.config.apikey) {
            throw new Error('Fehlender API-Key. Hinterlege einen API-Key auf der Konfigurationsseite.');
        }
        if (!this.config.url) {
            throw new Error('Fehlende Service-URL. Hinterlege eine URL auf der Konfigurationsseite.');
        }

        return await this._chatViaRest(messages);
    }

    /**
     * Chat via REST API
     * @param {Array} messages - Message history
     * @returns {Promise<string>} Response text
     */
    private async _chatViaRest(messages: ChatMessage[]): Promise<string> {
        console.log('🔄 Watson X: Formatting messages to prompt...');
        const prompt = formatHistory(messages);
        console.log('📝 Watson X: Generated prompt:', prompt.substring(0, 200) + '...');
        const payload: any = {
            input: prompt,
            parameters: this.params,
            model_id: this.config.model_id
        };

        if (this.config.project_id) {
            payload.project_id = this.config.project_id;
        }
        if (this.config.space_id) {
            payload.space_id = this.config.space_id;
        }

        console.log('🔑 Watson X: Getting authentication token...');
        const token = await this._getToken();
        console.log('✅ Watson X: Token obtained successfully');
        
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };

        const endpoint = this._buildGenerationEndpoint();
        const url = new URL(endpoint);
        url.searchParams.set('version', WatsonXClient.GENERATION_VERSION);

        try {
            console.log('🌐 Watson X: Making API request to:', url.toString());
            console.log('📦 Watson X: Payload:', JSON.stringify(payload, null, 2));
            
            const response = await fetch(url.toString(), {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(payload),
                signal: AbortSignal.timeout(60000) // 60 second timeout
            });

            console.log('📡 Watson X: Response status:', response.status);
            
            if (!response.ok) {
                console.error('❌ Watson X: API error, status:', response.status);
                const message = await this._formatHttpError(response);
                throw new Error(message);
            }

            const data = await response.json();
            console.log('📄 Watson X: Response data:', JSON.stringify(data, null, 2));
            
            const extractedText = this._extractText(data);
            console.log('✨ Watson X: Extracted text:', extractedText);
            
            return extractedText;
        } catch (error: any) {
            if (error.name === 'TimeoutError') {
                throw new Error('Request timeout - Watson API did not respond within 60 seconds');
            }
            throw error;
        }
    }

    /**
     * Extract text from API response
     * @param {any} response - API response
     * @returns {string} Extracted text
     */
    private _extractText(response: any): string {
        if (response == null) {
            return '';
        }
        if (typeof response === 'string') {
            return response;
        }
        if (typeof response === 'object' && response.results) {
            const results = response.results;
            if (Array.isArray(results) && results.length > 0) {
                const generated = results[0].generated_text || '';
                return generated.trim();
            }
        }
        return String(response);
    }

    /**
     * Format HTTP error response
     * @param {Response} response - Fetch response object
     * @returns {Promise<string>} Formatted error message
     */
    private async _formatHttpError(response: Response): Promise<string> {
        const status = response.status;
        let details;
        
        try {
            details = await response.json();
        } catch {
            const text = await response.text();
            return `IBM watsonx API-Fehler (${status}): ${text}`;
        }

        if (typeof details === 'object' && details.errors) {
            const errors = details.errors;
            if (Array.isArray(errors) && errors.length > 0) {
                const primary = errors[0];
                const code = primary.code;
                const message = primary.message;
                
                if (code === 'model_not_supported') {
                    const modelId = this.config.model_id || 'unbekannt';
                    const suggestions = AVAILABLE_MODELS.filter(m => m !== modelId);
                    const suggestionText = suggestions.length > 0 
                        ? suggestions.join(', ') 
                        : '+ weiteres Modell aus deiner watsonx-Konsole wählen';
                    
                    return (
                        'IBM watsonx API-Fehler (404, model_not_supported): ' +
                        `Das Modell '${modelId}' ist für deinen Account nicht freigeschaltet. ` +
                        `Wähle auf der Seite ›API Config‹ ein unterstütztes Modell (z.‍B. ${suggestionText}).`
                    );
                }
                
                if (code === 'no_associated_service_instance_error') {
                    return (
                        'IBM watsonx API-Fehler (403, no_associated_service_instance_error): ' +
                        'Deine `project_id` oder `space_id` ist keinem aktiven watsonx.ai/WML-Service zugeordnet. ' +
                        'Prüfe die Angaben auf der Seite ›API Config‹.'
                    );
                }
                
                if (message) {
                    return `IBM watsonx API-Fehler (${status}, ${code}): ${message}`;
                }
            }
        }
        
        return `IBM watsonx API-Fehler (${status}): ${JSON.stringify(details)}`;
    }

    /**
     * Build generation endpoint URL
     * @returns {string} Endpoint URL
     */
    private _buildGenerationEndpoint(): string {
        const baseUrl = (this.config.url || '').replace(/\/$/, '');
        if (!baseUrl) {
            throw new Error('Ungültige Service-URL.');
        }
        return `${baseUrl}/ml/v1/text/generation`;
    }

    /**
     * Get IBM Cloud IAM token
     * @returns {Promise<string>} Access token
     */
    private async _getToken(): Promise<string> {
        const cachedToken = this._tokenCache.access_token;
        const expiry = this._tokenCache.expires_at || 0;
        const now = Date.now() / 1000; // Convert to seconds
        
        if (cachedToken && now < expiry - 60) {
            return cachedToken;
        }

        const formData = new URLSearchParams();
        formData.append('grant_type', 'urn:ibm:params:oauth:grant-type:apikey');
        formData.append('apikey', this.config.apikey);

        try {
            const response = await fetch(WatsonXClient.IAM_TOKEN_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formData,
                signal: AbortSignal.timeout(30000) // 30 second timeout
            });

            if (!response.ok) {
                throw new Error(`Token request failed: ${response.status} ${response.statusText}`);
            }

            const payload = await response.json();
            const accessToken = payload.access_token;
            const expiresIn = payload.expires_in || 3600;
            
            this._tokenCache = {
                access_token: accessToken,
                expires_at: now + parseFloat(expiresIn),
            };
            
            return accessToken;
        } catch (error: any) {
            if (error.name === 'TimeoutError') {
                throw new Error('Token request timeout - IBM Cloud IAM did not respond within 30 seconds');
            }
            throw error;
        }
    }
}

export { collectSystemMessages, formatHistory, sanitizeParams };

