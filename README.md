# Dew View Engine

Dew simplifies the creation of voice and bot applications by adding a view engine to your handler code.

## Installation

You can install the plugin like this:

```sh
$ npm install @raintech-oss/jovo-dew
```

Add this plugin to the root list of plugins in [`app.ts`](https://www.jovo.tech/docs/app-config):

```typescript
import { App } from '@jovotech/framework';
import { DewViewEnginePlugin } from '@raintech-oss/jovo-dew';
// ...

const app = new App({
  plugins: [
    new DewViewEnginePlugin({ /* ... */}),
    // ...
  ],
});
```

Dew makes use of translations for [i18n](https://www.jovo.tech/docs/i18n) so the project must include them. This can be added to i18n in [`app.ts`](https://www.jovo.tech/docs/app-config):

```typescript
import { App } from '@jovotech/framework';
// ...

const app = new App({
  i18n: {
    resources: {
      en,
    },
  },
  // ...
});
```

And there needs to be a corresponding file at `src\i18n\en.json`.

## Configuration

The following configurations can be added:

```typescript
import { App } from '@jovotech/framework';
import { DewViewEnginePlugin } from '@raintech-oss/jovo-dew';
import audiosEn from './content/en/audios-file.json';
import { ViewVariables } from './ViewVariables';
// ...

const app = new App({
  plugins: [
    new DewViewEnginePlugin({
      viewVariables: ViewVariables(),
      audio: {
        resources: {
          en: audiosEn,
        },
        baseUrl: 'https://example.com/assets',
        fallbackLocale: 'en',
        defaultExt: '.mp3',
      },
    }),
    // ...
  ],
});
```

- `viewVariables`: Object whose methods are called based on variables that need to be filled in output text. See [View Variables](#view-variables) for more information.
- `audio`: Configuration values for audio variables used in output text. See [Audio Variables](#audio-variables) for more information.

## View Variables

Here is a sample `ViewVariables.ts` file:

```typescript
import { BaseViewVariables } from '@raintech-oss/jovo-dew';

export class ViewVariables extends BaseViewVariables {
  constructor(jovo: Jovo) {
    super(jovo);
  }
    
  blank(): string {
    return ' ';
  }

  pause(): string {
    return '<break time="500ms"/>';
  }

  fullName(): string {
    return this.jovo.$session.data.fullName;
  }
}
```

If the output text includes `{{placeholders}}` as in `"Welcome back {{pause}} to {{fullName}}"`, the Dew view engine will try to fill those placeholders in the following order:
1. from a value added to `this.$dew.data.myKey`
2. function in [ViewVariables.ts](./test/ViewVariablesClassic.ts) named the same as the placeholder
3. constructed audio URL from audio resource [audios-file.json](./test/audios-file.json) where placeholder matches `variableName`.
4. if `filename` property in [audios-file.json](./test/audios-file.json) is empty, the value from the `text` property is used.
5. if still no match, the placeholder is replaced with a message that identifies the missing variable definition: `[missing variable: myValue]`

## Audio Variables

This feature allows for output to include audio files during production and use the `text` value during development when audio files are not yet available.

The audio variables file (ex: audios-file.json) is in the following format:

```json
[
  {
    "variableName": "sfx_success",
    "filename": "success",
    "text": "Submitted."
  }
]
```

The fields are:
- `variableName` - matches the placeholder in the output text
- `filename` - used with the other values in the plugin config `audio` section to construct an audio URL: `https://example.com/assets/success.mp3`
- `text` - if the `filename` property is missing or empty, use this value

## Usage

To access the Dew methods and properties, use this in a handler:

```typescript
this.$dew
```

Here is a sample handler:

```typescript
LAUNCH() {
  this.$dew.data.name = 'Mark';

  const outputs = this.$dew.getOutput(['Launch.WelcomeBack', 'SFX.Success', 'WhatNext']);
  return this.$send(outputs);
}
```

The power of Dew is the nested structure of the `src\i18n\en.json` file. Notice how the `"WhatNext"` path groups a `message` and a `reprompt` and that a single call to `this.$dew.getOutput(['WhatNext']);` includes both values in the output.

```json
{
  "translation": {
    "Launch": {
      "Welcome": {
        "message": "Welcome, {{fullName}}."
      },
      "WelcomeBack": {
        "message": "Welcome back {{name}}."
      }
    },
    "SFX": {
      "Success": {
        "message": {
          "speech": "{{sfx_success}}",
          "text": "Item submitted."
        }
      }
    },
    "WhatNext": {
      "message": "What next?",
      "reprompt": "What do you want to do next?"
    },
    "Goodbye": {
      "message": "See you next time.",
      "listen": false
    }
  }
}
```

From the outside-in, there can be multiple nesting levels (usually 1 or 2) which acts at the path to identify the output. This is what is used in the `$dew.getOutput` array parameter.

The next level matches the names of [Generic Output Elements](https://www.jovo.tech/docs/output-templates#generic-output-elements) or custom keys:
- `message` (Jovo Output) - set to [string, string[] or object](https://www.jovo.tech/docs/output-templates#message)
- `reprompt` (Jovo Output) - set to [string, string[] or object](https://www.jovo.tech/docs/output-templates#reprompt)
- `listen` (Jovo Output) - set to [boolean or object](https://www.jovo.tech/docs/output-templates#listen)
- `quickReplies` (Jovo Output) - set to [string[] or object[]](https://www.jovo.tech/docs/output-templates#quickreplies)
- `card` (Jovo Output) - set to [object](https://www.jovo.tech/docs/output-templates#card)
- `carousel` (Jovo Output) - set to [object](https://www.jovo.tech/docs/output-templates#carousel)
- `vv` (Custom) - set to function name in `ViewVariables` (`vv` is short for ViewVariables)
- `platforms` (Custom) - set to function name in `ViewVariables` 
- `apl` (Custom) - set to function name in `ViewVariables`

When resolving using a function in `ViewVariables`, return an output template as described in [Output Templates](https://www.jovo.tech/docs/output-templates):

```ts
// ViewVariables.ts
myOutput(): OutputTemplate {
    return {
        platforms: {
            core: {
                nativeResponse: {
                    custom: {
                        key: 'value1',
                    },
                },
            },
        },
        card: {
          title: this.jovo.$t('cards.card1.title'),
          content: this.jovo.$t('cards.card1.content'),
          subtitle: 'sub title',
          imageUrl: 'https://www.fillmurray.com/200/300',
          imageAlt: 'Fill Murray',
        },        
    };
}
```
