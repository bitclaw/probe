export type ProbeType = 'http' | 'tcp' | 'icmp';
export type ProbeResult = {
    ok: boolean;
    probeType: ProbeType;
    responseMs: number | null;
    statusCode: number | null;
    error: string | null;
};
export type HttpProbeOptions = {
    timeoutMs?: number;
    method?: 'GET' | 'HEAD';
    followRedirects?: boolean;
    okBelow?: number;
};
export type TcpProbeOptions = {
    timeoutMs?: number;
};
export type IcmpProbeOptions = {
    timeoutSec?: number;
    count?: number;
};
//# sourceMappingURL=types.d.ts.map