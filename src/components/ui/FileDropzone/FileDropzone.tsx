import { useCallback, useEffect, useId, useRef, useState, type DragEvent, type KeyboardEvent } from 'react';
import { CircleAlert, FileAudio, FileImage, Paperclip, UploadCloud, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  fileCategory,
  formatBytes,
  validateFile,
  type FileCategory,
  type UploadRule,
} from '@/lib/uploads/fileValidation';
import styles from './FileDropzone.module.css';

export interface FileDropzoneProps {
  rule: UploadRule;
  value: File | null;
  onChange: (file: File | null) => void;
  label?: string;
  hint?: string;
  disabled?: boolean;
  error?: string | null;
  preview?: boolean;
  compact?: boolean;
  className?: string;
}

const CATEGORY_ICONS: Record<FileCategory, typeof FileImage> = {
  image: FileImage,
  audio: FileAudio,
  pdf: Paperclip,
  spreadsheet: Paperclip,
  other: Paperclip,
};

export function FileDropzone({
  rule,
  value,
  onChange,
  label,
  hint,
  disabled = false,
  error,
  preview = true,
  compact = false,
  className,
}: FileDropzoneProps) {
  const [dragActive, setDragActive] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const dragDepthRef = useRef(0);

  const controlId = useId();
  const errorId = `${controlId}-error`;
  const hintId = `${controlId}-hint`;
  const statusId = `${controlId}-status`;

  const message = localError ?? error ?? null;

  useEffect(() => {
    if (!preview || !value || fileCategory(value.name, value.type) !== 'image') {
      setPreviewUrl(null);
      return undefined;
    }
    const url = URL.createObjectURL(value);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [value, preview]);

  useEffect(() => {
    if (!value && inputRef.current && inputRef.current.value !== '') {
      inputRef.current.value = '';
    }
  }, [value]);

  const acceptFile = useCallback(
    (file: File | null) => {
      if (!file) return;
      const validation = validateFile(file, rule);
      if (validation) {
        setLocalError(validation.message);
        if (inputRef.current) inputRef.current.value = '';
        return;
      }
      setLocalError(null);
      onChange(file);
    },
    [onChange, rule],
  );

  const clearFile = useCallback(() => {
    setLocalError(null);
    setPreviewUrl(null);
    if (inputRef.current) inputRef.current.value = '';
    onChange(null);
  }, [onChange]);

  const handleDragEnter = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    dragDepthRef.current += 1;
    if (!disabled && event.dataTransfer?.types?.includes('Files')) {
      setDragActive(true);
    }
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    dragDepthRef.current = Math.max(0, dragDepthRef.current - 1);
    if (dragDepthRef.current === 0) {
      setDragActive(false);
    }
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    dragDepthRef.current = 0;
    setDragActive(false);
    if (disabled) return;
    const dropped = event.dataTransfer?.files?.[0];
    acceptFile(dropped ?? null);
  };

  const handleOpenPicker = () => {
    if (disabled) return;
    inputRef.current?.click();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleOpenPicker();
    }
  };

  const describedBy = [message ? errorId : null, hint && !message ? hintId : null]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={cn(styles.wrapper, className)}>
      {label ? (
        <span id={`${controlId}-label`} className={styles.label}>
          {label}
        </span>
      ) : null}

      <input
        ref={inputRef}
        id={controlId}
        type="file"
        accept={rule.accept}
        className="sr-only"
        tabIndex={-1}
        disabled={disabled}
        onChange={(event) => {
          const selected = event.target.files?.[0] ?? null;
          if (selected) acceptFile(selected);
        }}
      />

      {value ? (
        <div className={styles.selected}>
          {previewUrl ? (
            <img
              src={previewUrl}
              alt={`Vista previa de ${value.name}`}
              className={styles.previewImage}
            />
          ) : (
            <span aria-hidden="true" className={styles.fileIconBox}>
              {renderCategoryIcon(value.name, value.type)}
            </span>
          )}

          <div className={styles.fileInfo}>
            <span className={styles.fileName} title={value.name}>
              {value.name}
            </span>
            <span className={styles.fileMeta}>
              {formatBytes(value.size)} · {describeCategory(value.name, value.type)}
            </span>
            {message ? (
              <p id={errorId} className={styles.inlineError} role="alert">
                <CircleAlert aria-hidden="true" className={styles.inlineErrorIcon} />
                <span>{message}</span>
              </p>
            ) : null}
          </div>

          <button
            type="button"
            onClick={clearFile}
            disabled={disabled}
            aria-label="Quitar archivo seleccionado"
            className={styles.removeButton}
          >
            <X aria-hidden="true" className="icon-md" />
          </button>
        </div>
      ) : (
        <div
          role="button"
          tabIndex={disabled ? -1 : 0}
          aria-labelledby={label ? `${controlId}-label` : undefined}
          aria-describedby={describedBy || undefined}
          aria-disabled={disabled || undefined}
          aria-invalid={message ? true : undefined}
          onClick={handleOpenPicker}
          onKeyDown={handleKeyDown}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            styles.dropzone,
            compact ? styles.compact : styles.regular,
            dragActive ? styles.dropzoneActive : styles.dropzoneIdle,
            disabled ? styles.dropzoneDisabled : undefined,
            message && !dragActive ? styles.dropzoneError : undefined,
          )}
        >
          <UploadCloud
            aria-hidden="true"
            className={cn(
              compact ? styles.uploadIconCompact : styles.uploadIcon,
              dragActive ? styles.uploadIconActive : styles.uploadIconIdle,
            )}
          />
          <p className={styles.dropzoneTitle}>
            {dragActive ? 'Suelta el archivo aquí' : 'Arrastra y suelta un archivo'}
          </p>
          <p className={styles.dropzoneHint}>
            o <span className={styles.dropzoneHintAction}>seléccionalo desde tu equipo</span>
          </p>
          <p className={styles.dropzoneMeta}>Admite {rule.description} · máximo 15 MB</p>
        </div>
      )}

      {!value && message ? (
        <p id={errorId} className={styles.error} role="alert">
          <CircleAlert aria-hidden="true" className={styles.errorIcon} />
          <span>{message}</span>
        </p>
      ) : null}

      {hint && !message ? (
        <p id={hintId} className={styles.hint}>
          {hint}
        </p>
      ) : null}

      <span id={statusId} className="sr-only" aria-live="polite">
        {value ? `Archivo seleccionado: ${value.name}` : 'Ningún archivo seleccionado'}
      </span>
    </div>
  );
}

function renderCategoryIcon(fileName: string, mimeType: string) {
  const category = fileCategory(fileName, mimeType);
  const Icon = CATEGORY_ICONS[category];
  return <Icon aria-hidden="true" className={styles.categoryIcon} />;
}

function describeCategory(fileName: string, mimeType: string): string {
  switch (fileCategory(fileName, mimeType)) {
    case 'image':
      return 'Imagen';
    case 'audio':
      return 'Audio';
    default:
      return 'Archivo';
  }
}
