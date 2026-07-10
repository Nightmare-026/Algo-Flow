export function getHashSetPseudocode(slug: string): string[] {
  switch (slug) {
    case "hash-set-insert":
      return [
        "function insert(set, value):",
        "    index = hash(value) % set.size",
        "    for each entry in set[index]:",
        "        if entry == value: return false // Already exists",
        "    set[index].append(value)",
        "    return true"
      ];
    case "hash-set-search":
      return [
        "function search(set, value):",
        "    index = hash(value) % set.size",
        "    for each entry in set[index]:",
        "        if entry == value: return true",
        "    return false"
      ];
    case "hash-set-delete":
      return [
        "function delete(set, value):",
        "    index = hash(value) % set.size",
        "    for i from 0 to set[index].length - 1:",
        "        if set[index][i] == value:",
        "            remove set[index][i]",
        "            return true",
        "    return false"
      ];
    default:
      return [];
  }
}
