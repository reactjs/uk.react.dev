---
id: react-dom
title: ReactDOM
layout: docs
category: Reference
permalink: docs/react-dom.html
---

<<<<<<< HEAD
Якщо ви завантажуєте React з тегу `<script>`, то API верхнього рівня доступні в глобальному об'єкті `ReactDOM`. Якщо ви використовуєте ES6 разом із npm, ви можете написати `import ReactDOM from 'react-dom'`, якщо ES5 -- `var ReactDOM = require('react-dom')`.
=======
The `react-dom` package provides DOM-specific methods that can be used at the top level of your app and as an escape hatch to get outside the React model if you need to.

```js
import * as ReactDOM from 'react-dom';
```

If you use ES5 with npm, you can write:

```js
var ReactDOM = require('react-dom');
```

The `react-dom` package also provides modules specific to client and server apps:
- [`react-dom/client`](/docs/react-dom-client.html)
- [`react-dom/server`](/docs/react-dom-server.html)
>>>>>>> e9faee62db6981e26a1cdabad6ae39620a1d2e3e

## Огляд {#overview}

<<<<<<< HEAD
Пакет `react-dom` надає специфічні для DOM методи, що можуть використовуватись на верхньому рівні вашого додатку, а також як запасний спосіб аби вийти з React моделі, якщо це необхідно. У більшості ваших компонентів вам не потрібно використовувати цей модуль.
=======
The `react-dom` package exports these methods:
- [`createPortal()`](#createportal)
- [`flushSync()`](#flushsync)
>>>>>>> e9faee62db6981e26a1cdabad6ae39620a1d2e3e

These `react-dom` methods are also exported, but are considered legacy:
- [`render()`](#render)
- [`hydrate()`](#hydrate)
- [`findDOMNode()`](#finddomnode)
- [`unmountComponentAtNode()`](#unmountcomponentatnode)

> Note: 
> 
> Both `render` and `hydrate` have been replaced with new [client methods](/docs/react-dom-client.html) in React 18. These methods will warn that your app will behave as if it's running React 17 (learn more [here](https://reactjs.org/link/switch-to-createroot)).

### Підтримка браузерів {#browser-support}

<<<<<<< HEAD
React підтримує всі популярні браузери, в тому числі Internet Explorer 9 і вище, хоча [деякі поліфіли необхідні](/docs/javascript-environment-requirements.html) для старіших браузерів, таких як IE 9 та IE 10.
=======
React supports all modern browsers, although [some polyfills are required](/docs/javascript-environment-requirements.html) for older versions.
>>>>>>> e9faee62db6981e26a1cdabad6ae39620a1d2e3e

> Примітка
>
<<<<<<< HEAD
> Ми не підтримуємо старі версії браузерів, які не підтримують методи ES5, але ви можете помітити, що ваш додаток працює і в них, якщо у вашу сторінку включено такі поліфіли, як [es5-shim та es5-sham](https://github.com/es-shims/es5-shim) включені в сторінку. Це тільки ваш вибір, якщо ви вирішити піти цим шляхом.

* * *
=======
> We do not support older browsers that don't support ES5 methods or microtasks such as Internet Explorer. You may find that your apps do work in older browsers if polyfills such as [es5-shim and es5-sham](https://github.com/es-shims/es5-shim) are included in the page, but you're on your own if you choose to take this path.
>>>>>>> e9faee62db6981e26a1cdabad6ae39620a1d2e3e

## Довідка {#reference}

### `createPortal()` {#createportal}

```javascript
createPortal(child, container)
```

<<<<<<< HEAD
Рендерить React-елемент у наданий `container` у DOM-і і повертає [реф](/docs/more-about-refs.html) на компонент (або повертає `null` для [компонентів без стану](/docs/components-and-props.html#function-and-class-components)).
=======
Creates a portal. Portals provide a way to [render children into a DOM node that exists outside the hierarchy of the DOM component](/docs/portals.html).

### `flushSync()` {#flushsync}

```javascript
flushSync(callback)
```

Force React to flush any updates inside the provided callback synchronously. This ensures that the DOM is updated immediately.

```javascript
// Force this state update to be synchronous.
flushSync(() => {
  setCount(count + 1);
});
// By this point, DOM is updated.
```

> Note:
> 
> `flushSync` can significantly hurt performance. Use sparingly.
> 
> `flushSync` may force pending Suspense boundaries to show their `fallback` state.
> 
> `flushSync` may also run pending effects and synchronously apply any updates they contain before returning.
> 
> `flushSync` may also flush updates outside the callback when necessary to flush the updates inside the callback. For example, if there are pending updates from a click, React may flush those before flushing the updates inside the callback.

## Legacy Reference {#legacy-reference}
### `render()` {#render}
```javascript
render(element, container[, callback])
```

> Note:
>
> `render` has been replaced with `createRoot` in React 18. See [createRoot](/docs/react-dom-client.html#createroot) for more info.

Render a React element into the DOM in the supplied `container` and return a [reference](/docs/more-about-refs.html) to the component (or returns `null` for [stateless components](/docs/components-and-props.html#function-and-class-components)).
>>>>>>> e9faee62db6981e26a1cdabad6ae39620a1d2e3e

Якщо React-елемент був попередньо відрендерений у `container`, цей метод виконає його оновлення і змінить DOM за необхідністю, щоб відобразити останній варіант React-елемента.

Якщо надано функцію зворотнього виклику, вона буде виконана після того, як компонент відрендериться або оновиться.

> Примітка:
>
<<<<<<< HEAD
> `ReactDOM.render()` контролює вміст вузла контейнера, який ви передаєте. Будь-який наявний DOM-елемент всередині буде замінено під час першого виклику. Наступні виклики використовують React-овий алгоритм різниці DOM-ів для ефективних оновлень.
>
> `ReactDOM.render()` не модифікує вузол контейнера (тільки модифікує нащадків). Також можливо вставити компонент у наявний DOM-вузол без перезапису наявних нащадків.
>
> `ReactDOM.render()` наразі повертає посилання на кореневий екземпляр `ReactComponent`. Однак використання значення, що повертається, є застарілим
> і його потрібно уникати, оскільки майбутні версії React можуть рендерити компоненти асинхронно в деяких випадках. Якщо вам потрібне посилання на корінь екземпляра `ReactComponent` кращим рішенням буде приєднати
> [реф зворотнього виклику](/docs/more-about-refs.html#the-ref-callback-attribute) до кореневого елементу.
>
> Використання `ReactDOM.render()` для гідратації відрендерених сервером контейнерів застаріле і буде видалено в React 17. Натомість використовуйте [`hydrate()`](#hydrate).
=======
> `render()` controls the contents of the container node you pass in. Any existing DOM elements inside are replaced when first called. Later calls use React’s DOM diffing algorithm for efficient updates.
>
> `render()` does not modify the container node (only modifies the children of the container). It may be possible to insert a component to an existing DOM node without overwriting the existing children.
>
> `render()` currently returns a reference to the root `ReactComponent` instance. However, using this return value is legacy
> and should be avoided because future versions of React may render components asynchronously in some cases. If you need a reference to the root `ReactComponent` instance, the preferred solution is to attach a
> [callback ref](/docs/refs-and-the-dom.html#callback-refs) to the root element.
>
> Using `render()` to hydrate a server-rendered container is deprecated. Use [`hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) instead.
>>>>>>> e9faee62db6981e26a1cdabad6ae39620a1d2e3e

* * *

### `hydrate()` {#hydrate}

```javascript
hydrate(element, container[, callback])
```

<<<<<<< HEAD
Такий же як [`render()`](#render), але використовується для гідратації контейнеру, HTML-вміст якого був відрендерений за допомогою [`ReactDOMServer`](/docs/react-dom-server.html). React буде намагатись приєднати слухачі подій до наявної розмітки.
=======
> Note:
>
> `hydrate` has been replaced with `hydrateRoot` in React 18. See [hydrateRoot](/docs/react-dom-client.html#hydrateroot) for more info.

Same as [`render()`](#render), but is used to hydrate a container whose HTML contents were rendered by [`ReactDOMServer`](/docs/react-dom-server.html). React will attempt to attach event listeners to the existing markup.
>>>>>>> e9faee62db6981e26a1cdabad6ae39620a1d2e3e

React очікує, що відрендерений вміст ідентичний між сервером та клієнтом. Він може виправляти різницю в текстовому вмісті, але ви повинні трактувати незбіжності як дефекти та виправити їх. У режимі розробника React попереджає про незбіжності під час гідратації. Немає гарантії, що відмінності атрибутів будуть виправлені у випадку незбіжностей. Це важливо з точки зору продуктивності, оскільки в багатьох додатках невідповідності трапляються рідко, тому проведення валідації всієї розмітки буде надзвичайно трудомістким.

Якщо єдиний атрибут елементу чи текстовий вміст відрізняється між сервером та клієнтом (для прикладу, мітка часу), ви можете відключити попередження, додавши `suppressHydrationWarning={true}` до елементу. Це працює тільки на першому рівні глибини і покликане бути запасним варіантом. Не зловживайте ним. За винятком текстового вмісту, React все ж не буде намагатись виправити його, тому він може залишитись різним до наступних оновлень.

Якщо вам потрібно відрендерити щось, що відрізняється на сервері та клієнті, ви можете зробити двопрохідний рендеринг. Компоненти, в яких є відмінності в рендерингу на клієнті, можуть читати змінну стану, наприклад, `this.state.isClient`, якій ви можете присвоїти `true` в `componentDidMount()`. Початковий прохід рендеру відрендерить той же вміст, що і на сервері, таким чином уникнувши незбіжностей, а додатковий прохід відбудеться синхронно відразу після гідратації. Зауважте, що такий спосіб зробить компоненти повільнішими, оскільки вони будуть рендеритись двічі, тому використовуйте його обережно.

Пам’ятайте про те, що користувачу має бути комфортно працювати при повільному з'єднанні. JavaScript-код може завантажитись набагато пізніше, ніж початковий HTML-рендер, тому якщо ви рендерите щось, що відрізняється тільки на стороні клієнта, перехід може бути незлагодженим. Однак, якщо спосіб двопрохідного рендерингу використано вдало, то рендеринг "оболонки" додатку на сервері і показ деяких віджетів лише на клієнті матиме свої переваги. Для того, щоб навчитись це робити і при цьому не отримати незбіжностей у розмітці, зверніться до пояснень у попередньому параграфі.

* * *

### `unmountComponentAtNode()` {#unmountcomponentatnode}

```javascript
unmountComponentAtNode(container)
```

<<<<<<< HEAD
Видаляє змонтований React-компонент з DOM-у та очищує обробників подій та стан. Якщо ніякий компонент не було змонтовано в контейнер, виклик цієї функції нічого не робить. Повертає `true`, якщо компонент було демонтовано та `false`, якщо не було ніякого компоненту, який би можна було демонтувати.
=======
> Note:
>
> `unmountComponentAtNode` has been replaced with `root.unmount()` in React 18. See [createRoot](/docs/react-dom-client.html#createroot) for more info.

Remove a mounted React component from the DOM and clean up its event handlers and state. If no component was mounted in the container, calling this function does nothing. Returns `true` if a component was unmounted and `false` if there was no component to unmount.
>>>>>>> e9faee62db6981e26a1cdabad6ae39620a1d2e3e

* * *

### `findDOMNode()` {#finddomnode}

> Примітка:
>
> `findDOMNode` — це запасний спосіб, що використовувався для доступу до базового DOM-вузла. У більшості випадків, використання цього способу не рекомендується, оскільки він порушує абстракцію компоненту. [Він визнаний застарілим в `StrictMode`.](/docs/strict-mode.html#warning-about-deprecated-finddomnode-usage)

```javascript
findDOMNode(component)
```
Якщо цей компонент був змонтований у DOM, цей метод поверне відповідний нативний браузерний DOM-елемент. Цей метод корисний для читання значення з DOM-у, таких як значення полів форми та вимірювань DOM. **У більшості випадків, ви можете приєднати ref до DOM-вузла і уникнути використання `findDOMNode` взагалі.**

Якщо компонент рендериться в `null` або `false`, `findDOMNode` повертає `null`. Коли компонент рендериться в рядок, `findDOMNode` повертає текстовий DOM-вузол, який містить значення. Починаючи з React 16, компонент може повертати фрагмент з декількома дочірніми елементами, в цьому випадку `findDOMNode` поверне DOM-вузол, що відповідає першому не порожньому нащадку.

> Примітка:
>
> `findDOMNode` працює тільки на змонтованих компонентах (тобто таких компонентах, що були розміщені в DOM-і). Якщо ви спробуєте викликати цей метод на компоненті, який ще не було змонтовано (для прикладу, викликати `findDOMNode()` у `render()` методі компоненту, який ще тільки буде створено), то отримаєте помилку.
>
> `findDOMNode` не може використовуватись з функціональними компонентами.

* * *
<<<<<<< HEAD

### `createPortal()` {#createportal}

```javascript
ReactDOM.createPortal(child, container)
```

Створює портал. Портали надають можливість [рендерити дочірні елементи у DOM-вузол, який існує за межами ієрархії DOM-компонента](/docs/portals.html).
=======
>>>>>>> e9faee62db6981e26a1cdabad6ae39620a1d2e3e
