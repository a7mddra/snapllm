/**
 * @license
 * Copyright 2026 a7mddra
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from "react";
import type { ChangeEvent, KeyboardEvent, RefObject } from "react";

interface UseCodeBlockModeParams {
  value: string;
  onChange: (value: string) => void;
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  codeEditorRef: RefObject<HTMLTextAreaElement | null>;
}

export const useCodeBlockMode = ({
  value,
  onChange,
  textareaRef,
  codeEditorRef,
}: UseCodeBlockModeParams) => {
  const [isCodeBlockActive, setIsCodeBlockActive] = useState(false);
  const [codeLanguage, setCodeLanguage] = useState("");
  const [originalCodeLanguage, setOriginalCodeLanguage] = useState("");
  const [codeBlockDelimiter, setCodeBlockDelimiter] = useState("```");
  const [codeValue, setCodeValue] = useState("");
  const [consecutiveEnters, setConsecutiveEnters] = useState(0);

  useEffect(() => {
    if (isCodeBlockActive) {
      codeEditorRef.current?.focus();
    }
  }, [isCodeBlockActive, codeEditorRef]);

  const resetCodeBlockState = () => {
    setCodeValue("");
    setCodeLanguage("");
    setOriginalCodeLanguage("");
    setCodeBlockDelimiter("```");
    setConsecutiveEnters(0);
  };

  const handleMainChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    const cursorPos = e.target.selectionStart;

    const textBeforeCursor = newValue.slice(0, cursorPos);

    const match = textBeforeCursor.match(/(^|\n)(`{3,})([^\n]*)\n$/);

    if (match && !isCodeBlockActive) {
      const delimiter = match[2];
      const codeBlockCount = newValue.split(delimiter).length - 1;

      if (codeBlockCount % 2 === 1) {
        setIsCodeBlockActive(true);
        const lang = match[3];
        setOriginalCodeLanguage(lang);
        setCodeLanguage(lang || "text");
        setCodeBlockDelimiter(delimiter);

        const beforeBackticks = textBeforeCursor.replace(
          /(^|\n)(`{3,})([^\n]*)\n$/,
          "$1",
        );
        const afterCursor = newValue.slice(cursorPos);
        onChange(beforeBackticks + afterCursor);
      } else {
        onChange(newValue);
      }
    } else {
      onChange(newValue);
    }
  };

  const handleCodeKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      setIsCodeBlockActive(false);

      onChange(`${value}${codeBlockDelimiter}${originalCodeLanguage}\n`);
      resetCodeBlockState();
      setTimeout(() => {
        const ta = textareaRef.current;
        if (ta) {
          ta.focus();
          const end = ta.value.length;
          ta.setSelectionRange(end, end);
        }
      }, 0);
      return;
    }

    if (e.key === "Enter") {
      setConsecutiveEnters((prev) => prev + 1);
      if (consecutiveEnters >= 2) {
        setIsCodeBlockActive(false);

        const newPrompt = `${value}\n${codeBlockDelimiter}${codeLanguage}\n${codeValue.trim()}\n${codeBlockDelimiter}\n`;
        onChange(newPrompt);
        resetCodeBlockState();
        setTimeout(() => textareaRef.current?.focus(), 0);
      }
      return;
    }

    setConsecutiveEnters(0);
  };

  const exitCodeBlockAfterSubmit = () => {
    setIsCodeBlockActive(false);
    setCodeValue("");
  };

  return {
    isCodeBlockActive,
    codeLanguage,
    codeValue,
    setCodeValue,
    handleMainChange,
    handleCodeKeyDown,
    exitCodeBlockAfterSubmit,
  };
};
