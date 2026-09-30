import { useCallback, useEffect, useState } from 'react';
import { useToast } from '@/components/ui/Toast/Toast';
import { errorHandler } from '@/services/api/errors/errorHandler';
import {
  deleteProjectDocument,
  getGroupDocuments,
  uploadGroupDocument,
  type UploadDocumentPayload,
} from '../services/documentService';
import type { ProjectDocumentDto } from '../types/document.types';

export type DocumentsStatus = 'idle' | 'loading' | 'success' | 'error';

export function useDocuments(groupId: string | null) {
  const [documents, setDocuments] = useState<ProjectDocumentDto[]>([]);
  const [status, setStatus] = useState<DocumentsStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const toast = useToast();

  const load = useCallback(async () => {
    if (!groupId) {
      setDocuments([]);
      setStatus('idle');
      return;
    }
    setStatus('loading');
    setError(null);
    try {
      const loaded = await getGroupDocuments(groupId);
      setDocuments(loaded);
      setStatus('success');
    } catch (caught: unknown) {
      setError(errorHandler(caught).message);
      setStatus('error');
    }
  }, [groupId]);

  useEffect(() => {
    void load();
  }, [load]);

  const upload = useCallback(
    async (payload: UploadDocumentPayload): Promise<boolean> => {
      if (!groupId) return false;
      setUploading(true);
      try {
        const document = await uploadGroupDocument(groupId, payload);
        setDocuments((current) => [document, ...current]);
        setStatus('success');
        toast.success(`Documento “${document.title}” subido`, document.fileName);
        return true;
      } catch (caught: unknown) {
        toast.error(errorHandler(caught).message, 'No se pudo subir el documento');
        return false;
      } finally {
        setUploading(false);
      }
    },
    [groupId, toast],
  );

  const remove = useCallback(
    async (documentId: string): Promise<boolean> => {
      setDeletingId(documentId);
      try {
        await deleteProjectDocument(documentId);
        setDocuments((current) => current.filter((document) => document.id !== documentId));
        toast.success('Documento eliminado');
        return true;
      } catch (caught: unknown) {
        toast.error(errorHandler(caught).message, 'No se pudo eliminar el documento');
        return false;
      } finally {
        setDeletingId(null);
      }
    },
    [toast],
  );

  return { documents, status, error, uploading, deletingId, upload, remove, reload: load };
}
