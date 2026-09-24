import { useState, useEffect } from 'react';
import * as projectDocumentService from '../services/projectDocumentService';
import type { ProjectDocument } from '../services/projectDocumentService';
import { ApiError } from '@/services/api/errors/ApiError';
import Alert from '@/components/common/ui/Alert';


interface ProjectDocumentsViewProps {
    groupId: string;
}

export function ProjectDocumentsView({ groupId }: ProjectDocumentsViewProps) {
    const [documents, setDocuments] = useState<ProjectDocument[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchDocuments = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const docs = await projectDocumentService.getProjectDocuments(groupId);
            setDocuments(docs);
        } catch (err: unknown) {
            if (err instanceof ApiError) setError(err.message);
            else setError('Error al cargar los documentos');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, [groupId]);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        const file = e.target.files[0];
        setIsUploading(true);
        setError(null);

        try {
            await projectDocumentService.uploadProjectDocument(groupId, file);
            fetchDocuments(); // recargar
        } catch (err: unknown) {
            if (err instanceof ApiError) setError(err.message);
            else setError('Error al subir el documento');
        } finally {
            setIsUploading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('¿Seguro que deseas eliminar este documento?')) return;
        try {
            await projectDocumentService.deleteProjectDocument(id);
            setDocuments(docs => docs.filter(d => d._id !== id));
        } catch (err: unknown) {
            if (err instanceof ApiError) setError(err.message);
            else setError('Error al eliminar el documento');
        }
    };

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Documentos del Proyecto</h2>
                    <p className="text-slate-500 text-sm mt-1">Sube y comparte archivos con tu equipo</p>
                </div>
                <div>
                    <label className="cursor-pointer">
                        <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isUploading ? 'bg-blue-300 text-white cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>
                            {isUploading ? 'Subiendo...' : '+ Subir Documento'}
                        </span>
                        <input type="file" className="hidden" onChange={handleFileUpload} disabled={isUploading} />
                    </label>
                </div>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}

            {isLoading ? (
                <div className="text-center p-8 text-slate-500 animate-pulse">Cargando documentos...</div>
            ) : documents.length === 0 ? (
                <div className="text-center p-12 bg-white dark:bg-[#1d2125] border border-slate-200 dark:border-slate-800 rounded-xl">
                    <p className="text-slate-500">No hay documentos en este proyecto.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {documents.map(doc => (
                        <div key={doc._id} className="bg-white dark:bg-[#1d2125] border border-slate-200 dark:border-slate-800 p-4 rounded-xl flex flex-col justify-between hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-semibold text-slate-800 dark:text-slate-200 truncate pr-2" title={doc.title || doc.fileName}>
                                    {doc.title || doc.fileName}
                                </h3>
                                <button onClick={() => handleDelete(doc._id)} className="text-slate-400 hover:text-red-500 transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                </button>
                            </div>
                            <p className="text-xs text-slate-500 truncate mb-4">{doc.fileName}</p>
                            <div className="flex gap-2 mt-auto">
                                <a 
                                    href={doc.fileUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="text-center w-full py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded text-sm transition-colors"
                                >
                                    Abrir Documento
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

