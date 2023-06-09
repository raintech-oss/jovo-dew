import { DewViewEngine } from './DewViewEngine';

declare module '@jovotech/framework/dist/types/Jovo' {
  interface Jovo {
    $dew: DewViewEngine;
  }
}

export * from './DewViewEngine';
export * from './DewViewEnginePlugin';
export * from './BaseViewVariables';
export * from './processors';
