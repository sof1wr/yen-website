function solveLinearEquations(coefficients, constants) {
    const numEquations = coefficients.length;
    const numVariables = coefficients[0].length;
  
    const matrix = [];
    for (let i = 0; i < numEquations; i++) {
      const row = coefficients[i].concat(constants[i]);
      matrix.push(row);
    }
  
    const variableValues = solveGaussianElimination(matrix, numVariables);
    return variableValues;
  }
  
  function solveGaussianElimination(matrix, numVariables) {
    const augmentedMatrix = [...matrix];
  
    for (let i = 0; i < numVariables; i++) {
      let pivotRow = i;
  
      for (let j = i + 1; j < augmentedMatrix.length; j++) {
        if (Math.abs(augmentedMatrix[j][i]) > Math.abs(augmentedMatrix[pivotRow][i])) {
          pivotRow = j;
        }
      }
  
      [augmentedMatrix[i], augmentedMatrix[pivotRow]] = [augmentedMatrix[pivotRow], augmentedMatrix[i]];
  
      const pivot = augmentedMatrix[i][i];
  
      for (let j = i + 1; j < augmentedMatrix.length; j++) {
        const factor = augmentedMatrix[j][i] / pivot;
  
        for (let k = i; k < augmentedMatrix[j].length; k++) {
          augmentedMatrix[j][k] -= factor * augmentedMatrix[i][k];
        }
      }
    }
  
    const solution = new Array(numVariables);
    for (let i = numVariables - 1; i >= 0; i--) {
      let sum = 0;
      for (let j = i + 1; j < numVariables; j++) {
        sum += augmentedMatrix[i][j] * solution[j];
      }
      solution[i] = (augmentedMatrix[i][numVariables] - sum) / augmentedMatrix[i][i];
    }
  
    return solution;
  }
  
  function calculateInverse(matrix) {
    const n = matrix.length;
    const identity = createIdentityMatrix(n);
    const augmentedMatrix = matrix.map((row, index) => row.concat(identity[index]));
  
    for (let i = 0; i < n; i++) {
      let pivotRow = i;
  
      for (let j = i + 1; j < n; j++) {
        if (Math.abs(augmentedMatrix[j][i]) > Math.abs(augmentedMatrix[pivotRow][i])) {
          pivotRow = j;
        }
      }
  
      [augmentedMatrix[i], augmentedMatrix[pivotRow]] = [augmentedMatrix[pivotRow], augmentedMatrix[i]];
  
      const pivot = augmentedMatrix[i][i];
  
      for (let j = i + 1; j < n; j++) {
        const factor = augmentedMatrix[j][i] / pivot;
  
        for (let k = i; k < 2 * n; k++) {
          augmentedMatrix[j][k] -= factor * augmentedMatrix[i][k];
        }
      }
    }
  
    for (let i = n - 1; i >= 0; i--) {
      const pivot = augmentedMatrix[i][i];
  
      for (let j = 0; j < i; j++) {
        const factor = augmentedMatrix[j][i] / pivot;
  
        for (let k = i; k < 2 * n; k++) {
          augmentedMatrix[j][k] -= factor * augmentedMatrix[i][k];
        }
      }
  
      for (let j = i + 1; j < n; j++) {
        augmentedMatrix[j][i] /= -pivot;
      }
  
      for (let k = i; k < 2 * n; k++) {
        augmentedMatrix[i][k] /= pivot;
      }
    }
  
    const inverseMatrix = augmentedMatrix.map((row) => row.slice(n));
  
    return inverseMatrix;
  }
  
  function createIdentityMatrix(size) {
    const identity = new Array(size).fill(0).map((row, index) => {
      const newRow = new Array(size).fill(0);
      newRow[index] = 1;
      return newRow;
    });
  
    return identity;
  }
  
  document.getElementById('linearEquationForm').addEventListener('submit', function(event) {
    event.preventDefault();
  
    const numVariables = parseInt(document.getElementById('numVariables').value, 10);
    const numEquations = parseInt(document.getElementById('numEquations').value, 10);
  
    const coefficients = [];
    const constants = [];
  
    for (let i = 0; i < numEquations; i++) {
      const equationCoefficients = [];
      for (let j = 0; j < numVariables; j++) {
        const variableCoefficient = parseFloat(document.getElementById(`coefficient-${i}-${j}`).value);
        equationCoefficients.push(variableCoefficient);
      }
      coefficients.push(equationCoefficients);
  
      const constant = parseFloat(document.getElementById(`constant-${i}`).value);
      constants.push(constant);
    }
  
    const variableValues = solveLinearEquations(coefficients, constants);
    const inverseMatrix = calculateInverse(coefficients);
  
    const solutionOutput = variableValues.map((value, index) => `Variable ${index + 1}: ${value}`);
    document.getElementById('solutionOutput').innerText = solutionOutput.join('\n');
  
    const inverseOutput = inverseMatrix.map((row) => row.join('   '));
    document.getElementById('inverseOutput').innerText = inverseOutput.join('\n');
  });
  
  document.getElementById('numVariables').addEventListener('input', function(event) {
    const numVariables = parseInt(event.target.value, 10);
    const numEquations = parseInt(document.getElementById('numEquations').value, 10);
  
    const variablesContainer = document.getElementById('variablesContainer');
    variablesContainer.innerHTML = '';
  
    for (let i = 0; i < numVariables; i++) {
      const input = document.createElement('input');
      input.type = 'text';
      input.id = `variable-${i}`;
      input.placeholder = `Variable ${i + 1}`;
  
      variablesContainer.appendChild(input);
    }
  });
  
  document.getElementById('numEquations').addEventListener('input', function(event) {
    const numEquations = parseInt(event.target.value, 10);
    const numVariables = parseInt(document.getElementById('numVariables').value, 10);
  
    const equationsContainer = document.getElementById('equationsContainer');
    equationsContainer.innerHTML = '';
  
    for (let i = 0; i < numEquations; i++) {
      const equationContainer = document.createElement('div');
      equationContainer.className = 'equation';
  
      for (let j = 0; j < numVariables; j++) {
        const input = document.createElement('input');
        input.type = 'text';
        input.id = `coefficient-${i}-${j}`;
        input.placeholder = `Coefficient ${j + 1}`;
  
        equationContainer.appendChild(input);
      }
  
      const constantInput = document.createElement('input');
      constantInput.type = 'text';
      constantInput.id = `constant-${i}`;
      constantInput.placeholder = 'Constant';
  
      equationContainer.appendChild(constantInput);
      equationsContainer.appendChild(equationContainer);
    }
  });
  