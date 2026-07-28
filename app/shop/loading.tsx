export default function ShopLoading() {
  return (
    <div className="mx-auto max-w-6xl animate-pulse px-4 py-16 sm:px-6">
      <div className="h-96 rounded-4xl bg-neutral-100" />
      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="aspect-square rounded-2xl bg-neutral-100" />
        ))}
      </div>
    </div>
  );
}
