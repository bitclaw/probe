export const tcpProbe = async (host, port, options = {}) => {
    const { timeoutMs = 5_000 } = options;
    const start = Date.now();
    return new Promise(resolve => {
        let resolved = false;
        const settle = (result) => {
            if (resolved)
                return;
            resolved = true;
            resolve(result);
        };
        const timer = setTimeout(() => {
            settle({
                ok: false,
                probeType: 'tcp',
                responseMs: null,
                statusCode: null,
                error: 'Connection timed out'
            });
        }, timeoutMs);
        Bun.connect({
            hostname: host,
            port,
            socket: {
                open(s) {
                    clearTimeout(timer);
                    s.end();
                    settle({
                        ok: true,
                        probeType: 'tcp',
                        responseMs: Date.now() - start,
                        statusCode: null,
                        error: null
                    });
                },
                error(_s, err) {
                    clearTimeout(timer);
                    settle({
                        ok: false,
                        probeType: 'tcp',
                        responseMs: null,
                        statusCode: null,
                        error: err.message
                    });
                },
                connectError(_s, err) {
                    clearTimeout(timer);
                    settle({
                        ok: false,
                        probeType: 'tcp',
                        responseMs: null,
                        statusCode: null,
                        error: err.message
                    });
                },
                close() { },
                data() { }
            }
        });
    });
};
