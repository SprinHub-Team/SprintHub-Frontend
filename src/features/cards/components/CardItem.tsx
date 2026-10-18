import { ArrowDown, ArrowUp, Minus, UserRound } from 'lucide-react';
import { Badge } from '@/components/ui/Badge/Badge';
import { UserAvatar } from './UserAvatar';
import type { Card, CardPriority } from '../types/card.types';
import styles from './CardItem.module.css';

const PRIORITY_META: Record<CardPriority, { label: string; icon: typeof ArrowUp }> = {
  alta: { label: 'Alta', icon: ArrowUp },
  media: { label: 'Media', icon: Minus },
  baja: { label: 'Baja', icon: ArrowDown },
};

export interface CardItemProps {
  card: Card;
  onOpen: (cardId: string) => void;
}

export function CardItem({ card, onOpen }: CardItemProps) {
  const priority = PRIORITY_META[card.priority];
  const PriorityIcon = priority.icon;

  return (
    <button
      type="button"
      onClick={() => onOpen(card.id)}
      className={styles.card}
    >
      <div className={styles.header}>
        <span className={styles.title}>
          {card.title}
        </span>
        <Badge
          tone={card.priority === 'alta' ? 'outline' : card.priority === 'media' ? 'neutral' : 'muted'}
          icon={<PriorityIcon aria-hidden="true" className={styles.priorityIcon} />}
        >
          {priority.label}
        </Badge>
      </div>

      {card.description ? (
        <p className={styles.description}>
          {card.description}
        </p>
      ) : null}

      <div className={styles.footer}>
        {card.assignedTo ? (
          <span className={styles.assigned}>
            <UserAvatar
              profilePicture={card.assignedTo.profilePicture}
              name={card.assignedTo.name}
              className={styles.assignedAvatar}
            />
            <span className="sr-only">Asignada a {card.assignedTo.name}</span>
            <span aria-hidden="true" className={styles.assignedName}>
              {card.assignedTo.name}
            </span>
          </span>
        ) : (
          <span className={styles.unassigned}>
            <UserRound aria-hidden="true" className={styles.unassignedIcon} />
            <span className="sr-only">Sin responsable asignado</span>
          </span>
        )}
      </div>
    </button>
  );
}
