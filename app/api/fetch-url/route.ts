import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.statusText}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Remove unnecessary elements
    $('script, style, nav, footer, header, aside, noscript').remove();

    // Try to find the main content
    let content = $('article').text();
    if (!content) {
      content = $('main').text();
    }
    if (!content) {
      content = $('body').text();
    }

    // Clean up whitespace
    content = content.replace(/\s+/g, ' ').trim();

    const title = $('title').text().trim();

    return NextResponse.json({ 
      title, 
      content 
    });
  } catch (error: any) {
    console.error('Fetch URL error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch URL' }, { status: 500 });
  }
}
