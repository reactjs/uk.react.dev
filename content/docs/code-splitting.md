---
id: code-splitting
title: Code-Splitting
permalink: docs/code-splitting.html
---

## Розбиття по модулям {#bundling}

Більшість React додатків мають власні розбиті за "бандлами" файли використовуючи такі інструменти, як
[Webpack](https://webpack.js.org/) або [Browserify](http://browserify.org/).
Бандлінг – це процес імпортування файлів та об'єднання їх в один файл – бандл (модуль).
Цей бандл може потім бути включений до веб-сторінки для завантаження всього додатку
одночасно.

#### Приклад {#example}

**App:**

```js
// app.js
import { add } from './math.js';

console.log(add(16, 26)); // 42
```

```js
// math.js
export function add(a, b) {
  return a + b;
}
```

**Bundle:**

```js
function add(a, b) {
  return a + b;
}

console.log(add(16, 26)); // 42
```

> Примітка:
>
> Наприкінці ваші бандли будуть значно відрізнятися від наведених прикладів.

Якщо ви використовуєте [Create React App](https://github.com/facebookincubator/create-react-app), [Next.js](https://github.com/zeit/next.js/), [Gatsby](https://www.gatsbyjs.org/), чи подібний інструмент, ви матимете налаштування Webpack за замовчуванням для бандлінгу вашого додатку.

Якщо ви не використовуєте нічого з наведеного чи подібного, вам доведеться налаштовувати бандлінг самостійно. Для прикладів ознайомтеся зі
[Встановленням](https://webpack.js.org/guides/installation/) та 
[Початком роботи](https://webpack.js.org/guides/getting-started/). Це офіційна документація Webpack.

## Розбиття Коду {#code-splitting}

Розбиття по бандлам – це прекрасно, але з темпом росту вашого додатку, бандли теж зростають.
Це особливо помітно, якщо ви встановили та використовуєте великі сторонні бібліотеки. Вам потрібно
стежити за кодом, який попадає в ваш бандл для того, щоб в один момент не зробити цей бандл настільки
великим, що для завантаження вашого додатку знадобиться чимало часу.


Щоб уникнути проблем з великим бандлом, було б добре почати "розбиття" вашого бандла.
[Розбиття Коду](https://webpack.js.org/guides/code-splitting/) – це функція, яку підтримують
такі бандлери як Webpack та Browserify (за допомогою
[factor-bundle](https://github.com/browserify/factor-bundle). Цей інструмент може створити кілька модулів
з одного, які можна динамічно завантажувати/довантажувати під час виконання вашого основного бандлу.


Розбиття коду вашого додатку може допомогти поступово завантажити тількі те,
що необхідно користувачеві в цей момент. Це може значно покращити продуктивність вашого
додатку. Хоча ви не скоротили кількість коду вашого додатку, ви уникнули завантаження
коду, який може ніколи не знадобитись користувачеві, та скоротили об'єм коду, що необхідний
на початку завантаження додатку.

## `import()` {#import}

Найращий спосіб впровадження розбиття коду — це синтакс динамічніх `import()`


**До:**

```js
import { add } from './math';

console.log(add(16, 26));
```

**Після:**

```js
import("./math").then(math => {
  console.log(math.add(16, 26));
});
```

> Примітка:
>
> Синтаксис динамічніх `import()` – це  
> [пропозиція](https://github.com/tc39/proposal-dynamic-import) ECMAScript (JavaScript),
> що не є частиною мовного стандарту на цей момент.
> Очікується, що він буде прийнятий у найближчий час.

В той момент, коли Webpack стикається з таким синтаксисом, він автоматично починає розбивати код вашого додатку.
Якщо ви вже користуєтесь Create React App, це вже налаштовано для вас
та ви можете одразу [почати користуватися цим](https://facebook.github.io/create-react-app/docs/code-splitting). Це також підтримується
у [Next.js](https://github.com/zeit/next.js/#dynamic-import) за замовчуванням.

Під час самостійного налаштування Webpack, скоріш за все, у вас з'виться бажання прочитати
[інструкцію з розбиття коду](https://webpack.js.org/guides/code-splitting/) від Webpack.
Конфігурація вашого Webpack повинна мати вигляд [схожий на цей](https://gist.github.com/gaearon/ca6e803f5c604d37468b0091d9959269).

Під час використання [Babel](https://babeljs.io/), ви маєте пересвідчитись в тому,
що Babel може парсити Синтаксис динамічніх import, виключаючи можливість його перетворювання.
Для цього вам знадобиться [babel-plugin-syntax-dynamic-import](https://yarnpkg.com/en/package/babel-plugin-syntax-dynamic-import).

## `React.lazy` {#reactlazy}

> Примітка:
>
> `React.lazy` та Suspense ще не доступні для рендерингу на стороні сервера. Якщо ви хочете використовувати
розбиття коду в додатках зрендерених на сервері, ми рекомендуємо [Loadable Components](https://github.com/smooth-code/loadable-components). Він має гарну [інструкцію для розбиття на бандли, використовуючи рендеринг на стороні сервера](https://github.com/smooth-code/loadable-components/blob/master/packages/server/README.md).

Функція `React.lazy` дозволяє вам рендерити динамічний import як звичайний компонент

**До:**

```js
import OtherComponent from './OtherComponent';

function MyComponent() {
  return (
    <div>
      <OtherComponent />
    </div>
  );
}
```

**Після:**

```js
const OtherComponent = React.lazy(() => import('./OtherComponent'));

function MyComponent() {
  return (
    <div>
      <OtherComponent />
    </div>
  );
}
```

Цей код автоматично завантажить бандл, що містить `OtherComponent` коли цей компонент повинен відрендеритися.

`React.lazy` приймає функцію, яка має викликати динамічний `import()`. Потім повертається `Promise`, який при успішному
виконанні поверне модуль з `default` експортом, а у цьому модулі у свою чергу знаходитиметься React-компонент.

### Suspense {#suspense}

Якщо модуль, в якому знаходиться `OtherComponent` ще не завантажився під час рендерінгу `MyComponent`, ми повинні
показати певний запасний вміст, поки ми чекаємо на його завантаження - наприклад індикатор завантаження. Це може
бути реалізовано за допомогою `Suspense`.

```js
const OtherComponent = React.lazy(() => import('./OtherComponent'));

function MyComponent() {
  return (
    <div>
      <Suspense fallback={<div>Завантаження...</div>}>
        <OtherComponent />
      </Suspense>
    </div>
  );
}
```

`fallback` приймає будь-який React елемент, поки чекає повного завантаження компонента. Компонент `Suspense` можна розмістити
де завгодно над "ледачим" компонентом. Ви навіть можете обернути кілька "ледачих" компонентів за допомогою одного `Suspense` компонента

```js
const OtherComponent = React.lazy(() => import('./OtherComponent'));
const AnotherComponent = React.lazy(() => import('./AnotherComponent'));

function MyComponent() {
  return (
    <div>
      <Suspense fallback={<div>Завантаження...</div>}>
        <section>
          <OtherComponent />
          <AnotherComponent />
        </section>
      </Suspense>
    </div>
  );
}
```

### Запобіжник {#error-boundaries}

Якщо інший модуль не завантажився (наприклад, через виключений інтернет), це призведе до помилки. Ви можете обробити ці
помилки, щоб показати приємний користувальницький досвід і керувати відновленням за допомогою [Запобіжнику](/docs/error-boundaries.html). Після створення запобіжнику, її можно використати де завгодно над "ледачим" компонентами для того, щоб
показати стан помилки, коли виникає проблема з мережою.

```js
import MyErrorBoundary from './MyErrorBoundary';
const OtherComponent = React.lazy(() => import('./OtherComponent'));
const AnotherComponent = React.lazy(() => import('./AnotherComponent'));

const MyComponent = () => (
  <div>
    <MyErrorBoundary>
      <Suspense fallback={<div>Завантаження...</div>}>
        <section>
          <OtherComponent />
          <AnotherComponent />
        </section>
      </Suspense>
    </MyErrorBoundary>
  </div>
);
```

## Розбиття коду на основі маршрутів {#route-based-code-splitting}

Рішення стосовно того, де саме вводити розбиття коду може бути доволі складним.
Ви хочете переконатися, що ви обираєте місця, які рівномірно розділять ваші бандли,
але в жодному разі не порушуватимуть роботу користувача.

Вдалим місцем для початку може бути ваш файл з маршрутами додатку. Більшість людей
звикли до того, що перехід між сторінками займає певний час. Крім того, ви часто
перезавантажуєте цілу сторінку одразу, тому користувачі навряд чи будуть взаємодіяти
з іншими елементами на сторінці в цей час.

Нижче наведено приклад налаштування розбиття коду файла з маршрутами додатку, використовуючи
бібліотеку [React Router](https://reacttraining.com/react-router/) за допомогою `React.lazy`.

```js
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import React, { Suspense, lazy } from 'react';

const Home = lazy(() => import('./routes/Home'));
const About = lazy(() => import('./routes/About'));

const App = () => (
  <Router>
    <Suspense fallback={<div>Завантаження...</div>}>
      <Switch>
        <Route exact path="/" component={Home}/>
        <Route path="/about" component={About}/>
      </Switch>
    </Suspense>
  </Router>
);
```

## Іменовані Експорти {#named-exports}

Наразі `React.lazy` підтримує тількі експорти за замовчуванням.
Якщо модуль, який ви імпортуєте використовую іменовані експорти, 
можна створити проміжний модуль, який повторно експортуватиме його за замовчуванням. Це гарантує,
що [treeshaking](https://webpack.js.org/guides/tree-shaking/)
продовже працювати та ви не підвантажуєте компоненти, що не використовуватимуться.

```js
// ManyComponents.js
export const MyComponent = /* ... */;
export const MyUnusedComponent = /* ... */;
```

```js
// MyComponent.js
export { MyComponent as default } from "./ManyComponents.js";
```

```js
// MyApp.js
import React, { lazy } from 'react';
const MyComponent = lazy(() => import("./MyComponent.js"));
```
