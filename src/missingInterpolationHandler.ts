import { DewViewEngine } from './DewViewEngine';
import { AudioItem } from './DewViewEnginePlugin';
import { sample } from 'lodash';
import path from 'path';
import { urlJoin } from 'url-join-ts';

export function missingInterpolationHandler(this: any, text: string, keys: string[]) {
  let result;
  let lastKey;

  // Sample keys: ['{{name}}', 'name']
  for (const key of keys) {
    lastKey = key;
    if (!key.startsWith('{{')) {
      // check variables file for function named 'key'
      result = processAsVariable(this, key);
      if (result !== undefined) {
        break;
      }

      // check audios file for variables named 'key'
      result = processAsAudio(this, key);
      if (result !== undefined) {
        break;
      }
    }
  }

  if (result === undefined) {
    result = `[missing variable: ${lastKey}]`;
  }

  return result.toString();
}


function processAsVariable(plugin: DewViewEngine, key: string): any {
  if (plugin.viewVariables) {
    const func = (plugin.viewVariables as any)[key];
    if (func) {
      let result = func.call(plugin.viewVariables);
      let myValue;
      if (result.then) {
        result.then(
          (value: any) => {
            // console.log("processAsVariable test1");
            myValue = value;
          },
          () => {
            // console.log("processAsVariable test2");
          }
        );

        result = myValue;
      }

      return result;
    }
  }
}

function processAsAudio(plugin: DewViewEngine, key: string): string | undefined {
  if (plugin.audioItems) {
    const items: AudioItem[] = plugin.audioItems.filter((a) => a.variableName === key);
    if (items.length > 0) {
      const item = sample(items);

      if (item) {
        if (item.filename && item.filename !== '') {
          const baseUrl = plugin.config.audio?.baseUrl;
          const defaultExt = plugin.config.audio?.defaultExt ?? '.mp3';
          if (baseUrl) {
            const fullPath = getAudioFullPath(item, baseUrl, defaultExt);
            return `<audio src="${fullPath}" />`;
          }
        }

        if (item.text) {
          return item.text;
        }
      }
    }
  }

  return;
}

function getAudioFullPath(item: AudioItem, baseUrl: string, defaultExt: string): string {
  if (!item.filename) {
    return '';
  }

  const ext = path.extname(item.filename);
  const fileName = ext ? item.filename : item.filename + defaultExt;

  if (fileName.toLowerCase().startsWith('http')) {
    return fileName;
  }

  return urlJoin(baseUrl, fileName);
}
