import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { reportService, type PerformanceData } from '../services/reportService';
import { useGroupDetail } from '@/features/groups/hooks/useGroupDetail';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, 
} from 'recharts';

export function ReportsView({ groupId }: { groupId: string }) {
    const { activeGroup } = useGroupDetail(groupId);
    const [performance, setPerformance] = useState<PerformanceData | null>(null);
    const [completedActivities, setCompletedActivities] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [perfData, activitiesData] = await Promise.all([
                    reportService.getGroupPerformance(groupId),
                    reportService.getCompletedActivities(groupId)
                ]);
                setPerformance(perfData);
                setCompletedActivities(activitiesData);
            } catch (error) {
                console.error('Error fetching reports', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [groupId]);

    if (isLoading) return <div className="p-8 text-center text-slate-500 animate-pulse">Cargando métricas...</div>;
    if (!performance) return <div className="p-8 text-center text-slate-500">No hay datos disponibles.</div>;

    const total = performance.created || 1;
    const completedPercent = Math.round((performance.completed / total) * 100) || 0;

    // --- Podium Data Calculation ---
    const userScores: Record<string, number> = {};
    completedActivities.forEach(card => {
        if (card.assignedTo) {
            userScores[card.assignedTo] = (userScores[card.assignedTo] || 0) + 1;
        }
    });

    const membersMap = new Map(activeGroup?.members?.map(m => [m.user.id, m.user]) || []);

    const topUsers = Object.entries(userScores)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([id, score]) => ({
            id,
            score,
            user: membersMap.get(id) || { name: 'Usuario Desconocido' }
        }));

    // Pad to 3 if less
    while (topUsers.length < 3) {
        topUsers.push({ id: `empty-${topUsers.length}`, score: 0, user: null as any });
    }

    const podiumOrder = [
        { rank: 2, data: topUsers[1], height: 'h-24', color: 'bg-slate-300 dark:bg-slate-400', badge: '🥈' },
        { rank: 1, data: topUsers[0], height: 'h-32', color: 'bg-yellow-400 dark:bg-yellow-500', badge: '🏆' },
        { rank: 3, data: topUsers[2], height: 'h-16', color: 'bg-orange-300 dark:bg-orange-400', badge: '🥉' }
    ];

    // --- Chart Data ---
    const barData = [
        { name: 'Completadas', value: performance.completed, color: '#10b981' },
        { name: 'Pendientes', value: performance.pending, color: '#f59e0b' },
        { name: 'Atrasadas', value: performance.overdue, color: '#ef4444' }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };
    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <motion.div 
            variants={containerVariants} 
            initial="hidden" 
            animate="show" 
            className="space-y-6 pb-20 p-4 sm:p-8 max-w-7xl mx-auto"
        >
            <motion.div variants={itemVariants} className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Reportes y Métricas</h2>
                    <p className="text-sm text-slate-500 mt-1">Análisis de rendimiento y progreso del equipo</p>
                </div>
            </motion.div>

            {/* Stats Row */}
            <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-[#1d2125] p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-center items-center">
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Total Tarjetas</p>
                    <p className="text-4xl font-bold text-blue-600 dark:text-blue-500">{performance.created}</p>
                </div>
                <div className="bg-white dark:bg-[#1d2125] p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-center items-center">
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Completadas</p>
                    <p className="text-4xl font-bold text-green-600 dark:text-green-500">{performance.completed}</p>
                </div>
                <div className="bg-white dark:bg-[#1d2125] p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-center items-center">
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Pendientes</p>
                    <p className="text-4xl font-bold text-yellow-600 dark:text-yellow-500">{performance.pending}</p>
                </div>
                <div className="bg-white dark:bg-[#1d2125] p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-center items-center">
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Atrasadas</p>
                    <p className="text-4xl font-bold text-red-600 dark:text-red-500">{performance.overdue}</p>
                </div>
            </motion.div>

            {/* Charts & Podium Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Distribution Chart */}
                <motion.div variants={itemVariants} className="bg-white dark:bg-[#1d2125] p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-6">Distribución del Trabajo</h3>
                    <div className="flex-1 min-h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip 
                                    cursor={{fill: 'rgba(255,255,255,0.05)'}} 
                                    contentStyle={{backgroundColor: '#1d2125', borderColor: '#334155', borderRadius: '8px', color: '#fff'}}
                                />
                                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                    {barData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Podium */}
                <motion.div variants={itemVariants} className="bg-white dark:bg-[#1d2125] p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-2">Podio de Rendimiento</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">Miembros con más tareas completadas</p>
                    
                    <div className="flex-1 flex items-end justify-center gap-2 sm:gap-6 pt-4 pb-2">
                        {podiumOrder.map((spot, i) => (
                            <div key={i} className="flex flex-col items-center flex-1">
                                {spot.data.user ? (
                                    <>
                                        <div className="relative mb-2 text-center group cursor-pointer">
                                            <div className="text-2xl absolute -top-8 left-1/2 -translate-x-1/2 z-10">{spot.badge}</div>
                                            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-lg sm:text-xl text-slate-600 dark:text-slate-300 shadow-lg border-2 border-white dark:border-[#1d2125] mx-auto overflow-hidden">
                                                {(spot.data.user as any).profilePicture ? (
                                                    <img src={(spot.data.user as any).profilePicture} alt={spot.data.user.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    spot.data.user.name.charAt(0).toUpperCase()
                                                )}
                                            </div>
                                            <p className="mt-2 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 truncate w-20 sm:w-24 text-center">
                                                {spot.data.user.name.split(' ')[0]}
                                            </p>
                                        </div>
                                        <motion.div 
                                            initial={{ height: 0 }}
                                            animate={{ height: 'auto' }}
                                            transition={{ duration: 0.8, delay: 0.2 + (i * 0.2) }}
                                            className={`w-full ${spot.height} ${spot.color} rounded-t-lg shadow-inner flex items-start justify-center pt-2`}
                                        >
                                            <span className="font-bold text-white text-lg drop-shadow-md">{spot.data.score}</span>
                                        </motion.div>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center opacity-30">
                                        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-slate-200 dark:bg-slate-800 mb-2"></div>
                                        <div className={`w-full ${spot.height} bg-slate-200 dark:bg-slate-800 rounded-t-lg`}></div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </motion.div>

            </div>

            {/* Overall Progress */}
            <motion.div variants={itemVariants} className="bg-white dark:bg-[#1d2125] p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm mt-6">
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4">Progreso General del Proyecto</h3>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-6 mb-2 overflow-hidden shadow-inner">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${completedPercent}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="bg-blue-500 h-full rounded-full transition-all relative"
                    >
                        {completedPercent > 5 && (
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-white">
                                {completedPercent}%
                            </span>
                        )}
                    </motion.div>
                </div>
                <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
                    <span>Inicio</span>
                    <span className={completedPercent < 5 ? "opacity-100" : "opacity-0"}>{completedPercent}% Completado</span>
                    <span>Meta (100%)</span>
                </div>
            </motion.div>

        </motion.div>
    );
}

