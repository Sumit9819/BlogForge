import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import type { AnyNode } from 'domhandler';

function normalizeText(input: string): string {
  return input
    .replace(/\u00a0/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractBestArticleText($: cheerio.CheerioAPI): string {
  const prioritySelectors = [
    'article [itemprop="articleBody"]',
    '[itemprop="articleBody"]',
    'article',
    'main article',
    '.post-content',
    '.entry-content',
    '.article-content',
    '.blog-content',
    '.content__article-body',
    '.single-post-content',
    'main',
  ];

  let bestText = '';
  let bestScore = 0;

  for (const selector of prioritySelectors) {
    $(selector).each((_: number, el: AnyNode) => {
      const block = $(el);
      const paragraphText = block
        .find('p')
        .map((__: number, p: AnyNode) => normalizeText($(p).text()))
        .get()
        .filter((t: string) => t.length > 40)
        .join('\n\n');

      const blockText = normalizeText(block.text());
      const linkTextLen = normalizeText(block.find('a').text()).length;
      const textToUse = paragraphText || blockText;
      if (!textToUse) return;

      const textLen = textToUse.length;
      const linkDensity = textLen > 0 ? linkTextLen / textLen : 1;
      const headingBonus = block.find('h1, h2, h3').length * 120;
      const paragraphBonus = block.find('p').length * 60;
      const score = textLen + headingBonus + paragraphBonus - linkDensity * 1500;

      if (score > bestScore) {
        bestScore = score;
        bestText = textToUse;
      }
    });
  }

  if (!bestText) {
    const paragraphFallback = $('body p')
      .map((_: number, p: AnyNode) => normalizeText($(p).text()))
      .get()
      .filter((t: string) => t.length > 40)
      .join('\n\n');

    return paragraphFallback || normalizeText($('body').text());
  }

  return bestText;
}

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    const response = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.statusText}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Remove unnecessary elements
    $('script, style, nav, footer, header, aside, noscript, svg, form, iframe').remove();

    // Remove common non-article blocks that frequently pollute extracted text.
    $('.comments, .comment, .related, .related-posts, .newsletter, .subscribe, .share, .social').remove();

    const content = extractBestArticleText($);

    const title =
      normalizeText($('meta[property="og:title"]').attr('content') || '') ||
      normalizeText($('h1').first().text()) ||
      normalizeText($('title').text());

    if (!content || content.length < 120) {
      return NextResponse.json(
        { error: 'Could not extract blog content from this URL.' },
        { status: 422 }
      );
    }

    return NextResponse.json({ 
      title, 
      content 
    });
  } catch (error: any) {
    console.error('Fetch URL error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch URL' }, { status: 500 });
  }
}
