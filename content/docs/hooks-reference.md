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

Приймає об'єкт контексту (значення, повернуте з `React.createContext`) і повертає поточне значення контексту для нього. Поточне значення контексту визначається пропом `value` найближчого `<MyContext.Provider>`, що знаходиться вище у дереві компонентів.

Коли найближчий `<MyContext.Provider>`, що знаходиться вище поточного компонента, оновлюється, цей хук викличе повторний рендер з актуальним `value` контексту, переданим до провайдера `MyContext`.

Не забудьте про те, що аргумент переданий у `useContext`, повиен бути *власне об'єктом контексту*:

 * **Правильно:** `useContext(MyContext)`
 * **Неправильно:** `useContext(MyContext.Consumer)`
 * **Неправильно:** `useContext(MyContext.Provider)`

Компонент, що викликає `useContext`, завжди повторно відрендериться при зміні значення контексту. Якщо повторний рендер є вартісною операцією, ви можете [оптимізувати його, використавши мемоізацію](https://github.com/facebook/react/issues/15156#issuecomment-474590693).

>Порада
>
>Якщо ви ознайомились з API контексту до хуків, `useContext(MyContext)` є еквівалентним `static contextType = MyContext` у класі чи `<MyContext.Consumer>`.
>
>`useContext(MyContext)` дозволяє лише *читати* контекст і підписуватись на його зміни. Вам і досі необхідно мати `<MyContext.Provider>` вище у дереві, щоб *надати* цьому контексту значення.

## Додаткові хуки {#additional-hooks}

Наступні хуки є або варіантами базових із розділу вище, або потрібні у вкрай специфічних випадках. Не потрібно вивчати їх наперед.

### `useReducer` {#usereducer}

```js
const [state, dispatch] = useReducer(reducer, initialArg, init);
```

Є альтернативою [`useState`](#usestate). Приймає редюсер типу `(state, action) => newState` і повертає поточний стан у парі з методом `dispatch`. (Якщо ви знайомі з Redux, ви вже знаєте як це працює.)

Слід віддати перевагу `useReducer` над `useState`, коли ви маєте складну логіку стану, що включає багато значень чи ваш наступний стан залежить від попереднього. Крім того, `useReducer` дозволяє вам оптимізувати продуктивність для компонентів, що викликають глибокі оновлення, тому що [ви можете передати вниз `dispatch`, замість функцій повторного виклику](/docs/hooks-faq.html#how-to-avoid-passing-callbacks-down).

Ось приклад лічильника із розділу [`useState`](#usestate), переписаний із використанням редюсера:

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

>Примітка
>
>React гарантує, що функція `dispatch` зберігає ідентичність і не змінюється під час повторних рендерів. Саме тому, ви можете безпечно пропускати її включення до списків залежностей хуків `useEffect` чи `useCallback`.

#### Визначення початкового стану {#specifying-the-initial-state}

Є два різних шляхи ініціалізації стану `useReducer`. Ви можете обрати будь-який, залежно від ситуації. Найпростіши м варіантом є передача початкового стану другим аргументом:

```js{3}
  const [state, dispatch] = useReducer(
    reducer,
    {count: initialCount}
  );
```

>Примітка
>
>React не використовує `state = initialState` конвенцію про аргументи, популяризовану в Redux. Початкове значення часом залежить від пропсів, а тому вказується безпосередньо у виклиці хука. Якщо ви впевнені щодо цього, ви можете викликати `useReducer(reducer, undefined, reducer)`, щоб земулювати поведінку Redux, але робити так не рекомендується.

#### Лінива ініціалізація {#lazy-initialization}

Ви також можете ліниво створити початковий стан. Щоб зробити це, ви можете передати функцію `init` третім аргументом. Початковий стан буде встановлений у `init(initialArg)`.

Це дозволить винести логіку обчислення початкового стану з редюсера. Також це може бути корисним при скиданні стану пізніше у відповідь на дію:

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
      Лічильник: {state.count}
      <button
        onClick={() => dispatch({type: 'reset', payload: initialCount})}>
        Скинути
      </button>
      <button onClick={() => dispatch({type: 'increment'})}>+</button>
      <button onClick={() => dispatch({type: 'decrement'})}>-</button>
    </>
  );
}
```

#### Припинення дії dispatch {#bailing-out-of-a-dispatch}

Якщо ви повернете з хука редюсера значення, що дорівнює поточному стану, React вийде з нього без рендерингу дочірніх елементів чи запуску ефектів. (React використовує [алгоритм порівняння `Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is#Description).)

Зверніть увагу, що React може знадобитись відрендерити конкретний компонент перед припиненням оновлення. Це не повинно викликати занепокоєння, тому що React необов'язково опуститься "глибше" в дерево. Якщо ви здійснюєте вартісні обчислення під час рендерингу, ви можете оптимізувати їх, використавши `useMemo`.

### `useCallback` {#usecallback}

```js
const memoizedCallback = useCallback(
  () => {
    doSomething(a, b);
  },
  [a, b],
);
```

Повертає [мемоізовану](https://en.wikipedia.org/wiki/Memoization) функцію зворотнього виклику.

Передайте вбудовану функцію зворотнього виклику і масив залежностей. `useCallback` поверне мемоізовану версію функції зворотнього виклику, котра змінюється лише тоді, коли одна з її залежностей змінюється. Це корисно при передачі фукцій зворотнього виклику до оптимізоваих дочірніх компонентів, що покладаються на рівність посилань задля уникнення непотрібних рендерів (наприклад, `shouldComponentUpdate`).

`useCallback(fn, deps)` є еквівалентом `useMemo(() => fn, deps)`.

> Примітка
>
> Масив залежностей не передається у якості аргументів до функції зворотнього виклику. Концептуально, проте, це те, що вони представляють: кожне значення, на яке посилається функція зворотнього виклику, також має з'являтись у масиві залежностей. У майбутньому, достатньо просунутий компілятор зможе створити цей масив автоматично.
>
> Ми радимо використовувати правило [`exhaustive-deps`](https://github.com/facebook/react/issues/14920), як частину нашого пакунку [`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks#installation). Воно попереджує про те, що залежності вказані невірно і пропонує рішення.

### `useMemo` {#usememo}

```js
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

Повертає [мемоізоване](https://en.wikipedia.org/wiki/Memoization) значення.

Передайте функцію "створення" та масив залежностей. `useMemo` повторно обчислить мемоізоване значення лише при зміні однієї з залежностей. Така оптимізація допомагає уникнути вартісних обчислень при кожному рендері.

Пам'ятайте, що функція, передана до `useMemo`, запускається під час рендерингу. Не робіть у ній нічого, що ви зазвичай не робите під час рендерингу. Наприклад, побічні ефекти мають бути в `useEffect`, а не `useMemo`.

Якщо масив не наданий, нове значення буде обчислене при кожному рендері.

**Ви можете покластись на `useMemo` як на оптимізацію продуктивності, а не на семантичу гарантію.** У майбутньому React може вирішити "забути" деякі попередньо мемоізовані значення і переобчислити їх при наступному рендері, наприклад, для звілбнення пам'яті для компонентів поза областю видимості екрана. Напишіть ваш код так, щоб він працював без `useMemo`, а потім додайте його для оптимізації продуктивності.

> Примітка
>
> Масив залежностей не передається у якості аргументів до функції. Концептуально, проте, це те, що вони представляють: кожне значення, на яке посилається функція, також має з'являтись у масиві залежностей. У майбутньому, достатньо просунутий компілятор зможе створити цей масив автоматично.
>
> Ми радимо використовувати правило [`exhaustive-deps`](https://github.com/facebook/react/issues/14920), як частину нашого пакунку [`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks#installation). Воно попереджує про те, що залежності вказані невірно і пропонує рішення.

### `useRef` {#useref}

```js
const refContainer = useRef(initialValue);
```

`useRef` поверне змінний об'єкт рефу, властивість `.current` якого ініціалізується переданим аргументом (`initialValue`). Повернутий об'єкт буде зберігатись протягом всього часу життя компонента.

Поширеним випадком використання є імперативний доступ до потомків:

```js
function TextInputWithFocusButton() {
  const inputEl = useRef(null);
  const onButtonClick = () => {
    // `current` вказує на примонтований елемент поля вводу тексту
    inputEl.current.focus();
  };
  return (
    <>
      <input ref={inputEl} type="text" />
      <button onClick={onButtonClick}>Фокусуватись на полі вводу</button>
    </>
  );
}
```

По суті, `useRef` — це "коробка", що може містити змінне значення у власній властивості `.current`.

Рефи можуть бути вам знайомими перш за все як [засіб доступу до DOM](/docs/refs-and-the-dom.html). Якщо ви передасте об'єкт рефу у React як `<div ref={myRef} />`, React встановить його властивість `.current` рівною значенню відповідного DOM вузла при будь-якій зміні цього вузла.

Проте `useRef()` є корисним не тільки для простого атрибута `ref`. Він [згодиться для постійного збереження будь-якого змінного значення](/docs/hooks-faq.html#is-there-something-like-instance-variables) подібно до використання полей екземпляра класу.

Це можливо, тому що `useRef()` створює простий JavaScript-об'єкт. Єдина різниця між `useRef()` і створенням об'єкта `{current: ...}` власноруч полягає в тому, що `useRef` поверне один і той самий реф-об'єкт при кожному рендері.

Пам'ятайте, що `useRef` *не* повідомляє вас про зміну свого вмісту. Зміна властивості `.current` не спричинить повторний рендер. Якщо ви хочете запустити деякий код під час того, як React прикріплює чи від'єднує реф до вузла DOM, то вам краще використати [реф зворотнього виклику](/docs/hooks-faq.html#how-can-i-measure-a-dom-node).


### `useImperativeHandle` {#useimperativehandle}

```js
useImperativeHandle(ref, createHandle, [deps])
```

`useImperativeHandle` налаштовує значення екземпляра, яке надається батьківським компонентам при використанні `ref`. Як і зазвичай, у більшості випадків ви маєте уникати імперативного коду з використанням рефів. `useImperativeHandle` має використовуватись разом з `forwardRef`:

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

У цьому прикладі батьківський компонент, що рендерить `<FancyInput ref={fancyInputRef} />`, матиме змогу викликати `fancyInputRef.current.focus()`.

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
