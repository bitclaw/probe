export type ProbeType = 'http' | 'tcp' | 'icmp';

export type ProbeResult = {
  ok: boolean;
  probeType: ProbeType;
  responseMs: number | null;
  statusCode: number | null; // HTTP: response code; TCP/ICMP: null
  error: string | null;
};

export type HttpProbeOptions = {
  timeoutMs?: number; // default: 10_000
  method?: 'GET' | 'HEAD'; // default: 'HEAD'
  followRedirects?: boolean; // default: true
  okBelow?: number; // default: 400 (any status < okBelow = ok)
};

export type TcpProbeOptions = {
  timeoutMs?: number; // default: 5_000
};

export type IcmpProbeOptions = {
  timeoutSec?: number; // default: 3 (passed to ping -W)
  count?: number; // default: 1 (passed to ping -c)
};
