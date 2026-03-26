"use client";

import { Plus, Globe, FileText, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type CoreLink = {
  id: string;
  userId: string;
  websiteId: string;
  url: string;
  category: string;
  title: string;
  createdAt: number;
};

interface LinkManagerProps {
  selectedWebsite: { name: string; id: string };
  links: CoreLink[];
  isAddLinkOpen: boolean;
  setIsAddLinkOpen: (open: boolean) => void;
  newLinkUrl: string;
  setNewLinkUrl: (url: string) => void;
  newLinkCategory: string;
  setNewLinkCategory: (category: string) => void;
  newLinkTitle: string;
  setNewLinkTitle: (title: string) => void;
  handleAddLink: () => void;
  handleDeleteLink: (id: string) => void;
  handleImportSitemap: () => void;
  isImportingSitemap: boolean;
}

export function LinkManager({
  selectedWebsite,
  links,
  isAddLinkOpen,
  setIsAddLinkOpen,
  newLinkUrl,
  setNewLinkUrl,
  newLinkCategory,
  setNewLinkCategory,
  newLinkTitle,
  setNewLinkTitle,
  handleAddLink,
  handleDeleteLink,
  handleImportSitemap,
  isImportingSitemap,
}: LinkManagerProps) {
  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
        <div>
          <CardTitle>Core Links</CardTitle>
          <CardDescription>
            Manage internal links for {selectedWebsite.name}. These will be used
            automatically in the SEO Optimizer.
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleImportSitemap}
            disabled={isImportingSitemap}
          >
            {isImportingSitemap ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Globe className="h-4 w-4 mr-2" />
            )}
            Import Sitemap
          </Button>
          <Dialog open={isAddLinkOpen} onOpenChange={setIsAddLinkOpen}>
            <DialogTrigger render={<Button size="sm" className="gap-2" />}>
              <Plus className="h-4 w-4" /> Add Link
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Core Link</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select
                    value={newLinkCategory}
                    onValueChange={(val) => val && setNewLinkCategory(val)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Blog">Blog Post</SelectItem>
                      <SelectItem value="Service">Service Page</SelectItem>
                      <SelectItem value="Product">Product Page</SelectItem>
                      <SelectItem value="About">About/Company</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>URL</Label>
                  <Input
                    placeholder="https://..."
                    leftIcon={<Globe className="h-4 w-4" />}
                    value={newLinkUrl}
                    onChange={(e) => setNewLinkUrl(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Title / Topic (Optional)</Label>
                  <Input
                    placeholder="e.g., Digital Marketing Services"
                    leftIcon={<FileText className="h-4 w-4" />}
                    value={newLinkTitle}
                    onChange={(e) => setNewLinkTitle(e.target.value)}
                  />
                </div>
                <Button onClick={handleAddLink} className="w-full">
                  Save Link
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {links.length === 0 ? (
          <div className="p-8 text-center text-slate-500">No links added yet.</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>URL</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {links.map((link) => (
                <TableRow key={link.id}>
                  <TableCell>
                    <Badge variant="outline">{link.category}</Badge>
                  </TableCell>
                  <TableCell className="font-medium">{link.title || "-"}</TableCell>
                  <TableCell className="text-slate-500 max-w-[300px] truncate">
                    {link.url}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() => handleDeleteLink(link.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
