var MatrixMakingException = {};

function makeMatrix(strMatrix) {
    var lines = strMatrix.split(/\n+/);
    var matrix = [];

    for(var i = 0; i < lines.length; i++) {
        var line = lines[i];

        // Strip leading and trailing whitespace.
        line = line.replace(/^\s+/, "").replace(/\s+$/, "");
        if(line != "") {
            var strNumbers = line.split(/\s+/);

            if(matrix.length > 0 &&
               strNumbers.length != matrix[matrix.length - 1].length)
                throw MatrixMakingException;

            var numbers = [];
            for(var j = 0; j < strNumbers.length; j++)
                numbers.push(Number(strNumbers[j]));
            matrix.push(numbers);
        }
    }

    return matrix;
}

// Only pass in valid matrices.
function matrixRows(matrix) {
    return matrix.length;
}

// Only pass in valid matrices.
function matrixCols(matrix) {
    if(matrix.length == 0)
        return 0;
    else
        return matrix[0].length;
}

// Check if two matrices are valid for solving
// matrix equations.
// Only pass in individual valid matrices.
function areValidMatrices(matrixA, matrixB) {
    return matrixRows(matrixA) == matrixCols(matrixA) &&
           matrixCols(matrixB) == 1 &&
           matrixRows(matrixA) == matrixRows(matrixB);
}

// Make sure that matrixA and matrixB are valid
// for solving by checking with areValidMatrices.
function matrixAugment(matrixA, matrixB) {
    var augmented = [];
    for(var i = 0; i < matrixA.length; i++) {
        augmented[i] = [];
        for(var j = 0; j < matrixA[i].length; j++)
            augmented[i][j] = matrixA[i][j];
    }

    for(var k = 0; k < matrixA.length; k++)
        augmented[k].push(matrixB[k][0]);

    return augmented;
}

// Make sure matrix isn't a jagged array.
function matrixRowSwap(matrix, a, b) {
    var tmp;
    for(var i = 0; i < matrix[0].length; i++) {
        tmp = matrix[a][i];
        matrix[a][i] = matrix[b][i];
        matrix[b][i] = tmp;
    }
}

// Make sure that matrixA and matrixB are valid
// for solving by checking with areValidMatrices.
function matrixSolve(matrixA, matrixB) {
    var A = matrixAugment(matrixA, matrixB);
    var M = A.length;
    var N = A[0].length;

    // Gaussian Elimination.
    for(var k = 0; k < M - 1; k++) {
        var m = k;
        for(var a = k + 1; a < M; a++)
            if(Math.abs(A[a][k]) > Math.abs(A[m][k]))
                m = a;

        if(m != k)
            matrixRowSwap(A, k, m);

        for(var i = k + 1; i < M; i++)
            for(var j = N - 1; j >= k; j--)
                A[i][j] -= A[i][k] / A[k][k] * A[k][j];
    }

    // Back substitution.
    for(var l = M - 1; l >= 0; l--) {
        var lhs = 0;
        for(var m = N - 1; m > l + 1; m--)
            lhs += A[l][m - 1] * A[m - 1][N - 1];
        A[l][N - 1] = (A[l][N - 1] - lhs) / A[l][l];
    }

    var answer = [];
    for(var n = 0; n < M; n++)
        answer[n] = A[n][N - 1];

    return answer;
}

function matrixSolveDriver() {
    var textBoxA = document.getElementById("matrixleft");
    var textBoxB = document.getElementById("matrixright");
    var textBoxSolution = document.getElementById("solutions");

    try {
        var matrixA = makeMatrix(textBoxA.value);
        var matrixB = makeMatrix(textBoxB.value);

        if(areValidMatrices(matrixA, matrixB)) {
            var solution = matrixSolve(matrixA, matrixB);
            var invalid = false;
            for(var i = 0; i < solution.length; i++)
                if(solution[i] == NaN ||
                   solution[i] == Infinity ||
                   solution[i] == -Infinity)
                    invalid = true;

            if(!invalid)
                textBoxSolution.innerHTML = solution.join("<br/>");
            else
                textBoxSolution.innerHTML = "Couldn't solve matrix equations.";
        }
        else {
            textBoxSolution.innerHTML = "Matrices dimension mismatch.";
        }
    }
    catch(exception) {
        if(exception != MatrixMakingException)
            textBoxSolution.innerHTML = "Error parsing matrices.";
        else
            textBoxSolution.innerHTML = "Matrix dimension mismatch.";
    }
}