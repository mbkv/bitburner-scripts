// auto hack and run a script against all root-ed servers

const portOpeners = ['brutessh', 'ftpcrack', 'relaysmtp', 'httpworm', 'sqlinject'];

function attemptHack(ns, host) {
    if (ns.hasRootAccess(host)) {
        ns.print(`Won't infect ${host} because we already have root access`);
        return false;
    }
    
    if (ns.getHackingLevel() < ns.getServerRequiredHackingLevel(host)) {
        ns.print(`Won't infect ${host} because hacking level too low`);
        return false;
    }
    
    if (ns.getServerNumPortsRequired(host) > portOpeners.length) {
        ns.print(`Won't infect ${host} because not enough ports openers`);
        return false;
    }
    ns.print(`Infecting ${host}`);
    
    for (const opener of portOpeners) {
        ns[opener](host);
    }
    
    ns.nuke(host)
}

function syncFiles(ns, slave, scripts) {
    const hostname = ns.getHostname()
    
    for (const script of scripts) {
        ns.scp(script, hostname, slave)
    }
}

function runBotnet(ns, host, ...args) {
    return ns.exec('hackall.ns', host, 1, ...args)
}

function runScript(ns, script, ...args) {
    const [serverRam] = ns.getServerRam(ns.getHostname())
    const scriptRam = ns.getScriptRam(script)
    ns.spawn(script, Math.floor(serverRam / scriptRam), ...args)
}

function isMine(host) {
    return host.startsWith('home');
}

export async function main(ns) {
    const servers = ns.scan();
    const [script = 'hack.ns', parent] = ns.args;
    const host = ns.getHostname()
    
    for (const server of servers) {
        // won't try to infect parent
        if (isMine(host) || parent === server) {
            continue
        }
        
        ns.scriptKill(script, host)
        await ns.sleep(2000)
        
        attemptHack(ns, server);
        
        if (ns.hasRootAccess(server)) {
            syncFiles(ns, server, [
                script,
                'hackall.ns',
            ]);
            await runBotnet(ns, server, script, host)
        }
    }
    
    if (ns.args.length > 1) {
        runScript(ns, script, host)
    }
}