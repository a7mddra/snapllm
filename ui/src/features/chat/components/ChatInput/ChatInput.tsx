/**
 * @license
 * Copyright 2026 a7mddra
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useLayoutEffect, useRef, useState } from "react";
import { TextContextMenu } from "@/shell";
import { useTextContextMenu, useTextEditor } from "@/hooks";
import { CollapseIcon, ExpandIcon } from "./ChatInputIcons";
import { ChatCodeEditor } from "./ChatCodeEditor";
import { ChatInputActions } from "./ChatInputActions";
import { ChatTextArea } from "./ChatTextArea";
import { useChatInputResize } from "./hooks/useChatInputResize";
import { useCodeBlockMode } from "./hooks/useCodeBlockMode";
import type { ChatInputProps } from "./types";
import styles from "./ChatInput.module.css";

export const ChatInput: React.FC<ChatInputProps> = ({
  startupImage,
  input: value,
  onInputChange: onChange,
  onSend,
  isLoading,
  isAiTyping = false,
  isStoppable = false,
  onStopGeneration,
  placeholder: customPlaceholder,
  variant = "default",
  selectedModel,
  onModelChange,
}) => {
  if (!startupImage) return null;

  const placeholder = customPlaceholder || "Ask anything";
  const disabled = isLoading && !isAiTyping;

  const [isExpanded, setIsExpanded] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const shadowRef = useRef<HTMLTextAreaElement>(null);
  const codeEditorRef = useRef<HTMLTextAreaElement>(null);

  const {
    isCodeBlockActive,
    codeLanguage,
    codeValue,
    setCodeValue,
    handleMainChange,
    handleCodeKeyDown,
    exitCodeBlockAfterSubmit,
  } = useCodeBlockMode({
    value,
    onChange,
    textareaRef,
    codeEditorRef,
  });

  const { showExpandButton } = useChatInputResize({
    value,
    isExpanded,
    isCodeBlockActive,
    textareaRef,
    shadowRef,
  });

  const handleSubmit = () => {
    if (
      !disabled &&
      !isLoading &&
      (value.trim().length > 0 || codeValue.trim().length > 0)
    ) {
      onSend();
      exitCodeBlockAfterSubmit();
    }
  };

  const {
    ref: editorRef,
    handleKeyDown: editorKeyDown,
    hasSelection,
    handleCopy,
    handleCut,
    handlePaste,
    handleSelectAll,
    undo,
    redo,
  } = useTextEditor({
    value,
    onChange: (newValue) => {
      onChange(newValue);
    },
    onSubmit: handleSubmit,
    preventNewLine: false,
  });

  useLayoutEffect(() => {
    if (editorRef.current instanceof HTMLTextAreaElement) {
      textareaRef.current = editorRef.current;
    }
  }, [editorRef]);

  const {
    data: contextMenuData,
    handleContextMenu,
    handleClose: handleCloseContextMenu,
  } = useTextContextMenu();

  const containerContent = (
    <div
      className={`${styles.container} ${disabled && !isStoppable ? styles.disabled : ""} ${
        variant === "transparent" ? styles.transparentVariant : ""
      }`}
    >
      <div className={styles.topRow}>
        {showExpandButton && (
          <button
            className={styles.expandButton}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <CollapseIcon /> : <ExpandIcon />}
          </button>
        )}
      </div>

      <ChatTextArea
        editorRef={editorRef}
        textareaRef={textareaRef}
        shadowRef={shadowRef}
        value={value}
        disabled={disabled}
        isCodeBlockActive={isCodeBlockActive}
        placeholder={placeholder}
        onChange={handleMainChange}
        onKeyDown={editorKeyDown}
        onContextMenu={handleContextMenu}
      />

      {contextMenuData.isOpen && !isCodeBlockActive && (
        <TextContextMenu
          x={contextMenuData.x}
          y={contextMenuData.y}
          onClose={handleCloseContextMenu}
          onCopy={handleCopy}
          onCut={handleCut}
          onPaste={handlePaste}
          onSelectAll={handleSelectAll}
          onUndo={undo}
          onRedo={redo}
          hasSelection={hasSelection}
        />
      )}

      <ChatCodeEditor
        editorRef={codeEditorRef}
        isActive={isCodeBlockActive}
        language={codeLanguage}
        value={codeValue}
        isExpanded={isExpanded}
        onChange={setCodeValue}
        onKeyDown={handleCodeKeyDown}
      />

      <ChatInputActions
        value={value}
        codeValue={codeValue}
        disabled={disabled}
        isLoading={isLoading}
        isAiTyping={isAiTyping}
        isStoppable={isStoppable}
        selectedModel={selectedModel}
        onModelChange={onModelChange}
        onInputChange={onChange}
        onSubmit={handleSubmit}
        onStopGeneration={onStopGeneration}
      />
    </div>
  );

  if (variant === "transparent") {
    return containerContent;
  }

  return (
    <footer className={styles.footer}>
      <div className={styles.inputWrapper}>{containerContent}</div>
    </footer>
  );
};

export default ChatInput;
