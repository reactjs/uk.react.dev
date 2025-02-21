---
title: useImperativeHandle
---

<Intro>

`useImperativeHandle` це хук, який дозволяє кастомізувати об'єкт, який повертається через [реф.](/learn/manipulating-the-dom-with-refs)

```js
useImperativeHandle(ref, createHandle, dependencies?)
```

</Intro>

<InlineToc />

---

## Опис {/*reference*/}

### `useImperativeHandle(ref, createHandle, dependencies?)` {/*useimperativehandle*/}

Викличте `useImperativeHandle` на верхньому рівні вашого компонента, щоб кастомізувати об'єкт посилання, який повертає реф:

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

* `ref`: `Реф`, який ви отримали як проп у компоненті `MyInput`.

* `createHandle`: Функція, яка не приймає аргументів і повертає об'єкт посилання, який ви хочете надати. Цей об’єкт може бути будь-якого типу. Зазвичай, ви повертатимете об'єкт з методами, які ви захочете використовувати.

* **Опціональний параметр** `dependencies`: Список усіх реактивних значень, на які посилається код `createHandle`. Реактивні значення включають в себе пропси, стан та всі змінні та функції, оголошені безпосередньо в тілі компонента. Якщо ваш лінтер [налаштований для Реакту](/learn/editor-setup#linting), він перевірить, чи кожне реактивне значення вказане як залежність. Список залежностей повинен містити стале число елементів, записаних в рядок як `[залежність1, залежність2, залежність3]`. Реакт порівняє кожну залежність із своїм попереднім значенням використовуючи порівняння [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is). Якщо повторний рендер призвів до зміни однієї із залежностей або якщо ви пропустили даний аргумент, ваша `createHandle` функція буде виконана повторно і новостворений об'єкт посилання буде призначений до рефу.

<Note>

Починаючи з React 19 [`реф` доступний як проп.](/blog/2024/12/05/react-19#ref-as-a-prop) У React 18 і старіших версіях необхідно було отримувати `реф` з [`forwardRef`.](/reference/react/forwardRef)

</Note>

#### Результат {/*returns*/}

`useImperativeHandle` повертає `undefined`.

---

## Використання {/*usage*/}

### Надання кастомного об'єкта посилання батьківському компоненту {/*exposing-a-custom-ref-handle-to-the-parent-component*/}

Щоб надати DOM-вузол батьківському елементу, передайте проп ref до цього вузла.

```js {2}
function MyInput({ ref }) {
  return <input ref={ref} />;
};
```

У коді вище [посилання до `MyInput` отримає DOM вузол `<input>`.](/learn/manipulating-the-dom-with-refs) Однак, замість цього ви можете передати кастомне значення. Щоб кастомізувати наданий об'єкт посилання, викличте `useImperativeHandle` на верхньому рівні вашого компонента:

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

Зверніть увагу, що в наданому вище коді `реф` більше не передається до `<input>`.

For example, suppose you don't want to expose the entire `<input>` DOM node, but you want to expose two of its methods: `focus` and `scrollIntoView`. To do this, keep the real browser DOM in a separate ref. Then use `useImperativeHandle` to expose a handle with only the methods that you want the parent component to call:

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

Now, if the parent component gets a ref to `MyInput`, it will be able to call the `focus` and `scrollIntoView` methods on it. However, it will not have full access to the underlying `<input>` DOM node.

<Sandpack>

```js
import { useRef } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const ref = useRef(null);

  function handleClick() {
    ref.current.focus();
    // This won't work because the DOM node isn't exposed:
    // ref.current.style.opacity = 0.5;
  }

  return (
    <form>
      <MyInput placeholder="Enter your name" ref={ref} />
      <button type="button" onClick={handleClick}>
        Edit
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

### Exposing your own imperative methods {/*exposing-your-own-imperative-methods*/}

The methods you expose via an imperative handle don't have to match the DOM methods exactly. For example, this `Post` component exposes a `scrollAndFocusAddComment` method via an imperative handle. This lets the parent `Page` scroll the list of comments *and* focus the input field when you click the button:

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
        Write a comment
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
        <p>Welcome to my blog!</p>
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
    comments.push(<p key={i}>Comment #{i}</p>);
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
  return <input placeholder="Add comment..." ref={ref} />;
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

**Do not overuse refs.** You should only use refs for *imperative* behaviors that you can't express as props: for example, scrolling to a node, focusing a node, triggering an animation, selecting text, and so on.

**If you can express something as a prop, you should not use a ref.** For example, instead of exposing an imperative handle like `{ open, close }` from a `Modal` component, it is better to take `isOpen` as a prop like `<Modal isOpen={isOpen} />`. [Effects](/learn/synchronizing-with-effects) can help you expose imperative behaviors via props.

</Pitfall>
