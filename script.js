// Get references to the elements
const runButton = document.getElementById('runbutton');
const resetButton = document.getElementById('resetbutton');
const vscript = document.getElementById('vscript');
const vconsole = document.getElementById('vconsole');

var compiledScript = [];
var vmemory = [];

// Reset 
resetButton.addEventListener('click', () => {
  vscript.value = '';
  vconsole.value = '';
});

// Tab handling
vscript.addEventListener('keydown', (e) => {
  if (e.key === 'Tab') {
    e.preventDefault();
    
    let start = vscript.selectionStart;
    let end = vscript.selectionEnd;

    vscript.value = vscript.value.substring(0, start) + '\t' + vscript.value.substring(end);
    vscript.selectionStart = vscript.selectionEnd = start + 1;
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

  let lines = script.split('\n');
  lines.forEach(line => {
    // remove tabs and spaces
    line = line.trim();
    
    if (line.startsWith('print(') && line.endsWith(')')) /*print statement*/ {
      let input = line.slice(6, -1).trim(); 
      instructions.push({
        type: 'print',
        input: input
      });
    }
  });;

  return instructions
}

// run the compiled script
function vexecute(script) {
  vconsole.value = "";
  script.forEach(instruction => {
    if (instruction.type == "print") /*print statement*/ {
      let result = new Function('return ' + instruction.input)();
      vconsole.value += result + '\n'
    }
  });
}
