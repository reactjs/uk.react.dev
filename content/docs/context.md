---
id: context
title: Контекст
permalink: docs/context.html
---

<<<<<<< HEAD
Контекст забезпечує спосіб передавати дані через дерево компонентів без необхідності передавати пропси вручну на кожному рівні.

У типовому додатку React дані передаються зверху вниз (від батьківської до дочірньої компоненти) через пропси, але це може бути громіздким для певних типів реквізитів (наприклад, налаштування локалі, тема інтерфейсу користувача), які потрібні багатьом компонентам програми. Контекст надає спосіб обмінюватися значеннями, подібними до цих, між компонентами без необхідності явно передавати властивість через кожен рівень дерева.
=======
> Try the new React documentation.
> 
> These new documentation pages teach modern React and include live examples:
>
> - [Passing Data Deeply with Context](https://beta.reactjs.org/learn/passing-data-deeply-with-context)
> - [`useContext`](https://beta.reactjs.org/reference/react/useContext)
>
> The new docs will soon replace this site, which will be archived. [Provide feedback.](https://github.com/reactjs/reactjs.org/issues/3308)

Context provides a way to pass data through the component tree without having to pass props down manually at every level.

In a typical React application, data is passed top-down (parent to child) via props, but such usage can be cumbersome for certain types of props (e.g. locale preference, UI theme) that are required by many components within an application. Context provides a way to share values like these between components without having to explicitly pass a prop through every level of the tree.
>>>>>>> d4e42ab21f0cc7d8b79d1a619654e27c79e10af6

- [Коли використовувати контекст](#when-to-use-context)
- [Перед використанням контексту](#before-you-use-context)
- [API](#api)
  - [React.createContext](#reactcreatecontext)
  - [Context.Provider](#contextprovider)
  - [Class.contextType](#classcontexttype)
  - [Context.Consumer](#contextconsumer)
  - [Context.displayName](#contextdisplayname)
- [Examples](#examples)
  - [Dynamic Context](#dynamic-context)
  - [Updating Context from a Nested Component](#updating-context-from-a-nested-component)
  - [Consuming Multiple Contexts](#consuming-multiple-contexts)
- [Caveats](#caveats)
- [Legacy API](#legacy-api)

## Коли використовувати контекст {#when-to-use-context}

Контекст призначений для обміну даними, які можна вважати «глобальними» для дерева компонентів React, таких як поточний автентифікований користувач, тема чи бажана мова. Наприклад, у наведеному нижче коді ми вручну прокидаємо проп `theme`, щоб стилізувати компонент Button:

`embed:context/motivation-problem.js`

Використовуючи контекст, ми можемо уникнути проходження атрибутів через проміжні елементи:

`embed:context/motivation-solution.js`

## Перед використанням контексту {#before-you-use-context}

Контекст в основному використовується, коли деякі дані повинні бути доступні *багатьом* компонентам на різних рівнях вкладеності. Застосовуйте його економно, оскільки це ускладнює повторне використання компонентів.

**Якщо ви тільки хочете уникнути проходження деяких реквізитів через багато рівнів, [композиція компонентів](/docs/composition-vs-inheritance.html) часто є простішим рішенням, ніж контекст.**

Наприклад, розглянемо компонент `Page`, який передає властивість `user` і `avatarSize` на кілька рівнів нижче, щоб глибоко вкладені компоненти `Link` і `Avatar` могли прочитати його:

```js
<Page user={user} avatarSize={avatarSize} />
// ... який рендерить ...
<PageLayout user={user} avatarSize={avatarSize} />
// ... який рендерить ...
<NavigationBar user={user} avatarSize={avatarSize} />
// ... який рендерить ...
<Link href={user.permalink}>
  <Avatar user={user} size={avatarSize} />
</Link>
```

Може здатися зайвим передавати властивості `user` і `avatarSize` через багато рівнів, якщо зрештою вони дійсно потрібні лише компоненту `Avatar`. Також дратує те, що щоразу, коли компонент `Avatar` потребує додаткових реквізитів зверху, ви також повинні додавати їх на всіх проміжних рівнях.

Один із способів вирішити цю проблему **без контексту** — це [передавати сам компонент `Avatar`](/docs/composition-vs-inheritance.html#containment) щоб проміжним компонентам не потрібно було знати про властивості `user` або `avatarSize`:

```js
function Page(props) {
  const user = props.user;
  const userLink = (
    <Link href={user.permalink}>
      <Avatar user={user} size={props.avatarSize} />
    </Link>
  );
  return <PageLayout userLink={userLink} />;
}

// Теперь ми маємо:
<Page user={user} avatarSize={avatarSize} />
// ... який рендерить ...
<PageLayout userLink={...} />
// ... який рендерить ...
<NavigationBar userLink={...} />
// ... який рендерить ...
{props.userLink}
```

Завдяки цій зміні лише верхній компонент Page має знати про використання `user` і `avatarSize` компонентами `Link` і `Avatar`.

<<<<<<< HEAD
Ця *інверсія керування* може зробити ваш код чистішим у багатьох випадках, зменшивши кількість реквізитів, які потрібно пропустити через вашу програму, і надавши більше контролю кореневим компонентам. Однак це не завжди правильний вибір: переміщення більшої складності вище в дереві робить компоненти вищого рівня складнішими та змушує компоненти нижчого рівня бути більш гнучкими, ніж вам хочеться.
=======
This *inversion of control* can make your code cleaner in many cases by reducing the amount of props you need to pass through your application and giving more control to the root components. Such inversion, however, isn't the right choice in every case; moving more complexity higher in the tree makes those higher-level components more complicated and forces the lower-level components to be more flexible than you may want.
>>>>>>> d4e42ab21f0cc7d8b79d1a619654e27c79e10af6

Ви не обмежені одним дочірнім компонентом. Ви можете передати кілька дочірніх компонентів або навіть мати кілька окремих "слотів" для дочірніх компонентів, [як описано тут](/docs/composition-vs-inheritance.html#containment):

```js
function Page(props) {
  const user = props.user;
  const content = <Feed user={user} />;
  const topBar = (
    <NavigationBar>
      <Link href={user.permalink}>
        <Avatar user={user} size={props.avatarSize} />
      </Link>
    </NavigationBar>
  );
  return (
    <PageLayout
      topBar={topBar}
      content={content}
    />
  );
}
```

Ціого паттерну достатньо для багатьох випадків, коли потрібно відділити дочірній компонент від найближчих батьків. Ви можете піти ще далі за допомогою [рендер-пропси](/docs/render-props.html) якщо дочірня компонента потребує взаємодії з батьківською перед рендерингом.

Однак іноді ті самі дані повинні бути доступні багатьом компонентам у дереві та на різних рівнях вкладеності. Контекст дозволяє вам "транслювати" такі дані та зміни до них усім компонентам нижче. Поширені приклади, коли використання контексту може бути простішим, ніж альтернативи, включають керування поточною мовою, темою або кеш-пам’яттю даних.

## API {#api}

### `React.createContext` {#reactcreatecontext}

```js
const MyContext = React.createContext(defaultValue);
```

Створює об’єкт Context. Коли React відтворює компонент, який підписується на цей об’єкт Context, він читатиме поточне значення контексту з найближчого відповідного `Provider` над ним у дереві.

<<<<<<< HEAD
Аргумент `defaultValue` використовується **тільки**, коли компонент не має відповідного провайдера над ним у дереві. Це може бути корисним для тестування компонентів ізольовано без їх упаковки. Примітка: передача `undefined` як значення провайдера не призводить до використання споживаючими компонентами `defaultValue`.
=======
The `defaultValue` argument is **only** used when a component does not have a matching Provider above it in the tree. This default value can be helpful for testing components in isolation without wrapping them. Note: passing `undefined` as a Provider value does not cause consuming components to use `defaultValue`.
>>>>>>> d4e42ab21f0cc7d8b79d1a619654e27c79e10af6

### `Context.Provider` {#contextprovider}

```js
<MyContext.Provider value={/* some value */}>
```

Every Context object comes with a Provider React component that allows consuming components to subscribe to context changes.

The Provider component accepts a `value` prop to be passed to consuming components that are descendants of this Provider. One Provider can be connected to many consumers. Providers can be nested to override values deeper within the tree.

All consumers that are descendants of a Provider will re-render whenever the Provider's `value` prop changes. The propagation from Provider to its descendant consumers (including [`.contextType`](#classcontexttype) and [`useContext`](/docs/hooks-reference.html#usecontext)) is not subject to the `shouldComponentUpdate` method, so the consumer is updated even when an ancestor component skips an update.

Changes are determined by comparing the new and old values using the same algorithm as [`Object.is`](//developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is#Description).

> Note
>
> The way changes are determined can cause some issues when passing objects as `value`: see [Caveats](#caveats).

### `Class.contextType` {#classcontexttype}

```js
class MyClass extends React.Component {
  componentDidMount() {
    let value = this.context;
    /* perform a side-effect at mount using the value of MyContext */
  }
  componentDidUpdate() {
    let value = this.context;
    /* ... */
  }
  componentWillUnmount() {
    let value = this.context;
    /* ... */
  }
  render() {
    let value = this.context;
    /* render something based on the value of MyContext */
  }
}
MyClass.contextType = MyContext;
```

The `contextType` property on a class can be assigned a Context object created by [`React.createContext()`](#reactcreatecontext). Using this property lets you consume the nearest current value of that Context type using `this.context`. You can reference this in any of the lifecycle methods including the render function.

> Note:
>
> You can only subscribe to a single context using this API. If you need to read more than one see [Consuming Multiple Contexts](#consuming-multiple-contexts).
>
> If you are using the experimental [public class fields syntax](https://babeljs.io/docs/plugins/transform-class-properties/), you can use a **static** class field to initialize your `contextType`.


```js
class MyClass extends React.Component {
  static contextType = MyContext;
  render() {
    let value = this.context;
    /* render something based on the value */
  }
}
```

### `Context.Consumer` {#contextconsumer}

```js
<MyContext.Consumer>
  {value => /* render something based on the context value */}
</MyContext.Consumer>
```

A React component that subscribes to context changes. Using this component lets you subscribe to a context within a [function component](/docs/components-and-props.html#function-and-class-components).

Requires a [function as a child](/docs/render-props.html#using-props-other-than-render). The function receives the current context value and returns a React node. The `value` argument passed to the function will be equal to the `value` prop of the closest Provider for this context above in the tree. If there is no Provider for this context above, the `value` argument will be equal to the `defaultValue` that was passed to `createContext()`.

> Note
>
> For more information about the 'function as a child' pattern, see [render props](/docs/render-props.html).

### `Context.displayName` {#contextdisplayname}

Context object accepts a `displayName` string property. React DevTools uses this string to determine what to display for the context.

For example, the following component will appear as MyDisplayName in the DevTools:

```js{2}
const MyContext = React.createContext(/* some value */);
MyContext.displayName = 'MyDisplayName';

<MyContext.Provider> // "MyDisplayName.Provider" in DevTools
<MyContext.Consumer> // "MyDisplayName.Consumer" in DevTools
```

## Examples {#examples}

### Dynamic Context {#dynamic-context}

A more complex example with dynamic values for the theme:

**theme-context.js**
`embed:context/theme-detailed-theme-context.js`

**themed-button.js**
`embed:context/theme-detailed-themed-button.js`

**app.js**
`embed:context/theme-detailed-app.js`

### Updating Context from a Nested Component {#updating-context-from-a-nested-component}

It is often necessary to update the context from a component that is nested somewhere deeply in the component tree. In this case you can pass a function down through the context to allow consumers to update the context:

**theme-context.js**
`embed:context/updating-nested-context-context.js`

**theme-toggler-button.js**
`embed:context/updating-nested-context-theme-toggler-button.js`

**app.js**
`embed:context/updating-nested-context-app.js`

### Consuming Multiple Contexts {#consuming-multiple-contexts}

To keep context re-rendering fast, React needs to make each context consumer a separate node in the tree.

`embed:context/multiple-contexts.js`

If two or more context values are often used together, you might want to consider creating your own render prop component that provides both.

## Caveats {#caveats}

Because context uses reference identity to determine when to re-render, there are some gotchas that could trigger unintentional renders in consumers when a provider's parent re-renders. For example, the code below will re-render all consumers every time the Provider re-renders because a new object is always created for `value`:

`embed:context/reference-caveats-problem.js`


To get around this, lift the value into the parent's state:

`embed:context/reference-caveats-solution.js`

## Legacy API {#legacy-api}

> Note
>
> React previously shipped with an experimental context API. The old API will be supported in all 16.x releases, but applications using it should migrate to the new version. The legacy API will be removed in a future major React version. Read the [legacy context docs here](/docs/legacy-context.html).

