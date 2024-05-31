import type { NS } from "@ns";

export async function main(ns: NS): Promise<void> {
  ns.scp("hack.js", "the-hub")
  ns.exec(
    "hack.js",
    "the-hub",
    {
      threads: 1,
    },
    "n00dles",
  );
}
