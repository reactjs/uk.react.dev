---
id: code-splitting
title: Розбиття коду
permalink: docs/code-splitting.html
---

## Зшивання файлів {#bundling}

<<<<<<< HEAD
Файли більшості React-додатків зшиваються разом за допомогою таких інструментів, як
[Webpack](https://webpack.js.org/), [Rollup](https://rollupjs.org/) та 
[Browserify](http://browserify.org/).
Зшивання (бандлінг) – це процес об'єднання імпортованих файлів в один файл – бандл.
Цей бандл потім може бути включений до веб-сторінки для завантаження всього додатку
одночасно.
=======
Most React apps will have their files "bundled" using tools like [Webpack](https://webpack.js.org/), [Rollup](https://rollupjs.org/) or [Browserify](http://browserify.org/). Bundling is the process of following imported files and merging them into a single file: a "bundle". This bundle can then be included on a webpage to load an entire app at once.
>>>>>>> 26caa649827e8f8cadd24dfc420ea802dcbee246

#### Приклад {#example}

**Застосунок:**

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

**Бандл:**

```js
function add(a, b) {
  return a + b;
}

console.log(add(16, 26)); // 42
```

> Примітка:
>
> Наприкінці ваші бандли будуть значно відрізнятися від наведених прикладів.

<<<<<<< HEAD
Якщо ви використовуєте [Create React App](https://create-react-app.dev/), [Next.js](https://nextjs.org/), [Gatsby](https://www.gatsbyjs.org/) чи подібний інструмент, Webpack за замовчуванням налаштований для бандлінгу вашого додатку.

Якщо ви не використовуєте нічого з наведеного чи подібного, вам доведеться налаштувати бандлінг самостійно. Для прикладів ознайомтеся зі
[Встановленням](https://webpack.js.org/guides/installation/) та
[Початком роботи](https://webpack.js.org/guides/getting-started/) в офіційній 
документації Webpack.
=======
If you're using [Create React App](https://create-react-app.dev/), [Next.js](https://nextjs.org/), [Gatsby](https://www.gatsbyjs.org/), or a similar tool, you will have a Webpack setup out of the box to bundle your app.

If you aren't, you'll need to set up bundling yourself. For example, see the [Installation](https://webpack.js.org/guides/installation/) and [Getting Started](https://webpack.js.org/guides/getting-started/) guides on the Webpack docs.
>>>>>>> 26caa649827e8f8cadd24dfc420ea802dcbee246

## Розбиття Коду {#code-splitting}

<<<<<<< HEAD
Зшивання файлів – це прекрасно, але з ростом вашого додатку розмір бандлу теж зростатиме.
Особливо якщо ви використовуєте великі сторонні бібліотеки. Вам потрібно
стежити за кодом, який ви включаєте у свій бандл, щоб випадково не зробити його настільки великим, що завантаження вашого застосунку займатиме багато часу.

Щоб уникнути розростання бандла, варто заздалегідь почати його розбивати на шматки.
Розбиття коду - це функціонал, який підтримується такими бандлерами,
як [Webpack](https://webpack.js.org/guides/code-splitting/),
[Rollup](https://rollupjs.org/guide/en/#code-splitting) та Browserify (з
[factor-bundle](https://github.com/browserify/factor-bundle)), що можуть створювати
декілька окремих бандлів, які можна динамічно завантажувати під час виконання застосунку.

Розбиття коду вашого додатку може допомогти "ліниво" завантажувати (lazy load) тільки те,
що необхідно користувачеві в цей момент. Це може значно покращити продуктивність вашого
додатку. Хоч ви й не скорочуєте обсяг коду вашого додатку, ви уникаєте завантаження
того коду, який може ніколи не знадобитись користувачеві, а також скорочуєте обсяг коду, що необхідний
на початку завантаження додатку.

## `import()` {#import}

Найращий спосіб впровадження розбиття коду — через синтаксис 
динамічного `import()`
=======
Bundling is great, but as your app grows, your bundle will grow too. Especially if you are including large third-party libraries. You need to keep an eye on the code you are including in your bundle so that you don't accidentally make it so large that your app takes a long time to load.

To avoid winding up with a large bundle, it's good to get ahead of the problem and start "splitting" your bundle. Code-Splitting is a feature
supported by bundlers like [Webpack](https://webpack.js.org/guides/code-splitting/), [Rollup](https://rollupjs.org/guide/en/#code-splitting) and Browserify (via [factor-bundle](https://github.com/browserify/factor-bundle)) which can create multiple bundles that can be dynamically loaded at runtime.

Code-splitting your app can help you "lazy-load" just the things that are currently needed by the user, which can dramatically improve the performance of your app. While you haven't reduced the overall amount of code in your app, you've avoided loading code that the user may never need, and reduced the amount of code needed during the initial load.

## `import()` {#import}

The best way to introduce code-splitting into your app is through the dynamic `import()` syntax.
>>>>>>> 26caa649827e8f8cadd24dfc420ea802dcbee246

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

<<<<<<< HEAD
Коли Webpack стикається з таким синтаксисом, він автоматично починає розбивати код вашого додатку.
Якщо ви користуєтесь Create React App, він вже налаштований відповідним чином, і ви можете одразу почати [користуватися розбиттям коду](https://facebook.github.io/create-react-app/docs/code-splitting). У [Next.js](https://nextjs.org/docs/advanced-features/dynamic-import) розбиття коду також підтримується за замовчуванням.

Під час самостійного налаштування Webpack, скоріш за все, у вас з'явиться бажання прочитати
[інструкцію з розбиття коду](https://webpack.js.org/guides/code-splitting/) від Webpack. Конфігурація вашого Webpack повинна мати вигляд, [схожий на цей](https://gist.github.com/gaearon/ca6e803f5c604d37468b0091d9959269).

В разі використання [Babel](https://babeljs.io/) ви маєте пересвідчитись в тому, що Babel може парсити синтаксис динамічного import(), але не перетворює його.
Для цього вам знадобиться [babel-plugin-syntax-dynamic-import](https://yarnpkg.com/en/package/babel-plugin-syntax-dynamic-import).

## `React.lazy` {#reactlazy}

> Примітка:
>
> `React.lazy` та Suspense ще не доступні для рендерингу на стороні сервера. Якщо ви хочете використовувати розбиття коду в додатках, відрендерених на сервері, ми рекомендуємо [Loadable Components](https://github.com/gregberge/loadable-components). Вони мають гарну [інструкцію для розбиття на бандли з використанням серверного рендерингу](https://loadable-components.com/docs/server-side-rendering/).

Функція `React.lazy` дозволяє вам рендерити динамічний import як звичайний компонент
=======
When Webpack comes across this syntax, it automatically starts code-splitting your app. If you're using Create React App, this is already configured for you and you can [start using it](https://create-react-app.dev/docs/code-splitting/) immediately. It's also supported out of the box in [Next.js](https://nextjs.org/docs/advanced-features/dynamic-import).

If you're setting up Webpack yourself, you'll probably want to read Webpack's [guide on code splitting](https://webpack.js.org/guides/code-splitting/). Your Webpack config should look vaguely [like this](https://gist.github.com/gaearon/ca6e803f5c604d37468b0091d9959269).

When using [Babel](https://babeljs.io/), you'll need to make sure that Babel can parse the dynamic import syntax but is not transforming it. For that you will need [@babel/plugin-syntax-dynamic-import](https://classic.yarnpkg.com/en/package/@babel/plugin-syntax-dynamic-import).

## `React.lazy` {#reactlazy}

The `React.lazy` function lets you render a dynamic import as a regular component.
>>>>>>> 26caa649827e8f8cadd24dfc420ea802dcbee246

**До:**

```js
import OtherComponent from './OtherComponent';
```

**Після:**

```js
const OtherComponent = React.lazy(() => import('./OtherComponent'));
```

Цей код автоматично завантажить бандл, що містить `OtherComponent`, коли цей компонент буде рендеритися вперше.

`React.lazy` приймає функцію, яка має викликати динамічний `import()`. Вона має повернути `Promise`, який при вирішенні поверне модуль з `default`-експортом, який містить React-компонент.

Ледачий компонент потім повинен відрендеритися у тілі компонента `Suspense`. Це дозволяє нам показати резервний контент (наприклад, індикатор завантаження), поки ми чекаємо на завантаження ледачого компонента.

```js
import React, { Suspense } from 'react';

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

Проп `fallback` приймає будь-який елемент React, який слід відобразити до повного завантаження компонента. Компонент `Suspense` можна розмістити де завгодно над "ледачим" компонентом. Ви навіть можете обгорнути кілька "ледачих" компонентів одним компонентом `Suspense`.

```js
import React, { Suspense } from 'react';

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

<<<<<<< HEAD
### Запобіжники {#error-boundaries}
=======
### Avoiding fallbacks {#avoiding-fallbacks}
Any component may suspend as a result of rendering, even components that were already shown to the user. In order for screen content to always be consistent, if an already shown component suspends, React has to hide its tree up to the closest `<Suspense>` boundary. However, from the user's perspective, this can be disorienting.

Consider this tab switcher:

```js
import React, { Suspense } from 'react';
import Tabs from './Tabs';
import Glimmer from './Glimmer';

const Comments = React.lazy(() => import('./Comments'));
const Photos = React.lazy(() => import('./Photos'));

function MyComponent() {
  const [tab, setTab] = React.useState('photos');
  
  function handleTabSelect(tab) {
    setTab(tab);
  };

  return (
    <div>
      <Tabs onTabSelect={handleTabSelect} />
      <Suspense fallback={<Glimmer />}>
        {tab === 'photos' ? <Photos /> : <Comments />}
      </Suspense>
    </div>
  );
}

```

In this example, if tab gets changed from `'photos'` to `'comments'`, but `Comments` suspends, the user will see a glimmer. This makes sense because the user no longer wants to see `Photos`, the `Comments` component is not ready to render anything, and React needs to keep the user experience consistent, so it has no choice but to show the `Glimmer` above.

However, sometimes this user experience is not desirable. In particular, it is sometimes better to show the "old" UI while the new UI is being prepared. You can use the new [`startTransition`](/docs/react-api.html#starttransition) API to make React do this:

```js
function handleTabSelect(tab) {
  startTransition(() => {
    setTab(tab);
  });
}
```

Here, you tell React that setting tab to `'comments'` is not an urgent update, but is a [transition](/docs/react-api.html#transitions) that may take some time. React will then keep the old UI in place and interactive, and will switch to showing `<Comments />` when it is ready. See [Transitions](/docs/react-api.html#transitions) for more info.

### Error boundaries {#error-boundaries}
>>>>>>> 26caa649827e8f8cadd24dfc420ea802dcbee246

Якщо інший модуль не зміг завантажитися (наприклад, через вимкнений інтернет), це призведе до помилки. Ви можете обробляти такі помилки, щоб створити гарний досвід користування і керувати відновленням за допомогою [Запобіжників](/docs/error-boundaries.html). Після створення запобіжника, його можна використовувати де завгодно над "ледачими" компонентами для того, щоб показати стан помилки, коли виникає проблема з мережею.

```js
import React, { Suspense } from 'react';
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

<<<<<<< HEAD
Вирішувати, де саме запроваджувати розбиття коду, часом буває непросто.
Слід намагатися обирати місця для розбиття таким чином, щоб розбивати бандли рівномірно,
але при цьому не створювати проблем для користувача.

Почати можна із маршрутів додатку. Більшість людей
звикли до того, що перехід між сторінками займає певний час. Крім того, ви часто
перезавантажуєте цілу сторінку одразу, тому користувачі навряд чи будуть взаємодіяти
з іншими елементами на сторінці в цей час.

Нижче наведено приклад налаштування розбиття коду на основі маршрутів, використовуючи
бібліотеку [React Router](https://reacttraining.com/react-router/) за допомогою `React.lazy`.
=======
Deciding where in your app to introduce code splitting can be a bit tricky. You want to make sure you choose places that will split bundles evenly, but won't disrupt the user experience.

A good place to start is with routes. Most people on the web are used to page transitions taking some amount of time to load. You also tend to be re-rendering the entire page at once so your users are unlikely to be interacting with other elements on the page at the same time.

Here's an example of how to setup route-based code splitting into your app using libraries like [React Router](https://reactrouter.com/) with `React.lazy`.
>>>>>>> 26caa649827e8f8cadd24dfc420ea802dcbee246

```js
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const Home = lazy(() => import('./routes/Home'));
const About = lazy(() => import('./routes/About'));

const App = () => (
  <Router>
<<<<<<< HEAD
    <Suspense fallback={<div>Завантаження...</div>}>
      <Switch>
        <Route exact path="/" component={Home}/>
        <Route path="/about" component={About}/>
      </Switch>
=======
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
>>>>>>> 26caa649827e8f8cadd24dfc420ea802dcbee246
    </Suspense>
  </Router>
);
```

## Іменовані Експорти {#named-exports}

Наразі `React.lazy` підтримує тільки експорти за замовчуванням. Якщо модуль, який ви імпортуєте, використовує іменовані експорти, можна створити проміжний модуль, який повторно експортуватиме потрібний компонент за замовчуванням. Це гарантуватиме працездатність tree shaking - механізму усунення невикористаного коду.

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
