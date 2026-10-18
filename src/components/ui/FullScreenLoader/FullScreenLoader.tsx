export function FullScreenLoader({ message }: { message: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="fullscreen-loader"
    >
      <span aria-hidden="true" className="fullscreen-loader-spinner" />
      <p className="fullscreen-loader-message">{message}</p>
    </div>
  );
}
