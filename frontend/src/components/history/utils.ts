import { Commit, CommitType } from "../commits/types";

function displayHistoryItemType(itemType: CommitType) {
  switch (itemType) {
    case "ai_create":
      return "Create";
    case "ai_edit":
      return "Edit";
    case "code_create":
      return "Imported from code";
    default: {
      const exhaustiveCheck: never = itemType;
      throw new Error(`Unhandled case: ${exhaustiveCheck}`);
    }
  }
}

const setParentVersion = (commit: Commit, history: Commit[]) => {
  // If the commit has no parent, return null
  if (!commit.parentHash) return null;

  const parentIndex = history.findIndex(
    (item) => item.hash === commit.parentHash
  );
  const currentIndex = history.findIndex((item) => item.hash === commit.hash);

  // Only set parent version if the parent is not the previous commit
  // and parent exists
  return parentIndex !== -1 && parentIndex != currentIndex - 1
    ? parentIndex + 1
    : null;
};

function extractTagName(html: string): string {
  const match = html.match(/^<(\w+)/);
  return match ? match[1].toLowerCase() : "element";
}

export function summarizeHistoryItem(commit: Commit): string {
  const commitType = commit.type;
  switch (commitType) {
    case "ai_create":
      return "Create";
    case "ai_edit":
      return commit.inputs.text || "Edit";
    case "code_create":
      return "Imported from code";
    default: {
      const exhaustiveCheck: never = commitType;
      throw new Error(`Unhandled case: ${exhaustiveCheck}`);
    }
  }
}

export function getSelectedElementTag(commit: Commit): string | null {
  if (commit.type === "code_create") return null;
  const html = commit.inputs.selectedElementHtml;
  if (!html) return null;
  return extractTagName(html);
}

export const renderHistory = (history: Commit[]) => {
  const renderedHistory = [];

  for (let i = 0; i < history.length; i++) {
    const commit = history[i];
    renderedHistory.push({
      ...commit,
      type: displayHistoryItemType(commit.type),
      summary: summarizeHistoryItem(commit),
      selectedElementTag: getSelectedElementTag(commit),
      parentVersion: setParentVersion(commit, history),
    });
  }

  return renderedHistory;
};
