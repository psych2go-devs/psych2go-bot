import axios from "axios";
import { YouTubeChannelListResponse } from "../interface/YouTube";

export default async function (): Promise<undefined | YouTubeChannelListResponse> {
  // Only fetch subscribers if `GCP_API_KEY` environment variable is defined
  if (process.env.GCP_API_KEY) {
    return (
      await axios.get<YouTubeChannelListResponse>(
        "https://www.googleapis.com/youtube/v3/channels",
        {
          params: {
            part: "statistics",
            id: process.env.YOUTUBE_CHANNEL_ID,
            key: process.env.GCP_API_KEY
          }
        }
      )
    ).data;
  }
}
