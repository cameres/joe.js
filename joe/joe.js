#!/usr/bin/env node

var os = require('os');
var path = require('path');
var fs = require('fs');

var commander = require('commander');

function _get_data_dir(){
  return path.join(__dirname, 'data');
}

function _walk_gitignores(directory){
  var arr = [];
  // reads for files
  var files = fs.readdirSync(DATA_DIR);
  files.forEach(function(value, index, array){
    if(/\.gitignore+$/.test(value)){
      arr.push(value.replace('.gitignore',''));
    }
  });
  return arr;
}

var DATA_DIR = _get_data_dir('*.gitignore'); // correct
var GITIGNORE_RAW = _walk_gitignores();
var GITIGNORE = GITIGNORE_RAW.map(function(value){
  return value.toLowerCase();
});

function printFilenames(){
  console.log(GITIGNORE.join(', '));
}

function _handle_gitignores(names){
  output = '#### joe made this: https://goel.io/joe\n';
  // use every, because it doesn't have to be called every time
  var exit = names.every(function(name, index, array){
    // indexOf doesn't through exception
    var raw_name = GITIGNORE_RAW[GITIGNORE.indexOf(name.toLowerCase())];
    // console.log(name);
    if(typeof raw_name  === 'string'){
      output += _fetch_gitignore(raw_name);
      // console.log(_fetch_gitignore(raw_name));
      return true;
    } else {
      console.log('Uh oh! Seems like joe doesn\'t know what is.\n Try running `joe ls` to see list of available gitignore files.');
      return false;
    }
  });
  if(exit){
    console.log(output);
  }
}

function _fetch_gitignore(raw_name){
  var output = '\n#####=== '+ raw_name +' ===#####\n';
  // don't handle directory yet
  var filepath = path.join(DATA_DIR, raw_name + '.gitignore');
  output += '\n';
  output += fs.readFileSync(filepath);
  return output;
}

commander
  .version('0.0.2')
  .option('ls, list', 'list all the file types', printFilenames)
  .parse(process.argv);

if(commander.args.length !== 0){
  _handle_gitignores(commander.args);
}
