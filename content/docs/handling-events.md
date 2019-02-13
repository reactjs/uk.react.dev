---
id: handling-events
title: Обробка подій
permalink: docs/handling-events.html
prev: state-and-lifecycle.html
next: conditional-rendering.html
redirect_from:
  - "docs/events-ko-KR.html"
---

Обробка подій для React-елементів дуже схожа до обробки подій для DOM-елементів. Але є деякі синтаксичні відмінності:
* Події React іменуються в camelCase, а не в нижньому регістрі.
* З JSX ви передаєте функцію як обробник події замість рядка.

Наприклад, HTML:

```html
<button onclick="activateLasers()">
  Активувати лазери
</button>
```

дещо відрізняється в React:

```js{1}
<button onClick={activateLasers}>
  Активувати лазери
</button>
```

Інша відмінність полягає в тому, що ви не можете повернути `false` для того, щоб запобігти поведінці за замовчуванням в React. Ви маєте явно викликати `preventDefault`. Наприклад, для звичайного HTML, щоб запобігти поведінці посилання за замовчуванням (відкриття нової сторінки) ви можете написати:

```html
<a href="#" onclick="console.log('The link was clicked.'); return false">
  Click me
</a>
```

В React це може виглядати так:

```js{2-5,8}
function ActionLink() {
  function handleClick(e) {
    e.preventDefault();
    console.log('Посилання було натиснуте.');
  }

  return (
    <a href="#" onClick={handleClick}>
      Натисни на мене
    </a>
  );
}
```

Тут `e` - це синтетична подія. React визначає ці синтетичні події відповідно до [специфікації W3C](https://www.w3.org/TR/DOM-Level-3-Events/), тому вам не потрібно турбуватися про сумісніть між браузерами. Перегляньте довідник по [`SyntheticEvent`](/docs/events.html), щоб дізнатися більше.

Зазвичай, коли ви використовуєте React, вам не потрібно викликати `addEventListener`, щоб додати обробник до DOM-елементу після його створення. Натомість, просто вкажіть обробник, коли елемент вперше відрендерився.

Коли ви визначаєте компонент як [клас ES6](https://developer.mozilla.org/uk/docs/Web/JavaScript/Reference/Classes), поширеною практикою є оголошення обробника подій як методу цього класу. Наприклад, цей `Toggle` компонент рендерить кнопку, котра дозволяє користувачу перемикатись між станами "ON" і "OFF":

```js{6,7,10-14,18}
class Toggle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {isToggleOn: true};

    // Ця прив'язка необхідна, щоб `this` працював у функції зворотнього виклику
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState(state => ({
      isToggleOn: !state.isToggleOn
    }));
  }

  render() {
    return (
      <button onClick={this.handleClick}>
        {this.state.isToggleOn ? 'ON' : 'OFF'}
      </button>
    );
  }
}

ReactDOM.render(
  <Toggle />,
  document.getElementById('root')
);
```

[**Спробуйте на CodePen**](http://codepen.io/gaearon/pen/xEmzGg?editors=0010)

Ви маєте бути обережним із значенням `this` в JSX функціях зворотнього виклику. В JavaScript класові методи за замовчуванням не [зв'язані](https://developer.mozilla.org/uk/docs/Web/JavaScript/Reference/Global_objects/Function/bind). Якщо ви забудете зв'язати `this.handleClick` і передати її в `onClick`, `this` буде `undefined` під час виклику функції.

Така поведінка не є особливою лише для React - вона є частиною того, [як функції працюють в JavaScript](https://www.smashingmagazine.com/2014/01/understanding-javascript-function-prototype-bind/). В загальному випадку, якщо ви посилаєтесь на метод без `()` після нього, як наприклад `onClick={this.handleClick}`, ви маєте зв'язати цей метод.

Якщо виклики `bind` дратують вас - є два шляхи обійти їх. Якщо ви використовуєте експериментальний [синтаксих відкритих полей класу](https://babeljs.io/docs/plugins/transform-class-properties/), то ви можете використовувати поля класу, щоб правильно прив'язатувати функції зворотнього виклику:

```js{2-6}
class LoggingButton extends React.Component {
  // Цей синтаксис забезпечує прив'язку `this` всередині handleClick.
  // Попередження: це *експериментальний* синтаксис.
  handleClick = () => {
    console.log('this це:', this);
  }

  render() {
    return (
      <button onClick={this.handleClick}>
        Натисни на мене
      </button>
    );
  }
}
```

За замовчуванням, цей синтаксис увімкнено для [Create React App](https://github.com/facebookincubator/create-react-app).

Якщо ви не використовуєте синтаксис полей класу, ви можете використати [стрілкову функцію](https://developer.mozilla.org/uk/docs/Web/JavaScript/Reference/Functions/Arrow_functions) в функції зворотнього виклику:

```js{7-9}
class LoggingButton extends React.Component {
  handleClick() {
    console.log('this це:', this);
  }

  render() {
    // Цей синтаксис забезпечує прив'язку `this` всередині handleClick.
    return (
      <button onClick={(e) => this.handleClick(e)}>
        Натисни на мене
      </button>
    );
  }
}
```

Проблема цього синтаксису полягає в тому, що при кожному рендері `LoggingButton` створюється щоразу нова функція зворотнього виклику. В більшості випадків це не створює додаткових проблем. Але, якщо ця функція зворотнього виклику передається в якості проп в компоненти нижче - вони можуть здійснити додатковий ререндеринг. Як правило, ми рекомендуємо зв'язувати в конструкторі або використувати синтаксис полей класу, щоб уникнути подібних проблем з продуктивністю.

## Передача аргументів у обробники подій {#passing-arguments-to-event-handlers}

Всередині циклу доволі часто потрібно передати додатковий параметр в обробник події. Наприклад, якщо `id` це ID рядка, можна застосувати один з нижченаведених прикладів:

```js
<button onClick={(e) => this.deleteRow(id, e)}>Видалити рядок</button>
<button onClick={this.deleteRow.bind(this, id)}>Видалити рядок</button>
```

Обидва приклади є еквівалентними і використовують [стрілкові функції](https://developer.mozilla.org/uk/docs/Web/JavaScript/Reference/Functions/Arrow_functions) та [`Function.prototype.bind`](https://developer.mozilla.org/uk/docs/Web/JavaScript/Reference/Global_objects/Function/bind) відповідно.

В обох випадках аргумент `e`, який відповідає події React, буде переданий другим аргументом після ID. Для стрілкової функції ми маємо зробити передачу явною, але для `bind` будь-які наступні аргументи будуть передані автоматично.
