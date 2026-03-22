"use client";

import { Loader2, FilePlus, Pencil, Eye, FileX, FolderEdit, CheckCircle2 } from "lucide-react";

interface ToolCallBadgeProps {
  toolName: string;
  args: Record<string, unknown>;
  state: "call" | "partial-call" | "result";
}

function getFileName(path: unknown): string {
  return String(path ?? "file").split("/").pop() || String(path ?? "file");
}

function getLabel(toolName: string, args: Record<string, unknown>): { text: string; Icon: React.ElementType } {
  const filename = getFileName(args.path);

  if (toolName === "str_replace_editor") {
    switch (args.command) {
      case "create":
        return { text: `Creating ${filename}`, Icon: FilePlus };
      case "str_replace":
      case "insert":
        return { text: `Editing ${filename}`, Icon: Pencil };
      case "view":
        return { text: `Reading ${filename}`, Icon: Eye };
      default:
        return { text: `Editing ${filename}`, Icon: Pencil };
    }
  }

  if (toolName === "file-manager") {
    switch (args.command) {
      case "rename": {
        const newFilename = getFileName(args.new_path);
        return { text: `Renaming ${filename} to ${newFilename}`, Icon: FolderEdit };
      }
      case "delete":
        return { text: `Deleting ${filename}`, Icon: FileX };
      default:
        return { text: `Managing ${filename}`, Icon: Pencil };
    }
  }

  return { text: toolName, Icon: Pencil };
}

export function ToolCallBadge({ toolName, args, state }: ToolCallBadgeProps) {
  const { text, Icon } = getLabel(toolName, args);
  const isDone = state === "result";

  return (
    <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-neutral-50 rounded-lg text-xs border border-neutral-200">
      {isDone ? (
        <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
      ) : (
        <Loader2 className="w-3 h-3 animate-spin text-blue-600 shrink-0" />
      )}
      <Icon className="w-3 h-3 text-neutral-500 shrink-0" />
      <span className="text-neutral-700">{text}</span>
    </div>
  );
}
