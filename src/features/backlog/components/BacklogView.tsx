import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { backlogService, type CardPB } from '../services/backlogService';
import { sprintService, type Sprint } from '@/features/sprints/services/sprintService';
import * as boardService from '@/features/boards/services/boardService';
import { useBoards } from '@/features/boards/hooks/useBoards';
import { templateService, type BoardTemplate } from '@/features/templates/services/templateService';
import apiClient from '@/services/api/apiClient';
import Button from '@/components/common/ui/Button';

// Icons
const ChevronDownIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
);
const MoreHorizontalIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
    </svg>
);
const PlusIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
);

export function BacklogView({ groupId }: { groupId: string }) {
    // --- Existing States ---
    const [backlog, setBacklog] = useState<CardPB[]>([]);
    const [sprints, setSprints] = useState<Sprint[]>([]);
    const [sprintCardsMap, setSprintCardsMap] = useState<Record<string, CardPB[]>>({});
    
    const [isLoading, setIsLoading] = useState(true);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    
    const [isCreatingSprint, setIsCreatingSprint] = useState(false);
    const [newSprint, setNewSprint] = useState({ name: '', goal: '', startDate: '', endDate: '', templateId: '' });
    const [templates, setTemplates] = useState<BoardTemplate[]>([]);

    const [exportingSprintId, setExportingSprintId] = useState<string | null>(null);
    const [exportSprintTemplateId, setExportSprintTemplateId] = useState<string>('');
    const [isExportingCards, setIsExportingCards] = useState(false);

    const [assigningCardId, setAssigningCardId] = useState<string | null>(null);
    const [assignSprintId, setAssignSprintId] = useState<string>('');
    const [isAssigning, setIsAssigning] = useState(false);

    const [exportCardId, setExportCardId] = useState<string | null>(null);
    const [exportCardBoardId, setExportCardBoardId] = useState<string>('');
    const [exportCardColumnId, setExportCardColumnId] = useState<string>('');
    const [exportCardColumns, setExportCardColumns] = useState<any[]>([]);
    const [isExportingCard, setIsExportingCard] = useState(false);
    const { boards } = useBoards(groupId);

    // --- UI States (Jira-like) ---
    const [expandedSprints, setExpandedSprints] = useState<Record<string, boolean>>({});
    const [isBacklogExpanded, setIsBacklogExpanded] = useState(true);

    const toggleSprint = (id: string) => {
        setExpandedSprints(prev => ({ ...prev, [id]: prev[id] === undefined ? false : !prev[id] }));
    };

    const isSprintExpanded = (id: string) => expandedSprints[id] !== false; // expanded by default

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
                const spCards = await sprintService.getSprintCards(sp._id || (sp as any).id);
                map[sp._id || (sp as any).id] = spCards;
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

    // --- Handlers (Preserved Logic) ---
    const handleCreateTask = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTaskTitle.trim()) return;
        try {
            await backlogService.createCard({ title: newTaskTitle, groupId, priority: 'media', tasks: [] });
            setNewTaskTitle('');
            fetchData();
        } catch (error) { console.error(error); }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('¿Eliminar esta tarea?')) return;
        try {
            await backlogService.deleteCard(id);
            fetchData();
        } catch (error) { console.error(error); }
    };

    const handleCreateSprint = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newSprint.name || !newSprint.startDate || !newSprint.endDate) return;
        try {
            const newSprintRes = await sprintService.createSprint({ ...newSprint, groupId, status: 'planificado' });
            if (newSprint.templateId) {
                localStorage.setItem(`sprint_template_${newSprintRes._id || (newSprintRes as any).id}`, newSprint.templateId);
            }
            setIsCreatingSprint(false);
            setNewSprint({ name: '', goal: '', startDate: '', endDate: '', templateId: '' });
            fetchData();
        } catch (error) { console.error(error); }
    };

    const handleRemoveFromSprint = async (cardId: string) => {
        try {
            await sprintService.moveCardToSprint(cardId, null);
            fetchData();
        } catch (error) { console.error(error); }
    };

    const handleOpenExport = (sprintId: string) => {
        setExportingSprintId(sprintId);
        const savedTemplate = localStorage.getItem(`sprint_template_${sprintId}`);
        setExportSprintTemplateId(savedTemplate || '');
    };

    const handleExportSprint = async () => {
        if (!exportingSprintId || !exportSprintTemplateId) return;
        setIsExportingCards(true);
        try {
            const sprint = sprints.find(s => (s._id || (s as any).id) === exportingSprintId);
            if (!sprint) return;

            const cards = sprintCardsMap[exportingSprintId] || [];
            if (cards.length === 0) {
                alert('El sprint no tiene tareas para exportar.');
                setIsExportingCards(false);
                return;
            }

            let targetBoardId = '';
            let isReused = false;

            const existingBoards = await boardService.findByGroupId(groupId);
            const existingBoard = existingBoards.find(b => b.title === sprint.name);

            if (existingBoard) {
                targetBoardId = existingBoard.id || (existingBoard as any)._id;
                isReused = true;
            } else {
                const board = await boardService.createBoard({ title: sprint.name, description: `Tablero generado para ${sprint.name}`, groupId });
                targetBoardId = board.id || (board as any)._id;
                await templateService.applyTemplate(targetBoardId, exportSprintTemplateId);
            }

            const response = await apiClient.get<{data: any[]}>(`/columns/board/${targetBoardId}`);
            const cols = response.data.data || [];
            if (cols.length === 0) throw new Error('El tablero no generó columnas');

            const firstColumnId = cols[0]._id || cols[0].id;
            for (const card of cards) {
                await sprintService.exportToBoard(card._id || (card as any).id, firstColumnId);
            }

            if (isReused) {
                alert(`Las tareas se enviaron al tablero '${sprint.name}' que ya estaba creado.`);
            } else {
                alert('¡Sprint convertido a Tablero correctamente! Se han movido todas las tareas.');
            }
            
            setExportingSprintId(null);
            fetchData();
        } catch (error) { console.error(error); alert('Error al exportar a tablero.'); } finally { setIsExportingCards(false); }
    };

    const handleOpenAssignModal = (cardId: string) => { setAssigningCardId(cardId); setAssignSprintId(''); };

    const handleConfirmAssign = async () => {
        if (!assigningCardId || !assignSprintId) return;
        setIsAssigning(true);
        try {
            await sprintService.moveCardToSprint(assigningCardId, assignSprintId);
            setAssigningCardId(null);
            fetchData();
        } catch (error) { console.error(error); } finally { setIsAssigning(false); }
    };

    const handleOpenExportCard = (cardId: string) => {
        setExportCardId(cardId); setExportCardBoardId(''); setExportCardColumnId(''); setExportCardColumns([]);
    };

    const handleExportCardBoardChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const bid = e.target.value;
        setExportCardBoardId(bid);
        setExportCardColumnId('');
        if (!bid) { setExportCardColumns([]); return; }
        try {
            const response = await apiClient.get<{data: any[]}>(`/columns/board/${bid}`);
            setExportCardColumns(response.data.data || []);
        } catch (error) { console.error(error); }
    };

    const handleConfirmExportCard = async () => {
        if (!exportCardId || !exportCardColumnId) return;
        setIsExportingCard(true);
        try {
            await sprintService.exportToBoard(exportCardId, exportCardColumnId);
            setExportCardId(null);
            fetchData();
        } catch (error) { console.error(error); } finally { setIsExportingCard(false); }
    };

    // --- Render Helpers ---
    const renderCard = (card: CardPB, inSprint: boolean) => (
        <div key={card._id || (card as any).id} className="group flex items-center justify-between px-4 py-2.5 border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors text-sm">
            <div className="flex items-center gap-3 flex-1 overflow-hidden">
                <input type="checkbox" className="rounded border-slate-300 dark:border-slate-700 bg-transparent text-blue-600 focus:ring-blue-500" />
                <span className="font-medium text-slate-500 dark:text-slate-400 shrink-0">SPRN-{(card._id || (card as any).id).slice(-4)}</span>
                <span className="text-slate-900 dark:text-slate-200 truncate">{card.title}</span>
                <span className="text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 ml-2">Listo</span>
            </div>
            
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                {inSprint ? (
                    <button onClick={() => handleRemoveFromSprint(card._id || (card as any).id)} className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors">
                        Quitar
                    </button>
                ) : (
                    <>
                        <button onClick={() => handleOpenAssignModal(card._id || (card as any).id)} className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded transition-colors hover:bg-blue-200 dark:hover:bg-blue-900/50">
                            A Sprint
                        </button>
                        <button onClick={() => handleOpenExportCard(card._id || (card as any).id)} className="text-xs px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 rounded transition-colors hover:bg-indigo-200 dark:hover:bg-indigo-900/50">
                            A Tablero
                        </button>
                    </>
                )}
                <button onClick={() => handleDelete(card._id || (card as any).id)} className="text-red-500 hover:text-red-600 p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
            </div>
        </div>
    );

    if (isLoading) return <div className="p-8 text-center text-slate-500">Cargando...</div>;

    return (
        <div className="flex-1 bg-white dark:bg-[#0f1115] overflow-y-auto min-h-full pb-20">
            <div className="max-w-6xl mx-auto p-4 sm:p-8 space-y-6">
                
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Backlog</h2>
                        <div className="flex gap-4 text-sm text-slate-500 mt-1">
                            <span>SPRINTHUB</span>
                            <a href={backlogService.exportCsvUrl(groupId)} target="_blank" rel="noreferrer" className="hover:text-blue-500">Exportar CSV</a>
                        </div>
                    </div>
                    <Button onClick={() => setIsCreatingSprint(true)} className="flex items-center gap-2 rounded-md">
                        <PlusIcon className="w-4 h-4" />
                        Crear sprint
                    </Button>
                </div>

                {/* Create Sprint Form (inline) */}
                <AnimatePresence>
                    {isCreatingSprint && (
                        <motion.form 
                            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                            onSubmit={handleCreateSprint} 
                            className="bg-slate-50 dark:bg-[#161a1d] p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 overflow-hidden mb-6"
                        >
                            <h4 className="font-bold mb-2 dark:text-white">Nuevo Sprint</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input required type="text" placeholder="Nombre (ej. Sprint 1)" className="w-full px-3 py-2 border rounded-md dark:bg-slate-900 dark:border-slate-700 dark:text-white focus:ring-1 focus:ring-blue-500 outline-none" value={newSprint.name} onChange={e => setNewSprint({...newSprint, name: e.target.value})} />
                                <select className="w-full px-3 py-2 border rounded-md dark:bg-slate-900 dark:border-slate-700 dark:text-white focus:ring-1 focus:ring-blue-500 outline-none" value={newSprint.templateId} onChange={e => setNewSprint({...newSprint, templateId: e.target.value})}>
                                    <option value="">Plantilla opcional</option>
                                    {templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                                </select>
                                <input required type="date" className="w-full px-3 py-2 border rounded-md dark:bg-slate-900 dark:border-slate-700 dark:text-white focus:ring-1 focus:ring-blue-500 outline-none" value={newSprint.startDate} onChange={e => setNewSprint({...newSprint, startDate: e.target.value})} />
                                <input required type="date" className="w-full px-3 py-2 border rounded-md dark:bg-slate-900 dark:border-slate-700 dark:text-white focus:ring-1 focus:ring-blue-500 outline-none" value={newSprint.endDate} onChange={e => setNewSprint({...newSprint, endDate: e.target.value})} />
                            </div>
                            <div className="flex gap-2 justify-end mt-4">
                                <Button type="button" variant="ghost" onClick={() => setIsCreatingSprint(false)}>Cancelar</Button>
                                <Button type="submit">Guardar Sprint</Button>
                            </div>
                        </motion.form>
                    )}
                </AnimatePresence>

                {/* Sprints Sections */}
                {sprints.map(sprint => {
                    const sprintId = sprint._id || (sprint as any).id;
                    const cards = sprintCardsMap[sprintId] || [];
                    const isExpanded = isSprintExpanded(sprintId);
                    
                    return (
                        <div key={sprintId} className="bg-white dark:bg-[#1d2125] border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden transition-all shadow-sm">
                            {/* Accordion Header */}
                            <div 
                                className="px-4 py-3 bg-slate-50 dark:bg-[#161a1d] cursor-pointer flex justify-between items-center group border-b border-transparent dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-[#1f2428] transition-colors"
                                onClick={() => toggleSprint(sprintId)}
                            >
                                <div className="flex items-center gap-3">
                                    <ChevronDownIcon className={`w-4 h-4 text-slate-500 transition-transform ${!isExpanded ? '-rotate-90' : ''}`} />
                                    <span className="font-semibold text-sm text-slate-900 dark:text-white">{sprint.name}</span>
                                    <span className="text-xs text-slate-500 hidden sm:inline-block">
                                        {new Date(sprint.startDate).toLocaleDateString()} – {new Date(sprint.endDate).toLocaleDateString()}
                                    </span>
                                    <span className="text-xs text-slate-500">({cards.length} actividades)</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); handleOpenExport(sprintId); }}
                                        className="text-xs font-medium bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                                    >
                                        Completar sprint
                                    </button>
                                    <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1" onClick={e => e.stopPropagation()}>
                                        <MoreHorizontalIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Accordion Content */}
                            <AnimatePresence>
                                {isExpanded && (
                                    <motion.div 
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="overflow-hidden bg-white dark:bg-[#1d2125]"
                                    >
                                        {cards.length === 0 ? (
                                            <div className="p-6 text-center text-slate-500 text-sm border-2 border-dashed border-slate-200 dark:border-slate-700 m-4 rounded-lg">
                                                Planifica tu sprint arrastrando tareas aquí (o usando 'A Sprint' desde el Backlog)
                                            </div>
                                        ) : (
                                            <div className="flex flex-col">
                                                {cards.map(card => renderCard(card, true))}
                                            </div>
                                        )}
                                        <div className="p-2 px-4 border-t border-slate-100 dark:border-slate-800/50">
                                            <button className="text-xs font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-1 py-1">
                                                <PlusIcon className="w-4 h-4" /> Crear incidencia
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    );
                })}

                {/* Backlog Section */}
                <div className="bg-white dark:bg-[#1d2125] border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden transition-all shadow-sm mt-8">
                    {/* Backlog Header */}
                    <div 
                        className="px-4 py-3 bg-slate-50 dark:bg-[#161a1d] cursor-pointer flex justify-between items-center group border-b border-transparent dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-[#1f2428] transition-colors"
                        onClick={() => setIsBacklogExpanded(!isBacklogExpanded)}
                    >
                        <div className="flex items-center gap-3">
                            <ChevronDownIcon className={`w-4 h-4 text-slate-500 transition-transform ${!isBacklogExpanded ? '-rotate-90' : ''}`} />
                            <span className="font-semibold text-sm text-slate-900 dark:text-white">Backlog</span>
                            <span className="text-xs text-slate-500 hidden sm:inline-block">Tareas sin sprint asignado</span>
                            <span className="text-xs text-slate-500">({backlog.length} actividades)</span>
                        </div>
                    </div>

                    {/* Backlog Content */}
                    <AnimatePresence>
                        {isBacklogExpanded && (
                            <motion.div 
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden bg-white dark:bg-[#1d2125]"
                            >
                                <div className="flex flex-col">
                                    {backlog.map(card => renderCard(card, false))}
                                </div>
                                
                                <form onSubmit={handleCreateTask} className="flex items-center gap-2 p-2 px-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#1a1e23]">
                                    <PlusIcon className="w-4 h-4 text-slate-400" />
                                    <input 
                                        type="text" 
                                        placeholder="¿Qué hay que hacer?" 
                                        className="w-full bg-transparent text-sm focus:outline-none dark:text-white py-1" 
                                        value={newTaskTitle} 
                                        onChange={e => setNewTaskTitle(e.target.value)} 
                                    />
                                </form>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

            </div>

            {/* Modals */}
            {assigningCardId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                    <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white dark:bg-[#1d2125] p-6 rounded-xl w-full max-w-sm border border-slate-200 dark:border-slate-800 shadow-2xl">
                        <h3 className="text-lg font-bold mb-4 dark:text-white">Mover a Sprint</h3>
                        <div className="space-y-4 mb-6">
                            <div>
                                <label className="block text-sm mb-1 dark:text-slate-600 dark:text-slate-300">Seleccionar Sprint</label>
                                <select className="w-full p-2 border rounded-md bg-slate-50 dark:bg-[#161a1d] dark:border-slate-700 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500" value={assignSprintId} onChange={e => setAssignSprintId(e.target.value)} disabled={isAssigning}>
                                    <option value="">-- Elige un sprint --</option>
                                    {sprints.map(s => <option key={s._id || (s as any).id} value={s._id || (s as any).id}>{s.name}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button className="flex-1" variant="ghost" onClick={() => setAssigningCardId(null)} disabled={isAssigning}>Cancelar</Button>
                            <Button className="flex-1" onClick={handleConfirmAssign} disabled={!assignSprintId || isAssigning} isLoading={isAssigning}>Mover</Button>
                        </div>
                    </motion.div>
                </div>
            )}

            {exportingSprintId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                    <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white dark:bg-[#1d2125] p-6 rounded-xl w-full max-w-sm border border-slate-200 dark:border-slate-800 shadow-2xl">
                        <h3 className="text-lg font-bold mb-4 dark:text-white">Completar Sprint</h3>
                        <div className="space-y-4 mb-6">
                            <p className="text-sm text-slate-600 dark:text-slate-300">
                                Las tareas se enviarán al tablero relacionado al Sprint, o se creará uno nuevo si no existe.
                            </p>
                            <div>
                                <label className="block text-sm mb-1 dark:text-slate-600 dark:text-slate-300">Plantilla (Opcional)</label>
                                <select className="w-full p-2 border rounded-md bg-slate-50 dark:bg-[#161a1d] dark:border-slate-700 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500" value={exportSprintTemplateId} onChange={e => setExportSprintTemplateId(e.target.value)} disabled={isExportingCards}>
                                    <option value="" disabled>-- Selecciona una plantilla --</option>
                                    {templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button className="flex-1" variant="ghost" onClick={() => setExportingSprintId(null)} disabled={isExportingCards}>Cancelar</Button>
                            <Button className="flex-1" onClick={handleExportSprint} disabled={!exportSprintTemplateId || isExportingCards} isLoading={isExportingCards}>Convertir</Button>
                        </div>
                    </motion.div>
                </div>
            )}

            {exportCardId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                    <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white dark:bg-[#1d2125] p-6 rounded-xl w-full max-w-sm border border-slate-200 dark:border-slate-800 shadow-2xl">
                        <h3 className="text-lg font-bold mb-4 dark:text-white">Mover a Tablero</h3>
                        <div className="space-y-4 mb-6">
                            <div>
                                <label className="block text-sm mb-1 dark:text-slate-600 dark:text-slate-300">Tablero</label>
                                <select className="w-full p-2 border rounded-md bg-slate-50 dark:bg-[#161a1d] dark:border-slate-700 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500" value={exportCardBoardId} onChange={handleExportCardBoardChange} disabled={isExportingCard}>
                                    <option value="">-- Elige un tablero --</option>
                                    {boards.map(b => <option key={b.id} value={b.id}>{b.title}</option>)}
                                </select>
                            </div>
                            {exportCardBoardId && (
                                <div>
                                    <label className="block text-sm mb-1 dark:text-slate-600 dark:text-slate-300">Columna de destino</label>
                                    <select className="w-full p-2 border rounded-md bg-slate-50 dark:bg-[#161a1d] dark:border-slate-700 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500" value={exportCardColumnId} onChange={e => setExportCardColumnId(e.target.value)} disabled={isExportingCard}>
                                        <option value="">-- Elige una columna --</option>
                                        {exportCardColumns.map(c => <option key={c._id || c.id} value={c._id || c.id}>{c.name}</option>)}
                                    </select>
                                </div>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <Button className="flex-1" variant="ghost" onClick={() => setExportCardId(null)} disabled={isExportingCard}>Cancelar</Button>
                            <Button className="flex-1" onClick={handleConfirmExportCard} disabled={!exportCardColumnId || isExportingCard} isLoading={isExportingCard}>Mover</Button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
