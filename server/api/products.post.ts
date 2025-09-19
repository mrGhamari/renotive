export default defineEventHandler(async (event) => {
  const raw = await readBody<any>(event);
  const body =
    typeof raw === 'string' ? (raw ? JSON.parse(raw) : {}) : raw ?? {};

  const created = await $fetch('https://dummyjson.com/products/add', {
    method: 'POST',
    body,
  });

  setResponseStatus(event, 201);
  return created;
});
