export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'));
  if (!Number.isFinite(id))
    throw createError({ statusCode: 400, statusMessage: 'invalid id' });

  setHeader(
    event,
    'Cache-Control',
    'public, s-maxage=120, stale-while-revalidate=600'
  );
  return $fetch(`https://dummyjson.com/products/${id}`);
});
