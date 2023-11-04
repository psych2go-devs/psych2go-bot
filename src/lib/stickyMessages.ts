import jsonStickyMessages from "../asset/sticky-messages.json";

export const stickyMessages = new Map<string, string>();

for (let channelId of Object.keys(jsonStickyMessages)) {
  let message: string = (jsonStickyMessages as any)[channelId];
  stickyMessages.set(channelId, message);
}
