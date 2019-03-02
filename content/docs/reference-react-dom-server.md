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

- [`renderToNodeStream()`](#rendertonodestream)
- [`renderToStaticNodeStream()`](#rendertostaticnodestream)

* * *

## Довідка {#reference}

### `renderToString()` {#rendertostring}

```javascript
ReactDOMServer.renderToString(element)
```

Відрендерить React-елемент до початкового HTML. React поверне HTML-рядок. Цей метод можна використовувати для створення HTML на сервері та надсилання цієї розмітки на початковому запиті для більш швидкого завантаження сторінок. Це також дозволяє пошуковим системам сканувати ваші сторінки для цілей SEO.

Якщо ви викликаєте [`ReactDOM.hydrate()`](/docs/react-dom.html#hydrate) на вузлі, який вже відрендерив на сервері цю розмітку, то React збереже її і додасть обробники подій, дозволяючи вам мати дуже продуктивне завантаження.

* * *

### `renderToStaticMarkup()` {#rendertostaticmarkup}

```javascript
ReactDOMServer.renderToStaticMarkup(element)
```

Цей метод подібний до [`renderToString`](#rendertostring), за винятком того, що він не створює додаткових атрибутів DOM, які React використовує внутрішньо, наприклад `data-reactroot`. Це корисно, якщо ви хочете використовувати React, як генератор простих статичних сторінок, оскільки видалення атрибутів може зберегти декілька байтів.

Якщо ви плануєте використовувати React на клієнтській стороні, щоб зробити розмітку інтерактивною, то не використовуйте цей метод. Замість цього використовуйте [`renderToString`](#rendertostring) на сервері та [`ReactDOM.hydrate()`](/docs/react-dom.html#hydrate) клієнті.

* * *

### `renderToNodeStream()` {#rendertonodestream}

```javascript
ReactDOMServer.renderToNodeStream(element)
```

Відрендерить React-елемент до початкового HTML. Потім поверне [Зчитуваний потік (Readable stream)](https://nodejs.org/api/stream.html#stream_readable_streams), який виводить HTML-рядок. Вивід HTML цього потоку в точності дорівнює тому, що [`ReactDOMServer.renderToString`](#rendertostring) поверне. Цей метод можна використовувати для створення HTML на сервері та надсилання цієї розмітки на початковому запиті для більш швидкого завантаження сторінок. Це також дозволяє пошуковим системам сканувати ваші сторінки для цілей SEO.

Якщо ви викликаєте [`ReactDOM.hydrate()`](/docs/react-dom.html#hydrate) на вузлі, який вже відрендерив на сервері цю розмітку, то React збереже її і додасть обробники подій, дозволяючи вам мати дуже продуктивне завантаження.

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

Якщо ви плануєте використовувати React на клієнтській стороні, щоб зробити розмітку інтерактивною, то не використовуйте цей метод. Замість цього використовуйте [`renderToNodeStream`](#rendertonodestream) на сервері та [`ReactDOM.hydrate()`](/docs/react-dom.html#hydrate) на клієнті.

> Note:
>
> Цей API недоступний у браузерах — тільки для серверів.
>
> Потік, повернений з цього методу поверне потік байтів закодованих у utf-8. Якщо вам потрібен потік в іншому кодуванні, перегляньте проект типу [iconv-lite](https://www.npmjs.com/package/iconv-lite), який забезпечує перетворення потоків для перекодування тексту.
