#!/usr/bin/env node

/**
* @Author: Nicolas Fazio <webmaster-fazio>
* @Date:   11-01-2018
* @Email:  contact@nicolasfazio.ch
 * @Last modified by:   webmaster-fazio
 * @Last modified time: 14-01-2018
*/

import { cat, mkdir } from "shelljs";
import * as inquirer from "inquirer";

import * as utils from "../utils";
import { CONFIG, appnameQuestion, frameworksQuestion, generatorsQuestion, templatesQuestion, optionsQuestion, nameQuestion } from "../config";
import * as IonicStart  from "./ionic/ionic.install";
import { IonicAdd } from "./ionic/ionic.add";
import { Init } from "./init";

export class CmdSwitcher {

    public cmd:string;
    public appname:string;
    public framework:string;
    public template:string;
    public generate:string;
    public option:string;

    constructor(cmd:string|any){
      // check if cmd existe
      if(!CONFIG.cmd.filter(c => c === cmd)){
        utils.displayError(`Unable to run cmd: $ ${(<any>cmd).toString()}`)
      }
      this.cmd = cmd.toString()
      // load prompt()
      this.startPrompt()
    }

    checkConfig(){
      let config = JSON.parse(cat('./zio.config.json'));
      if(
        CONFIG.frameworks.map(f=>f.toLowerCase())
                         .indexOf(config.framework.toString().toLowerCase()) <0
      ){
        utils.displayError(`Unable to run cmd. ${config.framework.toString()} is not supported.`)
      }
      this.framework = config.framework.toString()
    }

    async startPrompt(){
      // filter to the right questions
      if(this.cmd === 'start'){
        return await this.getStartQuestions()
      }
      if(this.cmd === 'add'){
        // find zio.config.json and extract project config
        if(!utils.fileExists('./zio.config.json')){
          new Init(true);
          return;
        }
        this.checkConfig()
        return await this.getAddQuestions()
      }
    }

    // install start script
    getStartQuestions(){
      return inquirer
      .prompt([appnameQuestion])
      .then(res=>{
        // set appname proprety
        this.appname = res.appname;
        return (!utils.fileExists('./zio.config.json'))
          ? inquirer.prompt([frameworksQuestion])
                    .then(res=> this.framework = res.framework)
          : null;

      })
      .then(res=> {
        // if framework === ionic: prompt templatesQuestion
        // for ionicframework
        return (this.framework === 'ionic')
          ? inquirer.prompt([templatesQuestion])
                    .then(res => {
                      // set template generator proprety
                      this.template = res.template
                    })
          : null;
      })
      .then(async _=> {
        // check if framework is define
        if(!this.framework) return Promise.reject('No framework selected...');
        // filter to run correct installer
        switch(true){
          case this.framework === 'ionic':
            // run ionic install
            return await IonicStart.install.init({
              appname: this.appname,
              framework: this.framework,
              template:this.template
            }).then(res =>{
              new Init(true,this.appname, 'ionic')
            });
            // mkdir('-p', this.appname) // for debug
            // mkdir('-p', this.appname+'/src') // for debug
            // new Init(true,this.appname, 'ionic') // for debug
            // return Promise.resolve({success:true}) // for debug
          case this.framework === 'angular':
            return Promise.reject('Angular is currently not supported...')
        }
        // if is not pass by switch
        return Promise.reject(this.framework + ' is currently not supported...')
      })
      .catch(error=> {
        // display error deh
        utils.displayError(error)
      })
    }

    getAddQuestions(){
      return inquirer
      .prompt([generatorsQuestion(this.framework)])
      .then(res => {
        // set generate element
        this.generate = res.generators
        return inquirer.prompt([optionsQuestion])
      })
      .then(res => {
        // set options
        this.option = res.options
        return inquirer.prompt([nameQuestion])
      })
      .then(res=>{
        // filter to run correct installer
        switch(true){
          case this.framework === 'ionic':
            // run ionic add element
            return new IonicAdd({
              //framework: this.framework,
              name:res.name,
              generate:this.generate,
              option: this.option
            });
          case this.framework === 'angular':
            return Promise.reject('Angular is currently not supported...')
        }

      })
      .catch(error=> {
        // display error deh
        utils.displayError(error)
      })
    }
}
