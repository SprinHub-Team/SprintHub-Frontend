export function FullScreenLoader({ message }: { message: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-screen flex-col items-center justify-center gap-4 bg-(--ink)"
    >
      <span
        aria-hidden="true"
        className="size-10 animate-spin rounded-full border-2 border-(--border-subtle) border-t-(--sand)"
      />
      <p className="text-sm text-(--text-muted)">{message}</p>
    </div>
  );
}
