# Cobra Framework Companion Plugin
Component framework for Nuxt 2 or Vue 2.


### Requirements
- Vue CLI or Nuxt
- Babel proposal optional chaining plugin


### Usage in Nuxt

Install framework dependencies
``` bash
$ npm install @this/cobra-framework-companion-plugin
```

Add module in nuxt.config.js
``` js
buildModules: [
    ['@this/cobra-framework-companion-plugin/nuxt'],
]
```

Add framework configuration and base styles to Nuxt in your main scss file.
The base and transitions folder are optional (not recommend)
``` scss
@import '@this/cobra-framework/src/theme/scss/framework';
@import '@this/cobra-framework/src/theme/scss/base/_import';
@import '@this/cobra-framework/src/theme/scss/transitions/_import';

```
