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

Викликаючи  `this.setState` з обробника `onClick` у `render` методі компонента Square, ми наказуємо React перерендерити компонент під час натиску. Після оновлення, `this.state.value` компонента Square стане `'X'`, що ми також побачимо на ігровому полі. При натиску на будь-який Square-компонент, відповідний квадрат заповниться хрестиком.

Під час виклику `setState` у компоненті, React також автоматично оновлює його дочірні компоненти.

**[Проглянути повний код цього кроку](https://codepen.io/gaearon/pen/VbbVLg?editors=0010)**

### Інструменти розробки {#developer-tools}

Розширення React Devtools для [Chrome](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en) та [Firefox](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/) дозволяє вам інспектувати дерево React-компонентів у панелі інструметів розробника вашого браузера.

<img src="../images/tutorial/devtools.png" alt="React Devtools" style="max-width: 100%">

React DevTools дозволяють перевірити пропси і стан вашого React-компонента.

Після встановлення React DevTools, натисніть на будь-який елемент на сторінці, виберіть "Inspect", і у панелі інструментів розробника крайньою справа ви побачите нову вкладку React.

**Зауважте, що для коректної роботи інструментів розробника на CodePen, вам слід зробити декілька додаткових кроків:**

1. Увійдіть або зареєструйтесь і підтвердіть вашу електронну пошту (необхідно для запобігання спаму).
2. Натисніть кнопку "Fork".
3. Натисніть  "Change View" і виберіть "Debug mode".
4. У новій вкладці, яка щойно відкрилась, інструменти розробника тепер мають також містити вкладку React.

## Закінчуємо гру {#completing-the-game}

Тепер у нашому розпорядженні ми маємо базові елементи для створення гри у хрестики-нулики. Щоб гра набула завершеного вигляду, нам потрібно всановити почерговість "X" та "O" на ігровому полі і відобразити переможця по завешенню гри.

### Підйом стану {#lifting-state-up}

На даний момент, кожен Square-компонент зберігає у собі стан гри. Для визначення переможця нам потрібно утримувати значення кожного з 9 квадратів в одному місці.

На перший погляд здається, що Board має надсилати запит до кожного Square-компонента за його станом. Хоча такий підхід і можливий, ми не рекомендуємо звертатися до нього, оскільки це робить код важким для розуміння, вразливим до помилок та ускладнює рефакторинг. Замість цього, найкраще було б зберегти стан гри у батьківському Board компоненті замість кожного окремого Square компонента. Компонент Board може вказувати, що відображати Square компонентам передаючи стан через пропси. [Схожим чином ми передали число до кожного Square компонента](#passing-data-through-props).

**Щоб зібрати данні з кількох дочірніх компонентів, чи дати можливість двом дочірнім компонентам контактувати один з одним, вам потрібно визначити спільний стан у батьківському компоненті. Батьківський компонент може передавати стан до дочірніх компонентів через пропси. Цей спосіб підтримує синхронізацію дочірніх компонентів один з одним і з батьківським компонентом.**

Підйом стану до батьківського компонента -- звична справа при рефакторингу React компонентів,  тож давайте скористаємося нагодою і спробуємо цей спосіб.

Добавте конструктор до Board-компонента і визначте початковий стан, який містить масив з 9 null-елементами, що відповідають 9 квадратам:

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

Пізніше, коли ми заповнимо поле, масив `this.state.squares`виглядатиме так:

```javascript
[
  'O', null, 'X',
  'X', 'X', 'O',
  'O', null, null,
]
```

Метод `renderSquare` компонента Board зараз виглядає так:

```javascript
  renderSquare(i) {
    return <Square value={i} />;
  }
```

На початку, з компонента Board ми [передали проп `value`](#passing-data-through-props), щоб відобразити числа від 0 до 8 у кожному Square. На попередньому кроці ми замінили числа на "X"-позначку, [що визначалась власним станом компонента Square](#making-an-interactive-component). Саме тому на даному етапі компонент Square ігнорує проп `value` переданий компонентом Board.

Ми знову скористаємося способом передачі пропсів. Ми модифікуємо Board щоб передати кожному Square-компонету його поточні значення (`'X'`, `'O'`, або `null`). Ми вже визначили масив `squares` у конструкторі Board, і тепер модифікуємо `renderSquare` метод цього компонента, щоб мати змогу читати данні з цього масиву:

```javascript{2}
  renderSquare(i) {
    return <Square value={this.state.squares[i]} />;
  }
```

**[Поглянути повний код цього кроку](https://codepen.io/gaearon/pen/gWWQPY?editors=0010)**

Кожен компонент Square тепер отримуватиме проп `value`, який відповідатиме `'X'`, `'O'`, або `null` для пустої клітинки.

Наступним кроком нам потрібно налаштувати подію при натиску компонента Square. Компонент Board тепер зберігає інформацію про натиснуті клітинки. Оскільки стан є приватним для компонента у якому його визначено, ми не можемо оновити стан Board з дочірнього Square.

Замість цього, ми передамо функцію від батьківського Board до дочірнього Square, і налаштуємо виклик цієї функції зі Square, коли його натиснуто. Змінимо метод `renderSquare` компонента Board на наступний код:

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

>Примітка
>
>Ми розбили код вище для кращої читабельності і додали дужки, щоб JavaScript не зруйнував код, вставляючи крапку з комою після `return`.

Тепер ми передаємо два пропса вниз від Board до Square: `value` та `onClick`. Проп `onClick` -- функція, що спрацьовує коли клікнуто на клітинку компонента Square. Внесемо наступні зміни до Square:

* Замініть `this.state.value` на `this.props.value` у методі `render` компонента Square
* Замініть `this.setState()` на `this.props.onClick()` у методі `render` компонента Square
* Видаліть `constructor` зі Square тому що цей компонент більше не відслідковує стан гри


Після цих змін компонент Square має виглядати так:

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

При натисканні компонента Square з компонента Board викликається функція `onClick`. Розглянемо, чому так відбувається:

1. Проп `onClick` на вбудованому DOM-компоненті `<button>` наказує React налаштувати прослуховувач події натиску.
2. Коли кнопку натиснуто, React викличе обробник події `onClick`, який визначено у методі `render()` компонента Square.
3. Цей обробник події викличе `this.props.onClick()`. Проп onClick для Square визначено у компоненті Board.
4. Оскільки Board передає `onClick={() => this.handleClick(i)}` до Square, Square при натиску викличе `this.handleClick(i)`.
5. Ми ще не визначили метод `handleClick()`, тож наш код не працюватиме як слід. Якщо ви натисните на клітинку, то побачите червоний екран з помилкою, яка зазначає: "this.handleClick is not a function".

>Примітка
>
>Атрибут `onClick` DOM-елемента `<button>` має для React особливе значення, оскільки це вбудований компонент. Для звичайних компонентів, як Square, найменування пропсів може бути довільним. Ми можемо назвати проп `onClick` компонента Square чи метод  `handleClick` компонента Board будь-яким іменем, і код працюватиме так само. У React загальноприйнятим вважається використання `on[Event]` імен для пропсів, що представляють події, і `handle[Event]` для методів цю подію обробляють.

Якщо ми натиснемо клітинку Square, то отримаємо помілку, оскільки ми ще не визначили `handleClick`. Додамо цей метод до класу Board:

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

**[Проглянути повний код цього кроку](https://codepen.io/gaearon/pen/ybbQJX?editors=0010)**

Після цих змін, ми як і раніше знову можемо натискати клітинки щоб заповнити їх. Однак, тепер стан зберігається у компоненті Board замість кожного індивідуального компонента Square. Коли стан Board змінюється, Square відрендериться автоматично. Збереження стану усіх клітинок у компоненті Board в майбутньому дозволить визначити переможця.

Оскільки компоненти Square більше не зберігають стан, вони отримують значення від компорента Board і інформують його при кожному натиску. Згідно з термінологією React, компоненти Square є **контрольованими компонентами**, оскільки Board тепер має повний контроль над ними.

Зверніть увагу, як всередині `handleClick` ми  використали метод `.slice()`, щоб створити копію масива `squares`, яку ми змінюватимемо замість оригінального масива. Ми пояснимо навіщо ми створили цю копію у наступному розділі.

### Чому незмінність важлива? {#why-immutability-is-important}

У попередньому прикладі коду ми запропонували використовувати метод `.slice()` для створення копії масиву `squares`, щоб у подальшому модифікувати цю копію, не чіпаючи оригінальний масив. Тепер ми обговоримо що таке незмінність, і чому важливо її вивчати.

Вцілому існує два загальних підходи до зміни данних. Перший підхід -- *мутувати(змінити)* данні напряму встановлюючи нові значення.Другий підхід -- замінити данні копією з уже включеними змінами.

#### Зміна данних з використанням мутування {#data-change-with-mutation}
```javascript
var player = {score: 1, name: 'Jeff'};
player.score = 2;
// Тепер черга гравця {score: 2, name: 'Jeff'}
```

#### Зміна данних без використання мутації {#data-change-without-mutation}
```javascript
var player = {score: 1, name: 'Jeff'};

var newPlayer = Object.assign({}, player, {score: 2});
// У цьому прикладі player залишився незмінним, а newPlayer тепер {score: 2, name: 'Jeff'}

// Або якщо ж ви використовуєте синтаксис розширення, ви можете написати:
// var newPlayer = {...player, score: 2};
```

Кінцевий результат залишиться таким самим, але без прямої мутації (змін базових даних). Нижче розглянуті переваги даного способу.

#### Складні властивості спрощуються {#complex-features-become-simple}

Незмінність робить складні властивості набагато простішими. Пізніше у цьому введенні ми реалізуємо функціональність "подорожі у часі", що дозволить нам переглянути історію гри у хрестики-нулики і "повернутися" до попередніх ходів. Дана функціональність не обмежена іграми, можливість відмінити і повторити певні дії знову є необхідною умовою багатьох додатків. Уникаючи прямої зміни даних, ми можемо звертатись до попередніх версій історії гри і повторно використовувати їх..

#### Виявлення змін {#detecting-changes}

Виявити зміни у мутованих об'єктах досить важко, оскільки вони модифіковані напряму. У цьому випадку нав доведеться порівнювати мутований об'єкт як зі своїми попередніми копіями, так і з усім деревом об'єктів.

Виявити зміни в незмінних об'єктах набагато легше. Якщо незмінний об'єкт відрізняється від попереднього, тоді він змінився.

#### Коли потрібно відрендерити повторно у React {#determining-when-to-re-render-in-react}

Головною перевагою незмінності є те, що це допомагає вам створити _чисті компоненти_ у React. Незмінні дані дозволяють легко виявити наявність змін, що дозволяє виявити необхідність повторного рендерингу.

Більше про `shouldComponentUpdate()` і як створювати *чисті компоненти* ви можете дізнатись прочитавши розділ [Оптимізація продуктивності](/docs/optimizing-performance.html#examples).

### Функціональні компоненти {#function-components}

Змінимо Square на **функціональний компонент**.

У React, **функціональні компоненти** -- це спрощений спосіб написання компонентів, що складаються тільки з `render`-метода і не мають власного стану. Замість  визначення класу, який поширює `React.Component`, ми можемо створити функцію, яка приймає пропси і повертає те, що треба відрендерити. Функціональні компоненти менш довгі у написання, і багато з компонентів можна оформити таким чином.

Замінимо клас Square на функцію:

```javascript
function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}
```

Ми замінили `this.props` на `props` обидва рази.

**[Проглянути повний код цього кроку](https://codepen.io/gaearon/pen/QvvJOv?editors=0010)**

>Примітка
>
>Коли ми перетворили Square у функціональний компонент, ми також змінили `onClick={() => this.props.onClick()}` на коротший `onClick={props.onClick}` (зверніть увагу на відсутність дужок з *обох* сторін).

### Встановлюємо почерговість {#taking-turns}

Тепер нам треба виправити один очевидний дефект у нашій грі -- на полі неможна поставити "O".

За замовчуванням встановимо перший хід за "X". Зробити це ми можемо модифікувавши початкови стан у конструкторі компонента Board:

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

Кожного разу, як гравець робить хід, `xIsNext`()
Each time a player moves, `xIsNext` (логічний (булевий) тип даних) змінюватиме значення на протилежне, щоб визначити який гравець ходить наступним, а стан гри збережеться. Ми оновимо функцію `handleClick` компонента Board для інверсії значення `xIsNext`:

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

Після цих змін, "X"s та "O"s матимуть можливість чергуватися. Спробуйте!

Давайте також змінимо текст "статусу" у методі `render` компонента Board таким чином, щоб він відображав який гравець ходить наступним:

```javascript{2}
  render() {
    const status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');

    return (
      // решта не змінилася
```

Після застосування цих змін, компонент Board має виглядати так:

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

**[Проглянути повний код цього кроку](https://codepen.io/gaearon/pen/KmmrBy?editors=0010)**

### Визначення переможця {#declaring-a-winner}

Тепер, коли ми показуємо, який гравець ходить наступним, ми також маємо показати переможця у кінці гри і зробити неможливим наступні ходи. Скопіюйте цю допоміжну функцію і вставте  її в кінці файлу:

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

Маючи мачив з 9 клітинок, ця функція перевірятиме переможця і поверне 'X'`, `'O'`, або `null`.

Ми викличемо `calculateWinner(squares)` в методі `render` компонента Board, щоб перевірити чи виграв гравець. Якщо гравець виграв, ми можемо відобразити текст: "Переможець: X" or "Переможець: O". Ми замінимо оголошення `status` у `render`-методі компонента Board наступним кодом:

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
      // решта не змінилась
```

Тепер ми можемо змінити метод `handleClick` у Board для завершення функції і ігнорування натиску, якщо хтось переміг, або поле повністю заповнене:

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

**[Проглянути повний код цього кроку](https://codepen.io/gaearon/pen/LyyXgK?editors=0010)**

Вітаємо! Тепер ви маєте повністю робочу гру у хрестики-нулики. І ви щойно освоїли основи React. Схоже, справжній переможець тут це *ви*.

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

### Підіб'ємо підсумки {#wrapping-up}

Вітаємо! Ви щойно створили гру у хрестики-нулики яка:

* Дозволяє грати у хрестики-нулики,
* Визначає переможця,
* Зберігає історію гри,
* Дозволяє гравцеві проглянути історію і попередні модифікації ігрової дошки.

Чудова робота! Ми сподіваємося, що тепер ви почуваєтеся впевненіше у роботі з React.

Продивитися фінальний результат ви можете за наступним посиланням: **[Завершена гра](https://codepen.io/gaearon/pen/gWWZgR?editors=0010)**.

Якщо ви маєте додатковий час або хочете попрактикувати нові навички в React, ось кілька ідей, які допоможуть покращити гру у хрестики-нулики. Ідеї розташовані за зростанням важкості:

1. Відобразіть позицію для кожного ходу у форматі (колонка, радок) в списку історії ходів.
2. Виділіть вибраний елемент у спику ходів.
3. Перепишіть компонент Board, використовуючи цикли для створення квадратів, замість написання вручну.
4. Add a toggle button that lets you sort the moves in either ascending or descending order.
5. When someone wins, highlight the three squares that caused the win.
6. When no one wins, display a message about the result being a draw.

Throughout this tutorial, we touched on React concepts including elements, components, props, and state. For a more detailed explanation of each of these topics, check out [the rest of the documentation](/docs/hello-world.html). To learn more about defining components, check out the [`React.Component` API reference](/docs/react-component.html).
