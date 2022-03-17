import { Client, NewsChannel, TextChannel } from "discord.js";
import Notifier from "youtube-notify";
import loadEnv from "../lib/loadEnv";

loadEnv();

export let youtubeNotifier = new Notifier({
  hubCallback: process.env.HUB_CALLBACK_URL as string,
  port: parseInt(process.env.PORT as string),
  secret: process.env.PUBSUBHUBBUB_SECRET,
  path: "/youtube"
});

export default (client: Client) => {
  let channel = client.guilds.cache
    .get(process.env.GUILD_ID as string)
    ?.channels.cache.get(process.env.NEW_CONTENT_CHANNEL_ID as string);

  if (channel instanceof TextChannel || channel instanceof NewsChannel) {
    youtubeNotifier.setup();
    youtubeNotifier.on("notified", (data) => {
      let videoUrl = "https://youtu.be/" + data.video.link.split("v=")[1].split("&")[0];

      (channel as TextChannel).send(`Hey guys, check out our new video!\n${videoUrl}`);
    });
  }

  youtubeNotifier.subscribe(process.env.YOUTUBE_CHANNEL_ID as string);
};
