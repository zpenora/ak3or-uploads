export default function AppCardSkeleton() {
  return (
    <div className="glass rounded-2xl p-4 flex gap-3">
      <div className="h-14 w-14 rounded-2xl skeleton" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-3/4 skeleton rounded" />
        <div className="h-3 w-1/2 skeleton rounded" />
        <div className="h-3 w-full skeleton rounded mt-2" />
      </div>
    </div>
  );
}
