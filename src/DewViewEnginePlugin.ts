import {
  Extensible,
  PluginConfig,
  Plugin,
  HandleRequest,
  InvalidParentError,
} from '@jovotech/framework';
import { ViewVariablesConstructor } from './BaseViewVariables';
import { DewViewEngine } from './DewViewEngine';
import { BaseProcessor } from './processors';

export interface AudioResource {
  [language: string]: AudioItem[];
}

export interface AudioItem {
  variableName: string;
  text: string;
  filename?: string;
}

export interface ProcessorItems {
  [suffix: string]: BaseProcessor;
}

export interface AudioConfig {
  resources?: AudioResource;
  baseUrl?: string;
  fallbackLocale?: string;
  defaultExt: string;
}

export interface DewViewEnginePluginConfig extends PluginConfig {
  viewVariables?: ViewVariablesConstructor;
  audio?: AudioConfig;
  processors?: ProcessorItems;
}

export class DewViewEnginePlugin extends Plugin<DewViewEnginePluginConfig> {
  mount(parent: Extensible): Promise<void> | void {
    if (!(parent instanceof HandleRequest)) {
      throw new InvalidParentError(this.constructor.name, HandleRequest);
    }

    parent.middlewareCollection.use('dialogue.start', async (jovo) => {
      jovo.$dew = new DewViewEngine(this.config, jovo);
      await jovo.$dew.init();
    });
  }

  getDefaultConfig(): DewViewEnginePluginConfig {
    return {
      audio: {
        defaultExt: '.mp3',
      },
    };
  }
}
