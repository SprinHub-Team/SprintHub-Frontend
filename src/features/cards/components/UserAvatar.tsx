import { cn } from '@/lib/utils';

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
      className={cn(
        'flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-(--border-light) bg-(image:--gradient-main) font-bold text-(--brown)',
        className,
      )}
    >
      {profilePicture ? (
        <img src={profilePicture} alt="" loading="lazy" className="size-full object-cover" />
      ) : (
        initials
      )}
    </span>
  );
}
