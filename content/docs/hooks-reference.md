---
id: hooks-reference
title: API-довідник хуків
permalink: docs/hooks-reference.html
prev: hooks-custom.html
next: hooks-faq.html
---

*Хуки* — це новинка в React 16.8. Вони дозволяють вам використовувати стан та інші можливості React без написання класу.

Ця сторінка описує API для вбудованих у React хуків.

Якщо ви новачок у хуках, ви можете спочатку переглянути [огляд](/docs/hooks-overview.html). Також ви можете знайти корисну інформацію у розділі [часто задаваних питань](/docs/hooks-faq.html).

- [Базові Хуки](#basic-hooks)
  - [`useState`](#usestate)
  - [`useEffect`](#useeffect)
  - [`useContext`](#usecontext)
- [Додаткові Хуки](#additional-hooks)
  - [`useReducer`](#usereducer)
  - [`useCallback`](#usecallback)
  - [`useMemo`](#usememo)
  - [`useRef`](#useref)
  - [`useImperativeHandle`](#useimperativehandle)
  - [`useLayoutEffect`](#uselayouteffect)
  - [`useDebugValue`](#usedebugvalue)

## Базові хуки {#basic-hooks}

### `useState` {#usestate}

```js
const [state, setState] = useState(initialState);
```

Повертає значення стану та функцію, що оновлює його.

Під час початкового рендеру повернутий стан (`state`) співпадає зі значенням, переданим у першому аргументі (`initialState`).

Функція `setState` використовується для оновлення стану. Вона приймає значення нового стану і ставить у чергу повторний рендер компонента.

```js
setState(newState);
```

Упродовж наступних повторних рендерів, перше значення, повернуте `useState`, завжди буде у актуальному стані при здійсненні оновлень.

>Примітка
>
>React гарантує, що функція `setState` зберігає ідентичність і не змінюється під час повторних рендерів. Саме тому, ви можете безпечно пропускати її включення до списків залежностей хуків `useEffect` чи `useCallback`.

#### Функціональні оновлення {#functional-updates}

Якщо наступний стан обчислюється з використанням попереднього, ви можете передати функцію до `setState`. Функція отримає попереднє значення і поверне оновлене. Ось приклад компонента лічильника, що використовує обидві форми `setState`:

```js
function Counter({initialCount}) {
  const [count, setCount] = useState(initialCount);
  return (
    <>
      Count: {count}
      <button onClick={() => setCount(initialCount)}>Скинути</button>
      <button onClick={() => setCount(prevCount => prevCount + 1)}>+</button>
      <button onClick={() => setCount(prevCount => prevCount - 1)}>-</button>
    </>
  );
}
```

Кнопки "+" та "-" використовують функціональну форму, тому що оновлене значення базується на попередньому. В той же час кнопка "Скинути" використовує нормальну форму, тому що вона завжди скидає значення назад до 0.

> Примітка
>
> На відміну від методу `setState` у класових компонентах, `useState` не об'єднує оновлювані об'єкти автоматично. Ви можете відтворити таку поведінку, комбінуючи функціональну форму оновлення і синтаксис розширення об'єктів:
>
> ```js
> setState(prevState => {
>   // Object.assign також спрацює
>   return {...prevState, ...updatedValues};
> });
> ```
>
> Іншим варіантом може бути хук `useReducer`, котрий більш підходть для керування об'єктами стану, що містять багато інших значень.

#### Лінива ініціалізація стану {#lazy-initial-state}

Аргумент `initialState` — це стан, що використовується протягом початкового рендеру. При наступних рендерах воно не враховується. Якщо початковий стан є результатом вартісних обчислень, ви можете замість нього надати функцію, що буде виконана лише під час початкового рендеру:

```js
const [state, setState] = useState(() => {
  const initialState = someExpensiveComputation(props);
  return initialState;
});
```

#### Припинення оновлення стану {#bailing-out-of-a-state-update}

Якщо ви оновите стан хука значенням, що дорівнює поточному, React вийде з хука без рендерингу дочірніх елементів чи запуску ефектів. (React використовує [алгоритм порівняння `Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is#Description).)

Зверніть увагу, що React може знадобитись відрендерити конкретний компонент перед припиненням оновлення. Це не повинно викликати занепокоєння, тому що React необов'язково опуститься "глибше" в дерево. Якщо ви здійснюєте вартісні обчислення під час рендерингу, ви можете оптимізувати їх, використавши `useMemo`.

### `useEffect` {#useeffect}

```js
useEffect(didUpdate);
```

Приймає функцію, що містить імперативний, можливо з ефектами, код.

Зміни, підписки, таймери, логування та інші побічні ефекти не дозволяються всередині основного тіла функціонального компонента (яке ми називаємо _етап рендеру_). Це призводить до заплутаних помилок та невідповідностям у користувацькому інтерфейсі.

Натомість застосовуйте `useEffect`. Функція, передана в `useEffect`, буде запущена після того, як вивід рендеру з'явиться на екрані. Думайте про ефекти як про засіб втечі з чисто функціонального світу React до світу імперативів.

За замовчуванням ефекти запускаються після кожного завершеного рендеру, але ви можете запускати їх, наприклад, коли [змінились тільки певні значення](#conditionally-firing-an-effect).

#### Очищення ефектів {#cleaning-up-an-effect}

Ефекти часто створюють ресурси, пам'ять після використання яких, має бути звільнена перед тим, як компонент зникне з екрану, наприклад, підписка або ідентифікатор таймера. Щоб це зробити, функція, передана у `useEffect`, може повернути функцію очищення. Наприклад, щоб створити підписку:

```js
useEffect(() => {
  const subscription = props.source.subscribe();
  return () => {
    // Очистити підписку
    subscription.unsubscribe();
  };
});
```

Функція очищення буде запущена перед видаленням компонента з інтерфейсу користувача, щоб запобігти витокам пам'яті. Крім цього, якщо компонент рендериться багато разів (що доволі типово), **попередній ефект буде очищено до виконання наступного**. У нашому прикладі це означає, що нова підписка створюється на кожному оновленні. Зверніться до наступного розділу, щоб дізнатися, як цього можна уникнути.

#### Порядок спрацювання ефектів {#timing-of-effects}

На відміну від `componentDidMount` і `componentDidUpdate`, функція передана в `useEffect` запускається **після** розмітки та рендеру, протягом відкладеної події. Це робить хук підходящим для багатьох поширених побічних ефектів, таких як налаштування підписок та обробників подій, оскільки більшість типів роботи не повинні блокувати оновлення екрану браузером.

Проте не всі ефекти можуть бути відкладені. Наприклад, зміна DOM, що видима користувачу, має запуститись синхронно перед наступним рендером, щоб користувач не помічав візуальної невідповідності. (Ця відмінність концептально подібна до відмінності між пасивними та активними слухачами подій.) Для таких різновидів ефектів React надає додатковий хук, що зветься [`useLayoutEffect`](#uselayouteffect). Він має таку ж сигнатуру, як і `useEffect`, але відрізняється умовою запуску.

Незважаючи на те, що `useEffect` відкладається допоки браузер не виконає відображення, він гарантовано спрацює перед кожним новим рендером. React завжди застосовує ефекти попереднього рендеру перед початком нового оновлення.

#### Умовне спрацювання ефекту {#conditionally-firing-an-effect}

За замовчуванням ефекти спрацьовуються після кожного завершеного рендеру. Таким чином, ефект завжди створюється повторно при зміні одної з його залежностей.

Проте, у деяких випадках, це може бути надлишковим, так само як у прикладі з підпискою у попередньому розділі. Нам не потрібно створювати нову підписку для кожного оновлення, а лише тоді, коли змінився проп `source`.

Щоб реалізувати це, передайте другим аргументом до `useEffect` масив значень, від яких залежить ефект. Наш оновлений ефект тепер виглядає так:

```js
useEffect(
  () => {
    const subscription = props.source.subscribe();
    return () => {
      subscription.unsubscribe();
    };
  },
  [props.source],
);
```

Зараз підписка буде створена повторно лише при зміні `props.source`.

>Примітка
>
>Якщо ви використовуєте цю оптимізацію, впевніться, що масив включає **всі значення з області видимості компонента (такі як пропси чи стан), що можуть змінюватись протягом часу і використовуються ефектом**. Інакше, ваш код буде посилатись на застарілі значення з попередніх рендерів. Дізнайтеся більше про те, [як мати справу з функціями](/docs/hooks-faq.html#is-it-safe-to-omit-functions-from-the-list-of-dependencies) та що робити, коли [значення масиву змінюються надто часто](/docs/hooks-faq.html#what-can-i-do-if-my-effect-dependencies-change-too-often).
>
>Якщо ви хочете запустити ефект і очистити його лише раз (при монтуванні і розмонтуванні), ви можете передати другим аргументом порожній масив (`[]`). React буде вважати, що ваш ефект не залежить від *жодного* із значень пропсів чи стану, а тому не потребує повторного запуску. Це не оброблюється як особливий випадок, а напряму випливає з роботи масиву залежностей.
>
>Якщо ви передаєте порожній масив (`[]`), пропси і стан усередині ефекту будуть завжди мати їх початкові значення. Передача другим аргументом `[]`, нагадує модель роботи вже знайомих `componentDidMount` та `componentWillUnmount`, але зазвичай є [кращі](/docs/hooks-faq.html#is-it-safe-to-omit-functions-from-the-list-of-dependencies) [рішення](/docs/hooks-faq.html#what-can-i-do-if-my-effect-dependencies-change-too-often) для уникнення частих повторних викликів ефектів. Також не забудьте, що React відкладає виконання `useEffect` до моменту відображення вмісту браузером, а отже можливість виконання додаткової роботи не є істотною проблемою.
>
>
>Ми радимо використовувати правило [`exhaustive-deps`](https://github.com/facebook/react/issues/14920), як частину нашого пакунку [`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks#installation). Воно попереджує про те, що залежності вказані невірно і пропонує рішення.

Масив залежностей не передається у якості аргументів до функції ефекту. Концептуально, проте, це те, що вони представляють: кожне значення, на яке посилається функція ефекту, також має з'являтись у масиві залежностей. У майбутньому, достатньо просунутий компілятор зможе створити цей масив автоматично.

### `useContext` {#usecontext}

```js
const value = useContext(MyContext);
```

Accepts a context object (the value returned from `React.createContext`) and returns the current context value for that context. The current context value is determined by the `value` prop of the nearest `<MyContext.Provider>` above the calling component in the tree.

When the nearest `<MyContext.Provider>` above the component updates, this Hook will trigger a rerender with the latest context `value` passed to that `MyContext` provider.

Don't forget that the argument to `useContext` must be the *context object itself*:

 * **Correct:** `useContext(MyContext)`
 * **Incorrect:** `useContext(MyContext.Consumer)`
 * **Incorrect:** `useContext(MyContext.Provider)`

A component calling `useContext` will always re-render when the context value changes. If re-rendering the component is expensive, you can [optimize it by using memoization](https://github.com/facebook/react/issues/15156#issuecomment-474590693).

>Tip
>
>If you're familiar with the context API before Hooks, `useContext(MyContext)` is equivalent to `static contextType = MyContext` in a class, or to `<MyContext.Consumer>`.
>
>`useContext(MyContext)` only lets you *read* the context and subscribe to its changes. You still need a `<MyContext.Provider>` above in the tree to *provide* the value for this context.

## Additional Hooks {#additional-hooks}

The following Hooks are either variants of the basic ones from the previous section, or only needed for specific edge cases. Don't stress about learning them up front.

### `useReducer` {#usereducer}

```js
const [state, dispatch] = useReducer(reducer, initialArg, init);
```

An alternative to [`useState`](#usestate). Accepts a reducer of type `(state, action) => newState`, and returns the current state paired with a `dispatch` method. (If you're familiar with Redux, you already know how this works.)

`useReducer` is usually preferable to `useState` when you have complex state logic that involves multiple sub-values or when the next state depends on the previous one. `useReducer` also lets you optimize performance for components that trigger deep updates because [you can pass `dispatch` down instead of callbacks](/docs/hooks-faq.html#how-to-avoid-passing-callbacks-down).

Here's the counter example from the [`useState`](#usestate) section, rewritten to use a reducer:

```js
const initialState = {count: 0};

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return {count: state.count + 1};
    case 'decrement':
      return {count: state.count - 1};
    default:
      throw new Error();
  }
}

function Counter({initialState}) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <>
      Count: {state.count}
      <button onClick={() => dispatch({type: 'increment'})}>+</button>
      <button onClick={() => dispatch({type: 'decrement'})}>-</button>
    </>
  );
}
```

>Note
>
>React guarantees that `dispatch` function identity is stable and won't change on re-renders. This is why it's safe to omit from the `useEffect` or `useCallback` dependency list.

#### Specifying the initial state {#specifying-the-initial-state}

There’s two different ways to initialize `useReducer` state. You may choose either one depending on the use case. The simplest way to pass the initial state as a second argument:

```js{3}
  const [state, dispatch] = useReducer(
    reducer,
    {count: initialCount}
  );
```

>Note
>
>React doesn’t use the `state = initialState` argument convention popularized by Redux. The initial value sometimes needs to depend on props and so is specified from the Hook call instead. If you feel strongly about this, you can call `useReducer(reducer, undefined, reducer)` to emulate the Redux behavior, but it's not encouraged.

#### Lazy initialization {#lazy-initialization}

You can also create the initial state lazily. To do this, you can pass an `init` function as the third argument. The initial state will be set to `init(initialArg)`.

It lets you extract the logic for calculating the initial state outside the reducer. This is also handy for resetting the state later in response to an action:

```js{1-3,11-12,19,24}
function init(initialCount) {
  return {count: initialCount};
}

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return {count: state.count + 1};
    case 'decrement':
      return {count: state.count - 1};
    case 'reset':
      return init(action.payload);
    default:
      throw new Error();
  }
}

function Counter({initialCount}) {
  const [state, dispatch] = useReducer(reducer, initialCount, init);
  return (
    <>
      Count: {state.count}
      <button
        onClick={() => dispatch({type: 'reset', payload: initialCount})}>
        Reset
      </button>
      <button onClick={() => dispatch({type: 'increment'})}>+</button>
      <button onClick={() => dispatch({type: 'decrement'})}>-</button>
    </>
  );
}
```

#### Bailing out of a dispatch {#bailing-out-of-a-dispatch}

If you return the same value from a Reducer Hook as the current state, React will bail out without rendering the children or firing effects. (React uses the [`Object.is` comparison algorithm](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is#Description).)

Note that React may still need to render that specific component again before bailing out. That shouldn't be a concern because React won't unnecessarily go "deeper" into the tree. If you're doing expensive calculations while rendering, you can optimize them with `useMemo`.

### `useCallback` {#usecallback}

```js
const memoizedCallback = useCallback(
  () => {
    doSomething(a, b);
  },
  [a, b],
);
```

Returns a [memoized](https://en.wikipedia.org/wiki/Memoization) callback.

Pass an inline callback and an array of dependencies. `useCallback` will return a memoized version of the callback that only changes if one of the dependencies has changed. This is useful when passing callbacks to optimized child components that rely on reference equality to prevent unnecessary renders (e.g. `shouldComponentUpdate`).

`useCallback(fn, deps)` is equivalent to `useMemo(() => fn, deps)`.

> Note
>
> The array of dependencies is not passed as arguments to the callback. Conceptually, though, that's what they represent: every value referenced inside the callback should also appear in the dependencies array. In the future, a sufficiently advanced compiler could create this array automatically.
>
> We recommend using the [`exhaustive-deps`](https://github.com/facebook/react/issues/14920) rule as part of our [`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks#installation) package. It warns when dependencies are specified incorrectly and suggests a fix.

### `useMemo` {#usememo}

```js
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

Returns a [memoized](https://en.wikipedia.org/wiki/Memoization) value.

Pass a "create" function and an array of dependencies. `useMemo` will only recompute the memoized value when one of the dependencies has changed. This optimization helps to avoid expensive calculations on every render.

Remember that the function passed to `useMemo` runs during rendering. Don't do anything there that you wouldn't normally do while rendering. For example, side effects belong in `useEffect`, not `useMemo`.

If no array is provided, a new value will be computed on every render.

**You may rely on `useMemo` as a performance optimization, not as a semantic guarantee.** In the future, React may choose to "forget" some previously memoized values and recalculate them on next render, e.g. to free memory for offscreen components. Write your code so that it still works without `useMemo` — and then add it to optimize performance.

> Note
>
> The array of dependencies is not passed as arguments to the function. Conceptually, though, that's what they represent: every value referenced inside the function should also appear in the dependencies array. In the future, a sufficiently advanced compiler could create this array automatically.
>
> We recommend using the [`exhaustive-deps`](https://github.com/facebook/react/issues/14920) rule as part of our [`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks#installation) package. It warns when dependencies are specified incorrectly and suggests a fix.

### `useRef` {#useref}

```js
const refContainer = useRef(initialValue);
```

`useRef` returns a mutable ref object whose `.current` property is initialized to the passed argument (`initialValue`). The returned object will persist for the full lifetime of the component.

A common use case is to access a child imperatively:

```js
function TextInputWithFocusButton() {
  const inputEl = useRef(null);
  const onButtonClick = () => {
    // `current` points to the mounted text input element
    inputEl.current.focus();
  };
  return (
    <>
      <input ref={inputEl} type="text" />
      <button onClick={onButtonClick}>Focus the input</button>
    </>
  );
}
```

Essentially, `useRef` is like a "box" that can hold a mutable value in its `.current` property.

You might be familiar with refs primarily as a way to [access the DOM](/docs/refs-and-the-dom.html). If you pass a ref object to React with `<div ref={myRef} />`, React will set its `.current` property to the corresponding DOM node whenever that node changes.

However, `useRef()` is useful for more than the `ref` attribute. It's [handy for keeping any mutable value around](/docs/hooks-faq.html#is-there-something-like-instance-variables) similar to how you'd use instance fields in classes.

This works because `useRef()` creates a plain JavaScript object. The only difference between `useRef()` and creating a `{current: ...}` object yourself is that `useRef` will give you the same ref object on every render.

Keep in mind that `useRef` *doesn't* notify you when its content changes. Mutating the `.current` property doesn't cause a re-render. If you want to run some code when React attaches or detaches a ref to a DOM node, you may want to use a [callback ref](/docs/hooks-faq.html#how-can-i-measure-a-dom-node) instead.


### `useImperativeHandle` {#useimperativehandle}

```js
useImperativeHandle(ref, createHandle, [deps])
```

`useImperativeHandle` customizes the instance value that is exposed to parent components when using `ref`. As always, imperative code using refs should be avoided in most cases. `useImperativeHandle` should be used with `forwardRef`:

```js
function FancyInput(props, ref) {
  const inputRef = useRef();
  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current.focus();
    }
  }));
  return <input ref={inputRef} ... />;
}
FancyInput = forwardRef(FancyInput);
```

In this example, a parent component that renders `<FancyInput ref={fancyInputRef} />` would be able to call `fancyInputRef.current.focus()`.

### `useLayoutEffect` {#uselayouteffect}

The signature is identical to `useEffect`, but it fires synchronously after all DOM mutations. Use this to read layout from the DOM and synchronously re-render. Updates scheduled inside `useLayoutEffect` will be flushed synchronously, before the browser has a chance to paint.

Prefer the standard `useEffect` when possible to avoid blocking visual updates.

> Tip
>
> If you're migrating code from a class component, note `useLayoutEffect` fires in the same phase as `componentDidMount` and `componentDidUpdate`. However, **we recommend starting with `useEffect` first** and only trying `useLayoutEffect` if that causes a problem.
>
>If you use server rendering, keep in mind that *neither* `useLayoutEffect` nor `useEffect` can run until the JavaScript is downloaded. This is why React warns when a server-rendered component contains `useLayoutEffect`. To fix this, either move that logic to `useEffect` (if it isn't necessary for the first render), or delay showing that component until after the client renders (if the HTML looks broken until `useLayoutEffect` runs).
>
>To exclude a component that needs layout effects from the server-rendered HTML, render it conditionally with `showChild && <Child />` and defer showing it with `useEffect(() => { setShowChild(true); }, [])`. This way, the UI doesn't appear broken before hydration.

### `useDebugValue` {#usedebugvalue}

```js
useDebugValue(value)
```

`useDebugValue` can be used to display a label for custom hooks in React DevTools.

For example, consider the `useFriendStatus` custom Hook described in ["Building Your Own Hooks"](/docs/hooks-custom.html):

```js{6-8}
function useFriendStatus(friendID) {
  const [isOnline, setIsOnline] = useState(null);

  // ...

  // Show a label in DevTools next to this Hook
  // e.g. "FriendStatus: Online"
  useDebugValue(isOnline ? 'Online' : 'Offline');

  return isOnline;
}
```

> Tip
>
> We don't recommend adding debug values to every custom Hook. It's most valuable for custom Hooks that are part of shared libraries.

#### Defer formatting debug values {#defer-formatting-debug-values}

In some cases formatting a value for display might be an expensive operation. It's also unnecessary unless a Hook is actually inspected.

For this reason `useDebugValue` accepts a formatting function as an optional second parameter. This function is only called if the Hooks are inspected. It receives the debug value as a parameter and should return a formatted display value.

For example a custom Hook that returned a `Date` value could avoid calling the `toDateString` function unnecessarily by passing the following formatter:

```js
useDebugValue(date, date => date.toDateString());
```
