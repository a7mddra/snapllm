/**
 * @license
 * Copyright 2026 a7mddra
 * SPDX-License-Identifier: Apache-2.0
 */

import type { ChangeEvent, KeyboardEvent, MouseEvent, MutableRefObject } from "react";
import styles from "./ChatInput.module.css";

interface ChatTextAreaProps {
  editorRef: MutableRefObject<HTMLTextAreaElement | HTMLInputElement | null>;
  textareaRef: MutableRefObject<HTMLTextAreaElement | null>;
  shadowRef: MutableRefObject<HTMLTextAreaElement | null>;
  value: string;
  disabled: boolean;
  isCodeBlockActive: boolean;
  placeholder: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyDown: (e: KeyboardEvent<HTMLTextAreaElement>) => void;
  onContextMenu: (e: MouseEvent<HTMLTextAreaElement>) => void;
}

export const ChatTextArea = ({
  editorRef,
  textareaRef,
  shadowRef,
  value,
  disabled,
  isCodeBlockActive,
  placeholder,
  onChange,
  onKeyDown,
  onContextMenu,
}: ChatTextAreaProps) => (
  <div className={styles.inputArea}>
    {!isCodeBlockActive && value.length === 0 && (
      <div className={styles.customPlaceholder}>{placeholder}</div>
    )}
    <textarea
      ref={shadowRef}
      className={`${styles.textarea} ${styles.shadow}`}
      value={value}
      readOnly
      aria-hidden="true"
      tabIndex={-1}
      rows={1}
    />

    <textarea
      ref={(el) => {
        editorRef.current = el;
        textareaRef.current = el;
      }}
      className={styles.textarea}
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      disabled={disabled}
      rows={1}
      style={{ display: isCodeBlockActive ? "none" : undefined }}
      onContextMenu={onContextMenu}
    />
  </div>
);
