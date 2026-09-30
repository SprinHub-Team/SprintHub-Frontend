import { useEffect, useState, type FormEvent } from 'react';
import { ArrowLeft, IdCard, Mail, Trash2, UserRound } from 'lucide-react';
import { Alert } from '@/components/ui/Alert/Alert';
import { Button } from '@/components/ui/Button/Button';
import { ErrorState } from '@/components/ui/ErrorState/ErrorState';
import { FileDropzone } from '@/components/ui/FileDropzone/FileDropzone';
import { Input } from '@/components/ui/Input/Input';
import { LoadingState } from '@/components/ui/LoadingState/LoadingState';
import { cn } from '@/lib/utils';
import { MEDIA_RULE } from '@/services/uploads/fileValidation';
import { zodFieldErrors } from '@/lib/zodFormErrors';
import { profileFormSchema, type ProfileFormData } from '../schemas/profileFormSchema';
import { useProfile } from '../hooks/useProfile';

export function ProfileView() {
  const { profile, status, error, saving, deleting, update, removeAccount, reload } = useProfile();
  const [values, setValues] = useState<ProfileFormData | null>(null);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  useEffect(() => {
    if (profile && !values) {
      setValues({ name: profile.name, email: profile.email, document: profile.document, password: '' });
    }
  }, [profile, values]);

  useEffect(() => {
    if (!confirmingDelete) return undefined;
    const timer = setTimeout(() => setConfirmingDelete(false), 6000);
    return () => clearTimeout(timer);
  }, [confirmingDelete]);

  if (status === 'loading') {
    return <LoadingState message="Cargando tu perfil…" />;
  }

  if (status === 'error' || !profile || !values) {
    return (
      <ErrorState
        title="No se pudo cargar tu perfil"
        message={error ?? 'Ocurrió un error al comunicarse con el servidor.'}
        onRetry={reload}
        className="max-w-lg"
      />
    );
  }

  const handleChange = (field: keyof ProfileFormData) => (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setValues((current) => (current ? { ...current, [field]: event.target.value } : current));
    setFieldErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const parsed = profileFormSchema.safeParse(values);
    if (!parsed.success) {
      setFieldErrors(zodFieldErrors(parsed.error.issues));
      return;
    }
    setFieldErrors({});
    const succeeded = await update({
      name: parsed.data.name,
      email: parsed.data.email,
      document: parsed.data.document,
      password: parsed.data.password.length > 0 ? parsed.data.password : undefined,
      file: avatar,
    });
    if (succeeded) {
      setAvatar(null);
      setValues((current) => (current ? { ...current, password: '' } : current));
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-8 py-8">
      <header className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-start sm:text-left">
        <span
          aria-hidden="true"
          className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-full border border-(--border-light) bg-(image:--gradient-main) text-xl font-bold text-(--brown) shadow-(--shadow-cream)"
        >
          {profile.profilePicture ? (
            <img src={profile.profilePicture} alt="" className="size-full object-cover" />
          ) : (
            profile.name.slice(0, 2).toUpperCase()
          )}
        </span>
        <div className="flex min-w-0 flex-col gap-1">
          <h1 className="text-2xl font-semibold text-(--text-on-dark)">{profile.name}</h1>
          <p className="flex items-center justify-center gap-1.5 text-sm text-(--text-muted) sm:justify-start">
            <Mail aria-hidden="true" className="size-3.5 shrink-0" />
            <span className="truncate">{profile.email}</span>
          </p>
          <p className="flex items-center justify-center gap-1.5 text-sm text-(--text-muted) sm:justify-start">
            <IdCard aria-hidden="true" className="size-3.5 shrink-0" />
            <span className="truncate">{profile.document}</span>
          </p>
        </div>
      </header>

      <section
        aria-labelledby="edit-profile-title"
        className="flex flex-col gap-6 rounded-(--radius) border border-(--border-subtle) bg-(--ink-raised) p-6 shadow-(--shadow) sm:p-8"
      >
        <div className="flex flex-col gap-1">
          <h2 id="edit-profile-title" className="text-lg font-semibold text-(--text-on-dark)">
            Editar perfil
          </h2>
          <p className="text-sm text-(--text-muted)">
            Actualiza tus datos y tu foto de perfil. Los cambios se guardan en tu cuenta.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
          <Input
            label="Nombre completo"
            type="text"
            name="profile-name"
            autoComplete="name"
            required
            value={values.name}
            onChange={handleChange('name')}
            error={fieldErrors.name}
            disabled={saving}
          />

          <Input
            label="Correo electrónico"
            type="email"
            name="profile-email"
            autoComplete="email"
            required
            value={values.email}
            onChange={handleChange('email')}
            error={fieldErrors.email}
            disabled={saving}
          />

          <Input
            label="Documento de identidad"
            type="text"
            name="profile-document"
            autoComplete="off"
            required
            value={values.document}
            onChange={handleChange('document')}
            error={fieldErrors.document}
            disabled={saving}
          />

          <Input
            label="Nueva contraseña"
            type="password"
            name="profile-password"
            autoComplete="new-password"
            placeholder="Deja el campo vacío para conservar la actual"
            value={values.password}
            onChange={handleChange('password')}
            error={fieldErrors.password}
            hint="Opcional: mínimo 6 caracteres."
            disabled={saving}
          />

          <FileDropzone
            rule={MEDIA_RULE}
            value={avatar}
            onChange={setAvatar}
            label="Foto de perfil"
            hint="Reemplaza tu foto actual al guardar los cambios."
            disabled={saving}
            compact
          />

          <div className="flex flex-col-reverse gap-3 pt-1 sm:flex-row sm:justify-end">
            <Button
              variant="ghost"
              type="button"
              disabled={saving}
              onClick={() => {
                setValues({
                  name: profile.name,
                  email: profile.email,
                  document: profile.document,
                  password: '',
                });
                setAvatar(null);
                setFieldErrors({});
              }}
            >
              Descartar cambios
            </Button>
            <Button type="submit" loading={saving} icon={<UserRound aria-hidden="true" className="size-4" />}>
              Guardar cambios
            </Button>
          </div>
        </form>
      </section>

      <section
        aria-labelledby="danger-zone-title"
        className="flex flex-col gap-4 rounded-(--radius) border border-(--border-strong) bg-(--dropzone-error-bg) p-6 sm:p-8"
      >
        <div className="flex flex-col gap-1">
          <h2 id="danger-zone-title" className="text-lg font-semibold text-(--text-on-dark)">
            Zona de riesgo
          </h2>
          <p className="text-sm text-(--text-muted)">
            Eliminar tu cuenta te retirará de todos los grupos de trabajo. Esta acción no se puede
            deshacer.
          </p>
        </div>
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Alert variant="info" title="Se cerrará tu sesión automáticamente al eliminar la cuenta." />
          <Button
            variant="danger"
            onClick={() => {
              if (!confirmingDelete) {
                setConfirmingDelete(true);
                return;
              }
              void removeAccount();
            }}
            loading={deleting}
            icon={<Trash2 aria-hidden="true" className="size-4" />}
            className={cn('shrink-0', confirmingDelete && 'brightness-125')}
          >
            {confirmingDelete ? 'Confirmar eliminación' : 'Eliminar mi cuenta'}
          </Button>
        </div>
      </section>
    </div>
  );
}
