export function LoadingState() {
  return (
    <div className="animate-pulse">
      <div className="mx-auto max-w-3xl text-center">
        <div className="mx-auto h-3 w-28 rounded-full bg-surface" />
        <div className="mx-auto mt-7 h-16 w-full max-w-2xl rounded-2xl bg-surface" />
        <div className="mx-auto mt-4 h-5 w-2/3 rounded-full bg-surface" />
      </div>
      <div className="mt-14 aspect-[16/9] min-h-[360px] rounded-[28px] bg-surface" />
      <div className="mt-12 grid gap-10 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index}>
            <div className="aspect-[4/5] rounded-[28px] bg-surface" />
            <div className="mt-5 h-3 w-24 rounded-full bg-surface" />
            <div className="mt-4 h-8 w-4/5 rounded-xl bg-surface" />
            <div className="mt-3 h-4 w-full rounded-full bg-surface" />
            <div className="mt-2 h-4 w-2/3 rounded-full bg-surface" />
          </div>
        ))}
      </div>
    </div>
  );
}
