"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/components/auth-provider";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  updateDoc,
  serverTimestamp,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Loader2,
  Target,
  Copy,
  ChevronLeft,
  LogOut,
  User as UserIcon,
  FileText,
  Link as LinkIcon,
  Save,
} from "lucide-react";
import dynamic from "next/dynamic";
import { toast } from "sonner";
import { arrayUnion } from "firebase/firestore";
import { 
  OperationType, 
  AnalysisResult, 
  Website, 
  CoreLink, 
  Draft, 
  Snapshot 
} from "@/lib/types";
import { handleFirestoreError } from "@/lib/utils";
import { 
  ANALYSIS_SYSTEM_INSTRUCTION,
  ANALYSIS_RESPONSE_SCHEMA, 
  getAnalysisPrompt 
} from "@/lib/prompts";
import { GoogleGenAI } from "@google/genai";

const DashboardView = dynamic(() => import("@/components/dashboard-view").then(mod => mod.DashboardView), { ssr: false });
const LinkManager = dynamic(() => import("@/components/link-manager").then(mod => mod.LinkManager), { ssr: false });
const DraftsBoard = dynamic(() => import("@/components/drafts-board").then(mod => mod.DraftsBoard), { ssr: false });
const SEOOptimizerInput = dynamic(() => import("@/components/seo-optimizer-input").then(mod => mod.SEOOptimizerInput), { ssr: false });
const SEOOptimizerEditor = dynamic(() => import("@/components/seo-optimizer-editor").then(mod => mod.SEOOptimizerEditor), { ssr: false });

