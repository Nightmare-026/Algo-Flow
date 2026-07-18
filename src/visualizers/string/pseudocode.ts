export function getStringPseudocode(slug: string): string[] {
  switch (slug) {
    case "string-forward-traversal":
      return [
        "function traverseForward(text):",
        "    for i from 0 to length(text) - 1:",
        "        visit text[i]",
      ];
    case "string-reverse-traversal":
      return [
        "function traverseReverse(text):",
        "    for i from length(text) - 1 down to 0:",
        "        visit text[i]",
      ];
    case "string-palindrome":
      return [
        "function isPalindrome(text):",
        "    left = 0, right = length(text) - 1",
        "    while left < right:",
        "        if text[left] != text[right]: return false",
        "        left++, right--",
        "    return true",
      ];
    case "string-naive-search":
      return [
        "function naiveSearch(text, pattern):",
        "    for i from 0 to text.length - pattern.length:",
        "        compare pattern with text window at i",
        "        if all characters match: return i",
        "    return -1",
      ];
    case "string-kmp-search":
      return [
        "function kmpSearch(text, pattern):",
        "    build LPS table for pattern",
        "    scan text with i and pattern with j",
        "    on match advance both pointers",
        "    on mismatch jump j using LPS",
        "    return match index or -1",
      ];
    case "string-rabin-karp":
      return [
        "function rabinKarp(text, pattern):",
        "    compute pattern hash and first window hash",
        "    slide window across text",
        "    if hashes match, verify characters",
        "    update rolling hash",
      ];
    case "reverse-string":
      return [
        "function reverseString(chars):",
        "    left = 0, right = length(chars) - 1",
        "    while left < right:",
        "        swap chars[left] and chars[right]",
        "        left++, right--",
      ];
    case "string-insert":
      return [
        "function insert(text, index, char):",
        "    return text.substring(0, index) + char + text.substring(index)",
      ];
    case "string-delete":
      return [
        "function delete(text, index):",
        "    return text.substring(0, index) + text.substring(index + 1)",
      ];
    case "string-replace":
      return [
        "function replace(text, index, char):",
        "    return text.substring(0, index) + char + text.substring(index + 1)",
      ];
    case "string-change-case":
      return [
        "function changeCase(text):",
        "    result = ''",
        "    for each char in text:",
        "        if isUpper(char): result += toLower(char)",
        "        else: result += toUpper(char)",
        "    return result",
      ];
    default:
      return [];
  }
}
