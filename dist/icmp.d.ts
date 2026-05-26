import type { IcmpProbeOptions, ProbeResult } from './types';
/** ICMP ping via the system `ping` binary. Requires Bun runtime. */
export declare const icmpProbe: (host: string, options?: IcmpProbeOptions) => Promise<ProbeResult>;
//# sourceMappingURL=icmp.d.ts.map