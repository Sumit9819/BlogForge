export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface AnalysisResult {
  rankScore: number;
  eeatScore: number;
  readabilityScore: number;
  humanScore: number;
  metaTitle?: string;
  metaDescription?: string;
  slug?: string;
  internalLinks: Array<{
    anchorText: string;
    suggestedUrl: string;
    reason: string;
    priority: "High" | "Supporting";
  }>;
  evidence: Array<{
    type: "Quote" | "Case Study" | "Statistic";
    content: string;
    sourceName: string;
    sourceUrl: string;
    targetLocation: string;
  }>;
  competitorAnalysis: {
    topCompetitors: Array<{ title: string; url: string }>;
    contentGaps: Array<{ topic: string; description: string }>;
    uniqueValue: Array<{ point: string; impact: string }>;
  };
  contentAudit: Array<{
    originalParagraph: string;
    suggestedRewrite: string;
    issue: string;
    targetLocation: string;
    priority?: "High" | "Medium" | "Low";
  }>;
  lsiKeywords: Array<string>;
  userIntent: {
    currentIntent: string;
    targetIntent: string;
    match: boolean;
    feedback: string;
  };
  imageAltText: Array<{ imageDescription: string; suggestedAltText: string }>;
  entities: Array<{
    name: string;
    type: string;
    status: "Included" | "Missing";
    relevance: string;
  }>;
  serpAnalysis: {
    topResults: Array<{
      rank: number;
      title: string;
      snippet: string;
      url: string;
      features: string[];
    }>;
    commonQuestions: string[];
  };
  voiceAudit: {
    score: number;
    feedback: string;
    roboticSentences: Array<{
      sentence: string;
      reason: string;
      suggestion: string;
    }>;
  };
  schemaMarkup: string; // JSON-LD
  visuals: {
    topicCoverage: Array<{
      topic: string;
      yourScore: number;
      competitorAvg: number;
    }>;
    readabilityFlow: Array<{ paragraphIndex: number; score: number }>;
  };
}

export interface Website {
  id: string;
  userId: string;
  name: string;
  url: string;
  brandVoice?: string;
  collaborators?: string[];
  createdAt: number;
}

export interface CoreLink {
  id: string;
  userId: string;
  websiteId: string;
  url: string;
  category: string;
  title: string;
  createdAt: number;
}

export interface Draft {
  id: string;
  userId: string;
  websiteId: string;
  title: string;
  content: string;
  targetKeyword: string;
  secondaryKeywords?: string[];
  brandVoice?: string;
  analysisResult: string; // JSON string
  status?: string;
  metaTitle?: string;
  metaDescription?: string;
  slug?: string;
  snapshots?: Snapshot[];
  createdAt: number;
  updatedAt: number;
}

export interface Snapshot {
  id: string;
  timestamp: number;
  content: string;
  analysisResult: string; // JSON string
  rankScore: number;
}
