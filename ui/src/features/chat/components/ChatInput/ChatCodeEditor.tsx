/**
 * @license
 * Copyright 2026 a7mddra
 * SPDX-License-Identifier: Apache-2.0
 */

import type { KeyboardEvent, MutableRefObject } from "react";
import { CodeBlock } from "@/primitives";

interface ChatCodeEditorProps {
  editorRef: MutableRefObject<HTMLTextAreaElement | null>;
  isActive: boolean;
  language: string;
  value: string;
  isExpanded: boolean;
  onChange: (value: string) => void;
  onKeyDown: (e: KeyboardEvent<HTMLTextAreaElement>) => void;
}

export const ChatCodeEditor = ({
  editorRef,
  isActive,
  language,
  value,
  isExpanded,
  onChange,
  onKeyDown,
}: ChatCodeEditorProps) => {
  if (!isActive) {
    return null;
  }

  return (
    <CodeBlock
      ref={editorRef}
      language={language}
      value={value}
      isEditor={true}
      onChange={onChange}
      onKeyDown={onKeyDown}
      placeholder={`Enter ${language} code... (3 newlines to exit)`}
      style={{
        height: isExpanded ? "360px" : "auto",
        maxHeight: isExpanded ? "360px" : "240px",
      }}
    />
  );
};
