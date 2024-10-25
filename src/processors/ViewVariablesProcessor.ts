import { Jovo } from '@jovotech/framework';
import { DewViewEngine } from '../DewViewEngine';
import { BaseProcessor } from './BaseProcessor';

export class ViewVariablesProcessor extends BaseProcessor {
  constructor(readonly plugin: DewViewEngine, readonly jovo: Jovo) {
    super(plugin, jovo);
  }

  process(key: string, obj: unknown, viewPath: string, data: unknown): unknown {
    // console.log({ key, obj, viewPath });

    if (!this.plugin.config.viewVariables) {
      throw new Error(`No viewVariables configured for 'DewViewEnginePlugin'`);
    }

    const funcName = this.jovo.$t(`${viewPath}.${key}`, data as any);
    const func = (this.plugin.viewVariables as any)[funcName];
    
    if (func) {
      const value = func.call(this.plugin.viewVariables);
      return value;
    }
    
    return { error: `[missing '${funcName}()' function in ViewVariables]`};
  }
}
