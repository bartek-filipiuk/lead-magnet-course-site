import fs from "node:fs";
import path from "node:path";
import { marked } from "marked";
import lessons from "../data/lessons.json";

const lessonsDir = path.resolve(process.cwd(), "content/lekcje");

marked.setOptions({
  gfm: true,
  breaks: true
});

function stripFirstHeading(markdown) {
  return markdown.replace(/^#\s.+\n+/, "");
}

function slugify(input) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function normalizeLessonMarkdown(markdown) {
  const withoutHeading = stripFirstHeading(markdown);
  const lines = withoutHeading.split("\n");

  const withoutMeta = lines.filter(
    (line) =>
      !line.startsWith("**Subject line:**") &&
      !line.startsWith("**Preview text:**")
  );

  let start = 0;
  while (
    start < withoutMeta.length &&
    (withoutMeta[start].trim() === "" || withoutMeta[start].trim() === "---")
  ) {
    start += 1;
  }

  return withoutMeta.slice(start).join("\n").trim();
}

function addSectionAnchors(markdown) {
  const lines = markdown.split("\n");
  const toc = [];
  const seenIds = new Map();
  let inFence = false;

  const output = lines.map((line) => {
    if (line.trim().startsWith("```")) {
      inFence = !inFence;
      return line;
    }

    if (inFence) return line;

    const match = line.match(/^##\s+(.+)$/);
    if (!match) return line;

    const label = match[1]
      .replace(/\[(.*?)\]\(.*?\)/g, "$1")
      .replace(/[`*_~]/g, "")
      .trim();

    let id = slugify(label);
    if (!id) id = "sekcja";

    const count = seenIds.get(id) ?? 0;
    seenIds.set(id, count + 1);
    if (count > 0) id = `${id}-${count + 1}`;

    toc.push({ id, label });
    return `## <span id="${id}" class="anchor-target"></span>${match[1]}`;
  });

  return { markdown: output.join("\n"), toc };
}

function extractMeta(markdown) {
  const subject = markdown.match(/\*\*Subject line:\*\*\s*(.+)/)?.[1] ?? "";
  const preview = markdown.match(/\*\*Preview text:\*\*\s*(.+)/)?.[1] ?? "";
  return { subject, preview };
}

function getBySlug(slug) {
  const lesson = lessons.find((item) => item.slug === slug);
  if (!lesson) return null;

  const filePath = path.join(lessonsDir, lesson.file);
  const markdown = fs.readFileSync(filePath, "utf-8");
  const normalized = normalizeLessonMarkdown(markdown);
  const { markdown: anchoredMarkdown, toc } = addSectionAnchors(normalized);

  const meta = extractMeta(markdown);

  return {
    ...lesson,
    ...meta,
    markdown: anchoredMarkdown,
    html: marked.parse(anchoredMarkdown),
    toc
  };
}

export function getAllLessons() {
  return lessons
    .map((item) => getBySlug(item.slug))
    .filter(Boolean)
    .sort((a, b) => a.order - b.order);
}

export function getLessonBySlug(slug) {
  return getBySlug(slug);
}
