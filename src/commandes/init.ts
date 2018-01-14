/**
 * @Author: Nicolas Fazio <webmaster-fazio>
 * @Date:   13-01-2018
 * @Email:  contact@nicolasfazio.ch
 * @Last modified by:   webmaster-fazio
 * @Last modified time: 14-01-2018
 */

import { cp, sed } from "shelljs";
import * as inquirer from "inquirer";
import * as figlet from "figlet";
import * as chalk from "chalk";

import { frameworksQuestion, ZIO_DIR } from "../config";
import { displayError } from "../utils";

export class Init {
    constructor(autocall = false){
      console.log('----------------------------------------------------------');
      if(autocall) {
        console.log(
          chalk.white('[INFO] config file ') +
          chalk.white.bold('zio.config.json') +
          chalk.white(' not found! ')
        );
        console.log(chalk.white('[INFO] Auto init Zio Cli by runing ') + chalk.white.bold('$ zio init'));
      }
      else {
        console.log(chalk.white('[INFO] Create zio.config.json files '));
      }
      console.log('----------------------------------------------------------');

      this.askQuestions()
        .then(config=>this.createFileConfig(config))
        .then(_=>{
          figlet('Zio Cli', (err,data)=> {
            if (err) {
              console.log('figlet err--->',err);
              displayError(err.toSring())
            }
            console.log('----------------------------------------------------------');
            console.log(data);
            console.log(chalk.white.bold('🔥🔥🔥 Welcome to Zio Cli 🔥🔥🔥'));
            console.log('')
            console.log(chalk.white('Now you can use it to speed up application developpement!'));
            console.log(
              chalk.white('Next step: run ')+
              chalk.white.bold('$ zio start')+
              chalk.white(' or ')+
              chalk.white.bold('$ zio add')+
              chalk.white(' into your console to create elements.')
            );
            console.log('')
            console.log('----------------------------------------------------------');
            return
          })
        })
    }
    askQuestions(){
      return inquirer
      .prompt([frameworksQuestion])
      .then(res=>res.framework)
    }

    createFileConfig(config:string){
      cp('-n', ZIO_DIR.STARTER+'/zio.config.json', 'zio.config.json')
      sed('-i', 'starter', config, 'zio.config.json');
    }
}
