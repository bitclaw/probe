# @bitclaw/probe

HTTP, TCP, and ICMP probes for uptime monitoring. Built on Bun's native APIs.

## Features

- **HTTP probes** HEAD/GET with configurable timeout, redirect following, and ok threshold
- **TCP probes** Raw socket connection check via `Bun.connect`
- **ICMP probes** System `ping` binary wrapper with timeout and retry count
- **Typed** All probes return a consistent `ProbeResult` discriminated type

## Installation

```bash
bun add @bitclaw/probe
```

## Quick Start

```typescript
import { httpProbe, tcpProbe, icmpProbe } from '@bitclaw/probe'

const http = await httpProbe('https://example.com/health')
console.log(http) // { ok: true, probeType: 'http', responseMs: 42, statusCode: 200, error: null }

const tcp = await tcpProbe('example.com', 443)
console.log(tcp) // { ok: true, probeType: 'tcp', responseMs: 12, statusCode: null, error: null }

const icmp = await icmpProbe('8.8.8.8')
console.log(icmp) // { ok: true, probeType: 'icmp', responseMs: 5, statusCode: null, error: null }
```

## API

```typescript
httpProbe(url, options?)           // → Promise<ProbeResult>
tcpProbe(host, port, options?)     // → Promise<ProbeResult>
icmpProbe(host, options?)          // → Promise<ProbeResult>
```

### Options

| Probe   | Option           | Default  |
|---------|------------------|----------|
| http    | `timeoutMs`      | 10_000   |
| http    | `method`         | `'HEAD'` |
| http    | `followRedirects`| `true`   |
| http    | `okBelow`        | 400      |
| tcp     | `timeoutMs`      | 5_000    |
| icmp    | `timeoutSec`     | 3        |
| icmp    | `count`          | 1        |

## Testing

```bash
bun test
```

5 tests across 1 file.
