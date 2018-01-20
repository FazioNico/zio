
import { InjectionToken } from "@angular/core";
import { IEnvironment } from "./env-model";

export let EnvVariables = new InjectionToken<IEnvironment>("env.variables");
