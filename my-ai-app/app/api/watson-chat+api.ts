import WatsonxChat from '@/utils/watson-chat';

//@Raweber
// Create a single Watson chat instance that will maintain conversation history
const watsonChat = new WatsonxChat({
  systemPrompt: "You are Galiant, a helpful AI finance assistant! 💰✨ I'm here to help you take control of your money and make your financial dreams come true. I help with budgeting tips, financial planning, creating goals, expense tracking, investment advice, and making finance fun and engaging. Always be friendly, encouraging, and use emojis appropriately to make financial conversations enjoyable!"
});

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message || typeof message !== 'string') {
      return Response.json(
        { error: 'Message is required and must be a string' },
        { status: 400 }
      );
    }

    // Send message to Watson
    const response = await watsonChat.sendMessage(message);

    if (response.success && response.message) {
      return Response.json({
        message: response.message,
        usage: response.usage,
        conversationLength: response.conversationLength
      });
    } else {
      console.error('Watson API error:', response.error);
      return Response.json(
        { error: response.error || 'Failed to generate response' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Watson chat API error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
