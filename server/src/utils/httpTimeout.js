export async function fetchWithTimeout(fetchFn, timeoutMs) {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetchFn(controller.signal);
  } finally {
    clearTimeout(t);
  }
}

