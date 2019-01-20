// in my playthrough - I named all of my servers with "home" and the number
function isMine(host) {
    return host.startsWith('home')
}

function sendAndExec(ns, host, script) {
    ns.scp(script, ns.getHostname(), host)
    return ns.exec(script, host, 1, ns.getHostname())
}

export async function main(ns) {
    const servers = ns.scan();
    const [parent] = ns.args;
    
    for (const server of servers) {
        // won't try to infect parent
        if (isMine(server) || parent === server) {
            continue;
        }
        
        ns.killall(server);
    }
    
    ns.print('Sleeping for a second before sending botnet')
    await ns.sleep(20000)
    
    for (const server of servers) {
        // won't try to infect parent
        if (isMine(server) || parent === server) {
            continue;
        }
        
        if (ns.hasRootAccess(server)) {
            await sendAndExec(ns, server, 'killall.ns')
        }
    }
}
