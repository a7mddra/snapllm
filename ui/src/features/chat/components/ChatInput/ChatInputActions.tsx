/**
 * @license
 * Copyright 2026 a7mddra
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useMemo, useRef, useState } from "react";
import { Paperclip, ArrowUp, Square, Camera } from "lucide-react";
import { MODELS } from "@/lib/config";
import { Tooltip } from "@/primitives/tooltip/Tooltip";
import {
  Dropdown,
  DropdownItem,
  DropdownSectionTitle,
} from "@/primitives/dropdown";
import { VoiceInput } from "../VoiceInput/VoiceInput";
import styles from "./ChatInput.module.css";

const GEMINI_MODELS = MODELS.map((m) => ({
  id: m.id,
  label: m.name,
  triggerLabel: m.name.replace("Gemini ", ""),
}));

interface ChatInputActionsProps {
  value: string;
  codeValue: string;
  disabled: boolean;
  isLoading: boolean;
  isAiTyping: boolean;
  isStoppable: boolean;
  selectedModel: string;
  onModelChange: (model: string) => void;
  onInputChange: (value: string) => void;
  onSubmit: () => void;
  onStopGeneration?: () => void;
}

export const ChatInputActions = ({
  value,
  codeValue,
  disabled,
  isLoading,
  isAiTyping,
  isStoppable,
  selectedModel,
  onModelChange,
  onInputChange,
  onSubmit,
  onStopGeneration,
}: ChatInputActionsProps) => {
  const [showFileButtonTooltip, setShowFileButtonTooltip] = useState(false);
  const [showKeepProgressTooltip, setShowKeepProgressTooltip] = useState(false);
  const [aiMenuOpen, setAiMenuOpen] = useState(false);
  const fileButtonRef = useRef<HTMLButtonElement>(null);
  const keepProgressInfoRef = useRef<HTMLButtonElement>(null);

  const selectedModelLabel =
    GEMINI_MODELS.find((m) => m.id === selectedModel)?.triggerLabel || "Auto";

  const isButtonActive = useMemo(
    () =>
      !disabled &&
      !isLoading &&
      (value.trim().length > 0 || codeValue.trim().length > 0),
    [codeValue, disabled, isLoading, value],
  );

  const handleModelSelect = useCallback(
    (id: string) => {
      onModelChange(id);
      setAiMenuOpen(false);
    },
    [onModelChange],
  );

  return (
    <div className={styles.actions}>
      <div className={styles.leftActions}>
        <button
          className={styles.iconButton}
          aria-label="Attach file"
          ref={fileButtonRef}
          onMouseEnter={() => setShowFileButtonTooltip(true)}
          onMouseLeave={() => setShowFileButtonTooltip(false)}
        >
          <Paperclip size={18} />
        </button>
        <Tooltip
          text="Add photos & files"
          parentRef={fileButtonRef}
          show={showFileButtonTooltip}
          above
        />

        <div className={styles.keepProgressGroup}>
          <button
            className={styles.toggleItem}
            aria-label="Keep Progress"
            ref={keepProgressInfoRef}
            onMouseEnter={() => setShowKeepProgressTooltip(true)}
            onMouseLeave={() => setShowKeepProgressTooltip(false)}
          >
            <Camera size={16} />
            <span>Keep Progress</span>
          </button>
          <Tooltip
            text="Bring your screen directly to the chat"
            parentRef={keepProgressInfoRef}
            show={showKeepProgressTooltip}
            above
          />
        </div>

        <Dropdown
          label={selectedModelLabel}
          direction="up"
          isOpen={aiMenuOpen}
          onOpenChange={setAiMenuOpen}
          width={180}
          align="left"
        >
          <DropdownSectionTitle>Model</DropdownSectionTitle>
          {GEMINI_MODELS.map((model) => (
            <div
              key={model.id}
              style={{
                marginTop: "2px",
              }}
            >
              <DropdownItem
                label={model.label}
                isActive={model.id === selectedModel}
                onClick={() => handleModelSelect(model.id)}
              />
            </div>
          ))}
        </Dropdown>
      </div>

      <div className={styles.rightActions}>
        <VoiceInput
          onTranscript={(text, isFinal) => {
            if (isFinal) {
              onInputChange((value + " " + text).trim());
            }
          }}
          disabled={disabled}
        />

        {isAiTyping || isStoppable ? (
          <button
            className={styles.stopButton}
            onClick={onStopGeneration}
            aria-label="Stop generating"
          >
            <Square size={14} fill="currentColor" />
          </button>
        ) : (
          <button
            className={`${styles.submitButton} ${isButtonActive ? styles.submitActive : ""}`}
            onClick={onSubmit}
            disabled={!isButtonActive}
            aria-label="Submit"
          >
            <ArrowUp size={18} />
          </button>
        )}
      </div>
    </div>
  );
};
