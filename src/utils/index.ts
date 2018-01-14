#!/usr/bin/env node

/**
* @Author: Nicolas Fazio <webmaster-fazio>
* @Date:   09-01-2018
* @Email:  contact@nicolasfazio.ch
 * @Last modified by:   webmaster-fazio
 * @Last modified time: 14-01-2018
*/

import { spawn, execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";
import * as Inquirer from "inquirer";
import * as chalk from "chalk";
import * as toSlugCase from "to-slug-case"
import * as toPascalCase from "to-pascal-case"
import * as CliSpinner from "cli-spinner";

function shouldUseYarn() {
  try {
    execSync('yarnpkg --version', { stdio: 'ignore' });
    return true;
  } catch (e) {
    return false;
  }
}

const installPackages = (appname:string):Promise<{success:boolean, appname?:string}> => {
  console.log(chalk.white.bold('Installing Packages for '+ appname));
  return new Promise((resolve, reject) => {
    let command:string;
    let args:string[] = ['install'];
    if (shouldUseYarn()) {
      command = 'yarn';
    } else {
      command = 'npm';
    }
    const child = spawn(command, args, { stdio: 'inherit' });
    child.on('close', code => {
      if (code !== 0) {
        reject({
          command: `${command} ${args.join(' ')}`
        });
        return;
      }
      resolve( {success:true, appname});
    })
  })
}

export function getCurrentDirectoryBase():string {
  return path.basename(process.cwd());
}
export function directoryExists(filePath) {
  try {
    return fs.statSync(filePath).isDirectory();
  } catch (err) {
    return false;
  }
}

export function fileExists(filePath) {
  try {
    if(fs.statSync(filePath)){
      return true
    }
    else {
      return false
    }
  } catch (err) {
    return false;
  }
}
export function runcmd(command: string, args?: string[]): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const p = spawn(command, args, { shell: true, stdio: 'inherit' });

    const stdoutbufs: Buffer[] = [];
    const stderrbufs: Buffer[] = [];

    if (p.stdout) {
      p.stdout.on('data', chunk => {
        if (Buffer.isBuffer(chunk)) {
          console.log('Buffer.isBuffer...')
          stdoutbufs.push(chunk);
        } else {
          console.log('Buffer.from(chunk)...')
          stdoutbufs.push(Buffer.from(chunk));
        }
      });
    }

    if (p.stderr) {
      p.stderr.on('data', chunk => {
        if (Buffer.isBuffer(chunk)) {
          console.log('Buffer.isBuffer(chunk)...')
          stderrbufs.push(chunk);
        } else {
          console.log('Buffer.from(chunk)...')
          stderrbufs.push(Buffer.from(chunk));
        }
      });
    }

    p.on('error', err => {
      console.log('p.on(error)...')
      reject(err);
    });

    p.on('close', code => {
      console.log('p.on(close)...', code)
      const stdout = Buffer.concat(stdoutbufs).toString();
      const stderr = Buffer.concat(stderrbufs).toString();

      if (code === 0) {
        resolve(stdout);
      } else {
        reject(new Error(stderr));
      }
    });
  });
}

export function displayError(message:string){
  console.log(chalk.red('[ERROR] ', message));
  // program.outputHelp(chalk.white)
  process.exit(1);
}

export const spinner = (()=> {
  const s = new CliSpinner.Spinner('processing.. %s');
  return s.setSpinnerString('|/-\\');
})();

export const slugCase = (txt:string):string=>{
  return toSlugCase(txt)
}

export const pascalCase = (txt:string):string=>{
  return toPascalCase(txt)
}
