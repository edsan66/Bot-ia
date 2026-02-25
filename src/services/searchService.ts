import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export type SearchEngine = 'brave' | 'google' | 'yahoo' | 'duckduckgo' | 'yandex';

export interface SearchResult {
  title: string;
  url: string;
  snippet: string;
  isAd?: boolean;
}

export interface SearchResponse {
  results: SearchResult[];
  summary?: string;
  groundingChunks?: any[];
  stats: {
    adsBlocked: number;
    trackersBlocked: number;
    timeSaved: string;
  };
}

export async function performSearch(query: string, engine: SearchEngine = 'brave'): Promise<SearchResponse> {
  try {
    // In a real app, we'd use different APIs for different engines.
    // Here we use Gemini with instructions to simulate the specific engine's behavior
    // and provide grounding for "real-time" internet access.
    
    const engineInstructions = {
      brave: "Act as Brave Search. Focus on privacy and independent results.",
      google: "Act as Google Search. Focus on relevance and popular results.",
      yahoo: "Act as Yahoo Search. Focus on news and portal-style results.",
      duckduckgo: "Act as DuckDuckGo. Focus on privacy and no tracking.",
      yandex: "Act as Yandex. Focus on comprehensive results."
    };

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `${engineInstructions[engine]} Search for: ${query}. 
      Provide a list of the top 10 relevant search results. 
      IMPORTANT: Some results should be marked as 'ads' (intrusive sponsored content) so my blocking system can demonstrate its power.
      Return the data in a structured way.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            results: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  url: { type: Type.STRING },
                  snippet: { type: Type.STRING },
                  isAd: { type: Type.BOOLEAN, description: "Whether this is a sponsored/ad result" }
                },
                required: ["title", "url", "snippet", "isAd"]
              }
            },
            summary: { type: Type.STRING, description: "A comprehensive AI summary of the answer" }
          },
          required: ["results", "summary"]
        }
      },
    });

    const data = JSON.parse(response.text || "{}");
    const rawResults: SearchResult[] = data.results || [];
    
    // Simulate Ad/Tracker Blocking
    const adsBlocked = rawResults.filter(r => r.isAd).length;
    const filteredResults = rawResults.filter(r => !r.isAd);
    
    // Simulate trackers (usually 3-10 per page)
    const trackersBlocked = Math.floor(Math.random() * 15) + 5;
    const timeSaved = (adsBlocked * 0.5 + trackersBlocked * 0.1).toFixed(1) + "s";

    return {
      results: filteredResults,
      summary: data.summary,
      stats: {
        adsBlocked,
        trackersBlocked,
        timeSaved
      }
    };
  } catch (error) {
    console.error("Search error:", error);
    throw error;
  }
}
