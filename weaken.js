// I am far too lazy to come up with an efficient algorithm to do this any
// algorithm I do try will have to avoid growing memory since that'll be the
// deciding factor of how fast this runs
// Maybe two scripts? one to find all hosts and pass it back to the parent with
// read/write, the other to actually weaken it then I can pass metadata along to
// the script with args, and avoid using "getServerSecurityLevel" and
// "getServerMinSecurityLevel"
const comps = [
  'foodnstuff',
  'sigma-cosmetics',
  'joesguns',
  'hong-fang-tea',
  'max-hardware',
  'zer0',
  'harakiri-sushi',
  'iron-gym',
  'phantasy',
  'nectar-net',
  'CSEC',
  'neo-net',
  'silver-helix',
]

async function weaken(ns, host) {
  while (ns.getServerSecurityLevel(host) !== ns.getServerMinSecurityLevel(host)) {
      await ns.weaken(host)
  }
}

export async function main(ns) {
  for (const comp of comps) {
      await weaken(ns, comp)
  }
}