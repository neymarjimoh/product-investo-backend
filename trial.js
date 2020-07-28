var repl = require("repl");

function myEval(cmd, context, filename, cb) {
  cb(null, cmd);
} 

function myWriter(output) {
  return output.toUpperCase();
}

repl.start({
  prompt: "enter command > ",
  eval: myEval,
  writer: myWriter
});