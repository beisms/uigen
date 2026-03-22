import { test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ToolCallBadge } from "../ToolCallBadge";

afterEach(() => {
  cleanup();
});

// str_replace_editor tests
test("shows 'Creating' label for str_replace_editor create command", () => {
  render(
    <ToolCallBadge
      toolName="str_replace_editor"
      args={{ command: "create", path: "src/components/Button.tsx" }}
      state="call"
    />
  );
  expect(screen.getByText("Creating Button.tsx")).toBeDefined();
});

test("shows 'Editing' label for str_replace_editor str_replace command", () => {
  render(
    <ToolCallBadge
      toolName="str_replace_editor"
      args={{ command: "str_replace", path: "src/App.tsx" }}
      state="call"
    />
  );
  expect(screen.getByText("Editing App.tsx")).toBeDefined();
});

test("shows 'Editing' label for str_replace_editor insert command", () => {
  render(
    <ToolCallBadge
      toolName="str_replace_editor"
      args={{ command: "insert", path: "src/index.ts" }}
      state="result"
    />
  );
  expect(screen.getByText("Editing index.ts")).toBeDefined();
});

test("shows 'Reading' label for str_replace_editor view command", () => {
  render(
    <ToolCallBadge
      toolName="str_replace_editor"
      args={{ command: "view", path: "src/utils/helpers.ts" }}
      state="call"
    />
  );
  expect(screen.getByText("Reading helpers.ts")).toBeDefined();
});

// file-manager tests
test("shows 'Renaming' label for file-manager rename command", () => {
  render(
    <ToolCallBadge
      toolName="file-manager"
      args={{ command: "rename", path: "src/Old.tsx", new_path: "src/New.tsx" }}
      state="call"
    />
  );
  expect(screen.getByText("Renaming Old.tsx to New.tsx")).toBeDefined();
});

test("shows 'Deleting' label for file-manager delete command", () => {
  render(
    <ToolCallBadge
      toolName="file-manager"
      args={{ command: "delete", path: "src/Unused.tsx" }}
      state="call"
    />
  );
  expect(screen.getByText("Deleting Unused.tsx")).toBeDefined();
});

// State indicator tests
test("shows spinner when state is 'call'", () => {
  const { container } = render(
    <ToolCallBadge
      toolName="str_replace_editor"
      args={{ command: "create", path: "src/App.tsx" }}
      state="call"
    />
  );
  expect(container.querySelector(".animate-spin")).toBeDefined();
});

test("does not show spinner when state is 'result'", () => {
  const { container } = render(
    <ToolCallBadge
      toolName="str_replace_editor"
      args={{ command: "create", path: "src/App.tsx" }}
      state="result"
    />
  );
  expect(container.querySelector(".animate-spin")).toBeNull();
});

test("uses filename from path, not full path", () => {
  render(
    <ToolCallBadge
      toolName="str_replace_editor"
      args={{ command: "create", path: "src/deeply/nested/Component.tsx" }}
      state="call"
    />
  );
  expect(screen.getByText("Creating Component.tsx")).toBeDefined();
});
