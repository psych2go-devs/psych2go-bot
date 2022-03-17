import defaultMessageCommandPrefix from "./defaultMessageCommandPrefix";

export default () => {
  if (!process.env.BOT_TOKEN) {
    console.error("`BOT_TOKEN` environment variable is not defined");
    process.exit(1);
  }
  if (!process.env.GUILD_ID) {
    console.error("`GUILD_ID` environment variable is not defined");
    process.exit(1);
  }
  if (!process.env.YOUTUBE_CHANNEL_ID) {
    console.error("`YOUTUBE_CHANNEL_ID` environment variable is not defined");
    process.exit(1);
  }
  if (!process.env.NEW_CONTENT_CHANNEL_ID) {
    console.error("`NEW_CONTENT_CHANNEL_ID` environment variable is not defined");
    process.exit(1);
  }
  if (!process.env.HUB_CALLBACK_URL) {
    console.error("`HUB_CALLBACK_URL` environment variable is not defined");
    process.exit(1);
  }

  process.env.COMMAND_PREFIX = process.env.COMMAND_PREFIX || defaultMessageCommandPrefix;
};
