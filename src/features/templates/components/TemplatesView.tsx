import { useEffect, useState } from 'react';
import { templateService, type BoardTemplate } from '../services/templateService';
import Button from '@/components/common/ui/Button';

export function TemplatesView({ groupId, onCreateBoard }: { groupId: string, onCreateBoard: (templateId?: string) => void }) {
    const [templates, setTemplates] = useState<BoardTemplate[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTemplates = async () => {
            try {
                const data = await templateService.getAllTemplates();
                setTemplates(data);
            } catch (error) {
                console.error("Error fetching templates", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchTemplates();
    }, []);

    if (isLoading) return <div className="p-8 text-center text-slate-500">Cargando plantillas...</div>;

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Plantillas de Tablero</h2>
            <p className="text-slate-500">Comienza rpidamente usando una de nuestras plantillas predefinidas.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates.map(tpl => (
                    <div key={tpl.id} className="bg-white dark:bg-[#1d2125] p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">{tpl.name}</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 flex-1">{tpl.description}</p>
                        <div className="mb-6 space-y-1">
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Columnas:</span>
                            <div className="flex flex-wrap gap-2">
                                {tpl.columns.map((col, idx) => (
                                    <span key={idx} className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-1 rounded">
                                        {col.title}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <Button onClick={() => onCreateBoard(tpl.id)} className="w-full">
                            Usar plantilla
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
}

