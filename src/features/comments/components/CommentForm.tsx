import { useState, type FormEvent } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/Button/Button';
import { Input } from '@/components/ui/Input/Input';
import { TextArea } from '@/components/ui/TextArea/TextArea';
import { createCommentSchema, type CreateCommentFormData } from '../schemas/commentFormSchema';
import { useCommentMutations } from '../hooks/useCommentMutations';

export interface CommentFormProps {
  cardId: string;
}

export function CommentForm({ cardId }: CommentFormProps) {
  const [values, setValues] = useState<CreateCommentFormData>({ name: '', description: '' });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const { loading, create } = useCommentMutations();

  const handleChange = (field: keyof CreateCommentFormData) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setValues((current) => ({ ...current, [field]: event.target.value }));
    setFieldErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const parsed = createCommentSchema.safeParse(values);
    if (!parsed.success) {
      const issues: Record<string, string> = {};
      parsed.error.issues.forEach((issue) => {
        const key = issue.path.join('.');
        if (key && !issues[key]) issues[key] = issue.message;
      });
      setFieldErrors(issues);
      return;
    }
    setFieldErrors({});
    const succeeded = await create(cardId, parsed.data);
    if (succeeded) {
      setValues({ name: '', description: '' });
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <Input
        label="Título del comentario"
        name="comment-name"
        placeholder="Avance del diseño"
        required
        value={values.name}
        onChange={handleChange('name')}
        error={fieldErrors.name}
        disabled={loading}
      />

      <TextArea
        label="Mensaje"
        name="comment-description"
        placeholder="Escribe tu comentario para el equipo…"
        required
        rows={3}
        value={values.description}
        onChange={handleChange('description')}
        error={fieldErrors.description}
        disabled={loading}
      />

      <Button
        type="submit"
        loading={loading}
        icon={<Send aria-hidden="true" className="size-4" />}
        className="self-start"
      >
        Publicar comentario
      </Button>
    </form>
  );
}
