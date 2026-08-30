export type PerformanceSample = { label: string; durationMs: number };

export async function measureAsync<T>(label: string, task: () => Promise<T>): Promise<{ value: T; sample: PerformanceSample }> {
  const started = performance.now();
  const value = await task();
  return { value, sample: { label, durationMs: Math.round((performance.now() - started) * 10) / 10 } };
}
