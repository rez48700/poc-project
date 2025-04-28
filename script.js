// Get references to the elements
const runButton = document.getElementById('runbutton');
const resetButton = document.getElementById('resetbutton');
const vscript = document.getElementById('vscript');
const vconsole = document.getElementById('vconsole');

var compiledScript = [];
var vmemory = [];

// Classes
class instruction {
  constructor(type, input) {
    this.type = type;
    this.input = input;
  }
}

class variable {
  constructor(name, value) {
    this.name = name;
    this.value = value;
  }
}

// Reset 
resetButton.addEventListener('click', () => {
  vscript.value = '';
  vconsole.value = '';
});

// Tab handling
vscript.addEventListener('keydown', (event) => {
  if (event.key === 'Tab') {
    event.preventDefault();
    
    let selectionStart = vscript.selectionStart;
    let selectionEnd = vscript.selectionEnd;

    vscript.value = vscript.value.substring(0, selectionStart) + '\t' + vscript.value.substring(selectionEnd);
    vscript.selectionStart = vscript.selectionEnd = selectionStart + 1;
  }
});

// Run 
runButton.addEventListener('click', () => {
  compiledScript = vcompile(vscript.value)
  vexecute(compiledScript);
});

// parse the vscript into a compiled script
function vcompile(script) {
  let instructions = [];

  let scriptLines = script.split('\n');
  scriptLines.forEach(line => {
    // remove tabs and spaces
    line = line.trim();
    
    if (line.startsWith("print(") && line.endsWith(")")) /*print statement*/ {
      let input = line.slice(6, -1).trim(); 
      instructions.push({
        type: "print",
        input: input
      });
    } else if (line.includes("=")) /*assign statement*/ {
      let parts = line.split("=");
      if (parts.length === 2) {
        let name = parts[0].trim();
        let value = parts[1].trim();
        instructions.push({
          type: "assign",
          input: { name: name, value: value }
        });
      }
    }
  });

  return instructions;
}

// evaluate expressions using variables in vmemory
function vevaluate(expression) {
  vmemory.forEach(variableObject => {
    // Use word boundaries to avoid partial replacements
    expression = expression.replace(new RegExp("\\b" + variableObject.name + "\\b", "g"), variableObject.value);
  });

  return new Function("return " + expression)();
}

// run the compiled script
function vexecute(script) {
  vconsole.value = "";
  vmemory = [];

  script.forEach(instructionObject => {
    if (instructionObject.type == "print") /*print statement*/ {
      let result = vevaluate(instructionObject.input);
      vconsole.value += result + '\n';
    } else if (instructionObject.type == "assign") /*assign statement*/ {
      let variableName = instructionObject.input.name;
      let evaluatedValue = vevaluate(instructionObject.input.value);
      let existingVariable = vmemory.find(variableObject => variableObject.name === variableName);
      if (existingVariable) {
        existingVariable.value = evaluatedValue;
      } else {
        vmemory.push(new variable(variableName, evaluatedValue));
      }
    }
  });
}
