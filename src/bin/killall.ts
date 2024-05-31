import { NS } from "@ns";
import { scanServers } from "src/nsUtils";

export async function main(ns: NS): Promise<void> {
  for (const server of scanServers(ns)) {
    ns.killall(server)
  }
}


