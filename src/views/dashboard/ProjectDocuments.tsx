import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';

import { getGroupById } from '../../services/sprintHubServices';
import { useAuthStore } from '../../store/useAuthStore';

const ProjectDocuments: React.FC = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const [documents, setDocuments] = useState<any[]>([]);
  const [group, setGroup] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const user = useAuthStore(state => state.user);

  const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
  const baseUrl = backendUrl.replace('/api', '');

  const fetchDocsAndGroup = async () => {
    if (!groupId) return;
    try {
      const [docsRes, groupRes] = await Promise.all([
        api.get(`/project-documents/group/${groupId}`),
        getGroupById(groupId)
      ]);
      setDocuments(docsRes.data);
      setGroup(groupRes.data || groupRes);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchDocsAndGroup();
  }, [groupId]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const title = prompt('Ingresa un título para este documento:');
    if (!title) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', title);

      await api.post(`/project-documents/${groupId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      fetchDocsAndGroup();
      e.target.value = '';
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error al subir el documento');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Seguro que deseas eliminar este documento?')) return;
    try {
      await api.delete(`/project-documents/${id}`);
      fetchDocsAndGroup();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error al eliminar el documento');
    }
  };

  const isCollaboratorOrAdmin = () => {
    if (!group || !user) return false;
    if (group.ownerId?._id === user.id || group.ownerId === user.id) return true;
    const member = group.members.find((m: any) => m.user._id === user.id || m.user === user.id);
    return member && (member.role === 'admin' || member.role === 'collaborator');
  };

  return (
    <div style={{ padding: '0', maxWidth: '1200px', margin: '0 auto' }}>
      
      <div style={{ padding: '0 20px 20px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: '0 0 10px 0', color: '#f8fafc' }}>
              Documentación del Proyecto
            </h1>
            <p style={{ color: '#94a3b8', margin: 0 }}>
              Archivos globales y recursos compartidos del espacio de trabajo.
            </p>
          </div>
          {isCollaboratorOrAdmin() && (
            <div>
              <input 
                type="file" 
                id="upload-project-doc"
                accept=".pdf,.xlsx,.xls,.doc,.docx"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
                disabled={uploading}
              />
              <label 
                htmlFor="upload-project-doc"
                className="btn-primary" 
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px' }}
              >
                <i className="fas fa-upload"></i> {uploading ? 'Subiendo...' : 'Subir Documento'}
              </label>
            </div>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {documents.map((doc) => (
            <div key={doc._id} style={{ background: '#1c1f26', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
                <div style={{ fontSize: '2rem', color: doc.fileName.endsWith('.pdf') ? '#ef4444' : '#10b981' }}>
                  <i className={`fas fa-file-${doc.fileName.endsWith('.pdf') ? 'pdf' : 'excel'}`}></i>
                </div>
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <h3 style={{ margin: '0 0 5px 0', color: '#f8fafc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {doc.title}
                  </h3>
                  <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '10px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {doc.fileName}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    Subido por: {doc.uploadedBy?.name || 'Desconocido'} <br/>
                    {new Date(doc.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '15px', paddingTop: '15px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <a 
                  href={`${baseUrl}${doc.fileUrl}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  download={doc.fileName}
                  className="btn-secondary"
                  style={{ flex: 1, textAlign: 'center', textDecoration: 'none' }}
                >
                  <i className="fas fa-download"></i> Descargar
                </a>
                {isCollaboratorOrAdmin() && (
                  <button onClick={() => handleDelete(doc._id)} className="btn-secondary" style={{ color: '#ef4444' }}>
                    <i className="fas fa-trash"></i>
                  </button>
                )}
              </div>
            </div>
          ))}
          {documents.length === 0 && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '50px', color: '#94a3b8' }}>
              No hay documentos compartidos en este proyecto.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDocuments;
  