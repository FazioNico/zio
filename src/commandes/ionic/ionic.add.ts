#!/usr/bin/env node

/**
 * @Author: Nicolas Fazio <webmaster-fazio>
 * @Date:   11-01-2018
 * @Email:  contact@nicolasfazio.ch
 * @Last modified by:   webmaster-fazio
 * @Last modified time: 14-01-2018
 */

import { cp, sed, mv, find, rm, test, mkdir } from "shelljs";
import * as chalk from "chalk";
import { execSync } from "child_process";
import * as inquirer from "inquirer";

import { ZIO_DIR } from "../../config";
import * as utils from "../../utils";

export class IonicAdd {

    public nameSc:string // slug-case
    public namePc:string // PascalCase
    public generate:string
    public options:string[]

    constructor(config){
      this.nameSc = utils.slugCase(config.name);
      this.namePc = utils.pascalCase(config.name)
      this.generate = config.generate;
      this.options = config.option;
      //console.log('config->', config)
      //console.log('copyFoders-> ', __dirname+ '../../../starters' )
      let generate = (this.generate.includes(' '))
                        ? this.generate.split(' ')[0]
                        : this.generate;
      let folder =  `./src/${generate}/${this.nameSc}`

      // check if directoryExists
      if(utils.directoryExists(folder)) {
        utils.displayError(`"${this.nameSc}" folder already existe.`);
        return
      }
      // if have options, check if have existing
      // core module for each options
      let doCoreModule = false;
      if(this.options.length>0){
        this.options.forEach(o => {
            // check if have core module for each option
            let folder = `./src/${(o ==='ngrx')?'store':o}`;
            if(!utils.directoryExists(folder)){
              // toggle to true
              doCoreModule = true;
              console.log(chalk.yellow('[WARNING]') + chalk.white(` You need corresponding core module to use option ${o}.`));
              inquirer.prompt([{
                type: 'confirm',
                name: 'installCore',
                message: `Want to install ${o} core module ??(just hit enter for YES)?`,
                default: true
              }])
              .then(res=> {
                if(!res.installCore){
                  console.log('[EXIT] End of process.')
                  doCoreModule = false;
                  return;
                }
                // toggle to true
                this.installCoreModule(true)
              })
              return
            }
        });
      }
      if(doCoreModule){
        return;
      }
      this.install()
    }

    install(){
      console.log(chalk.white('[INFO]') + ' install ...')
      utils.spinner.start();
      this.copyBaseFoders()
      this.applyOption()
      this.renameFiles()
      utils.spinner.stop(true)
      this.displaySuccess()
    }

    installCoreModule(isInstall:boolean=false){
      utils.spinner.start();
      this.options.forEach(o => {
        let oFolder = (o ==='ngrx')?'store':o;
        let folder = `${ZIO_DIR.STARTER_IONIC}/base/src/${oFolder}`;
        cp('-r', folder, `src/store`);
        // TODO: install all npm package dependecies
        // and remove package.json installer
        // TODO: add to app.module.ts import module + declartion
      });
      utils.spinner.stop(true);
      (isInstall)
        ? this.install()
        : null;
    }

    copyBaseFoders(){
      //console.log('copyFoders-> ', __dirname+ '../../../starters' )
      let generate = (this.generate.includes(' '))
                        ? this.generate.split(' ')[0]
                        : this.generate;
      let folder =  `${ZIO_DIR.STARTER_IONIC}/base/src/${generate}/starter`
      // check if ${generate} folder existe before copy content.
      if (!test('-d', `src/${generate}`)){
        mkdir('-p', `src/${generate}`)
      }
      if (test('-d', `src/${generate}/${this.nameSc}`)){
        utils.displayError(`Cannot create element. Directory name already existe: "./src/${generate}/${this.nameSc}"`)
        return
      }
      cp('-r', folder, `src/${generate}/${this.nameSc}`);
      console.log('----------------------------------------------------------');
    }

    applyOption(){
      let generate = (this.generate.includes(' '))
                        ? this.generate.split(' ')[0]
                        : this.generate;
      // search in all starter files and remove i18n elements
      if(this.options.indexOf('i18n')<0) {
        execSync(`find . -name 'starter*.ts' -exec sed -i '' '/\\/# BOF_i18n/,/\\/# EOF_i18n/ d' {} \\;`);
        // remove i18n files & folder
        rm('-rf', `src/${generate}/${this.nameSc}/i18n`);
      }
      // // search in all starter files and remove ngrx elements
      if (this.options.indexOf('ngrx')<0) {
        execSync(`find . -name 'starter*.ts' -exec sed -i '' '/\\/# BOF_ngrx/,/\\/# EOF_ngrx/ d' {} \\;`);
        // remove ngrx store files & folder
        rm('-rf', `src/${generate}/${this.nameSc}/store`);
      }
      // remove all CLI tags like BOF_ and EOF_
      find('./src/**/starter*')
        .map(f=>{
          if(f.includes('starter.') === -1) return f;
          // delete line with tags..
          sed('-i', /^.*BOF_.*$/, '', f);
          sed('-i', /^.*EOF_.*$/, '', f);
          return f
        })
    }

    renameFiles(){
      // rename files name in content text files
      execSync(`find . -name 'starter*' -exec sed -i '' s/starter/${this.nameSc}/g {} \\;`); // OK
      execSync(`find . -name 'starter*' -exec sed -i '' s/Starter/${this.namePc}/g {} \\;`); // OK
      //execSync(`find . -name 'starter*' -exec sed -i '' s/Starter/${this.name.charAt(0).toUpperCase()+this.name.slice(1)}/g {} \\;`); // OK

      find('./src/**/starter*')
        .map(f=>{
          if(f.includes('starter.') === -1) return f;
          // rename files name with ${this.name} in place of 'starter'
          let dest = f.replace("starter", this.nameSc)
          mv('-n', f, dest)
          return f
        })
    }

    displaySuccess(){
      console.log(chalk.green('[SUCCESS]') + chalk.white(` ${this.namePc} elements created successfully!`))
    }
}
