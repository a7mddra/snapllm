/**
 * @license
 * Copyright 2026 a7mddra
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useLayoutEffect, useState } from "react";
import type { RefObject } from "react";

interface UseChatInputResizeParams {
  value: string;
  isExpanded: boolean;
  isCodeBlockActive: boolean;
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  shadowRef: RefObject<HTMLTextAreaElement | null>;
}

export const useChatInputResize = ({
  value,
  isExpanded,
  isCodeBlockActive,
  textareaRef,
  shadowRef,
}: UseChatInputResizeParams) => {
  const [showExpandButton, setShowExpandButton] = useState(false);

  const resizeTextarea = useCallback(() => {
    const textarea = textareaRef.current;
    const shadow = shadowRef.current;
    if (!textarea || !shadow) return;

    shadow.value = value;

    const lineHeight = 24;
    const maxLines = isExpanded ? 15 : 10;
    const maxHeight = lineHeight * maxLines;

    const width = textarea.getBoundingClientRect().width || textarea.clientWidth;
    shadow.style.width = `${width}px`;

    shadow.style.height = "0px";
    const scrollHeight = shadow.scrollHeight;

    const minHeight = 32;
    const newHeight = Math.max(Math.min(scrollHeight, maxHeight), minHeight);
    textarea.style.height = `${newHeight}px`;

    setShowExpandButton(isCodeBlockActive || scrollHeight > lineHeight * 10);

    if (
      document.activeElement === textarea &&
      textarea.selectionStart >= textarea.value.length
    ) {
      if (textarea.scrollHeight > textarea.clientHeight) {
        textarea.scrollTop = textarea.scrollHeight;
      }
    }
  }, [value, isExpanded, isCodeBlockActive, textareaRef, shadowRef]);

  useLayoutEffect(() => {
    const raf = requestAnimationFrame(() => resizeTextarea());
    return () => cancelAnimationFrame(raf);
  }, [value, isExpanded, resizeTextarea]);

  return { showExpandButton };
};
