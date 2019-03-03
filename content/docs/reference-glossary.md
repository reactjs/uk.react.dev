---
id: glossary
title: Словник термінів React
layout: docs
category: Reference
permalink: docs/glossary.html

---

## Односторінковий додаток {#single-page-application}

Односторінковий додаток — це додаток, що складається з єдиної HTML сторінки і всіх ресурсів (таких як JavaScript та CSS), які необхідні додатку для запуску. Будь-яка взаємодія з головною сторінкою та сторінками, що зв'язані з нею, не потребує контакту із сервером, а це означає, що сторінка не перезавантажується.

Хоч React і дозволяє вам створювати односторінкові додатки, ви зовсім не зобов'язані робити це. React також може використовуватись для вдосконалення маленьких частин існуючих вебсайтів для надання їм додаткової інтерактивності. Код написаний на React може мирно співіснувати з розміткою, що рендериться на сервері з допомогою, наприклад, PHP чи інших бібліотек для клієнтської сторони. По суті, саме так React івикористовується у Facebook.

## ES6, ES2015, ES2016, etc {#es6-es2015-es2016-etc}

Всі ці скорочення посилаються на найновіші версії стандарту специфікації мови ECMAScript, реалізацією котрого є мова JavaScript. Версія ES6 (також відома як ES2015) доповнює  попередні версії такими речами як: стрілкові функції, класи, шаблонні функції, вирази `let` і `const`. Більш детально про конкретні версії ви можете дізнатись [тут](https://en.wikipedia.org/wiki/ECMAScript#Versions).

## Компілятор {#compilers}

Компілятор JavaScript приймає на вхід код JavaScript, перетворює його і повертає код JavaScript в іншому форматі. Найбільш поширений випадок використання — це перетворення синтаксису ES6 у синтаксис, який підтримується старими версіями браузерів. При роботі з React найчастіше використовується компілятор [Babel](https://babeljs.io/).

## Бандлери {#bundlers}

Бандлери беруть JavaScript і CSS код написаний у вигляді модулів (часто таких модулів — сотні) і об'єднують їх разом у кілька файлів, які краще оптимізовані для браузерів. У React додатках найчастіше використовуються бандлери [Webpack](https://webpack.js.org/) і [Browserify](http://browserify.org/).

## Менеджери пакунків {#package-managers}

Менеджер пакунків - це інструмент, що дозволяє керувати залежностями у вашому проекті. [npm](https://www.npmjs.com/) та [Yarn](https://yarnpkg.com/) — це менеджери пакунків, котрі найчастіше використовуються в React-додатках. Обидва є клієнтами того ж самого реєстру пакунків — npm.

## CDN {#cdn}

CDN або "мережа доправлення контенту" (Content Delivery Network) — це мережева інфраструктура, що доправляє кешований статичний контент через мережу серверів по всьому світу. 

## JSX {#jsx}

JSX — це розширення синтаксису JavaScript. Він подібний до мови шаблонів, але наділений всіма можливостями JavaScript. JSX компілюється у виклики `React.createElement()`, котрі повертають прості об'єкти JavaScript, що називаються "React-елементи". [Перегляньте відповідний розділ](/docs/introducing-jsx.html) для ознайомлення з JSX чи знайдіть більш детальну інформацію [тут](/docs/jsx-in-depth.html).

React DOM використовує стиль camelCase для найменування властивостей замість звичайних імен HTML-атрибутів. Наприклад, `tabindex` в JSX перетворюється в `tabIndex`. Атрибут `class` записується як `className`, оскільки в JavaScript слово `class` є зарезервованим:

```js
const name = 'Василина';
ReactDOM.render(
  <h1 className="hello">Моє ім'я —п {name}!</h1>,
  document.getElementById('root')
);
```  

## [Елементи](/docs/rendering-elements.html) {#elements}

React-елементи — це будівельні блоки React-додатків. Їх  сплутати з більш загальновідомою концепцією "компонентів". Елемент описує те, що ви хочете бачити на екрані. React-елементи є незмінними.

```js
const element = <h1>Привіт, світе</h1>;
```

Зазвичай елементи не використовуються напряму, а повертаються з компонентів.

## [Компоненти](/docs/components-and-props.html) {#components}

React-компоненти — це маленькі, придатні для повторного використання частини коду, що повертають React-елемент для його відображення на сторінці. Найпростіший React-компонент — це звичайна функція JavaScript, що повертає React-елемент:

```js
function Welcome(props) {
  return <h1>Привіт, {props.name}</h1>;
}
```

Також, компоненти можуть бути класами ES6:

```js
class Welcome extends React.Component {
  render() {
    return <h1>Привіт, {this.props.name}</h1>;
  }
}
```

Компоненти можна розбити на окремі частини залежно від їх функціональності і використовувати всередині інших компонентів. Компоненти можуть повертати інші компоненти, масиви, рядки і числа. Якщо якась частина вашого інтерфейсу використовується у кількох місцях (Button, Panel, Avatar) чи надто складна сама по собі, завжди є сенс винести її в незалежний компонент. Імена компонентів завжди мають починатися з великої літери (`<Wrapper/>`, а **не** `<wrapper/>`). Пеегляньте [відповідний розділ](/docs/components-and-props.html#rendering-a-component) для більш детальної інформації про рендеринг компонентів. 

### [`props`](/docs/components-and-props.html) {#props}

`props` (пропси) — це вхідні дані React-компонента. Вони є даними, що передаються від батьківського компонента до дочірнього.

Запам'ятайте, що `props` призначені лише для читання. Не варто намагатися змінювати їх:

```js
// Неправильно!
props.number = 42;
```

Якщо вам потрібно змінити якесь значення у відповідь на ввід користувача чи відповідь сервера, використовуйте `state` (стан).

### `props.children` {#propschildren}

`props.children` доступні у будь-якому компоненті. У них записаний вміст між відкриваючим та закриваючим тегами компонента. Наприклад:

```js
<Welcome>Привіт, світе!</Welcome>
```

Рядок `Привіт, світе!`доступний у `props.children` у компоненті `Welcome`:

```js
function Welcome(props) {
  return <p>{props.children}</p>;
}
```

Для класових компонентів використовуйте `this.props.children`:

```js
class Welcome extends React.Component {
  render() {
    return <p>{this.props.children}</p>;
  }
}
```

### [`state`](/docs/state-and-lifecycle.html#adding-local-state-to-a-class) {#state}

Компонент потребує `state`, коли якісь дані в ньому змінюються з часом. Наприклад, компоненту `Checkbox` може знадобитися `isChecked` у його стані, а компонент `NewsFeed` має відслідковувати `fetchedPosts` у своєму стані.

Найбільша різниця між `state` і `props` полягає в тому, що `props` передаються з батьківського компонента, а `state` керується самим компонентом. Компонент не може змінювати власні `props`, але може змінювати `state`. Для цього він має викликати `this.setState()`. Тільки класові компоненти можуть мати власний стан.

Кожна окрема частина змінних даних має бути під керуванням єдиного компоненту, що має її в своєму стані. Не намагайтесь синхронізувати стани між двома різними компонентами. Замість цього [підійміть його](/docs/lifting-state-up.html) до найближчого батьківського компонента і передайте його через пропси до кожного дочірнього компоненту.

## [Lifecycle Methods](/docs/state-and-lifecycle.html#adding-lifecycle-methods-to-a-class) {#lifecycle-methods}

Lifecycle methods are custom functionality that gets executed during the different phases of a component. There are methods available when the component gets created and inserted into the DOM ([mounting](/docs/react-component.html#mounting)), when the component updates, and when the component gets unmounted or removed from the DOM.

 ## [Controlled](/docs/forms.html#controlled-components) vs. [Uncontrolled Components](/docs/uncontrolled-components.html)

React has two different approaches to dealing with form inputs. 

An input form element whose value is controlled by React is called a *controlled component*. When a user enters data into a controlled component a change event handler is triggered and your code decides whether the input is valid (by re-rendering with the updated value). If you do not re-render then the form element will remain unchanged.

An *uncontrolled component* works like form elements do outside of React. When a user inputs data into a form field (an input box, dropdown, etc) the updated information is reflected without React needing to do anything. However, this also means that you can't force the field to have a certain value.

In most cases you should use controlled components.

## [Keys](/docs/lists-and-keys.html) {#keys}

A "key" is a special string attribute you need to include when creating arrays of elements. Keys help React identify which items have changed, are added, or are removed. Keys should be given to the elements inside an array to give the elements a stable identity.

Keys only need to be unique among sibling elements in the same array. They don't need to be unique across the whole application or even a single component.

Don't pass something like `Math.random()` to keys. It is important that keys have a "stable identity" across re-renders so that React can determine when items are added, removed, or re-ordered. Ideally, keys should correspond to unique and stable identifiers coming from your data, such as `post.id`.

## [Refs](/docs/refs-and-the-dom.html) {#refs}

React supports a special attribute that you can attach to any component. The `ref` attribute can be an object created by [`React.createRef()` function](/docs/react-api.html#reactcreateref) or a callback function, or a string (in legacy API). When the `ref` attribute is a callback function, the function receives the underlying DOM element or class instance (depending on the type of element) as its argument. This allows you to have direct access to the DOM element or component instance.

Use refs sparingly. If you find yourself often using refs to "make things happen" in your app, consider getting more familiar with [top-down data flow](/docs/lifting-state-up.html).

## [Events](/docs/handling-events.html) {#events}

Handling events with React elements has some syntactic differences:

* React event handlers are named using camelCase, rather than lowercase.
* With JSX you pass a function as the event handler, rather than a string.

## [Reconciliation](/docs/reconciliation.html) {#reconciliation}

When a component's props or state change, React decides whether an actual DOM update is necessary by comparing the newly returned element with the previously rendered one. When they are not equal, React will update the DOM. This process is called "reconciliation".
