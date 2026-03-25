import fs from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();
const contentDir = path.join(rootDir, 'content', 'experience');
const outputPath = path.join(rootDir, 'assets', 'data', 'experience.json');

function parseFrontmatter(source) {
  const normalized = source.replace(/\r\n/g, '\n');

  if (!normalized.startsWith('---\n')) {
    return { data: {}, body: normalized.trim() };
  }

  const endIndex = normalized.indexOf('\n---\n', 4);

  if (endIndex === -1) {
    return { data: {}, body: normalized.trim() };
  }

  const frontmatter = normalized.slice(4, endIndex).trim();
  const body = normalized.slice(endIndex + 5).trim();
  const data = {};

  frontmatter.split('\n').forEach((line) => {
    const separatorIndex = line.indexOf(':');

    if (separatorIndex === -1) {
      return;
    }

    const key = line.slice(0, separatorIndex).trim();
    let value = line.slice(separatorIndex + 1).trim();

    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    if (value === 'true') {
      data[key] = true;
      return;
    }

    if (value === 'false') {
      data[key] = false;
      return;
    }

    if (/^-?\d+(\.\d+)?$/.test(value)) {
      data[key] = Number(value);
      return;
    }

    data[key] = value;
  });

  return { data, body };
}

function escapeHtml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function parseInlineMarkdown(text) {
  let html = escapeHtml(text);

  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');

  return html;
}

function markdownToHtml(markdown) {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const blocks = [];
  let paragraph = [];
  let list = [];

  function flushParagraph() {
    if (paragraph.length === 0) {
      return;
    }

    const text = paragraph.join(' ').trim();
    blocks.push(`<p>${parseInlineMarkdown(text)}</p>`);
    paragraph = [];
  }

  function flushList() {
    if (list.length === 0) {
      return;
    }

    const items = list.map((item) => `<li>${parseInlineMarkdown(item)}</li>`).join('');
    blocks.push(`<ul class="timeline-bullets">${items}</ul>`);
    list = [];
  }

  lines.forEach((line) => {
    const trimmed = line.trim();

    if (!trimmed) {
      flushParagraph();
      flushList();
      return;
    }

    if (trimmed.startsWith('- ')) {
      flushParagraph();
      list.push(trimmed.slice(2).trim());
      return;
    }

    if (trimmed.startsWith('## ')) {
      flushParagraph();
      flushList();
      blocks.push(`<h3>${parseInlineMarkdown(trimmed.slice(3).trim())}</h3>`);
      return;
    }

    paragraph.push(trimmed);
  });

  flushParagraph();
  flushList();

  return blocks.join('\n');
}

function readExperienceEntries() {
  const filenames = fs.readdirSync(contentDir).filter((name) => name.endsWith('.md'));

  return filenames.map((filename) => {
    const filePath = path.join(contentDir, filename);
    const source = fs.readFileSync(filePath, 'utf8');
    const { data, body } = parseFrontmatter(source);

    if (!data.title || !data.date || !data.year || !data.role || !data.summary) {
      throw new Error(`Missing required frontmatter in ${filename}`);
    }

    return {
      slug: filename.replace(/\.md$/, ''),
      title: String(data.title),
      role: String(data.role),
      date: String(data.date),
      year: String(data.year),
      summary: String(data.summary),
      image: data.image ? String(data.image) : '',
      thumbnail: data.thumbnail ? String(data.thumbnail) : (data.image ? String(data.image) : ''),
      sort: Number.isFinite(data.sort) ? data.sort : 0,
      active: Boolean(data.active),
      bodyHtml: markdownToHtml(body)
    };
  }).sort((left, right) => {
    if (left.sort !== right.sort) {
      return right.sort - left.sort;
    }

    return right.year.localeCompare(left.year);
  });
}

const entries = readExperienceEntries();

fs.writeFileSync(
  outputPath,
  `${JSON.stringify(entries, null, 2)}\n`,
  'utf8'
);

console.log(`Wrote ${entries.length} experience entries to ${path.relative(rootDir, outputPath)}`);
