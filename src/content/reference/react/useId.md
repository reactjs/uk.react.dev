---
title: useId
---

<Intro>

`useId` is a React Hook for generating unique IDs that can be passed to accessibility attributes.

`useId` — це хук для генерації унікальних ID, які можуть передаватись як атрибути доступності.

```js
const id = useId()
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `useId()` {/*useid*/}

Викличте `useId` на верхньому рівні вашого компонента, щоб згенерувати унікальне ID:

```js
import { useId } from 'react';

function PasswordField() {
  const passwordHintId = useId();
  // ...
```

[Перегляньте більше прикладів нижче.](#usage)

#### Параметри {/*parameters*/}

`useId` не приймає ніяких параметрів.

#### Результат {/*returns*/}

`useId` повертає унікальну ID стрінгу, пов'язану з конкретним запитом `useId` в цьому конкретньому компоненті.

#### Застереження {/*caveats*/}

* `useId` — це хук, тож він може бути викликаний тільки **на верхньому рівні вашого компонента** або у вашому власному Хуці. Ви не можете викликати його в циклах або умовах. Якщо ж є така потреба, то витягніть новий компонент та перемістіть в нього стан.

* `useId` **не повинно використовуватись для генерації ключів** у списках. [Ключі повинні генеруватись з ваших даних.](/learn/rendering-lists#where-to-get-your-key)

* `useId` на данний момент не може бути використано в [async Server Components](/reference/rsc/server-components#async-components-with-server-components).

---

## Використання {/*usage*/}

<Pitfall>

**Не викликайте `useId` для генерації ключів у списку.** [Ключі повинні генеруватись з ваших даних.](/learn/rendering-lists#where-to-get-your-key)


</Pitfall>

### Генеруйте унікальні ID для атрибутів доступності {/*generating-unique-ids-for-accessibility-attributes*/}

Викликайте `useId` на верхньому рівні вашої компоненти для генерації унікального ID:

```js [[1, 4, "passwordHintId"]]
import { useId } from 'react';

function PasswordField() {
  const passwordHintId = useId();
  // ...
```

Далі ви можете передати <CodeStep step={1}>generated ID</CodeStep> до різних атрибутів:

```js [[1, 2, "passwordHintId"], [1, 3, "passwordHintId"]]
<>
  <input type="password" aria-describedby={passwordHintId} />
  <p id={passwordHintId}>
</>
```

**Давайте розглянемо приклади, коли це може бути корисно.**

[Атрибути доступності HTML](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA) такі як [`aria-describedby`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-describedby) дозволяють зазначити, що два теги пов'язані один з одним. Наприклад, ви можете визначити, що елемент (такий як input) описан іншим компонентом (такий як параграф).

В звичайному HTML, ви би написали наступне:

```html {5,8}
<label>
  Password:
  <input
    type="password"
    aria-describedby="password-hint"
  />
</label>
<p id="password-hint">
  The password should contain at least 18 characters
</p>
```

Однак, такий хардкод ID не найкраща практика в React. Компонент може бути зарендерений на сторінці більш ніж один раз — але ID повинні бути унікальні! Замість того, щоб хардкодити ID, зренеруйте унікальне за допомогою  `useId`:

```js {4,11,14}
import { useId } from 'react';

function PasswordField() {
  const passwordHintId = useId();
  return (
    <>
      <label>
        Password:
        <input
          type="password"
          aria-describedby={passwordHintId}
        />
      </label>
      <p id={passwordHintId}>
        Пароль повинен буди довжиною не меньш ніж 18 символів
      </p>
    </>
  );
}
```

Тож, навіть якщо `PasswordField` з'явиться на сторінці багато разів, згенеровані ID не конфліктуватимуть.

<Sandpack>

```js
import { useId } from 'react';

function PasswordField() {
  const passwordHintId = useId();
  return (
    <>
      <label>
        Password:
        <input
          type="password"
          aria-describedby={passwordHintId}
        />
      </label>
      <p id={passwordHintId}>
        Пароль повинен буди довжиною не меньш ніж 18 символів
      </p>
    </>
  );
}

export default function App() {
  return (
    <>
      <h2>Оберіть пароль</h2>
      <PasswordField />
      <h2>Підтвердіть пароль</h2>
      <PasswordField />
    </>
  );
}
```

```css
input { margin: 5px; }
```

</Sandpack>

[Перегляньте відео](https://www.youtube.com/watch?v=0dNzNcuEuOo), щоб побачити різницю користувацького досвіду з дороміжними технологіями.

<Pitfall>

With [server rendering](/reference/react-dom/server), **`useId` requires an identical component tree on the server and the client**. If the trees you render on the server and the client don't match exactly, the generated IDs won't match.
Разом з [серверним рендерінгом](/reference/react-dom/server), **`useId` потребує ідентичного дерева компонент на сервері та на клієнті**. If the trees you render on the server and the client don't match exactly, the generated IDs won't match.

</Pitfall>

<DeepDive>

#### Why is useId better than an incrementing counter? {/*why-is-useid-better-than-an-incrementing-counter*/}

You might be wondering why `useId` is better than incrementing a global variable like `nextId++`.

The primary benefit of `useId` is that React ensures that it works with [server rendering.](/reference/react-dom/server) During server rendering, your components generate HTML output. Later, on the client, [hydration](/reference/react-dom/client/hydrateRoot) attaches your event handlers to the generated HTML. For hydration to work, the client output must match the server HTML.

This is very difficult to guarantee with an incrementing counter because the order in which the Client Components are hydrated may not match the order in which the server HTML was emitted. By calling `useId`, you ensure that hydration will work, and the output will match between the server and the client.

Inside React, `useId` is generated from the "parent path" of the calling component. This is why, if the client and the server tree are the same, the "parent path" will match up regardless of rendering order.

</DeepDive>

---

### Generating IDs for several related elements {/*generating-ids-for-several-related-elements*/}

If you need to give IDs to multiple related elements, you can call `useId` to generate a shared prefix for them: 

<Sandpack>

```js
import { useId } from 'react';

export default function Form() {
  const id = useId();
  return (
    <form>
      <label htmlFor={id + '-firstName'}>First Name:</label>
      <input id={id + '-firstName'} type="text" />
      <hr />
      <label htmlFor={id + '-lastName'}>Last Name:</label>
      <input id={id + '-lastName'} type="text" />
    </form>
  );
}
```

```css
input { margin: 5px; }
```

</Sandpack>

This lets you avoid calling `useId` for every single element that needs a unique ID.

---

### Specifying a shared prefix for all generated IDs {/*specifying-a-shared-prefix-for-all-generated-ids*/}

If you render multiple independent React applications on a single page, pass `identifierPrefix` as an option to your [`createRoot`](/reference/react-dom/client/createRoot#parameters) or [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) calls. This ensures that the IDs generated by the two different apps never clash because every identifier generated with `useId` will start with the distinct prefix you've specified.

<Sandpack>

```html public/index.html
<!DOCTYPE html>
<html>
  <head><title>My app</title></head>
  <body>
    <div id="root1"></div>
    <div id="root2"></div>
  </body>
</html>
```

```js
import { useId } from 'react';

function PasswordField() {
  const passwordHintId = useId();
  console.log('Generated identifier:', passwordHintId)
  return (
    <>
      <label>
        Password:
        <input
          type="password"
          aria-describedby={passwordHintId}
        />
      </label>
      <p id={passwordHintId}>
        The password should contain at least 18 characters
      </p>
    </>
  );
}

export default function App() {
  return (
    <>
      <h2>Choose password</h2>
      <PasswordField />
    </>
  );
}
```

```js src/index.js active
import { createRoot } from 'react-dom/client';
import App from './App.js';
import './styles.css';

const root1 = createRoot(document.getElementById('root1'), {
  identifierPrefix: 'my-first-app-'
});
root1.render(<App />);

const root2 = createRoot(document.getElementById('root2'), {
  identifierPrefix: 'my-second-app-'
});
root2.render(<App />);
```

```css
#root1 {
  border: 5px solid blue;
  padding: 10px;
  margin: 5px;
}

#root2 {
  border: 5px solid green;
  padding: 10px;
  margin: 5px;
}

input { margin: 5px; }
```

</Sandpack>

---

### Using the same ID prefix on the client and the server {/*using-the-same-id-prefix-on-the-client-and-the-server*/}

If you [render multiple independent React apps on the same page](#specifying-a-shared-prefix-for-all-generated-ids), and some of these apps are server-rendered, make sure that the `identifierPrefix` you pass to the [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) call on the client side is the same as the `identifierPrefix` you pass to the [server APIs](/reference/react-dom/server) such as [`renderToPipeableStream`.](/reference/react-dom/server/renderToPipeableStream)

```js
// Server
import { renderToPipeableStream } from 'react-dom/server';

const { pipe } = renderToPipeableStream(
  <App />,
  { identifierPrefix: 'react-app1' }
);
```

```js
// Client
import { hydrateRoot } from 'react-dom/client';

const domNode = document.getElementById('root');
const root = hydrateRoot(
  domNode,
  reactNode,
  { identifierPrefix: 'react-app1' }
);
```

You do not need to pass `identifierPrefix` if you only have one React app on the page.
