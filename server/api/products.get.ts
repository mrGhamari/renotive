export default defineEventHandler(async (event) => {
  // Cache برای SSR/CDN به سبک SWR
  setHeader(
    event,
    'Cache-Control',
    'public, s-maxage=60, stale-while-revalidate=300'
  );

  const q = getQuery(event);
  const search = String(q.q ?? '').toLowerCase();
  const dir = (q.dir === 'desc' ? 'desc' : 'asc') as 'asc' | 'desc';
  const page = Math.max(1, Number(q.page ?? 1));
  const pageSize = Math.min(50, Math.max(1, Number(q.pageSize ?? 12)));

  const src = await $fetch<{ products: any[] }>(
    'https://dummyjson.com/products?limit=100'
  );
  let items = src.products;

  if (search) {
    items = items.filter(
      (p) =>
        p.title.toLowerCase().includes(search) ||
        p.brand?.toLowerCase().includes(search) ||
        p.category?.toLowerCase().includes(search) ||
        (p.tags || []).some((t: string) => t.toLowerCase().includes(search))
    );
  }

  items = items.sort((a, b) => (a.price - b.price) * (dir === 'asc' ? 1 : -1));

  const total = items.length;
  const start = (page - 1) * pageSize;
  items = items.slice(start, start + pageSize);

  return { items, page, pageSize, total };
});
