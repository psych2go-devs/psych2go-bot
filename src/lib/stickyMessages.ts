import { ChannelType, DiscordAPIError, type Client } from "discord.js";
import jsonStickyMessages from "../asset/sticky-messages.json";

class StickyMessage {
  #channelId: string;
  #message: string;
  #sentId: string | undefined;

  constructor(channelId: string, message: string, sentId?: string) {
    this.#channelId = channelId;
    this.#message = message;
    this.#sentId = sentId;
  }

  public getChannelId() {
    return this.#channelId;
  }
  public getMessage() {
    return this.#message;
  }
  public getSentId() {
    return this.#sentId;
  }

  public setSentId(sentId: string) {
    this.#sentId = sentId;
  }

  public async send(client: Client) {
    let channel = client.channels.cache.get(this.#channelId);

    if (channel !== undefined && channel.type === ChannelType.GuildText) {
      if (this.#sentId !== undefined) channel.messages.delete(this.#sentId).catch(() => {});
      let sentStickyMessage = await channel.send(this.#message);
      this.setSentId(sentStickyMessage.id);
    }
  }
}

export const stickyMessages = new Map<string, StickyMessage>();

for (let channelId of Object.keys(jsonStickyMessages)) {
  let message: string = (jsonStickyMessages as any)[channelId];
  let stickyMessage = new StickyMessage(channelId, message);

  stickyMessages.set(channelId, stickyMessage);
}
