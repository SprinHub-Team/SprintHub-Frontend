import { useCallback, useEffect, useState } from 'react';
import { useToast } from '@/components/ui/Toast/Toast';
import { errorHandler } from '@/services/api/errors/errorHandler';
import { useAuthStore } from '@/features/auth/store/useAuthStore';
import { deleteMyAccount, getMyProfile, updateMyProfile } from '../services/profileService';
import type { UpdateProfileInput, UserProfile } from '../types/profile.types';

export type ProfileStatus = 'loading' | 'success' | 'error';

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [status, setStatus] = useState<ProfileStatus>('loading');
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const toast = useToast();
  const sessionUserId = useAuthStore((state) => state.session?.user.id ?? null);

  const load = useCallback(async () => {
    if (!sessionUserId) return;
    setStatus('loading');
    setError(null);
    try {
      const loaded = await getMyProfile();
      setProfile(loaded);
      setStatus('success');
    } catch (caught: unknown) {
      setError(errorHandler(caught).message);
      setStatus('error');
    }
  }, [sessionUserId]);

  useEffect(() => {
    void load();
  }, [load]);

  const update = useCallback(
    async (input: UpdateProfileInput): Promise<boolean> => {
      if (!sessionUserId) return false;
      setSaving(true);
      try {
        const updated = await updateMyProfile(sessionUserId, input);
        setProfile(updated);
        useAuthStore.getState().updateSessionUser({
          id: updated.id,
          name: updated.name,
          email: updated.email,
          profilePicture: updated.profilePicture,
        });
        toast.success('Perfil actualizado', 'Tus datos se guardaron correctamente');
        return true;
      } catch (caught: unknown) {
        toast.error(errorHandler(caught).message, 'No se pudo actualizar el perfil');
        return false;
      } finally {
        setSaving(false);
      }
    },
    [sessionUserId, toast],
  );

  const removeAccount = useCallback(async (): Promise<boolean> => {
    setDeleting(true);
    try {
      await deleteMyAccount();
      toast.success('Cuenta eliminada', 'Tu usuario se eliminó de SprintHub');
      useAuthStore.getState().logout();
      return true;
    } catch (caught: unknown) {
      toast.error(errorHandler(caught).message, 'No se pudo eliminar la cuenta');
      return false;
    } finally {
      setDeleting(false);
    }
  }, [toast]);

  return { profile, status, error, saving, deleting, update, removeAccount, reload: load };
}
