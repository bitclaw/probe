import type { IcmpProbeOptions, ProbeResult } from './types';

/** ICMP ping via the system `ping` binary. Requires Bun runtime. */
export const icmpProbe = async (
  host: string,
  options: IcmpProbeOptions = {}
): Promise<ProbeResult> => {
  const { timeoutSec = 3, count = 1 } = options;
  const start = Date.now();
  try {
    const proc = Bun.spawn(
      ['ping', '-c', String(count), '-W', String(timeoutSec), host],
      { stdout: 'pipe', stderr: 'pipe' }
    );
    const exitCode = await proc.exited;
    const responseMs = Date.now() - start;
    if (exitCode === 0) {
      return {
        ok: true,
        probeType: 'icmp',
        responseMs,
        statusCode: null,
        error: null
      };
    }
    const stderr = await new Response(proc.stderr).text();
    return {
      ok: false,
      probeType: 'icmp',
      responseMs: null,
      statusCode: null,
      error: stderr.trim() || `ping exited ${exitCode}`
    };
  } catch (err: unknown) {
    return {
      ok: false,
      probeType: 'icmp',
      responseMs: null,
      statusCode: null,
      error: err instanceof Error ? err.message : String(err)
    };
  }
};
