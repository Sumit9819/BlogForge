import { Type } from "@google/genai";

export const ANALYSIS_SYSTEM_INSTRUCTION = "You are an elite SEO strategist and content editor. Your goal is to analyze content for high-competition keywords and provide actionable, data-driven improvements based on Google's E-E-A-T guidelines and modern NLP-based ranking factors.";

export const ANALYSIS_RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    rankScore: { type: Type.NUMBER },
    eeatScore: { type: Type.NUMBER },
    readabilityScore: { type: Type.NUMBER },
    humanScore: { type: Type.NUMBER },
    metaTitle: { type: Type.STRING },
    metaDescription: { type: Type.STRING },
    slug: { type: Type.STRING },
    internalLinks: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          anchorText: { type: Type.STRING },
          suggestedUrl: { type: Type.STRING },
          reason: { type: Type.STRING },
          priority: { type: Type.STRING, enum: ["High", "Supporting"] },
        },
        required: ["anchorText", "suggestedUrl", "reason", "priority"],
      },
    },
    evidence: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          type: { type: Type.STRING, enum: ["Quote", "Case Study", "Statistic"] },
          content: { type: Type.STRING },
          sourceName: { type: Type.STRING },
          sourceUrl: { type: Type.STRING },
          targetLocation: { type: Type.STRING },
        },
        required: ["type", "content", "sourceName", "sourceUrl", "targetLocation"],
      },
    },
    competitorAnalysis: {
      type: Type.OBJECT,
      properties: {
        topCompetitors: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              url: { type: Type.STRING },
            },
            required: ["title", "url"],
          },
        },
        contentGaps: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              topic: { type: Type.STRING },
              description: { type: Type.STRING },
            },
            required: ["topic", "description"],
          },
        },
        uniqueValue: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              point: { type: Type.STRING },
              impact: { type: Type.STRING },
            },
            required: ["point", "impact"],
          },
        },
      },
      required: ["topCompetitors", "contentGaps", "uniqueValue"],
    },
    contentAudit: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          originalParagraph: { type: Type.STRING },
          suggestedRewrite: { type: Type.STRING },
          issue: { type: Type.STRING },
          targetLocation: { type: Type.STRING },
          priority: { type: Type.STRING, enum: ["High", "Medium", "Low"] },
        },
        required: ["originalParagraph", "suggestedRewrite", "issue", "targetLocation", "priority"],
      },
    },
    lsiKeywords: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    userIntent: {
      type: Type.OBJECT,
      properties: {
        currentIntent: { type: Type.STRING },
        targetIntent: { type: Type.STRING },
        match: { type: Type.BOOLEAN },
        feedback: { type: Type.STRING },
      },
      required: ["currentIntent", "targetIntent", "match", "feedback"],
    },
    imageAltText: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          imageDescription: { type: Type.STRING },
          suggestedAltText: { type: Type.STRING },
        },
        required: ["imageDescription", "suggestedAltText"],
      },
    },
    entities: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          type: { type: Type.STRING },
          status: { type: Type.STRING, enum: ["Included", "Missing"] },
          relevance: { type: Type.STRING },
        },
        required: ["name", "type", "status", "relevance"],
      },
    },
    serpAnalysis: {
      type: Type.OBJECT,
      properties: {
        topResults: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              rank: { type: Type.NUMBER },
              title: { type: Type.STRING },
              snippet: { type: Type.STRING },
              url: { type: Type.STRING },
              features: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ["rank", "title", "snippet", "url", "features"],
          },
        },
        commonQuestions: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
      required: ["topResults", "commonQuestions"],
    },
    voiceAudit: {
      type: Type.OBJECT,
      properties: {
        score: { type: Type.NUMBER },
        feedback: { type: Type.STRING },
        roboticSentences: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              sentence: { type: Type.STRING },
              reason: { type: Type.STRING },
              suggestion: { type: Type.STRING },
            },
            required: ["sentence", "reason", "suggestion"],
          },
        },
      },
      required: ["score", "feedback", "roboticSentences"],
    },
    schemaMarkup: { type: Type.STRING },
    visuals: {
      type: Type.OBJECT,
      properties: {
        topicCoverage: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              topic: { type: Type.STRING },
              yourScore: { type: Type.NUMBER },
              competitorAvg: { type: Type.NUMBER },
            },
            required: ["topic", "yourScore", "competitorAvg"],
          },
        },
        readabilityFlow: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              paragraphIndex: { type: Type.NUMBER },
              score: { type: Type.NUMBER },
            },
            required: ["paragraphIndex", "score"],
          },
        },
      },
      required: ["topicCoverage", "readabilityFlow"],
    },
  },
  required: [
    "rankScore",
    "eeatScore",
    "readabilityScore",
    "humanScore",
    "metaTitle",
    "metaDescription",
    "slug",
    "internalLinks",
    "evidence",
    "competitorAnalysis",
    "contentAudit",
    "lsiKeywords",
    "userIntent",
    "imageAltText",
    "entities",
    "serpAnalysis",
    "voiceAudit",
    "schemaMarkup",
    "visuals",
  ],
};

export const getAnalysisPrompt = (
  targetKeyword: string,
  secondaryKeywords: string,
  brandVoice: string,
  content: string,
  coreLinksText: string,
) => `
You are an expert SEO Content Strategist & Optimizer.
Analyze the provided blog draft, target keyword, secondary keywords, and core links to provide a comprehensive SEO optimization report.

Target Keyword: "${targetKeyword}"
Secondary Keywords: "${secondaryKeywords}"
Brand Voice: ${brandVoice}

Core Links (for internal linking):
${coreLinksText}

Blog Draft:
${content}

Provide a detailed analysis in JSON format matching the requested schema.

CRITICAL INSTRUCTIONS:
1. DO NOT use em dashes (—) in any text generation. Use commas, colons, or parentheses instead.
2. Use natural, human-like language for all suggestions and rewrites. Avoid robotic or overly formal phrasing.
3. Evaluate the E-E-A-T score (0-100).
4. Predict the Likelihood of Ranking score (0-100).
5. Suggest AT LEAST 5-8 internal links based on the provided Core Links, finding natural anchor text in the draft. Categorize them as "High" or "Supporting".
6. Use Google Search to find the top 10 ranking pages for "${targetKeyword}". Compare this draft against them.
7. Identify "Entities" (people, brands, concepts) that are critical for this topic. Mark them as "Included" or "Missing".
8. Identify "Content Gaps" (topics competitors cover that we missed) and "Unique Value" (what we have that they don't).
9. Find at least 2 relevant expert quotes and 1-2 case studies or statistics related to this topic. Provide the source URL for each.
10. For every content suggestion (quotes, rewrites, etc.), specify a "targetLocation" by quoting the sentence it should follow.
11. Analyze the user intent (e.g., Informational, Transactional) and whether the draft matches it.
12. Rate the readability (0-100) and provide a "Human-like" score (0-100).
13. Perform a "Voice Audit": check if the content matches the requested brand voice ("${brandVoice}"). Identify specific "robotic" sentences and suggest human-like alternatives.
14. Generate a Meta Title, Meta Description, and URL Slug.
15. Generate a JSON-LD Schema Markup (e.g., Article, FAQ) for this content.
16. Provide data for "Visuals":
    - "topicCoverage": Compare your score vs competitor average for key sub-topics.
    - "readabilityFlow": A score (0-100) for each paragraph to show how readability changes throughout the text.
`;
