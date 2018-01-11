#!/usr/bin/env node

/**
 * @Author: Nicolas Fazio <webmaster-fazio>
 * @Date:   09-01-2018
 * @Email:  contact@nicolasfazio.ch
 * @Last modified by:   webmaster-fazio
 * @Last modified time: 10-01-2018
 */

import { cd, exec } from "shelljs";
import * as program from "commander";
import { spawn } from "child_process";
import * as chalk from "chalk";
import * as inquirer from "inquirer";
const git = require('simple-git/promise');
import * as CliSpinner from "cli-spinner";

const spinner = new CliSpinner.Spinner('processing.. %s');
spinner.setSpinnerString('|/-\\');

const pkg = require('../package.json');
import { runcmd } from "./utils";
import { start } from "./commandes/start";

function cmdError(cmd:string){
  console.log(chalk.red(`[ERROR] Unable to find command: `) + chalk.green(cmd));
  return program.outputHelp(chalk.cyan)
}

var cmd:string,
    framework:string,
    appname:string,
    template:string;

program
  .version(pkg.version)
  .usage('<Commands>');

program
  .command('start',)
  .description('Create a new project')
  // TODO: enable options
  // .option('-f, --framework [framework]', 'select framework')
  // .option('-t, --template [template]', 'select template')
  .action((name, options)=>{
    cmd = 'start';
    appname = name;
    // framework = options.framework|| null;
    // template = options.template|| null;
  });

program.parse(process.argv);

if(!cmd){
  console.log(chalk.red(`[ERROR] Unable to run cmd!`).trim());
  program.outputHelp(chalk.white)
  process.exit(1);
}

switch (true) {

  case cmd === 'start':
    start(framework,template)
      .then(res=> {
        if(res.success === true){
          console.log(chalk.green.bold(`[Success] Project is successfully started !!!`))
          console.log(chalk.green(`Let's get started by runing: $ cd ${res.appname}`))
          process.exit();
          return;
        }
        console.log(chalk.red.bold(res.error));
        process.exit();
      })
      .catch(err=> {
        spinner.stop();
        console.log(chalk.red.bold('[ERROR] cli.ts'))
        console.log(chalk.red(err))
        process.exit(1)}
      );
    break;
  case cmd === 'g':
    spinner.stop();
    console.log('g')
    process.exit();
    break;
  default: spinner.stop();
}
