import axios from "axios";

interface YouTubePageInfo {
  totalResults: number;
  resultsPerPage: number;
}

interface YouTubeChannelStatistics {
  viewCount: string;
  subscriberCount: string;
  hiddenSubscriberCount: boolean;
  videoCount: string;
}

interface YouTubeChannelResult {
  kind: string;
  etag: string;
  id: string;
  statistics: YouTubeChannelStatistics;
}

interface YouTubeChannelListResponse {
  kind: string;
  etag: string;
  pageInfo: YouTubePageInfo;
  items: YouTubeChannelResult[];
}

export default async function (): Promise<
  undefined | YouTubeChannelListResponse
> {
  // Only fetch subscribers if `GCP_API_KEY` environment variable is defined
  if (process.env.GCP_API_KEY) {
    return (
      await axios.get<YouTubeChannelListResponse>(
        "https://www.googleapis.com/youtube/v3/channels",
        {
          params: {
            part: "statistics",
            id: "UCkJEpR7JmS36tajD34Gp4VA", // Psych2Go Channel ID
            key: process.env.GCP_API_KEY
          }
        }
      )
    ).data;
  }
}
