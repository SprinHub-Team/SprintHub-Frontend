import { useCallback, useEffect, useState } from 'react';
import { Activity as ActivityIcon, CheckCheck, Clock3, Crown, RefreshCw, Trophy, Users } from 'lucide-react';
import { Button } from '@/components/ui/Button/Button';
import { LoadingState } from '@/components/ui/LoadingState/LoadingState';
import { ErrorState } from '@/components/ui/ErrorState/ErrorState';
import { UserAvatar } from '@/features/cards/components/UserAvatar';
import type { GroupDetails } from '@/features/groups/types/group.types';
import { errorHandler } from '@/services/api/errors/errorHandler';
import { statisticsService, type Statistics, type CompletedActivity } from '../services/statisticsService';

function CompletedActivitiesPanel({ group, refresh }: { group: GroupDetails; refresh: number }) {
  const [activities, setActivities] = useState<CompletedActivity[] | null>(null);
  const [error, setError] = useState('');
  const [assignee, setAssignee] = useState('');

  useEffect(() => {
    let active = true;
    statisticsService.completed(group.id)
      .then(result => {
        if (active) {
          setActivities(result);
          setError('');
        }
      })
      .catch(caught => {
        if (active) setError(errorHandler(caught).message);
      });
    return () => { active = false; };
  }, [group.id, refresh]);

  const members = new Map(group.members.map(member => [member.id, member.name]));
  const visible = activities?.filter(activity => {
    if (!assignee) return true;
    return assignee === 'unassigned' ? activity.assignedTo === null : activity.assignedTo === assignee;
  });

  return (
    <section className="workspace-panel overflow-hidden" aria-labelledby="completed-activities-title">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-(--border-subtle) p-5">
        <h2 id="completed-activities-title" className="flex items-center gap-2 font-semibold">
          <CheckCheck aria-hidden="true" className="size-5 text-(--sand)" />
          Actividades finalizadas
        </h2>
        <select
          aria-label="Filtrar actividades finalizadas por responsable"
          className="workspace-select"
          value={assignee}
          onChange={event => setAssignee(event.target.value)}
        >
          <option value="">Todos los responsables</option>
          <option value="unassigned">Sin responsable</option>
          {group.members.map(member => <option key={member.id} value={member.id}>{member.name}</option>)}
        </select>
      </header>
      {error && <p role="alert" className="p-5 text-sm">{error}</p>}
      {!activities && !error && <div className="p-5"><LoadingState message="Cargando actividades finalizadas…" /></div>}
      {visible?.length === 0 && (
        <p className="p-8 text-center text-sm text-(--text-muted)">No hay actividades finalizadas para este filtro.</p>
      )}
      {!!visible?.length && (
        <div className="max-h-96 overflow-auto">
          <table className="w-full min-w-96 text-left text-sm">
            <thead className="sticky top-0 bg-(--ink-soft) text-xs text-(--text-muted)">
              <tr>
                <th scope="col" className="px-5 py-3 font-medium">Tarjeta</th>
                <th scope="col" className="px-5 py-3 font-medium">Responsable</th>
                <th scope="col" className="px-5 py-3 font-medium">Fecha de creación</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-(--border-subtle-soft)">
              {visible.map(activity => (
                <tr key={activity.id}>
                  <td className="px-5 py-3 font-medium">{activity.title}</td>
                  <td className="px-5 py-3 text-(--text-on-dark-muted)">
                    {activity.assignedTo ? members.get(activity.assignedTo) ?? 'Miembro no disponible' : 'Sin responsable'}
                  </td>
                  <td className="px-5 py-3 text-(--text-muted)">
                    {activity.createdAt && <time dateTime={activity.createdAt}>{new Date(activity.createdAt).toLocaleDateString()}</time>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export function StatisticsWorkspace({ group }: { group: GroupDetails }) {
  const [data, setData] = useState<Statistics | null>(null); const [error, setError] = useState(''); const [refresh, setRefresh] = useState(0);
  const [sort, setSort] = useState<'completed' | 'pending' | 'overdue'>('completed');
  const reload = useCallback(() => setRefresh(v => v + 1), []);
  useEffect(() => {
    let alive = true;
    statisticsService.load(group.id).then(result => { if (alive) { setData(result); setError(''); } }).catch(caught => { if (alive) setError(errorHandler(caught).message); });
    return () => { alive = false; };
  }, [group.id, refresh]);
  useEffect(() => { const timer = setInterval(() => { if (!document.hidden) reload(); }, 30000); window.addEventListener('focus', reload); return () => { clearInterval(timer); window.removeEventListener('focus', reload); }; }, [reload]);
  if (!data) return error ? <ErrorState title="No se pudieron cargar las estadísticas" message={error} onRetry={reload} /> : <LoadingState message="Calculando el progreso del equipo…" />;
  const leaders = data.users.filter(u => u.completed > 0).slice(0, 3);
  const ordered = [...data.users].sort((a, b) => b[sort] - a[sort] || a.name.localeCompare(b.name));
  const completion = data.totals.created ? Math.round(data.totals.completed / data.totals.created * 100) : 0;
  const top = (key: 'pending' | 'overdue') => { const max = Math.max(0, ...data.users.map(u => u[key])); return max ? data.users.filter(u => u[key] === max).map(u => u.name).join(', ') : 'Sin tareas'; };
  return <div className="workspace-enter mx-auto max-w-7xl space-y-6">
    <header className="flex flex-wrap items-start justify-between gap-3"><div><p className="workspace-eyebrow">{group.name} / Visión del equipo</p><h1 className="mt-2 text-3xl font-semibold tracking-tight">Reportes del grupo</h1></div><Button size="sm" variant="secondary" onClick={reload} icon={<RefreshCw className="size-4" />}>Actualizar</Button></header>
    {error && <p role="alert" className="workspace-panel p-3 text-sm">{error}</p>}
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{[{ label: 'Tarjetas en tableros', value: data.totals.created, Icon: Users }, { label: 'Completadas', value: data.totals.completed, Icon: CheckCheck }, { label: 'Pendientes', value: data.totals.pending, Icon: Clock3 }, { label: 'Vencidas', value: data.totals.overdue, Icon: ActivityIcon }].map(item => <div className="workspace-panel p-5" key={item.label}><div className="flex items-center justify-between"><p className="workspace-eyebrow">{item.label}</p><item.Icon className="size-4 text-(--taupe)" /></div><p className="mt-3 text-4xl font-semibold tracking-tight text-(--cream)">{item.value}</p></div>)}</div>
    <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
      <section className="workspace-panel podium-panel p-6"><div className="flex items-center gap-2"><Trophy className="size-5 text-(--sand)" /><h2 className="font-semibold">El podio del equipo</h2></div><p className="mt-1 text-xs text-(--text-muted)">Según las tareas completadas asignadas a cada persona.</p>
        {leaders.length ? <div className="mt-8 flex min-h-64 items-end justify-center gap-3">{[1, 0, 2].filter(i => leaders[i]).map(index => { const user = leaders[index]; const place = leaders.findIndex(u => u.completed === user.completed) + 1; return <div key={user.id} className="flex w-1/3 max-w-40 flex-col items-center text-center"><div className="mb-3 flex flex-col items-center gap-2">{place === 1 && <Crown className="size-5 text-(--sand)" />}<UserAvatar name={user.name} profilePicture={user.profilePicture} className="size-12 text-base" /><p className="max-w-full truncate text-sm font-medium">{user.name}</p><p className="text-xs text-(--text-muted)">{user.completed} completadas</p></div><div className={`podium-step podium-step-${index} flex w-full items-center justify-center rounded-t-xl border border-(--border-subtle) text-4xl font-semibold text-(--cream)`} style={{ height: index === 0 ? 112 : index === 1 ? 80 : 56 }}>{place}<span className="text-lg">º</span></div></div>; })}</div> : <div className="flex min-h-64 flex-col items-center justify-center gap-3 text-center text-(--text-muted)"><Trophy className="size-10" /><p className="text-sm">El podio espera los primeros logros.<br />Mueve una tarjeta asignada a una columna de finalización para aparecer aquí.</p></div>}
      </section>
      <section className="workspace-panel flex flex-col justify-between gap-5 p-6"><div><p className="workspace-eyebrow">Progreso del espacio</p><p className="mt-2 text-5xl font-semibold text-(--cream)">{completion}<span className="text-2xl text-(--taupe)">%</span></p><div role="progressbar" aria-label="Tareas completadas del espacio" aria-valuenow={completion} aria-valuemin={0} aria-valuemax={100} className="mt-4 h-2 overflow-hidden rounded-full bg-(--ink-hover)"><div className="h-full bg-(image:--gradient-main) transition-[width] duration-500" style={{ width: `${completion}%` }} /></div></div><div className="space-y-4 border-t border-(--border-subtle) pt-4"><div><p className="workspace-eyebrow">Más tareas pendientes</p><p className="mt-1 text-sm">{top('pending')}</p></div><div><p className="workspace-eyebrow">Más tareas vencidas</p><p className="mt-1 text-sm">{top('overdue')}</p></div><p className="text-xs text-(--text-muted)">{data.unassigned.created} tareas sin responsable · {data.unassigned.overdue} vencidas</p></div></section>
    </div>
    <section className="workspace-panel overflow-hidden"><header className="flex flex-wrap items-center justify-between gap-3 p-5"><div><h2 className="font-semibold">Distribución del trabajo</h2><p className="mt-1 text-xs text-(--text-muted)">Las tarjetas se cuentan como completadas cuando están en una columna de finalización. Las vencidas forman parte de las pendientes.</p></div><select aria-label="Ordenar estadísticas" className="workspace-select" value={sort} onChange={e => setSort(e.target.value as typeof sort)}><option value="completed">Más completadas</option><option value="pending">Más pendientes</option><option value="overdue">Más vencidas</option></select></header><div className="overflow-x-auto"><table className="w-full min-w-140 text-left text-sm"><thead className="border-y border-(--border-subtle) bg-(--ink-soft) text-xs text-(--text-muted)"><tr><th className="px-5 py-3 font-medium">Persona</th><th className="px-4 font-medium">Total</th><th className="px-4 font-medium">Pendientes</th><th className="px-4 font-medium">Completadas</th><th className="px-4 font-medium">Vencidas</th><th className="px-5 font-medium">Progreso</th></tr></thead><tbody className="divide-y divide-(--border-subtle-soft)">{ordered.map(user => <tr key={user.id} className="hover:bg-(--ink-hover)"><td className="flex items-center gap-3 px-5 py-4"><UserAvatar name={user.name} profilePicture={user.profilePicture} className="size-8 text-xs" />{user.name}</td><td className="px-4">{user.created}</td><td className="px-4">{user.pending}</td><td className="px-4 text-(--sand)">{user.completed}</td><td className="px-4">{user.overdue}</td><td className="px-5"><div className="flex items-center gap-2"><div className="h-1.5 w-20 overflow-hidden rounded-full bg-(--ink-hover)"><div className="h-full bg-(--sand)" style={{ width: `${user.created ? user.completed / user.created * 100 : 0}%` }} /></div><span className="text-xs text-(--text-muted)">{user.created ? Math.round(user.completed / user.created * 100) : 0}%</span></div></td></tr>)}</tbody></table></div></section>
    <CompletedActivitiesPanel group={group} refresh={refresh} />
    <p className="text-xs text-(--text-muted)">Actualizado {new Date(data.generatedAt).toLocaleTimeString()} · Se actualiza cada 30 segundos.</p>
  </div>;
}
