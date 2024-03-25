---
title: Використання TypeScript
re: https://github.com/reactjs/react.dev/issues/5960
---

<Intro>

TypeScript — це популярний спосіб додавання визначень типів (type definitions) до вихідного коду JavaScript. TypeScript [підтримує JSX](/learn/writing-markup-with-jsx) без додаткових налаштувань, і ви можете отримати повну підтримку React Web, встановивши пакети [`@types/react`](https://www.npmjs.com/package/@types/react) і [`@types/react-dom`](https://www.npmjs.com/package/@types/react-dom) у своєму проєкті.

</Intro>

<YouWillLearn>

* [TypeScript з компонентами React](/learn/typescript#typescript-with-react-components)
* [Приклади типізації для хуків](/learn/typescript#example-hooks)
* [Найпоширеніші типи з пакету `@types/react`](/learn/typescript/#useful-types)
* [Де дізнатись більше](/learn/typescript/#further-learning)

</YouWillLearn>

## Встановлення {/*installation*/}

Усі [готові для впровадження React-фреймворки](/learn/start-a-new-react-project#production-grade-react-frameworks) підтримують використання TypeScript. Дотримуйтесь інструкції для встановлення у відповідному фреймворку:

- [Next.js](https://nextjs.org/docs/app/building-your-application/configuring/typescript)
- [Remix](https://remix.run/docs/en/1.19.2/guides/typescript)
- [Gatsby](https://www.gatsbyjs.com/docs/how-to/custom-configuration/typescript/)
- [Expo](https://docs.expo.dev/guides/typescript/)

### Додавання TypeScript до наявного React-проєкту {/*adding-typescript-to-an-existing-react-project*/}

Щоб встановити останню версію визначень типів для React, виконайте команду:

<TerminalBlock>
npm install @types/react @types/react-dom
</TerminalBlock>

У вашому `tsconfig.json` потрібно вказати такі параметри компілятора:

1. `dom` має бути додано до параметру [`lib`](https://www.typescriptlang.org/tsconfig/#lib) (Зауважте: якщо параметр `lib` не вказаний, то `dom` вже додано).
2. Параметр [`jsx`](https://www.typescriptlang.org/tsconfig/#jsx) повинен мати одне з допустимих значень. Для більшості застосунків достатньо вказати `preserve`.
  Якщо ви публікуєте бібліотеку, зверніться до [документації `jsx`](https://www.typescriptlang.org/tsconfig/#jsx), щоб вибрати правильне значення.

## TypeScript з компонентами React {/*typescript-with-react-components*/}

<Note>

Кожен файл, що містить JSX, повинен використовувати розширення файлу `.tsx`. Це специфічне для TypeScript розширення, яке повідомляє TypeScript, що цей файл містить JSX.

</Note>

Написання TypeScript коду з React дуже схоже на написання JavaScript коду з React. Основна різниця під час роботи з компонентом полягає в тому, що ви можете вказувати типи пропсів вашого компонента. Ці типи можна використовувати для перевірки правильності коду та надання вбудованої документації в редакторах коду.

Додамо тип для пропу `title` у кнопці, що є [компонентом `MyButton`](/learn#components) з розділу ["Швидкий старт"](/learn):

<Sandpack>

```tsx src/App.tsx active
function MyButton({ title }: { title: string }) {
  return (
    <button>{title}</button>
  );
}

export default function MyApp() {
  return (
    <div>
      <h1>Ласкаво прошу до мого застосунку</h1>
      <MyButton title="Кнопка" />
    </div>
  );
}
```

```js src/App.js hidden
import AppTSX from "./App.tsx";
export default App = AppTSX;
```
</Sandpack>

 <Note>

Ці пісочниці можуть обробляти код TypeScript, але вони не виконують перевірку типів. Це означає, що ви можете вносити зміни до пісочниці TypeScript для навчання, але не отримаєте жодних помилок або попереджень щодо типів. Для цього краще використовувати [пісочницю TypeScript](https://www.typescriptlang.org/play) або іншу онлайн-пісочницю з більшим функціоналом.

</Note>

Цей вбудований синтаксис є найпростішим способом надати типи для компонента, хоча для більшої кількості полів це може бути незручним. Тоді ви можете використовувати `interface` або `type` для опису пропсів компонента:

<Sandpack>

```tsx src/App.tsx active
interface MyButtonProps {
  /** Текст для відображення всередині кнопки */
  title: string;
  /** Чи можна взаємодіяти з кнопкою */
  disabled: boolean;
}

function MyButton({ title, disabled }: MyButtonProps) {
  return (
    <button disabled={disabled}>{title}</button>
  );
}

export default function MyApp() {
  return (
    <div>
      <h1>Ласкаво прошу до мого застосунку</h1>
      <MyButton title="Неактивна кнопка" disabled={true}/>
    </div>
  );
}
```

```js src/App.js hidden
import AppTSX from "./App.tsx";
export default App = AppTSX;
```

</Sandpack>

Тип, що описує пропси вашого компонента, може бути настільки простим або складним, наскільки ви забажаєте, хоч вони і повинні бути об'єктом, описані за допомогою `type` або `interface`. Дізнайтеся про те, як TypeScript описує об'єкти, у статті ["Об'єктні типи"](https://www.typescriptlang.org/docs/handbook/2/objects.html); ви також можете бути зацікавлені у використанні [типів об'єднання (union types)](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types) для опису пропу з кількома різними типами або у [створенні типів із типів](https://www.typescriptlang.org/docs/handbook/2/types-from-types.html) для інших більш складних випадків.


## Приклади для хуків {/*example-hooks*/}

Визначення типів з пакету `@types/react` включають типи вбудованих хуків для використання у компонентах без додаткових налаштувань. Вони створені з урахуванням коду у вашому компоненті, тому ви часто отримуватиме [виведені типи (inferred types)](https://www.typescriptlang.org/docs/handbook/type-inference.html) і, в ідеалі, не матимете потреби розбиратися з дрібницями надання типів.

Розглянемо кілька прикладів того, як вказати типи для хуків.

### `useState` {/*typing-usestate*/}

[`Хук useState`](/reference/react/useState) перевикористовуватиме передане початкове значення стану для визначення типу цього значення. Наприклад:

```ts
// Виведення типу як "boolean"
const [enabled, setEnabled] = useState(false);
```

У цьому прикладі тип `boolean` буде заданий для змінної `enabled`, а `setEnabled` буде функцією, яка приймає або аргумент типу `boolean`, або функцію, що повертає `boolean`. Якщо ви хочете явно вказати тип для стану, передайте аргумент типу у виклику `useState`:

```ts 
// Явно задати тип "boolean"
const [enabled, setEnabled] = useState<boolean>(false);
```

Це не дуже корисно у попередньому випадку, але зазвичай ви захочете явно вказати тип, коли у вас є тип об'єднання. Наприклад, `status` тут може бути лише однією з кількох різних стрічкових змінних:

```ts
type Status = "idle" | "loading" | "success" | "error";

const [status, setStatus] = useState<Status>("idle");
```

Або, як рекомендується у [принципах структурування стану](/learn/choosing-the-state-structure#principles-for-structuring-state), ви можете згрупувати відповідний стан в об'єкт та описати різні варіанти через об'єктні типи:

```ts
type RequestState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success', data: any }
  | { status: 'error', error: Error };

const [requestState, setRequestState] = useState<RequestState>({ status: 'idle' });
```

### `useReducer` {/*typing-usereducer*/}

[Хук `useReducer`](/reference/react/useReducer) є більш складним, адже приймає функцію-редюсер та початковий стан. Типи для функції-редюсера виводяться з початкового стану. Щоб описати тип для стану, ви можете за бажанням передати аргумент типу у виклику `useReducer`, але натомість краще вказати тип для початкового стану:

<Sandpack>

```tsx src/App.tsx active
import {useReducer} from 'react';

interface State {
   count: number 
};

type CounterAction =
  | { type: "reset" }
  | { type: "setCount"; value: State["count"] }

const initialState: State = { count: 0 };

function stateReducer(state: State, action: CounterAction): State {
  switch (action.type) {
    case "reset":
      return initialState;
    case "setCount":
      return { ...state, count: action.value };
    default:
      throw new Error("Невідома дія");
  }
}

export default function App() {
  const [state, dispatch] = useReducer(stateReducer, initialState);

  const addFive = () => dispatch({ type: "setCount", value: state.count + 5 });
  const reset = () => dispatch({ type: "reset" });

  return (
    <div>
      <h1>Ласкаво прошу до мого лічильника</h1>

      <p>Сума: {state.count}</p>
      <button onClick={addFive}>Додати 5</button>
      <button onClick={reset}>Скинути</button>
    </div>
  );
}

```

```js src/App.js hidden
import AppTSX from "./App.tsx";
export default App = AppTSX;
```

</Sandpack>


Ми використовуємо TypeScript у кількох основних місцях:

 - `interface State` описує структуру стану редюсера.
 - `type CounterAction` описує різні дії, які можуть бути відправлені в редюсер.
 - `const initialState: State` задає тип для початкового стану, а також тип, який стандартно використовується у `useReducer`.
 - `stateReducer(state: State, action: CounterAction): State` задає типи для аргументів функції-редюсера та значення, яке вона повертає.

Більш явною альтернативою заданню типу для `initialState` є передача аргументу типу в `useReducer`:

```ts
import { stateReducer, State } from './your-reducer-implementation';

const initialState = { count: 0 };

export default function App() {
  const [state, dispatch] = useReducer<State>(stateReducer, initialState);
}
```

### `useContext` {/*typing-usecontext*/}

[Хук `useContext`](/reference/react/useContext) — це техніка передачі даних деревом компонентів без необхідності передавати пропси через компоненти. Цей хук використовується шляхом створення компоненту-провайдера та хука для отримання значення у дочірньому компоненті.

Тип значення, яке надається контекстом, виводиться зі значення, переданого до `createContext`:

<Sandpack>

```tsx src/App.tsx active
import { createContext, useContext, useState } from 'react';

type Theme = "light" | "dark" | "system";
const ThemeContext = createContext<Theme>("system");

const useGetTheme = () => useContext(ThemeContext);

export default function MyApp() {
  const [theme, setTheme] = useState<Theme>('light');

  return (
    <ThemeContext.Provider value={theme}>
      <MyComponent />
    </ThemeContext.Provider>
  )
}

function MyComponent() {
  const theme = useGetTheme();

  return (
    <div>
      <p>Поточна тема: {theme}</p>
    </div>
  )
}
```

```js src/App.js hidden
import AppTSX from "./App.tsx";
export default App = AppTSX;
```

</Sandpack>

Ця техніка спрацьовує, коли у вас є початкове значення з певним змістом, але іноді його немає, і тоді `null` може здатися прийнятним початковим значенням. Однак, щоб дозволити системі типізації розуміти ваш код, вам потрібно явно задати `ContextShape | null` для `createContext`.

Це спричиняє необхідність усунення `| null` з типу для споживачів контексту. Ми рекомендуємо, щоб хук здійснював перевірку під час виконання щодо існування значення та викидав помилку, якщо воно відсутнє:

```js {5, 16-20}
import { createContext, useContext, useState, useMemo } from 'react';

// Це простіший приклад, але ви можете уявити тут більш складний об'єкт.
type ComplexObject = {
  kind: string
};

// Контекст створюється з `| null` у типі, щоб точно відображати початкове значення.
const Context = createContext<ComplexObject | null>(null);

// `| null` буде видалено через перевірку у хуку.
const useGetComplexObject = () => {
  const object = useContext(Context);
  if (!object) { throw new Error("useGetComplexObject має використовуватись всередині компонента-провайдера") }
  return object;
}

export default function MyApp() {
  const object = useMemo(() => ({ kind: "complex" }), []);

  return (
    <Context.Provider value={object}>
      <MyComponent />
    </Context.Provider>
  )
}

function MyComponent() {
  const object = useGetComplexObject();

  return (
    <div>
      <p>Поточний об'єкт: {object.kind}</p>
    </div>
  )
}
```

### `useMemo` {/*typing-usememo*/}

Хуки [`useMemo`](/reference/react/useMemo) створять/повторно отримають доступ до збереженого значення після виклику функції і повторно викличуть функцію лише тоді, коли зміняться його залежності, що передані як другий параметр. Результат виклику хука виводиться зі значення, яке повертає функція у першому параметрі. Але також можна явно передати аргумент типу хуку.

```ts
// Тип змінної visibleTodos виведений зі значення, поверненого з функції filterTodos
const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
```


### `useCallback` {/*typing-usecallback*/}

[Хук `useCallback`](/reference/react/useCallback) надає однакове посилання на функцію, допоки залежності у другому параметрі залишаються тими ж. Як і в `useMemo`, тип функції виводиться зі значення, що повертається функцією у першому параметрі, і також можна явно передати аргумент типу хуку.


```ts
const handleClick = useCallback(() => {
  // ...
}, [todos]);
```

Під час роботи TypeScript у строгому режимі (strict mode) `useCallback` вимагає додавання типів для параметрів функції зворотного виклику. Це тому, що тип функції зворотного виклику виводиться зі значення, поверненого з функції, і без знання параметрів його не можливо точно визначити.

Залежно від уподобань щодо стилю коду ви можете використовувати функції `*EventHandler` з типами React, щоб надати тип обробнику подій одночасно з визначенням функції зворотного виклику:

```ts
import { useState, useCallback } from 'react';

export default function Form() {
  const [value, setValue] = useState("Зміни мене");

  const handleChange = useCallback<React.ChangeEventHandler<HTMLInputElement>>((event) => {
    setValue(event.currentTarget.value);
  }, [setValue])
  
  return (
    <>
      <input value={value} onChange={handleChange} />
      <p>Значення: {value}</p>
    </>
  );
}
```

## Корисні типи {/*useful-types*/}

У пакеті `@types/react` є досить значний набір типів, який варто переглянути, коли ви відчуєте себе впевнено у роботі із взаємодією React і TypeScript. Ви можете знайти їх [у каталозі React з репозиторію DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/react/index.d.ts). Тут ми розглянемо декілька найбільш поширених типів.

### Події DOM {/*typing-dom-events*/}

Працюючи з подіями DOM у React, часто можна вивести тип події з її обробника. Однак, коли ви хочете винести функцію, щоб передати її обробнику подій, вам потрібно явно вказати тип події.

<Sandpack>

```tsx src/App.tsx active
import { useState } from 'react';

export default function Form() {
  const [value, setValue] = useState("Зміни мене");

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setValue(event.currentTarget.value);
  }

  return (
    <>
      <input value={value} onChange={handleChange} />
      <p>Значення: {value}</p>
    </>
  );
}
```

```js src/App.js hidden
import AppTSX from "./App.tsx";
export default App = AppTSX;
```

</Sandpack>

У типах React є багато типів подій — [тут](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/b580df54c0819ec9df62b0835a315dd48b8594a9/types/react/index.d.ts#L1247C1-L1373) можна знайти повний список, який оснований на [найпопулярніших подіях у DOM](https://developer.mozilla.org/en-US/docs/Web/Events).

Щоб знайти потрібний тип, спочатку можна переглянути інформацію, яка з'являється під час наведення курсору на певний обробник і показує його тип події.

Якщо вам потрібна подія, яка не включена у цей список, ви можете використовувати тип `React.SyntheticEvent`, який є базовим для всіх подій.

### Проп children {/*typing-children*/}

Існують два поширені способи опису дочірніх елементів компонента. Перший — використання типу `React.ReactNode`, який є об'єднанням усіх можливих типів, що можуть передаватися всередину JSX-тегу:

```ts
interface ModalRendererProps {
  title: string;
  children: React.ReactNode;
}
```

Це дуже широке визначення дочірніх елементів. Другий спосіб — використання типу `React.ReactElement`, який охоплює лише JSX-елементи, а не JavaScript-примітиви, як-от стрічки або числа:

```ts
interface ModalRendererProps {
  title: string;
  children: React.ReactElement;
}
```

Важливо зазначити, що ви не можете використовувати TypeScript для опису того, що дочірні елементи є певним типом JSX-елементів, тому ви не можете використовувати систему типів для опису компонента, який приймає лише елементи `<li>`.

Ви можете побачити приклад із використанням `React.ReactNode` і `React.ReactElement` та перевіркою типів у [цій пісочниці TypeScript](https://www.typescriptlang.org/play?#code/JYWwDg9gTgLgBAJQKYEMDG8BmUIjgIilQ3wChSB6CxYmAOmXRgDkIATJOdNJMGAZzgwAFpxAR+8YADswAVwGkZMJFEzpOjDKw4AFHGEEBvUnDhphwADZsi0gFw0mDWjqQBuUgF9yaCNMlENzgAXjgACjADfkctFnYkfQhDAEpQgD44AB42YAA3dKMo5P46C2tbJGkvLIpcgt9-QLi3AEEwMFCItJDMrPTTbIQ3dKywdIB5aU4kKyQQKpha8drhhIGzLLWODbNs3b3s8YAxKBQAcwXpAThMaGWDvbH0gFloGbmrgQfBzYpd1YjQZbEYARkB6zMwO2SHSAAlZlYIBCdtCRkZpHIrFYahQYQD8UYYFA5EhcfjyGYqHAXnJAsIUHlOOUbHYhMIIHJzsI0Qk4P9SLUBuRqXEXEwAKKfRZcNA8PiCfxWACecAAUgBlAAacFm80W-CU11U6h4TgwUv11yShjgJjMLMqDnN9Dilq+nh8pD8AXgCHdMrCkWisVoAet0R6fXqhWKhjKllZVVxMcavpd4Zg7U6Qaj+2hmdG4zeRF10uu-Aeq0LBfLMEe-V+T2L7zLVu+FBWLdLeq+lc7DYFf39deFVOotMCACNOCh1dq219a+30uC8YWoZsRyuEdjkevR8uvoVMdjyTWt4WiSSydXD4NqZP4AymeZE072ZzuUeZQKheQgA).

### Пропси стилів {/*typing-style-props*/}

Для вбудованих стилів у React ви можете використовувати `React.CSSProperties` для опису об'єкта, який передається у проп `style`. Цей тип є об'єднанням усіх можливих властивостей CSS, тож можна переконатися, що ви передаєте правильні стилі, а також мати автозаповнення у вашому редакторі коду.

```ts
interface MyComponentProps {
  style: React.CSSProperties;
}
```

## Де дізнатись більше {/*further-learning*/}

Цей розділ охоплює основи використання TypeScript у React, але є багато іншого, що варто знати.
Окремі сторінки API в документації містять більш детальну інформацію про те, як їх використовувати у TypeScript.

Ми рекомендуємо такі ресурси:

 - [Посібник TypeScript](https://www.typescriptlang.org/docs/handbook/) є офіційною документацією для TypeScript і охоплює більшість ключових особливостей мови.

 - [Список змін TypeScript](https://devblogs.microsoft.com/typescript/) описує нові функції більш детально.

 - [Шпаргалка TypeScript для React](https://react-typescript-cheatsheet.netlify.app/) — це підтримувана спільнотою шпаргалка для використання TypeScript у React, що охоплює багато корисних прикладів та надає більше інформації, ніж цей документ.

 - [Спільнота TypeScript у Discord](https://discord.com/invite/typescript) — чудове місце, щоб задати питання та отримати допомогу у вирішенні проблем з TypeScript і React.
