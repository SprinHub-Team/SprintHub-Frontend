import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Check, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/Button/Button';
import { Input } from '@/components/ui/Input/Input';
import { useColumnMutations } from '../hooks/useColumnMutations';

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
        className="flex h-11 w-72 shrink-0 items-center gap-2 rounded-(--radius) border border-dashed border-(--border-subtle) px-4 text-sm text-(--text-muted) transition-colors duration-200 ease-out hover:border-(--border-dark) hover:text-(--cream)"
      >
        <Plus aria-hidden="true" className="size-4" />
        Añadir columna
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex h-fit w-72 shrink-0 flex-col gap-3 rounded-(--radius) border border-(--border-subtle) bg-(--ink-raised) p-4"
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
      <div className="flex gap-2">
        <Button type="submit" size="sm" loading={loading} icon={<Check aria-hidden="true" className="size-4" />}>
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
          icon={<X aria-hidden="true" className="size-4" />}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}
