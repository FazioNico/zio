#!/usr/bin/env node

/**
* @Author: Nicolas Fazio <webmaster-fazio>
* @Date:   09-01-2018
* @Email:  contact@nicolasfazio.ch
* @Last modified by:   webmaster-fazio
* @Last modified time: 10-01-2018
*/

import { spawn } from "child_process";
import * as fs from "fs";
import * as path from "path";
import * as Inquirer from "inquirer";

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
