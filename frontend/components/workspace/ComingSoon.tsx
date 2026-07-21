export default function ComingSoon({ title }: { title: string }) {
  return (
    <div className="flex flex-1 items-center justify-center p-8">
      <div className="text-center">
        <h1 className="mb-2 text-xl font-semibold text-white">{title}</h1>
        <p className="text-sm text-slate-500">
          This section is on the roadmap and not built yet.
        </p>
      </div>
    </div>
  );
}
