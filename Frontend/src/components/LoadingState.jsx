export default function LoadingState() {
  return (
    <div className="space-y-4 fade-in">
      {[1, 2, 3].map((i) => (
        <div key={i} className="border border-zinc-800 bg-zinc-900 rounded-md p-4 h-[120px] flex flex-col justify-between">
          <div className="flex justify-between items-start gap-4">
            <div className="h-5 bg-zinc-800 rounded-sm w-1/3 animate-pulse"></div>
            <div className="h-3 bg-zinc-800 rounded-sm w-16 animate-pulse mt-1"></div>
          </div>
          <div className="space-y-2 mt-4">
            <div className="h-3 bg-zinc-800/50 rounded-sm w-full animate-pulse"></div>
            <div className="h-3 bg-zinc-800/50 rounded-sm w-5/6 animate-pulse"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
