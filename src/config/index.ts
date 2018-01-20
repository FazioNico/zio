/**
* @Author: Nicolas Fazio <webmaster-fazio>
* @Date:   11-01-2018
* @Email:  contact@nicolasfazio.ch
 * @Last modified by:   webmaster-fazio
 * @Last modified time: 14-01-2018
*/

import * as path from "path";

export const ZIO_DIR = {
  STARTER: path.resolve(__dirname, '../../starters'),
  STARTER_IONIC: path.resolve(__dirname, '../../starters/ionic'),
  STARTER_ANGULAR: path.resolve(__dirname, '../../starters/angular'),
};

export const CONFIG = {
  cmd: ['start', 'add'],
  frameworks: [
    //'Angular',
    'Ionic',
  ],
  generators: {
    ionic:[
      //'component', 'provider',
      'pages module',
      'environment module',
      //'module'
    ]
  },
  options: [
    {name:'ngrx'},
    {name:'i18n'}
  ]
}

/**
 * CLI PROMPT QUESTIONS
 */
export const appnameQuestion = {
  name: 'appname',
  type: 'input',
  message: 'Enter your Application Name:',
  validate: ( value ) => (value.length)
  ? true
  :'Please enter a name for your application',
}
export const frameworksQuestion =   {
  name: 'framework',
  type: 'list',
  message: 'Enter your desired framework:',
  choices: [...CONFIG.frameworks],
  filter: (val)=> val.toLowerCase(),
}

export const generatorsQuestion = (framework)=>{
  return (!CONFIG.generators[framework])
    ? {}
    : {
      name: 'generators',
      type: 'list',
      message: 'Select want you want generate:',
      choices: [...CONFIG.generators[framework]],
      filter: (val)=> val.toLowerCase(),
    };
}

export const templatesQuestion = {
  name: 'template',
  type: 'list',
  message: 'Enter your desired template:',
  choices: [
    'blank',
    'mean-ionic-ngrx',
  ],
  filter: (val) => val.toLowerCase()
}

export const optionsQuestion = {
  name: 'options',
  type: 'checkbox',
  message: 'Enter your desired option:',
  choices: [...CONFIG.options],
  filter: (val) => val.map(v=> v.toLowerCase())
}

export const nameQuestion = {
  name: 'name',
  type: 'input',
  message: 'Wich name (PascalCase):',
  validate: ( value ) => (value.length)
  ? true
  :'Please enter a name for your element',
}
