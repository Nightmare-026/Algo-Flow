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
    default:
      return [];
  }
}
