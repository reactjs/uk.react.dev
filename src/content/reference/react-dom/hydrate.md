---
title: hydrate
---

<Deprecated>

Цей API буде виключено з майбутньої основної версії React.

У React 18 `hydrate` був замінений на [`hydrateRoot`.](/reference/react-dom/client/hydrateRoot) Використання `hydrate` у React 18 викличе попередження, що ваш застосунок буде поводитися так, наче використовує React 17. Дізнайтеся більше [тут.](/blog/2022/03/08/react-18-upgrade-guide#updates-to-client-rendering-apis)

</Deprecated>

<Intro>

`hydrate` дозволяє відображати React-компоненти всередині браузерного DOM-вузла, HTML-вміст якого був попередньо згенерований, використовуючи [`react-dom/server`](/reference/react-dom/server) з React 17 чи ранішої версії.

```js
hydrate(reactNode, domNode, callback?)
```

</Intro>

<InlineToc />

---

## Опис {/*reference*/}

### `hydrate(reactNode, domNode, callback?)` {/*hydrate*/}

Викличте `hydrate` у React 17 і раніших версіях, щоб "прикріпити" React до наявного HTML, який попередньо був відрендерений у серверному середовищі.

```js
import { hydrate } from 'react-dom';

hydrate(reactNode, domNode);
```

React прикріпиться до HTML, що знаходиться всередині `domNode`, і візьме на себе управління DOM у ньому. Застосунок, повністю створений за допомогою React, зазвичай матиме тільки один виклик `hydrate` у кореневому компоненті.

[Перегляньте більше прикладів нижче.](#usage)

#### Параметри {/*parameters*/}

* `reactNode`: "React-вузол", який використовується для рендеру наявного HTML. Зазвичай це буде якийсь JSX, наприклад `<App />`, що був відрендерений методом `ReactDOM Server`, як-от `renderToString(<App />)` з React 17.

* `domNode`: [DOM-елемент](https://developer.mozilla.org/en-US/docs/Web/API/Element), що був відрендерений як кореневий елемент на стороні сервера.

* **опційний**: `callback`: Функція. Якщо передана, React викличе її після гідрації вашого компонента.

#### Результат {/*returns*/}

`hydrate` повертає null.

#### Застереження {/*caveats*/}
* `hydrate` очікує, що відрендерений вміст має бути ідентичним до того, який би відрендерив сервер. React може виправляти розбіжності у тексті, але вам слід сприймати невідповідності як помилки та виправляти їх cамі.
* У режимі розробки React попереджає про розбіжності під час гідрації. Немає жодних гарантій, що різниця в атрибутах буде виправлена у випадку розбіжностей. Це важливо для швидкодії, оскільки у більшості застосунків розбіжності трапляються рідко, валідація всієї розмітки була б занадто витратною.
* Ви переважно будете викликати `hydrate` лише один раз. Якщо ви використовуєте фреймворк, він може робити це за вас.
* Якщо ваш застосунок рендериться на стороні клієнта без попередньо відрендереного HTML, використання `hydrate()` не підтримується. Використовуйте [render()](/reference/react-dom/render) (для React 17 і раніших версій) або [createRoot()](/reference/react-dom/client/createRoot) (для React 18+) натомість.

---

## Використання {/*usage*/}

Викличте `hydrate`, щоб прикріпити <CodeStep step={1}>React-компонент</CodeStep> до відрендереного на стороні сервера <CodeStep step={2}>браузерного DOM-вузла</CodeStep>.

```js [[1, 3, "<App />"], [2, 3, "document.getElementById('root')"]]
import { hydrate } from 'react-dom';

hydrate(<App />, document.getElementById('root'));
```

Використання `hydrate()` для рендеру повністю клієнтського застосунку (застосунок без HTML, що рендериться на стороні сервера) не підтримується. Використовуйте [`render()`](/reference/react-dom/render) (для React 17 і раніших версій) або [`createRoot()`](/reference/react-dom/client/createRoot) (для React 18+) натомість.

### Гідрація відрендереного сервером HTML {/*hydrating-server-rendered-html*/}

У React "гідрація" — це те, як React "прикріплюється" до наявного HTML, попередньо відрендереного у серверному середовищі за допомогою React. Під час гідрації React спробує додати слухачі подій до наявної розмітки та взяти на себе рендеринг застосунку на стороні клієнта.

У застосунках, повністю створених за допомогою React, **ви зазвичай гідруватиме лише один "корінь" один раз під час запуску всього вашого застосунку**.

<Sandpack>

```html public/index.html
<!--
  Вміст HTML усередині <div id="root">...</div>
  був згенерований, починаючи з компонента App, за допомогою react-dom/server.
-->
<div id="root"><h1>Hello, world!</h1></div>
```

```js index.js active
import './styles.css';
import { hydrate } from 'react-dom';
import App from './App.js';

hydrate(<App />, document.getElementById('root'));
```

```js App.js
export default function App() {
  return <h1>Hello, world!</h1>;
}
```

</Sandpack>

Зазвичай ви не повинні викликати `hydrate` знову або в інших місцях також. З цього моменту React буде керувати DOM вашого застосунку. Щоб оновлювати UI, ваші компоненти [використовуватимуть стан.](/reference/react/useState)

Щоб отримати більше інформації про гідрацію, перегляньте документацію [`hydrateRoot`.](/reference/react-dom/client/hydrateRoot)

---

### Приховування неминучих помилок розбіжності під час гідрації {/*suppressing-unavoidable-hydration-mismatch-errors*/}

Якщо атрибут або текстовий вміст хоча б одного елемента неминуче відрізняється на стороні сервера та клієнта (наприклад, часова мітка), ви можете приховати попередження про розбіжності під час гідрації.

Щоб приховати гідраційні попередження в елементі, додайте `suppressHydrationWarning={true}`:

<Sandpack>

```html public/index.html
<!--
  Вміст HTML усередині <div id="root">...</div>
  був згенерований, починаючи з компонента App, за допомогою react-dom/server.
-->
<div id="root"><h1>Поточна дата: 01/01/2020</h1></div>
```

```js index.js
import './styles.css';
import { hydrate } from 'react-dom';
import App from './App.js';

hydrate(<App />, document.getElementById('root'));
```

```js App.js active
export default function App() {
  return (
    <h1 suppressHydrationWarning={true}>
      Поточна дата: {new Date().toLocaleDateString()}
    </h1>
  );
}
```

</Sandpack>

Це працює лише на один рівень вглиб і створено як запасний варіант. Не використовуйте його занадто часто. Якщо це не текстовий вміст, React не намагатиметься виправити розбіжність, тож вона може залишитися до майбутніх оновлень стану.

---

### Робота з вмістом, що різниться на стороні клієнта та сервера {/*handling-different-client-and-server-content*/}

Якщо вам потрібно відрендерити різний вміст на стороні сервера та клієнта, ви можете зробити двоетапний рендеринг. Компоненти, які рендерять щось інше на стороні клієнта, можуть використовувати [змінну стану](/reference/react/useState), наприклад `isClient`, яку ви можете змінити на `true` в [ефекті](/reference/react/useEffect):

<Sandpack>

```html public/index.html
<!--
  Вміст HTML усередині <div id="root">...</div>
  був згенерований, починаючи з компонента App, за допомогою react-dom/server.
-->
<div id="root"><h1>Це сервер</h1></div>
```

```js index.js
import './styles.css';
import { hydrate } from 'react-dom';
import App from './App.js';

hydrate(<App />, document.getElementById('root'));
```

```js App.js active
import { useState, useEffect } from "react";

export default function App() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <h1>
      {isClient ? 'Це клієнт' : 'Це сервер'}
    </h1>
  );
}
```

</Sandpack>

Отже, початковий рендер відрендерить вміст такий же, як і на стороні сервера, уникаючи розбіжностей, однак, синхронно й одразу після гідрації відбудеться додатковий рендер.

<Pitfall>

Цей підхід сповільнює процес гідрації, тому що ваші компоненти рендеряться двічі. Пам'ятайте про досвід користувача у разі повільного з'єднання. JavaScript-код може завантажитися значно пізніше, ніж відрендериться початковий HTML, тому рендер іншого UI одразу після гідрації може відчуватися для користувача різким.

</Pitfall>
