// defined as generic type T to handle promises that resolves any type of data
export async function to<T>(
  promise: Promise<T>
): Promise<[Error | null, T | undefined]> {
  try {
    const data = await promise;
    return [null, data];
  } catch (err) {
    return [err as Error, undefined];
  }
}

export default to;
