#!/usr/bin/env node

/**
 * @Author: Nicolas Fazio <webmaster-fazio>
 * @Date:   10-01-2018
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

import { runcmd } from "../utils";
import * as ionic from "./ionic/install";
import * as starter from "./starter/install";

const questions1 = [
  {
    name: 'appname',
    type: 'input',
    message: 'Enter your Application Name:',
    validate: ( value ) => (value.length)
                ? true
                :'Please enter a name for your application',
  },
  {
    name: 'framework',
    type: 'list',
    message: 'Enter your desired framework:',
    choices: [
      'Ionic',
      'Angular',
      'Starter',
    ],
    filter: (val)=> val.toLowerCase(),
  }
];
const questions2 = [
  {
    name: 'template',
    type: 'list',
    message: 'Enter your desired template:',
    choices: [
      'blank',
      'mean-ionic-ngrx',
    ],
    filter: (val) => val.toLowerCase()
  }
];

export const start = async (op_f:string, op_t:string):Promise<any> => {
    if(!op_f || !op_t){
      // select framework:
      return await inquirer
      .prompt(questions1)
      .then((res:{appname:string, framework:string})=>{
        if(res.framework === 'ionic'){
          // select Ionic template
          return inquirer
          .prompt(questions2)
          .then(t=> {
            return {...res, template:t.template}
          })
        }
        else if(res.framework === 'angular'){
          // select Angular template
          return {...res}
        }
        else {
          // no framework selected
          return {...res}
        }
      })
      .then(async (res:{appname:string, framework:string, template:string})=> {
        // install Ionic App
        if(res.framework === 'ionic' && res.template && res.appname){
          return await ionic.install.init(res)
        }
        if(res.framework === 'angular' && res.template && res.appname){
          // install Angular App
          return {success:false, error:'[ERROR] Starter Angular currently not available.'}
        }
        if(res.framework === 'starter' && res.appname /*&& res.template */){
          //spawn(build(program.args[2]), program.args, { shell: true, stdio: 'inherit' });
          console.log('res.appname->', res.appname)

          return await starter.install.init(res.appname)
          //return await starter.install(res.appname);
        }
        // not a valide framework
        else {
          return {success:false, error:`[ERROR] Not a valide framework: <${res.framework}> is not supported`}
        }
      })
    }
    else {
      // TODO: use option cmd
      return {success:false, error:`[ERROR] CLI currently not support start options. Use prompt installer with cmd $ npm start`}
    }

}
