import { afterEach, describe, expect, it, mock, spyOn } from 'bun:test';
import { httpProbe } from './http';
import { icmpProbe } from './icmp';
import { tcpProbe } from './tcp';

// =============================================================================
// httpProbe tests
// =============================================================================

describe('httpProbe', () => {
  afterEach(() => {
    mock.restore();
  });

  it('returns ok: true for 200', async () => {
    spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(null, { status: 200 })
    );
    const result = await httpProbe('http://example.com');
    expect(result.ok).toBe(true);
    expect(result.probeType).toBe('http');
    expect(result.statusCode).toBe(200);
    expect(result.error).toBeNull();
    expect(result.responseMs).toBeGreaterThanOrEqual(0);
  });

  it('returns ok: false for 500', async () => {
    spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(null, { status: 500 })
    );
    const result = await httpProbe('http://example.com');
    expect(result.ok).toBe(false);
    expect(result.statusCode).toBe(500);
    expect(result.error).toBeNull();
  });

  it('returns ok: false when fetch throws', async () => {
    spyOn(globalThis, 'fetch').mockRejectedValue(
      new Error('Network unreachable')
    );
    const result = await httpProbe('http://example.com');
    expect(result.ok).toBe(false);
    expect(result.statusCode).toBeNull();
    expect(result.responseMs).toBeNull();
    expect(result.error).toBe('Network unreachable');
  });
});

// =============================================================================
// tcpProbe tests
// =============================================================================

describe('tcpProbe', () => {
  it('returns ok: false for a refused connection (port 1)', async () => {
    const result = await tcpProbe('127.0.0.1', 1, { timeoutMs: 3_000 });
    expect(result.ok).toBe(false);
    expect(result.probeType).toBe('tcp');
    expect(result.statusCode).toBeNull();
    expect(result.error).toBeTruthy();
  });
});

// =============================================================================
// icmpProbe tests
// =============================================================================

describe('icmpProbe', () => {
  afterEach(() => {
    mock.restore();
  });

  it('returns ok: true when ping exits 0', async () => {
    spyOn(Bun, 'spawn').mockReturnValue({
      exited: Promise.resolve(0),
      stderr: new ReadableStream({
        start(controller) {
          controller.close();
        }
      })
    } as ReturnType<typeof Bun.spawn>);

    const result = await icmpProbe('127.0.0.1');
    expect(result.ok).toBe(true);
    expect(result.probeType).toBe('icmp');
    expect(result.statusCode).toBeNull();
    expect(result.error).toBeNull();
    expect(result.responseMs).toBeGreaterThanOrEqual(0);
  });

  it('returns ok: false when ping exits 1', async () => {
    const encoder = new TextEncoder();
    spyOn(Bun, 'spawn').mockReturnValue({
      exited: Promise.resolve(1),
      stderr: new ReadableStream({
        start(controller) {
          controller.enqueue(encoder.encode('ping: unknown host'));
          controller.close();
        }
      })
    } as ReturnType<typeof Bun.spawn>);

    const result = await icmpProbe('192.0.2.1');
    expect(result.ok).toBe(false);
    expect(result.probeType).toBe('icmp');
    expect(result.statusCode).toBeNull();
    expect(result.responseMs).toBeNull();
    expect(result.error).toBeTruthy();
  });
});
