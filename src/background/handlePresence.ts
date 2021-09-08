import { Client } from "discord.js";
import getChannelStatistics from "../lib/getChannelStatistics";

export const setPresence = async (client: Client) => {
  let channelStatistics = await getChannelStatistics();

  client.user?.setPresence({
    activities: [
      {
        name: `${channelStatistics?.items[0].statistics.videoCount} videos uploaded!`
      }
    ]
  });
};

export default (client: Client) => {
  // Only set presence if `GCP_API_KEY` environment variable is defined
  if (process.env.GCP_API_KEY) {
    setPresence(client);
    let presenceHandler = setInterval(setPresence, 60e3 * 30, client); // Every 30 minutes
    presenceHandler.unref();
  }
};
