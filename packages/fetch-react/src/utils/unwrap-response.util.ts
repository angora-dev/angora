export async function unwrapResponse<TBody = unknown>(response: Response): Promise<TBody> {
  const contentType = response.headers.get('content-type');

  if (contentType && contentType.indexOf('application/json') !== -1) {
    return await response.json();
  }

  return (await response.text()) as unknown as Promise<TBody>;
}
