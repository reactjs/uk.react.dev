---
title: <Fragment> (<>...</>)
---

<Intro>

`<Fragment>`, часто використовується за допомогою синтаксису `<>...</>`, дозволяє групувати елементи без елементу-обгортки.

```js
<>
  <OneChild />
  <AnotherChild />
</>
```

</Intro>

<InlineToc />

---

## Опис {/*reference*/}

### `<Fragment>` {/*fragment*/}

Огорніть елементи у `<Fragment>` щоб групувати їх разом в ситуаціях, коли вам потрібен один елемент. Групування елементів у `Fragment` не впливає на результуючий DOM; це так само, ніби елементи і не були згруповані. Переважно, порожній тег JSX `<></>` є скороченням для `<Fragment></Fragment>`.

#### Пропси {/*props*/}

- **опційний** `key`: Фрагменти, оголошені з явним синтаксисом `<Fragment>` можуть мати [ключі.](/learn/rendering-lists#keeping-list-items-in-order-with-key)

#### Обмеження {/*caveats*/}

- Якщо ви хочете передати `key` для Fragment, ви не можете використовувати синтаксис `<>...</>`. Ви маєте явно імпортувати `Fragment` з `'react'` та рендерити `<Fragment key={yourKey}>...</Fragment>`.

- React не буде [скидати стан](/learn/preserving-and-resetting-state) компонента коли ви переходите від рендерингу `<><Child /></>` до `[<Child />]` або назад, або коли ви переходите від рендерингу `<><Child /></>` до `<Child />` і назад. Це може працювати лише на одному рівні вкладеності: наприклад, перехід від `<><><Child /></></>` до `<Child />` скидає стан компонента. Дивіться точну семантику [тут.](https://gist.github.com/clemmy/b3ef00f9507909429d8aa0d3ee4f986b)

---

## Використання {/*usage*/}

### Повернення кількох елементів {/*returning-multiple-elements*/}

Використовуйте `Fragment`, або еквівалентний синтаксис `<>...</>`, для групування кількох елементів разом. Ви можете використовувати його для збору кількох елементів в будь-якому місці, де може бути один елемент. Наприклад, компонент може повернути тільки один елемент, але за допомогою Fragment ви можете групувати кілька елементів разом і повертати їх як групу:

```js {3,6}
function Post() {
  return (
    <>
      <PostTitle />
      <PostBody />
    </>
  );
}
```

Фрагменти є корисним інструментом, оскільки групування елементів з `Fragment` не має впливу на розташування або стилізацію, на відміну від огортання елементів в інший контейнер, такий як DOM-елемент. Якщо ви перевірите цей приклад за допомогою інструментів браузера, ви побачите, що всі DOM-вузли `<h1>` і `<article>` відображаються як сусідні елементи без обгорток навколо них:

<Sandpack>

```js
export default function Blog() {
  return (
    <>
      <Post title="Оновлення" body="Минув деякий час після мого останнього повідомлення..." />
      <Post title="Мій новий блог" body="Я розпочинаю новий блог!" />
    </>
  )
}

function Post({ title, body }) {
  return (
    <>
      <PostTitle title={title} />
      <PostBody body={body} />
    </>
  );
}

function PostTitle({ title }) {
  return <h1>{title}</h1>
}

function PostBody({ body }) {
  return (
    <article>
      <p>{body}</p>
    </article>
  );
}
```

</Sandpack>

<DeepDive>

#### Як написати Fragment без спеціального синтаксису? {/*how-to-write-a-fragment-without-the-special-syntax*/}

Цей приклад еквівалентний імпорту `Fragment` з React:

```js {1,5,8}
import { Fragment } from 'react';

function Post() {
  return (
    <Fragment>
      <PostTitle />
      <PostBody />
    </Fragment>
  );
}
```

Зазвичай вам не потрібно цього робити, якщо вам не треба [передавати `key` у ваш `Fragment`.](#rendering-a-list-of-fragments)

</DeepDive>

---

### Присвоєння змінній декількох елементів {/*assigning-multiple-elements-to-a-variable*/}

Як і будь-який інший елемент, `Fragment` елементи можна присвоювати змінним, передавати їх як пропси тощо:

```js
function CloseDialog() {
  const buttons = (
    <>
      <OKButton />
      <CancelButton />
    </>
  );
  return (
    <AlertDialog buttons={buttons}>
      Ви впевнені, що хочете залишити цю сторінку?
    </AlertDialog>
  );
}
```

---

### Групування елементів з текстом {/*grouping-elements-with-text*/}

Ви можете використовувати `Fragment`, щоб групувати текст разом з компонентами:

```js
function DateRangePicker({ start, end }) {
  return (
    <>
      Від
      <DatePicker date={start} />
      до
      <DatePicker date={end} />
    </>
  );
}
```

---

### Відображення списку фрагментів {/*rendering-a-list-of-fragments*/}

Ось ситуація, коли вам потрібно написати `Fragment` явно, замість використання синтаксису `<></>`. Якщо ви [рендерите кілька елементів в циклі](/learn/rendering-lists), вам потрібно призначити `key` кожному елементу. Якщо елементи всередині циклу є Фрагментами, то вам потрібно використовувати звичайний синтаксис елементів JSX, щоб мати змогу вказати атрибут `key`:

```js {3,6}
function Blog() {
  return posts.map(post =>
    <Fragment key={post.id}>
      <PostTitle title={post.title} />
      <PostBody body={post.body} />
    </Fragment>
  );
}
```

Ви можете перевірити DOM, щоб переконатися, що дочірні компоненти Fragment нічим не обгортуються:

<Sandpack>

```js
import { Fragment } from 'react';

const posts = [
  { id: 1, title: 'Оновлення', body: "Минув деякий час після мого останнього повідомлення..." },
  { id: 2, title: 'Мій новий блог', body: 'Я розпочинаю новий блог!' }
];

export default function Blog() {
  return posts.map(post =>
    <Fragment key={post.id}>
      <PostTitle title={post.title} />
      <PostBody body={post.body} />
    </Fragment>
  );
}

function PostTitle({ title }) {
  return <h1>{title}</h1>
}

function PostBody({ body }) {
  return (
    <article>
      <p>{body}</p>
    </article>
  );
}
```

</Sandpack>
