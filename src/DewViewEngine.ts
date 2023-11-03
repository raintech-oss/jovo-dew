import { DependencyInjector, Jovo, OutputTemplate } from '@jovotech/framework';
import { BaseViewVariables, ViewVariablesConstructor } from './BaseViewVariables';
import { AudioItem, DewViewEnginePluginConfig } from './DewViewEnginePlugin';
import { missingInterpolationHandler } from './missingInterpolationHandler';
import { OutputProcessor, ViewVariablesProcessor } from './processors';

export const Suffix = {
  Message: 'message',
  Reprompt: 'reprompt',
  Listen: 'listen',
  QuickReplies: 'quickReplies',
  Card: 'card',
  Carousel: 'carousel',
  ViewVariables: 'vv',
  Platforms: 'platforms',
  APL: 'apl',
}

export class DewViewEngine {
  processors: any;
  data: Record<string, any>;
  audioItems: AudioItem[];
  viewVariables?: BaseViewVariables;
  private i18nOptions: unknown;
  private _returnResourcePathKeysOnly: string[];

  constructor(readonly config: DewViewEnginePluginConfig, readonly jovo: Jovo) {
    this.processors = {};
    this.data = {};
    this.audioItems = [];
    this.i18nOptions = { missingInterpolationHandler: missingInterpolationHandler.bind(this) };
    this._returnResourcePathKeysOnly = [];

    const outputProcessor = new OutputProcessor(this, jovo);
    const viewVariablesProcessor = new ViewVariablesProcessor(this, jovo);


    this.registerProcessor(Suffix.Message, outputProcessor);
    this.registerProcessor(Suffix.Reprompt, outputProcessor);
    this.registerProcessor(Suffix.Listen, outputProcessor);
    this.registerProcessor(Suffix.QuickReplies, outputProcessor);
    this.registerProcessor(Suffix.Card, outputProcessor);
    this.registerProcessor(Suffix.Carousel, outputProcessor);

    this.registerProcessor(Suffix.ViewVariables, viewVariablesProcessor);
    this.registerProcessor(Suffix.Platforms, viewVariablesProcessor);
    this.registerProcessor(Suffix.APL, viewVariablesProcessor);

    this.audioItems = this.getAudioItems();
  }

  async init() {
    if (this.config.viewVariables) {
      this.viewVariables = await this.instantiateViewVariables(this.jovo);
    }
  }

  public get returnResourcePathKeysOnly(): string[] {
    return this._returnResourcePathKeysOnly;
  }

  public set returnResourcePathKeysOnly(value: string[]) {
    this._returnResourcePathKeysOnly = value;
  }

  private getAudioItems(): AudioItem[] {
    const requestLocale = this.jovo.$request.getLocale();
    const locale = requestLocale ? requestLocale : this.config.audio?.fallbackLocale;
    const fallbackLocale = this.config.audio?.fallbackLocale;

    let audioResources =
      requestLocale && this.config?.audio?.resources
        ? this.config.audio.resources[requestLocale]
        : undefined;

    if (!audioResources) {
      audioResources =
        fallbackLocale && this.config?.audio?.resources
          ? this.config.audio.resources[fallbackLocale]
          : undefined;
    }

    if (!audioResources) {
      throw new Error(
        `No audio resources for locale '${locale}' and audio.fallbackLocale is not found.`,
      );
    }

    return audioResources;
  }

  private async instantiateViewVariables(jovo: Jovo): Promise<BaseViewVariables> {
    return await DependencyInjector.instantiateClass(
      jovo,
      this.config.viewVariables as ViewVariablesConstructor,
      jovo);
  }

  registerProcessor(name: string, processor: any) {
    this.processors[name] = processor;
  }

  getOutput(path: string | string[]): OutputTemplate[] {
    const paths = Array.isArray(path) ? path : [path];
    const outputs: OutputTemplate[] = [];
    const data = Object.assign({}, this.data, this.i18nOptions);

    for (const path of paths) {
      const obj = this.jovo.$t(path, { skipInterpolation: true });
      const keys = Object.keys(obj);

      let output: OutputTemplate = {};

      for (const key of keys) {
        if (this.processors[key]) {
          const result = this.processors[key].process(key, obj, path, data);
          output = Object.assign({}, output, result);
        }
      }
      outputs.push(output);
    }

    return outputs;
  }
}
