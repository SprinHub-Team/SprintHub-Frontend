import { cn } from '@/lib/utils';
import styles from './UserAvatar.module.css';

export interface UserAvatarProps {
  profilePicture?: string;
  name: string;
  className?: string;
}

export function UserAvatar({ profilePicture, name, className }: UserAvatarProps) {
  const initials = name
    .split(/\s+/)
    .filter((part) => part.length > 0)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');

  return (
    <span
      aria-hidden="true"
      title={name}
      className={cn(styles.avatar, className)}
    >
      {profilePicture ? (
        <img src={profilePicture} alt="" loading="lazy" className={styles.avatarImage} />
      ) : (
        initials
      )}
    </span>
  );
}
