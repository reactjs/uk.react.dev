---
id: tutorial
title: "Введення: Вступ до React"
layout: tutorial
sectionid: tutorial
permalink: tutorial/tutorial.html
redirect_from:
  - "docs/tutorial.html"
  - "docs/why-react.html"
  - "docs/tutorial-ja-JP.html"
  - "docs/tutorial-ko-KR.html"
  - "docs/tutorial-zh-CN.html"
---

Дане введення не потребує попереднього ознайомлення з React.

## Перед початком роботи {#before-we-start-the-tutorial}

У цьому введенні ми працюватимемо над створенням маленької гри. **Вам це може здатися непотрібним, оскільки ви не плануєте створювати ігри, але ми рекомендуємо спробувати.** Методи, які ви вивчите у даному введенні є основоположними для створення будь-яких React-додатків, і освоєння цих методів допоможе вам глибше зрозуміти React.

>Порада
>
> Дане введення призначене для людей, які надають перевагу **практичному навчанню**. Якщо вам більше подобається вчитися з нуля, зверніться до нашого [покрокового довідника](/docs/hello-world.html). Ви можете виявити для себе, що обидва чудово доповнюють одне одного.

Вступ розбито на декілька розділів:

* [Налаштування](#setup-for-the-tutorial) допоможе встановити **відправну точку** для роботи над грою.
* [Огляд](#overview) ознайомить вас з **основами** React: компоненти, пропси, стан.
* [Створення гри](#completing-the-game) ознайомить вас з **найпоширенішими методами** у розробці React-додатків.
* [Додання подорожі у часі](#adding-time-travel) допоможе **глибше осягнути** сильні сторони React.

Ви не мусите опрацьовувати усі розділи відразу, щоб отримати користь від введення. Продовжуйте працювати стільки, скільки вважаєте за потрібне, навіть якщо це один чи два розділи.

### Що ми створюємо? {#what-are-we-building}

У даному введенні ми розглянемо як створити інтерактивну гру в хрестики-нулики за допомогою React.

Кінцевий результат ви можете розглянути за наступним посиланням: **[Завершена гра ](https://codepen.io/gaearon/pen/gWWZgR?editors=0010)**. Не хвилюйтесь, якщо код здається вам незрозумілим, або ви не знайомі з синтаксисом! Мета даного введення -- допомогти вам зрозуміти React і його синтаксис.

Ми радимо розглянути гру перед тим, як продовжити працювати над введенням. Одна з її помітних властивостей -- пронумеровани список з правої сторони ігрового поля. Цей список відображає історію всіх ходів і оновлюється по ходу гри.

Ви можете закрити гру в хрестики-нулики, коли закінчите ознайомлення з нею. Ми почнемо з простішого зразка. Наш натсупний крок -- підготуватись до створення гри.

### Передумови {#prerequisites}

Ми припускаємо, що ви вже трохи знайомі з HTML і JavaScript. Але навіть якщо в повсякденному житті ви використовуєте іншу мову програмування, проходження даного введення не має скласти труднощів. Ми також припустимо, що ви знайомі з  функціями, об'єктами, масивами і, меншою мірою, класами.

Якщо вам потрібно повторити основи JavaScript, ми рекомендуємо проглянути [цей довідник](https://developer.mozilla.org/uk/docs/Web/JavaScript/A_re-introduction_to_JavaScript). Зверніть увагу, що ми також використовуємо деякі особливості ES6 -- нещодавньої версії JavaScript. У введенні ми використовуємо [стрілкові функції](https://developer.mozilla.org/uk/docs/Web/JavaScript/Reference/Functions/%D0%A1%D1%82%D1%80%D1%96%D0%BB%D0%BA%D0%BE%D0%B2%D1%96_%D1%84%D1%83%D0%BD%D0%BA%D1%86%D1%96%D1%97), [класи](https://developer.mozilla.org/uk/docs/Web/JavaScript/Reference/Classes), [`let`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let), та [`const`](https://developer.mozilla.org/uk/docs/Web/JavaScript/Reference/Statements/const). Ви можете скористатися [Babel REPL](babel://es5-syntax-example), щоб дізнатися у що компілюється код ES6.

## Налаштування {#setup-for-the-tutorial}

Існує два способи проходження даного введення: ви можете писати код у браузері, або налаштувати локальне середовище розробки на комп'ютері.

### Варіант налаштування 1: Пишемо код у браузері {#setup-option-1-write-code-in-the-browser}

Це найшвидший спосіб для початку!

Спершу, відкрийте **[початковий код](https://codepen.io/gaearon/pen/oWWQNa?editors=0010)** у новій вкладці. Ви побачите пусте поле для гри в хрестики-нулики і React-код. У даному розділі ми поступово змінюватимемо цей код.

Ви можете пропустити другий варіант налаштування і перейти до [Огляду](#overview) React.

### Варіант налаштування 2: Локальне середовище розробки {#setup-option-2-local-development-environment}

Цей крок не є обов'язковим і не потрібний для проходження введення!

<br>

<details>

<summary><b>Необов'язково: інструкції для написання коду в улюбленому текстовому редакторі</b></summary>

Дане налаштування вимагає трохи більше роботи, але дозволяє працювати над введенням у власному редакторі. Ось що вам потрібно зробити:

1. Упевніться, що на вашому комп'ютері встановлено останню версію [Node.js](https://nodejs.org/en/).
2. Слідуйте [інструкціям налаштування Create React App](/docs/create-a-new-react-app.html#create-react-app) для створення нового проекту.

```bash
npx create-react-app my-app
```

3. Видаліть усі файли з папки `src/` нового проекту. 

> Примітка:
>
>**Не видаляйте саму папку `src`, тільки вихідні файли що містяться в ній.** Ми замінимо ці файли власними прикладами у наступному кроці.

```bash
cd my-app
cd src

# Якщо ви використовуєте Mac або Linux:
rm -f *

# Або, якщо використовуєте Windows:
del *

# Після цього, поверніться до папки проекту
cd ..
```

4. Створіть файл `index.css` у папці `src/` з [цим CSS кодом](https://codepen.io/gaearon/pen/oWWQNa?editors=0100).

5. Створіть файл `index.js` у папці `src/` з [цим JS кодом](https://codepen.io/gaearon/pen/oWWQNa?editors=0010).

6. Впишіть наступні три рядки на початку `index.js` у папці `src/`:

```js
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
```

Тепер, якщо ви запустите `npm start` у папці проекту і відкриєте `http://localhost:3000` у браузері, перед вами має відкритися пусте поле для гри в хрестики-нулики.

Ми рекомендуємо слідувати [цим інструкціям](https://babeljs.io/docs/editors/), щоб налаштувати підсвічування синтаксису у вашому редакторі.

</details>

### Допоможіть, я застряг! {#help-im-stuck}

Якщо ви застрягли, зверніться до [ресурсів підтримки спільноти](/community/support.html).
 Зокрема, [чат Reactiflux](https://discord.gg/0ZcbPKXt5bZjGY5n) -- чудовий спосіб швидко знайти допомогу. Якщо ви не отримаєте належну відповідь, будь ласка, напишіть нам, і ми вам допоможемо.

## Огляд {#overview}

Тепер, коли з усіма налаштуваннями завершено, давайте уважніше розглянемо React!

### Що таке React? {#what-is-react}

React -- це декларативна, ефективна і гнучка JavaScript бібліотека, призначена для створення інтерфейсу користувача. Вона дозволяє компонувати складн UI з маленьких окремих частин коду -- "компонентів".

У React існує кільки різних компонентів, але ми почнемо з підкласів `React.Component`:

```javascript
class ShoppingList extends React.Component {
  render() {
    return (
      <div className="shopping-list">
        <h1>Список покупок для {this.props.name}</h1>
        <ul>
          <li>Instagram</li>
          <li>WhatsApp</li>
          <li>Oculus</li>
        </ul>
      </div>
    );
  }
}

// Приклад використання: <ShoppingList name="Андрій" />
```

Ми ще повернемося до незвичних, схожих на XML тегів. Ми використовуємо компоненти, щоб повідомити React, що саме хочемо бачити на екрані. Кожного разу, при зміні даних, React ефективно оновлює і повторно рендерить наші компоненти.

Так, ShoppingList вище -- це **класовий компонент React**. Компонент приймає параметри, які називаються `props` (скорочено від "properties"), і повертає ієрархію вигляду через метод `render`.

Метод `render` повертає *опис* того, що ви хочете побачити на екрані. React приймає цей опис і відтворює результат. Зокрема, `render` повертає **елемент React**, що є легким описом того, що треба відрендерити. Більшість React-розробників використовує спеціальний "JSX" синтаксис, який спрощує написання даних структур. Під час компіляції синтаксис `<div />` перетворюється у `React.createElement('div')`. Тож приклад вище рівноцінний до:

```javascript
return React.createElement('div', {className: 'shopping-list'},
  React.createElement('h1', /* ... h1 children ... */),
  React.createElement('ul', /* ... ul children ... */)
);
```

[Дивитись повну версію.](babel://tutorial-expanded-version)

Якщо вам цікаво, детальніше про `createElement()` ви можете дізнатися в  [довіднику API](/docs/react-api.html#createelement). Ми не використовуватимемо даний синтаксис у цьому введенні, натомість ми продовжимо використання JSX.

JSX має повну силу JavaScript. У межах фігурних дужок JSX ви можете використовувати *будь-які* JavaScript-вирази. Кожен елемент React є об'єктом, який можна зберегти у змінній або використати будь-де у вашій програмі.

Компонент `ShoppingList` вище рендерить тільки вбудовані DOM-компоненти як `<div />` або `<li />`. Але ви також можете створювати і рендерити власні компоненти. Наприклад, тепер ми можемо послатися на весь список покупок відразу використовуючи `<ShoppingList />`. Кожен компонент React інкапсульований і може використовуватись незалежно від інших; це дозволяє створювати складні UI з простих компонентів.

## Розглянемо стартовий код {#inspecting-the-starter-code}

Якщо ви збираєтесь працювати над введенням **у браузері**, відкрийте **[цей стартовий код](https://codepen.io/gaearon/pen/oWWQNa?editors=0010)** у новій вкладці. Якщо ви працюватимете над введенням **на власному комп'ютері**, відкрийте `src/index.js` у папці проекту (ви вже працювали з цим файлом під час [налаштувань](#setup-option-2-local-development-environment)).

Цей стартовий код оснований на тому, що ми будуватимемо. Ми подбали про CSS-стиль, тож ви можете повністю сконцентруватися на вивченні React і створенні гри у хрестики-нулики.

Розглядаючи код, ви помітите що ми вже маємо три компоненти:

* Square (Квадрат)
* Board (Поле)
* Game (Гра)

Компонент Square рендерить окремий `<button>`-елемент, компонент Board рендерить 9 таких квадратів. Компонент Game рендерить ігрове поле з заповнювачами, які ми змінимо пізніше. Наразі, ми не маємо жодного інтерактивного компонента.

### Передаємо данні через пропси {#passing-data-through-props}

Для початку, давайте спробуємо передати деякі данні з компоненту Board у компонент Square.

Ми наполегливо рекомендуємо набирати код вручну під час роботи з введенням, а не копіювати і вставляти його. Це допоможе розвити м'язову пам'ять і досягти кращого розуміння.

У методі `renderSquare` компонента Board змініть код, щоб передати проп `value` компоненту Square:

```js{3}
class Board extends React.Component {
  renderSquare(i) {
    return <Square value={i} />;
  }
```

Щоб відобразити значення, змінимо `render` метод компонента Square замінивши {/* TODO */}` на `{this.props.value}`:

```js{5}
class Square extends React.Component {
  render() {
    return (
      <button className="square">
        {this.props.value}
      </button>
    );
  }
}
```

До:

![React Devtools](../images/tutorial/tictac-empty.png)

Після: ви маєте побачити число в середині кожного відрендереного квадрата.

![React Devtools](../images/tutorial/tictac-numbers.png)

**[Проглянути повний код цього кроку](https://codepen.io/gaearon/pen/aWWQOG?editors=0010)**

Вітаємо! Ви щойно "передали проп" від батьківського компонента Board до дочірнього компонента Square. Передача даних через пропси від батьківського компонента до дочірнього -- це те як данні перетікають у React додатках.

### Створюємо інтерактивний компонент {#making-an-interactive-component}

Давайте при натисканні спробуємо заповнити компонент Square хрестиками. Спочатку замінимо тег кнопки, який повертається з методу `render()` на наступний код:

```javascript{4}
class Square extends React.Component {
  render() {
    return (
      <button className="square" onClick={function() { alert('click'); }}>
        {this.props.value}
      </button>
    );
  }
}
```

Тепер, при натисканні на Square, ви побачите повідомлення у браузері.

>Примітка
>
>Щоб уникнути зайвого другу і [заплутаної поведінки `this`](https://yehudakatz.com/2011/08/11/understanding-javascript-function-invocation-and-this/), тут і далі ми використовуватимемо [синтаксис стрілкової фінкції](https://developer.mozilla.org/uk/docs/Web/JavaScript/Reference/Functions/%D0%A1%D1%82%D1%80%D1%96%D0%BB%D0%BA%D0%BE%D0%B2%D1%96_%D1%84%D1%83%D0%BD%D0%BA%D1%86%D1%96%D1%97) для обробників події:
>
>```javascript{4}
>class Square extends React.Component {
>  render() {
>    return (
>      <button className="square" onClick={() => alert('клік')}>
>        {this.props.value}
>      </button>
>    );
>  }
>}
>```
>
>Зверніть увагу як використовуючи `onClick={() => alert('click')}`, ми передаємо  *функцію* як проп onClick`. React викличе цю функцію тільки після натискання. Типовою помилкою є пропуск `() =>` використання синтаксису `onClick={alert('click')}`, оскільки такий код буде спрацьовувати при кожному рендері компонента.

Наступним кроком, ми хочемо щоб компонент Square "запам'ятав", що на нього клікнули і відобразив позначку "X". Для "запам'ятовування" компоненти використовують **стан**.

Щоб налаштувати стан у компоненті React, вам потрібно вписати `this.state` у його конструктор. `this.state` варто розглядати як особисту властивість компонента, у якому його визначено. Давайте збережемо поточне значення у `this.state` компонента Square, і змінюватимемо його при кожному натисканні.

Спершу, додамо конструктор до класу, щоб ініціалізувати стан:

```javascript{2-7}
class Square extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: null,
    };
  }

  render() {
    return (
      <button className="square" onClick={() => alert('клік')}>
        {this.props.value}
      </button>
    );
  }
}
```

>Примітка
>
>У [класах JavaScript](https://developer.mozilla.org/uk/docs/Web/JavaScript/Reference/Classes) при визначенні конструктора підкласу ви завжди повинні викликати `super`. Класові компоненти React, що мають `constructor`, повинні починатися з виклику `super(props)`.

Тепер змінимо метод `render` компонента Square, щоб відобразити значення поточного стану під час натискання:

* Замініть `this.props.value` на `this.state.value` усередині тегу `<button>`.
* Замініть обробник події `onClick={...}` на `onClick={() => this.setState({value: 'X'})}`.
* Для кращої читабельності розташуйте пропси `className` та `onClick` на окремих рядках.

Після цих змін, тег `<button>`, повернений з метода `render` компонента Square має виглядати наступним чином:

```javascript{12-13,15}
class Square extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: null,
    };
  }

  render() {
    return (
      <button
        className="square"
        onClick={() => this.setState({value: 'X'})}
      >
        {this.state.value}
      </button>
    );
  }
}
```

Викликаючи  `this.setState` з обробника `onClick` handler in the Square's `render` method, we tell React to re-render that Square whenever its `<button>` is clicked. After the update, the Square's `this.state.value` will be `'X'`, so we'll see the `X` on the game board. If you click on any Square, an `X` should show up.

When you call `setState` in a component, React automatically updates the child components inside of it too.

**[View the full code at this point](https://codepen.io/gaearon/pen/VbbVLg?editors=0010)**

### Developer Tools {#developer-tools}

The React Devtools extension for [Chrome](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en) and [Firefox](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/) lets you inspect a React component tree with your browser's developer tools.

<img src="../images/tutorial/devtools.png" alt="React Devtools" style="max-width: 100%">

The React DevTools let you check the props and the state of your React components.

After installing React DevTools, you can right-click on any element on the page, click "Inspect" to open the developer tools, and the React tab will appear as the last tab to the right.

**However, note there are a few extra steps to get it working with CodePen:**

1. Log in or register and confirm your email (required to prevent spam).
2. Click the "Fork" button.
3. Click "Change View" and then choose "Debug mode".
4. In the new tab that opens, the devtools should now have a React tab.

## Completing the Game {#completing-the-game}

We now have the basic building blocks for our tic-tac-toe game. To have a complete game, we now need to alternate placing "X"s and "O"s on the board, and we need a way to determine a winner.

### Lifting State Up {#lifting-state-up}

Currently, each Square component maintains the game's state. To check for a winner, we'll maintain the value of each of the 9 squares in one location.

We may think that Board should just ask each Square for the Square's state. Although this approach is possible in React, we discourage it because the code becomes difficult to understand, susceptible to bugs, and hard to refactor. Instead, the best approach is to store the game's state in the parent Board component instead of in each Square. The Board component can tell each Square what to display by passing a prop, [just like we did when we passed a number to each Square](#passing-data-through-props).

**To collect data from multiple children, or to have two child components communicate with each other, you need to declare the shared state in their parent component instead. The parent component can pass the state back down to the children by using props; this keeps the child components in sync with each other and with the parent component.**

Lifting state into a parent component is common when React components are refactored -- let's take this opportunity to try it out.

Add a constructor to the Board and set the Board's initial state to contain an array of 9 nulls corresponding to the 9 squares:

```javascript{2-7}
class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: Array(9).fill(null),
    };
  }

  renderSquare(i) {
    return <Square value={i} />;
  }
```

When we fill the board in later, the `this.state.squares` array will look something like this:

```javascript
[
  'O', null, 'X',
  'X', 'X', 'O',
  'O', null, null,
]
```

The Board's `renderSquare` method currently looks like this:

```javascript
  renderSquare(i) {
    return <Square value={i} />;
  }
```

In the beginning, we [passed the `value` prop down](#passing-data-through-props) from the Board to show numbers from 0 to 8 in every Square. In a different previous step, we replaced the numbers with an "X" mark [determined by Square's own state](#making-an-interactive-component). This is why Square currently ignores the `value` prop passed to it by the Board.

We will now use the prop passing mechanism again. We will modify the Board to instruct each individual Square about its current value (`'X'`, `'O'`, or `null`). We have already defined the `squares` array in the Board's constructor, and we will modify the Board's `renderSquare` method to read from it:

```javascript{2}
  renderSquare(i) {
    return <Square value={this.state.squares[i]} />;
  }
```

**[View the full code at this point](https://codepen.io/gaearon/pen/gWWQPY?editors=0010)**

Each Square will now receive a `value` prop that will either be `'X'`, `'O'`, or `null` for empty squares.

Next, we need to change what happens when a Square is clicked. The Board component now maintains which squares are filled. We need to create a way for the Square to update the Board's state. Since state is considered to be private to a component that defines it, we cannot update the Board's state directly from Square.

Instead, we'll pass down a function from the Board to the Square, and we'll have Square call that function when a square is clicked. We'll change the `renderSquare` method in Board to:

```javascript{5}
  renderSquare(i) {
    return (
      <Square
        value={this.state.squares[i]}
        onClick={() => this.handleClick(i)}
      />
    );
  }
```

>Note
>
>We split the returned element into multiple lines for readability, and added parentheses so that JavaScript doesn't insert a semicolon after `return` and break our code.

Now we're passing down two props from Board to Square: `value` and `onClick`. The `onClick` prop is a function that Square can call when clicked. We'll make the following changes to Square:

* Replace `this.state.value` with `this.props.value` in Square's `render` method
* Replace `this.setState()` with `this.props.onClick()` in Square's `render` method
* Delete the `constructor` from Square because Square no longer keeps track of the game's state

After these changes, the Square component looks like this:

```javascript{1,2,6,8}
class Square extends React.Component {
  render() {
    return (
      <button
        className="square"
        onClick={() => this.props.onClick()}
      >
        {this.props.value}
      </button>
    );
  }
}
```

When a Square is clicked, the `onClick` function provided by the Board is called. Here's a review of how this is achieved:

1. The `onClick` prop on the built-in DOM `<button>` component tells React to set up a click event listener.
2. When the button is clicked, React will call the `onClick` event handler that is defined in Square's `render()` method.
3. This event handler calls `this.props.onClick()`. The Square's `onClick` prop was specified by the Board.
4. Since the Board passed `onClick={() => this.handleClick(i)}` to Square, the Square calls `this.handleClick(i)` when clicked.
5. We have not defined the `handleClick()` method yet, so our code crashes. If you click a square now, you should see a red error screen saying something like "this.handleClick is not a function".

>Note
>
>The DOM `<button>` element's `onClick` attribute has a special meaning to React because it is a built-in component. For custom components like Square, the naming is up to you. We could give any name to the Square's `onClick` prop or Board's `handleClick` method, and the code would work the same. In React, it's conventional to use `on[Event]` names for props which represent events and `handle[Event]` for the methods which handle the events.

When we try to click a Square, we should get an error because we haven't defined `handleClick` yet. We'll now add `handleClick` to the Board class:

```javascript{9-13}
class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: Array(9).fill(null),
    };
  }

  handleClick(i) {
    const squares = this.state.squares.slice();
    squares[i] = 'X';
    this.setState({squares: squares});
  }

  renderSquare(i) {
    return (
      <Square
        value={this.state.squares[i]}
        onClick={() => this.handleClick(i)}
      />
    );
  }

  render() {
    const status = 'Next player: X';

    return (
      <div>
        <div className="status">{status}</div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}
```

**[View the full code at this point](https://codepen.io/gaearon/pen/ybbQJX?editors=0010)**

After these changes, we're again able to click on the Squares to fill them, the same as we had before. However, now the state is stored in the Board component instead of the individual Square components. When the Board's state changes, the Square components re-render automatically. Keeping the state of all squares in the Board component will allow it to determine the winner in the future.

Since the Square components no longer maintain state, the Square components receive values from the Board component and inform the Board component when they're clicked. In React terms, the Square components are now **controlled components**. The Board has full control over them.

Note how in `handleClick`, we call `.slice()` to create a copy of the `squares` array to modify instead of modifying the existing array. We will explain why we create a copy of the `squares` array in the next section.

### Why Immutability Is Important {#why-immutability-is-important}

In the previous code example, we suggested that you use the `.slice()` operator to create a copy of the `squares` array to modify instead of modifying the existing array. We'll now discuss immutability and why immutability is important to learn.

There are generally two approaches to changing data. The first approach is to *mutate* the data by directly changing the data's values. The second approach is to replace the data with a new copy which has the desired changes.

#### Data Change with Mutation {#data-change-with-mutation}
```javascript
var player = {score: 1, name: 'Jeff'};
player.score = 2;
// Now player is {score: 2, name: 'Jeff'}
```

#### Data Change without Mutation {#data-change-without-mutation}
```javascript
var player = {score: 1, name: 'Jeff'};

var newPlayer = Object.assign({}, player, {score: 2});
// Now player is unchanged, but newPlayer is {score: 2, name: 'Jeff'}

// Or if you are using object spread syntax proposal, you can write:
// var newPlayer = {...player, score: 2};
```

The end result is the same but by not mutating (or changing the underlying data) directly, we gain several benefits described below.

#### Complex Features Become Simple {#complex-features-become-simple}

Immutability makes complex features much easier to implement. Later in this tutorial, we will implement a "time travel" feature that allows us to review the tic-tac-toe game's history and "jump back" to previous moves. This functionality isn't specific to games -- an ability to undo and redo certain actions is a common requirement in applications. Avoiding direct data mutation lets us keep previous versions of the game's history intact, and reuse them later.

#### Detecting Changes {#detecting-changes}

Detecting changes in mutable objects is difficult because they are modified directly. This detection requires the mutable object to be compared to previous copies of itself and the entire object tree to be traversed.

Detecting changes in immutable objects is considerably easier. If the immutable object that is being referenced is different than the previous one, then the object has changed.

#### Determining When to Re-Render in React {#determining-when-to-re-render-in-react}

The main benefit of immutability is that it helps you build _pure components_ in React. Immutable data can easily determine if changes have been made which helps to determine when a component requires re-rendering.

You can learn more about `shouldComponentUpdate()` and how you can build *pure components* by reading [Optimizing Performance](/docs/optimizing-performance.html#examples).

### Function Components {#function-components}

We'll now change the Square to be a **function component**.

In React, **function components** are a simpler way to write components that only contain a `render` method and don't have their own state. Instead of defining a class which extends `React.Component`, we can write a function that takes `props` as input and returns what should be rendered. Function components are less tedious to write than classes, and many components can be expressed this way.

Replace the Square class with this function:

```javascript
function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}
```

We have changed `this.props` to `props` both times it appears.

**[View the full code at this point](https://codepen.io/gaearon/pen/QvvJOv?editors=0010)**

>Note
>
>When we modified the Square to be a function component, we also changed `onClick={() => this.props.onClick()}` to a shorter `onClick={props.onClick}` (note the lack of parentheses on *both* sides).

### Taking Turns {#taking-turns}

We now need to fix an obvious defect in our tic-tac-toe game: the "O"s cannot be marked on the board.

We'll set the first move to be "X" by default. We can set this default by modifying the initial state in our Board constructor:

```javascript{6}
class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: Array(9).fill(null),
      xIsNext: true,
    };
  }
```

Each time a player moves, `xIsNext` (a boolean) will be flipped to determine which player goes next and the game's state will be saved. We'll update the Board's `handleClick` function to flip the value of `xIsNext`:

```javascript{3,6}
  handleClick(i) {
    const squares = this.state.squares.slice();
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      squares: squares,
      xIsNext: !this.state.xIsNext,
    });
  }
```

With this change, "X"s and "O"s can take turns. Try it!

Let's also change the "status" text in Board's `render` so that it displays which player has the next turn:

```javascript{2}
  render() {
    const status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');

    return (
      // the rest has not changed
```

After applying these changes, you should have this Board component:

```javascript{6,11-16,29}
class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: Array(9).fill(null),
      xIsNext: true,
    };
  }

  handleClick(i) {
    const squares = this.state.squares.slice();
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      squares: squares,
      xIsNext: !this.state.xIsNext,
    });
  }

  renderSquare(i) {
    return (
      <Square
        value={this.state.squares[i]}
        onClick={() => this.handleClick(i)}
      />
    );
  }

  render() {
    const status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');

    return (
      <div>
        <div className="status">{status}</div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}
```

**[View the full code at this point](https://codepen.io/gaearon/pen/KmmrBy?editors=0010)**

### Declaring a Winner {#declaring-a-winner}

Now that we show which player's turn is next, we should also show when the game is won and there are no more turns to make. Copy this helper function and paste it at the end of the file:

```javascript
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
```

Given an array of 9 squares, this function will check for a winner and return `'X'`, `'O'`, or `null` as appropriate.

We will call `calculateWinner(squares)` in the Board's `render` function to check if a player has won. If a player has won, we can display text such as "Winner: X" or "Winner: O". We'll replace the `status` declaration in Board's `render` function with this code:

```javascript{2-8}
  render() {
    const winner = calculateWinner(this.state.squares);
    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      // the rest has not changed
```

We can now change the Board's `handleClick` function to return early by ignoring a click if someone has won the game or if a Square is already filled:

```javascript{3-5}
  handleClick(i) {
    const squares = this.state.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      squares: squares,
      xIsNext: !this.state.xIsNext,
    });
  }
```

**[View the full code at this point](https://codepen.io/gaearon/pen/LyyXgK?editors=0010)**

Congratulations! You now have a working tic-tac-toe game. And you've just learned the basics of React too. So *you're* probably the real winner here.

## Adding Time Travel {#adding-time-travel}

As a final exercise, let's make it possible to "go back in time" to the previous moves in the game.

### Storing a History of Moves {#storing-a-history-of-moves}

If we mutated the `squares` array, implementing time travel would be very difficult.

However, we used `slice()` to create a new copy of the `squares` array after every move, and [treated it as immutable](#why-immutability-is-important). This will allow us to store every past version of the `squares` array, and navigate between the turns that have already happened.

We'll store the past `squares` arrays in another array called `history`. The `history` array represents all board states, from the first to the last move, and has a shape like this:

```javascript
history = [
  // Before first move
  {
    squares: [
      null, null, null,
      null, null, null,
      null, null, null,
    ]
  },
  // After first move
  {
    squares: [
      null, null, null,
      null, 'X', null,
      null, null, null,
    ]
  },
  // After second move
  {
    squares: [
      null, null, null,
      null, 'X', null,
      null, null, 'O',
    ]
  },
  // ...
]
```

Now we need to decide which component should own the `history` state.

### Lifting State Up, Again {#lifting-state-up-again}

We'll want the top-level Game component to display a list of past moves. It will need access to the `history` to do that, so we will place the `history` state in the top-level Game component.

Placing the `history` state into the Game component lets us remove the `squares` state from its child Board component. Just like we ["lifted state up"](#lifting-state-up) from the Square component into the Board component, we are now lifting it up from the Board into the top-level Game component. This gives the Game component full control over the Board's data, and lets it instruct the Board to render previous turns from the `history`.

First, we'll set up the initial state for the Game component within its constructor:

```javascript{2-10}
class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      xIsNext: true,
    };
  }

  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
}
```

Next, we'll have the Board component receive `squares` and `onClick` props from the Game component. Since we now have a single click handler in Board for many Squares, we'll need to pass the location of each Square into the `onClick` handler to indicate which Square was clicked. Here are the required steps to transform the Board component:

* Delete the `constructor` in Board.
* Replace `this.state.squares[i]` with `this.props.squares[i]` in Board's `renderSquare`.
* Replace `this.handleClick(i)` with `this.props.onClick(i)` in Board's `renderSquare`.

The Board component now looks like this:

```javascript{17,18}
class Board extends React.Component {
  handleClick(i) {
    const squares = this.state.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      squares: squares,
      xIsNext: !this.state.xIsNext,
    });
  }

  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    const winner = calculateWinner(this.state.squares);
    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div>
        <div className="status">{status}</div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}
```

We'll update the Game component's `render` function to use the most recent history entry to determine and display the game's status:

```javascript{2-11,16-19,22}
  render() {
    const history = this.state.history;
    const current = history[history.length - 1];
    const winner = calculateWinner(current.squares);

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
```

Since the Game component is now rendering the game's status, we can remove the corresponding code from the Board's `render` method. After refactoring, the Board's `render` function looks like this:

```js{1-4}
  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
```

Finally, we need to move the `handleClick` method from the Board component to the Game component. We also need to modify `handleClick` because the Game component's state is structured differently. Within the Game's `handleClick` method, we concatenate new history entries onto `history`.

```javascript{2-4,10-12}
  handleClick(i) {
    const history = this.state.history;
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      xIsNext: !this.state.xIsNext,
    });
  }
```

>Note
>
>Unlike the array `push()` method you might be more familiar with, the `concat()` method doesn't mutate the original array, so we prefer it.

At this point, the Board component only needs the `renderSquare` and `render` methods. The game's state and the `handleClick` method should be in the Game component.

**[View the full code at this point](https://codepen.io/gaearon/pen/EmmOqJ?editors=0010)**

### Showing the Past Moves {#showing-the-past-moves}

Since we are recording the tic-tac-toe game's history, we can now display it to the player as a list of past moves.

We learned earlier that React elements are first-class JavaScript objects; we can pass them around in our applications. To render multiple items in React, we can use an array of React elements.

In JavaScript, arrays have a [`map()` method](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) that is commonly used for mapping data to other data, for example:

```js
const numbers = [1, 2, 3];
const doubled = numbers.map(x => x * 2); // [2, 4, 6]
```

Using the `map` method, we can map our history of moves to React elements representing buttons on the screen, and display a list of buttons to "jump" to past moves.

Let's `map` over the `history` in the Game's `render` method:

```javascript{6-15,34}
  render() {
    const history = this.state.history;
    const current = history[history.length - 1];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
```

**[View the full code at this point](https://codepen.io/gaearon/pen/EmmGEa?editors=0010)**

For each move in the tic-tac-toes's game's history, we create a list item `<li>` which contains a button `<button>`. The button has a `onClick` handler which calls a method called `this.jumpTo()`. We haven't implemented the `jumpTo()` method yet. For now, we should see a list of the moves that have occurred in the game and a warning in the developer tools console that says:

>  Warning:
>  Each child in an array or iterator should have a unique "key" prop. Check the render method of "Game".

Let's discuss what the above warning means.

### Picking a Key {#picking-a-key}

When we render a list, React stores some information about each rendered list item. When we update a list, React needs to determine what has changed. We could have added, removed, re-arranged, or updated the list's items.

Imagine transitioning from

```html
<li>Alexa: 7 tasks left</li>
<li>Ben: 5 tasks left</li>
```

to

```html
<li>Ben: 9 tasks left</li>
<li>Claudia: 8 tasks left</li>
<li>Alexa: 5 tasks left</li>
```

In addition to the updated counts, a human reading this would probably say that we swapped Alexa and Ben's ordering and inserted Claudia between Alexa and Ben. However, React is a computer program and does not know what we intended. Because React cannot know our intentions, we need to specify a *key* property for each list item to differentiate each list item from its siblings. One option would be to use the strings `alexa`, `ben`, `claudia`. If we were displaying data from a database, Alexa, Ben, and Claudia's database IDs could be used as keys.

```html
<li key={user.id}>{user.name}: {user.taskCount} tasks left</li>
```

When a list is re-rendered, React takes each list item's key and searches the previous list's items for a matching key. If the current list has a key that didn't exist before, React creates a component. If the current list is missing a key that existed in the previous list, React destroys the previous component. If two keys match, the corresponding component is moved. Keys tell React about the identity of each component which allows React to maintain state between re-renders. If a component's key changes, the component will be destroyed and re-created with a new state.

`key` is a special and reserved property in React (along with `ref`, a more advanced feature). When an element is created, React extracts the `key` property and stores the key directly on the returned element. Even though `key` may look like it belongs in `props`, `key` cannot be referenced using `this.props.key`. React automatically uses `key` to decide which components to update. A component cannot inquire about its `key`.

**It's strongly recommended that you assign proper keys whenever you build dynamic lists.** If you don't have an appropriate key, you may want to consider restructuring your data so that you do.

If no key is specified, React will present a warning and use the array index as a key by default. Using the array index as a key is problematic when trying to re-order a list's items or inserting/removing list items. Explicitly passing `key={i}` silences the warning but has the same problems as array indices and is not recommended in most cases.

Keys do not need to be globally unique; they only need to be unique between components and their siblings.


### Implementing Time Travel {#implementing-time-travel}

In the tic-tac-toe game's history, each past move has a unique ID associated with it: it's the sequential number of the move. The moves are never re-ordered, deleted, or inserted in the middle, so it's safe to use the move index as a key.

In the Game component's `render` method, we can add the key as `<li key={move}>` and React's warning about keys should disappear:

```js{6}
    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });
```

**[View the full code at this point](https://codepen.io/gaearon/pen/PmmXRE?editors=0010)**

Clicking any of the list item's buttons throws an error because the `jumpTo` method is undefined. Before we implement `jumpTo`, we'll add `stepNumber` to the Game component's state to indicate which step we're currently viewing.

First, add `stepNumber: 0` to the initial state in Game's `constructor`:

```js{8}
class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
    };
  }
```

Next, we'll define the `jumpTo` method in Game to update that `stepNumber`. We also set `xIsNext` to true if the number that we're changing `stepNumber` to is even:

```javascript{5-10}
  handleClick(i) {
    // this method has not changed
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    // this method has not changed
  }
```

We will now make a few changes to the Game's `handleClick` method which fires when you click on a square.

The `stepNumber` state we've added reflects the move displayed to the user now. After we make a new move, we need to update `stepNumber` by adding `stepNumber: history.length` as part of the `this.setState` argument. This ensures we don't get stuck showing the same move after a new one has been made.

We will also replace reading `this.state.history` with `this.state.history.slice(0, this.state.stepNumber + 1)`. This ensures that if we "go back in time" and then make a new move from that point, we throw away all the "future" history that would now become incorrect.

```javascript{2,13}
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }
```

Finally, we will modify the Game component's `render` method from always rendering the last move to rendering the currently selected move according to `stepNumber`:

```javascript{3}
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    // the rest has not changed
```

If we click on any step in the game's history, the tic-tac-toe board should immediately update to show what the board looked like after that step occurred.

**[View the full code at this point](https://codepen.io/gaearon/pen/gWWZgR?editors=0010)**

### Wrapping Up {#wrapping-up}

Congratulations! You've created a tic-tac-toe game that:

* Lets you play tic-tac-toe,
* Indicates when a player has won the game,
* Stores a game's history as a game progresses,
* Allows players to review a game's history and see previous versions of a game's board.

Nice work! We hope you now feel like you have a decent grasp on how React works.

Check out the final result here: **[Final Result](https://codepen.io/gaearon/pen/gWWZgR?editors=0010)**.

If you have extra time or want to practice your new React skills, here are some ideas for improvements that you could make to the tic-tac-toe game which are listed in order of increasing difficulty:

1. Display the location for each move in the format (col, row) in the move history list.
2. Bold the currently selected item in the move list.
3. Rewrite Board to use two loops to make the squares instead of hardcoding them.
4. Add a toggle button that lets you sort the moves in either ascending or descending order.
5. When someone wins, highlight the three squares that caused the win.
6. When no one wins, display a message about the result being a draw.

Throughout this tutorial, we touched on React concepts including elements, components, props, and state. For a more detailed explanation of each of these topics, check out [the rest of the documentation](/docs/hello-world.html). To learn more about defining components, check out the [`React.Component` API reference](/docs/react-component.html).
