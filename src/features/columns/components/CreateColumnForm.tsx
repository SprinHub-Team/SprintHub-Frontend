import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Check, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/Button/Button';
import { Input } from '@/components/ui/Input/Input';
import { useColumnMutations } from '../hooks/useColumnMutations';
import styles from './CreateColumnForm.module.css';

export interface CreateColumnFormProps {
  boardId: string;
}

export function CreateColumnForm({ boardId }: CreateColumnFormProps) {
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState('');
  const { loading, create } = useColumnMutations();
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (adding) {
      inputRef.current?.focus();
    }
  }, [adding]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = name.trim();
    if (trimmed.length < 2) return;
    const succeeded = await create(boardId, { name: trimmed });
    if (succeeded) {
      setName('');
      setAdding(false);
    }
  };

  if (!adding) {
    return (
      <button
        type="button"
        onClick={() => setAdding(true)}
        className={styles.addButton}
      >
        <Plus aria-hidden="true" className="icon-md" />
        Añadir columna
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={styles.form}
    >
      <Input
        label="Nombre de la columna"
        hideLabel
        name="column-name"
        placeholder="En revisión"
        value={name}
        onChange={(event) => setName(event.target.value)}
        disabled={loading}
        autoFocus
        ref={inputRef}
      />
      <div className={styles.actions}>
        <Button type="submit" size="sm" loading={loading} icon={<Check aria-hidden="true" className="icon-md" />}>
          Añadir
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            setAdding(false);
            setName('');
          }}
          icon={<X aria-hidden="true" className="icon-md" />}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}
