"use client";

import { Target, Tag, Mic, Globe, Loader2, Link as LinkIcon, AlertCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface SEOOptimizerInputProps {
  error: string;
  linksCount: number;
  selectedWebsite: { name: string };
  targetKeyword: string;
  setTargetKeyword: (val: string) => void;
  secondaryKeywords: string;
  setSecondaryKeywords: (val: string) => void;
  brandVoice: string;
  setBrandVoice: (val: string) => void;
  fetchUrl: string;
  setFetchUrl: (val: string) => void;
  handleFetchUrl: () => void;
  isFetchingUrl: boolean;
  draftContent: string;
  setDraftContent: (val: string) => void;
  handleAnalyze: () => void;
}

export function SEOOptimizerInput({
  error,
  linksCount,
  selectedWebsite,
  targetKeyword,
  setTargetKeyword,
  secondaryKeywords,
  setSecondaryKeywords,
  brandVoice,
  setBrandVoice,
  fetchUrl,
  setFetchUrl,
  handleFetchUrl,
  isFetchingUrl,
  draftContent,
  setDraftContent,
  handleAnalyze,
}: SEOOptimizerInputProps) {
  return (
    <div className="max-w-3xl mx-auto w-full space-y-8 py-8">
      <Card className="shadow-sm border-slate-200">
        <CardContent className="p-6 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-md flex items-start gap-3">
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-start gap-3">
            <LinkIcon className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-900">Context Active</p>
              <p className="text-sm text-blue-700">
                {linksCount} core links from {selectedWebsite.name} will be
                used for internal linking suggestions.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="targetKeyword" className="text-base font-semibold">
                Target Keyword
              </Label>
              <Input
                id="targetKeyword"
                placeholder="e.g., 'b2b content marketing strategy'"
                leftIcon={<Target className="h-4 w-4" />}
                value={targetKeyword}
                onChange={(e) => setTargetKeyword(e.target.value)}
                className="text-base"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="secondaryKeywords"
                className="text-base font-semibold"
              >
                Secondary Keywords
              </Label>
              <Input
                id="secondaryKeywords"
                placeholder="e.g., 'seo tips, content audit, ROI'"
                leftIcon={<Tag className="h-4 w-4" />}
                value={secondaryKeywords}
                onChange={(e) => setSecondaryKeywords(e.target.value)}
                className="text-base"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="brandVoice" className="text-base font-semibold">
              Brand Voice / Tone
            </Label>
            <Input
              id="brandVoice"
              placeholder="e.g., 'Professional yet conversational, authoritative but accessible'"
              leftIcon={<Mic className="h-4 w-4" />}
              value={brandVoice}
              onChange={(e) => setBrandVoice(e.target.value)}
              className="text-base"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="draftContent" className="text-base font-semibold">
                Blog Draft
              </Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Or fetch from URL..."
                  leftIcon={<Globe className="h-4 w-4" />}
                  className="h-9 w-64 text-sm"
                  value={fetchUrl}
                  onChange={(e) => setFetchUrl(e.target.value)}
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 text-sm px-3"
                  onClick={handleFetchUrl}
                  disabled={isFetchingUrl}
                >
                  {isFetchingUrl ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Globe className="h-4 w-4 mr-2" />
                  )}
                  Fetch
                </Button>
              </div>
            </div>
            <Textarea
              id="draftContent"
              placeholder="Paste your raw blog post draft here..."
              value={draftContent}
              onChange={(e) => setDraftContent(e.target.value)}
              className="min-h-[300px] text-base leading-relaxed"
            />
          </div>

          <Button
            onClick={handleAnalyze}
            className="w-full text-lg h-12"
            size="lg"
          >
            Analyze Content <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
