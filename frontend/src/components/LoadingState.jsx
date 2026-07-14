export default function LoadingState({ label = 'Loading' }) {
  return (
    <div className="flex min-h-40 items-center justify-center rounded-md border border-slate-200 bg-white text-sm text-slate-500">
      {label}
    </div>
  );
}
