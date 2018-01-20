#!/usr/bin/env node

/**
* @Author: Nicolas Fazio <webmaster-fazio>
* @Date:   09-01-2018
* @Email:  contact@nicolasfazio.ch
* @Last modified by:   webmaster-fazio
* @Last modified time: 10-01-2018
*/

// import { cp, mkdir, cd } from "shelljs";
// import * as path from "path";
// import * as figlet from "figlet";
// import * as chalk from "chalk";
// import { execSync } from "child_process";
// import * as spawn from "cross-spawn";
// import * as fs from "fs";
//
// function shouldUseYarn() {
//   try {
//     execSync('yarnpkg --version', { stdio: 'ignore' });
//     return true;
//   } catch (e) {
//     return false;
//   }
// }
//
// const installPackages = (appname:string):Promise<{success:boolean, appname?:string}> => {
//   console.log(chalk.white.bold('Installing Packages for '+ appname));
//   return new Promise((resolve, reject) => {
//     let command:string;
//     let args:string[] = ['install'];
//     if (shouldUseYarn()) {
//       command = 'yarn';
//     } else {
//       command = 'npm';
//     }
//     const child = spawn(command, args, { stdio: 'inherit' });
//     child.on('close', code => {
//       if (code !== 0) {
//         reject({
//           command: `${command} ${args.join(' ')}`
//         });
//         return;
//       }
//       resolve( {success:true, appname});
//     })
//   })
// }
//
// export const install =  {
//   init: (appname:string)=>{
//     cp('-r', __dirname + '/../../../starters/.', appname);
//     console.log('----------------------------------------------------------');
//     return install.print(appname)
//                   .then(appname => {
//                     cd(appname);
//                     return appname
//                   })
//                   .then( (appname) =>installPackages(appname))
//                   // .then(_=> {
//                   //   return spawn(, program.args, { shell: true, stdio: 'inherit' })
//                   // })
//                   .catch(error=> {
//                     return {success:false, error}
//                   });
//   },
//
//   print: (appname:string):Promise<string>=> {
//     return new Promise((resolve,reject)=> {
//        figlet('Zio Cli', (err,data)=> {
//        if (err) {
//          console.log('figlet err--->',err);
//          return reject('err');
//        }
//        console.log(data);
//        console.log('----------------------------------------------------------');
//        console.log(chalk.white.bold('Welcome to Zio'));
//        console.log(chalk.white('building '+ appname));
//        console.log('----------------------------------------------------------');
//        return resolve(appname)
//      })
//     })
//
//   }
// }
