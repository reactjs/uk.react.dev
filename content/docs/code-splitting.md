---
id: code-splitting
title: Розбиття коду
permalink: docs/code-splitting.html
---

<div class="scary">

> These docs are old and won't be updated. Go to [react.dev](https://react.dev/) for the new React docs.
> 
> These new documentation pages teach modern React and include live examples:
>
> - [`lazy`](https://react.dev/reference/react/lazy)
> - [`<Suspense>`](https://react.dev/reference/react/Suspense)

</div>

## Зшивання файлів {#bundling}

Файли більшості React-додатків зшиваються разом за допомогою таких інструментів, як [Webpack](https://webpack.js.org/), [Rollup](https://rollupjs.org/) та [Browserify](http://browserify.org/). Зшивання (бандлінг) – це процес об'єднання імпортованих файлів в один файл – бандл.
Цей бандл потім може бути включений до веб-сторінки для завантаження всього додатку
одночасно.

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

Якщо ви використовуєте [Create React App](https://create-react-app.dev/), [Next.js](https://nextjs.org/), [Gatsby](https://www.gatsbyjs.org/) чи подібний інструмент, Webpack за замовчуванням налаштований для бандлінгу вашого додатку.

Якщо ви не використовуєте нічого з наведеного чи подібного, вам доведеться налаштувати бандлінг самостійно. Для прикладів ознайомтеся зі [Встановленням](https://webpack.js.org/guides/installation/) та [Початком роботи](https://webpack.js.org/guides/getting-started/) в офіційній 
документації Webpack.

## Розбиття Коду {#code-splitting}

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

Коли Webpack стикається з таким синтаксисом, він автоматично починає розбивати код вашого додатку.
Якщо ви користуєтесь Create React App, він вже налаштований відповідним чином, і ви можете одразу почати [користуватися розбиттям коду](https://create-react-app.dev/docs/code-splitting/). У [Next.js](https://nextjs.org/docs/advanced-features/dynamic-import) розбиття коду також підтримується за замовчуванням.

Під час самостійного налаштування Webpack, скоріш за все, у вас з'явиться бажання прочитати [інструкцію з розбиття коду](https://webpack.js.org/guides/code-splitting/) від Webpack. Конфігурація вашого Webpack повинна мати вигляд, [схожий на цей](https://gist.github.com/gaearon/ca6e803f5c604d37468b0091d9959269).

В разі використання [Babel](https://babeljs.io/) ви маєте пересвідчитись в тому, що Babel може парсити синтаксис динамічного import(), але не перетворює його.
Для цього вам знадобиться [@babel/plugin-syntax-dynamic-import](https://classic.yarnpkg.com/en/package/@babel/plugin-syntax-dynamic-import).

## `React.lazy` {#reactlazy}

Функція `React.lazy` дозволяє вам рендерити динамічний import як звичайний компонент

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

### Запобіжники {#error-boundaries}

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

Вирішувати, де саме запроваджувати розбиття коду, часом буває непросто.
Слід намагатися обирати місця для розбиття таким чином, щоб розбивати бандли рівномірно,
але при цьому не створювати проблем для користувача.

Почати можна із маршрутів додатку. Більшість людей
звикли до того, що перехід між сторінками займає певний час. Крім того, ви часто
перезавантажуєте цілу сторінку одразу, тому користувачі навряд чи будуть взаємодіяти
з іншими елементами на сторінці в цей час.

Нижче наведено приклад налаштування розбиття коду на основі маршрутів, використовуючи
бібліотеку [React Router](https://reactrouter.com/) за допомогою `React.lazy`.

```js
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const Home = lazy(() => import('./routes/Home'));
const About = lazy(() => import('./routes/About'));

const App = () => (
  <Router>
    <Suspense fallback={<div>Завантаження...</div>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
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
