---
id: react-dom-server
title: ReactDOMServer
layout: docs
category: Reference
permalink: docs/react-dom-server.html
---

Об'єкт `ReactDOMServer` дає змогу рендерити компоненти у статичну розмітку. Як правило, він використовується на Node сервері:

```js
// ES modules
import ReactDOMServer from 'react-dom/server';
// CommonJS
var ReactDOMServer = require('react-dom/server');
```

## Огляд {#overview}

Наступні методи можуть бути використані і на сервері, і у середовищах браузера:

- [`renderToString()`](#rendertostring)
- [`renderToStaticMarkup()`](#rendertostaticmarkup)

А ці додаткові методи залежать від пакунку (`stream`), який **доступний тільки на сервері** і не працюватиме у браузері.

- [`renderToPipeableStream()`](#rendertopipeablestream)
- [`renderToReadableStream()`](#rendertoreadablestream)
- [`renderToNodeStream()`](#rendertonodestream) (Deprecated)
- [`renderToStaticNodeStream()`](#rendertostaticnodestream)

* * *

## Довідка {#reference}

### `renderToString()` {#rendertostring}

```javascript
ReactDOMServer.renderToString(element)
```

Відрендерить React-елемент до початкового HTML. React поверне HTML-рядок. Цей метод можна використовувати для створення HTML на сервері та надсилання цієї розмітки на початковому запиті для більш швидкого завантаження сторінок. Це також дозволяє пошуковим системам сканувати ваші сторінки для цілей SEO.

<<<<<<< HEAD
Якщо ви викликаєте [`ReactDOM.hydrate()`](/docs/react-dom.html#hydrate) на вузлі, який вже відрендерив на сервері цю розмітку, то React збереже її і додасть обробники подій, дозволяючи вам мати дуже продуктивне завантаження.
=======
If you call [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) on a node that already has this server-rendered markup, React will preserve it and only attach event handlers, allowing you to have a very performant first-load experience.
>>>>>>> 707f22d25f5b343a2e5e063877f1fc97cb1f48a1

* * *

### `renderToStaticMarkup()` {#rendertostaticmarkup}

```javascript
ReactDOMServer.renderToStaticMarkup(element)
```

Цей метод подібний до [`renderToString`](#rendertostring), за винятком того, що він не створює додаткових атрибутів DOM, які React використовує внутрішньо, наприклад `data-reactroot`. Це корисно, якщо ви хочете використовувати React, як генератор простих статичних сторінок, оскільки видалення атрибутів може зберегти декілька байтів.

<<<<<<< HEAD
Якщо ви плануєте використовувати React на клієнтській стороні, щоб зробити розмітку інтерактивною, то не використовуйте цей метод. Замість цього використовуйте [`renderToString`](#rendertostring) на сервері та [`ReactDOM.hydrate()`](/docs/react-dom.html#hydrate) клієнті.
=======
If you plan to use React on the client to make the markup interactive, do not use this method. Instead, use [`renderToString`](#rendertostring) on the server and [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) on the client.
>>>>>>> 707f22d25f5b343a2e5e063877f1fc97cb1f48a1

* * *

### `renderToPipeableStream()` {#rendertopipeablestream}

```javascript
ReactDOMServer.renderToPipeableStream(element, options)
```

Render a React element to its initial HTML. Returns a [Control object](https://github.com/facebook/react/blob/3f8990898309c61c817fbf663f5221d9a00d0eaa/packages/react-dom/src/server/ReactDOMFizzServerNode.js#L49-L54) that allows you to pipe the output or abort the request. Fully supports Suspense and streaming of HTML with "delayed" content blocks "popping in" later through javascript execution. [Read more](https://github.com/reactwg/react-18/discussions/37)

If you call [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) on a node that already has this server-rendered markup, React will preserve it and only attach event handlers, allowing you to have a very performant first-load experience.

> Note:
>
> This is a Node.js specific API and modern server environments should use renderToReadableStream instead.
>

```
const {pipe, abort} = renderToPipeableStream(
  <App />,
  {
    onAllReady() {
      res.statusCode = 200;
      res.setHeader('Content-type', 'text/html');
      pipe(res);
    },
    onShellError(x) {
      res.statusCode = 500;
      res.send(
        '<!doctype html><p>Loading...</p><script src="clientrender.js"></script>'
      );
    }
  }
);
```

* * *

### `renderToReadableStream()` {#rendertoreadablestream}

```javascript
    ReactDOMServer.renderToReadableStream(element, options);
```

Streams a React element to its initial HTML. Returns a [Readable Stream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream). Fully supports Suspense and streaming of HTML. [Read more](https://github.com/reactwg/react-18/discussions/127)

If you call [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) on a node that already has this server-rendered markup, React will preserve it and only attach event handlers, allowing you to have a very performant first-load experience.

```
let controller = new AbortController();
try {
  let stream = await renderToReadableStream(
    <html>
      <body>Success</body>
    </html>,
    {
      signal: controller.signal,
    }
  );
  
  // This is to wait for all suspense boundaries to be ready. You can uncomment
  // this line if you don't want to stream to the client
  // await stream.allReady;

  return new Response(stream, {
    headers: {'Content-Type': 'text/html'},
  });
} catch (error) {
  return new Response(
    '<!doctype html><p>Loading...</p><script src="clientrender.js"></script>',
    {
      status: 500,
      headers: {'Content-Type': 'text/html'},
    }
  );
}
```
* * *

### `renderToNodeStream()` {#rendertonodestream} (Deprecated)

```javascript
ReactDOMServer.renderToNodeStream(element)
```

Відрендерить React-елемент до початкового HTML. Потім поверне [Зчитуваний потік (Readable stream)](https://nodejs.org/api/stream.html#stream_readable_streams), який виводить HTML-рядок. Вивід HTML цього потоку в точності дорівнює тому, що [`ReactDOMServer.renderToString`](#rendertostring) поверне. Цей метод можна використовувати для створення HTML на сервері та надсилання цієї розмітки на початковому запиті для більш швидкого завантаження сторінок. Це також дозволяє пошуковим системам сканувати ваші сторінки для цілей SEO.

<<<<<<< HEAD
Якщо ви викликаєте [`ReactDOM.hydrate()`](/docs/react-dom.html#hydrate) на вузлі, який вже відрендерив на сервері цю розмітку, то React збереже її і додасть обробники подій, дозволяючи вам мати дуже продуктивне завантаження.
=======
If you call [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) on a node that already has this server-rendered markup, React will preserve it and only attach event handlers, allowing you to have a very performant first-load experience.
>>>>>>> 707f22d25f5b343a2e5e063877f1fc97cb1f48a1

> Note:
>
> Цей API недоступний у браузерах — тільки для серверів.
>
> Потік, повернений з цього методу поверне потік байтів закодованих у utf-8. Якщо вам потрібен потік в іншому кодуванні, перегляньте проект типу [iconv-lite](https://www.npmjs.com/package/iconv-lite), який забезпечує перетворення потоків для перекодування тексту.

* * *

### `renderToStaticNodeStream()` {#rendertostaticnodestream}

```javascript
ReactDOMServer.renderToStaticNodeStream(element)
```

Аналогічно [`renderToNodeStream`](#rendertonodestream), за винятком того, що він не створює додаткових атрибутів DOM, які React використовує внутрішньо, наприклад `data-reactroot`. Це корисно, якщо ви хочете використовувати React, як генератор простих статичних сторінок, оскільки видалення атрибутів може зберегти декілька байтів.

Вихідний HTML цього потоку в точності дорівнює тому, що [`ReactDOMServer.renderToStaticMarkup`](#rendertostaticmarkup) поверне.

<<<<<<< HEAD
Якщо ви плануєте використовувати React на клієнтській стороні, щоб зробити розмітку інтерактивною, то не використовуйте цей метод. Замість цього використовуйте [`renderToNodeStream`](#rendertonodestream) на сервері та [`ReactDOM.hydrate()`](/docs/react-dom.html#hydrate) на клієнті.
=======
If you plan to use React on the client to make the markup interactive, do not use this method. Instead, use [`renderToNodeStream`](#rendertonodestream) on the server and [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) on the client.
>>>>>>> 707f22d25f5b343a2e5e063877f1fc97cb1f48a1

> Note:
>
> Цей API недоступний у браузерах — тільки для серверів.
>
> Потік, повернений з цього методу поверне потік байтів закодованих у utf-8. Якщо вам потрібен потік в іншому кодуванні, перегляньте проект типу [iconv-lite](https://www.npmjs.com/package/iconv-lite), який забезпечує перетворення потоків для перекодування тексту.
