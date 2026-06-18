import { Body, Controller, Get, Post } from '@nestjs/common';
import { ChatService } from './chat.service';

interface ChatRequest {
  message: string;
}

@Controller()
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  /**
   * Health check endpoint for the backend.
   */
  @Get()
  getRoot() {
    return 'EduChat backend is running';
  }

  /**
   * Receives a user message and returns the assistant reply.
   */
  @Post('chat')
  async postChat(@Body() body: ChatRequest) {
    const reply = await this.chatService.generateReply(body.message);

    return { reply };
  }

  /**
   * Returns metadata displayed on the About page.
   */
  @Get('about')
  getAbout() {
    return {
      name: 'EduChat',
      description: 'AI assistant for learning and education.',
      technologies: ['Next.js', 'NestJS', 'Hugging Face', 'WebSocket'],
    };
  }
}
