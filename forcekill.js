// this is useful if you screw up and forget to add a check for propagating UP
// a tree.

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
];

export async function main(ns) {
    for (let i = 0; i < 30; i++) {
        for (const comp of comps) {
            ns.killall(comp)
        }
        
        ns.sleep(50)
    }
}
