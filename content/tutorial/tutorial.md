---
id: tutorial
title: "Введення: знайомство з React"
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

У цьому введенні ми працюватимемо над створенням маленької гри. **Вам це може здатися непотрібним, оскільки ви не плануєте створювати ігри, але ми рекомендуємо спробувати.** Методи, які ви вивчите у даному введенні, є основоположними для створення будь-яких React-додатків, і освоєння цих методів допоможе вам глибше зрозуміти React.

>Порада
>
> Дане введення призначене для людей, які надають перевагу **навчанню на практиці**. Якщо вам більше подобається вчитися з нуля, зверніться до нашого [покрокового довідника](/docs/hello-world.html). Можливо, ви виявите для себе, що обидва чудово доповнюють одне одного.

Введення розбито на декілька розділів:

* [Налаштування](#setup-for-the-tutorial) допоможуть встановити **відправну точку** для роботи над грою.
* [Огляд](#overview) ознайомить вас з такими **основами** React, як компоненти, пропси та стан.
* [Створення гри](#completing-the-game) допоможе розібратися з **найпоширенішими методами** у розробці React-додатків.
* [Додання подорожі у часі](#adding-time-travel) надасть можливість **глибше осягнути** сильні сторони React.

Щоб отримати користь від цього введення, вам зовсім не потрібно опрацьовувати усі розділи відразу. Продовжуйте працювати стільки, скільки вважаєте за потрібне, навіть якщо це один чи два розділи.

### Що ми створюємо? {#what-are-we-building}

У цьому введенні ми розглянемо, як створити інтерактивну гру в хрестики-нулики за допомогою React.

Кінцевий результат ви можете розглянути за наступним посиланням: **[Завершена гра ](https://codepen.io/gaearon/pen/gWWZgR?editors=0010)**. Не хвилюйтесь, якщо код здається вам незрозумілим, або ви не знайомі з синтаксисом! Мета даного введення -- допомогти вам зрозуміти React і його синтаксис.

Ми радимо уважно роздивитися гру перед тим як продовжувати працювати над введенням. Одна з її помітних властивостей -- пронумеровани список з правої сторони ігрового поля. Цей список відображає історію всіх ходів і оновлюється по ходу гри.

Ви можете закрити гру, коли закінчите ознайомлюватись. Ми почнемо з простішого зразка. Наш наступний крок -- підготуватись до створення гри.

### Передумови {#prerequisites}

Ми припустимо, що ви вже трохи знайомі з HTML і JavaScript. Але навіть якщо в повсякденному житті ви використовуєте іншу мову програмування, проходження даного введення не має скласти труднощів. Також вважатимемо, що ви знайомі з  функціями, об'єктами, масивами і, меншою мірою, класами.

Якщо вам потрібно повторити основи JavaScript, ми рекомендуємо проглянути [цей довідник](https://developer.mozilla.org/uk/docs/Web/JavaScript/A_re-introduction_to_JavaScript). Зверніть увагу, що ми також використовуємо деякі особливості ES6 -- нещодавньої версії JavaScript. У цьому введенні ми застосовуємо [стрілкові функції](https://developer.mozilla.org/uk/docs/Web/JavaScript/Reference/Functions/%D0%A1%D1%82%D1%80%D1%96%D0%BB%D0%BA%D0%BE%D0%B2%D1%96_%D1%84%D1%83%D0%BD%D0%BA%D1%86%D1%96%D1%97), [класи](https://developer.mozilla.org/uk/docs/Web/JavaScript/Reference/Classes), [`let`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let) та [`const`](https://developer.mozilla.org/uk/docs/Web/JavaScript/Reference/Statements/const). Ви можете скористатися [Babel REPL](babel://es5-syntax-example), щоб дізнатися у що компілюється код ES6.

## Налаштування {#setup-for-the-tutorial}

Існує два способи проходження цього введення: ви можете писати код у браузері, або налаштувати локальне середовище розробки на своєму комп'ютері.

### Спосіб 1: Пишемо код у браузері {#setup-option-1-write-code-in-the-browser}

Якщо вам не терпиться почати, цей спосіб найшвидший!

Спершу, відкрийте **[стартовий код](https://codepen.io/gaearon/pen/oWWQNa?editors=0010)** у новій вкладці. Ви побачите пусте поле для гри в хрестики-нулики і React-код. У даному розділі ми поступово змінюватимемо цей код.

Ви можете пропустити другий варіант налаштувань і відразу перейти до [огляду](#overview) React.

### Спосіб 2: Локальне середовище розробки {#setup-option-2-local-development-environment}

Цей крок необов'язковий і не вимагається для проходження даного введення!

<br>

<details>

<summary><b>Необов'язково: інструкції для написання коду в улюбленому текстовому редакторі</b></summary>

Це налаштування вимагає трохи більше роботи, але дозволяє опрацьовувати введення у власному редакторі. Ось що вам потрібно зробити:

1. Упевніться, що на вашому комп'ютері встановлено останню версію [Node.js](https://nodejs.org/en/).
2. Слідуйте [інструкціям налаштування Create React App](/docs/create-a-new-react-app.html#create-react-app) для створення нового проекту.

```bash
npx create-react-app my-app
```

3. Видаліть усі файли з папки `src/` нового проекту. 

> Примітка:
>
>**Не видаляйте саму папку `src`, тільки вихідні файли, що містяться в ній.** Наступним кроком ми замінимо ці файли прикладами, потрібними для проекту.

```bash
cd my-app
cd src

# Якщо ви використовуєте Mac або Linux:
rm -f *

# Або якщо використовуєте Windows:
del *

# Після цього поверніться до папки проекту
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

Якщо ви застрягли, зверніться до [ресурсів підтримки спільноти](/community/support.html). Зокрема, [чат Reactiflux](https://discord.gg/0ZcbPKXt5bZjGY5n) -- чудовий спосіб швидко знайти допомогу. Якщо ви не отримали належну відповідь і все ще не знаєте, як вирішити проблему, будь ласка, напишіть нам, і ми вам допоможемо.

## Огляд {#overview}

Тепер, коли ви закінчили попередні налаштування, давайте перейдемо до огляду React!

### Що таке React? {#what-is-react}

React -- це декларативна, ефективна і гнучка JavaScript-бібліотека, призначена для створення інтерфейсів користувача. Вона дозволяє компонувати складні інтерфейси з невеликих окремих частин коду -- "компонентів".

У React існує кілька різних видів компонентів, але ми почнемо з підкласів `React.Component`:

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

// Приклад використання: <ShoppingList name="Mark" />
```

Ми ще повернемося до незвичних, схожих на XML-тегів. Ми використовуємо компоненти, щоб повідомити React, що саме хочемо бачити на екрані. Кожного разу при зміні даних, React ефективно оновлює і повторно рендерить наші компоненти.

Так, _ShoppingList_ вище -- це **класовий компонент React**. Компонент приймає параметри, які називаються `props` (скорочено від "properties" -- властивості), і повертає ієрархію перегляду, використовуючи метод `render`.

Метод `render` повертає *опис* того, що ви хочете бачити на екрані. React приймає цей опис і відтворює результат. Зокрема, `render` повертає **React-елемент** -- полегшену версію того, що треба відрендерити. Більшість React-розробників користується спеціальним синтаксисом під назвою "JSX", який спрощує написання цих конструкцій. Під час компіляції синтаксис `<div />` перетворюється у `React.createElement('div')`, тож приклад вище рівноцінний до:

```javascript
return React.createElement('div', {className: 'shopping-list'},
  React.createElement('h1', /* ... дочірні компоненти h1 ... */),
  React.createElement('ul', /* ... дочірні компоненти ul ... */)
);
```

[Проглянути повну розширену версію.](babel://tutorial-expanded-version)

Якщо вам цікаво, детальніше про `createElement()` можна дізнатися у  [довіднику API](/docs/react-api.html#createelement). Ми не використовуватимемо даний синтаксис у цьому введенні, натомість ми продовжимо працювати з JSX.

JSX має повну силу JavaScript. У межах фігурних дужок JSX ви можете використовувати *будь-які* JavaScript-вирази. Кожен елемент React є об'єктом, який можна зберегти у змінній або розповсюдити у вашій програмі.

Компонент `ShoppingList` вище рендерить тільки вбудовані DOM-компоненти як `<div />` або `<li />`. Але ви також можете створювати і рендерити власні React-компоненти. Наприклад, тепер ми можемо посилатися на весь список покупок відразу використовуючи `<ShoppingList />`. Кожен React-компонент інкапсульований і може використовуватись незалежно від інших; це дозволяє створювати складні інтерфейси з простих компонентів.

## Розглянемо стартовий код {#inspecting-the-starter-code}

Якщо ви збираєтесь працювати над введенням **у браузері**, відкрийте цей код у новій вкладці: **[стартовий код](https://codepen.io/gaearon/pen/oWWQNa?editors=0010)**. Якщо ж ви працюватимете **на власному комп'ютері**, відкрийте `src/index.js` у папці проекту (ви вже працювали з цим файлом під час [налаштувань](#setup-option-2-local-development-environment)).

Цей стартовий код є фундаментом того, що ми будуватимемо. Ми завчасно подбали про CSS-стиль, тож ви можете повністю сконцентруватися на вивченні React і створенні гри у хрестики-нулики.

Розглядаючи код, ви помітите, що ми маємо три React-компоненти:

* Square (Клітинка)
* Board (Поле)
* Game (Гра)

Компонент Square рендерить окремий елемент `<button>`, а компонент Board рендерить 9 таких клітинок. Компонент Game рендерить ігрове поле з заповнювачами, які ми змінимо пізніше. Наразі ми не маємо жодного інтерактивного компонента.

### Передаємо дані через пропси {#passing-data-through-props}

Для початку спробуємо передати деякі дані з компоненту Board у компонент Square.

Ми наполегливо рекомендуємо набирати код вручну під час роботи з введенням, а не копіювати і вставляти його. Це допоможе розвити м'язову пам'ять і досягти кращого розуміння.

У методі `renderSquare` компонента Board змініть код, щоб передати проп `value` компоненту Square:

```js{3}
class Board extends React.Component {
  renderSquare(i) {
    return <Square value={i} />;
  }
```

Щоб відобразити значення, змініть `render` метод компонента Square, замінивши `{/* TODO */}` на `{this.props.value}`:

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

Після: ви маєте бачити число всередині кожної відрендереної клітинки.

![React Devtools](../images/tutorial/tictac-numbers.png)

**[Проглянути повний код цього кроку](https://codepen.io/gaearon/pen/aWWQOG?editors=0010)**

Вітаємо! Ви щойно "передали проп" від батьківського компонента Board до дочірнього компонента Square. Передача даних через пропси від батьківського компонента до дочірнього -- це те як дані перетікають у React-додатках.

### Створюємо інтерактивний компонент {#making-an-interactive-component}

Давайте при натисканні заповнимо компонент Square позначкою "X". Для початку змінимо тег кнопки, який повертається з функції `render()`, на наступний код:

```javascript{4}
class Square extends React.Component {
  render() {
    return (
      <button className="square" onClick={function() { alert('клік'); }}>
        {this.props.value}
      </button>
    );
  }
}
```

Тепер, при натисканні на Square, у браузері щоразу має з'являтись повідомлення.

>Примітка
>
>Щоб уникнути зайвого другу і [заплутаної поведінки `this`](https://yehudakatz.com/2011/08/11/understanding-javascript-function-invocation-and-this/), тут і далі для обробників події ми використовуватимемо [синтаксис стрілкової фінкції](https://developer.mozilla.org/uk/docs/Web/JavaScript/Reference/Functions/%D0%A1%D1%82%D1%80%D1%96%D0%BB%D0%BA%D0%BE%D0%B2%D1%96_%D1%84%D1%83%D0%BD%D0%BA%D1%86%D1%96%D1%97):
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
>Зверніть увагу, що у `onClick={() => alert('click')}` ми передаємо  *функцію* як проп `onClick`. React викличе цю функцію тільки після натискання. Типовою помилкою є використання синтаксису `onClick={alert('click')}` без  `() =>`, оскільки такий код буде спрацьовувати при кожному рендері компонента.

Наступним кроком ми хочемо, щоб компонент Square "запам'ятав", що на нього клікнули і відобразив позначку "X". Для "запам'ятовування" компоненти використовують **стан**.

Щоб налаштувати стан у компоненті React, вам потрібно вписати `this.state` у його конструктор. `this.state` варто розглядати як особисту властивість компонента, у якому його визначено. Давайте збережемо поточне значення Square у `this.state` і змінюватимемо його при кожному натисканні.

Спершу додамо конструктор до класу, щоб ініціалізувати стан:

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

Після цих змін тег `<button>`, повернений з метода `render` компонента Square, має виглядати наступним чином:

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

Викликаючи  `this.setState` з обробника `onClick` у методі `render` компонента Square, ми наказуємо React перерендерити компонент щоразу під час натиску на `<button>`. Після оновлення, `this.state.value` компонента набуде значення `'X'`, що ми також побачимо на ігровому полі. При натиску на будь-який Square-компонент, відповідна клітинка заповниться позначкою `X`.

Під час виклику `setState` у компоненті, React також автоматично оновлює його дочірні компоненти.

**[Проглянути повний код цього кроку](https://codepen.io/gaearon/pen/VbbVLg?editors=0010)**

### Інструменти розробки {#developer-tools}

Розширення React Devtools для [Chrome](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en) та [Firefox](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/) дозволяє вам інспектувати дерево React-компонентів у панелі інструметів розробника вашого браузера.

<img src="../images/tutorial/devtools.png" alt="React Devtools" style="max-width: 100%">

React DevTools дозволяють перевірити пропси і стан вашого React-компонента.

Після встановлення React DevTools натисніть на будь-який елемент на сторінці, виберіть "Inspect", і у панелі інструментів розробника крайньою справа ви побачите нову вкладку React.

**Зауважте, що для коректної роботи інструментів розробника на CodePen вам слід зробити декілька додаткових кроків:**

1. Увійдіть або зареєструйтесь і підтвердіть вашу електронну пошту (необхідно для запобігання спаму).
2. Натисніть кнопку "Fork".
3. Натисніть  "Change View" і виберіть "Debug mode".
4. У новій вкладці, яка щойно відкрилась, інструменти розробника тепер мають також містити вкладку React.

## Завершуємо гру {#completing-the-game}

Тепер у нашому розпорядженні ми маємо базові елементи для створення гри у хрестики-нулики. Щоб гра набула завершеного вигляду, нам потрібно всановити почерговість "X" та "O" на ігровому полі і відобразити переможця по завершенню гри.

### Підйом стану {#lifting-state-up}

На даний момент кожен Square-компонент зберігає у собі стан гри. Для визначення переможця ми збережемо значення кожної клітинки в одному місці.

Може здатися, що Board має надсилати запит до кожного Square-компонента, щоб дізнатися стан. І хоча такий підхід можливий, ми не рекомендуємо звертатися до нього, оскільки це робить код важким для розуміння, вразливим до помилок та ускладнює рефакторинг. Натомість краще зберегти стан гри у батьківському Board-компоненті замість кожного окремого Square-компонента. Компонент Board може вказувати що відображати Square-компонентам, передаючи стан через пропси. [Схожим чином ми передали число кожному Square-компоненту](#passing-data-through-props).

**Щоб зібрати данні з кількох дочірніх компонентів чи дати можливість двом дочірнім компонентам контактувати один з одним, вам потрібно визначити спільний стан у батьківському компоненті. Батьківський компонент може передавати стан до дочірніх компонентів через пропси. Цей спосіб підтримує синхронізацію дочірніх компонентів один з одним і з батьківським компонентом.**

Підйом стану до батьківського компонента -- звична справа при рефакторингу React-компонентів,  тож давайте скористаємося нагодою і спробуємо цей спосіб.

Добавте конструктор до компонента Board і визначте початковий стан, який міститиме масив з 9 null-елементами, що відповідають 9 клітинкам:

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

Пізніше, коли ми заповнимо поле, масив `this.state.squares`виглядатиме приблизно так:

```javascript
[
  'O', null, 'X',
  'X', 'X', 'O',
  'O', null, null,
]
```

Метод `renderSquare` компонента Board зараз виглядає наступним чином:

```javascript
  renderSquare(i) {
    return <Square value={i} />;
  }
```

На початку ми [передали проп `value`](#passing-data-through-props) з компонента Board, щоб відобразити числа від 0 до 8 у кожному Square. Попереднім кроком ми замінили числа на позначку "X", [що визначалась власним станом компонента Square](#making-an-interactive-component). Саме тому на даному етапі компонент Square ігнорує проп `value`, переданий компонентом Board.

Ми знову скористаємося способом передачі пропсів. Ми модифікуємо Board, щоб передати кожному Square-компоненту його поточні значення (`'X'`, `'O'`, або `null`). Ми вже визначили масив `squares` у конструкторі Board і тепер модифікуємо метод `renderSquare` цього компонента, щоб мати змогу читати дані з цього масиву:

```javascript{2}
  renderSquare(i) {
    return <Square value={this.state.squares[i]} />;
  }
```

**[Поглянути повний код цього кроку](https://codepen.io/gaearon/pen/gWWQPY?editors=0010)**

Кожен компонент Square тепер отримуватиме проп `value`, який відповідатиме `'X'`, `'O'`, або `null` для пустих клітинок.

Далі нам потрібно налаштувати подію, що спрацьовуватиме при натиску на компонент Square. Компонент Board тепер зберігає інформацію про натиснуті клітинки. Нам потрібно визначити спосіб, щоб оновити стан Board зі Square-компонента. Оскільки стан є приватним для компонента у якому його визначено, ми не можемо оновити стан Board з дочірнього Square.

Натомість ми передамо функцію від Board до Square і налаштуємо виклик цієї функції зі Square, коли на нього натиснуто. Змінимо метод `renderSquare` компонента Board на наступний код:

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
>Ми розбили код вище для кращої читабельності і додали круглі дужки, щоб JavaScript не зруйнував код, вставляючи крапку з комою після `return`.

Тепер, від Board до Square, ми передаємо два пропси вниз: `value` та `onClick`. Проп `onClick` -- функція, що спрацьовує коли клітинку компонента Square натиснуто. Внесемо наступні зміни до Square:

* Замініть `this.state.value` на `this.props.value` у методі `render` компонента Square
* Замініть `this.setState()` на `this.props.onClick()` у методі `render` компонента Square
* Видаліть `constructor` зі Square, тому що цей компонент більше не відслідковує стан гри


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

При натисканні Square з компонента Board викликається функція `onClick`. Розглянемо, чому так відбувається:

1. Проп `onClick` у вбудованому DOM-компоненті `<button>` наказує React налаштувати прослуховувач події натиску.
2. Коли кнопку натиснуто, React викличе обробник події `onClick`, який визначено у методі `render()` компонента Square.
3. Цей обробник події викличе `this.props.onClick()`. Проп onClick для Square визначено у компоненті Board.
4. Оскільки Board передає `onClick={() => this.handleClick(i)}` до Square, Square при натиску викличе `this.handleClick(i)`.
5. Ми ще не визначили метод `handleClick()`, тож наш код не працюватиме як слід. Якщо ви натисните на клітинку, то побачите червоний екран з помилкою, яка зазначає: "this.handleClick is not a function".

>Примітка
>
>Атрибут `onClick` DOM-елемента `<button>` має для React особливе значення, оскільки це вбудований компонент. Для звичайних компонентів, як Square, найменування пропсів може бути довільним. Ми можемо назвати проп `onClick` компонента Square чи метод  `handleClick` компонента Board будь-яким іменем, і код працюватиме так само. У React загальноприйнятим вважається використання `on[Event]` імен для пропсів, що представляють події, і `handle[Event]` для методів, що цю подію обробляють.

Якщо ми натиснемо клітинку Square, то отримаємо помилку, оскільки ми ще не визначили `handleClick`. Додамо цей метод до класу Board:

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
    const status = 'Наступний гравець: X';

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

Після цих змін ми як і раніше знову можемо натискати клітинки, щоб заповнити їх. Однак тепер стан зберігається у компоненті Board замість кожного індивідуального компонента Square. Коли стан Board змінюється, Square перерендерюється автоматично. Збереження стану всіх клітинок у компоненті Board у майбутньому дозволить нам визначити переможця.

Оскільки компоненти Square більше не зберігають стан, вони отримують значення від компорента Board і інформують його при кожному натиску. Згідно з термінологією React, компоненти Square є **контрольованими компонентами**, оскільки Board тепер має повний контроль над ними.

Зверніть увагу, як усередині `handleClick` ми  використали метод `.slice()`, щоб створити копію масиву `squares`, яку ми змінюватимемо замість уже існуючого масиву. Ми пояснимо, навіщо ми створили цю копію у наступному розділі.

### Чому незмінність важлива? {#why-immutability-is-important}

У попередньому прикладі коду ми запропонували використати метод `.slice()` для створення копії масиву `squares`, щоб у подальшому модифікувати цю копію замість оригінального масиву. Тепер ми обговоримо, що таке незмінність, і чому важливо її вивчати.

Загалом існує два загальних підходи до зміни данних. Перший підхід -- *змінити* дані напряму, встановлюючи нові значення. Другий підхід -- замінити дані копією з уже включеними змінами.

#### Пряма зміна даних {#data-change-with-mutation}
```javascript
var player = {score: 1, name: 'Jeff'};
player.score = 2;
// Тепер черга гравця {score: 2, name: 'Jeff'}
```

#### Опосередкована зміна даних {#data-change-without-mutation}
```javascript
var player = {score: 1, name: 'Jeff'};

var newPlayer = Object.assign({}, player, {score: 2});
// У цьому прикладі player залишився незмінним, а newPlayer набув значення {score: 2, name: 'Jeff'}

// Або якщо ви використовуєте синтаксис розширення, ви можете написати:
// var newPlayer = {...player, score: 2};
```

Кінцевий результат залишиться таким самим, але без прямої зміни базових даних. Нижче розглянуті переваги даного способу.

#### Спрощення складних властивостей {#complex-features-become-simple}

Незмінність робить реалізацію складних властивостей набагато простішою. Пізніше у цьому введенні ми втілимо властивість "подорожі у часі", що дозволить нам переглянути історію гри у хрестики-нулики і "повернутися" до попередніх ходів. Дана властивість не обмежена іграми, можливість відмінити і повторити певні дії знову є необхідною умовою багатьох додатків. Уникаючи прямої зміни даних, ми можемо звертатись до попередніх версій історії гри і повторно використовувати їх.

#### Виявлення змін {#detecting-changes}

Виявити зміни у змінних об'єктах досить важко, оскільки вони модифіковані напряму. У цьому випадку нам доведеться порівнювати змінений об'єкт як з його попередніми копіями, так і з усім деревом об'єктів.

Виявити зміни в незмінних об'єктах набагато легше. Якщо згаданий незмінний об'єкт відрізняється від попереднього, тоді він змінився.

#### Визначення повторного рендерингу у React {#determining-when-to-re-render-in-react}

Головною перевагою незмінності у React є те, що вона допомагає створити _чисті компоненти_. Незмінні дані дозволяють легко виявити наявність змін, що дозволяє встановити необхідність повторного рендерингу.

Більше про `shouldComponentUpdate()` і як створювати *чисті компоненти* ви можете дізнатись прочитавши розділ [Оптимізація продуктивності](/docs/optimizing-performance.html#examples).

### Функціональні компоненти {#function-components}

Змінимо Square на **функціональний компонент**.

У React **функціональні компоненти** -- це спрощений спосіб написання компонентів, що складаються тільки з `render`-метода і не мають власного стану. Замість  визначення класу, який поширює `React.Component`, ми можемо створити функцію, яка приймає `пропси` і повертає те, що треба відрендерити. Функціональні компоненти менш довгі у написанні, і більшість компонентів можна оформити таким чином.

Замінимо клас Square на наступну функцію:

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
>Коли ми перетворили Square у функціональний компонент, ми також змінили `onClick={() => this.props.onClick()}` на коротший `onClick={props.onClick}` (зверніть увагу на відсутність круглих дужок з *обох* сторін).

### Встановлюємо почерговість {#taking-turns}

Тепер нам треба виправити один очевидний дефект у нашій грі -- на полі не можна поставити "O".

За замовчуванням встановимо перший хід за "X". Зробити це можливо модифікувавши початкови стан у конструкторі компонента Board:

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

З кожним ходом `xIsNext` (логічний (булевий) тип даних) змінюватиме значення на протилежне, щоб визначити який гравець ходить наступним, після чого стан гри збережеться. Оновимо функцію `handleClick` у Board для інверсії значення `xIsNext`:

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

Після цих змін позначки "X" та "O" матимуть можливість чергуватися. Спробуйте!

Давайте також змінимо текст "статусу" у методі `render` компонента Board таким чином, щоб він відображав який гравець ходить наступним:

```javascript{2}
  render() {
    const status = 'Наступний гравець: ' + (this.state.xIsNext ? 'X' : 'O');

    return (
      // решта не змінилася
```

Після застосування цих змін компонент Board має виглядати так:

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
    const status = 'Наступний гравець: ' + (this.state.xIsNext ? 'X' : 'O');

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

Тепер, коли ми показуємо, який гравець ходить наступним, ми також маємо показати переможця у кінці гри і зробити наступні ходи неможливими. Скопіюйте цю допоміжну функцію і вставте  її в кінці файлу:

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

Маючи масив з 9 клітинок, ця функція перевірить на наявність переможця і поверне `'X'`, `'O'`, або `null`.

Викличемо `calculateWinner(squares)` у методі `render` компонента Board, щоб перевірити чи гравець виграв. Якщо гравець виграв, ми можемо відобразити текст: "Переможець: X" або "Переможець: O". Замінимо значення `status` у `render`-методі компонента Board наступним кодом:

```javascript{2-8}
  render() {
    const winner = calculateWinner(this.state.squares);
    let status;
    if (winner) {
      status = 'Переможець: ' + winner;
    } else {
      status = 'Наступний гравець: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      // решта не змінилась
```

Тепер ми можемо змінити метод `handleClick` у Board для завершення функції та ігнорування натиску, якщо хтось вже переміг, або поле повністю заповнене:

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

## Додаємо подорож у часі {#adding-time-travel}

Наостанок давайте створимо здатність "подорожувати у часі", щоб мати змогу повернутися до попередніх ходів у грі.

### Зберігаємо історію ходів {#storing-a-history-of-moves}

Якби ми змінили масив `squares`, реалізувати подорожі у часі було б дуже важко.

Утім, ми скористалися методом `slice()` для створення нової копії `squares` після кожного ходу і [залишили оригінальний масив незмінним](#why-immutability-is-important). Це дозволить нам зберегти усі попередні версії масиву `squares` і переміщатися між уже зробленими ходами.

Збережемо масиви `squares` у іншому масиві і назвемо його `history`. Масив `history` відображає загальний стан ігрового поля,від першого до останнього ходу, і виглядає так:

```javascript
history = [
  // До першого ходу
  {
    squares: [
      null, null, null,
      null, null, null,
      null, null, null,
    ]
  },
  // Після першого ходу
  {
    squares: [
      null, null, null,
      null, 'X', null,
      null, null, null,
    ]
  },
  // Після другого ходу
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

Залишилось вирішити, який компонент відповідатиме за стан `history`.

### Піднімаємо стан, знову {#lifting-state-up-again}

Нам потрібно, щоб вищепоставлений компонент Game відображав список попередніх ходів. Для цього йому потрібно мати доступ до `history`, тож логічним буде помістити стан `history` у компоненті Game.

Розміщення `history` у компоненті Game дозволяє нам видалити стан `squares` з його дочірнього компонента Board. Так само, як ми ["підняли стан"](#lifting-state-up) з компонента Square у компонент Board, тепер ми піднімемо його з Board до вищепоставленого Game. Це надасть компоненту Game повний контроль над даними Board і дозволить вказувати, коли рендерити попередні ходи з `history`.

Спершу встановимо початковий стан у конструкторі компонента Game:

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

Після цього нам потрібно, щоб компонент Board отримував пропси `squares` та `onClick` з компонента Game. Оскільки тепер у Board ми маємо єдиний обробник події натиску для усіх Squares, нам досить передати розташування кожного Square в обробник `onClick`, щоб вказати яку клітинку було натиснуто. Щоб змінити компоент Board нам необхідно зробити наступні кроки:

* Видаліть `constructor` з Board.
* Замініть `this.state.squares[i]` на `this.props.squares[i]` у `renderSquare` компонента Board.
* Замініть `this.handleClick(i)` на `this.props.onClick(i)` у `renderSquare` компонента Board.

Компонент Board тепер має виглядати наступним чином:

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
      status = 'Переможець: ' + winner;
    } else {
      status = 'Наступний гравець: ' + (this.state.xIsNext ? 'X' : 'O');
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
Оновимо функцію `render` компонента Game, щоб скористатися останнім записом у історії для визначення і відображення статусу гри:

```javascript{2-11,16-19,22}
  render() {
    const history = this.state.history;
    const current = history[history.length - 1];
    const winner = calculateWinner(current.squares);

    let status;
    if (winner) {
      status = 'Переможець: ' + winner;
    } else {
      status = 'Наступний гравець: ' + (this.state.xIsNext ? 'X' : 'O');
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
Оскільки компонент Game тепер рендерить статус гри, ми можемо видалити відповідний код з методу `render` компонента Board. Після цих змін функція `render` у Board має виглядати так:

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

Наостанок нам потрібно перенести метод `handleClick` з компонента Board у компонент Game. Нам також потрібно змінити `handleClick`, оскільки стан компонента Game має іншу структуру. Усередині методу `handleClick` компонента Game додамо новий запис до `history`.

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

>Примітка
>
>На відміну від більш знайомого методу `push()`, метод `concat()` не змінює оригінального масиву, тому ми й надаємо йому перевагу.

На даний момент компоненту Board потрібні тільки `renderSquare` та `render` методи. Стан гри та метод `handleClick` мають знаходитись у компоненті Game.

**[Проглянути повний код цього кроку](https://codepen.io/gaearon/pen/EmmOqJ?editors=0010)**

### Показуємо попередні ходи {#showing-the-past-moves}

Оскільки ми записуємо історію гри у хрестики-нулики, то тепер, у вигляді списку попередніх ходів, ми можемо показати її гравцю.

Як ми вже довідались раніше, елементи React -- це поршокласні об'єкти JavaScript, які ми можемо передавати всередині нашого додатку. Щоб відрендерити численні об'єкти у React, ми можемо скористатися масивом React-елементів.

У JavaScript масиви мають [метод `map()`](https://developer.mozilla.org/uk/docs/Web/JavaScript/Reference/Global_Objects/Array/map), який зазвичай використовється для перетворення данних, наприклад:

```js
const numbers = [1, 2, 3];
const doubled = numbers.map(x => x * 2); // [2, 4, 6]
```

Використовуючи метод `map`, ми можемо відтворити історію ходів у вигляді React-елементів, репрезентованих кнопками на екрані, і відобразити їх у вигляді списку, щоб мати змогу "перескочити" до попередніх ходів.

Тож давайте застосуємо `map` до `history` у методі `render` компонента Game:

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

**[Проглянути повний код цього кроку](https://codepen.io/gaearon/pen/EmmGEa?editors=0010)**

Для кожного ходу в історії гри ми створюємо пункт списку `<li>` , який містить кнопку `<button>`. Кнопка має обробник `onClick`, який викликає метод `this.jumpTo()`. Ми ще не запровадили метод `jumpTo()`. На даний момент ми маємо бачити список ходів, зроблених під час гри, та попередження в інструментах розробника, що перекладається наступним чином:

>  Попередження:
>  Кожен дочірній компонент у масиві або ітераторі повинен мати унікальний проп "key". Перевірте метод render у "Game".

Давайте обговоримо, що значить це попередження.

### Обираємо ключ {#picking-a-key}

Коли ми рендеримо список, React зберігає певну інформацію про кожен відрендерений пункт списку. Якщо ми оновлюємо список, React має визначити, що у ньому змінилося. Ми могли б додати, видалити, пересунути або оновити список пунктів.

Уявимо зміни від 

```html
<li>Алекса: 7 задач залишилось</li>
<li>Бен: 5 задач залишилося</li>
```

до

```html
<li>Бен: 9 задач залишилось</li>
<li>Клавдія: 8 задач залишилось</li>
<li>Алекса: 5 задач залишилось</li>
```

На додачу до оновлених чисел, людина, що читатиме цей код, можливо, скаже, що ми поміняли Алексу і Бена місцями, а між ними додали Клавдію. Але React -- це комп'ютерна програма, яка не знає нашого наміру. І саме через це нам потрібно визначити властивість *key* для кожного пункту у списку, щоб мати змогу розрізнити їх одне від одного. Одним з варіантів можуть бути рядки `alexa`, `ben`, `claudia`. Або якщо ми беремо дані з бази даних, то у якості ключів ми могли б використати ідентифікатори Алекси, Бена та Клаудії.

```html
<li key={user.id}>{user.name}: {user.taskCount} tasks left</li>
```

Коли список рендериться повторно, React бере ключ у кожного пункту списку і перевіряє попередній список на наявність підходящого ключа. Якщо поточний список має ключ, який до цього не існував, React створює новий компонент. Якщо поточний список не має ключа, який існував у попередньому списку, React видаляє попередній компонент. Якщо два ключі співпадають, то відповідний компонент переміщається. Ключі вказують на ідентичність кожного компонента, що дозволяє React підтримувати стан між повторними рендерингами. Якщо ключ компонента змінюється, компонент буде видалено і створено з новим станом.

`key` -- це особлива зарезервована властивість React (разом з `ref`, більш передовою особливістю). Коли елемент створено, React видобуває властивість `key` і зберігає її безпосередньо у поверненому елементі. Хоча `key` і виглядає як `props`, на нього не можна посилатися використовуючи `this.props.key`. React автоматично використовує `key`, щоб визначити який компонент оновити. Компонент не має доступу до `key`.

**Ми наполегливо рекомендуємо призначати належні ключі при створенні динамічних списків.** Якщо у вас не має підходящого ключа, вам варто розглянути можливість перебудови даних, щоб він у вас з'явився.

Якщо жодного ключа не зазначено, React видасть попередження і за замовчуванням використовуватиме індекси масиву у ролі ключів. Використання індексів масиву може бути проблематичним при реорганізації списку або доданні/видаленні пунктів. Експліцітне створення `key={i}` змусить попередження зникнути, але матиме ті самі проблеми, що і використання індексів масиву, тому не рекомендується у більшості випадків.

Ключам не потрібно бути унікальними глобально, тільки між компонентами і їх родичами


### Втілюємо подорож у часі {#implementing-time-travel}

У історії гри в хрестики-нулики кожен попередній хід має унікальний, асоційований з ним ідентифікатор -- порядковий номер ходу. Ходи мають чітку послідовність і ніколи не видаляються чи додаються у середині списку, тож ми безпечно можемо виокристовувати індекси у ролі ключів.

У методі `render` компонента Game ми можемо додати ключ `<li key={move}>` і відповідне попередження від React має зникнути:

```js{6}
    const moves = history.map((step, move) => {
      const desc = move ?
        'Перейти до ходу #' + move :
        'Почати спочатку';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });
```

**[Прогляути повний код цього кроку](https://codepen.io/gaearon/pen/PmmXRE?editors=0010)**

Натиснення будь-якої з кнопок списку видасть помилку, оскільки метод `jumpTo` ще не визначено. Перед тим як створити цей метод, додамо `stepNumber` до стану компонента Game, щоб вказати який хід ми наразі розглядаємо.

Спершу додамо `stepNumber: 0` до початкового стану у `constructor` компонента Game:

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

Далі визначимо метод `jumpTo` у Game для оновлення `stepNumber`. Ми також визначимо значення `xIsNext` як true, якщо номер ходу, на який ми змінюємо `stepNumber`, парний:

```javascript{5-10}
  handleClick(i) {
    // цей метод не змінився
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    // цей метод не змінився
  }
```

Тепер внесемо деякі зміни до методу `handleClick` у Game, що спрацьовуватиме при кожному натиску на клітинки.

Стан `stepNumber`, який ми щойно додали, відображає хід, який користувач бачить на даний момент. Після кожного наступного ходу нам потрібно оновити `stepNumber` використовуючи `stepNumber: history.length` як частину аргументу `this.setState`. Це дозволить нам впевнитись, що ми не застрягнемо на тому самому місці, після того як новий хід буде зроблено.

Також замінимо `this.state.history` на `this.state.history.slice(0, this.state.stepNumber + 1)`. Це гарантує, що якщо ми повернемося "назад у часі" і зробимо наступний хід з того моменту, ми скинемо усю неактуальну "майбутню" історію.

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

Накінець, змінимо `render` метод компонента Game так, щоб той замість рендерингу останнього ходу рендерив хід обраний на даний момент відповідно до `stepNumber`:

```javascript{3}
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    // решта не змінилася
```

Якщо ми натиснемо на будь-який крок ігрової історії, поле мусить обновитися, демонструючи як воно виглядало після цього ходу.

**[Проглянути повний код цього кроку](https://codepen.io/gaearon/pen/gWWZgR?editors=0010)**

### Підіб'ємо підсумки {#wrapping-up}

Вітаємо! Ви щойно створили гру у хрестики-нулики яка:

* Дозволяє грати у хрестики-нулики,
* Визначає переможця,
* Зберігає історію гри,
* Дозволяє гравцеві проглянути історію і попередні модифікації ігрового поля.

Чудова робота! Ми сподіваємося, що тепер ви почуваєтеся впевненіше у роботі з React.

Продивитися фінальний результат ви можете за наступним посиланням: **[Завершена гра](https://codepen.io/gaearon/pen/gWWZgR?editors=0010)**.

Якщо ви маєте додатковий час або хочете попрактикувати нові навички в React, ось кілька ідей, які допоможуть покращити гру у хрестики-нулики. Ідеї розташовані за зростанням важкості:

1. Відобразіть позицію для кожного ходу у форматі (колонка, рядок) в списку історії ходів.
2. Виділіть вибраний елемент у спику ходів.
3. Перепишіть компонент Board, використовуючи цикли для створення квадратів, замість написання вручну.
4. Додайте кнопку, що дозволить сортувати ходи у висхідному чи низхідному порядку.
5. Коли хтось виграє, втсановити підсвічення трьох виграшних клітинок.
6. Якщо ніхто не виграє, відобразити повідомлення, що повідомляє про нічию.

Упродовж цього введення ми розглянули такі концепти React, як елементи, компоненти, пропси та стан. За більш детальною інформацією для кожної з цих тем зверніться до [решти документації](/docs/hello-world.html). Щоб дізнатися більше про визначення компонентів, зверніться до [`React.Component` у довіднику API](/docs/react-component.html).
