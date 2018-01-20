#!/usr/bin/env node

/**
 * @Author: Nicolas Fazio <webmaster-fazio>
 * @Date:   09-01-2018
 * @Email:  contact@nicolasfazio.ch
 * @Last modified by:   webmaster-fazio
 * @Last modified time: 14-01-2018
 */

import * as program from "commander";
import * as chalk from "chalk";

const pkg = require('../package.json');
import * as utils from "./utils";
import { Init } from "./commandes/init";
import { CmdSwitcher } from "./commandes";

var cmd:string,
    framework:string,
    appname:string,
    template:string;

program
  .version(pkg.version)
  .usage('<Commands>');

program
  .command('init',)
  .description('Initialize Zio Cli for your project.')
  .action(_=>{
    cmd = 'init';
  });

program
  .command('start',)
  .description('Create a new project.')
  // TODO: enable options
  // .option('-f, --framework [framework]', 'select framework')
  // .option('-t, --template [template]', 'select template')
  .action((name, options)=>{
    cmd = 'start';
    appname = name;
    // framework = options.framework|| null;
    // template = options.template|| null;
  });

program
  .command('add',)
  .description('Add new element to your app.')
  .action(_=>{
    cmd = 'add';
  });

program.parse(process.argv);

if(!cmd){
  console.log(chalk.red(`[ERROR] Unable to run cmd!`).trim());
  program.outputHelp(chalk.white)
  process.exit(1);
}

// check zio.config.json file config.
if(cmd === 'init' && utils.fileExists('./zio.config.json')){
  // create file config.
  utils.displayError('Cannot init project cause zio.config.json already existe.')
  program.outputHelp(chalk.white)
  process.exit(1);
}
else if(cmd === 'init' && !utils.fileExists('./zio.config.json')){
  // create file config.
  new Init();
}
else if(cmd !== 'init' && cmd !== 'start' && !utils.fileExists('./zio.config.json')){
  new Init(true)
}
else {
  new CmdSwitcher(cmd);
}
