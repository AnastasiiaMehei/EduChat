import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class ChatService {
  private readonly client = new OpenAI({
    baseURL: 'https://router.huggingface.co/v1',
    apiKey: process.env.HUGGINGFACE_API_TOKEN,
  });

  private readonly model =
    process.env.HUGGINGFACE_MODEL || 'openai/gpt-oss-120b:fastest';

  /**
   * Generates a response for a user message using the configured AI provider.
   */
  async generateReply(message: string) {
    try {
      const completion = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content:
              'You are EduChat, a helpful tutor. Explain clearly and simply, with examples when useful.',
          },
          {
            role: 'user',
            content: message,
          },
        ],
      });

      return {
        text: completion.choices[0]?.message?.content || 'No response',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      const messageText =
        error instanceof Error ? error.message : 'Unknown error';

      const details =
        error && typeof error === 'object' && 'error' in error
          ? error.error
          : null;

      const permissionHint =
        typeof details === 'string' && details.includes('permissions')
          ? ' Create a new fine-grained Hugging Face token at https://huggingface.co/settings/tokens/new with the "Make calls to Inference Providers" permission.'
          : '';

      return {
        text: `Hugging Face request failed: ${messageText}${permissionHint}`,
        timestamp: new Date().toISOString(),
        errorDetails: details,
      };
    }
  }
}
