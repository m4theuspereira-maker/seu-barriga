import {
  PRIVATE_CHAT_TELEGRAM_ID,
  TELEGRAM_API
} from "../common/environment-consts";
import { HttpClient } from "../config/client";

export class TelegramService {
  constructor(private readonly httpClient: HttpClient) {}

  async sendMessageToTelegramBot(textmessage: string) {
    try {
      await this.httpClient.post(`${TELEGRAM_API}/sendMessage`, {
        chat_id: PRIVATE_CHAT_TELEGRAM_ID,
        text: textmessage,
        disable_web_page_preview: true
      });
    } catch (error) {
      await this.sendMessageToTelegramBot(textmessage);
      throw error;
    }
  }
}
