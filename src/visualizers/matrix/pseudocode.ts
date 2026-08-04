export function getMatrixPseudocode(slug: string): string[] {
  switch (slug) {
    case "row-wise-traversal":
      return [
        "function rowWiseTraversal(matrix):",
        "    for row from 0 to rows - 1:",
        "        for col from 0 to cols - 1:",
        "            visit matrix[row][col]",
      ];
    case "col-wise-traversal":
    case "matrix-col-traversal":
      return [
        "function columnWiseTraversal(matrix):",
        "    for col from 0 to cols - 1:",
        "        for row from 0 to rows - 1:",
        "            visit matrix[row][col]",
      ];
    case "spiral-traversal":
      return [
        "function spiralTraversal(matrix):",
        "    set top, bottom, left, right boundaries",
        "    while boundaries do not cross:",
        "        traverse top row, right column, bottom row, left column",
        "        move boundaries inward",
      ];
    case "matrix-search":
      return [
        "function searchMatrix(matrix, target):",
        "    for each row:",
        "        for each col:",
        "            if matrix[row][col] == target:",
        "                return (row, col)",
        "    return not found",
      ];
    case "row-column-sorted-search":
      return [
        "function sortedMatrixSearch(matrix, target):",
        "    row = 0, col = cols - 1",
        "    while row < rows and col >= 0:",
        "        if matrix[row][col] == target: return (row, col)",
        "        if matrix[row][col] > target: col--",
        "        else: row++",
        "    return not found",
      ];
    case "transpose-matrix":
      return [
        "function transpose(matrix):",
        "    for row from 0 to rows - 1:",
        "        for col from row + 1 to cols - 1:",
        "            swap matrix[row][col] with matrix[col][row]",
      ];
    case "rotate-matrix-90":
      return [
        "function rotate90(matrix):",
        "    transpose matrix",
        "    for each row:",
        "        reverse row",
      ];
    case "matrix-multiplication":
      return [
        "function multiply(A, B):",
        "    for each output row i:",
        "        for each output col j:",
        "            result[i][j] = sum(A[i][k] * B[k][j])",
      ];
    case "matrix-addition":
      return [
        "function add(A, B):",
        "    for row from 0 to rows - 1:",
        "        for col from 0 to cols - 1:",
        "            result[row][col] = A[row][col] + B[row][col]",
      ];
    case "matrix-subtraction":
      return [
        "function subtract(A, B):",
        "    for row from 0 to rows - 1:",
        "        for col from 0 to cols - 1:",
        "            result[row][col] = A[row][col] - B[row][col]",
      ];
    default:
      return [];
  }
}
