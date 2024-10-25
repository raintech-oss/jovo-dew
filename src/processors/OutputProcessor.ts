import { Jovo } from '@jovotech/framework';
import { DewViewEngine } from '../DewViewEngine';
import { set } from 'lodash';
import { BaseProcessor } from './BaseProcessor';

export class OutputProcessor extends BaseProcessor {
  constructor(readonly plugin: DewViewEngine, readonly jovo: Jovo) {
    super(plugin, jovo);
  }

  process(key: string, obj: unknown, viewPath: string, data: unknown): unknown {
    // console.log({ key, obj, viewPath });

    const response = {};
    let value = this.jovo.$t(`${viewPath}.${key}`, data as any);

    if (this.plugin.returnResourcePathKeysOnly.includes(key)) {
      // overwrite value with path
      value = `${viewPath}.${key}`;
    }
    
    set(response, key, value);

    return response;
  }
}
