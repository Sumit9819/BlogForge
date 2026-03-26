"use client";

import {
  FileText,
  Link as LinkIcon,
  Quote,
  Users,
  Target,
  Globe,
  Tag,
  Search,
  Mic,
  Code,
  BarChart as BarChartIcon,
  History,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Info,
  Wand2,
  Copy,
  Save,
  ExternalLink,
  Image as ImageIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { toast } from "sonner";

interface AnalysisTabsProps {
  analysisResult: any;
  brandVoice: string;
  snapshots: any[];
  handleApplyRewrite: (original: string, suggestion: string, target: string) => void;
  handleApplyLink: (anchor: string, url: string) => void;
  handleApplyEvidence: (content: string, sourceName: string, sourceUrl: string, target: string) => void;
  handleSaveSnapshot: () => void;
  setDraftContent: (content: string) => void;
  setAnalysisResult: (result: any) => void;
  wordCount: number;
  keywordDensity: string;
}

export function AnalysisTabs({
  analysisResult,
  brandVoice,
  snapshots,
  handleApplyRewrite,
  handleApplyLink,
  handleApplyEvidence,
  handleSaveSnapshot,
  setDraftContent,
  setAnalysisResult,
  wordCount,
  keywordDensity,
}: AnalysisTabsProps) {
  if (!analysisResult) return null;

  return (
    <Card className="flex-1 flex flex-col overflow-hidden shadow-sm border-slate-200">
      <Tabs defaultValue="audit" className="flex-1 flex flex-col h-full">
        <div className="px-4 pt-4 border-b">
          <TabsList className="w-full justify-start h-auto p-0 bg-transparent gap-4 overflow-x-auto no-scrollbar pb-2">
            <TabsTrigger
              value="audit"
              className="data-[state=active]:bg-slate-100 data-[state=active]:shadow-none rounded-full px-4 py-2"
            >
              <FileText className="h-4 w-4 mr-2" /> Audit
            </TabsTrigger>
            <TabsTrigger
              value="links"
              className="data-[state=active]:bg-slate-100 data-[state=active]:shadow-none rounded-full px-4 py-2"
            >
              <LinkIcon className="h-4 w-4 mr-2" /> Links
            </TabsTrigger>
            <TabsTrigger
              value="evidence"
              className="data-[state=active]:bg-slate-100 data-[state=active]:shadow-none rounded-full px-4 py-2"
            >
              <Quote className="h-4 w-4 mr-2" /> Evidence
            </TabsTrigger>
            <TabsTrigger
              value="competitors"
              className="data-[state=active]:bg-slate-100 data-[state=active]:shadow-none rounded-full px-4 py-2"
            >
              <Users className="h-4 w-4 mr-2" /> Competitors
            </TabsTrigger>
            <TabsTrigger
              value="intent"
              className="data-[state=active]:bg-slate-100 data-[state=active]:shadow-none rounded-full px-4 py-2"
            >
              <Target className="h-4 w-4 mr-2" /> Intent
            </TabsTrigger>
            <TabsTrigger
              value="meta"
              className="data-[state=active]:bg-slate-100 data-[state=active]:shadow-none rounded-full px-4 py-2"
            >
              <Globe className="h-4 w-4 mr-2" /> Meta
            </TabsTrigger>
            <TabsTrigger
              value="entities"
              className="data-[state=active]:bg-slate-100 data-[state=active]:shadow-none rounded-full px-4 py-2"
            >
              <Tag className="h-4 w-4 mr-2" /> Entities
            </TabsTrigger>
            <TabsTrigger
              value="serp"
              className="data-[state=active]:bg-slate-100 data-[state=active]:shadow-none rounded-full px-4 py-2"
            >
              <Search className="h-4 w-4 mr-2" /> SERP
            </TabsTrigger>
            <TabsTrigger
              value="voice"
              className="data-[state=active]:bg-slate-100 data-[state=active]:shadow-none rounded-full px-4 py-2"
            >
              <Mic className="h-4 w-4 mr-2" /> Voice
            </TabsTrigger>
            <TabsTrigger
              value="schema"
              className="data-[state=active]:bg-slate-100 data-[state=active]:shadow-none rounded-full px-4 py-2"
            >
              <Code className="h-4 w-4 mr-2" /> Schema
            </TabsTrigger>
            <TabsTrigger
              value="visuals"
              className="data-[state=active]:bg-slate-100 data-[state=active]:shadow-none rounded-full px-4 py-2"
            >
              <BarChartIcon className="h-4 w-4 mr-2" /> Visuals
            </TabsTrigger>
            <TabsTrigger
              value="snapshots"
              className="data-[state=active]:bg-slate-100 data-[state=active]:shadow-none rounded-full px-4 py-2"
            >
              <History className="h-4 w-4 mr-2" /> History
            </TabsTrigger>
          </TabsList>
        </div>

        <ScrollArea className="flex-1 p-4">
          <TabsContent value="meta" className="m-0 space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900">
                Generated Meta Data
              </h3>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-4">
                <div>
                  <Label className="text-xs font-semibold text-slate-500 uppercase">
                    SEO Title
                  </Label>
                  <Input
                    value={analysisResult.metaTitle || ""}
                    leftIcon={<Globe className="h-4 w-4" />}
                    onChange={(e) =>
                      setAnalysisResult({
                        ...analysisResult,
                        metaTitle: e.target.value,
                      })
                    }
                    className="mt-1 font-medium text-slate-900"
                  />
                </div>
                <Separator />
                <div>
                  <Label className="text-xs font-semibold text-slate-500 uppercase">
                    Meta Description
                  </Label>
                  <textarea
                    value={analysisResult.metaDescription || ""}
                    onChange={(e) =>
                      setAnalysisResult({
                        ...analysisResult,
                        metaDescription: e.target.value,
                      })
                    }
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1 text-slate-700"
                  />
                </div>
                <Separator />
                <div>
                  <Label className="text-xs font-semibold text-slate-500 uppercase">
                    URL Slug
                  </Label>
                  <Input
                    value={analysisResult.slug || ""}
                    leftIcon={<LinkIcon className="h-4 w-4" />}
                    onChange={(e) =>
                      setAnalysisResult({
                        ...analysisResult,
                        slug: e.target.value,
                      })
                    }
                    className="mt-1 font-mono text-sm text-blue-600"
                  />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mt-6">
                Real-Time SEO Stats
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-center">
                  <p className="text-xs font-semibold text-slate-500 uppercase">
                    Word Count
                  </p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">
                    {wordCount}
                  </p>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-center">
                  <p className="text-xs font-semibold text-slate-500 uppercase">
                    Keyword Density
                  </p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">
                    {keywordDensity}%
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="entities" className="m-0 space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900">
                Entity Analysis
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {analysisResult.entities.map((entity: any, idx: number) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-lg border flex items-start gap-3 ${
                      entity.status === "Included"
                        ? "bg-emerald-50 border-emerald-100"
                        : "bg-slate-50 border-slate-200"
                    }`}
                  >
                    {entity.status === "Included" ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-bold text-slate-900">{entity.name}</p>
                        <Badge variant="outline" className="text-[10px] uppercase">
                          {entity.type}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-600">{entity.relevance}</p>
                      <div className="mt-2">
                        <Badge
                          className={
                            entity.status === "Included"
                              ? "bg-emerald-200 text-emerald-800"
                              : "bg-slate-200 text-slate-600"
                          }
                        >
                          {entity.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="serp" className="m-0 space-y-6">
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-900">
                  SERP Analysis (Top 10)
                </h3>
                <div className="space-y-3">
                  {analysisResult.serpAnalysis.topResults.map(
                    (result: any, idx: number) => (
                      <div
                        key={idx}
                        className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm"
                      >
                        <div className="flex items-start gap-3">
                          <div className="h-6 w-6 rounded bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs shrink-0">
                            {result.rank}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-blue-600 truncate hover:underline cursor-pointer">
                              {result.title}
                            </p>
                            <p className="text-xs text-emerald-700 truncate mb-2">
                              {result.url}
                            </p>
                            <p className="text-xs text-slate-600 line-clamp-2 mb-3">
                              {result.snippet}
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {result.features.map((feat: string, fIdx: number) => (
                                <Badge
                                  key={fIdx}
                                  variant="secondary"
                                  className="text-[9px] px-1.5 py-0 h-4 bg-slate-100 text-slate-500"
                                >
                                  {feat}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-900">
                  Commonly Asked Questions
                </h3>
                <div className="grid gap-2">
                  {analysisResult.serpAnalysis.commonQuestions.map(
                    (q: string, idx: number) => (
                      <div
                        key={idx}
                        className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm text-slate-700 flex items-center gap-3"
                      >
                        <HelpCircle className="h-4 w-4 text-slate-400 shrink-0" />
                        {q}
                      </div>
                    ),
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="voice" className="m-0 space-y-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-slate-900 text-white p-6 rounded-xl shadow-lg">
                <div>
                  <h3 className="text-xl font-bold mb-1">Brand Voice Audit</h3>
                  <p className="text-slate-400 text-sm">Target: {brandVoice}</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-black text-emerald-400">
                    {analysisResult.voiceAudit.score}%
                  </div>
                  <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">
                    Alignment
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                <h4 className="text-sm font-bold text-blue-900 mb-2 flex items-center gap-2">
                  <Info className="h-4 w-4" /> Overall Feedback
                </h4>
                <p className="text-sm text-blue-800 leading-relaxed">
                  {analysisResult.voiceAudit.feedback}
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-900">
                  Robotic Sentences Detected
                </h3>
                <div className="space-y-4">
                  {analysisResult.voiceAudit.roboticSentences.map(
                    (item: any, idx: number) => (
                      <div
                        key={idx}
                        className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm"
                      >
                        <div className="bg-slate-50 px-4 py-2 border-b flex items-center justify-between">
                          <Badge
                            variant="outline"
                            className="text-[10px] border-amber-200 text-amber-700 bg-amber-50"
                          >
                            ROBOTIC PHRASING
                          </Badge>
                          <span className="text-[10px] text-slate-400 font-mono">
                            #{idx + 1}
                          </span>
                        </div>
                        <div className="p-4 space-y-4">
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">
                              Original
                            </p>
                            <p className="text-sm text-slate-600 italic">
                              &quot;{item.sentence}&quot;
                            </p>
                          </div>
                          <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-100">
                            <p className="text-[10px] font-bold text-emerald-700 uppercase mb-1">
                              Human-Like Suggestion
                            </p>
                            <p className="text-sm text-emerald-900 font-medium">
                              &quot;{item.suggestion}&quot;
                            </p>
                          </div>
                          <div className="text-xs text-slate-500">
                            <strong>Reason:</strong> {item.reason}
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full gap-2"
                            onClick={() =>
                              handleApplyRewrite(
                                item.sentence,
                                item.suggestion,
                                item.sentence,
                              )
                            }
                          >
                            <Wand2 className="h-4 w-4" /> Apply Human Tone
                          </Button>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="schema" className="m-0 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">
                  JSON-LD Schema Markup
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() => {
                    navigator.clipboard.writeText(analysisResult.schemaMarkup);
                    toast.success("Schema copied to clipboard!");
                  }}
                >
                  <Copy className="h-4 w-4" /> Copy Code
                </Button>
              </div>
              <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
                <pre className="text-xs text-emerald-400 font-mono leading-relaxed">
                  {analysisResult.schemaMarkup}
                </pre>
              </div>
              <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 flex items-start gap-3">
                <Info className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-800">
                  <strong>Tip:</strong> Paste this code into the{" "}
                  <code>&lt;head&gt;</code> section of your HTML or use a CMS
                  plugin to add it. This helps search engines understand your
                  content better.
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="visuals" className="m-0 space-y-6">
            <div className="space-y-8">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-900">
                  Topic Coverage vs. Competitors
                </h3>
                <div className="h-[300px] w-full bg-white border border-slate-100 rounded-xl p-4 shadow-inner flex flex-col justify-end gap-2">
                  {analysisResult.visuals.topicCoverage.map((item: any, i: number) => (
                    <div key={i} className="flex items-center gap-2 text-xs">
                      <div className="w-24 truncate text-slate-500">{item.topic}</div>
                      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden flex">
                        <div className="h-full bg-blue-500" style={{ width: `${item.yourScore}%` }} title={`Your Score: ${item.yourScore}`} />
                        <div className="h-full bg-slate-300" style={{ width: `${item.competitorAvg}%` }} title={`Competitor Avg: ${item.competitorAvg}`} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-900">
                  Readability Flow
                </h3>
                <div className="h-[200px] w-full bg-white border border-slate-100 rounded-xl p-4 shadow-inner flex items-end gap-1">
                  {analysisResult.visuals.readabilityFlow.map((item: any, i: number) => (
                    <div key={i} className="flex-1 bg-purple-500 rounded-t-sm" style={{ height: `${item.score}%` }} title={`Paragraph ${item.paragraphIndex}: ${item.score}`} />
                  ))}
                </div>
                <p className="text-xs text-slate-500 italic text-center">
                  This chart shows how readability fluctuates paragraph by
                  paragraph. Aim for a consistent flow.
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="snapshots" className="m-0 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">
                  Version History
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={handleSaveSnapshot}
                >
                  <Save className="h-4 w-4" /> Save Snapshot
                </Button>
              </div>

              {snapshots.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 border border-dashed rounded-xl">
                  <History className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500">No snapshots saved yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {snapshots.map((snap: any, idx: number) => (
                    <div
                      key={idx}
                      className="bg-white border border-slate-200 rounded-lg p-4 flex items-center justify-between shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-100 p-2 rounded-full">
                          <FileText className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">
                            {new Date(snap.timestamp).toLocaleString()}
                          </p>
                          <p className="text-xs text-slate-500">
                            {snap.content.length} characters
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        onClick={() => {
                          setDraftContent(snap.content);
                          setAnalysisResult(snap.analysis);
                          toast.success("Reverted to snapshot!");
                        }}
                      >
                        Restore
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="audit" className="m-0 space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900">
                Content Audit & Rewrites
              </h3>
              {analysisResult.contentAudit.length === 0 ? (
                <p className="text-slate-500">No major issues found. Great job!</p>
              ) : (
                analysisResult.contentAudit.map((audit: any, idx: number) => (
                  <div
                    key={idx}
                    className="bg-amber-50 border border-amber-100 rounded-lg p-4 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-amber-900">
                            Issue: {audit.issue}
                          </p>
                          <p className="text-xs text-amber-700 mt-0.5">
                            Target: {audit.targetLocation}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className="bg-amber-100 text-amber-800 border-amber-200"
                      >
                        {audit.priority || "Medium"}
                      </Badge>
                    </div>
                    <div className="space-y-2 pl-7">
                      <div className="bg-white/60 p-3 rounded text-sm text-slate-600 line-through decoration-amber-300">
                        {audit.originalParagraph}
                      </div>
                      <div className="bg-white p-3 rounded border border-amber-200 text-sm text-slate-800 font-medium">
                        {audit.suggestedRewrite}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full mt-2 gap-2"
                        onClick={() =>
                          handleApplyRewrite(
                            audit.originalParagraph,
                            audit.suggestedRewrite,
                            audit.targetLocation,
                          )
                        }
                      >
                        <Wand2 className="h-4 w-4" /> Apply Rewrite
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="links" className="m-0 space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900">
                Internal Linking Engine
              </h3>
              {analysisResult.internalLinks.length === 0 ? (
                <p className="text-slate-500">
                  No internal link suggestions found based on provided core links.
                </p>
              ) : (
                analysisResult.internalLinks.map((link: any, idx: number) => (
                  <div
                    key={idx}
                    className="bg-blue-50 border border-blue-100 rounded-lg p-4 space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <LinkIcon className="h-4 w-4 text-blue-600" />
                        <span className="font-semibold text-blue-900">
                          Anchor: &quot;{link.anchorText}&quot;
                        </span>
                        <Badge
                          variant="outline"
                          className="bg-blue-100 text-blue-800 border-blue-200 text-[10px] h-5"
                        >
                          {link.priority || "Supporting"}
                        </Badge>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="shrink-0 gap-2"
                        onClick={() =>
                          handleApplyLink(link.anchorText, link.suggestedUrl)
                        }
                      >
                        <Wand2 className="h-4 w-4" /> Add Link
                      </Button>
                    </div>
                    <p className="text-sm text-slate-700">
                      <strong>Target URL:</strong>{" "}
                      <a
                        href={link.suggestedUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 hover:underline break-all"
                      >
                        {link.suggestedUrl}
                      </a>
                    </p>
                    <p className="text-sm text-slate-600">
                      <strong>Reason:</strong> {link.reason}
                    </p>
                  </div>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="evidence" className="m-0 space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900">
                Expert Evidence & Authority
              </h3>
              {analysisResult.evidence.length === 0 ? (
                <p className="text-slate-500">
                  No relevant evidence found for this topic.
                </p>
              ) : (
                analysisResult.evidence.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    className="bg-slate-50 border border-slate-200 rounded-lg p-5 space-y-3 relative"
                  >
                    <div className="flex items-center justify-between">
                      <Badge
                        variant="secondary"
                        className="bg-slate-200 text-slate-700"
                      >
                        {item.type.toUpperCase()}
                      </Badge>
                      {item.type === "Quote" && (
                        <Quote className="h-5 w-5 text-slate-300" />
                      )}
                      {item.type === "Case Study" && (
                        <FileText className="h-5 w-5 text-slate-300" />
                      )}
                      {item.type === "Statistic" && (
                        <BarChartIcon className="h-5 w-5 text-slate-300" />
                      )}
                    </div>
                    <blockquote className="text-slate-800 italic font-serif text-lg leading-relaxed">
                      &quot;{item.content}&quot;
                    </blockquote>
                    <div className="text-sm">
                      <span className="font-semibold text-slate-900">
                        {item.sourceName}
                      </span>
                    </div>
                    <div className="pt-3 border-t border-slate-200 mt-3">
                      <p className="text-sm text-slate-600">
                        <strong>Target:</strong> {item.targetLocation}
                      </p>
                      {item.sourceUrl && (
                        <p className="text-xs text-slate-400 mt-1 break-all">
                          Source:{" "}
                          <a
                            href={item.sourceUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="hover:underline text-blue-500"
                          >
                            {item.sourceUrl}
                          </a>
                        </p>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-2 gap-2"
                      onClick={() =>
                        handleApplyEvidence(
                          item.content,
                          item.sourceName,
                          item.sourceUrl,
                          item.targetLocation,
                        )
                      }
                    >
                      <Wand2 className="h-4 w-4" /> Insert {item.type}
                    </Button>
                  </div>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="competitors" className="m-0 space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900">
                Top Ranking Competitors
              </h3>
              <div className="grid gap-3">
                {analysisResult.competitorAnalysis.topCompetitors.map(
                  (comp: any, idx: number) => (
                    <div
                      key={idx}
                      className="bg-slate-50 border border-slate-200 rounded-lg p-3 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold text-xs">
                          {idx + 1}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900">
                            {comp.title}
                          </p>
                          <a
                            href={comp.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs text-blue-500 hover:underline break-all"
                          >
                            {comp.url}
                          </a>
                        </div>
                      </div>
                      <ExternalLink className="h-4 w-4 text-slate-400" />
                    </div>
                  ),
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900">Content Gaps</h3>
              <div className="grid gap-2">
                {analysisResult.competitorAnalysis.contentGaps.map(
                  (gap: string, idx: number) => (
                    <div
                      key={idx}
                      className="bg-amber-50 border border-amber-100 rounded-lg p-3 text-sm text-amber-800 flex items-center gap-3"
                    >
                      <AlertCircle className="h-4 w-4 text-amber-500 shrink-0" />
                      {gap}
                    </div>
                  ),
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900">
                Unique Value Propositions
              </h3>
              <div className="grid gap-3">
                {analysisResult.competitorAnalysis.uniqueValue.map(
                  (val: any, idx: number) => (
                    <div
                      key={idx}
                      className="bg-emerald-50 border border-emerald-100 rounded-lg p-4"
                    >
                      <p className="text-sm font-bold text-emerald-900 mb-1">
                        {val.point}
                      </p>
                      <p className="text-xs text-emerald-700">{val.impact}</p>
                    </div>
                  ),
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="intent" className="m-0 space-y-6">
            <div className="space-y-6">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-slate-900">
                    Search Intent Match
                  </h3>
                  <Badge
                    className={
                      analysisResult.userIntent.matchScore > 80
                        ? "bg-emerald-500"
                        : "bg-amber-500"
                    }
                  >
                    {analysisResult.userIntent.matchScore}% Match
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Target Intent
                    </p>
                    <div className="p-3 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700">
                      {analysisResult.userIntent.targetIntent}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Current Intent
                    </p>
                    <div className="p-3 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700">
                      {analysisResult.userIntent.currentIntent}
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-lg">
                  <p className="text-xs font-bold text-blue-700 uppercase mb-2">
                    AI Feedback
                  </p>
                  <p className="text-sm text-blue-800 leading-relaxed">
                    {analysisResult.userIntent.feedback}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-900">
                  Image Alt-Text Suggestions
                </h3>
                <div className="grid gap-3">
                  {analysisResult.imageAltSuggestions.map(
                    (item: any, idx: number) => (
                      <div
                        key={idx}
                        className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <ImageIcon className="h-4 w-4 text-slate-400" />
                          <span className="text-xs font-bold text-slate-500 uppercase">
                            Context: {item.context}
                          </span>
                        </div>
                        <p className="text-sm text-slate-800 font-medium">
                          {item.suggestion}
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="mt-2 h-7 text-[10px] text-blue-600 p-0 hover:bg-transparent hover:underline"
                          onClick={() => {
                            navigator.clipboard.writeText(item.suggestion);
                            toast.success("Alt-text copied!");
                          }}
                        >
                          Copy to clipboard
                        </Button>
                      </div>
                    ),
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </Card>
  );
}
