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
        "    lps = array(pattern.length, 0)",
        "    i = 1; len = 0",
        "    while i < pattern.length:",
        "        compare pattern[i] with pattern[len]",
        "        if equal: len++; lps[i] = len; i++",
        "        else if len > 0: len = lps[len - 1]",
        "        else: lps[i] = 0; i++",
        "    preprocessing complete",
        "    i = 0; j = 0",
        "    while i < text.length:",
        "        compare text[i] with pattern[j]",
        "        if equal: i++; j++",
        "        if j == pattern.length: record i - j",
        "        after match: j = lps[j - 1]",
        "        else if mismatch and j > 0:",
        "            j = lps[j - 1]",
        "        else: i++",
        "    return all match indexes",
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
