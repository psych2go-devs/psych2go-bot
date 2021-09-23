export interface YouTubePageInfo {
  totalResults: number;
  resultsPerPage: number;
}

export interface YouTubeChannelStatistics {
  viewCount: string;
  subscriberCount: string;
  hiddenSubscriberCount: boolean;
  videoCount: string;
}

export interface YouTubeChannelResult {
  kind: string;
  etag: string;
  id: string;
  statistics: YouTubeChannelStatistics;
}

export interface YouTubeChannelListResponse {
  kind: string;
  etag: string;
  pageInfo: YouTubePageInfo;
  items: YouTubeChannelResult[];
}

export interface YouTubeSearchListResult {
  kind: string;
  videoId: string;
}

export interface YouTubeSearchResult {
  kind: string;
  etag: string;
  id: YouTubeSearchListResult;
}

export interface YouTubeSearchResponse {
  kind: string;
  etag: string;
  regionCode: string;
  pageInfo: YouTubePageInfo;
  items: YouTubeSearchResult[];
}
