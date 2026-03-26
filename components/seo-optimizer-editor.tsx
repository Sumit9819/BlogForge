"use client";

import { useState, useEffect, useRef } from "react";
import {
  FileText,
  Save,
  Download,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import dynamic from "next/dynamic";
import { toast } from "sonner";

const RichTextEditor = dynamic(
  () => import("@/components/rich-text-editor").then((mod) => mod.RichTextEditor),
  { ssr: false },
);

const AnalysisTabs = dynamic(
  () => import("@/components/analysis-tabs").then((mod) => mod.AnalysisTabs),
  { ssr: false },
);

interface SEOOptimizerEditorProps {
  draftId: string | null;
  draftTitle: string;
  setDraftTitle: (title: string) => void;
  draftContent: string;
  setDraftContent: (content: string) => void;
  analysisResult: any;
  setAnalysisResult: (result: any) => void;
  wordCount: number;
  keywordDensity: string;
  brandVoice: string;
  snapshots: any[];
  handleSaveDraft: () => Promise<void>;
  handleExportHTML: () => void;
  handleExportMarkdown: () => void;
  handleApplyRewrite: (original: string, suggestion: string, target: string) => void;
  handleApplyLink: (anchor: string, url: string) => void;
  handleApplyEvidence: (content: string, sourceName: string, sourceUrl: string, target: string) => void;
  handleSaveSnapshot: () => void;
  isAutoSaving: boolean;
  lastSavedTime: Date | null;
}

export function SEOOptimizerEditor({
  draftId,
  draftTitle,
  setDraftTitle,
  draftContent,
  setDraftContent,
  analysisResult,
  setAnalysisResult,
  wordCount,
  keywordDensity,
  brandVoice,
  snapshots,
  handleSaveDraft,
  handleExportHTML,
  handleExportMarkdown,
  handleApplyRewrite,
  handleApplyLink,
  handleApplyEvidence,
  handleSaveSnapshot,
  isAutoSaving,
  lastSavedTime,
}: SEOOptimizerEditorProps) {

  return (
    <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-120px)]">
      {/* Left Pane: Editor */}
      <Card className="flex flex-col shadow-sm border-slate-200 overflow-hidden">
        <CardHeader className="bg-slate-50 border-b py-3 px-4 flex flex-row items-center justify-between">
          <div className="flex items-center gap-2 flex-1 mr-4">
            <FileText className="h-4 w-4 shrink-0" />
            <Input
              value={draftTitle}
              onChange={(e) => setDraftTitle(e.target.value)}
              placeholder="Draft Title..."
              leftIcon={<FileText className="h-4 w-4" />}
              className="h-8 border-transparent bg-transparent hover:border-slate-200 focus:border-blue-500 focus:bg-white transition-colors"
            />
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {isAutoSaving ? (
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Loader2 className="h-3 w-3 animate-spin" /> Saving...
              </span>
            ) : lastSavedTime ? (
              <span className="text-xs text-slate-400">
                Saved {lastSavedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            ) : null}
            <Button
              variant="outline"
              size="sm"
              onClick={handleSaveDraft}
              className="gap-2"
            >
              <Save className="h-4 w-4" /> Save
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3">
                <Download className="h-4 w-4" /> Export
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleExportHTML}>
                  Export as HTML
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportMarkdown}>
                  Export as Markdown
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="p-0 flex-1 relative bg-white">
          <RichTextEditor
            content={draftContent}
            onChange={setDraftContent}
          />
        </CardContent>
      </Card>

      {/* Right Pane: Analysis */}
      <div className="flex flex-col gap-4 overflow-hidden">
        {/* Score Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 shrink-0">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
            <CardContent className="p-3 flex flex-col items-center justify-center text-center">
              <p className="text-[10px] font-semibold text-blue-800 uppercase tracking-wider mb-1">
                Rank Score
              </p>
              <div className="flex items-baseline gap-0.5">
                <span className="text-2xl font-black text-blue-600">
                  {analysisResult.rankScore}
                </span>
                <span className="text-xs font-bold text-blue-400">
                  %
                </span>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-100">
            <CardContent className="p-3 flex flex-col items-center justify-center text-center">
              <p className="text-[10px] font-semibold text-emerald-800 uppercase tracking-wider mb-1">
                E-E-A-T
              </p>
              <div className="flex items-baseline gap-0.5">
                <span className="text-2xl font-black text-emerald-600">
                  {analysisResult.eeatScore}
                </span>
                <span className="text-xs font-bold text-emerald-400">
                  /100
                </span>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-100">
            <CardContent className="p-3 flex flex-col items-center justify-center text-center">
              <p className="text-[10px] font-semibold text-amber-800 uppercase tracking-wider mb-1">
                Readability
              </p>
              <div className="flex items-baseline gap-0.5">
                <span className="text-2xl font-black text-amber-600">
                  {analysisResult.readabilityScore || 0}
                </span>
                <span className="text-xs font-bold text-amber-400">
                  /100
                </span>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-100">
            <CardContent className="p-3 flex flex-col items-center justify-center text-center">
              <p className="text-[10px] font-semibold text-purple-800 uppercase tracking-wider mb-1">
                Human Score
              </p>
              <div className="flex items-baseline gap-0.5">
                <span className="text-2xl font-black text-purple-600">
                  {analysisResult.humanScore || 0}
                </span>
                <span className="text-xs font-bold text-purple-400">
                  %
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <AnalysisTabs
          analysisResult={analysisResult}
          brandVoice={brandVoice}
          snapshots={snapshots}
          handleApplyRewrite={handleApplyRewrite}
          handleApplyLink={handleApplyLink}
          handleApplyEvidence={handleApplyEvidence}
          handleSaveSnapshot={handleSaveSnapshot}
          setDraftContent={setDraftContent}
          setAnalysisResult={setAnalysisResult}
          wordCount={wordCount}
          keywordDensity={keywordDensity}
        />
      </div>
    </div>
  );
}