function normalizeWhitespace(text: string): string {
  return text
    .replace(/\u00a0/g, " ")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function htmlToPlainText(value: string): string {
  if (!value) return "";
  const looksLikeHtml = /<[^>]+>/.test(value);
  if (!looksLikeHtml) return normalizeWhitespace(value);

  if (typeof window !== "undefined" && typeof DOMParser !== "undefined") {
    const parser = new DOMParser();
    const doc = parser.parseFromString(value, "text/html");

    doc.querySelectorAll("script, style, nav, footer, header, aside, noscript").forEach((el) => el.remove());

    const paragraphs = Array.from(doc.querySelectorAll("p, h1, h2, h3, h4, li"))
      .map((el) => (el.textContent || "").trim())
      .filter((line) => line.length > 0);

    const combined = paragraphs.length > 0 ? paragraphs.join("\n\n") : (doc.body?.textContent || "");
    return normalizeWhitespace(combined);
  }

  // Regex fallback (should rarely run in this client component).
  return normalizeWhitespace(value.replace(/<[^>]*>/g, " "));
}

export default function SEOStrategist() {
  const { user, loading: authLoading, signIn, logOut } = useAuth();

  const [view, setView] = useState<"dashboard" | "workspace">("dashboard");
  const [websites, setWebsites] = useState<Website[]>([]);
  const [selectedWebsite, setSelectedWebsite] = useState<Website | null>(null);
  const [links, setLinks] = useState<CoreLink[]>([]);
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [draftSearchQuery, setDraftSearchQuery] = useState("");
  const [secondaryKeywords, setSecondaryKeywords] = useState("");
  const [brandVoice, setBrandVoice] = useState("Professional");

  // Website Form
  const [isAddWebsiteOpen, setIsAddWebsiteOpen] = useState(false);
  const [newWebsiteName, setNewWebsiteName] = useState("");
  const [newWebsiteUrl, setNewWebsiteUrl] = useState("");
  const [newWebsiteBrandVoice, setNewWebsiteBrandVoice] = useState("");

  // Share Form
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [shareEmail, setShareEmail] = useState("");
  const [websiteToShare, setWebsiteToShare] = useState<Website | null>(null);

  // Link Form
  const [isAddLinkOpen, setIsAddLinkOpen] = useState(false);
  const [newLinkUrl, setNewLinkUrl] = useState("");
  const [newLinkCategory, setNewLinkCategory] = useState("Blog");
  const [newLinkTitle, setNewLinkTitle] = useState("");
  const [isImportingSitemap, setIsImportingSitemap] = useState(false);
  const [fetchUrl, setFetchUrl] = useState("");
  const [isFetchingUrl, setIsFetchingUrl] = useState(false);

  const handleFetchUrl = async () => {
    if (!fetchUrl) return;
    setIsFetchingUrl(true);
    try {
      const res = await fetch("/api/fetch-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: fetchUrl }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to fetch URL");
      }

      const { title, content, articleContent } = await res.json();
      const fetchedBlogText = articleContent || content || "";
      const cleanedContent = htmlToPlainText(fetchedBlogText);
      setDraftTitle(title || "");
      setDraftContent(cleanedContent);
      alert("Content fetched successfully!");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsFetchingUrl(false);
    }
  };

  const handleImportSitemap = async () => {
    if (!user || !selectedWebsite) return;
    setIsImportingSitemap(true);
    try {
      const res = await fetch('/api/crawl-sitemap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: selectedWebsite.url })
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to import sitemap');
      }
      
      const { links: sitemapLinks } = await res.json();
      
      // Add all links to Firestore
      for (const url of sitemapLinks) {
        // Check if link already exists
        if (!links.some(l => l.url === url)) {
          await addDoc(collection(db, "links"), {
            userId: user.uid,
            websiteId: selectedWebsite.id,
            url: url,
            category: "Sitemap Import",
            title: "",
            createdAt: Date.now(),
          });
        }
      }
      
      alert(`Successfully imported ${sitemapLinks.length} links from sitemap.`);
    } catch (error: any) {
      console.error("Sitemap import error:", error);
      alert(error.message || "Failed to import sitemap.");
    } finally {
      setIsImportingSitemap(false);
    }
  };

  // SEO Optimizer State
  const [step, setStep] = useState<"input" | "analyzing" | "editor">("input");
  const [draftId, setDraftId] = useState<string | null>(null);
  const [draftTitle, setDraftTitle] = useState("");
  const [draftContent, setDraftContent] = useState("");
  const [targetKeyword, setTargetKeyword] = useState("");
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null,
  );
  const [error, setError] = useState("");

  // Derived state
  const snapshots = drafts.find((d) => d.id === draftId)?.snapshots || [];

  // Real-time SEO Scoring
  const wordCount = draftContent
    .replace(/<[^>]*>?/gm, "")
    .split(/\s+/)
    .filter((w) => w.length > 0).length;
  const keywordDensity =
    targetKeyword && wordCount > 0
      ? (
          ((draftContent.toLowerCase().split(targetKeyword.toLowerCase())
            .length -
            1) /
            wordCount) *
          100
        ).toFixed(1)
      : "0.0";

  // Fetch Websites
  useEffect(() => {
    if (!user) {
      setWebsites([]);
      return;
    }
    const q = query(
      collection(db, "websites"),
      where("userId", "==", user.uid),
    );
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const webs = snapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() }) as Website,
        );
        setWebsites(webs.sort((a, b) => b.createdAt - a.createdAt));
      },
      (error) => handleFirestoreError(error, OperationType.LIST, "websites"),
    );
    return () => unsubscribe();
  }, [user]);

  // Fetch Links for selected website
  useEffect(() => {
    if (!user || !selectedWebsite) {
      setLinks([]);
      return;
    }
    const q = query(
      collection(db, "links"),
      where("websiteId", "==", selectedWebsite.id),
      where("userId", "==", user.uid),
    );
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const lks = snapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() }) as CoreLink,
        );
        setLinks(lks.sort((a, b) => b.createdAt - a.createdAt));
      },
      (error) => handleFirestoreError(error, OperationType.LIST, "links"),
    );
    return () => unsubscribe();
  }, [user, selectedWebsite]);

  // Fetch Drafts for selected website
  useEffect(() => {
    if (!user || !selectedWebsite) {
      setDrafts([]);
      return;
    }
    const q = query(
      collection(db, "drafts"),
      where("websiteId", "==", selectedWebsite.id),
    );
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const drfs = snapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() }) as Draft,
        );
        setDrafts(drfs.sort((a, b) => b.updatedAt - a.updatedAt));
      },
      (error) => handleFirestoreError(error, OperationType.LIST, "drafts"),
    );
    return () => unsubscribe();
  }, [user, selectedWebsite]);

  const handleAddWebsite = async () => {
    if (!user || !newWebsiteName || !newWebsiteUrl) return;
    try {
      await addDoc(collection(db, "websites"), {
        userId: user.uid,
        name: newWebsiteName,
        url: newWebsiteUrl,
        brandVoice: newWebsiteBrandVoice,
        createdAt: Date.now(),
      });
      setIsAddWebsiteOpen(false);
      setNewWebsiteName("");
      setNewWebsiteUrl("");
      setNewWebsiteBrandVoice("");
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, "websites");
    }
  };

  const handleDeleteWebsite = async (id: string) => {
    try {
      await deleteDoc(doc(db, "websites", id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `websites/${id}`);
    }
  };

  const handleAddLink = async () => {
    if (!user || !selectedWebsite || !newLinkUrl) return;
    try {
      await addDoc(collection(db, "links"), {
        userId: user.uid,
        websiteId: selectedWebsite.id,
        url: newLinkUrl,
        category: newLinkCategory,
        title: newLinkTitle,
        createdAt: Date.now(),
      });
      setIsAddLinkOpen(false);
      setNewLinkUrl("");
      setNewLinkTitle("");
      setNewLinkCategory("Blog");
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, "links");
    }
  };

  const handleDeleteLink = async (id: string) => {
    try {
      await deleteDoc(doc(db, "links", id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `links/${id}`);
    }
  };

  const handleAnalyze = async () => {
    if (!draftContent || !targetKeyword) {
      setError("Please provide both a blog draft and a target keyword.");
      return;
    }

    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
      setError("Missing NEXT_PUBLIC_GEMINI_API_KEY. Add it to your environment and restart the app.");
      return;
    }

    setError("");
    setStep("analyzing");

    // Format links for the prompt
    const coreLinksText = links
      .map((l) => `[${l.category}] ${l.title ? l.title + " - " : ""}${l.url}`)
      .join("\n");
    const contentForAnalysis = htmlToPlainText(draftContent);

    try {
      const ai = new GoogleGenAI({
        apiKey,
      });

      const modelName = process.env.NEXT_PUBLIC_GEMINI_MODEL || "gemini-2.5-pro";

      const response = await ai.models.generateContent({
        model: modelName,
        contents: getAnalysisPrompt(
          targetKeyword,
          secondaryKeywords,
          brandVoice,
          contentForAnalysis,
          coreLinksText,
        ),
        config: {
          systemInstruction: ANALYSIS_SYSTEM_INSTRUCTION,
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json",
          responseSchema: ANALYSIS_RESPONSE_SCHEMA,
        },
      });

      const resultText = response.text;
      if (!resultText) {
        throw new Error("No response from Gemini");
      }

      setAnalysisResult(JSON.parse(resultText));
      setStep("editor");
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : typeof err === "string"
            ? err
            : "An unexpected error occurred while analyzing content.";
      setError(errorMessage);
      setStep("input");
    }
  };

  const handleSaveSnapshot = async () => {
    if (!draftId || !draftContent || !analysisResult || !user) return;
    
    const snapshot: Snapshot = {
      id: Math.random().toString(36).substring(7),
      timestamp: Date.now(),
      content: draftContent,
      analysisResult: JSON.stringify(analysisResult),
      rankScore: analysisResult.rankScore,
    };

    try {
      const draft = drafts.find((d) => d.id === draftId);
      if (draft) {
        const updatedSnapshots = [...(draft.snapshots || []), snapshot];
        await updateDoc(doc(db, "drafts", draftId), {
          snapshots: updatedSnapshots,
        });
      }
    } catch (error) {
      console.error("Failed to save snapshot", error);
    }
  };

  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState<Date | null>(null);

  useEffect(() => {
    if (step !== "editor" || !draftId || !user || !selectedWebsite || !analysisResult) return;

    const timer = setTimeout(async () => {
      setIsAutoSaving(true);
      try {
        const { updateDoc } = await import("firebase/firestore");
        await updateDoc(doc(db, "drafts", draftId), {
          title: draftTitle || targetKeyword || "Untitled Draft",
          content: draftContent,
          analysisResult: JSON.stringify(analysisResult),
          updatedAt: Date.now(),
        });
        setLastSavedTime(new Date());
      } catch (error) {
        console.error("Auto-save failed", error);
      } finally {
        setIsAutoSaving(false);
      }
    }, 3000); // 3-second debounce

    return () => clearTimeout(timer);
  }, [draftContent, draftTitle, analysisResult, draftId, step, user, selectedWebsite, targetKeyword]);

  const handleSaveDraft = async () => {
    if (!user || !selectedWebsite || !draftContent || !analysisResult) return;
    try {
      const draftData = {
        userId: user.uid,
        websiteId: selectedWebsite.id,
        title: draftTitle || targetKeyword || "Untitled Draft",
        content: draftContent,
        targetKeyword,
        analysisResult: JSON.stringify(analysisResult),
        updatedAt: Date.now(),
      };

      if (draftId) {
        // Update existing
        const { updateDoc } = await import("firebase/firestore");
        await updateDoc(doc(db, "drafts", draftId), draftData);
      } else {
        // Create new
        const docRef = await addDoc(collection(db, "drafts"), {
          ...draftData,
          createdAt: Date.now(),
        });
        setDraftId(docRef.id);
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, "drafts");
    }
  };

  const handleLoadDraft = (draft: Draft) => {
    setDraftId(draft.id);
    setDraftTitle(draft.title);
    setDraftContent(draft.content);
    setTargetKeyword(draft.targetKeyword);
    setAnalysisResult(JSON.parse(draft.analysisResult));
    setStep("editor");
  };

  const handleDeleteDraft = async (id: string) => {
    try {
      await deleteDoc(doc(db, "drafts", id));
      if (draftId === id) {
        setStep("input");
        setDraftId(null);
        setDraftContent("");
        setAnalysisResult(null);
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `drafts/${id}`);
    }
  };

  const handleUpdateDraftStatus = async (id: string, newStatus: string) => {
    try {
      const { updateDoc } = await import("firebase/firestore");
      await updateDoc(doc(db, "drafts", id), {
        status: newStatus,
        updatedAt: Date.now(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `drafts/${id}`);
    }
  };

  const handleShareWebsite = async () => {
    if (!user || !websiteToShare || !shareEmail) return;
    try {
      await updateDoc(doc(db, "websites", websiteToShare.id), {
        collaborators: arrayUnion(shareEmail),
      });
      toast.success(`Website shared with ${shareEmail}`);
      setIsShareOpen(false);
      setShareEmail("");
      setWebsiteToShare(null);
    } catch (error) {
      handleFirestoreError(
        error,
        OperationType.UPDATE,
        `websites/${websiteToShare.id}`,
      );
      toast.error("Failed to share website");
    }
  };

  const handleApplyRewrite = (original: string, rewrite: string, targetLocation?: string) => {
    const currentHtml = draftContent;

    // Attempt to find and replace the original text.
    if (currentHtml.includes(original)) {
      const newHtml = currentHtml.replace(original, rewrite);
      setDraftContent(newHtml);
    } else if (targetLocation) {
      // If original not found, try to find targetLocation and insert after it
      if (currentHtml.includes(targetLocation)) {
        const newHtml = currentHtml.replace(targetLocation, `${targetLocation}\n<p>${rewrite}</p>`);
        setDraftContent(newHtml);
      } else {
        // Fallback: Insert at cursor position
        setDraftContent(currentHtml + `\n<p><strong>Suggested Rewrite:</strong> ${rewrite}</p>`);
      }
    } else {
      // Fallback: Insert at cursor position
      setDraftContent(currentHtml + `\n<p><strong>Suggested Rewrite:</strong> ${rewrite}</p>`);
    }
  };

  const handleApplyLink = (anchorText: string, url: string) => {
    const currentHtml = draftContent;
    
    // Try to find the anchor text in the editor and wrap it with a link
    // This is a bit tricky with HTML, but let's try a simple replacement first
    if (currentHtml.includes(anchorText)) {
      const newHtml = currentHtml.replace(anchorText, `<a href="${url}">${anchorText}</a>`);
      setDraftContent(newHtml);
    } else {
      // Fallback: Insert at cursor position
      setDraftContent(currentHtml + `\n<a href="${url}">${anchorText}</a>`);
    }
  };

  const handleApplyEvidence = (
    content: string,
    source: string,
    sourceUrl: string,
    targetLocation?: string
  ) => {
    const evidenceHtml = `<blockquote><p>"${content}"</p><footer>— <a href="${sourceUrl}" target="_blank" rel="noreferrer">${source}</a></footer></blockquote>`;
    
    const currentHtml = draftContent;
    
    if (targetLocation && currentHtml.includes(targetLocation)) {
      const newHtml = currentHtml.replace(targetLocation, `${targetLocation}\n${evidenceHtml}`);
      setDraftContent(newHtml);
    } else {
      setDraftContent(currentHtml + `\n${evidenceHtml}`);
    }
  };

  const handleExportHTML = () => {
    const blob = new Blob([draftContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${draftTitle || "draft"}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportMarkdown = async () => {
    // Simple HTML to Markdown conversion for MVP
    // In a real app, use a library like turndown
    const markdown = draftContent
      .replace(/<h1>(.*?)<\/h1>/gi, "# $1\n\n")
      .replace(/<h2>(.*?)<\/h2>/gi, "## $1\n\n")
      .replace(/<h3>(.*?)<\/h3>/gi, "### $1\n\n")
      .replace(/<p>(.*?)<\/p>/gi, "$1\n\n")
      .replace(/<strong>(.*?)<\/strong>/gi, "**$1**")
      .replace(/<em>(.*?)<\/em>/gi, "*$1*")
      .replace(/<a href="(.*?)">(.*?)<\/a>/gi, "[$2]($1)")
      .replace(/<ul>(.*?)<\/ul>/gi, "$1\n")
      .replace(/<li>(.*?)<\/li>/gi, "- $1\n")
      .replace(/<[^>]*>?/gm, ""); // Remove remaining tags

    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${draftTitle || "draft"}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="flex justify-center">
            <div className="bg-blue-100 p-4 rounded-full">
              <Target className="h-10 w-10 text-blue-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-slate-900">
            SEO Content Strategist
          </h1>
          <p className="text-slate-500 text-lg">
            Manage your websites, categorize core links, and optimize content
            with AI.
          </p>
          <Button onClick={signIn} size="lg" className="w-full h-12 text-lg">
            Sign in with Google
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          {view === "workspace" && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setView("dashboard");
                setSelectedWebsite(null);
                setStep("input");
                setDraftId(null);
                setDraftTitle("");
                setDraftContent("");
                setTargetKeyword("");
                setAnalysisResult(null);
              }}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          )}
          <div className="flex items-center gap-2">
            <Target className="h-6 w-6 text-blue-600" />
            <h1 className="text-xl font-bold text-slate-900">
              {view === "workspace" && selectedWebsite
                ? selectedWebsite.name
                : "SEO Strategist"}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {view === "workspace" && step === "editor" && (
            <>
              <Button
                variant="outline"
                onClick={() => {
                  setStep("input");
                  setDraftId(null);
                  setDraftTitle("");
                  setDraftContent("");
                  setTargetKeyword("");
                  setAnalysisResult(null);
                }}
              >
                New Analysis
              </Button>
              <Button
                onClick={() => navigator.clipboard.writeText(draftContent)}
                className="gap-2"
              >
                <Copy className="h-4 w-4" />
                Copy Draft
              </Button>
            </>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground h-10 w-10">
              <UserIcon className="h-5 w-5 text-slate-600" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="text-slate-500 text-xs" disabled>
                {user.email}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={logOut}
                className="text-red-600 cursor-pointer"
              >
                <LogOut className="h-4 w-4 mr-2" /> Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <main className="flex-1 flex flex-col p-6 max-w-7xl mx-auto w-full">
        {view === "dashboard" && (
          <DashboardView
            websites={websites}
            setSelectedWebsite={(site) => {
              setSelectedWebsite(site);
              setView("workspace");
            }}
            setView={setView}
            isAddWebsiteOpen={isAddWebsiteOpen}
            setIsAddWebsiteOpen={setIsAddWebsiteOpen}
            newWebsiteName={newWebsiteName}
            setNewWebsiteName={setNewWebsiteName}
            newWebsiteUrl={newWebsiteUrl}
            setNewWebsiteUrl={setNewWebsiteUrl}
            newWebsiteBrandVoice={newWebsiteBrandVoice}
            setNewWebsiteBrandVoice={setNewWebsiteBrandVoice}
            handleAddWebsite={handleAddWebsite}
            handleDeleteWebsite={handleDeleteWebsite}
            setWebsiteToShare={setWebsiteToShare}
            isShareOpen={isShareOpen}
            setIsShareOpen={setIsShareOpen}
            shareEmail={shareEmail}
            setShareEmail={setShareEmail}
            handleShareWebsite={handleShareWebsite}
          />
        )}

        {view === "workspace" && selectedWebsite && (
          <Tabs defaultValue="optimizer" className="flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <TabsList>
                <TabsTrigger value="optimizer" className="gap-2">
                  <FileText className="h-4 w-4" /> SEO Optimizer
                </TabsTrigger>
                <TabsTrigger value="links" className="gap-2">
                  <LinkIcon className="h-4 w-4" /> Link Manager
                </TabsTrigger>
                <TabsTrigger value="drafts" className="gap-2">
                  <Save className="h-4 w-4" /> Saved Drafts
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="links" className="flex-1 m-0">
              <LinkManager
                selectedWebsite={selectedWebsite}
                links={links}
                isAddLinkOpen={isAddLinkOpen}
                setIsAddLinkOpen={setIsAddLinkOpen}
                newLinkUrl={newLinkUrl}
                setNewLinkUrl={setNewLinkUrl}
                newLinkCategory={newLinkCategory}
                setNewLinkCategory={setNewLinkCategory}
                newLinkTitle={newLinkTitle}
                setNewLinkTitle={setNewLinkTitle}
                handleAddLink={handleAddLink}
                handleDeleteLink={handleDeleteLink}
                handleImportSitemap={handleImportSitemap}
                isImportingSitemap={isImportingSitemap}
              />
            </TabsContent>

            <TabsContent value="drafts" className="flex-1 m-0">
              <DraftsBoard
                drafts={drafts}
                draftSearchQuery={draftSearchQuery}
                setDraftSearchQuery={setDraftSearchQuery}
                handleLoadDraft={handleLoadDraft}
                handleDeleteDraft={handleDeleteDraft}
                handleUpdateDraftStatus={handleUpdateDraftStatus}
              />
            </TabsContent>

            <TabsContent value="optimizer" className="flex-1 m-0 flex flex-col">
              {step === "input" && (
                <SEOOptimizerInput
                  selectedWebsite={selectedWebsite}
                  linksCount={links.length}
                  targetKeyword={targetKeyword}
                  setTargetKeyword={setTargetKeyword}
                  secondaryKeywords={secondaryKeywords}
                  setSecondaryKeywords={setSecondaryKeywords}
                  brandVoice={brandVoice}
                  setBrandVoice={setBrandVoice}
                  fetchUrl={fetchUrl}
                  setFetchUrl={setFetchUrl}
                  isFetchingUrl={isFetchingUrl}
                  handleFetchUrl={handleFetchUrl}
                  draftContent={draftContent}
                  setDraftContent={setDraftContent}
                  handleAnalyze={handleAnalyze}
                  error={error}
                />
              )}

              {step === "analyzing" && (
                <div className="flex-1 flex flex-col items-center justify-center space-y-6 py-20">
                  <div className="relative">
                    <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-75"></div>
                    <div className="relative bg-white p-4 rounded-full shadow-lg border border-slate-100">
                      <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
                    </div>
                  </div>
                  <div className="text-center space-y-2">
                    <h3 className="text-2xl font-bold text-slate-900">
                      Analyzing Your Content Ecosystem...
                    </h3>
                    <p className="text-slate-500 max-w-md mx-auto">
                      Evaluating E-E-A-T signals, mapping internal links,
                      finding expert quotes, and simulating Google&apos;s
                      ranking algorithm.
                    </p>
                  </div>
                  <div className="w-64 space-y-2 pt-4">
                    <Progress value={65} className="h-2" />
                    <p className="text-xs text-center text-slate-400 font-mono uppercase tracking-wider">
                      Processing NLP Models
                    </p>
                  </div>
                </div>
              )}

              {step === "editor" && analysisResult && (
                <SEOOptimizerEditor
                  draftId={draftId}
                  draftTitle={draftTitle}
                  setDraftTitle={setDraftTitle}
                  draftContent={draftContent}
                  setDraftContent={setDraftContent}
                  isAutoSaving={isAutoSaving}
                  lastSavedTime={lastSavedTime}
                  handleSaveDraft={handleSaveDraft}
                  handleExportHTML={handleExportHTML}
                  handleExportMarkdown={handleExportMarkdown}
                  analysisResult={analysisResult}
                  setAnalysisResult={setAnalysisResult}
                  wordCount={wordCount}
                  keywordDensity={keywordDensity}
                  brandVoice={brandVoice}
                  handleApplyRewrite={handleApplyRewrite}
                  handleApplyLink={handleApplyLink}
                  handleApplyEvidence={handleApplyEvidence}
                  handleSaveSnapshot={handleSaveSnapshot}
                  snapshots={snapshots}
                />
              )}
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  );
}
