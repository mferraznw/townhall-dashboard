// API client for Townhall Insights Function App
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const FUNCTION_KEY = process.env.NEXT_PUBLIC_FUNCTION_KEY;

export interface ChatQuery {
  question: string;
  context?: string;
}

export interface ChatResponse {
  answer: string;
  data: any;
  sources: string[];
  confidence: number;
  intent?: string;
  parameters_used?: any;
}

export interface TrendData {
  window_start: string;
  window_end: string;
  trends: Array<{
    name: string;
    description: string;
    meetings_count: number;
    avg_sentiment: number;
    momentum: 'up' | 'down' | 'flat';
    novelty_score: number;
    support: Array<{
      meeting_id: string;
      ts: string;
    }>;
  }>;
}

export interface SpeakerData {
  results: Array<{
    speaker_id: string;
    display_name: string;
    department: string;
    region: string;
    country: string;
    mentions: number;
    avg_sentiment: number;
    exemplar_quotes: Array<{
      quote: string;
      meeting_id: string;
      ts: string;
    }>;
  }>;
}

export interface UtteranceData {
  items: Array<{
    utterance_id: string;
    meeting_id: string;
    speaker: string;
    department: string;
    region: string;
    country: string;
    start_ts: string;
    end_ts: string;
    sentiment_score: number;
    content: string;
    topics: string[];
    link_to_clip: string;
  }>;
  total_count: number;
  search_text: string;
  filters_applied: any;
  pagination: {
    top: number;
    skip: number;
    has_more: boolean;
  };
}

class ApiClient {
  private baseUrl: string;
  private accessToken: string | null = null;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  setAccessToken(token: string) {
    this.accessToken = token;
  }

  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    // Add function key to endpoint if it's not localhost
    let url = `${this.baseUrl}${endpoint}`;
    if (!this.baseUrl.includes('localhost')) {
      const separator = endpoint.includes('?') ? '&' : '?';
      url = `${url}${separator}code=${FUNCTION_KEY}`;
    }
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Add any existing headers
    if (options.headers) {
      Object.assign(headers, options.headers);
    }

    if (this.accessToken) {
      headers.Authorization = `Bearer ${this.accessToken}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        mode: 'cors',
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error('API request failed:', error);
      // Throw the error instead of returning mock data
      throw new Error(`API request failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }


  // Chat API
  async chatQuery(query: ChatQuery): Promise<ChatResponse> {
    return this.makeRequest<ChatResponse>('/chat/query', {
      method: 'POST',
      body: JSON.stringify(query),
    });
  }

  // Trends API
  async getTrends(params: Record<string, string> = {}): Promise<TrendData> {
    const searchParams = new URLSearchParams(params);
    const queryString = searchParams.toString();
    const endpoint = queryString ? `/insights/trends?${queryString}` : '/insights/trends';
    return this.makeRequest<TrendData>(endpoint);
  }

  // Speakers API
  async getSpeakers(params: Record<string, string> = {}): Promise<SpeakerData> {
    const searchParams = new URLSearchParams(params);
    const queryString = searchParams.toString();
    const endpoint = queryString ? `/insights/speakers?${queryString}` : '/insights/speakers';
    return this.makeRequest<SpeakerData>(endpoint);
  }

  // Utterances API
  async getUtterances(params: Record<string, string> = {}): Promise<UtteranceData> {
    const searchParams = new URLSearchParams(params);
    const queryString = searchParams.toString();
    const endpoint = queryString ? `/insights/utterances?${queryString}` : '/insights/utterances';
    return this.makeRequest<UtteranceData>(endpoint);
  }
}

export const apiClient = new ApiClient();
