---
id: static-type-checking
title: Статична типізація
permalink: docs/static-type-checking.html
prev: typechecking-with-proptypes.html
next: refs-and-the-dom.html
---

Статичні типізатори, такі як [Flow](https://flow.org/) і [TypeScript](https://www.typescriptlang.org/), розпізнають певні типи проблем навіть до запуску вашого коду. Вони також можуть покращити робочий процес розробника додаючи функції, такі як автозавершення. З цієї причини для великих кодових баз ми рекомендуємо використовувати Flow або TypeScript замість `PropTypes`.

## Flow {#flow}

[Flow](https://flow.org/) — це статичний типізатор для вашого JavaScript-коду. Він розроблюється у Facebook і часто використовується разом з React. Він дозволяє вам анотувати змінні, функції та React-компоненти спеціальним синтаксисом типу і рано ловити помилки. Щоб вивчити його основи ви можете прочитати [введення у Flow](https://flow.org/en/docs/getting-started/).

Щоб використовувати Flow вам необхідно:

* Додати Flow як залежність до вашого проекту.
* Забезпечити вилучення синтаксису Flow зі скомпільованого коду.
* Додати анотації типів та запустити Flow для їх перевірки.

Ми пояснимо ці кроки більш детально нижче.

### Додавання Flow у проект {#adding-flow-to-a-project}

Спочатку в терміналі перейдіть у директорію вашого проекту. Вам потрібно буде запустити наступну команду:

Якщо ви користуєтесь [Yarn](https://yarnpkg.com/uk/), то запустіть:

```bash
yarn add --dev flow-bin
```

Якщо ви користуєтесь [npm](https://www.npmjs.com/), то запустіть:

```bash
npm install --save-dev flow-bin
```

Ця команда встановить останню версію Flow у ваш проект.

Тепер додайте `flow` у відділення `"scripts"` вашого `package.json`, щоб ви змогли використовувати його з терміналу:

```js{4}
{
  // ...
  "scripts": {
    "flow": "flow",
    // ...
  },
  // ...
}
```

Нарешті виконайте одну з наступних команд:

Якщо ви користуєтесь [Yarn](https://yarnpkg.com/uk/), то запустіть:

```bash
yarn run flow init
```

Якщо ви користуєтесь [npm](https://www.npmjs.com/), то запустіть:

```bash
npm run flow init
```

Ця команда створить конфігурацію Flow, яку вам потрібно буде закомітити.

### Вилучення синтаксису Flow зі скомпільованого коду {#stripping-flow-syntax-from-the-compiled-code}

Flow розширяє мову JavaScript спеціальним синтаксисом для анотацій типів. Проте браузери не знають про цей синтаксис, тому нам потрібно переконатися, що він не з'явиться у скомпільованому JavaScript-пакеті, який надсилається браузеру.

Як саме це зробити залежить від інструментів, якими ви компілюєте JavaScript.

#### Create React App {#create-react-app}

Якщо ваш проект був налаштований з використанням [Create React App](https://github.com/facebookincubator/create-react-app), то ми вас вітаємо! Flow-анотації вже вилучаються за замовчуванням, тому вам не потрібно більше нічого робити на цьому кроці.

#### Babel {#babel}

>Примітка:
>
>Ці інструкції *не* для користувачів Create React App. Незважаючи на те, що Create React App використовує Babel в реалізації, він вже налаштований на розуміння Flow. Виконайте це крок лише коли ви *не* використовуєте Create React App.

Якщо ви налаштували Babel для вашого проекту вручну, то вам потрібно буде встановити спеціальний пресет для Flow.

Якщо ви користуєтесь Yarn, то запустіть:

```bash
yarn add --dev babel-preset-flow
```

Якщо ви користуєтесь npm, то запустіть:

```bash
npm install --save-dev babel-preset-flow
```

І потім додайте пресет `flow` до вашої [конфігурації Babel](https://babeljs.io/docs/usage/babelrc/). Наприклад, якщо ви налаштовуєте Babel через файл `.babelrc`, то він може виглядати так:

```js{3}
{
  "presets": [
    "flow",
    "react"
  ]
}
```

Це дозволить вам використовувати синтаксис Flow у вашому коді.

>Примітка:
>
>Flow не потребує пресет `react`, але вони часто використовуються разом. Flow сам по собі розуміє синтаксис JSX.

#### Інші варіанти збірки {#other-build-setups}

Якщо ви не використовуєте Create React App і Babel, то ви можете використати [flow-remove-types](https://github.com/flowtype/flow-remove-types) для видалення анотацій типів.

### Запуск Flow {#running-flow}

Якщо ви слідували наведеним вище інструкціям, то ви повинні мати можливість вперше запустити Flow.

```bash
yarn flow
```

Якщо ви користуєтесь npm, то запустіть:

```bash
npm run flow
```

Ви маєте побачити подібне повідомлення:

```
No errors!
✨  Done in 0.17s.
```

### Додавання анотацій типів Flow {#adding-flow-type-annotations}

За замовчуванням Flow перевіряє лише файли, що включають таку анотацію:

```js
// @flow
```

Зазвичай вона розміщується на початку файлу. Спробуйте додати її до деяких файлів у вашому проекті і запустити `yarn flow` чи `npm run flow`, щоб побачити чи Flow вже знайшов якісь проблеми.

Також існує [опція](https://flow.org/en/docs/config/options/#toc-all-boolean), що дозволяє примусити Flow перевіряти *всі* файли незалежно від наявності вищевказаної анотації. Якщо ви додаєте Flow в існуючий проект, то може виникнути багато конфліктів, але якщо ви починаєте з нуля, то це непогана можливість зробити це.

Тепер у вас все налаштовано! Ми рекомендуємо ознайомитись з наступними ресурсами, щоб дізнатися більше про Flow:

* [Документація Flow: анотації типів](https://flow.org/en/docs/types/)
* [Документація Flow: редактори](https://flow.org/en/docs/editors/)
* [Документація Flow: React](https://flow.org/en/docs/react/)
* [Linting у Flow](https://medium.com/flow-type/linting-in-flow-7709d7a7e969)

## TypeScript {#typescript}

[TypeScript](https://www.typescriptlang.org/) — це мова програмування розроблена Microsoft. Вона є типізованою надмножиною мови JavaScript, і включає власний компілятор. Статична типізація дозволяє мові TypeScript ловити помилки та дефекти під час збірки, набагато раніше ніж ваш додаток буде випущено. Ви можете дізнатися більше про використання TypeScript з React [тут](https://github.com/Microsoft/TypeScript-React-Starter#typescript-react-starter).

Для використання TypeScript вам потрібно:
* Додати TypeScript як залежність до вашого проекту
* Налаштувати опції TypeScript-компілятора
* Використовувати правильні розширення файлів
* Додати файли оголошень для бібліотек, якими ви користуєтесь

Давайте пройдемо по списку детальніше.

### Використання TypeScript з Create React App {#using-typescript-with-create-react-app}

Create React App сам по собі підтримує TypeScript.

Щоб створити **новий проект** з підтримкою TypeScript запустіть:

```bash
npx create-react-app my-app --typescript
```

Ви також зможете додати його до **існуючого проекту Create React App** [як описано тут](https://facebook.github.io/create-react-app/docs/adding-typescript).

>Примітка:
>
>Якщо ви користуєтесь Create React App, то ви можете **пропустити решту цієї сторінки**. Вона описує налаштування вручну, що не відноситься до користувачів Create React App.


### Додавання TypeScript в проект {#adding-typescript-to-a-project}
Все починається з запуску однієї команди в вашому терміналі.

Якщо ви користуєтесь [Yarn](https://yarnpkg.com/uk/), то запустіть:

```bash
yarn add --dev typescript
```

Якщо ви користуєтесь [npm](https://www.npmjs.com/), то запустіть:

```bash
npm install --save-dev typescript
```

Вітаємо! Ви встановили останню версію TypeScript у ваш проект. Встановлення TypeScript надає вам доступ до команди `tsc`. Давайте додамо `tsc` у відділення "scripts" вашого `package.json` перед його налаштуванням:

```js{4}
{
  // ...
  "scripts": {
    "build": "tsc",
    // ...
  },
  // ...
}
```

### Налаштування компілятора TypeScript {#configuring-the-typescript-compiler}
Компілятор нам не допоможе поки ми не вкажемо що йому робити. В TypeScript ці правила задаються в спеціальному файлі під назвою `tsconfig.json`. Щоб згенерувати цей файл запустіть наступне:

Якщо ви користуєтесь [Yarn](https://yarnpkg.com/uk/), то запустіть:

```bash
yarn run tsc --init
```

Якщо ви користуєтесь [npm](https://www.npmjs.com/), то запустіть:

```bash
npx tsc --init
```

Поглянувши на щойно створений файл `tsconfig.json` ви побачите, що існує багато опцій для налаштyвання компілятора. Детальний опис всіх опцій доступний за [цим посиланням](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html).

Ми розглянемо `rootDir` та `outDir` із багатьох опцій. По суті компілятор братиме файли TypeScript та генеруватиме файли JavaScript. Проте нам важливо не сплутати вихідні файли та згенерований результат.

Ми вирішимо це у два етапи:
* Спочатку організуємо структуру нашого проекту таким чином: ми розмістимо весь вихідний код в директорії `src`.

```
├── package.json
├── src
│   └── index.ts
└── tsconfig.json
```

* Потім вкажимо компілятору де знаходиться наш вихідний код і куди повинен виводитись результат.

```js{6,7}
// tsconfig.json

{
  "compilerOptions": {
    // ...
    "rootDir": "src",
    "outDir": "build"
    // ...
  },
}
```

Чудово! Тепер при запуску скрипту збірки компілятор виведе згенеровані файли JavaScript в папку `build`. [TypeScript React Starter](https://github.com/Microsoft/TypeScript-React-Starter/blob/master/tsconfig.json) надає `tsconfig.json` з гарним набором правил для початку.

Зазвичай згенерований JavaScript-код не варто зберігати в системі керування версіями, тому не забудьте додати папку `build` до вашого `.gitignore`.

### Розширення файлів {#file-extensions}
При роботі з React ви, скоріше за все, створювали свої компоненти у файлах `.js`. У TypeScript ми маємо два різних файлових розширення:

`.ts`— це розширення файлів за замовчуванням, а `.tsx`— це спеціальне розширення для файлів, що містять `JSX`.

### Запуск TypeScript {#running-typescript}

Якщо ви слідували інструкціям вище, то ви повинні мати можливість вперше запустити TypeScript.

```bash
yarn build
```

Якщо ви користуєтесь npm, то запустіть:

```bash
npm run build
```

Якщо ви не побачили ніяких повідомлень, то це означає, що компіляція завершилася успішно.


### Оголошення типів {#type-definitions}
Компілятор покладається на файли оголошень щоб показувати помилки та підказки з інших пакетів. Файл оголошень надає всю інформацію про типи в бібліотеці. Це дозволяє використовувати в нашому проекті бібліотеки JavaScript як ті, що доступні в npm. 

Існує два основних шляхи отримати оголошення для бібліотеки:

__Укомплектовані__ – це коли бібліотека включає свій власний файл оголошень. Це чудово для нас, оскільки все що нам потрібно зробити – це встановити бібліотеку і ми можемо одразу її використовувати. Щоб перевірити чи бібліотека укомплектована інформацією про типи погляньте чи в проекті є файл `index.d.ts`. Деякі бібліотеки вказують його в своїх `package.json` в полі `typings` або `types`.

__[DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped)__ – це величезний репозиторій оголошень для бібліотек, що не включають власні файли оголошень. Ці оголошення створюються через краудсорсинг та контролюються Microsoft та учасниками відкритого програмного забезпечення. Наприклад, React не включає власний файл оголошень. Замість цього ми можем його отримати з DefinitelyTyped. Для цього введіть таку команду в вашому терміналі.

```bash
# yarn
yarn add --dev @types/react

# npm
npm i --save-dev @types/react
```

__Локальні оголошення__
Інколи пакет, який би ви хотіли використовувати не включає оголошень і їх також немає в DefinitelyTyped. В цьому випадку ми можемо завести локальний файл оголошень. Для цього створіть файл `declarations.d.ts` в корені вашої директорії з вихідним кодом. Просте оголошення може виглядати наступним чином:

```typescript
declare module 'querystring' {
  export function stringify(val: object): string
  export function parse(val: string): object
}
```

Тепер ви готові до кодингу! Ми рекомендуємо ознайомитись з наступними ресурсами щоб дізнатися більше про TypeScript:

* [Документація TypeScript: базові типи](https://www.typescriptlang.org/docs/handbook/basic-types.html)
* [Документація TypeScript: міграція з JavaScript](https://www.typescriptlang.org/docs/handbook/migrating-from-javascript.html)
* [Документація TypeScript: React та Webpack](https://www.typescriptlang.org/docs/handbook/react-&-webpack.html)

## Reason {#reason}

[Reason](https://reasonml.github.io/uk/) – це не нова мова, а новий синтаксис та інструментарій, працюючі на перевіреній часом мові [OCaml](https://ocaml.org/). Reason надає OCaml знайомий синтаксис пристосований для програмістів JavaScript та використовує знайомий всім робочий процес NPM/Yarn.

Reason розробляється компанією Facebook і використовується в деяких її продуктах, таких як Messenger. Він поки є дещо експериментальною технологією, але для нього існують [спеціалізовані прив’язки з React](https://reasonml.github.io/reason-react/), що підтримуються Facebook та [активною спільнотою](https://reasonml.github.io/docs/uk/community.html).

## Kotlin {#kotlin}

[Kotlin](https://kotlinlang.org/) – це статично типізована мова розроблена JetBrains. Її цільові платформи включають JVM, Android, LLVM, та [JavaScript](https://kotlinlang.org/docs/reference/js-overview.html). 

JetBrains розробляє та підтримує декілька інструментів спеціально для спільноти користувачів React: [React-прив’язки](https://github.com/JetBrains/kotlin-wrappers) а також [Create React Kotlin App](https://github.com/JetBrains/create-react-kotlin-app). Останній допомагає почати будувати React-додатки з Kotlin без потреби у налаштуванні збірки.

## Інші мови {#other-languages}

Зверніть увагу, що існують інші статично типізовані мови які компілюються у JavaScript і таким чином сумісні з React. Наприклад, [F#/Fable](https://fable.io/) з [elmish-react](https://elmish.github.io/react). Ознайомтесь з їх відповідними сайтами щоб дізнатися більше інформації, також не вагайтеся додовати до цієї сторінки інші статично-типізовані мови, що працюють з React!
