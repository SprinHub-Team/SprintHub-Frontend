export const MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024;

export interface UploadRule {
  accept: string;
  extensionMimes: Record<string, string[]>;
  label: string;
  description: string;
}

/** Reglas alineadas al uploadMiddleware de Cloudinary del backend (imágenes y audios). */
export const MEDIA_RULE: UploadRule = {
  accept: 'image/png,image/jpeg,image/pjpeg,image/webp,audio/mpeg,audio/mp3,audio/wav,audio/x-wav,audio/ogg,video/ogg,audio/x-m4a,audio/m4a,.png,.jpg,.jpeg,.webp,.mp3,.wav,.ogg,.m4a',
  extensionMimes: {
    '.png': ['image/png'],
    '.jpg': ['image/jpeg', 'image/pjpeg'],
    '.jpeg': ['image/jpeg', 'image/pjpeg'],
    '.webp': ['image/webp'],
    '.mp3': ['audio/mpeg', 'audio/mp3'],
    '.wav': ['audio/wav', 'audio/x-wav'],
    '.ogg': ['audio/ogg', 'video/ogg'],
    '.m4a': ['audio/x-m4a', 'audio/m4a'],
  },
  label: 'imagen o audio',
  description: 'PNG, JPG, WEBP, MP3, WAV, OGG o M4A',
};

export type FileCategory = 'image' | 'audio' | 'pdf' | 'spreadsheet' | 'other';

export function fileCategory(fileName: string, mimeType: string): FileCategory {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('audio/')) return 'audio';
  const extension = extensionOf(fileName);
  if (extension === '.png' || extension === '.jpg' || extension === '.jpeg' || extension === '.webp') return 'image';
  if (extension === '.mp3' || extension === '.wav' || extension === '.ogg' || extension === '.m4a') return 'audio';
  return 'other';
}

export function extensionOf(fileName: string): string {
  const index = fileName.lastIndexOf('.');
  return index === -1 ? '' : fileName.slice(index).toLowerCase();
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export type FileValidationCode = 'size' | 'extension' | 'mime';

export interface FileValidationError {
  code: FileValidationCode;
  message: string;
}

export function validateFile(file: File, rule: UploadRule): FileValidationError | null {
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      code: 'size',
      message: `El archivo supera el límite máximo de 15 MB (${formatBytes(file.size)}).`,
    };
  }

  const extension = extensionOf(file.name);
  const allowedMimes = rule.extensionMimes[extension];

  if (!allowedMimes) {
    return {
      code: 'extension',
      message: `Formato no válido: solo se admite ${rule.label} (${rule.description}).`,
    };
  }

  if (!allowedMimes.includes(file.type)) {
    return {
      code: 'mime',
      message: 'El contenido del archivo no coincide con su extensión. Verifica el archivo e inténtalo de nuevo.',
    };
  }

  return null;
}
