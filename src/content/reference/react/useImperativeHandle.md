---
title: useImperativeHandle
---

<Intro>

`useImperativeHandle` — це хук, який дає змогу налаштовувати дескриптор (handle) публічно доступного [рефа.](/learn/manipulating-the-dom-with-refs)

```js
useImperativeHandle(ref, createHandle, dependencies?)
```

</Intro>

<InlineToc />

---

## Опис {/*reference*/}

### `useImperativeHandle(ref, createHandle, dependencies?)` {/*useimperativehandle*/}

Викличте `useImperativeHandle` на верхньому рівні вашого компонента, щоб налаштувати дескриптор рефа, доступного з нього:

```js
import { useImperativeHandle } from 'react';

function MyInput({ ref }) {
  useImperativeHandle(ref, () => {
    return {
      // ... ваші методи ...
    };
  }, []);
  // ...
```

[Перегляньте більше прикладів нижче.](#usage)

#### Параметри {/*parameters*/}

* `ref`: `ref`, який ви отримали як проп у компоненті `MyInput`.

* `createHandle`: Функція, яка не приймає аргументів і повертає дескриптор рефа, до якого ви хочете надати доступ. Дескриптор може бути будь-якого типу. Зазвичай, ви повертатимете об'єкт із методами, до яких ви хочете надати доступ.

* **Опційний параметр** `dependencies`: Список усіх реактивних значень, на які посилається код `createHandle`. Реактивні значення охоплюють пропси, стан і всі змінні та функції, оголошені безпосередньо в тілі компонента. Якщо ваш лінтер [налаштований для React](/learn/editor-setup#linting), він перевірить, чи кожне реактивне значення вказане як залежність. Список залежностей повинен містити стале число елементів, записаних у рядок як `[залежність1, залежність2, залежність3]`. React порівняє кожну залежність із своїм попереднім значенням, використовуючи функцію [`Object.is`](https://webdoky.org/uk/docs/Web/JavaScript/Reference/Global_Objects/Object/is). Якщо повторний рендер призвів до зміни однієї із залежностей або якщо ви пропустили даний аргумент, ваша функція `createHandle` виконуватиметься повторно, і новостворений дескриптор буде призначений рефу.

<Note>

Починаючи з React 19, [`ref` доступний як проп.](/blog/2024/12/05/react-19#ref-as-a-prop) У React 18 і старіших версіях необхідно було отримувати `ref` із [`forwardRef`.](/reference/react/forwardRef)

</Note>

#### Результат {/*returns*/}

`useImperativeHandle` повертає `undefined`.

---

## Використання {/*usage*/}

### Доступ батьківського елемента до налаштованого дескриптора рефа {/*exposing-a-custom-ref-handle-to-the-parent-component*/}

Щоб надати доступ до DOM-вузла батьківському елементу, передайте проп `ref` далі до цього вузла.

```js {2}
function MyInput({ ref }) {
  return <input ref={ref} />;
};
```

У коді вище [реф, переданий компоненту `MyInput`, отримає DOM-вузол `<input>`.](/learn/manipulating-the-dom-with-refs) Однак, замість цього ви можете задати власне значення. Щоб налаштувати публічний дескриптор, викличте `useImperativeHandle` на верхньому рівні вашого компонента:

```js {4-8}
import { useImperativeHandle } from 'react';

function MyInput({ ref }) {
  useImperativeHandle(ref, () => {
    return {
      // ... ваші методи ...
    };
  }, []);

  return <input />;
};
```

Зверніть увагу, що в наведеному вище коді `ref` більше не передається елементу `<input>`.

Наприклад, припустимо, що ви не хочете робити публічним весь DOM-вузол `<input>`, а лише два його методи: `focus` і `scrollIntoView`. У цьому разі зберігайте справжній браузерний DOM в окремому рефі. Потім викличте `useImperativeHandle`, щоб надати доступ до дескриптора, який містить лише методи, необхідні для виклику батьківським компонентом:

```js {7-14}
import { useRef, useImperativeHandle } from 'react';

function MyInput({ ref }) {
  const inputRef = useRef(null);

  useImperativeHandle(ref, () => {
    return {
      focus() {
        inputRef.current.focus();
      },
      scrollIntoView() {
        inputRef.current.scrollIntoView();
      },
    };
  }, []);

  return <input ref={inputRef} />;
};
```

Тепер якщо батьківський компонент передасть реф до `MyInput`, він зможе викликати його методи `focus` і `scrollIntoView`. Однак, він не буде мати повного доступу до справжнього DOM-вузла `<input>`.

<Sandpack>

```js
import { useRef } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const ref = useRef(null);

  function handleClick() {
    ref.current.focus();
    // Це не спрацює, бо вузол DOM не публічний:
    // ref.current.style.opacity = 0.5;
  }

  return (
    <form>
      <MyInput placeholder="Введіть ваше ім'я" ref={ref} />
      <button type="button" onClick={handleClick}>
        Редагувати
      </button>
    </form>
  );
}
```

```js src/MyInput.js
import { useRef, useImperativeHandle } from 'react';

function MyInput({ ref, ...props }) {
  const inputRef = useRef(null);

  useImperativeHandle(ref, () => {
    return {
      focus() {
        inputRef.current.focus();
      },
      scrollIntoView() {
        inputRef.current.scrollIntoView();
      },
    };
  }, []);

  return <input {...props} ref={inputRef} />;
};

export default MyInput;
```

```css
input {
  margin: 5px;
}
```

</Sandpack>

---

### Надання доступу до власних імперативних методів {/*exposing-your-own-imperative-methods*/}

Методи, які ви передаєте через імперативний дескриптор, не обов'язково мають точно збігатися з DOM методами. Наприклад, цей компонент `Post` передає метод `scrollAndFocusAddComment` через дескриптор. Це дає батьківському компоненту `Page` змогу прогорнути список коментарів *і* фокусувати поле введення, коли ви натискаєте кнопку:

<Sandpack>

```js
import { useRef } from 'react';
import Post from './Post.js';

export default function Page() {
  const postRef = useRef(null);

  function handleClick() {
    postRef.current.scrollAndFocusAddComment();
  }

  return (
    <>
      <button onClick={handleClick}>
        Написати коментар
      </button>
      <Post ref={postRef} />
    </>
  );
}
```

```js src/Post.js
import { useRef, useImperativeHandle } from 'react';
import CommentList from './CommentList.js';
import AddComment from './AddComment.js';

function Post({ ref }) {
  const commentsRef = useRef(null);
  const addCommentRef = useRef(null);

  useImperativeHandle(ref, () => {
    return {
      scrollAndFocusAddComment() {
        commentsRef.current.scrollToBottom();
        addCommentRef.current.focus();
      }
    };
  }, []);

  return (
    <>
      <article>
        <p>Вітаю в моєму блозі!</p>
      </article>
      <CommentList ref={commentsRef} />
      <AddComment ref={addCommentRef} />
    </>
  );
};

export default Post;
```


```js src/CommentList.js
import { useRef, useImperativeHandle } from 'react';

function CommentList({ ref }) {
  const divRef = useRef(null);

  useImperativeHandle(ref, () => {
    return {
      scrollToBottom() {
        const node = divRef.current;
        node.scrollTop = node.scrollHeight;
      }
    };
  }, []);

  let comments = [];
  for (let i = 0; i < 50; i++) {
    comments.push(<p key={i}>Коментар #{i}</p>);
  }

  return (
    <div className="CommentList" ref={divRef}>
      {comments}
    </div>
  );
}

export default CommentList;
```

```js src/AddComment.js
import { useRef, useImperativeHandle } from 'react';

function AddComment({ ref }) {
  return <input placeholder="Додати коментар..." ref={ref} />;
}

export default AddComment;
```

```css
.CommentList {
  height: 100px;
  overflow: scroll;
  border: 1px solid black;
  margin-top: 20px;
  margin-bottom: 20px;
}
```

</Sandpack>

<Pitfall>

**Не зловживайте рефами.** Використовуйте рефи лише для *імперативної* поведінки, яку ви не можете виразити через пропси: наприклад, прогортування до вузла DOM, фокусування вузла, виклик анімації, виділення тексту тощо.

**Якщо ви можете виразити щось як проп, тоді не варто використовувати реф.** Наприклад, замість передавання імперативного дескриптора як `{ open, close }` із компонента `Modal`, краще використати проп `isOpen` як `<Modal isOpen={isOpen} />`. [Ефекти](/learn/synchronizing-with-effects) можуть допомогти вам надати доступ до імперативних частин через пропси.

</Pitfall>
