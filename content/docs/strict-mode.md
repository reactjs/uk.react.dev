---
id: strict-mode
title: Суворий режим
permalink: docs/strict-mode.html
---

`StrictMode` – це інструмент для виявлення потенційних проблем у додатку. Так само як і `Fragment`, `StrictMode` не рендерить видимого UI. Він активує додаткові перевірки та попередження для своїх нащадків.

> Примітка:
>
> Перевірки суворого режиму виконуються лише в режимі розробки; _вони не впливають на продакшн-збірку_.

Ви можете увімкнути суворий режим для будь-якої частини вашого додатку. Наприклад:
`embed:strict-mode/enabling-strict-mode.js`

У наведеному вище прикладі, перевірки суворого режиму *не* будуть виконуватись для компонентів `Header` та `Footer`. Проте компоненти `ComponentOne` та `ComponentTwo`, а також всі їхні нащадки матимуть перевірки.

<<<<<<< HEAD
`StrictMode` наразі допомагає в:
* [Ідентифікації компонентів з небезпечними методами життєвого циклу](#identifying-unsafe-lifecycles)
* [Попередженні про використання застарілого API рядкових рефів](#warning-about-legacy-string-ref-api-usage)
* [Попередженні про використання застарілого виклику findDOMNode](#warning-about-deprecated-finddomnode-usage)
* [Виявленні несподіваних побічних ефектів](#detecting-unexpected-side-effects)
* [Виявленні застарілого контекстного API](#detecting-legacy-context-api)
=======
`StrictMode` currently helps with:
* [Identifying components with unsafe lifecycles](#identifying-unsafe-lifecycles)
* [Warning about legacy string ref API usage](#warning-about-legacy-string-ref-api-usage)
* [Warning about deprecated findDOMNode usage](#warning-about-deprecated-finddomnode-usage)
* [Detecting unexpected side effects](#detecting-unexpected-side-effects)
* [Detecting legacy context API](#detecting-legacy-context-api)
* [Ensuring reusable state](#ensuring-reusable-state)
>>>>>>> 3aac8c59848046fb427aab4373a7aadd7069a24c

Додаткова функціональність буде додана в майбутніх релізах React.

### Ідентифікація небезпечних методів життєвого циклу {#identifying-unsafe-lifecycles}

[В цій статті](/blog/2018/03/27/update-on-async-rendering.html) пояснюється, чому деякі застарілі методи життєвого циклу є небезбечними для використання в асинхронних React-додатках. Проте може бути важко проконтролювати використання цих методів життєвого циклу, якщо ваш додаток використовує сторонні бібліотеки. На щастя, суворий режим може допомогти в цьому випадку!

Коли увімкнено суворий режим, то React створює список всіх класових компонентів, які використовують небезпечні методи життєвого циклу, та виводить попередження з інформацією про ці компоненти, наприклад:

![](../images/blog/strict-mode-unsafe-lifecycles-warning.png)

Вирішення проблем, знайдених суворим режимом, _сьогодні_ спростить для вас отримання вигоди від паралельного рендеру у майбутніх релізах React.

### Попередження про використання застарілого API рядкових рефів {#warning-about-legacy-string-ref-api-usage}

Раніше React надавав два способи управління рефами: застарілий API рядкових рефів та API функцій зворотнього виклику. Незважаючи на те, що API рядкових рефів був зручніший у використанні, він мав [декілька недоліків](https://github.com/facebook/react/issues/1373) і тому ми офіційно рекомендували [використовувати форму функції зворотнього виклику](/docs/refs-and-the-dom.html#legacy-api-string-refs).

React версії 16.3 вводить третій варіант, який пропонує зручність рядкових рефів але без їхніх недоліків:
`embed:16-3-release-blog-post/create-ref-example.js`

Оскільки об'єкти-рефи були додані значною мірою як заміна рядкових рефів, то суворий режим тепер попереджує про використання рядкових рефів.

> **Примітка:**
>
> Рефи-функції зворотнього виклику продовжують підтримуватись на додачу до нового API `createRef`.
>
> Вам не потрібно заміняти рефи-функції зворотнього виклику у ваших компонентах. Вони трохи більш гнучкі і тому залишаться як просунута можливість.

[Дізнатись більше про новий API `createRef` можна тут.](/docs/refs-and-the-dom.html)

### Попередження про використання застарілого виклику findDOMNode {#warning-about-deprecated-finddomnode-usage}

Колись React підтримував виклик `findDOMNode` для пошуку DOM-вузла в дереві по вказаному екзепляру класа. Зазвичай вам це не потрібно, тому що ви можете [прикріпити реф безпосередньо до DOM-вузла](/docs/refs-and-the-dom.html#creating-refs).

<<<<<<< HEAD
`findDOMNode` також може бути застосований до класових компонентів, але це порушувало рівні абстракції, дозволяючи батьківському компоненту вимагати, щоб відбувся рендер певного дочірнього елементу. Це створює небезпеку рефакторингу, коли ви не можете змінити деталі реалізації компонента, тому що батьківський компонент може використовувати його DOM-вузол. `findDOMNode` повертає лише перший дочірній елемент, але з використанням фрагментів компонент може рендерити декілька DOM-вузлів. `findDOMNode` — це API одноразового читання, він повертає вам результат лише на момент, коли ви його викликаєте. Якщо дочірній компонент відрендерить інший вузол, то немає жодної можливості опрацювати цю зміну. Внаслідок цього `findDOMNode` працював лише якщо компоненти завжди повертали єдиний DOM-вузол, що ніколи не змінювався.
=======
`findDOMNode` can also be used on class components but this was breaking abstraction levels by allowing a parent to demand that certain children were rendered. It creates a refactoring hazard where you can't change the implementation details of a component because a parent might be reaching into its DOM node. `findDOMNode` only returns the first child, but with the use of Fragments, it is possible for a component to render multiple DOM nodes. `findDOMNode` is a one time read API. It only gave you an answer when you asked for it. If a child component renders a different node, there is no way to handle this change. Therefore `findDOMNode` only worked if components always return a single DOM node that never changes.
>>>>>>> 3aac8c59848046fb427aab4373a7aadd7069a24c

Замість цього ви можете зробити це явно, передавши реф у ваш компонент та далі в DOM з використанням [перенаправлення рефів](/docs/forwarding-refs.html#forwarding-refs-to-dom-components).

Ви також можете додати DOM-вузол обгортку у ваш компонент і прикріпити реф прямо до нього.

```javascript{4,7}
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.wrapper = React.createRef();
  }
  render() {
    return <div ref={this.wrapper}>{this.props.children}</div>;
  }
}
```

> Примітка:
>
> Можна використати CSS-атрибут [`display: contents`](https://developer.mozilla.org/en-US/docs/Web/CSS/display#display_contents), якщо ви не хочете, щоб вузол був частиною розмітки.

### Виявлення несподіваних побічних ефектів {#detecting-unexpected-side-effects}

По суті, React виконує роботу в два етапи:
* Стадія **рендеру** визначає, які саме зміни потрібно зробити, наприклад в DOM. На цій стадії React викликає метод `render` і потім порівнює результат з попереднім рендером.
* Стадія **фіксації** — це коли React застосовує будь-які зміни. У випадку React DOM — це стадія, коли React вставляє, оновлює та видаляє вузли DOM. На цій стадії React також викликає методи життєвого циклу, такі як `componentDidMount` та `componentDidUpdate`.

Стадія фіксації зазвичай дуже швидка, але рендер може бути повільним. З цієї причини майбутній паралельний режим (який поки ще не увімкнений за замовчуванням) розбиває обсяг роботи рендеру на частини, призупиняючись і продовжуючи роботу, щоб запобігти блокуванню браузера. Це означає, що React перед фіксацією може викликати методи життєвого циклу стадії рендеру більше ніж один раз, або викликати їх та взагалі не зафіксувати зміни (через помилку або переривання вищого пріоритету).

Методи життєвого циклу стадії рендеру включають наступні методи класового компоненту:
* `constructor`
* `componentWillMount` (or `UNSAFE_componentWillMount`)
* `componentWillReceiveProps` (or `UNSAFE_componentWillReceiveProps`)
* `componentWillUpdate` (or `UNSAFE_componentWillUpdate`)
* `getDerivedStateFromProps`
* `shouldComponentUpdate`
* `render`
* Функції-оновлювачі стану компонента, що передаються першим аргументом в `setState`

Оскільки наведені вище методи можуть бути викликані більше ніж один раз, то важливо, щоб вони не містили побічних ефектів. Ігнорування цього правила може привести до ряду проблем, включаючи витік пам'яті або недійсний стан додатку. На жаль, виявити ці проблеми може бути важко, оскільки вони часто бувають [недетермінованими](https://uk.wikipedia.org/wiki/Детермінований_алгоритм).

Суворий режим не може автоматично виявити побічні ефекти за вас, але він може допомогти їх помітити, роблячи їх більш детермінованими. Це досягається завдяки навмисному викликлу наступних функцій двічі:

* Методи `constructor`, `render`, and `shouldComponentUpdate` класового компонента
* Статичний метод класового компонента `getDerivedStateFromProps`
* Тіло функціонального компонента
* Функції-оновлювачі стана компонента, що передаються першим аргументом у `setState`
* Функції, передані в `useState`, `useMemo`, or `useReducer`

> Примітка:
>
> Це застосовується лиже в режимі розробки. _Методи життєвого циклу ніколи не будуть викликані двічі в продакшн-режимі._

Для прикладу, розглянемо наступний код:
`embed:strict-mode/side-effects-in-constructor.js`

На перший погляд він не здається проблематичним. Але якщо метод `SharedApplicationState.recordEvent` не [ідемпотентний](https://uk.wikipedia.org/wiki/Ідемпотентність), то створення багатьох екземплярів цього компонента може призвести до недійсного стану додатку. Такий тип витончених помилок може не проявляти себе під час розробки або робити це непослідовно і тому може залишитися не поміченим.

Суворий режим робить подібні патерни більш помітними, навмисно двічі викликаючи методи, такі як конструктор компонента.

<<<<<<< HEAD
### Виявлення застарілого контекстного API {#detecting-legacy-context-api}
=======
> Note:
>
> In React 17, React automatically modifies the console methods like `console.log()` to silence the logs in the second call to lifecycle functions. However, it may cause undesired behavior in certain cases where [a workaround can be used](https://github.com/facebook/react/issues/20090#issuecomment-715927125).
>
> Starting from React 18, React does not suppress any logs. However, if you have React DevTools installed, the logs from the second call will appear slightly dimmed. React DevTools also offers a setting (off by default) to suppress them completely.

### Detecting legacy context API {#detecting-legacy-context-api}
>>>>>>> 3aac8c59848046fb427aab4373a7aadd7069a24c

Використання застарілого контекстного API часто призводило до помилок, тому він буде видалений в майбутній мажорній версії React. Він все ще працює в усіх релізах версії 16.x, але показуватиме це попередження у суворому режимі:

![](../images/blog/warn-legacy-context-in-strict-mode.png)

<<<<<<< HEAD
Ознайомтесь з [документацією нового контекстного API](/docs/context.html) для спрощення переходу на нову версію.
=======
Read the [new context API documentation](/docs/context.html) to help migrate to the new version.


### Ensuring reusable state {#ensuring-reusable-state}

In the future, we’d like to add a feature that allows React to add and remove sections of the UI while preserving state. For example, when a user tabs away from a screen and back, React should be able to immediately show the previous screen. To do this, React support remounting trees using the same component state used before unmounting.

This feature will give React better performance out-of-the-box, but requires components to be resilient to effects being mounted and destroyed multiple times. Most effects will work without any changes, but some effects do not properly clean up subscriptions in the destroy callback, or implicitly assume they are only mounted or destroyed once.

To help surface these issues, React 18 introduces a new development-only check to Strict Mode. This new check will automatically unmount and remount every component, whenever a component mounts for the first time, restoring the previous state on the second mount.

To demonstrate the development behavior you'll see in Strict Mode with this feature, consider what happens when React mounts a new component. Without this change, when a component mounts, React creates the effects:

```
* React mounts the component.
  * Layout effects are created.
  * Effects are created.
```

With Strict Mode starting in React 18, whenever a component mounts in development, React will simulate immediately unmounting and remounting the component:

```
* React mounts the component.
    * Layout effects are created.
    * Effect effects are created.
* React simulates effects being destroyed on a mounted component.
    * Layout effects are destroyed.
    * Effects are destroyed.
* React simulates effects being re-created on a mounted component.
    * Layout effects are created
    * Effect setup code runs
```

On the second mount, React will restore the state from the first mount. This feature simulates user behavior such as a user tabbing away from a screen and back, ensuring that code will properly handle state restoration.

When the component unmounts, effects are destroyed as normal:

```
* React unmounts the component.
  * Layout effects are destroyed.
  * Effect effects are destroyed.
```

Unmounting and remounting includes:

- `componentDidMount`
- `componentWillUnmount`
- `useEffect`
- `useLayoutEffect`
- `useInsertionEffect`

> Note:
>
> This only applies to development mode, _production behavior is unchanged_.

For help supporting common issues, see:
  - [How to support Reusable State in Effects](https://github.com/reactwg/react-18/discussions/18)
>>>>>>> 3aac8c59848046fb427aab4373a7aadd7069a24c
