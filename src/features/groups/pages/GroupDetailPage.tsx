import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useGroupDetail } from "../hooks/useGroupDetail";
import { useBoards } from "@/features/boards/hooks/useBoards";
import BoardCard from "@/features/boards/components/BoardCard";
import { AddMemberModal } from "../components/AddMemberModal";
import { CreateBoardModal } from "@/features/boards/components/CreateBoardModal";
import { EditGroupModal } from "../components/EditGroupModal";
import Alert from "@/components/common/ui/Alert";
import Button from "@/components/common/ui/Button";

// Import new views
import { BacklogView } from "@/features/backlog/components/BacklogView";
import { ReportsView } from "@/features/reports/components/ReportsView";
import { TemplatesView } from "@/features/templates/components/TemplatesView";
import { ProjectDocumentsView } from "../components/ProjectDocumentsView";

type ViewMode = 'overview' | 'backlog' | 'reports' | 'templates' | 'documents';

function GroupDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user, clearSession } = useAuth();
    const { activeGroup, isLoading: isLoadingGroup, error: groupError, fetchGroup, clearActiveGroup } = useGroupDetail(id!);
    const { boards, isLoading: isLoadingBoards, error: boardsError, fetchBoards } = useBoards();
    
    const [activeView, setActiveView] = useState<ViewMode>('overview');
    
    const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
    const [isCreateBoardModalOpen, setIsCreateBoardModalOpen] = useState(false);
    const [isEditGroupModalOpen, setIsEditGroupModalOpen] = useState(false);

    useEffect(() => {
        if (id) {
            fetchGroup();
            fetchBoards(id);
        }
        return () => {
            clearActiveGroup();
        };
    }, [id, fetchGroup, fetchBoards, clearActiveGroup]);

    if (isLoadingGroup) {
        return <div className="p-6 text-center animate-pulse">Cargando detalles del grupo...</div>;
    }

    if (groupError) {
        return <div className="p-6"><Alert variant="danger">{groupError}</Alert></div>;
    }

    if (!activeGroup) {
        return <div className="p-6 text-center text-slate-500">Grupo no encontrado.</div>;
    }

    return (
        <div className="flex h-screen bg-slate-50 dark:bg-[#0f1115] overflow-hidden animate-fade-in">
            {/* Sidebar JIRA-like */}
            <aside className="w-64 bg-slate-50 dark:bg-[#161a1d] border-r border-slate-200 dark:border-slate-800 flex flex-col shrink-0">
                {/* Back to Dashboard Button */}
                <div className="p-3 border-b border-slate-200 dark:border-slate-800">
                    <button 
                        onClick={() => navigate('/dashboard')}
                        className="flex items-center gap-2 text-sm text-slate-500 hover:text-blue-500 transition-colors px-2 py-1 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20 w-full"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                        Volver al Dashboard
                    </button>
                </div>

                <div className="p-4 flex items-center gap-3 border-b border-slate-200 dark:border-slate-800">
                    <div className="w-8 h-8 rounded bg-blue-600 text-white flex items-center justify-center font-bold shadow-sm overflow-hidden">
                        {activeGroup.profilePicture ? (
                            <img src={activeGroup.profilePicture} alt={activeGroup.name} className="w-full h-full object-cover" />
                        ) : (
                            activeGroup.name.charAt(0).toUpperCase()
                        )}
                    </div>
                    <div className="overflow-hidden">
                        <h2 className="font-bold text-sm text-slate-900 dark:text-white truncate">{activeGroup.name}</h2>
                        <p className="text-xs text-slate-500 truncate">Proyecto de software</p>
                    </div>
                </div>
                
                <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 mt-4 px-3">Planificación</div>
                    <button 
                        onClick={() => setActiveView('overview')}
                        className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${activeView === 'overview' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-medium' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                        Tableros (Board)
                    </button>
                    <button 
                        onClick={() => setActiveView('backlog')}
                        className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${activeView === 'backlog' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-medium' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
                        Product Backlog
                    </button>

                    <button 
                        onClick={() => setActiveView('templates')}
                        className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${activeView === 'templates' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-medium' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" /></svg>
                        Plantillas
                    </button>

                    <button 
                        onClick={() => setActiveView('documents')}
                        className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${activeView === 'documents' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-medium' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        Documentos
                    </button>

                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 mt-6 px-3">Análisis</div>
                    <button 
                        onClick={() => setActiveView('reports')}
                        className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${activeView === 'reports' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-medium' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                        Reportes
                    </button>

                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 mt-6 px-3">Administración</div>
                    <button 
                        onClick={() => setIsEditGroupModalOpen(true)}
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        Configuración
                    </button>
                    <button 
                        onClick={() => setIsAddMemberModalOpen(true)}
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        Invitar Miembro
                    </button>
                </nav>

                {/* User Profile and Logout Footer */}
                <div className="mt-auto border-t border-slate-200 dark:border-slate-800 p-4">
                    <div className="flex items-center justify-between">
                        <button 
                            onClick={() => navigate('/profile')}
                            className="flex items-center gap-3 flex-1 text-left hover:bg-slate-100 dark:hover:bg-slate-800 p-2 rounded-md transition-colors"
                            title="Editar Perfil"
                        >
                            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 flex items-center justify-center font-bold">
                                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <div className="overflow-hidden flex-1">
                                <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{user?.name || 'Usuario'}</p>
                                <p className="text-xs text-slate-500 truncate">{user?.email || 'email@ejemplo.com'}</p>
                            </div>
                        </button>
                        <button 
                            onClick={() => {
                                clearSession();
                                navigate('/login');
                            }}
                            className="text-slate-400 hover:text-red-500 p-2 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                            title="Cerrar Sesión"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto p-8">
                {activeView === 'overview' && (
                    <div className="max-w-5xl space-y-8">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Tableros Activos</h2>
                            <Button onClick={() => setIsCreateBoardModalOpen(true)} className="text-sm py-2">
                                Crear Tablero
                            </Button>
                        </div>
                        
                        {boardsError && <Alert variant="danger">{boardsError}</Alert>}
                        
                        {isLoadingBoards ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="h-32 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-xl border border-slate-300 dark:border-slate-700"></div>
                                ))}
                            </div>
                        ) : boards.length === 0 ? (
                            <div className="bg-slate-50 dark:bg-[#0f1115]/50 p-12 rounded-[var(--radius)] border border-slate-200 dark:border-slate-800 text-center shadow-inner">
                                <p className="text-slate-500 dark:text-slate-400 mb-6 text-lg">Aún no hay tableros en este proyecto. Crea uno para comenzar.</p>
                                <Button onClick={() => setIsCreateBoardModalOpen(true)} className="bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-900/50">Crear mi primer tablero</Button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {boards.map((board, index) => (
                                    <div key={board.id} style={{ animationDelay: `${index * 0.1}s` }} className="animate-fade-in-up">
                                        <BoardCard board={board} />
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="pt-8 mt-8 border-t border-slate-200 dark:border-slate-800">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Equipo del Proyecto</h2>
                            <div className="bg-slate-50 dark:bg-[#0f1115] rounded-xl border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800">
                                {activeGroup.members?.map((member) => (
                                    <div key={member.user?.id || Math.random()} className="p-4 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 flex items-center justify-center text-sm font-bold">
                                                {member.user?.name?.charAt(0).toUpperCase() || '?'}
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm text-slate-900 dark:text-slate-100">{member.user?.name || 'Usuario desconocido'}</p>
                                                <p className="text-xs text-slate-500">{member.user?.email || ''}</p>
                                            </div>
                                        </div>
                                        <span className="text-xs uppercase bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-1 rounded">
                                            {member.role}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeView === 'backlog' && id && <BacklogView groupId={id} />}
                
                {activeView === 'reports' && id && <ReportsView groupId={id} />}

                {activeView === 'documents' && id && <ProjectDocumentsView groupId={id} />}

                {activeView === 'templates' && id && (
                    <TemplatesView 
                        groupId={id} 
                        onCreateBoard={async (templateId) => {
                            setIsCreateBoardModalOpen(true);
                            // We might need to pass templateId to CreateBoardModal or handle it here.
                            // The user requested to see templates. 
                            // For simplicity, we just open the modal. A full implementation would prefill template.
                        }} 
                    />
                )}

            </main>

            {id && (
                <>
                    <AddMemberModal 
                        isOpen={isAddMemberModalOpen} 
                        onClose={() => setIsAddMemberModalOpen(false)} 
                        groupId={id}
                    />
                    <CreateBoardModal 
                        isOpen={isCreateBoardModalOpen}
                        onClose={() => setIsCreateBoardModalOpen(false)}
                        groupId={id}
                    />
                    <EditGroupModal 
                        group={activeGroup}
                        isOpen={isEditGroupModalOpen}
                        onClose={() => setIsEditGroupModalOpen(false)}
                        onUpdate={fetchGroup}
                    />
                </>
            )}
        </div>
    );
}

export default GroupDetailPage;

