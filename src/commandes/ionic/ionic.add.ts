#!/usr/bin/env node

/**
 * @Author: Nicolas Fazio <webmaster-fazio>
 * @Date:   11-01-2018
 * @Email:  contact@nicolasfazio.ch
 * @Last modified by:   webmaster-fazio
 * @Last modified time: 16-01-2018
 */

import { cp, sed, mv, find, rm, test, mkdir, cat, to, echo } from "shelljs";
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

      let doInstallCoreModule = false;
      if(this.options.length>0){
        this.options.forEach( o=> {
          let folder = `./src/${(o ==='ngrx')?'store':o}`;
            if(!utils.directoryExists(folder)){
              doInstallCoreModule = true;
            }
        })
      }
      this.install(doInstallCoreModule)
    }

    install(doCoreModule:boolean){
      utils.spinner.start();
      this.copyBaseFoders()
      this.applyOption()
      this.renameFiles()
      utils.spinner.stop(true);
      // install core modules
      (doCoreModule)
      ? this.installCoreModule()
            .then(_=>this.displaySuccess())
            .catch(err=> utils.displayError(err.toString()))
      : this.displaySuccess();
    }

    async installCoreModule(){
      utils.spinner.start();
      this.options.forEach(async o => {
        let oFolder = (o ==='ngrx')?'store':o;
        let folder = `${ZIO_DIR.STARTER_IONIC}/base/src/${oFolder}`;
        console.log(chalk.yellow(`[WARNING]`) + chalk.white(` Core module ${chalk.bold(o)} not existe. `))
        console.log(chalk.white(`[INFO]`) + chalk.white(` Installing core module ${chalk.bold(o)} .... `))
        cp('-r', folder, `src/${oFolder}`);
        // install all npm package dependecies
        await this.installCorePackages(o)
              .then(res=> {
                console.log(chalk.white(''));
                console.log(chalk.green('[SUCCESS] ') + chalk.white.bold(o) + chalk.white( ` packages added. `));
                return res
              })
              .then((res:any)=> {
                if(!res.success)return;
                utils.spinner.stop(true);
                this.importCoreToAppModule(oFolder)
              })
              .catch(err=> utils.displayError(err.toString()))


      });

      // TODO: add to app.module.ts import module + declartion

    }

    installCorePackages(option:string){
      console.log(chalk.white('[INFO] Add Packages for '+ chalk.white.bold(option) +' ... '));
      switch(true){
        case option === 'ngrx':
          return utils.addPackages({
            dep:['@ngrx/effects', '@ngrx/store', '@ngrx/store-devtools','ngrx-store-freeze'],
            devdep: ['ngrx-store-freeze', '@ngrx/store-devtools']
          });
        case option === 'i18n':
          return utils.addPackages({
            dep:['@ngx-translate/core', '@ngx-translate/http-loader'],
            devdep: ['']
          });
      }
    }

    importCoreToAppModule(f:string){
      let datas = {
        store: {
          imp: `
  // Import ngrx Tools
  import { NgRxStoreModule } from "../store/store.module";
          `,
          ngImp: `
  @NgModule({
    ...
    imports: [
      ...
      NgRxStoreModule.forRoot(), // import AppCore NgRxStoreModule before IonicModule.forRoot()
      IonicModule.forRoot(MyApp)
    ],
    ...
          `,
        },
        i18n: {
          imp: `
  // Import i18n translate module
  import { I18nModule} from "../i18n/i18n.module";
          `,
          ngImp: `
  @NgModule({
    ...
    imports: [
      ...
      I18nModule.forRoot(), // import i18n module before IonicModule.forRoot()
      IonicModule.forRoot(MyApp)
    ],
    ...
          `
        }
      };

      console.log(chalk.green(`[SUCCESS]`) + chalk.white(` Create core ${chalk.bold(f)} module`))
      console.log(chalk.white('[IMPORTANT]') + chalk.white(` Do not forget to add the following content to your ${chalk.bold('./src/app/app.module.ts')}`));
      console.log('')
      console.log(chalk.cyan(datas[f].imp))
      console.log(chalk.cyan(datas[f].ngImp))
      console.log('----------------------------------------------------------');
      //execSync(`find . -name 'app.module*' -exec sed '-i' '' 's/@NgModule({/${imp}/g' {} \\;`);

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
