import { useId, useState, type ReactNode } from 'react';
import { ArrowDown, ArrowUp, Check, ChevronDown, Minus, UserRound } from 'lucide-react';
import type { CardPriority } from '../types/card.types';
import { UserAvatar } from './UserAvatar';

type Option<Value extends string> = {
  value: Value;
  label: string;
  description?: string;
  icon: ReactNode;
};

function CardFieldSelect<Value extends string>({
  label, value, options, onChange, disabled,
}: {
  label: string;
  value: Value;
  options: Option<Value>[];
  onChange: (value: Value) => void;
  disabled?: boolean;
}) {
  const labelId = useId();
  const valueId = useId();
  const listId = useId();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const selectedIndex = options.findIndex(option => option.value === value);
  const selected = options[selectedIndex] ?? options[0];
  const expanded = open && !disabled;

  const select = (option: Option<Value>) => {
    onChange(option.value);
    setOpen(false);
  };

  const highlight = (index: number) => {
    setActive(index);
    document.getElementById(`${listId}-${index}`)?.scrollIntoView({ block: 'nearest' });
  };

  const renderOption = (option: Option<Value>) => (
    <>
      {option.icon}
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm">{option.label}</span>
        {option.description && (
          <span className="block truncate text-xs text-(--text-muted)" title={option.description}>
            {option.description}
          </span>
        )}
      </span>
    </>
  );

  return (
    <div className="flex min-w-0 flex-col gap-2" onBlur={event => {
      if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
    }}>
      <span id={labelId} className="text-sm font-medium text-(--text-on-dark)">{label}</span>
      <button
        type="button"
        role="combobox"
        aria-labelledby={`${labelId} ${valueId}`}
        aria-expanded={expanded}
        aria-controls={expanded ? listId : undefined}
        aria-activedescendant={expanded ? `${listId}-${active}` : undefined}
        disabled={disabled}
        className="flex min-h-11 w-full items-center gap-2.5 rounded-(--radius-sm) border border-(--border-subtle) bg-(--ink-soft) px-3 py-1.5 text-left disabled:opacity-50"
        onClick={() => { setActive(Math.max(0, selectedIndex)); setOpen(!expanded); }}
        onKeyDown={event => {
          switch (event.key) {
            case 'ArrowDown':
            case 'ArrowUp': {
              event.preventDefault();
              const step = event.key === 'ArrowDown' ? 1 : -1;
              highlight(expanded ? (active + options.length + step) % options.length : Math.max(0, selectedIndex));
              setOpen(true);
              break;
            }
            case 'Home':
            case 'End':
              if (expanded) {
                event.preventDefault();
                highlight(event.key === 'Home' ? 0 : options.length - 1);
              }
              break;
            case 'Enter':
            case ' ':
              if (expanded && options[active]) {
                event.preventDefault();
                select(options[active]);
              }
              break;
            case 'Escape':
              if (expanded) {
                event.preventDefault();
                setOpen(false);
              }
              break;
          }
        }}
      >
        <span id={valueId} className="flex min-w-0 flex-1 items-center gap-2.5">{renderOption(selected)}</span>
        <ChevronDown aria-hidden="true" className={`size-4 shrink-0 text-(--taupe) ${expanded ? 'rotate-180' : ''}`} />
      </button>
      {expanded && (
        <ul id={listId} role="listbox" aria-labelledby={labelId} className="max-h-52 overflow-auto rounded-(--radius-sm) border border-(--border-subtle) bg-(--ink-soft) p-1">
          {options.map((option, index) => (
            <li
              key={option.value}
              id={`${listId}-${index}`}
              role="option"
              aria-selected={option.value === value}
              className={`flex min-h-10 cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-2 ${index === active ? 'bg-(--ink-hover)' : ''}`}
              onPointerMove={() => setActive(index)}
              onMouseDown={event => event.preventDefault()}
              onClick={() => select(option)}
            >
              {renderOption(option)}
              {option.value === value && <Check aria-hidden="true" className="size-4 shrink-0 text-(--sand)" />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

type Assignee = { id: string; name: string; email: string; profilePicture?: string };

export function AssigneeSelect({ members, value, onChange, disabled }: {
  members: Assignee[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  const options: Option<string>[] = [{
    value: '', label: 'Sin asignar',
    icon: <UserRound aria-hidden="true" className="size-7 shrink-0 rounded-full bg-(--ink-hover) p-1.5 text-(--taupe)" />,
  }, ...members.map(member => ({
    value: member.id,
    label: member.name,
    description: member.email,
    icon: <UserAvatar name={member.name} profilePicture={member.profilePicture} className="size-7 text-[10px]" />,
  }))];
  return <CardFieldSelect label="Responsable" options={options} value={value} onChange={onChange} disabled={disabled} />;
}

const priorities: Option<CardPriority>[] = [
  { value: 'alta', label: 'Alta', icon: <ArrowUp aria-hidden="true" className="size-4 shrink-0 text-(--sand)" /> },
  { value: 'media', label: 'Media', icon: <Minus aria-hidden="true" className="size-4 shrink-0 text-(--taupe)" /> },
  { value: 'baja', label: 'Baja', icon: <ArrowDown aria-hidden="true" className="size-4 shrink-0 text-(--text-muted)" /> },
];

export function PrioritySelect({ value, onChange, disabled }: {
  value: CardPriority;
  onChange: (value: CardPriority) => void;
  disabled?: boolean;
}) {
  return <CardFieldSelect label="Prioridad" options={priorities} value={value} onChange={onChange} disabled={disabled} />;
}
