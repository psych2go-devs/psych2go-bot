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

  if (!process.env.DISABLE_CONTENT_FEED) {
    if (!process.env.NEW_CONTENT_CHANNEL_ID) {
      console.error("`NEW_CONTENT_CHANNEL_ID` environment variable is not defined");
      process.exit(1);
    }
    if (!process.env.HUB_CALLBACK_URL) {
      console.error("`HUB_CALLBACK_URL` environment variable is not defined");
      process.exit(1);
    }
    if (!process.env.PUBSUBHUBBUB_SECRET) {
      console.error("`PUBSUBHUBBUB_SECRET` environment variable is not defined");
      process.exit(1);
    }
  }

  if (process.env.ENABLE_ASSIST_COMMAND) {
    if (!process.env.GENERAL_CHANNEL_ID) {
      console.error("`GENERAL_CHANNEL_ID` environment variable is not defined");
      process.exit(1);
    }
  }

  process.env.COMMAND_PREFIX = process.env.COMMAND_PREFIX || defaultMessageCommandPrefix;
  process.env.CANDY_REACTION = process.env.CANDY_REACTION || "";
  process.env.TRANSFORMERS_SERVER_ADDRESS = process.env.TRANSFORMERS_SERVER_ADDRESS || "";
};
