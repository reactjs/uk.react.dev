---
title: useId
---

<Intro>

`useId` — це хук для генерації унікальних ідентифікаторів (_далі_ — ID), які можуть передаватися як атрибути доступності.

```js
const id = useId()
```

</Intro>

<InlineToc />

---

## Опис {/*reference*/}

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

`useId` не приймає жодних параметрів.

#### Результат {/*returns*/}

`useId` повертає унікальну ID-стрічку, пов'язану з конкретним запитом `useId` в цьому конкретному компоненті.

#### Застереження {/*caveats*/}

* `useId` — це хук, тож він може викликатися тільки **на верхньому рівні вашого компонента** або у ваших власних хуках. Ви не можете викликати його в циклах або умовно. Якщо ж є така потреба, то виокреміть новий компонент та перемістіть у нього стан.

* `useId` **не має використовуватися для генерації ключів** у списках. [Ключі мають генеруватися з ваших даних.](/learn/rendering-lists#where-to-get-your-key)

* `useId` наразі не може бути використано в [асинхронних серверних компонентах](/reference/rsc/server-components#async-components-with-server-components).

---

## Використання {/*usage*/}

<Pitfall>

**Не викликайте `useId` для генерації ключів у списку.** [Ключі мають генеруватися з ваших даних.](/learn/rendering-lists#where-to-get-your-key)

</Pitfall>

### Генерація унікальних ID для атрибутів доступності {/*generating-unique-ids-for-accessibility-attributes*/}

Викличте `useId` на верхньому рівні вашого компонента для генерації унікального ID:

```js [[1, 4, "passwordHintId"]]
import { useId } from 'react';

function PasswordField() {
  const passwordHintId = useId();
  // ...
```

Далі ви можете передати <CodeStep step={1}>згенерований ID</CodeStep> до різних атрибутів:

```js [[1, 2, "passwordHintId"], [1, 3, "passwordHintId"]]
<>
  <input type="password" aria-describedby={passwordHintId} />
  <p id={passwordHintId}>
</>
```

**Розглянемо приклади, коли це може бути корисно.**

[Атрибути доступності HTML](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA), як-от [`aria-describedby`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-describedby), дають змогу зазначити, що два теги пов'язані один з одним. Наприклад, ви можете зазначити, що елемент (як-от input) описаний іншим компонентом (як-от параграф).

У звичайному HTML ви б написали наступне:

```html {5,8}
<label>
  Password:
  <input
    type="password"
    aria-describedby="password-hint"
  />
</label>
<p id="password-hint">
  Довжина паролю має бути не менш ніж 18 символів
</p>
```

Однак, таке задання ID не найкраща практика в React. Компонент може бути відрендерений на сторінці більш ніж один раз — і ID повинні бути унікальні! Замість незмінно заданих ID, згенеруйте унікальне значення за допомогою `useId`:

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
        Довжина паролю має бути не менш ніж 18 символів
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
        Довжина паролю має бути не менш ніж 18 символів
      </p>
    </>
  );
}

export default function App() {
  return (
    <>
      <h2>Введіть пароль</h2>
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

Для [серверного рендерингу](/reference/react-dom/server), **`useId` потребує ідентичного дерева компонентів на сервері та на клієнті**. Якщо дерева, які ви рендерите на сервері та на клієнті, не збігаються, то і згенеровані ID не будуть збігатись.

</Pitfall>

<DeepDive>

#### Чому використання useId краще за інкрементний лічильник? {/*why-is-useid-better-than-an-incrementing-counter*/}

Можливо, вам кортить дізнатися, чому використання `useId` краще за інкрементування глобальної змінної, як наприклад, `nextId++`.

Початкова перевага `useId` в тому, що React запевниться, що це працює разом із [серверним рендерингом.](/reference/react-dom/server) Протягом серверного рендерингу, ваш компонент генерує HTML-вивід. Далі на клієнті [гідрація](/reference/react-dom/client/hydrateRoot) прикріплює обробники подій до згенерованого HTML. Для коректної роботи гідрації клієнтський вивід має збігатись із серверним HTML.

Це складно гарантувати для інкрементного лічильника, бо порядок, за яким клієнтські компоненти проходять гідрацію, не збігається з порядком, за яким був виданий серверний HTML. Викликаючи `useId`, ви запевняєтеся, що гідрація буде працювати, а серверний і клієнтський виводи будуть збігатися.

У межах React, `useId` генерується з "батьківського шляху" компонента, що його викликав. Ось чому, якщо клієнтське та серверне дерево однакове, "батьківський шлях" буде збігатися, незважаючи на порядок рендерингу.

</DeepDive>

---

### Генерація ID для декількох пов'язаних елементів {/*generating-ids-for-several-related-elements*/}

Якщо треба додати ID для декількох пов'язаних елементів, ви можете викликати `useId` для генерації спільного префіксу: 

<Sandpack>

```js
import { useId } from 'react';

export default function Form() {
  const id = useId();
  return (
    <form>
      <label htmlFor={id + '-name'}>Ім'я:</label>
      <input id={id + '-name'} type="text" />
      <hr />
      <label htmlFor={id + '-lastName'}>Прізвище:</label>
      <input id={id + '-lastName'} type="text" />
    </form>
  );
}
```

```css
input { margin: 5px; }
```

</Sandpack>

Це дасть змогу виклику `useId` для кожного окремого елементу, якому треба унікальне ID.

---

### Визначення спільного префікса для всіх згенерованих ID {/*specifying-a-shared-prefix-for-all-generated-ids*/}

Якщо ви рендерите декілька незалежних React-застосунків на одній сторінці, передавайте `identifierPrefix` як опцію до вашого [`createRoot`](/reference/react-dom/client/createRoot#parameters) або [`hydrateRoot`](/reference/react-dom/client/hydrateRoot). Це забезпечить те, що ID, згенеровані двома різними застосунками, ніколи не перетнуться, бо кожен ідентифікатор, згенерований за допомогою `useId`, починатиметься з окремого префіксу, який ви вказали.

<Sandpack>

```html public/index.html
<!DOCTYPE html>
<html>
  <head><title>Мій застосунок</title></head>
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
  console.log('Згенерований ідентифікатор:', passwordHintId)
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
        Довжина паролю має бути не менш ніж 18 символів
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

### Використання однакового ID-префікса на клієнті та сервері {/*using-the-same-id-prefix-on-the-client-and-the-server*/}

Якщо ви [рендерите декілька незалежних React-застосунків на одній сторінці](#specifying-a-shared-prefix-for-all-generated-ids), і деякі з цих застосунків відрендерені сервером, перевірте, що `identifierPrefix`, який ви передаєте до [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) на клієнті, є тим самим `identifierPrefix`, який ви передаєте до [серверних API](/reference/react-dom/server), наприклад, [`renderToPipeableStream`.](/reference/react-dom/server/renderToPipeableStream)

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

Немає потреби передавати `identifierPrefix`, якщо ви маєте тільки один React-застосунок на сторінці.
