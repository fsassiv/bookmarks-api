export const apiHandleRequest = <T>(
  promise: Promise<T>,
): Promise<[undefined, T] | [Error]> =>
  promise
    .then((data) => [undefined, data] as [undefined, T])
    .catch((error) => [error]);
