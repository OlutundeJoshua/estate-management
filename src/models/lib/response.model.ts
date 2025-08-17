export function customSuccessResponseWithCode<Type = unknown>(
  message: string,
  payload: Type,
  code?: number,
) {
  return {
    status: 'Success',
    message,
    payload,
    code: code || 0,
  };
}

export function customErrorResponseWithCode<Type = null>(
  message: string,
  code?: number,
  payload?: any,
) {
  return {
    status: 'Failure',
    message,
    payload: payload || null,
    code: code || -1,
  };
}
