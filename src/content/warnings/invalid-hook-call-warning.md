---
<<<<<<< HEAD:content/warnings/invalid-hook-call-warning.md
title: "Попередження: некоректний виклик хука"
layout: single
permalink: warnings/invalid-hook-call-warning.html
---

Швидше за все, ви перейшли на цю сторінку, тому що отримали наступне повідомлення про помилку:

> Hooks can only be called inside the body of a function component.
=======
title: Rules of Hooks
---

You are probably here because you got the following error message:

<ConsoleBlock level="error">

Hooks can only be called inside the body of a function component.

</ConsoleBlock>
>>>>>>> 67721a6f05be591570cfea7eb18da4b40d4dbab8:src/content/warnings/invalid-hook-call-warning.md

Існує три поширених причини, через які ви могли побачити це:

<<<<<<< HEAD:content/warnings/invalid-hook-call-warning.md
1. **Невідповідність версій** React і React DOM у вашому додатку.
2. Ви **порушили [правила хуків](/docs/hooks-rules.html)**
3. Ви маєте **більш ніж одну копію React** в одному додатку.
=======
1. You might be **breaking the Rules of Hooks**.
2. You might have **mismatching versions** of React and React DOM.
3. You might have **more than one copy of React** in the same app.
>>>>>>> 67721a6f05be591570cfea7eb18da4b40d4dbab8:src/content/warnings/invalid-hook-call-warning.md

Розглянемо кожний з цих випадків.

<<<<<<< HEAD:content/warnings/invalid-hook-call-warning.md
## Невідповідність версій React і React DOM {#mismatching-versions-of-react-and-react-dom}

Можливо ви використовуєте версії `react-dom` (< 16.8.0) або `react-native` (< 0.59), які ще не підтримують хуки. Виконайте у терміналі команду `npm ls react-dom` або `npm ls react-native` у директорії вашого додатку, щоб перевірити які версії встановлено. Якщо їх виявиться більше, ніж одна, це також може становити проблему (докладніше про це далі).

## Порушення правил використання хуків {#breaking-the-rules-of-hooks}

Ви можете викликати хуки лише тоді, **коли React відображує функціональний компонент**:

* ✅ Викликайте їх на верхньому рівні в тілі функціонального компонента.
* ✅ Викликайте їх на верхньому рівні в тілі [користувацького хука](/docs/hooks-custom.html).

**Дізнайтесь більше про це в [правилах хуків](/docs/hooks-rules.html).**
=======
## Breaking Rules of Hooks {/*breaking-rules-of-hooks*/}

Functions whose names start with `use` are called [*Hooks*](/reference/react) in React.

**Don’t call Hooks inside loops, conditions, or nested functions.** Instead, always use Hooks at the top level of your React function, before any early returns. You can only call Hooks while React is rendering a function component:

* ✅ Call them at the top level in the body of a [function component](/learn/your-first-component).
* ✅ Call them at the top level in the body of a [custom Hook](/learn/reusing-logic-with-custom-hooks).
>>>>>>> 67721a6f05be591570cfea7eb18da4b40d4dbab8:src/content/warnings/invalid-hook-call-warning.md

```js{2-3,8-9}
function Counter() {
  // ✅ Добре: на верхньому рівні функціонального компонента
  const [count, setCount] = useState(0);
  // ...
}

function useWindowWidth() {
  // ✅ Добре: на верхньому рівні користувацького хука
  const [width, setWidth] = useState(window.innerWidth);
  // ...
}
```

<<<<<<< HEAD:content/warnings/invalid-hook-call-warning.md
Щоб уникнути непорозуміння, використання хуку **не** підтримується у наступних випадках:

* 🔴 Не викликайте хуки у класових компонентах
* 🔴 Не викликайте хуки в обробниках подій
* 🔴 Не викликайте хуки всередині функцій, переданих до `useMemo`, `useReducer`, або `useEffect`.
=======
It’s **not** supported to call Hooks (functions starting with `use`) in any other cases, for example:

* 🔴 Do not call Hooks inside conditions or loops.
* 🔴 Do not call Hooks after a conditional `return` statement.
* 🔴 Do not call Hooks in event handlers.
* 🔴 Do not call Hooks in class components.
* 🔴 Do not call Hooks inside functions passed to `useMemo`, `useReducer`, or `useEffect`.
>>>>>>> 67721a6f05be591570cfea7eb18da4b40d4dbab8:src/content/warnings/invalid-hook-call-warning.md

Якщо ви порушуєте ці правила, то можна зіткнутися з цією помилкою.

```js{3-4,11-12,20-21}
function Bad({ cond }) {
  if (cond) {
    // 🔴 Bad: inside a condition (to fix, move it outside!)
    const theme = useContext(ThemeContext);
  }
  // ...
}

function Bad() {
  for (let i = 0; i < 10; i++) {
    // 🔴 Bad: inside a loop (to fix, move it outside!)
    const theme = useContext(ThemeContext);
  }
  // ...
}

function Bad({ cond }) {
  if (cond) {
    return;
  }
  // 🔴 Bad: after a conditional return (to fix, move it before the return!)
  const theme = useContext(ThemeContext);
  // ...
}

function Bad() {
  function handleClick() {
    // 🔴 Погано: всередині обробника події (щоб виправити, винесіть виклик назовні!)
    const theme = useContext(ThemeContext);
  }
  // ...
}

function Bad() {
  const style = useMemo(() => {
    // 🔴 Погано: всередині useMemo (щоб виправити, винесіть виклик назовні!)
    const theme = useContext(ThemeContext);
    return createStyle(theme);
  });
  // ...
}

class Bad extends React.Component {
  render() {
<<<<<<< HEAD:content/warnings/invalid-hook-call-warning.md
    // 🔴 Погано: всередині класового компонента
=======
    // 🔴 Bad: inside a class component (to fix, write a function component instead of a class!)
>>>>>>> 67721a6f05be591570cfea7eb18da4b40d4dbab8:src/content/warnings/invalid-hook-call-warning.md
    useEffect(() => {})
    // ...
  }
}
```

