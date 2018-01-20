#!/usr/bin/env node

/**
 * @Author: Nicolas Fazio <webmaster-fazio>
 * @Date:   10-01-2018
 * @Email:  contact@nicolasfazio.ch
 * @Last modified by:   webmaster-fazio
 * @Last modified time: 14-01-2018
 */

const git = require('simple-git/promise');

import * as utils from "../../utils";

export const install = {
  init: (config:{appname:string, framework:string, template:string})=>{
    if(config.framework !== 'ionic') return Promise.reject({success:false, error:`[ERROR] Not a valide framework: <${config.framework}> is not supported`});
    if(
      config.template === 'tabs'||
      config.template ==='blank'||
      config.template ==='sidemenu'
    ){
      return install.official(config)
    }
    else if(
      config.template === 'mean-ionic-ngrx'
    ) {
      return install.perso(config)
    }
    else {
      return Promise.reject({success:false, error: `[ERROR] This template not exist: <${config.template}>`})
    }
  },
  official: async (config)=> {
    console.log(`runing cmd: $ ionic start ${config.appname} ${config.template} `)
    // svn checkout "https://github.com/ionic-team/starters/trunk/angular/base"
    return await utils.runcmd(`ionic start ${config.appname} ${config.template} `,[])
      .then(res=> {
        return {success:true, ...config}
      })
      .catch(error=> {
        return {success:false, error}
      })
  },
  perso: async(config)=> {
    console.log(`runing cmd: $ git clone https://github.com/FazioNico/${config.template}.git`)
    utils.spinner.start();
    return await git()
      .silent(true)
      .clone(`https://github.com/FazioNico/${config.template}.git`)
      .then(status=> {
        utils.spinner.stop(true);
        return {success:true, ...config}
      })
      .catch(error=> {
        utils.spinner.stop(true);
        return {success:false, error}
      })
  }
}
