---
id: optimizing-performance
title: Оптимізація продуктивності
permalink: docs/optimizing-performance.html
redirect_from:
  - "docs/advanced-performance.html"
---

React за лаштунками використовує кілька розумних підходів для мінімізації кількості вартісних DOM-операцій, необхідних для оновлення користувацького інтерфейсу. Для більшості додатків, використання React дозволить мати швидкий інтерфейс без докладання особливих зусиль для оптимізації продуктивності. Не дивлячись на це, існує кілька шляхів для прискорення швидкодії вашого React-додатку.

## Використання продакшн-збірки {#use-the-production-build}

Якщо ви оцінюєте чи маєте проблеми зі швидкодією ваших React-додатків, впевніться в тому, що ви тестуєте мініфіковану продакшн-збірку.

React включає багато корисних попереджень за замовчуванням. Вони є надзвичайно корисними при розробці, але в той самий час роблять React більшим та повільнішим. Саме тому ви маєте бути певними, що використовуєте продакшн-версію при розгортанні додатку.

Якщо ви не впевнені у правильному налаштуванні процесу збірки, ви можете перевірити це, встановивши [інструменти розробника React для Chrome](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi). Якщо ви відвідаєте сайт на React у продакшн-режимі, іконка матиме темний фон:

<img src="../images/docs/devtools-prod.png" style="max-width:100%" alt="React DevTools на сайті, що використовує продакшн-версію React">

Якщо ви відвідаєте сайт, що використовує React у режимі розробки, то іконка матиме червоний фон:

<img src="../images/docs/devtools-dev.png" style="max-width:100%" alt="React DevTools на сайті, що використовує версію React для розробки">

Як правило ви маєте використовувати режим розробки під час роботи над додатком і продакшн-режим при його розгортанні.

Нижче ви можете знайти інструкції по збірці вашого додатку для продакшну.

### Create React App {#create-react-app}

