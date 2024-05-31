import type { NS, ScriptArg } from "@ns";

export function* scanServers(ns: NS) {
  const processed = new Set<string>(["home"]);
  yield "home";
  const queue = new Set(ns.scan());

  while (queue.size) {
    const current: string = queue.values().next().value;
    queue.delete(current);
    processed.add(current);
    yield current;

    const scanned = ns.scan(current);
    for (const element of scanned) {
      if (!processed.has(element)) {
        queue.add(element);
      }
    }
  }
}

export function schedule(
  ns: NS,
  script: string,
  args: ScriptArg[],
  _threadsToAllocate: number,
) {
  let threadsToAllocate = _threadsToAllocate;
  const scriptRam = ns.getScriptRam(script);

  for (const server of scanServers(ns)) {
    if (threadsToAllocate <= 0) {
      break;
    }
    if (server === "home") {
      continue;
    }
    if (!ns.hasRootAccess(server)) {
      continue;
    }

    ns.scp(script, server);
    const currentRam = ns.getServerMaxRam(server) - ns.getServerUsedRam(server);
    const canAllocate = Math.floor(currentRam / scriptRam);
    if (canAllocate === 0) {
      continue;
    }
    const threads = Math.min(threadsToAllocate, canAllocate);
    ns.exec(script, server, { threads }, ...args);

    threadsToAllocate -= threads;
  }
}
