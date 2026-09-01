export type TelemetryLevel = 'debug' | 'info' | 'warn' | 'error';

export interface TelemetryEvent {
  name: string;
  level?: TelemetryLevel;
  organizationId?: string;
  projectId?: string;
  durationMs?: number;
  attributes?: Record<string, string | number | boolean | null>;
}

const SENSITIVE_KEY = /(email|phone|name|token|authorization|cookie|image|payload)/i;

export function sanitizeAttributes(input: TelemetryEvent['attributes'] = {}): NonNullable<TelemetryEvent['attributes']> {
  const out: NonNullable<TelemetryEvent['attributes']> = {};
  for (const [key, value] of Object.entries(input)) {
    if (!SENSITIVE_KEY.test(key)) out[key] = value;
  }
  return out;
}

export function emitTelemetry(event: TelemetryEvent): void {
  const safe = {
    name: event.name,
    level: event.level ?? 'info',
    organizationId: event.organizationId,
    projectId: event.projectId,
    durationMs: event.durationMs,
    attributes: sanitizeAttributes(event.attributes),
    ts: new Date().toISOString(),
  };

  window.dispatchEvent(new CustomEvent('kamu:telemetry', { detail: safe }));
  if (import.meta.env.DEV) console.debug('[KamuTelemetry]', safe);
}

export async function traceAsync<T>(name: string, operation: () => Promise<T>, base: Omit<TelemetryEvent, 'name' | 'durationMs'> = {}): Promise<T> {
  const started = performance.now();
  try {
    const result = await operation();
    emitTelemetry({ ...base, name, durationMs: performance.now() - started });
    return result;
  } catch (error) {
    emitTelemetry({ ...base, name, level: 'error', durationMs: performance.now() - started, attributes: { errorType: error instanceof Error ? error.name : 'unknown' } });
    throw error;
  }
}