Якщо ви використали [Create React App](https://github.com/facebookincubator/create-react-app) для створення проекту, запустіть:

```
npm run build
```

Ця команда створить продакшн-збірку у папці `build/` вашого додатку.

Пам'ятайте, що це необхідно лише перед розгортанням на продакшн. Для звичайної розробки використовуйте `npm start`.

### Однофайлові збірки {#single-file-builds}

Ми пропонуємо готові для продакшу версії React та React DOM у вигляді окремих файлів:

```html
<script src="https://unpkg.com/react@17/umd/react.production.min.js"></script>
<script src="https://unpkg.com/react-dom@17/umd/react-dom.production.min.js"></script>
```

Пам'ятайте, що для продакшну підходять тільки ті файли React, що закінчуються на `.production.min.js`.

### Brunch {#brunch}

Для найефективнішої продакшн-збірки з використанням Brunch, встановіть плагін [`terser-brunch`](https://github.com/brunch/terser-brunch):

```
# Якщо ви користуєтесь npm
npm install --save-dev uglify-js-brunch

# Якщо ви користуєтесь Yarn
yarn add --dev uglify-js-brunch
```

Потім створіть продакшн-збірку, додавши прапорець `-p` до команди `build`:

```
brunch build -p
```

Пам'ятайте, що це потрібно робити лише для продакшн-збірок. Ви не повинні передавати прапорець `-p` чи застосовувати цей плагін під час розробки, тому що це приховає корисні попередження від React та сповільнить процес збірки.

### Browserify {#browserify}

Для найефективнішої продакшн-збірки з використанням Browserify, встановіть декілька плагінів:

```
<<<<<<< HEAD
# Якщо ви користуєтесь npm
npm install --save-dev envify terser uglifyify

# Якщо ви користуєтесь Yarn
=======
# If you use npm
npm install --save-dev envify terser uglifyify

# If you use Yarn
>>>>>>> b9c33a05520ddc728f15c4eb19a343213309f59f
yarn add --dev envify terser uglifyify
```

Щоб створити продакшн-збірку, впевніться, що ви додали наступні перетворення **(у представленому порядку)**:

* Плагін [`envify`](https://github.com/hughsk/envify) гарантує правильність встановленого середовища для збірки. Зробіть його глобальним (`-g`).
* Плагін [`uglifyify`](https://github.com/hughsk/uglifyify) видаляє необхідні для розробки імпорти. Зробіть його глобальним також (`-g`).
* Нарешті, отримана збірка передається до [`terser`](https://github.com/terser-js/terser) для мініфікації ([прочитайте навіщо](https://github.com/hughsk/uglifyify#motivationusage)).

Наприклад:

```
browserify ./index.js \
  -g [ envify --NODE_ENV production ] \
  -g uglifyify \
  | terser --compress --mangle > ./bundle.js
```

Пам'ятайте, що це потрібно робити лише для продакшн-збірок. Ви не повинні використовувати ці плагіни під час розробки, тому що це приховає корисні попередження від React та сповільнить процес збірки.

### Rollup {#rollup}

Для найефективнішої продакшн-збірки з використанням Rollup, встановіть декілька плагінів:

```bash
# Якщо ви користуєтесь npm
npm install --save-dev rollup-plugin-commonjs rollup-plugin-replace rollup-plugin-terser

# Якщо ви користуєтесь Yarn
yarn add --dev rollup-plugin-commonjs rollup-plugin-replace rollup-plugin-terser
```

Щоб створити продакшн-збірку, впевніться, що ви додали наступні плагіни **(у представленому порядку)**:

* Плагін [`replace`](https://github.com/rollup/rollup-plugin-replace) гарантує правильність встановленого середовища для збірки.
* Плагін [`commonjs`](https://github.com/rollup/rollup-plugin-commonjs) надає підтримку CommonJS у Rollup.
* Плагін [`terser`](https://github.com/TrySound/rollup-plugin-terser) стискає та мініфікує фінальну збірку.

```js
plugins: [
  // ...
  require('rollup-plugin-replace')({
    'process.env.NODE_ENV': JSON.stringify('production')
  }),
  require('rollup-plugin-commonjs')(),
  require('rollup-plugin-terser')(),
  // ...
]
```

Для більш повного зразку налаштування [перегляньте цей gist](https://gist.github.com/Rich-Harris/cb14f4bc0670c47d00d191565be36bf0).

Пам'ятайте, що це потрібно робити лише для продакшн-збірок. Ви не повинні використовувати плагін `terser` чи `replace` із значенням `'production'` під час розробки, тому що це приховає корисні попередження від React та сповільнить процес збірки.

### webpack {#webpack}

>**Примітка:**
>
>Якщо ви використовуєте Create React App, то використовуйте [інструкції вище](#create-react-app).<br>
>Цей розділ потрібен, якщо ви самі налаштовуєте webpack.

Webpack версії 4, або вище, за замовчуванням мінімізує ваш код у продакшн-режимі.

```js
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  mode: 'production',
  optimization: {
    minimizer: [new TerserPlugin({ /* additional options here */ })],
  },
};
```

Ви можете дізнатися про це більше у [документації webpack](https://webpack.js.org/guides/production/).

Пам'ятайте, що це потрібно робити лише для продакшн-збірок. Ви не повинні використовувати `UglifyJsPlugin` чи `TerserPlugin` під час розробки, тому що це приховає корисні попередження від React та сповільнить процес збірки.

<<<<<<< HEAD
## Профілювання компонентів з використанням вкладки Chrome "Performance" {#profiling-components-with-the-chrome-performance-tab}

У режимі **розробки**, ви можете візуалізувати процес монтування, оновлення і демонтування компонентів, використавши інструменти продуктивності у браузерах, що їх підтримують. Наприклад:

<center><img src="../images/blog/react-perf-chrome-timeline.png" style="max-width:100%" alt="React-компоненти на графіку часу в Chrome" /></center>

Щоб зробити це в Chrome:

1. Тимчасово **вимкніть всі розширення Chrome, особливо React DevTools**. Вони можуть істотно спотворити резульати!

2. Впевніться, що додаток запущений в режимі розробки.

3. Відкрийте Chrome DevTools, оберіть вкладку **[Performance](https://developers.google.com/web/tools/chrome-devtools/evaluate-performance/timeline-tool)** та натисніть **Record**.

4. Виконайте дії, які потрібно профілювати. Не записуйте більше 20 секунд, інакше Chrome може зависнути.

5. Зупиніть запис.

6. Події React будуть згруповані під міткою **User Timing**.

Для більш детальних інструкцій перегляньте [цю статтю Бена Шварца (Ben Schwarz)](https://calibreapp.com/blog/react-performance-profiling-optimization).

Зверніть увагу на те, **що ці значення відносні і компоненти в продакшні будуть рендеритись швидше**. Проте це допоможе вам зрозуміти, коли не пов'язані між собою частини інтерфейсу оновлюються через помилку та як глибоко і часто ці оновлення вібдуваються.

Наразі Chrome, Edge та IE є єдиними браузерами, котрі підтримують цю функціональність, але ми використовуємо стандарт [User Timing API](https://developer.mozilla.org/en-US/docs/Web/API/User_Timing_API), а тому очікуємо, що більше браузерів додадуть її підтримку.

## Профілювання компонентів з профайлером DevTools {#profiling-components-with-the-devtools-profiler}
=======
## Profiling Components with the DevTools Profiler {#profiling-components-with-the-devtools-profiler}
>>>>>>> b9c33a05520ddc728f15c4eb19a343213309f59f

`react-dom` 16.5+ та `react-native` 0.57+ надають додаткові можливості профілювання в режимі розробки з використанням профайлера React DevTools.
Огляд профайлера можна знайти в пості блогу ["Знайомство з React Profiler"](/blog/2018/09/10/introducing-the-react-profiler.html).
Відео-посібник також [доступний на YouTube](https://www.youtube.com/watch?v=nySib7ipZdk).

Якщо ви ще не встановили React DevTools, ви можете знайти їх тут:

- [Розширення браузера Chrome](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en)
- [Розширення браузера Firefox](https://addons.mozilla.org/en-GB/firefox/addon/react-devtools/)
- [Окремий пакунок Node](https://www.npmjs.com/package/react-devtools)

> Примітка
>
> Продакшн-збірка профілювання для `react-dom` також доступна як `react-dom/profiling`.
> Докладніше про її використання ви можете дізнатись за посиланням [fb.me/react-profiling](https://fb.me/react-profiling)

<<<<<<< HEAD
## Віртуалізація довгих списків {#virtualize-long-lists}

Якщо ваш додаток рендерить довгі списки даних (сотні чи тисячі рядків), ми радимо використовувати підхід під назвою "віконний доступ". Цей підхід рендерить лише невелику підмножину ваших рядків у будь-який момент часу і може значно зменшити час, потрібний для повторного рендеру компонентів та кількість створених DOM-вузлів.
=======
> Note
>
> Before React 17, we use the standard [User Timing API](https://developer.mozilla.org/en-US/docs/Web/API/User_Timing_API) to profile components with the chrome performance tab. 
> For a more detailed walkthrough, check out [this article by Ben Schwarz](https://calibreapp.com/blog/react-performance-profiling-optimization).

## Virtualize Long Lists {#virtualize-long-lists}

If your application renders long lists of data (hundreds or thousands of rows), we recommend using a technique known as "windowing". This technique only renders a small subset of your rows at any given time, and can dramatically reduce the time it takes to re-render the components as well as the number of DOM nodes created.
>>>>>>> b9c33a05520ddc728f15c4eb19a343213309f59f

[react-window](https://react-window.now.sh/) та [react-virtualized](https://bvaughn.github.io/react-virtualized/) — це популярні бібліотеки для віконного доступу. Вони надають кілька компонентів для відображення списків, сіток та табличних даних. Якщо ваш додаток потребує іншого підходу, то ви можете створити власний компонент для віконного доступу, як це зроблено в [Twitter](https://medium.com/@paularmstrong/twitter-lite-and-high-performance-react-progressive-web-apps-at-scale-d28a00e780a3).

## Уникнення узгодження {#avoid-reconciliation}

React створює і підтримує внутрішній стан відображуваного користувацького інтерфейсу. Він також включає React-елементи, які ви повертаєте з ваших компонентів. Це дозволяє React уникати створення нових DOM-вузлів та доступу до вже існуючих без необхідності, тому що ці операції можуть бути повільнішими за операції зі звичайними JavaScript-об'єктами. Іноді цей стан називають "віртуальний DOM", але в React Native він працює так само.

Коли пропси чи стан компонента змінюються, React вирішує чи необхідне оновлення DOM, порівнюючи новий повернутий елемент з вже відрендереним. Якщо вони не рівні, то React оновить DOM.

Незважаючи на те, що React оновлює тільки змінені вузли DOM, повторний рендер все ж займає певний час. У більшості випадків це не проблема, але якщо ви помітите, що швидкодія зменшиться, то ви можете прискорити все, перевизначивши метод життєвого циклу `shouldComponentUpdate`, котрий викликається перед початком процесу повторного рендерингу. За замовчуванням, реалізація цієї функції повертає `true`, змушуючи React здійснити оновлення:

```javascript
shouldComponentUpdate(nextProps, nextState) {
  return true;
}
```

Якщо ви знаєте, що в певних ситуаціях ваш компонент не повинен оновлюватись, то ви можете повернути `false` з `shouldComponentUpdate`, щоб пропустити весь процес рендерингу, включно з викликом `render()` поточного компонента та компонентів нижче.

У більшості випадків, замість написання `shouldComponentUpdate()` вручну, ви можете наслідуватись від [`React.PureComponent`](/docs/react-api.html#reactpurecomponent). Це еквівалентно реалізації `shouldComponentUpdate()` з поверховим порівнянням поточних та попередніч пропсів та стану.

## shouldComponentUpdate в дії {#shouldcomponentupdate-in-action}

На рисунку зображено піддерево компонентів. Для кожного з них `SCU` позначає значення, повернуте `shouldComponentUpdate`, і `vDOMEq` позначає чи були відрендерені React-елементи рівними. Нарешті, колір кола позначає те, чи має компонент бути узгодженим, чи ні.

<figure><img src="../images/docs/should-component-update.png" style="max-width:100%" /></figure>

Оскільки `shouldComponentUpdate` повернув `false` для піддерева з коренем в C2, React не буде намагатися відрендерити C2 і навіть викликати `shouldComponentUpdate` для C4 і C5.

Для C1 і C3 `shouldComponentUpdate` повернув `true`, тому React має перейти вниз до листів дерева і перевірити їх. Для C6 `shouldComponentUpdate` повернув `true` і, оскільки значення відрендерених елементів не було еквівалентним, React має оновити DOM.

Останнім цікавим випадком є C8. React має відрендерити цей компонент, але оскільки повернуті React-елементи були рівні попереднім, то DOM не буде оновлений.

Зверніть увагу на те, що React повинен був здійснити зміну DOM лише для C6, що було неминучим. Для C8 він уникнув змін завдяки порівнянню відрендерених React-елементів, а для піддерева C2 та C7 не потрібно було навіть виконувати це порівняння, оскільки процес рендерингу зупинився у методі `shouldComponentUpdate` і метод `render` не був викликаний.

## Приклади {#examples}

Якщо ваш компонент має змінюватись лише тоді, коли змінюються змінні `props.color` чи `state.count`, ви можете виконати цю перевірку в `shouldComponentUpdate`:

```javascript
class CounterButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {count: 1};
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.color !== nextProps.color) {
      return true;
    }
    if (this.state.count !== nextState.count) {
      return true;
    }
    return false;
  }

  render() {
    return (
      <button
        color={this.props.color}
        onClick={() => this.setState(state => ({count: state.count + 1}))}>
        Рахунок: {this.state.count}
      </button>
    );
  }
}
```

У цьому коді `shouldComponentUpdate` лише перевіряє наявні зміни в `props.color` чи `state.count`. Якщо ці значення не змінились, то компонент не оновиться. Якщо ваш компонент буде більш складним, ви можете використати схожий шаблон і зробити "поверхове порівняння" всіх полей `props` і `state`, щоб визначити, чи має компонент оновитись. Цей шаблон трапляється часто, а тому React надає допоміжну функцію для цієї логіки — просто унаслідуйтесь від `React.PureComponent`. Наступний код показує простіший шлях для досягнення цього ефекту:

```js
class CounterButton extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {count: 1};
  }

  render() {
    return (
      <button
        color={this.props.color}
        onClick={() => this.setState(state => ({count: state.count + 1}))}>
        Рахунок: {this.state.count}
      </button>
    );
  }
}
```

У більшості випадків ви можете використовувати `React.PureComponent` замість написання власного методу `shouldComponentUpdate`. Він робить лише поверхове порівняння, а тому ви не можете використати його, якщо пропси чи стан можуть змінитись таким чином, що поверхове порівняння пропустить цю зміну.

Це може бути проблемою для більш складних структур даних. Наприклад, ви хочете, щоб компонент `ListOfWords` рендерив список слів розділених комами з батьківським компонентом `WordAdder`, що дає можливість натиснути на кнопку і додати слово в список. Цей код працює *неправильно*:

```javascript
class ListOfWords extends React.PureComponent {
  render() {
    return <div>{this.props.words.join(',')}</div>;
  }
}

class WordAdder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      words: ['марклар']
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    // Даний метод є поганим стилем і спричиняє помилку
    const words = this.state.words;
    words.push('марклар');
    this.setState({words: words});
  }

  render() {
    return (
      <div>
        <button onClick={this.handleClick} />
        <ListOfWords words={this.state.words} />
      </div>
    );
  }
}
```

Проблема в тому, що `PureComponent` зробить просте порівняння старого значення `this.props.words` з новим. Оскільки цей код змінює масив `words` у методі `handleClick` класу `WordAdder`, то нове та старе значення `this.props.words` будуть вважатися однаковими як посилання, хоча вміст масиву і змінився. `ListOfWords` не оновиться, хоч він і містить нові слова, що мають бути відрендерені.

## Сила незмінності даних {#the-power-of-not-mutating-data}

Найпростішим шляхом уникнення цієї проблеми є уникнення зміни значень, які ви використовуєте як пропси чи стан. Наприклад, метод `handleClick` вище, міг би бути переписаний з використанням `concat`:

```javascript
handleClick() {
  this.setState(state => ({
    words: state.words.concat(['марклар'])
  }));
}
```

ES6 підтримує [синтаксис розпакування](https://developer.mozilla.org/uk/docs/Web/JavaScript/Reference/Operators/%D0%9E%D0%BF%D0%B5%D1%80%D0%B0%D1%82%D0%BE%D1%80_%D1%80%D0%BE%D0%B7%D0%BF%D0%B0%D0%BA%D1%83%D0%B2%D0%B0%D0%BD%D0%BD%D1%8F) для масивів, щоб спростити цю задачу. Якщо ви використовуєте Create React App, цей синтаксис доступний за замовчуванням.

```js
handleClick() {
  this.setState(state => ({
    words: [...state.words, 'марклар'],
  }));
};
```

Ви також можете подібним чином переписати код, що змінює об'єкти. Наприклад, у нас є об'єкт `colormap` і ми хочемо написати функцію, що змінить `colormap.right` на `'blue'`. Ми могли б написати:

```js
function updateColorMap(colormap) {
  colormap.right = 'blue';
}
```

Щоб переписати це без зміни оригінального об'єкта, ми можемо використати метод [Object.assign](https://developer.mozilla.org/uk/docs/Web/JavaScript/Reference/Global_Objects/Object/assign):

```js
function updateColorMap(colormap) {
  return Object.assign({}, colormap, {right: 'blue'});
}
```

`updateColorMap` тепер повертає новий об'єкт, а не змінює старий. `Object.assign` — це ES6 і для його роботи потрібен поліфіл.

[Оператор розкладу](https://developer.mozilla.org/uk/docs/Web/JavaScript/Reference/Operators/Spread_syntax) дозволяє оновлювати об'єкти, не мутуючи їх:

```js
function updateColorMap(colormap) {
  return {...colormap, right: 'blue'};
}
```

<<<<<<< HEAD
Ця функція була додана до JavaScript у ES2018. 
=======
This feature was added to JavaScript in ES2018.
>>>>>>> b9c33a05520ddc728f15c4eb19a343213309f59f

Якщо ви використовуєте Create React App, то `Object.assign` та розпакування об'єктів доступні за замовчуванням.

Коли ви працюєте з глибоко вкладеними об'єктами, то постійне іх оновлення може заплутати вас. Якщо ви зіткнулися з такою проблемою, зверніть увагу на [Immer](https://github.com/mweststrate/immer) або [immutability-helper](https://github.com/kolodny/immutability-helper). Ці бібліотеки допомогають писати читабельний код, не втрачаючи переваг незмінності.
