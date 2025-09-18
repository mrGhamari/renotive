export const assert = (
  cond: any,
  statusCode = 400,
  statusMessage = 'Bad Request'
) => {
  if (!cond) throw createError({ statusCode, statusMessage });
};
export const json = <T>(event: H3Event, data: T, status = 200) => {
  setResponseStatus(event, status);
  return data;
};
