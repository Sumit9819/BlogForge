"use client";

import { Search, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Draft = {
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
  snapshots?: any[];
  createdAt: number;
  updatedAt: number;
};

interface DraftsBoardProps {
  drafts: Draft[];
  draftSearchQuery: string;
  setDraftSearchQuery: (query: string) => void;
  handleLoadDraft: (draft: Draft) => void;
  handleUpdateDraftStatus: (id: string, status: string) => void;
  handleDeleteDraft: (id: string) => void;
}

export function DraftsBoard({
  drafts,
  draftSearchQuery,
  setDraftSearchQuery,
  handleLoadDraft,
  handleUpdateDraftStatus,
  handleDeleteDraft,
}: DraftsBoardProps) {
  const statuses = ["Idea", "Drafting", "Review", "Published"];

  return (
    <Card className="shadow-sm border-0 h-full flex flex-col">
      <CardHeader className="border-b pb-4 flex flex-row items-center justify-between">
        <div>
          <CardTitle>Content Board</CardTitle>
          <CardDescription>Manage your content pipeline.</CardDescription>
        </div>
        <div className="w-64">
          <Input
            type="search"
            placeholder="Search drafts..."
            leftIcon={<Search className="h-4 w-4" />}
            className="bg-slate-50"
            value={draftSearchQuery}
            onChange={(e) => setDraftSearchQuery(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-1 overflow-auto bg-slate-50/50">
        <div className="flex gap-4 h-full min-h-[500px]">
          {statuses.map((status) => {
            const filteredDrafts = drafts.filter(
              (d) =>
                (d.status || "Drafting") === status &&
                (d.title.toLowerCase().includes(draftSearchQuery.toLowerCase()) ||
                  d.targetKeyword
                    .toLowerCase()
                    .includes(draftSearchQuery.toLowerCase())),
            );
            return (
              <div
                key={status}
                className="flex-1 min-w-[250px] bg-slate-100/50 rounded-lg border border-slate-200 p-3 flex flex-col"
              >
                <div className="font-medium text-sm text-slate-700 mb-3 px-1 flex items-center justify-between">
                  {status}
                  <Badge variant="secondary" className="bg-slate-200 text-slate-600">
                    {filteredDrafts.length}
                  </Badge>
                </div>
                <div className="space-y-3 flex-1">
                  {filteredDrafts.map((draft) => (
                    <Card
                      key={draft.id}
                      className="cursor-pointer hover:border-blue-300 transition-colors shadow-sm"
                      onClick={() => handleLoadDraft(draft)}
                    >
                      <CardContent className="p-3">
                        <div className="font-medium text-sm mb-2 line-clamp-2">
                          {draft.title}
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <Badge
                            variant="outline"
                            className="text-xs font-normal text-slate-500 truncate max-w-[120px]"
                          >
                            {draft.targetKeyword}
                          </Badge>
                          <DropdownMenu>
                            <DropdownMenuTrigger
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50 h-6 w-6 p-0"
                            >
                              <ChevronLeft className="h-3 w-3 -rotate-90" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {statuses
                                .filter((s) => s !== status)
                                .map((s) => (
                                  <DropdownMenuItem
                                    key={s}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleUpdateDraftStatus(draft.id, s);
                                    }}
                                  >
                                    Move to {s}
                                  </DropdownMenuItem>
                                ))}
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteDraft(draft.id);
                                }}
                              >
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
