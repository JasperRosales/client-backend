import { sendMessageToGemini } from '../services/text-generation.service.js';

export const chatWithGemini = async (req, res) => {
  try {
    const { message, history } = req.body;
    const userId = req.user?.id || req.user?.userId;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Message is required',
      });
    }

    const result = await sendMessageToGemini(message, history || []);

    if (result.success) {
      return res.status(200).json({
        success: true,
        data: {
          response: result.response,
          userId: userId,
        },
      });
    } else {
      return res.status(500).json({
        success: false,
        message: 'Failed to generate response',
        error: result.error,
      });
    }
  } catch (error) {
    console.error('Chat controller error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

