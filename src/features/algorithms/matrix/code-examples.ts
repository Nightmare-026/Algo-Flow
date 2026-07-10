import { CodeExample } from "@/types";

export function getMatrixCodeExamples(slug: string, algorithmId: string): CodeExample[] {
  switch (slug) {
    case "row-wise-traversal":
    case "matrix-row-traversal":
      return [
        { id: `${algorithmId}-js`, algorithmId, language: "javascript", isPrimary: true, code: `function rowWiseTraversal(matrix) {
  const rows = matrix.length;
  const cols = matrix[0].length;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      console.log(matrix[r][c]);
    }
  }
}`, explanation: "Iterates through each row completely before moving to the next row." },
        { id: `${algorithmId}-py`, algorithmId, language: "python", isPrimary: false, code: `def row_wise_traversal(matrix):
    for row in matrix:
        for val in row:
            print(val)`, explanation: "Iterates through each row completely before moving to the next row." },
        { id: `${algorithmId}-cpp`, algorithmId, language: "cpp", isPrimary: false, code: `void rowWiseTraversal(vector<vector<int>>& matrix) {
    int rows = matrix.size();
    if (rows == 0) return;
    int cols = matrix[0].size();
    for (int r = 0; r < rows; r++) {
        for (int c = 0; c < cols; c++) {
            cout << matrix[r][c] << endl;
        }
    }
}`, explanation: "Iterates through each row completely before moving to the next row." },
        { id: `${algorithmId}-java`, algorithmId, language: "java", isPrimary: false, code: `void rowWiseTraversal(int[][] matrix) {
    int rows = matrix.length;
    if (rows == 0) return;
    int cols = matrix[0].length;
    for (int r = 0; r < rows; r++) {
        for (int c = 0; c < cols; c++) {
            System.out.println(matrix[r][c]);
        }
    }
}`, explanation: "Iterates through each row completely before moving to the next row." },
      ];
    case "col-wise-traversal":
      return [
        { id: `${algorithmId}-js`, algorithmId, language: "javascript", isPrimary: true, code: `function colWiseTraversal(matrix) {
  const rows = matrix.length;
  const cols = matrix[0].length;
  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      console.log(matrix[r][c]);
    }
  }
}`, explanation: "Iterates through each column completely from top to bottom before moving to the next column." },
        { id: `${algorithmId}-py`, algorithmId, language: "python", isPrimary: false, code: `def col_wise_traversal(matrix):
    if not matrix: return
    rows, cols = len(matrix), len(matrix[0])
    for c in range(cols):
        for r in range(rows):
            print(matrix[r][c])`, explanation: "Iterates through each column completely from top to bottom before moving to the next column." },
        { id: `${algorithmId}-cpp`, algorithmId, language: "cpp", isPrimary: false, code: `void colWiseTraversal(vector<vector<int>>& matrix) {
    int rows = matrix.size();
    if (rows == 0) return;
    int cols = matrix[0].size();
    for (int c = 0; c < cols; c++) {
        for (int r = 0; r < rows; r++) {
            cout << matrix[r][c] << endl;
        }
    }
}`, explanation: "Iterates through each column completely from top to bottom before moving to the next column." },
        { id: `${algorithmId}-java`, algorithmId, language: "java", isPrimary: false, code: `void colWiseTraversal(int[][] matrix) {
    int rows = matrix.length;
    if (rows == 0) return;
    int cols = matrix[0].length;
    for (int c = 0; c < cols; c++) {
        for (int r = 0; r < rows; r++) {
            System.out.println(matrix[r][c]);
        }
    }
}`, explanation: "Iterates through each column completely from top to bottom before moving to the next column." },
      ];
    case "matrix-search":
      return [
        { id: `${algorithmId}-js`, algorithmId, language: "javascript", isPrimary: true, code: `function matrixSearch(matrix, target) {
  const rows = matrix.length;
  const cols = matrix[0].length;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (matrix[r][c] === target) return { row: r, col: c };
    }
  }
  return null;
}`, explanation: "Performs a linear scan across all elements in the matrix to find the target." },
        { id: `${algorithmId}-py`, algorithmId, language: "python", isPrimary: false, code: `def matrix_search(matrix, target):
    for r, row in enumerate(matrix):
        for c, val in enumerate(row):
            if val == target: return (r, c)
    return None`, explanation: "Performs a linear scan across all elements in the matrix to find the target." },
        { id: `${algorithmId}-cpp`, algorithmId, language: "cpp", isPrimary: false, code: `pair<int, int> matrixSearch(vector<vector<int>>& matrix, int target) {
    int rows = matrix.size();
    if (rows == 0) return {-1, -1};
    int cols = matrix[0].size();
    for (int r = 0; r < rows; r++) {
        for (int c = 0; c < cols; c++) {
            if (matrix[r][c] == target) return {r, c};
        }
    }
    return {-1, -1};
}`, explanation: "Performs a linear scan across all elements in the matrix to find the target." },
        { id: `${algorithmId}-java`, algorithmId, language: "java", isPrimary: false, code: `int[] matrixSearch(int[][] matrix, int target) {
    int rows = matrix.length;
    if (rows == 0) return new int[]{-1, -1};
    int cols = matrix[0].length;
    for (int r = 0; r < rows; r++) {
        for (int c = 0; c < cols; c++) {
            if (matrix[r][c] == target) return new int[]{r, c};
        }
    }
    return new int[]{-1, -1};
}`, explanation: "Performs a linear scan across all elements in the matrix to find the target." },
      ];
    case "spiral-traversal":
      return [
        { id: `${algorithmId}-js`, algorithmId, language: "javascript", isPrimary: true, code: `function spiralTraversal(matrix) {
  if (!matrix.length) return;
  let top = 0, bottom = matrix.length - 1;
  let left = 0, right = matrix[0].length - 1;
  while (top <= bottom && left <= right) {
    for (let i = left; i <= right; i++) console.log(matrix[top][i]);
    top++;
    for (let i = top; i <= bottom; i++) console.log(matrix[i][right]);
    right--;
    if (top <= bottom) {
      for (let i = right; i >= left; i--) console.log(matrix[bottom][i]);
      bottom--;
    }
    if (left <= right) {
      for (let i = bottom; i >= top; i--) console.log(matrix[i][left]);
      left++;
    }
  }
}`, explanation: "Iterates through the matrix in a spiral order by managing four boundaries (top, bottom, left, right)." },
        { id: `${algorithmId}-py`, algorithmId, language: "python", isPrimary: false, code: `def spiral_traversal(matrix):
    if not matrix: return
    top, bottom = 0, len(matrix) - 1
    left, right = 0, len(matrix[0]) - 1
    while top <= bottom and left <= right:
        for i in range(left, right + 1): print(matrix[top][i])
        top += 1
        for i in range(top, bottom + 1): print(matrix[i][right])
        right -= 1
        if top <= bottom:
            for i in range(right, left - 1, -1): print(matrix[bottom][i])
            bottom -= 1
        if left <= right:
            for i in range(bottom, top - 1, -1): print(matrix[i][left])
            left += 1`, explanation: "Iterates through the matrix in a spiral order by managing four boundaries (top, bottom, left, right)." },
        { id: `${algorithmId}-cpp`, algorithmId, language: "cpp", isPrimary: false, code: `void spiralTraversal(vector<vector<int>>& matrix) {
    if (matrix.empty()) return;
    int top = 0, bottom = matrix.size() - 1;
    int left = 0, right = matrix[0].size() - 1;
    while (top <= bottom && left <= right) {
        for (int i = left; i <= right; i++) cout << matrix[top][i] << endl;
        top++;
        for (int i = top; i <= bottom; i++) cout << matrix[i][right] << endl;
        right--;
        if (top <= bottom) {
            for (int i = right; i >= left; i--) cout << matrix[bottom][i] << endl;
            bottom--;
        }
        if (left <= right) {
            for (int i = bottom; i >= top; i--) cout << matrix[i][left] << endl;
            left++;
        }
    }
}`, explanation: "Iterates through the matrix in a spiral order by managing four boundaries (top, bottom, left, right)." },
        { id: `${algorithmId}-java`, algorithmId, language: "java", isPrimary: false, code: `void spiralTraversal(int[][] matrix) {
    if (matrix.length == 0) return;
    int top = 0, bottom = matrix.length - 1;
    int left = 0, right = matrix[0].length - 1;
    while (top <= bottom && left <= right) {
        for (int i = left; i <= right; i++) System.out.println(matrix[top][i]);
        top++;
        for (int i = top; i <= bottom; i++) System.out.println(matrix[i][right]);
        right--;
        if (top <= bottom) {
            for (int i = right; i >= left; i--) System.out.println(matrix[bottom][i]);
            bottom--;
        }
        if (left <= right) {
            for (int i = bottom; i >= top; i--) System.out.println(matrix[i][left]);
            left++;
        }
    }
}`, explanation: "Iterates through the matrix in a spiral order by managing four boundaries (top, bottom, left, right)." },
      ];
    case "row-column-sorted-search":
      return [
        { id: `${algorithmId}-js`, algorithmId, language: "javascript", isPrimary: true, code: `function searchMatrix(matrix, target) {
  let row = 0, col = matrix[0].length - 1;
  while (row < matrix.length && col >= 0) {
    if (matrix[row][col] === target) return { row, col };
    if (matrix[row][col] > target) col--;
    else row++;
  }
  return null;
}`, explanation: "Starts from the top-right corner. Moves left if target is smaller, and down if target is larger." },
        { id: `${algorithmId}-py`, algorithmId, language: "python", isPrimary: false, code: `def search_matrix(matrix, target):
    if not matrix: return None
    row, col = 0, len(matrix[0]) - 1
    while row < len(matrix) and col >= 0:
        if matrix[row][col] == target: return (row, col)
        if matrix[row][col] > target: col -= 1
        else: row += 1
    return None`, explanation: "Starts from the top-right corner. Moves left if target is smaller, and down if target is larger." },
        { id: `${algorithmId}-cpp`, algorithmId, language: "cpp", isPrimary: false, code: `pair<int, int> searchMatrix(vector<vector<int>>& matrix, int target) {
    if (matrix.empty()) return {-1, -1};
    int row = 0, col = matrix[0].size() - 1;
    while (row < matrix.size() && col >= 0) {
        if (matrix[row][col] == target) return {row, col};
        if (matrix[row][col] > target) col--;
        else row++;
    }
    return {-1, -1};
}`, explanation: "Starts from the top-right corner. Moves left if target is smaller, and down if target is larger." },
        { id: `${algorithmId}-java`, algorithmId, language: "java", isPrimary: false, code: `int[] searchMatrix(int[][] matrix, int target) {
    if (matrix.length == 0) return new int[]{-1, -1};
    int row = 0, col = matrix[0].length - 1;
    while (row < matrix.length && col >= 0) {
        if (matrix[row][col] == target) return new int[]{row, col};
        if (matrix[row][col] > target) col--;
        else row++;
    }
    return new int[]{-1, -1};
}`, explanation: "Starts from the top-right corner. Moves left if target is smaller, and down if target is larger." },
      ];
    case "transpose-matrix":
      return [
        { id: `${algorithmId}-js`, algorithmId, language: "javascript", isPrimary: true, code: `function transpose(matrix) {
  const rows = matrix.length, cols = matrix[0].length;
  const result = Array.from({ length: cols }, () => Array(rows).fill(0));
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      result[c][r] = matrix[r][c];
    }
  }
  return result;
}`, explanation: "Swaps rows with columns, turning an RxC matrix into a CxR matrix." },
        { id: `${algorithmId}-py`, algorithmId, language: "python", isPrimary: false, code: `def transpose(matrix):
    if not matrix: return []
    rows, cols = len(matrix), len(matrix[0])
    result = [[0] * rows for _ in range(cols)]
    for r in range(rows):
        for c in range(cols):
            result[c][r] = matrix[r][c]
    return result`, explanation: "Swaps rows with columns, turning an RxC matrix into a CxR matrix." },
        { id: `${algorithmId}-cpp`, algorithmId, language: "cpp", isPrimary: false, code: `vector<vector<int>> transpose(vector<vector<int>>& matrix) {
    if (matrix.empty()) return {};
    int rows = matrix.size(), cols = matrix[0].size();
    vector<vector<int>> result(cols, vector<int>(rows, 0));
    for (int r = 0; r < rows; r++) {
        for (int c = 0; c < cols; c++) {
            result[c][r] = matrix[r][c];
        }
    }
    return result;
}`, explanation: "Swaps rows with columns, turning an RxC matrix into a CxR matrix." },
        { id: `${algorithmId}-java`, algorithmId, language: "java", isPrimary: false, code: `int[][] transpose(int[][] matrix) {
    if (matrix.length == 0) return new int[0][0];
    int rows = matrix.length, cols = matrix[0].length;
    int[][] result = new int[cols][rows];
    for (int r = 0; r < rows; r++) {
        for (int c = 0; c < cols; c++) {
            result[c][r] = matrix[r][c];
        }
    }
    return result;
}`, explanation: "Swaps rows with columns, turning an RxC matrix into a CxR matrix." },
      ];
    case "rotate-matrix-90":
      return [
        { id: `${algorithmId}-js`, algorithmId, language: "javascript", isPrimary: true, code: `function rotate90(matrix) {
  const n = matrix.length;
  for (let i = 0; i < n; i++) {
    for (let j = i; j < n; j++) {
      [matrix[i][j], matrix[j][i]] = [matrix[j][i], matrix[i][j]];
    }
  }
  for (let i = 0; i < n; i++) {
    matrix[i].reverse();
  }
  return matrix;
}`, explanation: "Rotates an NxN matrix 90 degrees clockwise by transposing it, then reversing each row." },
        { id: `${algorithmId}-py`, algorithmId, language: "python", isPrimary: false, code: `def rotate90(matrix):
    n = len(matrix)
    for i in range(n):
        for j in range(i, n):
            matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]
    for i in range(n):
        matrix[i].reverse()
    return matrix`, explanation: "Rotates an NxN matrix 90 degrees clockwise by transposing it, then reversing each row." },
        { id: `${algorithmId}-cpp`, algorithmId, language: "cpp", isPrimary: false, code: `void rotate90(vector<vector<int>>& matrix) {
    int n = matrix.size();
    for (int i = 0; i < n; i++) {
        for (int j = i; j < n; j++) {
            swap(matrix[i][j], matrix[j][i]);
        }
    }
    for (int i = 0; i < n; i++) {
        reverse(matrix[i].begin(), matrix[i].end());
    }
}`, explanation: "Rotates an NxN matrix 90 degrees clockwise by transposing it, then reversing each row." },
        { id: `${algorithmId}-java`, algorithmId, language: "java", isPrimary: false, code: `void rotate90(int[][] matrix) {
    int n = matrix.length;
    for (int i = 0; i < n; i++) {
        for (int j = i; j < n; j++) {
            int temp = matrix[i][j];
            matrix[i][j] = matrix[j][i];
            matrix[j][i] = temp;
        }
    }
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n / 2; j++) {
            int temp = matrix[i][j];
            matrix[i][j] = matrix[i][n - 1 - j];
            matrix[i][n - 1 - j] = temp;
        }
    }
}`, explanation: "Rotates an NxN matrix 90 degrees clockwise by transposing it, then reversing each row." },
      ];
    case "matrix-multiplication":
      return [
        { id: `${algorithmId}-js`, algorithmId, language: "javascript", isPrimary: true, code: `function multiply(A, B) {
  const r1 = A.length, c1 = A[0].length;
  const r2 = B.length, c2 = B[0].length;
  if (c1 !== r2) return null;
  const result = Array.from({ length: r1 }, () => Array(c2).fill(0));
  for (let i = 0; i < r1; i++) {
    for (let j = 0; j < c2; j++) {
      for (let k = 0; k < c1; k++) {
        result[i][j] += A[i][k] * B[k][j];
      }
    }
  }
  return result;
}`, explanation: "Computes the dot product of rows from the first matrix and columns from the second matrix." },
        { id: `${algorithmId}-py`, algorithmId, language: "python", isPrimary: false, code: `def multiply(A, B):
    r1, c1 = len(A), len(A[0])
    r2, c2 = len(B), len(B[0])
    if c1 != r2: return None
    result = [[0] * c2 for _ in range(r1)]
    for i in range(r1):
        for j in range(c2):
            for k in range(c1):
                result[i][j] += A[i][k] * B[k][j]
    return result`, explanation: "Computes the dot product of rows from the first matrix and columns from the second matrix." },
        { id: `${algorithmId}-cpp`, algorithmId, language: "cpp", isPrimary: false, code: `vector<vector<int>> multiply(vector<vector<int>>& A, vector<vector<int>>& B) {
    int r1 = A.size(), c1 = A[0].size();
    int r2 = B.size(), c2 = B[0].size();
    if (c1 != r2) return {};
    vector<vector<int>> result(r1, vector<int>(c2, 0));
    for (int i = 0; i < r1; i++) {
        for (int j = 0; j < c2; j++) {
            for (int k = 0; k < c1; k++) {
                result[i][j] += A[i][k] * B[k][j];
            }
        }
    }
    return result;
}`, explanation: "Computes the dot product of rows from the first matrix and columns from the second matrix." },
        { id: `${algorithmId}-java`, algorithmId, language: "java", isPrimary: false, code: `int[][] multiply(int[][] A, int[][] B) {
    int r1 = A.length, c1 = A[0].length;
    int r2 = B.length, c2 = B[0].length;
    if (c1 != r2) return null;
    int[][] result = new int[r1][c2];
    for (int i = 0; i < r1; i++) {
        for (int j = 0; j < c2; j++) {
            for (int k = 0; k < c1; k++) {
                result[i][j] += A[i][k] * B[k][j];
            }
        }
    }
    return result;
}`, explanation: "Computes the dot product of rows from the first matrix and columns from the second matrix." },
      ];
    default:
      return [];
  }
}
