
import { IEnvironment } from "./env-model";

export const prodVariables:IEnvironment = {
  environmentName: 'Production Environment',
  ionicEnvName: 'prod',

  // TODO: Change wuth your own prod environment variable
  // and add file to .gitignore
  // Front-end
  apiEndpoint: 'http://localhost:8080',
};
