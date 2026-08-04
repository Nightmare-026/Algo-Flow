export function getHashTablePseudocode(slug: string): string[] {
  switch (slug) {
    case "hash-table-insert":
      return [
        "function insert(table, key, value):",
        "    index = hash(key) % table.size",
        "    for each entry in table[index]:",
        "        if entry.key == key:",
        "            entry.value = value",
        "            return",
        "    table[index].append({key, value})",
      ];
    case "hash-table-search":
      return [
        "function search(table, key):",
        "    index = hash(key) % table.size",
        "    for each entry in table[index]:",
        "        if entry.key == key:",
        "            return entry.value",
        "    return null",
      ];
    case "hash-table-delete":
      return [
        "function delete(table, key):",
        "    index = hash(key) % table.size",
        "    for i from 0 to table[index].length - 1:",
        "        if table[index][i].key == key:",
        "            remove table[index][i]",
        "            return true",
        "    return false",
      ];
    case "rehashing":
      return [
        "if loadFactor >= threshold: rehash",
        "newTable = createTable(newCapacity)",
        "for oldIndex from 0 to oldCapacity - 1:",
        "    if oldTable[oldIndex] is empty: continue",
        "    newIndex = hash(key) % newCapacity",
        "    while newTable[newIndex] is occupied: probe next",
        "    newTable[newIndex] = entry",
        "    advance oldIndex",
        "return newTable",
      ];
    default:
      return [];
  }
}
