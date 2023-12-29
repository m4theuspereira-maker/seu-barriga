import {
  PRIVATE_CHAT_TELEGRAM_ID,
  TELEGRAM_API
} from "../common/environment-consts";
import { HttpClient } from "../config/client";
import { IDeliveryInformation } from "./interfaces/interfaces";

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

  formatMessage(deliveryInformation: IDeliveryInformation) {
    const houseType = !deliveryInformation.houseType
      ? ""
      : deliveryInformation.houseType;
    const additionalInformation = !deliveryInformation.additionalInformation
      ? ""
      : deliveryInformation.additionalInformation;

    return `
🛍️ **Nova Compra Realizada** 🛍️

ℹ️ **Detalhes da Compra:**

🗣️ Para: ${deliveryInformation.firstName} ${deliveryInformation.lastName},
📦 Produtos: ${deliveryInformation.products?.toString()}
🌎 País: ${deliveryInformation.country}
🏡 Estado: ${deliveryInformation.state}
🏙️ Cidade: ${deliveryInformation.city}
📬 ZipCode: ${deliveryInformation.zipCode}
📞 Telefone: ${deliveryInformation.phone}
📧 E-mail: ${deliveryInformation.emailAddress}
🛣️ Rua e número: ${deliveryInformation.streetHouseNumber}
🏘️ Tipo de residência: ${houseType}
🗞️ Informações Adicionais: ${additionalInformation}
    `;
  }
}
