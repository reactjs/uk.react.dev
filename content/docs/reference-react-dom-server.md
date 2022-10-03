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
import * as ReactDOMServer from 'react-dom/server';
// CommonJS
var ReactDOMServer = require('react-dom/server');
```

## Огляд {#overview}

<<<<<<< HEAD
Наступні методи можуть бути використані і на сервері, і у середовищах браузера:
=======
These methods are only available in the **environments with [Node.js Streams](https://nodejs.dev/learn/nodejs-streams):**

- [`renderToPipeableStream()`](#rendertopipeablestream)
- [`renderToNodeStream()`](#rendertonodestream) (Deprecated)
- [`renderToStaticNodeStream()`](#rendertostaticnodestream)

These methods are only available in the **environments with [Web Streams](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API)** (this includes browsers, Deno, and some modern edge runtimes):

- [`renderToReadableStream()`](#rendertoreadablestream)

The following methods can be used in the environments that don't support streams:
>>>>>>> 664dd5736287e01a4557cd03c9a8736682911b34

- [`renderToString()`](#rendertostring)
- [`renderToStaticMarkup()`](#rendertostaticmarkup)

<<<<<<< HEAD
А ці додаткові методи залежать від пакунку (`stream`), який **доступний тільки на сервері** і не працюватиме у браузері.

- [`renderToNodeStream()`](#rendertonodestream)
- [`renderToStaticNodeStream()`](#rendertostaticnodestream)

* * *

## Довідка {#reference}
=======
## Reference {#reference}
>>>>>>> 664dd5736287e01a4557cd03c9a8736682911b34

### `renderToPipeableStream()` {#rendertopipeablestream}

```javascript
ReactDOMServer.renderToPipeableStream(element, options)
```

<<<<<<< HEAD
Відрендерить React-елемент до початкового HTML. React поверне HTML-рядок. Цей метод можна використовувати для створення HTML на сервері та надсилання цієї розмітки на початковому запиті для більш швидкого завантаження сторінок. Це також дозволяє пошуковим системам сканувати ваші сторінки для цілей SEO.

Якщо ви викликаєте [`ReactDOM.hydrate()`](/docs/react-dom.html#hydrate) на вузлі, який вже відрендерив на сервері цю розмітку, то React збереже її і додасть обробники подій, дозволяючи вам мати дуже продуктивне завантаження.
=======
Render a React element to its initial HTML. Returns a stream with a `pipe(res)` method to pipe the output and `abort()` to abort the request. Fully supports Suspense and streaming of HTML with "delayed" content blocks "popping in" via inline `<script>` tags later. [Read more](https://github.com/reactwg/react-18/discussions/37)

If you call [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) on a node that already has this server-rendered markup, React will preserve it and only attach event handlers, allowing you to have a very performant first-load experience.

```javascript
let didError = false;
const stream = renderToPipeableStream(
  <App />,
  {
    onShellReady() {
      // The content above all Suspense boundaries is ready.
      // If something errored before we started streaming, we set the error code appropriately.
      res.statusCode = didError ? 500 : 200;
      res.setHeader('Content-type', 'text/html');
      stream.pipe(res);
    },
    onShellError(error) {
      // Something errored before we could complete the shell so we emit an alternative shell.
      res.statusCode = 500;
      res.send(
        '<!doctype html><p>Loading...</p><script src="clientrender.js"></script>'
      );
    },
    onAllReady() {
      // If you don't want streaming, use this instead of onShellReady.
      // This will fire after the entire page content is ready.
      // You can use this for crawlers or static generation.

      // res.statusCode = didError ? 500 : 200;
      // res.setHeader('Content-type', 'text/html');
      // stream.pipe(res);
    },
    onError(err) {
      didError = true;
      console.error(err);
    },
  }
);
```

See the [full list of options](https://github.com/facebook/react/blob/14c2be8dac2d5482fda8a0906a31d239df8551fc/packages/react-dom/src/server/ReactDOMFizzServerNode.js#L36-L46).

> Note:
>
> This is a Node.js-specific API. Environments with [Web Streams](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API), like Deno and modern edge runtimes, should use [`renderToReadableStream`](#rendertoreadablestream) instead.
>
>>>>>>> 664dd5736287e01a4557cd03c9a8736682911b34

* * *

### `renderToReadableStream()` {#rendertoreadablestream}

```javascript
ReactDOMServer.renderToReadableStream(element, options);
```

<<<<<<< HEAD
Цей метод подібний до [`renderToString`](#rendertostring), за винятком того, що він не створює додаткових атрибутів DOM, які React використовує внутрішньо, наприклад `data-reactroot`. Це корисно, якщо ви хочете використовувати React, як генератор простих статичних сторінок, оскільки видалення атрибутів може зберегти декілька байтів.

Якщо ви плануєте використовувати React на клієнтській стороні, щоб зробити розмітку інтерактивною, то не використовуйте цей метод. Замість цього використовуйте [`renderToString`](#rendertostring) на сервері та [`ReactDOM.hydrate()`](/docs/react-dom.html#hydrate) клієнті.
=======
Streams a React element to its initial HTML. Returns a Promise that resolves to a [Readable Stream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream). Fully supports Suspense and streaming of HTML. [Read more](https://github.com/reactwg/react-18/discussions/127)

If you call [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) on a node that already has this server-rendered markup, React will preserve it and only attach event handlers, allowing you to have a very performant first-load experience.

```javascript
let controller = new AbortController();
let didError = false;
try {
  let stream = await renderToReadableStream(
    <html>
      <body>Success</body>
    </html>,
    {
      signal: controller.signal,
      onError(error) {
        didError = true;
        console.error(error);
      }
    }
  );
  
  // This is to wait for all Suspense boundaries to be ready. You can uncomment
  // this line if you want to buffer the entire HTML instead of streaming it.
  // You can use this for crawlers or static generation:

  // await stream.allReady;

  return new Response(stream, {
    status: didError ? 500 : 200,
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

See the [full list of options](https://github.com/facebook/react/blob/14c2be8dac2d5482fda8a0906a31d239df8551fc/packages/react-dom/src/server/ReactDOMFizzServerBrowser.js#L27-L35).

> Note:
>
> This API depends on [Web Streams](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API). For Node.js, use [`renderToPipeableStream`](#rendertopipeablestream) instead.
>
>>>>>>> 664dd5736287e01a4557cd03c9a8736682911b34

* * *

### `renderToNodeStream()`  (Deprecated) {#rendertonodestream}

```javascript
ReactDOMServer.renderToNodeStream(element)
```

<<<<<<< HEAD
Відрендерить React-елемент до початкового HTML. Потім поверне [Зчитуваний потік (Readable stream)](https://nodejs.org/api/stream.html#stream_readable_streams), який виводить HTML-рядок. Вивід HTML цього потоку в точності дорівнює тому, що [`ReactDOMServer.renderToString`](#rendertostring) поверне. Цей метод можна використовувати для створення HTML на сервері та надсилання цієї розмітки на початковому запиті для більш швидкого завантаження сторінок. Це також дозволяє пошуковим системам сканувати ваші сторінки для цілей SEO.

Якщо ви викликаєте [`ReactDOM.hydrate()`](/docs/react-dom.html#hydrate) на вузлі, який вже відрендерив на сервері цю розмітку, то React збереже її і додасть обробники подій, дозволяючи вам мати дуже продуктивне завантаження.
=======
Render a React element to its initial HTML. Returns a [Node.js Readable stream](https://nodejs.org/api/stream.html#stream_readable_streams) that outputs an HTML string. The HTML output by this stream is exactly equal to what [`ReactDOMServer.renderToString`](#rendertostring) would return. You can use this method to generate HTML on the server and send the markup down on the initial request for faster page loads and to allow search engines to crawl your pages for SEO purposes.

If you call [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) on a node that already has this server-rendered markup, React will preserve it and only attach event handlers, allowing you to have a very performant first-load experience.
>>>>>>> 664dd5736287e01a4557cd03c9a8736682911b34

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
>>>>>>> 664dd5736287e01a4557cd03c9a8736682911b34

> Note:
>
> Цей API недоступний у браузерах — тільки для серверів.
>
<<<<<<< HEAD
> Потік, повернений з цього методу поверне потік байтів закодованих у utf-8. Якщо вам потрібен потік в іншому кодуванні, перегляньте проект типу [iconv-lite](https://www.npmjs.com/package/iconv-lite), який забезпечує перетворення потоків для перекодування тексту.
=======
> The stream returned from this method will return a byte stream encoded in utf-8. If you need a stream in another encoding, take a look at a project like [iconv-lite](https://www.npmjs.com/package/iconv-lite), which provides transform streams for transcoding text.

* * *

### `renderToString()` {#rendertostring}

```javascript
ReactDOMServer.renderToString(element)
```

Render a React element to its initial HTML. React will return an HTML string. You can use this method to generate HTML on the server and send the markup down on the initial request for faster page loads and to allow search engines to crawl your pages for SEO purposes.

If you call [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) on a node that already has this server-rendered markup, React will preserve it and only attach event handlers, allowing you to have a very performant first-load experience.

> Note
>
> This API has limited Suspense support and does not support streaming.
>
> On the server, it is recommended to use either [`renderToPipeableStream`](#rendertopipeablestream) (for Node.js) or [`renderToReadableStream`](#rendertoreadablestream) (for Web Streams) instead.

* * *

### `renderToStaticMarkup()` {#rendertostaticmarkup}

```javascript
ReactDOMServer.renderToStaticMarkup(element)
```

Similar to [`renderToString`](#rendertostring), except this doesn't create extra DOM attributes that React uses internally, such as `data-reactroot`. This is useful if you want to use React as a simple static page generator, as stripping away the extra attributes can save some bytes.

If you plan to use React on the client to make the markup interactive, do not use this method. Instead, use [`renderToString`](#rendertostring) on the server and [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) on the client.
>>>>>>> 664dd5736287e01a4557cd03c9a8736682911b34
