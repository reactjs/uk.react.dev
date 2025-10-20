---
title: useId
---

<Intro>

`useId` — це хук для генерації унікальних ID, які можуть передаватись як атрибути доступності.

```js
const id = useId()
```

</Intro>

<InlineToc />

---

## Референс {/*reference*/}

### `useId()` {/*useid*/}

Викликайте `useId` на верхньому рівні вашого компонента, щоб згенерувати унікальне ID:

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

`useId` повертає унікальну ID строку, пов'язану з конкретним запитом `useId` в цьому конкретному компоненті.

#### Застереження {/*caveats*/}

* `useId` — це хук, тож він може викликатись тільки **на верхньому рівні вашого компонента** або у вашому власному хуці. Ви не можете викликати його в циклах або умовах. Якщо ж є така потреба, то витягніть новий компонент та перемістіть в нього стан.

* `useId` **не повинно використовуватись для генерації ключів** у списках. [Ключі повинні генеруватись з ваших даних.](/learn/rendering-lists#where-to-get-your-key)

* `useId` наразі не може бути використано в [async Server Components](/reference/rsc/server-components#async-components-with-server-components).

---

## Використання {/*usage*/}

<Pitfall>

**Не викликайте `useId` для генерації ключів у списку.** [Ключі повинні генеруватись з ваших даних.](/learn/rendering-lists#where-to-get-your-key)


</Pitfall>

### Генерація унікальних ID для атрибутів доступності {/*generating-unique-ids-for-accessibility-attributes*/}

Викликайте `useId` на верхньому рівні вашої компоненти для генерації унікального ID:

```js [[1, 4, "passwordHintId"]]
import { useId } from 'react';

function PasswordField() {
  const passwordHintId = useId();
  // ...
```

Далі ви можете передати <CodeStep step={1}>Згеренрувати ID</CodeStep> до різних атрибутів:

```js [[1, 2, "passwordHintId"], [1, 3, "passwordHintId"]]
<>
  <input type="password" aria-describedby={passwordHintId} />
  <p id={passwordHintId}>
</>
```

**Розглянемо приклади, коли це може бути корисно.**

[Атрибути доступності HTML](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA) такі як [`aria-describedby`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-describedby) дозволяють зазначити, що два теги пов'язані один з одним. Наприклад, ви можете визначити, що елемент (таким як input) описаний іншим компонентом (таким як параграф).

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

Однак, такий хардкод ID не найкраща практика в React. Компонент може бути зарендерений на сторінці більш ніж один раз — але ID повинні бути унікальні! Замість того, щоб хардкодити ID, згенеруйте унікальне за допомогою  `useId`:

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
        Пароль повинен бути довжиною не меньш ніж 18 символів
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
        Пароль повинен бути довжиною не меньш ніж 18 символів
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

[Перегляньте відео](https://www.youtube.com/watch?v=0dNzNcuEuOo), щоб побачити різницю користувацького досвіду з допоміжними технологіями.

<Pitfall>

Разом з [серверним рендерінгом](/reference/react-dom/server), **`useId` потребує ідентичного дерева компонент на сервері та на клієнті**. Якщо дерева, які ви рендерите на сервері та на клієнті не збігаються, то і згенеровані ID не будуть збігатись.

</Pitfall>

<DeepDive>

#### Чому використання useId краще за інкрементний лічильник? {/*why-is-useid-better-than-an-incrementing-counter*/}

Ви можливо зацікавились, чому використання `useId` краще за інкрементацію глобальної змінної, як наприклад `nextId++`.

Початкова перевага в тому, що `useId` React запевняється, що це працює разом із [серверним рендерінгом.](/reference/react-dom/server) Протягом серверного рендерінга, ваш компонент генерує HTML вивід. Пізніше, на стороні клієнта, [гідратація](/reference/react-dom/client/hydrateRoot) прикрипляє обробники подій до згенерованого HTML. Для роботи гідратації, клієнтський вивід має збігатись з серверним HTML.

Це складно гарантувати з інкрементацією лічильника, бо порядок в якому Клієнтські Компоненти проходять гідратацію не збігається з порядком в якому серверний HTML був додан. Викликаючи `useId`, ви запевняєтесь, що гідратація буде працювати, та серверний і клієнтський виводи будуть збігатись.

В межах React, `useId` генерується з "батьківського шляху" компоненти, що викликана. Ось чому, якщо клієнтське та серверне дерево однакове, "батьківський шлях" буде збігатись не дивлячись на порядок рендерінгу.

</DeepDive>

---

### Генерація ID для декількох залежних елементів {/*generating-ids-for-several-related-elements*/}

Якщо треба додати ID для декількох залежних елементів, ви можете викликати `useId` для генерації спільного префіксу: 

<Sandpack>

```js
import { useId } from 'react';

export default function Form() {
  const id = useId();
  return (
    <form>
      <label htmlFor={id + '-ім_я'}>Ім'я:</label>
      <input id={id + '-ім_я'} type="text" />
      <hr />
      <label htmlFor={id + '-прізвище'}>Прізвище:</label>
      <input id={id + '-прізвище'} type="text" />
    </form>
  );
}
```

```css
input { margin: 5px; }
```

</Sandpack>

Це дозволить запобігти виклику `useId` для кожного окремого елементу, якому треба унікальне ID.

---

### Визначення спільного префіксу для всіх згенерованих ID {/*specifying-a-shared-prefix-for-all-generated-ids*/}

Якщо ви рендерите декілька незалежних React застосунків на одній сторінці, передавайте `identifierPrefix` як опцію у ваш виклик [`createRoot`](/reference/react-dom/client/createRoot#parameters) або [`hydrateRoot`](/reference/react-dom/client/hydrateRoot). Це забезпечить те, що ID, згенеровані двома різними застосунками, ніколи не перетнуться, бо кожен ідентифікатор згенерований за допомогою `useId` починається з окремого префіксу, який ви вказали.

<Sandpack>

```html public/index.html
<!DOCTYPE html>
<html>
  <head><title>Мій додаток</title></head>
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
  console.log('Згенеруй ідентифікатор:', passwordHintId)
  return (
    <>
      <label>
        Пароль:
        <input
          type="пароль"
          aria-describedby={passwordHintId}
        />
      </label>
      <p id={passwordHintId}>
          Пароль повинен бути довжиною не меньш ніж 18 символів
      </p>
    </>
  );
}

export default function App() {
  return (
    <>
      <h2>Оберіть пароль</h2>
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

### Використання однакового ID префікса для клієнта та сервера {/*using-the-same-id-prefix-on-the-client-and-the-server*/}

Якщо ви [рендерите декілька незалежних React застосунків на одній сторінці](#specifying-a-shared-prefix-for-all-generated-ids), і деякі з цих застосунків відрендерені сервером, запевниться, що `identifierPrefix`, який ви передаєте в [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) викликається на клієнтській стороні, так само як `identifierPrefix`, який ви передаєте в [server APIs](/reference/react-dom/server), наприклад [`renderToPipeableStream`.](/reference/react-dom/server/renderToPipeableStream)

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

Немає потреби передавати `identifierPrefix`, якщо ви маєте тільки один React застосунок на сторінці.
