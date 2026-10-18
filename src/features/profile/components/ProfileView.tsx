import { useEffect, useState, type FormEvent } from 'react';
import { ArrowLeft, IdCard, Mail, Trash2, UserRound } from 'lucide-react';
import { Alert } from '@/components/ui/Alert/Alert';
import { Button } from '@/components/ui/Button/Button';
import { ErrorState } from '@/components/ui/ErrorState/ErrorState';
import { FileDropzone } from '@/components/ui/FileDropzone/FileDropzone';
import { Input } from '@/components/ui/Input/Input';
import { LoadingState } from '@/components/ui/LoadingState/LoadingState';
import { cn } from '@/lib/utils';
import { MEDIA_RULE } from '@/lib/uploads/fileValidation';
import { zodFieldErrors } from '@/lib/zodFormErrors';
import { profileFormSchema, type ProfileFormData } from '../schemas/profileFormSchema';
import { useProfile } from '../hooks/useProfile';
import styles from './ProfileView.module.css';

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
        className={styles.errorCard}
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
    <div className={styles.wrapper}>
      <header className={styles.identity}>
        <span aria-hidden="true" className={styles.avatar}>
          {profile.profilePicture ? (
            <img src={profile.profilePicture} alt="" className={styles.avatarImage} />
          ) : (
            profile.name.slice(0, 2).toUpperCase()
          )}
        </span>
        <div className={styles.identityText}>
          <h1 className={styles.name}>{profile.name}</h1>
          <p className={styles.meta}>
            <Mail aria-hidden="true" className={styles.metaIcon} />
            <span className={styles.metaValue}>{profile.email}</span>
          </p>
          <p className={styles.meta}>
            <IdCard aria-hidden="true" className={styles.metaIcon} />
            <span className={styles.metaValue}>{profile.document}</span>
          </p>
        </div>
      </header>

      <section
        aria-labelledby="edit-profile-title"
        className={styles.card}
      >
        <div className={styles.cardHeader}>
          <h2 id="edit-profile-title" className={styles.cardTitle}>
            Editar perfil
          </h2>
          <p className={styles.cardDescription}>
            Actualiza tus datos y tu foto de perfil. Los cambios se guardan en tu cuenta.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className={styles.form}>
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

          <div className={styles.formActions}>
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
            <Button type="submit" loading={saving} icon={<UserRound aria-hidden="true" className="icon-md" />}>
              Guardar cambios
            </Button>
          </div>
        </form>
      </section>

      <section
        aria-labelledby="danger-zone-title"
        className={styles.dangerZone}
      >
        <div className={styles.dangerHeader}>
          <h2 id="danger-zone-title" className={styles.dangerTitle}>
            Zona de riesgo
          </h2>
          <p className={styles.dangerDescription}>
            Eliminar tu cuenta te retirará de todos los grupos de trabajo. Esta acción no se puede
            deshacer.
          </p>
        </div>
        <div className={styles.dangerActions}>
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
            icon={<Trash2 aria-hidden="true" className="icon-md" />}
            className={cn(styles.deleteButton, confirmingDelete ? styles.deleteConfirming : undefined)}
          >
            {confirmingDelete ? 'Confirmar eliminación' : 'Eliminar mi cuenta'}
          </Button>
        </div>
      </section>
    </div>
  );
}
