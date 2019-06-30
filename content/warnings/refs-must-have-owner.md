---
title: Refs Must Have Owner Warning
layout: single
permalink: warnings/refs-must-have-owner.html
---

Ймовірно, ви тут, тому що отримали одне з таких повідомлень про помилку:

*React 16.0.0+*
> Warning:
>
> Element ref was specified as a string (myRefName) but no owner was set. You may have multiple copies of React loaded. (details: https://fb.me/react-refs-must-have-owner).

*більш ранні версії React*
> Warning:
>
> addComponentAsRefTo(...): Only a ReactOwner can have refs. You might be adding a ref to a component that was not created inside a component's `render` method, or you have multiple copies of React loaded.

Це зазвичай означає одне з трьох речей:

- Ви намагаєтеся додати `ref` до функціонального компоненту.
- Ви намагаєтеся додати `ref` до елементу, що був створений поза методу render() поточного компоненту.
- Ви маєте декілька конфліктуючих копій React (наприклад, через неправильну конфігурацию npm-залежностей)

## Рефи і функціональні компоненті {#refs-on-function-components}

Якщо `<Foo>` є функціональним компонентом, до нього не можна додати `ref`:

```js
// Не працює, якщо Foo є функцією!
<Foo ref={foo} />
```

Якщо потрібно додати `ref` до компоненту, перетворіть його у клас або не використовуйте рефи, оскільки вони [рідко потрібні](/docs/refs-and-the-dom.html#when-to-use-refs).

## Строкові рефи поза методу `render` {#strings-refs-outside-the-render-method}

Це зазвичай значить, що ви намагаєтеся додати `ref` до компоненту, що не має власника (тобто не був створений всередині методу `render` іншого компоненту). Наприклад, наступний приклад не буде працювати:

```js
// Не працює!
ReactDOM.render(<App ref="app" />, el);
```

Спробуйте відрендерити цей компонент всередені нового компонента-обгортки, який буде містити `ref`. Як варіант, ви можете використовувати колбек-реф:

```js
let app;
ReactDOM.render(
  <App ref={inst => {
    app = inst;
  }} />,
  el
);
```

Добре поміркуйте, [чи дійсно вам потрібен реф](/docs/refs-and-the-dom.html#when-to-use-refs), перед використанням цього підходу.

## Декілька копій React {#multiple-copies-of-react}

Bower добре вирішує питання дублювання залежностей, але npm — ні. Якщо ви не робите з вашими рефами нічого особливого, найімовірніше, проблема не у вашому коді, а в декількох завантажених копіях React. Іноді, коли ви завантажуєте сторонній пакет через npm, ви можете отримати дублювання бібліотеки з залежностей, і це може створити помилку.

Якщо ви використовуєте npm, `npm ls` або `npm ls react` можуть допомогти розібратися, які залежності встановлені.
