# Dew View Engine

Dew simplifies the creation of voice applications by adding a view engine to your handler code.

## Introduction



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
      viewVariables: new ViewVariables(),
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
- `audio`: Configuration values for audio audio variables using in output text. See [Audio Variables](#audio-variables) for more information.

## View Variables

Here is a sample `ViewVariables.ts` file:

```typescript
import { BaseViewVariables } from '@raintech-oss/jovo-dew';

export class ViewVariables extends BaseViewVariables {
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

If the output text includes the following `"Welcome back {{pause}} to {{fullName}}"`, the Dew view engine will check ViewVar

## Audio Variables











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

## Jovo Debugger
If using the Jovo Debugger, you must add `$dew` to the list of properties the debugger ignores:

```ts
// app.dev.ts

new JovoDebugger({
  ignoredProperties: ['$app', '$handleRequest', '$platform', '$dew'],
}),
```