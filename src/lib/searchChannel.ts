import axios from "axios";
import { YouTubeSearchResponse } from "../interface/YouTube";

export default async function (query: string): Promise<undefined | YouTubeSearchResponse> {
  // Only fetch subscribers if `GCP_API_KEY` environment variable is defined
  if (process.env.GCP_API_KEY) {
    return (
      await axios.get<YouTubeSearchResponse>("https://www.googleapis.com/youtube/v3/search", {
        params: {
          part: "id",
          channelId: "UCkJEpR7JmS36tajD34Gp4VA", // Psych2Go Channel ID
          type: "video",
          maxResults: "1",
          q: query,
          key: process.env.GCP_API_KEY
        }
      })
    ).data;
  }
}