<<<<<<< HEAD:content/warnings/invalid-hook-call-warning.md
Ви можете використати [плагін `eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks) для того, щоб відловити деякі з цих помилок.

>Примітка
>
>[Користувацькі хуки](/docs/hooks-custom.html) *можуть* викликати інші хуки (у тому й полягає їх призначення). Це не викликає проблем, бо користувацькі хуки також мають викликатися лише тоді, коли відображується функціональний компонент.
=======
You can use the [`eslint-plugin-react-hooks` plugin](https://www.npmjs.com/package/eslint-plugin-react-hooks) to catch these mistakes.

<Note>
>>>>>>> 67721a6f05be591570cfea7eb18da4b40d4dbab8:src/content/warnings/invalid-hook-call-warning.md

[Custom Hooks](/learn/reusing-logic-with-custom-hooks) *may* call other Hooks (that's their whole purpose). This works because custom Hooks are also supposed to only be called while a function component is rendering.

<<<<<<< HEAD:content/warnings/invalid-hook-call-warning.md
## Дублювання React {#duplicate-react}
=======
</Note>

## Mismatching Versions of React and React DOM {/*mismatching-versions-of-react-and-react-dom*/}

You might be using a version of `react-dom` (< 16.8.0) or `react-native` (< 0.59) that doesn't yet support Hooks. You can run `npm ls react-dom` or `npm ls react-native` in your application folder to check which version you're using. If you find more than one of them, this might also create problems (more on that below).

## Duplicate React {/*duplicate-react*/}
>>>>>>> 67721a6f05be591570cfea7eb18da4b40d4dbab8:src/content/warnings/invalid-hook-call-warning.md

Для того, щоб хуки працювали, у вашому додатку потрібно імпортувати той самий модуль `react`, що імпортується всередині пакету `react-dom`.

Якщо під час імпорту `react` ви звертаєтесь до двох різних джерел, то побачите попередження. Це станеться, коли ви **випадково матимете дві копії** пакету `react`.

Якщо ви використовуєте Node для керування пакетами, то в корені вашого проекту можна запустити перевірку наступним чином:

<TerminalBlock>

npm ls react

</TerminalBlock>

У тому випадку, якщо побачите більше ніж один пакет React, вам потрібно з'ясувати, як це трапилось, та виправити це. Наприклад, бібліотека, яку ви використовуєте, неправильно визначила `react` як залежність (а не peer-залежність). До того часу, як це буде виправлено, [вирішення Yarn](https://yarnpkg.com/lang/en/docs/selective-version-resolutions/) може стати одним з можливих тимчасових рішень.

Також ви можете спробувати розібратися з цією проблемою, використовуючи режим налагодження й перезапустивши сервер розробки:

```js
// Додайте це до node_modules/react-dom/index.js
window.React1 = require('react');

// Додайте це до файлу з вашим компонентом
require('react-dom');
window.React2 = require('react');
console.log(window.React1 === window.React2);
```

Якщо у консолі ви побачите `false`, це означає, що ви використовуєте дві різні копії React. [Обговорення цього питання](https://github.com/facebook/react/issues/13991) може підказати вам деякі загальні причини, з якими вже зіткнулась спільнота, та рішення.

Ця проблема також може з'явитись, якщо ви використовуєте команду `npm link` чи щось подібне. У цьому разі бандлер може "побачити" два React - один у директорії додатку та другий у директорії вашої бібліотеки. Припускаючи, що папки `myapp` і `mylib` знаходяться на одному рівні, виконання команди `npm link ../myapp/node_modules/react` з `mylib` може розв'язати проблему. Це має змусити бібліотеку використовувати копію React з додатка.

<<<<<<< HEAD:content/warnings/invalid-hook-call-warning.md
>Примітка
>
>Взагалі, React підтримує можливість використання декількох незалежних копій на одній сторінці (наприклад, якщо їх використовують додаток і сторонній віджет). Проблемою це стає лише у тому випадку, коли в рамках однієї програми компонент імпортує одну копію React, а `react-dom` іншу.

## Інші причини {#other-causes}
=======
<Note>

In general, React supports using multiple independent copies on one page (for example, if an app and a third-party widget both use it). It only breaks if `require('react')` resolves differently between the component and the `react-dom` copy it was rendered with.

</Note>

## Other Causes {/*other-causes*/}
>>>>>>> 67721a6f05be591570cfea7eb18da4b40d4dbab8:src/content/warnings/invalid-hook-call-warning.md

Якщо жодне із запропонованих рішень не спрацювало, будь ласка, залиште коментар у цьому [обговоренні](https://github.com/facebook/react/issues/13991) та ми спробуємо допомогти. Також спробуйте зробити невеликий приклад, здатний відтворити проблему у тому вигляді, у якому ви з нею зіткнулись.
