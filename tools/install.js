/**
* @Author: Nicolas Fazio <webmaster-fazio>
* @Date:   07-10-2017
* @Email:  contact@nicolasfazio.ch
* @Last modified by:   webmaster-fazio
* @Last modified time: 10-01-2018
*/

// Install Script v.0.0.1

var figlet = require('figlet');
const chalk = require('chalk');

"use strict";

installScript();

function installScript(){
  figlet('Zio Cli', (err, data)=> {
      if (err) {
          console.log('Something went wrong...');
          console.dir(err);
          return;
      }
      console.log(data)
      console.log('----------------------------------------------------------');
      console.log(chalk.white.bold('Welcome to Zio Cli App Starter'));
      console.log(chalk.white('Run cmd: $ zio -h '));
      console.log(chalk.white('To get more infos.'));
      console.log('----------------------------------------------------------');
  });

}
