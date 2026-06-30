export function LoadingState() {
  return (
    <div className="grid gap-5 md:grid-cols-3" aria-label="Carregando">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="h-80 animate-pulse rounded-lg bg-white/70 shadow-sm" />
      ))}
    </div>
  );
}
