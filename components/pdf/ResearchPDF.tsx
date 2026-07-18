import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Svg,
  Rect,
  Circle,
  Line,
  Defs,
  LinearGradient,
  Stop,
} from "@react-pdf/renderer";

/* ------------------------------------------------------------------ */
/*  PALETTE                                                           */
/* ------------------------------------------------------------------ */
const COLORS = {
  navy: "#0b1220",
  navySoft: "#0f172a",
  slate900: "#0f172a",
  slate800: "#1e293b",
  slate700: "#334155",
  slate600: "#475569",
  slate500: "#64748b",
  slate400: "#94a3b8",
  slate300: "#cbd5e1",
  slate200: "#e2e8f0",
  slate100: "#f1f5f9",
  slate50: "#f8fafc",
  blue700: "#1d4ed8",
  blue600: "#2563eb",
  blue500: "#3b82f6",
  indigo600: "#4f46e5",
  indigo500: "#6366f1",
  gold: "#c9a227",
  white: "#ffffff",
  codeBg: "#0b1220",
  codeBar: "#151f30",
};

const styles = StyleSheet.create({
  /* ---------------------------- Cover Page ---------------------------- */
  coverPage: {
    paddingTop: 0,
    paddingBottom: 0,
    paddingHorizontal: 0,
    backgroundColor: COLORS.white,
    fontFamily: "Times-Roman",
    height: "100%",
    position: "relative",
  },
  coverInner: {
    paddingTop: 86,
    paddingBottom: 54,
    paddingHorizontal: 50,
    height: "100%",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  coverContent: {
    marginTop: 34,
    flexDirection: "column",
  },
  coverBrandRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 26,
  },
  coverBrandDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.blue600,
    marginRight: 7,
  },
  coverBrand: {
    fontSize: 9,
    fontWeight: "bold",
    color: COLORS.blue700,
    letterSpacing: 3,
    textTransform: "uppercase",
  },
  coverTitle: {
    fontSize: 30,
    fontWeight: "bold",
    color: COLORS.navySoft,
    lineHeight: 1.22,
    marginBottom: 18,
    maxWidth: 460,
  },
  coverLine: {
    width: 68,
    height: 3,
    borderRadius: 2,
    backgroundColor: COLORS.blue600,
    marginBottom: 28,
  },
  coverBriefCard: {
    backgroundColor: COLORS.slate50,
    borderLeftWidth: 2.5,
    borderLeftColor: COLORS.blue600,
    borderRadius: 4,
    paddingVertical: 14,
    paddingHorizontal: 16,
    maxWidth: 470,
  },
  coverSubtitleLabel: {
    fontSize: 7.5,
    fontWeight: "bold",
    color: COLORS.slate500,
    letterSpacing: 1.4,
    marginBottom: 7,
    textTransform: "uppercase",
  },
  coverSubtitle: {
    fontSize: 10.5,
    color: COLORS.slate700,
    lineHeight: 1.6,
  },
  coverMetaWrap: {
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.slate200,
    backgroundColor: COLORS.slate50,
    paddingVertical: 16,
    paddingHorizontal: 18,
  },
  coverMetaTitle: {
    fontSize: 7,
    fontWeight: "bold",
    color: COLORS.slate400,
    letterSpacing: 1.4,
    textTransform: "uppercase",
    marginBottom: 12,
  },
  coverMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  coverMetaCol: {
    flex: 1,
    paddingRight: 12,
    marginRight: 12,
    borderRightWidth: 1,
    borderRightColor: COLORS.slate200,
  },
  coverMetaColLast: {
    flex: 1,
  },
  coverMetaLabel: {
    fontSize: 6.8,
    color: COLORS.slate500,
    fontWeight: "bold",
    letterSpacing: 0.6,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  coverMetaVal: {
    fontSize: 10.5,
    fontWeight: "bold",
    color: COLORS.navySoft,
  },
  coverFooterRow: {
    marginTop: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  coverFooterText: {
    fontSize: 7.5,
    color: COLORS.slate400,
    letterSpacing: 0.3,
  },
  coverBadge: {
    borderWidth: 1,
    borderColor: COLORS.gold,
    borderRadius: 3,
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  coverBadgeText: {
    fontSize: 6.8,
    fontWeight: "bold",
    color: COLORS.gold,
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },

  /* --------------------------- Content Pages --------------------------- */
  contentPage: {
    paddingTop: 68,
    paddingBottom: 62,
    paddingHorizontal: 46,
    backgroundColor: COLORS.white,
    fontFamily: "Times-Roman",
  },
  header: {
    position: "absolute",
    top: 26,
    left: 46,
    right: 46,
    paddingBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeftRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: COLORS.blue600,
    marginRight: 6,
  },
  headerLeft: {
    fontSize: 7.5,
    color: COLORS.slate600,
    fontWeight: "bold",
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  headerRightPill: {
    borderWidth: 1,
    borderColor: COLORS.slate200,
    borderRadius: 8,
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  headerRight: {
    fontSize: 6.8,
    color: COLORS.slate500,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    fontWeight: "bold",
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  sectionHeaderBar: {
    width: 3,
    height: 11,
    backgroundColor: COLORS.blue600,
    borderRadius: 1.5,
    marginRight: 7,
  },
  sectionHeader: {
    fontSize: 8.5,
    fontWeight: "bold",
    color: COLORS.blue700,
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  contentBody: {
    marginTop: 2,
  },

  /* ----------------------------- Markdown ------------------------------ */
  h1Wrap: {
    marginTop: 13,
    marginBottom: 7,
  },
  h1: {
    fontSize: 15,
    fontWeight: "bold",
    color: COLORS.navySoft,
    marginBottom: 5,
  },
  h1Underline: {
    width: 34,
    height: 2.5,
    borderRadius: 1.5,
    backgroundColor: COLORS.blue600,
  },
  h2: {
    fontSize: 12.5,
    fontWeight: "bold",
    color: COLORS.slate800,
    marginTop: 10,
    marginBottom: 6,
  },
  h3: {
    fontSize: 10.8,
    fontWeight: "bold",
    color: COLORS.slate700,
    marginTop: 8,
    marginBottom: 4,
  },
  paragraph: {
    fontSize: 9.6,
    color: COLORS.slate700,
    lineHeight: 1.55,
    marginBottom: 7,
  },
  blockquote: {
    flexDirection: "row",
    backgroundColor: "#eef2ff",
    borderLeftWidth: 3,
    borderLeftColor: COLORS.indigo600,
    paddingVertical: 9,
    paddingHorizontal: 12,
    marginVertical: 9,
    borderRadius: 4,
    alignItems: "flex-start",
  },
  blockquoteMark: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.indigo500,
    marginRight: 6,
    lineHeight: 1,
  },
  blockquoteText: {
    fontSize: 9,
    color: "#3730a3",
    fontStyle: "italic",
    lineHeight: 1.5,
    flex: 1,
  },
  codeBlock: {
    backgroundColor: COLORS.codeBg,
    borderRadius: 5,
    marginVertical: 9,
    overflow: "hidden",
  },
  codeBar: {
    backgroundColor: COLORS.codeBar,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 5,
    paddingHorizontal: 9,
  },
  codeDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    marginRight: 4,
  },
  codeBarLabel: {
    marginLeft: 6,
    fontSize: 6.5,
    color: "#64748b",
    letterSpacing: 1,
    textTransform: "uppercase",
    fontWeight: "bold",
  },
  codeBody: {
    padding: 10,
  },
  infoPanel: {
    backgroundColor: "#f5f8ff",
    borderWidth: 1,
    borderColor: "#dbe4fb",
    borderRadius: 6,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginVertical: 9,
  },
  infoPanelTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 9,
  },
  infoPanelTitleBar: {
    width: 3,
    height: 9,
    backgroundColor: COLORS.blue600,
    borderRadius: 1.5,
    marginRight: 6,
  },
  infoPanelTitle: {
    fontSize: 8,
    fontWeight: "bold",
    color: COLORS.blue700,
    letterSpacing: 1.4,
    textTransform: "uppercase",
  },
  infoPanelGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  infoPanelChip: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: "#e0e7ff",
    borderRadius: 4,
    paddingVertical: 4.5,
    paddingHorizontal: 8,
    marginRight: 6,
    marginBottom: 6,
  },
  infoPanelChipText: {
    fontSize: 7.7,
    color: COLORS.slate700,
    lineHeight: 1.3,
  },
  codeText: {
    fontFamily: "Courier",
    fontSize: 8,
    color: "#e2e8f0",
    lineHeight: 1.45,
  },
  inlineCode: {
    fontFamily: "Courier",
    fontSize: 8.5,
    backgroundColor: COLORS.slate100,
    color: "#b45309",
    paddingHorizontal: 3,
    borderRadius: 2,
  },
  link: {
    color: COLORS.blue600,
    textDecoration: "underline",
  },
  listItem: {
    flexDirection: "row",
    marginBottom: 4,
    paddingLeft: 4,
  },
  bulletUl: {
    width: 14,
    fontSize: 9,
    fontWeight: "bold",
    color: COLORS.blue600,
  },
  bulletOlBadge: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#e0e7ff",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 3,
    marginTop: 0.5,
  },
  bulletOlText: {
    fontSize: 6.8,
    fontWeight: "bold",
    color: COLORS.indigo600,
  },
  listItemText: {
    flex: 1,
    fontSize: 9.5,
    color: COLORS.slate700,
    lineHeight: 1.48,
  },
  hrWrap: {
    marginVertical: 10,
    alignItems: "center",
  },
  footer: {
    position: "absolute",
    bottom: 22,
    left: 46,
    right: 46,
    borderTopWidth: 1,
    borderTopColor: COLORS.slate100,
    paddingTop: 9,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerLeft: {
    fontSize: 7.3,
    color: COLORS.slate400,
  },
  footerPageBadge: {
    borderWidth: 1,
    borderColor: COLORS.slate200,
    borderRadius: 8,
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  footerRight: {
    fontSize: 7.3,
    color: COLORS.slate500,
    fontWeight: "bold",
  },

  /* ------------------------------ Table --------------------------------- */
  table: {
    marginVertical: 11,
    borderWidth: 1,
    borderColor: COLORS.slate300,
    borderRadius: 5,
    overflow: "hidden",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.slate200,
    minHeight: 22,
    alignItems: "flex-start",
  },
  tableRowHeader: {
    flexDirection: "row",
    backgroundColor: COLORS.navySoft,
    minHeight: 24,
    alignItems: "flex-start",
  },
  tableCellHeader: {
    fontSize: 7.8,
    fontWeight: "bold",
    color: COLORS.white,
    letterSpacing: 0.3,
    textTransform: "uppercase",
  },
  tableCell: {
    fontSize: 7.6,
    color: COLORS.slate700,
    lineHeight: 1.35,
  },
});

/* ------------------------------------------------------------------ */
/*  TYPES  (unchanged)                                                 */
/* ------------------------------------------------------------------ */
interface ResearchPDFProps {
  research: {
    title: string;
    prompt: string;
    content: string;
    model: string | null;
    tokens: number | null;
    generationTime: number | null;
    createdAt: Date;
  };
}

interface Block {
  type: "h1" | "h2" | "h3" | "paragraph" | "blockquote" | "code" | "ul" | "ol" | "hr" | "table";
  text: string;
  items?: string[];
  headers?: string[];
  rows?: string[][];
}

/* ------------------------------------------------------------------ */
/*  GLYPH SANITIZER                                                    */
/* ------------------------------------------------------------------ */
/*
 * The base-14 PDF fonts only support the WinAnsi character set. When the
 * source markdown contains emoji or pictographic icons (🎯 💰 ⭐ → 🔴 etc.),
 * the PDF renderer has no glyph for them and silently substitutes garbage
 * characters instead — that's what produced strings like "=¡", "¼", "4",
 * "<" in earlier exports. This sanitizer swaps the handful of common icons
 * for clean text equivalents, then strips anything else outside the
 * supported range so nothing renders as a broken glyph.
 *
 * NOTE on ampersands: only a *run* of 2+ consecutive "&" characters is
 * treated as a decorative ASCII-art border and stripped. A single "&" is
 * always left alone, because that's virtually always a real conjunction
 * ("Design & Development", "Cache & Pub/Sub") — stripping those silently
 * deletes words from the report, which is worse than the border-glyph
 * problem it was meant to solve.
 */
function sanitizeText(input: string): string {
  if (!input) return "";
  let t = input;

  // Strip only decorative multi-ampersand borders (e.g. "&&&&&" dividers).
  // A lone "&" is real text and must never be touched.
  t = t.replace(/&{2,}/g, " ");

  // Common meaningful symbols -> readable text equivalents
  t = t.replace(/[\u2713\u2714\u2705]/g, "-"); // check marks
  t = t.replace(/[\u2192\u27A1\u2794\u279C]/g, "->"); // arrows
  t = t.replace(/[\u2605\u2b50]/g, "*"); // stars
  t = t.replace(/[\u2022\u25CF\u25AA\u25E6\u2043]/g, "\u2022"); // normalize bullets to a plain dot

  // Strip emoji / pictographs / dingbats / misc symbol blocks entirely
  t = t.replace(/[\u{1F000}-\u{1FFFF}]/gu, "");
  t = t.replace(/[\u2190-\u21FF]/g, ""); // remaining arrows
  t = t.replace(/[\u2300-\u27BF]/g, ""); // misc technical, dingbats, misc symbols
  t = t.replace(/[\uFE00-\uFE0F]/g, ""); // variation selectors

  // Final safety net: keep only WinAnsi-safe Latin/punctuation, drop the rest
  t = t.replace(/[^\x09\x0A\x0D\x20-\x7E\u00A0-\u017F\u2013\u2014\u2018\u2019\u201C\u201D\u2022\u2026]/g, "");

  // Collapse whitespace left behind by stripped icons/borders
  t = t.replace(/[ \t]{2,}/g, " ").trim();

  return t;
}

/*
 * AI-generated reports sometimes wrap decorative ASCII/emoji "infographic"
 * panels (user-base grids, SWOT boxes, pricing tiers, tech-stack banners)
 * in triple-backtick fences even though they aren't real code. Rendering
 * those as a literal code block looks broken once the emoji are stripped
 * (lots of dead whitespace, a "CODE" label over what's really a labelled
 * list). This heuristic tells the two apart so each renders appropriately.
 */
function looksLikeCode(text: string): boolean {
  const codeKeywords =
    /\b(function|const|let|var|import|export|class|def|return|SELECT|INSERT|UPDATE|DELETE|#include|public\s+class|=>)\b/;
  if (codeKeywords.test(text)) return true;
  const symbolCount = (text.match(/[{}\[\];<>]/g) || []).length;
  const density = symbolCount / Math.max(text.length, 1);
  return density > 0.02;
}

/* ------------------------------------------------------------------ */
/*  INLINE PARSER  (parsing logic unchanged, sanitized before render)  */
/* ------------------------------------------------------------------ */
function parseInline(rawText: string): React.ReactNode[] {
  const text = sanitizeText(rawText);
  if (!text) return [];
  const pattern = /(\*\*.*?\*\*|__.*?__|`.*?`|\[.*?\]\(.*?\)|(?:\*[^*]+\*)|(?:_[^_]+_))/g;
  const parts = text.split(pattern);

  return parts.map((part, index) => {
    if (!part) return null;

    // Bold
    if ((part.startsWith("**") && part.endsWith("**")) || (part.startsWith("__") && part.endsWith("__"))) {
      const inner = part.slice(2, -2);
      return (
        <Text key={index} style={{ fontWeight: "bold" }}>
          {inner}
        </Text>
      );
    }

    // Inline Code
    if (part.startsWith("`") && part.endsWith("`")) {
      const inner = part.slice(1, -1);
      return (
        <Text key={index} style={styles.inlineCode}>
          {inner}
        </Text>
      );
    }

    // Link
    if (part.startsWith("[") && part.includes("](")) {
      const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
      if (linkMatch) {
        return (
          <Text key={index} style={styles.link}>
            {linkMatch[1]}
          </Text>
        );
      }
    }

    // Italic
    if ((part.startsWith("*") && part.endsWith("*")) || (part.startsWith("_") && part.endsWith("_"))) {
      const inner = part.slice(1, -1);
      return (
        <Text key={index} style={{ fontStyle: "italic" }}>
          {inner}
        </Text>
      );
    }

    return part;
  }).filter(Boolean) as React.ReactNode[];
}

/* ------------------------------------------------------------------ */
/*  BLOCK PARSER  (unchanged logic)                                    */
/* ------------------------------------------------------------------ */
function parseMarkdownToReactPDF(content: string): React.ReactNode[] {
  if (!content) return [];
  const lines = content.split("\n");
  const blocks: Block[] = [];
  let inCodeBlock = false;
  let codeContent: string[] = [];
  let currentList: { type: "ul" | "ol"; items: string[] } | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Code Block
    if (trimmed.startsWith("```")) {
      if (inCodeBlock) {
        blocks.push({
          type: "code",
          text: codeContent.join("\n"),
        });
        codeContent = [];
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) {
      codeContent.push(line);
      continue;
    }

    // Table detection
    if (trimmed.startsWith("|")) {
      if (currentList) {
        blocks.push({ type: currentList.type, text: "", items: currentList.items });
        currentList = null;
      }

      const tableLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        tableLines.push(lines[i].trim());
        i++;
      }
      i--;

      if (tableLines.length >= 1) {
        const headerRaw = tableLines[0];
        const headers = headerRaw
          .split("|")
          .map(s => s.trim())
          .filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);

        const rows: string[][] = [];
        let startIndex = 1;
        if (tableLines.length > 1) {
          const secondLineClean = tableLines[1].replace(/[:-\s]/g, "");
          if (secondLineClean === "||" || secondLineClean === "|" || secondLineClean === "") {
            startIndex = 2;
          }
        }

        for (let j = startIndex; j < tableLines.length; j++) {
          const rowRaw = tableLines[j];
          const rowData = rowRaw
            .split("|")
            .map(s => s.trim())
            .filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);

          if (rowData.length > 0) {
            rows.push(rowData);
          }
        }

        blocks.push({
          type: "table",
          text: "",
          headers,
          rows,
        });
      }
      continue;
    }

    // HR
    if (trimmed === "---" || trimmed === "***" || trimmed === "___") {
      if (currentList) {
        blocks.push({ type: currentList.type, text: "", items: currentList.items });
        currentList = null;
      }
      blocks.push({ type: "hr", text: "" });
      continue;
    }

    // Headings
    const h1Match = line.match(/^#\s+(.*)/);
    if (h1Match) {
      if (currentList) {
        blocks.push({ type: currentList.type, text: "", items: currentList.items });
        currentList = null;
      }
      blocks.push({ type: "h1", text: h1Match[1] });
      continue;
    }

    const h2Match = line.match(/^##\s+(.*)/);
    if (h2Match) {
      if (currentList) {
        blocks.push({ type: currentList.type, text: "", items: currentList.items });
        currentList = null;
      }
      blocks.push({ type: "h2", text: h2Match[1] });
      continue;
    }

    const h3Match = line.match(/^###\s+(.*)/);
    if (h3Match) {
      if (currentList) {
        blocks.push({ type: currentList.type, text: "", items: currentList.items });
        currentList = null;
      }
      blocks.push({ type: "h3", text: h3Match[1] });
      continue;
    }

    // Blockquote
    const bqMatch = line.match(/^>\s*(.*)/);
    if (bqMatch) {
      if (currentList) {
        blocks.push({ type: currentList.type, text: "", items: currentList.items });
        currentList = null;
      }
      const lastBlock = blocks[blocks.length - 1];
      if (lastBlock && lastBlock.type === "blockquote") {
        lastBlock.text += "\n" + bqMatch[1];
      } else {
        blocks.push({ type: "blockquote", text: bqMatch[1] });
      }
      continue;
    }

    // Lists
    const ulMatch = line.match(/^[-*+]\s+(.*)/);
    if (ulMatch) {
      if (currentList && currentList.type === "ul") {
        currentList.items.push(ulMatch[1]);
      } else {
        if (currentList) {
          blocks.push({ type: currentList.type, text: "", items: currentList.items });
        }
        currentList = { type: "ul", items: [ulMatch[1]] };
      }
      continue;
    }

    const olMatch = line.match(/^\d+\.\s+(.*)/);
    if (olMatch) {
      if (currentList && currentList.type === "ol") {
        currentList.items.push(olMatch[1]);
      } else {
        if (currentList) {
          blocks.push({ type: currentList.type, text: "", items: currentList.items });
        }
        currentList = { type: "ol", items: [olMatch[1]] };
      }
      continue;
    }

    // Empty Line
    if (!trimmed) {
      if (currentList) {
        blocks.push({ type: currentList.type, text: "", items: currentList.items });
        currentList = null;
      }
      continue;
    }

    // Plain Paragraph
    if (currentList) {
      blocks.push({ type: currentList.type, text: "", items: currentList.items });
      currentList = null;
    }

    const lastBlock = blocks[blocks.length - 1];
    if (lastBlock && lastBlock.type === "paragraph") {
      lastBlock.text += " " + trimmed;
    } else {
      blocks.push({ type: "paragraph", text: trimmed });
    }
  }

  if (currentList) {
    blocks.push({ type: currentList.type, text: "", items: currentList.items });
  }

  /* -------------------------- RENDER (styled) -------------------------- */
  return blocks.map((block, index) => {
    switch (block.type) {
      case "h1":
        return (
          <View key={index} style={styles.h1Wrap} minPresenceAhead={24} wrap={false}>
            <Text style={styles.h1}>{parseInline(block.text)}</Text>
            <View style={styles.h1Underline} />
          </View>
        );
      case "h2":
        return (
          <View key={index} minPresenceAhead={20} wrap={false}>
            <Text style={styles.h2}>{parseInline(block.text)}</Text>
          </View>
        );
      case "h3":
        return (
          <View key={index} minPresenceAhead={16} wrap={false}>
            <Text style={styles.h3}>{parseInline(block.text)}</Text>
          </View>
        );
      case "paragraph":
        return (
          <Text key={index} style={styles.paragraph}>
            {parseInline(block.text)}
          </Text>
        );
      case "blockquote":
        return (
          <View key={index} style={styles.blockquote} wrap={false}>
            <Text style={styles.blockquoteMark}>&#8220;</Text>
            <Text style={styles.blockquoteText}>{parseInline(block.text)}</Text>
          </View>
        );
      case "code": {
        if (!looksLikeCode(block.text)) {
          // Decorative infographic block (icon grids, SWOT/tier banners, etc.)
          // Break into clean lines, drop anything that sanitizes to nothing.
          const rawLines = block.text.split("\n").map(l => sanitizeText(l)).filter(Boolean);

          let title: string | null = null;
          let bodyLines = rawLines;
          if (
            bodyLines.length > 1 &&
            bodyLines[0].length <= 60 &&
            bodyLines[0] === bodyLines[0].toUpperCase()
          ) {
            title = bodyLines[0];
            bodyLines = bodyLines.slice(1);
          }

          const chips: string[] = [];
          bodyLines.forEach(line => {
            line
              .split(/\s*\u2022\s*/) // split on the normalized bullet dot
              .map(s => s.trim())
              .filter(Boolean)
              .forEach(part => chips.push(part));
          });

          if (!title && chips.length === 0) return null;

          return (
            <View key={index} style={styles.infoPanel} wrap={false}>
              {title && (
                <View style={styles.infoPanelTitleRow}>
                  <View style={styles.infoPanelTitleBar} />
                  <Text style={styles.infoPanelTitle}>{title}</Text>
                </View>
              )}
              <View style={styles.infoPanelGrid}>
                {chips.map((chip, i) => (
                  <View key={i} style={styles.infoPanelChip}>
                    <Text style={styles.infoPanelChipText}>{chip}</Text>
                  </View>
                ))}
              </View>
            </View>
          );
        }

        // Genuine code — keep original whitespace/indentation, only strip
        // stray emoji/pictograph glyphs (never trim/collapse real code).
        const cleanCode = block.text
          .replace(/[\u{1F000}-\u{1FFFF}]/gu, "")
          .replace(/[\u2300-\u27BF]/g, "");
        return (
          <View key={index} style={styles.codeBlock} wrap={false}>
            <View style={styles.codeBar}>
              <View style={[styles.codeDot, { backgroundColor: "#ef4444" }]} />
              <View style={[styles.codeDot, { backgroundColor: "#f59e0b" }]} />
              <View style={[styles.codeDot, { backgroundColor: "#22c55e" }]} />
              <Text style={styles.codeBarLabel}>CODE</Text>
            </View>
            <View style={styles.codeBody}>
              <Text style={styles.codeText}>{cleanCode}</Text>
            </View>
          </View>
        );
      }
      case "ul":
        return (
          <View key={index} style={{ marginBottom: 9 }}>
            {block.items?.map((item, idx) => (
              <View key={idx} style={styles.listItem} wrap={false}>
                <Text style={styles.bulletUl}>&#8226;</Text>
                <Text style={styles.listItemText}>{parseInline(item)}</Text>
              </View>
            ))}
          </View>
        );
      case "ol":
        return (
          <View key={index} style={{ marginBottom: 9 }}>
            {block.items?.map((item, idx) => (
              <View key={idx} style={styles.listItem} wrap={false}>
                <View style={styles.bulletOlBadge}>
                  <Text style={styles.bulletOlText}>{idx + 1}</Text>
                </View>
                <Text style={styles.listItemText}>{parseInline(item)}</Text>
              </View>
            ))}
          </View>
        );
      case "table": {
        const numCols = block.headers?.length || 1;
        return (
          <View key={index} style={styles.table}>
            {/* Header */}
            <View style={styles.tableRowHeader}>
              {block.headers?.map((header, idx) => (
                <View key={idx} style={{ width: `${100 / numCols}%`, padding: 6 }}>
                  <Text style={styles.tableCellHeader}>{parseInline(header)}</Text>
                </View>
              ))}
            </View>
            {/* Rows */}
            {block.rows?.map((row, rowIdx) => (
              <View
                key={rowIdx}
                style={[
                  styles.tableRow,
                  {
                    backgroundColor: rowIdx % 2 === 0 ? COLORS.white : COLORS.slate50,
                    borderBottomWidth: rowIdx === (block.rows!.length - 1) ? 0 : 1,
                  },
                ]}
              >
                {row.map((cell, cellIdx) => (
                  <View key={cellIdx} style={{ width: `${100 / numCols}%`, padding: 6 }}>
                    <Text style={styles.tableCell}>{parseInline(cell || "")}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        );
      }
      case "hr":
        return (
          <View key={index} style={styles.hrWrap}>
            <Svg width="100%" height="2">
              <Defs>
                <LinearGradient id={`hrGrad${index}`} x1="0" y1="0" x2="1" y2="0">
                  <Stop offset="0" stopColor={COLORS.blue600} stopOpacity={0} />
                  <Stop offset="0.5" stopColor={COLORS.blue600} stopOpacity={0.6} />
                  <Stop offset="1" stopColor={COLORS.blue600} stopOpacity={0} />
                </LinearGradient>
              </Defs>
              <Rect x="0" y="0" width="100%" height="2" fill={`url(#hrGrad${index})`} />
            </Svg>
          </View>
        );
      default:
        return null;
    }
  });
}

/* ------------------------------------------------------------------ */
/*  DOCUMENT                                                           */
/* ------------------------------------------------------------------ */
export default function ResearchPDF({ research }: ResearchPDFProps) {
  return (
    <Document>
      {/* ---------------------- Page 1: Premium Cover ---------------------- */}
      <Page size="A4" style={styles.coverPage}>
        {/* Gradient top banner */}
        <Svg style={{ position: "absolute", top: 0, left: 0 }} width="100%" height="14">
          <Defs>
            <LinearGradient id="topBanner" x1="0" y1="0" x2="1" y2="0">
              <Stop offset="0" stopColor={COLORS.blue700} />
              <Stop offset="1" stopColor={COLORS.indigo600} />
            </LinearGradient>
          </Defs>
          <Rect x="0" y="0" width="100%" height="14" fill="url(#topBanner)" />
        </Svg>

        {/* Decorative geometric circles, top right */}
        <Svg
          style={{ position: "absolute", top: 40, right: 0 }}
          width="220"
          height="220"
          viewBox="0 0 220 220"
        >
          <Circle cx="200" cy="20" r="90" fill={COLORS.blue600} fillOpacity={0.05} />
          <Circle cx="200" cy="20" r="55" fill={COLORS.indigo600} fillOpacity={0.06} />
          <Circle cx="150" cy="70" r="4" fill={COLORS.blue600} fillOpacity={0.35} />
          <Circle cx="170" cy="95" r="2.5" fill={COLORS.indigo600} fillOpacity={0.35} />
        </Svg>

        <View style={styles.coverInner}>
          {/* Title block */}
          <View style={styles.coverContent}>
            <View style={styles.coverBrandRow}>
              <View style={styles.coverBrandDot} />
              <Text style={styles.coverBrand}>BuilderOS AI Suite</Text>
            </View>

            <Text style={styles.coverTitle}>{sanitizeText(research.title)}</Text>
            <View style={styles.coverLine} />

            <View style={styles.coverBriefCard}>
              <Text style={styles.coverSubtitleLabel}>Research Brief &amp; Inquiry</Text>
              <Text style={styles.coverSubtitle}>{sanitizeText(research.prompt)}</Text>
            </View>
          </View>

          {/* Metadata + footer block */}
          <View>
            <View style={styles.coverMetaWrap}>
              <Text style={styles.coverMetaTitle}>Report Metadata</Text>
              <View style={styles.coverMeta}>
                <View style={styles.coverMetaCol}>
                  <Text style={styles.coverMetaLabel}>AI Model</Text>
                  <Text style={styles.coverMetaVal}>{sanitizeText(research.model ?? "BuilderOS AI")}</Text>
                </View>
                <View style={styles.coverMetaCol}>
                  <Text style={styles.coverMetaLabel}>Tokens Used</Text>
                  <Text style={styles.coverMetaVal}>{research.tokens ?? 0}</Text>
                </View>
                <View style={styles.coverMetaCol}>
                  <Text style={styles.coverMetaLabel}>Gen Time</Text>
                  <Text style={styles.coverMetaVal}>{research.generationTime ?? 0}s</Text>
                </View>
                <View style={styles.coverMetaColLast}>
                  <Text style={styles.coverMetaLabel}>Date Created</Text>
                  <Text style={styles.coverMetaVal}>
                    {new Date(research.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.coverFooterRow}>
              <Text style={styles.coverFooterText}>
                Generated automatically &bull; BuilderOS AI Research Engine
              </Text>
              <View style={styles.coverBadge}>
                <Text style={styles.coverBadgeText}>Premium Report</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Gradient bottom banner */}
        <Svg style={{ position: "absolute", bottom: 0, left: 0 }} width="100%" height="7">
          <Defs>
            <LinearGradient id="bottomBanner" x1="0" y1="0" x2="1" y2="0">
              <Stop offset="0" stopColor={COLORS.navySoft} />
              <Stop offset="1" stopColor={COLORS.slate800} />
            </LinearGradient>
          </Defs>
          <Rect x="0" y="0" width="100%" height="7" fill="url(#bottomBanner)" />
        </Svg>
      </Page>

      {/* ---------------------- Page 2+: Content ---------------------- */}
      <Page size="A4" style={styles.contentPage}>
        {/* Running Header */}
        <View style={styles.header} fixed>
          <View style={styles.headerLeftRow}>
            <View style={styles.headerDot} />
            <Text style={styles.headerLeft}>BuilderOS AI Research Report</Text>
          </View>
          <View style={styles.headerRightPill}>
            <Text style={styles.headerRight}>Confidential</Text>
          </View>
        </View>

        {/* Report Content Body */}
        <View style={styles.contentBody}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionHeaderBar} />
            <Text style={styles.sectionHeader}>Research Analysis</Text>
          </View>
          {parseMarkdownToReactPDF(research.content)}
        </View>

        {/* Running Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerLeft}>
            &#169; {new Date().getFullYear()} BuilderOS. All rights reserved.
          </Text>
          <View style={styles.footerPageBadge}>
            <Text
              style={styles.footerRight}
              render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
            />
          </View>
        </View>
      </Page>
    </Document>
  );
}
