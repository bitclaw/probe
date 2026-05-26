import type { HttpProbeOptions, ProbeResult } from './types';

export const httpProbe = async (
  url: string,
  options: HttpProbeOptions = {}
): Promise<ProbeResult> => {
  const {
    timeoutMs = 10_000,
    method = 'HEAD',
    followRedirects = true,
    okBelow = 400
  } = options;
  const start = Date.now();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      method,
      signal: controller.signal,
      redirect: followRedirects ? 'follow' : 'manual'
    });
    clearTimeout(timer);
    return {
      ok: response.status < okBelow,
      probeType: 'http',
      responseMs: Date.now() - start,
      statusCode: response.status,
      error: null
    };
  } catch (err: unknown) {
    clearTimeout(timer);
    return {
      ok: false,
      probeType: 'http',
      responseMs: null,
      statusCode: null,
      error: err instanceof Error ? err.message : String(err)
    };
  }
};
