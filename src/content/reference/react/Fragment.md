---
title: <Fragment> (<>...</>)
---

<Intro>

`<Fragment>`, часто використовується за допомогою синтаксису `<>...</>`, дозволяє групувати елементи без елементу-обгортки.

<Canary> Fragments can also accept refs, which enable interacting with underlying DOM nodes without adding wrapper elements. See reference and usage below.</Canary>

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
- <CanaryBadge />  **optional** `ref`: A ref object (e.g. from [`useRef`](/reference/react/useRef)) or [callback function](/reference/react-dom/components/common#ref-callback). React provides a `FragmentInstance` as the ref value that implements methods for interacting with the DOM nodes wrapped by the Fragment.

### <CanaryBadge /> FragmentInstance {/*fragmentinstance*/}

When you pass a ref to a fragment, React provides a `FragmentInstance` object with methods for interacting with the DOM nodes wrapped by the fragment:

**Event handling methods:**
- `addEventListener(type, listener, options?)`: Adds an event listener to all first-level DOM children of the Fragment.
- `removeEventListener(type, listener, options?)`: Removes an event listener from all first-level DOM children of the Fragment.
- `dispatchEvent(event)`: Dispatches an event to a virtual child of the Fragment to call any added listeners and can bubble to the DOM parent.

**Layout methods:**
- `compareDocumentPosition(otherNode)`: Compares the document position of the Fragment with another node.
  - If the Fragment has children, the native `compareDocumentPosition` value is returned. 
  - Empty Fragments will attempt to compare positioning within the React tree and include `Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC`.
  - Elements that have a different relationship in the React tree and DOM tree due to portaling or other insertions are `Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC`.
- `getClientRects()`: Returns a flat array of `DOMRect` objects representing the bounding rectangles of all children.
- `getRootNode()`: Returns the root node containing the Fragment's parent DOM node.

**Focus management methods:**
- `focus(options?)`: Focuses the first focusable DOM node in the Fragment. Focus is attempted on nested children depth-first.
- `focusLast(options?)`: Focuses the last focusable DOM node in the Fragment. Focus is attempted on nested children depth-first.
- `blur()`: Removes focus if `document.activeElement` is within the Fragment.

**Observer methods:**
- `observeUsing(observer)`: Starts observing the Fragment's DOM children with an IntersectionObserver or ResizeObserver.
- `unobserveUsing(observer)`: Stops observing the Fragment's DOM children with the specified observer.

#### Обмеження {/*caveats*/}

- Якщо ви хочете передати `key` для Fragment, ви не можете використовувати синтаксис `<>...</>`. Ви маєте явно імпортувати `Fragment` з `'react'` та рендерити `<Fragment key={yourKey}>...</Fragment>`.

- React не буде [скидати стан](/learn/preserving-and-resetting-state) компонента коли ви переходите від рендерингу `<><Child /></>` до `[<Child />]` або назад, або коли ви переходите від рендерингу `<><Child /></>` до `<Child />` і назад. Це може працювати лише на одному рівні вкладеності: наприклад, перехід від `<><><Child /></></>` до `<Child />` скидає стан компонента. Дивіться точну семантику [тут.](https://gist.github.com/clemmy/b3ef00f9507909429d8aa0d3ee4f986b)

- <CanaryBadge /> If you want to pass `ref` to a Fragment, you can't use the `<>...</>` syntax. You have to explicitly import `Fragment` from `'react'` and render `<Fragment ref={yourRef}>...</Fragment>`.

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

---

### <CanaryBadge /> Using Fragment refs for DOM interaction {/*using-fragment-refs-for-dom-interaction*/}

Fragment refs allow you to interact with the DOM nodes wrapped by a Fragment without adding extra wrapper elements. This is useful for event handling, visibility tracking, focus management, and replacing deprecated patterns like `ReactDOM.findDOMNode()`.

```js
import { Fragment } from 'react';

function ClickableFragment({ children, onClick }) {
  return (
    <Fragment ref={fragmentInstance => {
      fragmentInstance.addEventListener('click', handleClick);
      return () => fragmentInstance.removeEventListener('click', handleClick);
    }}>
      {children}
    </Fragment>
  );
}
```
---

### <CanaryBadge /> Tracking visibility with Fragment refs {/*tracking-visibility-with-fragment-refs*/}

Fragment refs are useful for visibility tracking and intersection observation. This enables you to monitor when content becomes visible without requiring the child Components to expose refs:

```js {19,21,31-34}
import { Fragment, useRef, useLayoutEffect } from 'react';

function VisibilityObserverFragment({ threshold = 0.5, onVisibilityChange, children }) {
  const fragmentRef = useRef(null);

  useLayoutEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        onVisibilityChange(entries.some(entry => entry.isIntersecting))
      },
      { threshold }
    );
    
    fragmentRef.current.observeUsing(observer);
    return () => fragmentRef.current.unobserveUsing(observer);
  }, [threshold, onVisibilityChange]);

  return (
    <Fragment ref={fragmentRef}>
      {children}
    </Fragment>
  );
}

function MyComponent() {
  const handleVisibilityChange = (isVisible) => {
    console.log('Component is', isVisible ? 'visible' : 'hidden');
  };

  return (
    <VisibilityObserverFragment onVisibilityChange={handleVisibilityChange}>
      <SomeThirdPartyComponent />
      <AnotherComponent />
    </VisibilityObserverFragment>
  );
}
```

This pattern is an alternative to Effect-based visibility logging, which is an anti-pattern in most cases. Relying on Effects alone does not guarantee that the rendered Component is observable by the user.

---

### <CanaryBadge /> Focus management with Fragment refs {/*focus-management-with-fragment-refs*/}

Fragment refs provide focus management methods that work across all DOM nodes within the Fragment:

```js
import { Fragment, useRef } from 'react';

function FocusFragment({ children }) {
  return (
    <Fragment ref={(fragmentInstance) => fragmentInstance?.focus()}>
      {children}
    </Fragment>
  );
}
```

The `focus()` method focuses the first focusable element within the Fragment, while `focusLast()` focuses the last focusable element.
