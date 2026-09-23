import { useEffect, useState } from 'react';
import { backlogService, type CardPB } from '../services/backlogService';
import { sprintService, type Sprint } from '@/features/sprints/services/sprintService';
import * as boardService from '@/features/boards/services/boardService';
import { useBoards } from '@/features/boards/hooks/useBoards';
import { templateService, type BoardTemplate } from '@/features/templates/services/templateService';
import apiClient from '@/services/api/apiClient';
import Button from '@/components/common/ui/Button';

export function BacklogView({ groupId }: { groupId: string }) {
    const [backlog, setBacklog] = useState<CardPB[]>([]);
    const [sprints, setSprints] = useState<Sprint[]>([]);
    const [sprintCardsMap, setSprintCardsMap] = useState<Record<string, CardPB[]>>({});
    
    const [isLoading, setIsLoading] = useState(true);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    
    // Create Sprint
    const [isCreatingSprint, setIsCreatingSprint] = useState(false);
    const [newSprint, setNewSprint] = useState({ name: '', goal: '', startDate: '', endDate: '', templateId: '' });
    const [templates, setTemplates] = useState<BoardTemplate[]>([]);

    // Export Modal (Bulk for Sprint)
    const [exportingSprintId, setExportingSprintId] = useState<string | null>(null);
    const [exportSprintTemplateId, setExportSprintTemplateId] = useState<string>('');
    const [isExportingCards, setIsExportingCards] = useState(false);

    // Assign Modal (Sprint only)
    const [assigningCardId, setAssigningCardId] = useState<string | null>(null);
    const [assignSprintId, setAssignSprintId] = useState<string>('');
    const [isAssigning, setIsAssigning] = useState(false);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const backlogData = await backlogService.getBacklog(groupId);
            const sprintsData = await sprintService.getSprintsByGroup(groupId);
            const templatesData = await templateService.getAllTemplates();
            
            setTemplates(templatesData);
            setBacklog(backlogData.filter((c: any) => !c.sprintId));
            setSprints(sprintsData);
            
            const map: Record<string, CardPB[]> = {};
            for (const sp of sprintsData) {
                const spCards = await sprintService.getSprintCards(sp._id);
                map[sp._id] = spCards;
            }
            setSprintCardsMap(map);
        } catch (error) {
            console.error('Error fetching data', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [groupId]);

    const handleCreateTask = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTaskTitle.trim()) return;
        try {
            await backlogService.createCard({
                title: newTaskTitle,
                groupId,
                priority: 'media',
                tasks: []
            });
            setNewTaskTitle('');
            fetchData();
        } catch (error) {
            console.error('Error creating task', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('¿Eliminar esta tarea?')) return;
        try {
            await backlogService.deleteCard(id);
            fetchData();
        } catch (error) {
            console.error('Error deleting task', error);
        }
    };

    const handleCreateSprint = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newSprint.name || !newSprint.startDate || !newSprint.endDate) return;
        try {
            const newSprintRes = await sprintService.createSprint({ ...newSprint, groupId, status: 'planificado' });
            
            if (newSprint.templateId) {
                // Save template preference for when they click "Mover Sprint a Tablero"
                localStorage.setItem(`sprint_template_${newSprintRes._id}`, newSprint.templateId);
            }
            
            setIsCreatingSprint(false);
            setNewSprint({ name: '', goal: '', startDate: '', endDate: '', templateId: '' });
            fetchData();
        } catch (error) {
            console.error(error);
        }
    };

    const handleRemoveFromSprint = async (cardId: string) => {
        try {
            await sprintService.moveCardToSprint(cardId, null);
            fetchData();
        } catch (error) {
            console.error(error);
        }
    };

    const handleOpenExport = (sprintId: string) => {
        setExportingSprintId(sprintId);
        // Pre-fill template if they selected one during creation
        const savedTemplate = localStorage.getItem(`sprint_template_${sprintId}`);
        setExportSprintTemplateId(savedTemplate || '');
    };

    const handleExportSprint = async () => {
        if (!exportingSprintId || !exportSprintTemplateId) return;
        setIsExportingCards(true);
        try {
            const sprint = sprints.find(s => s._id === exportingSprintId);
            if (!sprint) return;

            const cards = sprintCardsMap[exportingSprintId] || [];
            if (cards.length === 0) {
                alert('El sprint no tiene tareas para exportar.');
                setIsExportingCards(false);
                return;
            }

            // 1. Create Board
            const board = await boardService.createBoard({
                title: sprint.name,
                description: `Tablero generado para ${sprint.name}`,
                groupId
            });

            // 2. Apply Template
            await templateService.applyTemplate(board.id, exportSprintTemplateId);

            // 3. Fetch columns to get the first one
            const response = await apiClient.get<{data: any[]}>(`/columns/board/${board.id}`);
            const cols = response.data.data || [];
            if (cols.length === 0) throw new Error('El tablero no generó columnas');

            const firstColumnId = cols[0]._id;

            // 4. Export all cards to the first column
            for (const card of cards) {
                await sprintService.exportToBoard(card._id, firstColumnId);
            }

            alert('¡Sprint convertido a Tablero correctamente! Se han movido todas las tareas.');
            setExportingSprintId(null);
            fetchData();
        } catch (error) {
            console.error(error);
            alert('Error al exportar a tablero. Revisa la consola.');
        } finally {
            setIsExportingCards(false);
        }
    };

    const handleOpenAssignModal = (cardId: string) => {
        setAssigningCardId(cardId);
        setAssignSprintId('');
    };

    const handleConfirmAssign = async () => {
        if (!assigningCardId || !assignSprintId) return;
        setIsAssigning(true);
        try {
            await sprintService.moveCardToSprint(assigningCardId, assignSprintId);
            alert('¡Tarea asignada al Sprint correctamente!');
            setAssigningCardId(null);
            fetchData();
        } catch (error) {
            console.error(error);
            alert('Error al asignar la tarea.');
        } finally {
            setIsAssigning(false);
        }
    };

    // Export Card to Board Modal
    const [exportCardId, setExportCardId] = useState<string | null>(null);
    const [exportCardBoardId, setExportCardBoardId] = useState<string>('');
    const [exportCardColumnId, setExportCardColumnId] = useState<string>('');
    const [exportCardColumns, setExportCardColumns] = useState<any[]>([]);
    const [isExportingCard, setIsExportingCard] = useState(false);
    const { boards } = useBoards(groupId);

    const handleOpenExportCard = (cardId: string) => {
        setExportCardId(cardId);
        setExportCardBoardId('');
        setExportCardColumnId('');
        setExportCardColumns([]);
    };

    const handleExportCardBoardChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const bid = e.target.value;
        setExportCardBoardId(bid);
        setExportCardColumnId('');
        if (!bid) {
            setExportCardColumns([]);
            return;
        }
        try {
            const response = await apiClient.get<{data: any[]}>(`/columns/board/${bid}`);
            setExportCardColumns(response.data.data || []);
        } catch (error) {
            console.error(error);
        }
    };

    const handleConfirmExportCard = async () => {
        if (!exportCardId || !exportCardColumnId) return;
        setIsExportingCard(true);
        try {
            await sprintService.exportToBoard(exportCardId, exportCardColumnId);
            alert('¡Tarea movida al Tablero correctamente!');
            setExportCardId(null);
            fetchData();
        } catch (error) {
            console.error(error);
            alert('Error al mover la tarea.');
        } finally {
            setIsExportingCard(false);
        }
    };

    if (isLoading) return <div className="p-8 text-center text-slate-500">Cargando backlog y sprints...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Product Backlog</h2>
                <a href={backlogService.exportCsvUrl(groupId)} target="_blank" rel="noreferrer" className="text-sm text-blue-600 hover:underline">Exportar a CSV</a>
            </div>

            {/* Sprints Section at the top */}
            <div className="space-y-4">
                {sprints.length === 0 ? (
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border border-blue-200 dark:border-blue-800 text-center">
                        <p className="text-blue-800 dark:text-blue-300 mb-4">Aún no has creado ningún Sprint para planificar el trabajo.</p>
                        <Button onClick={() => setIsCreatingSprint(true)}>Crear Primer Sprint</Button>
                    </div>
                ) : (
                    <div className="flex justify-between items-center">
                        <h3 className="font-bold text-lg dark:text-white">Sprints Activos</h3>
                        <Button onClick={() => setIsCreatingSprint(true)} className="text-sm py-1 px-3">Nuevo Sprint</Button>
                    </div>
                )}

                {isCreatingSprint && (
                    <form onSubmit={handleCreateSprint} className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                        <h4 className="font-bold mb-2 dark:text-white">Nuevo Sprint</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1 dark:text-slate-300">Nombre</label>
                                <input required type="text" className="w-full px-3 py-2 border rounded-md dark:bg-slate-800 dark:border-slate-700 dark:text-white" value={newSprint.name} onChange={e => setNewSprint({...newSprint, name: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 dark:text-slate-300">Plantilla (Opcional)</label>
                                <select className="w-full px-3 py-2 border rounded-md dark:bg-slate-800 dark:border-slate-700 dark:text-white" value={newSprint.templateId} onChange={e => setNewSprint({...newSprint, templateId: e.target.value})}>
                                    <option value="">-- Sin plantilla --</option>
                                    {templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 dark:text-slate-300">Fecha de Inicio</label>
                                <input required type="date" className="w-full px-3 py-2 border rounded-md dark:bg-slate-800 dark:border-slate-700 dark:text-white" value={newSprint.startDate} onChange={e => setNewSprint({...newSprint, startDate: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 dark:text-slate-300">Fecha de Fin</label>
                                <input required type="date" className="w-full px-3 py-2 border rounded-md dark:bg-slate-800 dark:border-slate-700 dark:text-white" value={newSprint.endDate} onChange={e => setNewSprint({...newSprint, endDate: e.target.value})} />
                            </div>
                        </div>
                        <div className="flex gap-2 justify-end mt-2">
                            <Button type="button" variant="ghost" onClick={() => setIsCreatingSprint(false)}>Cancelar</Button>
                            <Button type="submit">Guardar</Button>
                        </div>
                    </form>
                )}

                {sprints.map(sprint => (
                    <div key={sprint._id} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm mb-4">
                        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                            <div>
                                <h4 className="font-bold text-slate-900 dark:text-white">{sprint.name}</h4>
                                <p className="text-xs text-slate-500">{new Date(sprint.startDate).toLocaleDateString()} - {new Date(sprint.endDate).toLocaleDateString()}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="px-2 py-1 text-xs font-semibold rounded bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 uppercase">
                                    {sprint.status}
                                </span>
                                <Button onClick={() => handleOpenExport(sprint._id)} className="text-sm py-1 px-3">Mover Sprint a Tablero</Button>
                            </div>
                        </div>
                        <div className="p-4 space-y-2">
                            {(sprintCardsMap[sprint._id] || []).length === 0 ? (
                                <p className="text-sm text-slate-500 text-center py-2">Arrastra o asigna tareas del backlog a este sprint.</p>
                            ) : (
                                sprintCardsMap[sprint._id].map(card => (
                                    <div key={card._id} className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg flex items-center justify-between group">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-2 h-2 rounded-full ${card.priority === 'alta' ? 'bg-red-500' : card.priority === 'media' ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
                                            <span className="text-sm font-medium dark:text-slate-200">{card.title}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => handleOpenExportCard(card._id)} className="text-xs text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-1 rounded" title="Mover a Tablero">
                                                Mover a Tablero
                                            </button>
                                            <button onClick={() => handleRemoveFromSprint(card._id)} className="text-xs text-slate-500 hover:text-red-500 px-2 py-1" title="Quitar del Sprint">
                                                Quitar
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Backlog Tasks */}
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 mt-8">
                <div className="p-4 border-b border-slate-200 dark:border-slate-800">
                    <form onSubmit={handleCreateTask} className="flex gap-3">
                        <input
                            type="text"
                            value={newTaskTitle}
                            onChange={(e) => setNewTaskTitle(e.target.value)}
                            placeholder="Añadir una nueva incidencia al backlog..."
                            className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-transparent focus:ring-2 focus:ring-blue-500 outline-none dark:text-white"
                        />
                        <Button type="submit">Crear Tarea</Button>
                    </form>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-slate-800/50">
                    {backlog.length === 0 ? (
                        <div className="p-8 text-center text-slate-500">El backlog está vacío.</div>
                    ) : (
                        backlog.map((item) => (
                            <div key={item._id} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 group">
                                <div className="flex items-center gap-4">
                                    <div className={`w-2 h-2 rounded-full ${item.priority === 'alta' ? 'bg-red-500' : item.priority === 'media' ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
                                    <span className="font-medium text-slate-700 dark:text-slate-300">{item.title}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button 
                                        onClick={() => handleOpenAssignModal(item._id)}
                                        className="text-xs font-medium bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 px-3 py-1.5 rounded transition-colors"
                                    >
                                        Mover a Sprint
                                    </button>
                                    <button 
                                        onClick={() => handleOpenExportCard(item._id)}
                                        className="text-xs font-medium bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400 px-3 py-1.5 rounded transition-colors"
                                    >
                                        Mover a Tablero
                                    </button>
                                    <button onClick={() => handleDelete(item._id)} className="text-red-500 hover:text-red-700 bg-red-50 dark:bg-red-900/20 p-1.5 rounded" title="Eliminar Tarea">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Modal for Assigning Card from Backlog */}
            {assigningCardId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl w-full max-w-sm">
                        <h3 className="text-lg font-bold mb-4 dark:text-white">Mover a Sprint</h3>
                        
                        <div className="space-y-4 mb-6">
                            <div>
                                <label className="block text-sm mb-1 dark:text-slate-300">Seleccionar Sprint</label>
                                <select className="w-full p-2 border rounded dark:bg-slate-800 dark:border-slate-700 dark:text-white" value={assignSprintId} onChange={e => setAssignSprintId(e.target.value)} disabled={isAssigning}>
                                    <option value="">-- Elige un sprint --</option>
                                    {sprints.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <Button className="flex-1" variant="ghost" onClick={() => setAssigningCardId(null)} disabled={isAssigning}>Cancelar</Button>
                            <Button className="flex-1 bg-green-600 hover:bg-green-700" onClick={handleConfirmAssign} disabled={!assignSprintId || isAssigning} isLoading={isAssigning}>
                                Mover Tarea
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal for Exporting Sprint to Board */}
            {exportingSprintId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl w-full max-w-sm">
                        <h3 className="text-lg font-bold mb-4 dark:text-white">Convertir Sprint a Tablero</h3>
                        
                        <div className="space-y-4 mb-6">
                            <p className="text-sm text-slate-600 dark:text-slate-300">
                                Esto creará un nuevo Tablero para este Sprint y moverá todas sus tareas automáticamente a la primera columna.
                            </p>
                            <div>
                                <label className="block text-sm mb-1 dark:text-slate-300">Plantilla del Tablero</label>
                                <select className="w-full p-2 border rounded dark:bg-slate-800 dark:border-slate-700 dark:text-white" value={exportSprintTemplateId} onChange={e => setExportSprintTemplateId(e.target.value)} disabled={isExportingCards}>
                                    <option value="" disabled>-- Selecciona una plantilla --</option>
                                    {templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <Button className="flex-1" variant="ghost" onClick={() => setExportingSprintId(null)} disabled={isExportingCards}>Cancelar</Button>
                            <Button className="flex-1 bg-green-600 hover:bg-green-700" onClick={handleExportSprint} disabled={!exportSprintTemplateId || isExportingCards} isLoading={isExportingCards}>
                                Crear y Mover
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal for Exporting Single Card to Board */}
            {exportCardId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl w-full max-w-sm">
                        <h3 className="text-lg font-bold mb-4 dark:text-white">Mover a Tablero</h3>
                        
                        <div className="space-y-4 mb-6">
                            <div>
                                <label className="block text-sm mb-1 dark:text-slate-300">Seleccionar Tablero</label>
                                <select className="w-full p-2 border rounded dark:bg-slate-800 dark:border-slate-700 dark:text-white" value={exportCardBoardId} onChange={handleExportCardBoardChange} disabled={isExportingCard}>
                                    <option value="">-- Elige un tablero --</option>
                                    {boards.map(b => <option key={b.id} value={b.id}>{b.title}</option>)}
                                </select>
                            </div>
                            
                            {exportCardBoardId && (
                                <div>
                                    <label className="block text-sm mb-1 dark:text-slate-300">Columna de destino</label>
                                    <select className="w-full p-2 border rounded dark:bg-slate-800 dark:border-slate-700 dark:text-white" value={exportCardColumnId} onChange={e => setExportCardColumnId(e.target.value)} disabled={isExportingCard}>
                                        <option value="">-- Elige una columna --</option>
                                        {exportCardColumns.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                                    </select>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-2">
                            <Button className="flex-1" variant="ghost" onClick={() => setExportCardId(null)} disabled={isExportingCard}>Cancelar</Button>
                            <Button className="flex-1 bg-indigo-600 hover:bg-indigo-700" onClick={handleConfirmExportCard} disabled={!exportCardColumnId || isExportingCard} isLoading={isExportingCard}>
                                Mover Tarea
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
