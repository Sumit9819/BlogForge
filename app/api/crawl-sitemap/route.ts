import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    const allLinks = new Set<string>();
    const visitedSitemaps = new Set<string>();
    const sitemapsToProcess: string[] = [];

    // Initial validation and setup
    let initialUrl = url;
    if (!initialUrl.endsWith('.xml')) {
      const urlObj = new URL(initialUrl);
      initialUrl = `${urlObj.origin}/sitemap.xml`;
    }
    sitemapsToProcess.push(initialUrl);

    // Process sitemaps recursively (up to a reasonable limit)
    let processedCount = 0;
    const MAX_SITEMAPS = 10; // Limit to prevent abuse
    const MAX_TOTAL_LINKS = 500;

    while (sitemapsToProcess.length > 0 && processedCount < MAX_SITEMAPS) {
      const currentSitemapUrl = sitemapsToProcess.shift()!;
      if (visitedSitemaps.has(currentSitemapUrl)) continue;
      
      visitedSitemaps.add(currentSitemapUrl);
      processedCount++;

      try {
        const response = await fetch(currentSitemapUrl);
        if (!response.ok) continue;

        const xmlText = await response.text();
        const locRegex = /<loc>(.*?)<\/loc>/g;
        let match;

        while ((match = locRegex.exec(xmlText)) !== null) {
          if (match[1]) {
            const link = match[1].trim();
            
            if (link.endsWith('.xml')) {
              // It's a nested sitemap
              if (!visitedSitemaps.has(link)) {
                sitemapsToProcess.push(link);
              }
            } else {
              // It's a content link
              allLinks.add(link);
            }
          }
          
          if (allLinks.size >= MAX_TOTAL_LINKS) break;
        }
      } catch (e) {
        console.error(`Error processing sitemap ${currentSitemapUrl}:`, e);
      }

      if (allLinks.size >= MAX_TOTAL_LINKS) break;
    }

    return NextResponse.json({ links: Array.from(allLinks) });
  } catch (error: any) {
    console.error('Sitemap crawl error:', error);
    return NextResponse.json({ error: error.message || 'Failed to crawl sitemap' }, { status: 500 });
  }
}
