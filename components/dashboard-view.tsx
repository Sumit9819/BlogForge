"use client";

import { Plus, Globe, FileText, Mic, Share2, Trash2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type Website = {
  id: string;
  userId: string;
  name: string;
  url: string;
  collaborators?: string[];
  brandVoice?: string;
  createdAt: number;
};

interface DashboardViewProps {
  websites: Website[];
  isAddWebsiteOpen: boolean;
  setIsAddWebsiteOpen: (open: boolean) => void;
  newWebsiteName: string;
  setNewWebsiteName: (name: string) => void;
  newWebsiteUrl: string;
  setNewWebsiteUrl: (url: string) => void;
  newWebsiteBrandVoice: string;
  setNewWebsiteBrandVoice: (voice: string) => void;
  handleAddWebsite: () => void;
  handleDeleteWebsite: (id: string) => void;
  setSelectedWebsite: (site: Website) => void;
  setView: (view: "dashboard" | "workspace") => void;
  setIsShareOpen: (open: boolean) => void;
  setWebsiteToShare: (site: Website) => void;
  isShareOpen: boolean;
  shareEmail: string;
  setShareEmail: (email: string) => void;
  handleShareWebsite: () => void;
}

export function DashboardView({
  websites,
  isAddWebsiteOpen,
  setIsAddWebsiteOpen,
  newWebsiteName,
  setNewWebsiteName,
  newWebsiteUrl,
  setNewWebsiteUrl,
  newWebsiteBrandVoice,
  setNewWebsiteBrandVoice,
  handleAddWebsite,
  handleDeleteWebsite,
  setSelectedWebsite,
  setView,
  setIsShareOpen,
  setWebsiteToShare,
  isShareOpen,
  shareEmail,
  setShareEmail,
  handleShareWebsite,
}: DashboardViewProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Your Websites</h2>
          <p className="text-slate-500">
            Select a website to manage links and optimize content.
          </p>
        </div>
        <Dialog open={isAddWebsiteOpen} onOpenChange={setIsAddWebsiteOpen}>
          <DialogTrigger render={<Button className="gap-2" />}>
            <Plus className="h-4 w-4" /> Add Website
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Website</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Website Name</Label>
                <Input
                  placeholder="e.g., My Tech Blog"
                  leftIcon={<FileText className="h-4 w-4" />}
                  value={newWebsiteName}
                  onChange={(e) => setNewWebsiteName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Base URL</Label>
                <Input
                  placeholder="https://example.com"
                  leftIcon={<Globe className="h-4 w-4" />}
                  value={newWebsiteUrl}
                  onChange={(e) => setNewWebsiteUrl(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Brand Voice (Optional)</Label>
                <Input
                  placeholder="e.g., Authoritative, conversational, witty"
                  leftIcon={<Mic className="h-4 w-4" />}
                  value={newWebsiteBrandVoice}
                  onChange={(e) => setNewWebsiteBrandVoice(e.target.value)}
                />
              </div>
              <Button onClick={handleAddWebsite} className="w-full">
                Save Website
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {websites.length === 0 ? (
        <Card className="border-dashed border-2 bg-transparent">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Globe className="h-12 w-12 text-slate-300 mb-4" />
            <h3 className="text-lg font-medium text-slate-900">No websites yet</h3>
            <p className="text-slate-500 mb-4">
              Add your first website to start optimizing content.
            </p>
            <Button variant="outline" onClick={() => setIsAddWebsiteOpen(true)}>
              Add Website
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {websites.map((site) => (
            <Card
              key={site.id}
              className="hover:border-blue-300 transition-colors cursor-pointer group"
              onClick={() => {
                setSelectedWebsite(site);
                setView("workspace");
              }}
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center justify-between">
                  {site.name}
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-0 group-hover:opacity-100 text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                      onClick={(e) => {
                        e.stopPropagation();
                        setWebsiteToShare(site);
                        setIsShareOpen(true);
                      }}
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteWebsite(site.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardTitle>
                <CardDescription className="truncate">{site.url}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}

      {/* Share Dialog */}
      <Dialog open={isShareOpen} onOpenChange={setIsShareOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Website</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Collaborator Email</Label>
              <Input
                placeholder="colleague@example.com"
                leftIcon={<Users className="h-4 w-4" />}
                value={shareEmail}
                onChange={(e) => setShareEmail(e.target.value)}
              />
            </div>
            <Button onClick={handleShareWebsite} className="w-full">
              Share
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
