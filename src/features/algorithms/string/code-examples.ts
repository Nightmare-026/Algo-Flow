import { CodeExample } from "@/types";

export function getStringCodeExamples(slug: string, algorithmId: string): CodeExample[] {
  switch (slug) {
    case "string-forward-traversal":
      return [
        { id: `${algorithmId}-js`, algorithmId, language: "javascript", isPrimary: true, code: `function traverse(text) {\n  for (let i = 0; i < text.length; i++) {\n    console.log(text[i]);\n  }\n}`, explanation: "Iterates through each character from start to finish." },
        { id: `${algorithmId}-py`, algorithmId, language: "python", isPrimary: false, code: `def traverse(text):\n    for char in text:\n        print(char)`, explanation: "Iterates through each character from start to finish." },
        { id: `${algorithmId}-cpp`, algorithmId, language: "cpp", isPrimary: false, code: `void traverse(string text) {\n    for (int i = 0; i < text.length(); i++) {\n        cout << text[i] << endl;\n    }\n}`, explanation: "Iterates through each character from start to finish." },
        { id: `${algorithmId}-java`, algorithmId, language: "java", isPrimary: false, code: `void traverse(String text) {\n    for (int i = 0; i < text.length(); i++) {\n        System.out.println(text.charAt(i));\n    }\n}`, explanation: "Iterates through each character from start to finish." },
      ];
    case "string-reverse-traversal":
      return [
        { id: `${algorithmId}-js`, algorithmId, language: "javascript", isPrimary: true, code: `function traverseReverse(text) {\n  for (let i = text.length - 1; i >= 0; i--) {\n    console.log(text[i]);\n  }\n}`, explanation: "Iterates through each character from the end to the beginning." },
        { id: `${algorithmId}-py`, algorithmId, language: "python", isPrimary: false, code: `def traverse_reverse(text):\n    for i in range(len(text) - 1, -1, -1):\n        print(text[i])`, explanation: "Iterates through each character from the end to the beginning." },
        { id: `${algorithmId}-cpp`, algorithmId, language: "cpp", isPrimary: false, code: `void traverseReverse(string text) {\n    for (int i = text.length() - 1; i >= 0; i--) {\n        cout << text[i] << endl;\n    }\n}`, explanation: "Iterates through each character from the end to the beginning." },
        { id: `${algorithmId}-java`, algorithmId, language: "java", isPrimary: false, code: `void traverseReverse(String text) {\n    for (int i = text.length() - 1; i >= 0; i--) {\n        System.out.println(text.charAt(i));\n    }\n}`, explanation: "Iterates through each character from the end to the beginning." },
      ];
    case "string-naive-search":
      return [
        {
          id: `${algorithmId}-js`, algorithmId, language: "javascript", isPrimary: true,
          code: `function naiveSearch(text, pattern) {\n  const n = text.length;\n  const m = pattern.length;\n  for (let i = 0; i <= n - m; i++) {\n    let j;\n    for (j = 0; j < m; j++) {\n      if (text[i + j] !== pattern[j]) break;\n    }\n    if (j === m) return i; // Pattern found\n  }\n  return -1; // Not found\n}`,
          explanation: "Slides the pattern over the text one character at a time and checks for a match."
        },
        {
          id: `${algorithmId}-py`, algorithmId, language: "python", isPrimary: false,
          code: `def naive_search(text, pattern):\n    n = len(text)\n    m = len(pattern)\n    for i in range(n - m + 1):\n        if text[i:i+m] == pattern:\n            return i\n    return -1`,
          explanation: "Slides the pattern over the text one character at a time and checks for a match."
        },
        {
          id: `${algorithmId}-cpp`, algorithmId, language: "cpp", isPrimary: false,
          code: `int naiveSearch(string text, string pattern) {\n    int n = text.length(), m = pattern.length();\n    for (int i = 0; i <= n - m; i++) {\n        int j;\n        for (j = 0; j < m; j++) {\n            if (text[i + j] != pattern[j]) break;\n        }\n        if (j == m) return i;\n    }\n    return -1;\n}`,
          explanation: "Slides the pattern over the text one character at a time and checks for a match."
        },
        {
          id: `${algorithmId}-java`, algorithmId, language: "java", isPrimary: false,
          code: `int naiveSearch(String text, String pattern) {\n    int n = text.length(), m = pattern.length();\n    for (int i = 0; i <= n - m; i++) {\n        int j;\n        for (j = 0; j < m; j++) {\n            if (text.charAt(i + j) != pattern.charAt(j)) break;\n        }\n        if (j == m) return i;\n    }\n    return -1;\n}`,
          explanation: "Slides the pattern over the text one character at a time and checks for a match."
        },
      ];
    case "string-kmp-search":
      return [
        {
          id: `${algorithmId}-js`, algorithmId, language: "javascript", isPrimary: true,
          code: `function computeLPS(pattern) {\n  const m = pattern.length;\n  const lps = new Array(m).fill(0);\n  let len = 0, i = 1;\n  while (i < m) {\n    if (pattern[i] === pattern[len]) {\n      len++; lps[i] = len; i++;\n    } else {\n      if (len !== 0) len = lps[len - 1];\n      else { lps[i] = 0; i++; }\n    }\n  }\n  return lps;\n}\n\nfunction kmpSearch(text, pattern) {\n  const n = text.length, m = pattern.length;\n  const lps = computeLPS(pattern);\n  let i = 0, j = 0;\n  while (i < n) {\n    if (pattern[j] === text[i]) { i++; j++; }\n    if (j === m) return i - j;\n    else if (i < n && pattern[j] !== text[i]) {\n      if (j !== 0) j = lps[j - 1];\n      else i++;\n    }\n  }\n  return -1;\n}`,
          explanation: "Uses an LPS (Longest Prefix Suffix) array to skip redundant comparisons."
        },
        {
          id: `${algorithmId}-py`, algorithmId, language: "python", isPrimary: false,
          code: `def compute_lps(pattern):\n    m = len(pattern)\n    lps = [0] * m\n    length = 0\n    i = 1\n    while i < m:\n        if pattern[i] == pattern[length]:\n            length += 1\n            lps[i] = length\n            i += 1\n        else:\n            if length != 0: length = lps[length - 1]\n            else:\n                lps[i] = 0\n                i += 1\n    return lps\n\ndef kmp_search(text, pattern):\n    n = len(text)\n    m = len(pattern)\n    lps = compute_lps(pattern)\n    i = 0\n    j = 0\n    while i < n:\n        if pattern[j] == text[i]:\n            i += 1\n            j += 1\n        if j == m: return i - j\n        elif i < n and pattern[j] != text[i]:\n            if j != 0: j = lps[j - 1]\n            else: i += 1\n    return -1`,
          explanation: "Uses an LPS (Longest Prefix Suffix) array to skip redundant comparisons."
        },
        {
          id: `${algorithmId}-cpp`, algorithmId, language: "cpp", isPrimary: false,
          code: `vector<int> computeLPS(string pattern) {\n    int m = pattern.length();\n    vector<int> lps(m, 0);\n    int len = 0, i = 1;\n    while (i < m) {\n        if (pattern[i] == pattern[len]) {\n            len++; lps[i] = len; i++;\n        } else {\n            if (len != 0) len = lps[len - 1];\n            else { lps[i] = 0; i++; }\n        }\n    }\n    return lps;\n}\n\nint kmpSearch(string text, string pattern) {\n    int n = text.length(), m = pattern.length();\n    vector<int> lps = computeLPS(pattern);\n    int i = 0, j = 0;\n    while (i < n) {\n        if (pattern[j] == text[i]) { i++; j++; }\n        if (j == m) return i - j;\n        else if (i < n && pattern[j] != text[i]) {\n            if (j != 0) j = lps[j - 1];\n            else i++;\n        }\n    }\n    return -1;\n}`,
          explanation: "Uses an LPS (Longest Prefix Suffix) array to skip redundant comparisons."
        },
        {
          id: `${algorithmId}-java`, algorithmId, language: "java", isPrimary: false,
          code: `int[] computeLPS(String pattern) {\n    int m = pattern.length();\n    int[] lps = new int[m];\n    int len = 0, i = 1;\n    while (i < m) {\n        if (pattern.charAt(i) == pattern.charAt(len)) {\n            len++; lps[i] = len; i++;\n        } else {\n            if (len != 0) len = lps[len - 1];\n            else { lps[i] = 0; i++; }\n        }\n    }\n    return lps;\n}\n\nint kmpSearch(String text, String pattern) {\n    int n = text.length(), m = pattern.length();\n    int[] lps = computeLPS(pattern);\n    int i = 0, j = 0;\n    while (i < n) {\n        if (pattern.charAt(j) == text.charAt(i)) { i++; j++; }\n        if (j == m) return i - j;\n        else if (i < n && pattern.charAt(j) != text.charAt(i)) {\n            if (j != 0) j = lps[j - 1];\n            else i++;\n        }\n    }\n    return -1;\n}`,
          explanation: "Uses an LPS (Longest Prefix Suffix) array to skip redundant comparisons."
        },
      ];
    case "string-rabin-karp":
      return [
        {
          id: `${algorithmId}-js`, algorithmId, language: "javascript", isPrimary: true,
          code: `function rabinKarp(text, pattern, d = 256, q = 101) {\n  const n = text.length, m = pattern.length;\n  let p = 0, t = 0, h = 1;\n  for (let i = 0; i < m - 1; i++) h = (h * d) % q;\n  for (let i = 0; i < m; i++) {\n    p = (d * p + pattern.charCodeAt(i)) % q;\n    t = (d * t + text.charCodeAt(i)) % q;\n  }\n  for (let i = 0; i <= n - m; i++) {\n    if (p === t) {\n      let j;\n      for (j = 0; j < m; j++) {\n        if (text[i + j] !== pattern[j]) break;\n      }\n      if (j === m) return i;\n    }\n    if (i < n - m) {\n      t = (d * (t - text.charCodeAt(i) * h) + text.charCodeAt(i + m)) % q;\n      if (t < 0) t = t + q;\n    }\n  }\n  return -1;\n}`,
          explanation: "Uses a rolling hash function to quickly find potential match windows."
        },
        {
          id: `${algorithmId}-py`, algorithmId, language: "python", isPrimary: false,
          code: `def rabin_karp(text, pattern, d=256, q=101):\n    n, m = len(text), len(pattern)\n    p, t, h = 0, 0, 1\n    for i in range(m - 1):\n        h = (h * d) % q\n    for i in range(m):\n        p = (d * p + ord(pattern[i])) % q\n        t = (d * t + ord(text[i])) % q\n    for i in range(n - m + 1):\n        if p == t:\n            if text[i:i+m] == pattern:\n                return i\n        if i < n - m:\n            t = (d * (t - ord(text[i]) * h) + ord(text[i + m])) % q\n            if t < 0: t = t + q\n    return -1`,
          explanation: "Uses a rolling hash function to quickly find potential match windows."
        },
        {
          id: `${algorithmId}-cpp`, algorithmId, language: "cpp", isPrimary: false,
          code: `int rabinKarp(string text, string pattern) {\n    int d = 256, q = 101;\n    int n = text.length(), m = pattern.length();\n    int p = 0, t = 0, h = 1;\n    for (int i = 0; i < m - 1; i++) h = (h * d) % q;\n    for (int i = 0; i < m; i++) {\n        p = (d * p + pattern[i]) % q;\n        t = (d * t + text[i]) % q;\n    }\n    for (int i = 0; i <= n - m; i++) {\n        if (p == t) {\n            int j;\n            for (j = 0; j < m; j++) {\n                if (text[i + j] != pattern[j]) break;\n            }\n            if (j == m) return i;\n        }\n        if (i < n - m) {\n            t = (d * (t - text[i] * h) + text[i + m]) % q;\n            if (t < 0) t = t + q;\n        }\n    }\n    return -1;\n}`,
          explanation: "Uses a rolling hash function to quickly find potential match windows."
        },
        {
          id: `${algorithmId}-java`, algorithmId, language: "java", isPrimary: false,
          code: `int rabinKarp(String text, String pattern) {\n    int d = 256, q = 101;\n    int n = text.length(), m = pattern.length();\n    int p = 0, t = 0, h = 1;\n    for (int i = 0; i < m - 1; i++) h = (h * d) % q;\n    for (int i = 0; i < m; i++) {\n        p = (d * p + pattern.charAt(i)) % q;\n        t = (d * t + text.charAt(i)) % q;\n    }\n    for (int i = 0; i <= n - m; i++) {\n        if (p == t) {\n            int j;\n            for (j = 0; j < m; j++) {\n                if (text.charAt(i + j) != pattern.charAt(j)) break;\n            }\n            if (j == m) return i;\n        }\n        if (i < n - m) {\n            t = (d * (t - text.charAt(i) * h) + text.charAt(i + m)) % q;\n            if (t < 0) t = t + q;\n        }\n    }\n    return -1;\n}`,
          explanation: "Uses a rolling hash function to quickly find potential match windows."
        },
      ];
    case "reverse-string":
      return [
        {
          id: `${algorithmId}-js`, algorithmId, language: "javascript", isPrimary: true,
          code: `function reverseString(text) {\n  let chars = text.split('');\n  let left = 0, right = chars.length - 1;\n  while (left < right) {\n    [chars[left], chars[right]] = [chars[right], chars[left]];\n    left++; right--;\n  }\n  return chars.join('');\n}`,
          explanation: "Converts string to an array, uses two pointers to swap elements from outside in."
        },
        {
          id: `${algorithmId}-py`, algorithmId, language: "python", isPrimary: false,
          code: `def reverse_string(text):\n    chars = list(text)\n    left, right = 0, len(chars) - 1\n    while left < right:\n        chars[left], chars[right] = chars[right], chars[left]\n        left += 1\n        right -= 1\n    return ''.join(chars)`,
          explanation: "Converts string to a list, uses two pointers to swap elements from outside in."
        },
        {
          id: `${algorithmId}-cpp`, algorithmId, language: "cpp", isPrimary: false,
          code: `string reverseString(string text) {\n    int left = 0, right = text.length() - 1;\n    while (left < right) {\n        swap(text[left], text[right]);\n        left++; right--;\n    }\n    return text;\n}`,
          explanation: "Uses two pointers to swap elements from outside in."
        },
        {
          id: `${algorithmId}-java`, algorithmId, language: "java", isPrimary: false,
          code: `String reverseString(String text) {\n    char[] chars = text.toCharArray();\n    int left = 0, right = chars.length - 1;\n    while (left < right) {\n        char temp = chars[left];\n        chars[left] = chars[right];\n        chars[right] = temp;\n        left++; right--;\n    }\n    return new String(chars);\n}`,
          explanation: "Converts string to a char array, uses two pointers to swap elements from outside in."
        },
      ];
    case "string-palindrome":
      return [
        {
          id: `${algorithmId}-js`, algorithmId, language: "javascript", isPrimary: true,
          code: `function isPalindrome(text) {\n  let left = 0, right = text.length - 1;\n  while (left < right) {\n    if (text[left] !== text[right]) return false;\n    left++; right--;\n  }\n  return true;\n}`,
          explanation: "Uses two pointers starting from the ends and moving inwards to check for symmetry."
        },
        {
          id: `${algorithmId}-py`, algorithmId, language: "python", isPrimary: false,
          code: `def is_palindrome(text):\n    left, right = 0, len(text) - 1\n    while left < right:\n        if text[left] != text[right]:\n            return False\n        left += 1\n        right -= 1\n    return True`,
          explanation: "Uses two pointers starting from the ends and moving inwards to check for symmetry."
        },
        {
          id: `${algorithmId}-cpp`, algorithmId, language: "cpp", isPrimary: false,
          code: `bool isPalindrome(string text) {\n    int left = 0, right = text.length() - 1;\n    while (left < right) {\n        if (text[left] != text[right]) return false;\n        left++; right--;\n    }\n    return true;\n}`,
          explanation: "Uses two pointers starting from the ends and moving inwards to check for symmetry."
        },
        {
          id: `${algorithmId}-java`, algorithmId, language: "java", isPrimary: false,
          code: `boolean isPalindrome(String text) {\n    int left = 0, right = text.length() - 1;\n    while (left < right) {\n        if (text.charAt(left) != text.charAt(right)) return false;\n        left++; right--;\n    }\n    return true;\n}`,
          explanation: "Uses two pointers starting from the ends and moving inwards to check for symmetry."
        },
      ];
    case "string-insert":
      return [
        { id: `${algorithmId}-js`, algorithmId, language: "javascript", isPrimary: true, code: `function insert(text, index, char) {\n  return text.slice(0, index) + char + text.slice(index);\n}`, explanation: "Splits the string and inserts the character at the specified index." },
        { id: `${algorithmId}-py`, algorithmId, language: "python", isPrimary: false, code: `def insert(text, index, char):\n    return text[:index] + char + text[index:]`, explanation: "Splits the string and inserts the character at the specified index." },
        { id: `${algorithmId}-cpp`, algorithmId, language: "cpp", isPrimary: false, code: `string insert(string text, int index, char c) {\n    text.insert(index, 1, c);\n    return text;\n}`, explanation: "Uses the string insert method." },
        { id: `${algorithmId}-java`, algorithmId, language: "java", isPrimary: false, code: `String insert(String text, int index, char c) {\n    return new StringBuilder(text).insert(index, c).toString();\n}`, explanation: "Uses StringBuilder to insert the character." },
      ];
    case "string-delete":
      return [
        { id: `${algorithmId}-js`, algorithmId, language: "javascript", isPrimary: true, code: `function remove(text, index) {\n  return text.slice(0, index) + text.slice(index + 1);\n}`, explanation: "Removes the character at the specified index." },
        { id: `${algorithmId}-py`, algorithmId, language: "python", isPrimary: false, code: `def remove(text, index):\n    return text[:index] + text[index+1:]`, explanation: "Removes the character at the specified index." },
        { id: `${algorithmId}-cpp`, algorithmId, language: "cpp", isPrimary: false, code: `string remove(string text, int index) {\n    text.erase(index, 1);\n    return text;\n}`, explanation: "Uses the string erase method." },
        { id: `${algorithmId}-java`, algorithmId, language: "java", isPrimary: false, code: `String remove(String text, int index) {\n    return new StringBuilder(text).deleteCharAt(index).toString();\n}`, explanation: "Uses StringBuilder to delete the character." },
      ];
    case "string-replace":
      return [
        { id: `${algorithmId}-js`, algorithmId, language: "javascript", isPrimary: true, code: `function replace(text, index, char) {\n  return text.substring(0, index) + char + text.substring(index + 1);\n}`, explanation: "Replaces the character at the given index." },
        { id: `${algorithmId}-py`, algorithmId, language: "python", isPrimary: false, code: `def replace(text, index, char):\n    return text[:index] + char + text[index+1:]`, explanation: "Replaces the character at the given index." },
        { id: `${algorithmId}-cpp`, algorithmId, language: "cpp", isPrimary: false, code: `string replace(string text, int index, char c) {\n    text[index] = c;\n    return text;\n}`, explanation: "Replaces the character at the given index by direct assignment." },
        { id: `${algorithmId}-java`, algorithmId, language: "java", isPrimary: false, code: `String replace(String text, int index, char c) {\n    char[] chars = text.toCharArray();\n    chars[index] = c;\n    return new String(chars);\n}`, explanation: "Converts to char array, replaces, and converts back." },
      ];
    case "string-change-case":
      return [
        { id: `${algorithmId}-js`, algorithmId, language: "javascript", isPrimary: true, code: `function changeCase(text) {\n  return text.split('').map(c => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join('');\n}`, explanation: "Inverts the case of each character." },
        { id: `${algorithmId}-py`, algorithmId, language: "python", isPrimary: false, code: `def change_case(text):\n    return text.swapcase()`, explanation: "Inverts the case of each character." },
        { id: `${algorithmId}-cpp`, algorithmId, language: "cpp", isPrimary: false, code: `string changeCase(string text) {\n    for (char& c : text) {\n        if (isupper(c)) c = tolower(c);\n        else if (islower(c)) c = toupper(c);\n    }\n    return text;\n}`, explanation: "Inverts the case of each character." },
        { id: `${algorithmId}-java`, algorithmId, language: "java", isPrimary: false, code: `String changeCase(String text) {\n    StringBuilder sb = new StringBuilder(text.length());\n    for (char c : text.toCharArray()) {\n        if (Character.isUpperCase(c)) sb.append(Character.toLowerCase(c));\n        else if (Character.isLowerCase(c)) sb.append(Character.toUpperCase(c));\n        else sb.append(c);\n    }\n    return sb.toString();\n}`, explanation: "Inverts the case of each character." },
      ];
    default:
      return [];
  }
}
