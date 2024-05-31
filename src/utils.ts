interface MapUpsertOptions<K, T> {
  insert?: (key: K, self: Map<K, T>) => T;
  update?: (old: T, key: K, self: Map<K, T>) => T;
}

export function mapUpsert<K, T, Options extends MapUpsertOptions<K, T>>(
  map: Map<K, T>,
  key: K,
  options: Options,
): Options["insert"] extends Function ? T : T | undefined {
  if (map.has(key)) {
    const oldValue = map.get(key);
    if (options.update) {
      const newValue = options.update(oldValue!, key, map);
      map.set(key, newValue);
      return newValue;
    }
    return oldValue!;
  } else {
    if (options.insert) {
      const newValue = options.insert(key, map);
      return newValue;
    }
    return undefined as any;
  }
}

export function table(table: any[]) {
  if (table.length === 0) {
    return ``;
  }
  const keys = Object.keys(table[0]);
  const columnLimit = keys.map((key) => key.length);
  const rows: string[][] = [[...keys]];

  for (const rawRow of table) {
    const row: string[] = [];
    rows.push(row);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const cell = String(rawRow[key]);
      row.push(cell);
      columnLimit[i] = Math.max(columnLimit[i], cell.length);
    }
  }

  let string = "";
  for (const row of rows) {
    string += "|";
    for (let i = 0; i < keys.length; i++) {
      const cell = row[i];
      string += " " + cell.padEnd(columnLimit[i]) + " |";
    }
    string += "\n";
  }
  return string;
}

export function range(max: number): Generator<number>;
export function range(min: number, max: number): Generator<number>;
export function range(
  min: number,
  max: number,
  step: number,
): Generator<number>;
export function* range(...args: number[]) {
  let min: number;
  let max: number;
  let step: number;

  if (args.length === 1) {
    min = 0;
    max = args[0];
    step = 1;
  } else if (args.length === 2) {
    min = args[0];
    max = args[1];
    step = 1;
  } else {
    min = args[0];
    max = args[1];
    step = args[2];
  }

  while (min < max) {
    yield min;
    min += step;
  }
}

class AssertionError extends Error {
  name = "AssertionError";
}

export function assert(value: boolean, message: string): asserts value {
  if (!value) {
    throw new AssertionError(message);
  }
}

