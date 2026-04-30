import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../../services/chat.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent {

  userInput: string = '';
  loading: boolean = false;
  hasText: boolean = false;
  geminiHistory: {role: string, parts: {text: string}[]}[] = [];


  messages: { role: string, content: string }[] = [
    {
      role: 'bot',
      content: 'Xin chào! Mình là TravelGo AI, mình có thể giúp gì cho bạn không?'
    }
  ];

  constructor(private chatService: ChatService) {}

  onTyping() {
    this.hasText = this.userInput.length > 0;
  }

  formatText(text: string): string {
    if (!text) return '';
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\n/g, '<br>');
  }

  send() {
    const msg = this.userInput.trim();
    if (!msg) return;

    this.messages.push({ role: 'user', content: msg });
    this.userInput = '';
    this.hasText = false;
    this.loading = true;

    this.chatService.sendMessage(msg, this.geminiHistory).subscribe({
      next: (res: any) => {
        const botReply = typeof res === 'string' ? res : res?.message;

        this.geminiHistory.push(
          { role: 'user', parts: [{ text: msg }] },
          { role: 'model', parts: [{ text: botReply }] }
        );

        this.messages.push({ role: 'bot', content: botReply });
        this.loading = false;
      },
      error: () => {
        this.messages.push({ role: 'bot', content: 'Lỗi server 😢' });
        this.loading = false;
      }
    });
  }
}
