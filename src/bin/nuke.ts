import { NS } from "@ns";
import { scanServers } from "../nsUtils";

export async function main(ns: NS): Promise<void> {
  for (const server of scanServers(ns)) {
    try {
      ns.brutessh(server);
      ns.ftpcrack(server);
      ns.relaysmtp(server);
      ns.httpworm(server);
      ns.sqlinject(server);
    } catch {}
    try {
      ns.nuke(server);
      ns.tprint("Hacked", server);
    } catch {}
  }
}
