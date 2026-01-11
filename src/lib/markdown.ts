import { remark } from 'remark';
import html from 'remark-html';
import gfm from 'remark-gfm';

export async function markdownToHtml(markdown: string): Promise<string> {
  const result = await remark()
    .use(gfm) // GitHub Flavored Markdown
    .use(html, { sanitize: false })
    .process(markdown);

  return result.toString();
}
