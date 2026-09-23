import { useEffect, useState } from 'react';
import { reportService, type PerformanceData } from '../services/reportService';

export function ReportsView({ groupId }: { groupId: string }) {
    const [performance, setPerformance] = useState<PerformanceData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await reportService.getGroupPerformance(groupId);
                setPerformance(data);
            } catch (error) {
                console.error('Error fetching reports', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [groupId]);

    if (isLoading) return <div className="p-8 text-center text-slate-500">Cargando reportes...</div>;
    if (!performance) return <div className="p-8 text-center text-slate-500">No hay datos.</div>;

    const total = performance.created || 1; // avoid division by zero
    const completedPercent = Math.round((performance.completed / total) * 100) || 0;

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Reporte de Rendimiento</h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm text-center">
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Tarjetas Creadas</p>
                    <p className="text-3xl font-bold text-blue-600">{performance.created}</p>
                </div>
                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm text-center">
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Completadas</p>
                    <p className="text-3xl font-bold text-green-600">{performance.completed}</p>
                </div>
                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm text-center">
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Pendientes</p>
                    <p className="text-3xl font-bold text-yellow-600">{performance.pending}</p>
                </div>
                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm text-center">
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Atrasadas</p>
                    <p className="text-3xl font-bold text-red-600">{performance.overdue}</p>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4">Progreso General</h3>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-4 mb-2">
                    <div className="bg-green-500 h-4 rounded-full transition-all" style={{ width: `${completedPercent}%` }}></div>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 text-right">{completedPercent}% Completado</p>
            </div>
        </div>
    );
}
