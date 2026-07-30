"use client";

import React from "react";
import Challenge from "./Challenge";

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  // Regex to split content by `<Challenge ... />` elements
  const parts = content.split(/(<Challenge[\s\S]*?\/>)/g);

  return (
    <div className="space-y-5">
      {parts.map((part, index) => {
        if (part.trim().startsWith("<Challenge")) {
          // Extract attributes using regex
          const idMatch = part.match(/id="([^"]*?)"/);
          const correctAnswerMatch = part.match(/correctAnswer="([^"]*?)"/);
          const placeholderMatch = part.match(/placeholder="([^"]*?)"/);

          const id = idMatch ? idMatch[1] : `challenge-${index}`;
          const correctAnswer = correctAnswerMatch ? correctAnswerMatch[1] : "";
          const placeholder = placeholderMatch ? placeholderMatch[1] : "Enter answer...";

          return (
            <Challenge
              key={index}
              id={id}
              correctAnswer={correctAnswer}
              placeholder={placeholder}
            />
          );
        }

        // Render Markdown content
        return <MarkdownBlock key={index} text={part} />;
      })}
    </div>
  );
}

function MarkdownBlock({ text }: { text: string }) {
  if (!text) return null;

  const lines = text.split("\n");
  let inCodeBlock = false;
  let codeContent: string[] = [];

  const elements: React.ReactNode[] = [];

  lines.forEach((line, index) => {
    // Code block toggle
    if (line.trim().startsWith("```")) {
      if (inCodeBlock) {
        // Close code block
        elements.push(
          <pre key={`code-${index}`} className="bg-[#0D1321] p-5 border border-slate-800 rounded-lg font-mono text-xs overflow-x-auto text-[#E2E8F0] my-5">
            <code>{codeContent.join("\n")}</code>
          </pre>
        );
        codeContent = [];
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
      }
      return;
    }

    if (inCodeBlock) {
      codeContent.push(line);
      return;
    }

    const trimmed = line.trim();

    // Headings
    if (trimmed.startsWith("# ")) {
      elements.push(
        <h1 key={index} className="text-3xl font-extrabold text-white mt-8 mb-4 border-b border-slate-800 pb-2 tracking-tight">
          {parseInlineMarkdown(trimmed.slice(2))}
        </h1>
      );
    } else if (trimmed.startsWith("## ")) {
      elements.push(
        <h2 key={index} className="text-2xl font-bold text-white mt-6 mb-3 tracking-tight">
          {parseInlineMarkdown(trimmed.slice(3))}
        </h2>
      );
    } else if (trimmed.startsWith("### ")) {
      elements.push(
        <h3 key={index} className="text-lg font-semibold text-white mt-5 mb-2.5 tracking-tight">
          {parseInlineMarkdown(trimmed.slice(4))}
        </h3>
      );
    }
    // Lists
    else if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      elements.push(
        <ul key={index} className="list-disc pl-6 text-sm my-1 text-slate-300 font-medium">
          <li className="pl-1.5">{parseInlineMarkdown(trimmed.slice(2))}</li>
        </ul>
      );
    }
    // Line breaks / separators
    else if (trimmed === "---") {
      elements.push(<hr key={index} className="border-slate-800 my-8" />);
    }
    // Standard paragraphs
    else if (trimmed) {
      elements.push(
        <p key={index} className="text-sm leading-relaxed my-3.5 text-slate-300 font-medium">
          {parseInlineMarkdown(line)}
        </p>
      );
    }
  });

  return <>{elements}</>;
}

// Simple inline parser for bold **text**, `code` tags, etc.
function parseInlineMarkdown(text: string) {
  // Simple replacement of **bold** and `code`
  const boldRegex = /\*\*(.*?)\*\*/g;
  const inlineCodeRegex = /`(.*?)`/g;

  // Split and map
  let parts: React.ReactNode[] = [text];

  // Map bold
  parts = parts.flatMap((part) => {
    if (typeof part !== "string") return part;
    const pieces = part.split(boldRegex);
    return pieces.map((piece, i) => (i % 2 === 1 ? <strong key={`b-${i}`} className="text-white font-extrabold">{piece}</strong> : piece));
  });

  // Map inline code
  parts = parts.flatMap((part) => {
    if (typeof part !== "string") return part;
    const pieces = part.split(inlineCodeRegex);
    return pieces.map((piece, i) => (i % 2 === 1 ? <code key={`c-${i}`} className="bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded text-indigo-300 font-mono text-xs">{piece}</code> : piece));
  });

  return <>{parts}</>;
}
