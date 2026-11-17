import { useCallback, useEffect, useRef, useState } from 'react';
import { useToast } from '@/components/ui/Toast/Toast';
import { errorHandler } from '@/services/api/errors/errorHandler';
import { backlogService, type Planning } from '../services/backlogService';

export function useBacklog(groupId: string) {
  const [data, setData] = useState<Planning | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const alive = useRef(true);
  const lock = useRef(false);
  const generation = useRef(0);
  const toast = useToast();
  const reload = useCallback(async () => {
    const current = ++generation.current;
    try { const result = await backlogService.load(groupId); if (alive.current && current === generation.current) { setData(result); setError(''); } }
    catch (caught) { if (alive.current && current === generation.current) setError(errorHandler(caught).message); }
  }, [groupId]);
  useEffect(() => {
    alive.current = true; void reload();
    const focus = () => { if (!lock.current) void reload(); };
    window.addEventListener('focus', focus);
    const timer = window.setInterval(() => { if (!document.hidden && !lock.current) void reload(); }, 30000);
    return () => { alive.current = false; generation.current++; window.removeEventListener('focus', focus); clearInterval(timer); };
  }, [reload]);
  const run = async (operation: () => Promise<unknown>, message: string) => {
    if (lock.current) return false;
    lock.current = true; setBusy(true);
    try { await operation(); await reload(); toast.success(message); return true; }
    catch (caught) { toast.error(errorHandler(caught).message); await reload(); return false; }
    finally { lock.current = false; if (alive.current) setBusy(false); }
  };
  return { data, error, busy, reload, run };
}
