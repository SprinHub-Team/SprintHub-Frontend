import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useGroups } from "@/features/groups/hooks/useGroups";
import GroupCard from "@/features/groups/components/GroupCard";
import Button from "@/components/common/ui/Button";

function DashboardPage() {
    const { groups, isLoading, error, fetchGroups } = useGroups();
    const navigate = useNavigate();
    const { user, clearSession } = useAuth();

    useEffect(() => {
        fetchGroups();
    }, [fetchGroups]);

    return (
        <div className="flex h-screen bg-slate-50 dark:bg-[#0f1115] overflow-hidden animate-fade-in">
            {/* Global Sidebar */}
            <aside className="w-64 bg-white dark:bg-[#161a1d] border-r border-slate-200 dark:border-slate-800 flex flex-col shrink-0">
                <div className="p-4 flex items-center gap-3 border-b border-slate-200 dark:border-slate-800">
                    <div className="w-8 h-8 rounded bg-blue-600 text-white flex items-center justify-center font-bold shadow-sm">
                        S
                    </div>
                    <div className="overflow-hidden">
                        <h2 className="font-bold text-sm text-slate-900 dark:text-white truncate">SprintHub</h2>
                        <p className="text-xs text-slate-500 truncate">Mi Espacio de Trabajo</p>
                    </div>
                </div>

                <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 mt-4 px-3">Principal</div>
                    <button 
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-medium"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                        Dashboard
                    </button>
                    <Link to="/groups" className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                        Mis Grupos
                    </Link>
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

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <div className="max-w-7xl mx-auto p-6 md:p-10 space-y-12">
                    {/* Header Area */}
                    <div>
                        <h1 className="text-3xl font-bold mb-2 text-slate-900 dark:text-white">
                            Bienvenido de nuevo
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400">
                            Este es un resumen de tu actividad reciente.
                        </p>
                    </div>

                    {/* Grupos Recientes Section */}
                    <section className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                                Tus Grupos Recientes
                            </h2>
                            <Link to="/groups">
                                <Button variant="ghost" className="text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                                    Ver todos
                                </Button>
                            </Link>
                        </div>

                        {error ? (
                            <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 rounded-2xl border border-red-200 dark:border-red-900/50">Error al cargar grupos: {error}</div>
                        ) : isLoading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="h-32 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-2xl border border-slate-300 dark:border-slate-700"></div>
                                ))}
                            </div>
                        ) : groups.length === 0 ? (
                            <div className="bg-white dark:bg-[#0f1115]/50 p-12 rounded-2xl border border-slate-200 dark:border-slate-800 text-center shadow-inner">
                                <p className="text-slate-500 dark:text-slate-400 mb-6 text-lg">Aún no perteneces a ningún grupo.</p>
                                <Link to="/groups">
                                    <Button className="bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-900/50">Crear mi primer grupo</Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {groups.slice(0, 3).map((group, index) => (
                                    <div key={group.id} style={{ animationDelay: `${index * 0.1}s` }} className="animate-fade-in-up">
                                        <GroupCard group={group} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                    
                    {/* Actividad Reciente Section */}
                    <section className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                                Actividad Reciente
                            </h2>
                        </div>
                        <div className="bg-white dark:bg-[#0f1115] p-8 rounded-2xl border border-slate-200 dark:border-slate-800 text-center text-slate-500 dark:text-slate-400">
                            Pronto podrás ver tu actividad reciente aquí.
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}

export default DashboardPage;

