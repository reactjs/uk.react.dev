---
id: react-without-es6
title: React без ES6
permalink: docs/react-without-es6.html
---

Зазвичай, ви б оголосили React-компонент у вигляді JavaScript-класу:

```javascript
class Greeting extends React.Component {
  render() {
    return <h1>Привіт, {this.props.name}</h1>;
  }
}
```

Якщо ви досі не використовуєте ES6, ви можете використати пакет `create-react-class`:


```javascript
var createReactClass = require('create-react-class');
var Greeting = createReactClass({
  render: function() {
    return <h1>Привіт, {this.props.name}</h1>;
  }
});
```

API ES6-класів схожий до `createReactClass()` за деякими виключеннями.

## Оголошення властивостей компонента {#declaring-default-props}

За допомогою функцій та класів ES6 `defaultProps` оголошуються як властивість самого компонента:

```javascript
class Greeting extends React.Component {
  // ...
}

Greeting.defaultProps = {
  name: 'Марія'
};
```

Використовуючи `createReactClass()`, вам необхідно визначити метод `getDefaultProps()` як функцію в переданому об'єкті:

```javascript
var Greeting = createReactClass({
  getDefaultProps: function() {
    return {
      name: 'Марія'
    };
  },

  // ...

});
```

## Встановлення початкового стану компонента {#setting-the-initial-state}

Використовуючи ES6-класи, ви можете визначити початковий стан через `this.state` у конструкторі:

```javascript
class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {count: props.initialCount};
  }
  // ...
}
```

З `createReactClass()` ви маєте створити окремий метод `getInitialState`, який поверне початковий стан:

```javascript
var Counter = createReactClass({
  getInitialState: function() {
    return {count: this.props.initialCount};
  },
  // ...
});
```

## Автоприв'язка {#autobinding}

У React-компонентах оголошених як ES6-класи, методи дотримуються такої ж семантики, як і звичайні ES6-класи. Це означає, що вони не виконують прив'язку `this` до екземпляру компонента автоматично. Вам необхідно буде явно використати `.bind(this)` у конструкторі:

```javascript
class SayHello extends React.Component {
  constructor(props) {
    super(props);
    this.state = {message: 'Привіт!'};
    // Цей рядок -- дуже важливий!
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    alert(this.state.message);
  }

  render() {
    // Оскільки `this.handleClick` є прив'язаним у конструкторі екземпляра, то ми можемо його використати як обробник події.
    return (
      <button onClick={this.handleClick}>
        Скажи "привіт"
      </button>
    );
  }
}
```

З використанням `createReactClass()` це необов'язково, оскільки цей метод прив'язує всі методи до екземпляра компонента:

```javascript
var SayHello = createReactClass({
  getInitialState: function() {
    return {message: 'Привіт!'};
  },

  handleClick: function() {
    alert(this.state.message);
  },

  render: function() {
    return (
      <button onClick={this.handleClick}>
        Скажи "привіт"
      </button>
    );
  }
});
```

Це означає, що ES6-класи пишуться із трохи більш універсальним кодом для обробників подій, але при цьому продуктивність величезних додатків є трохи вищою.

Якщо універсальний код для вас не занадто привабливий, ви можете увімкнути **експериментальну** пропозицію синтаксису [Class Properties](https://babeljs.io/docs/plugins/transform-class-properties/) з Babel:


```javascript
class SayHello extends React.Component {
  constructor(props) {
    super(props);
    this.state = {message: 'Привіт!'};
  }
  // УВАГА: цей синтаксис є експериментальним!
  // Тут стрілкова функція виконує прив'язку:
  handleClick = () => {
    alert(this.state.message);
  }

  render() {
    return (
      <button onClick={this.handleClick}>
        Скажи "привіт"
      </button>
    );
  }
}
```

Зверніть увагу, що синтаксис, описаний вище, є **експериментальним** і він може змінитися, або пропозиція не буде внесена в стандарт мови.

Якщо ви за безпечний варіант, то ось ще варіанти:

* Прив'язуйте методи в конструкторі.
* Використовуйте стрілкові функції, наприклад, `onClick={(e) => this.handleClick(e)}`.
* Використовуйте `createReactClass` і далі.

## Міксини {#mixins}

>**Примітка:**
>
>ES6 був випущений без підтримки міксинів. Тому немає ніякої підтримки міксинів, коли ви використовуєте React з ES6-класами.
>
>**Ми також знайшли безліч проблем у кодових базах, що використовують міксини, [і не рекомендуємо використовувати їх у розробці](/blog/2016/07/13/mixins-considered-harmful.html).**
>
>Цей розділ існує тільки для довідки.

Інколи дуже різні компоненти можуть мати спільну функціональність. Вони інколи називаються [наскрізна відповідальність](https://uk.wikipedia.org/wiki/Cross-cutting_concern). `createReactClass` дозволяє вам використовувати застарілу систему `mixins`.

Одним із поширених варіантів використання **є** компонент, який бажає оновити себе через деякий проміжок часу. Можна просто використовувати `setInterval()`, але важливо скасувати даний процес, коли вам він не потрібен та для економії пам'яті. React надає [методи життєвого циклу](/docs/react-component.html#the-component-lifecycle), які дозволяють дізнатися, коли компонент буде створений або знищений. Давайте створимо простий міксин, який використовує дані методи для простої функції `setInterval()`, яка автоматично "прибере за собою", коли компонент буде знищений.

```javascript
var SetIntervalMixin = {
  componentWillMount: function() {
    this.intervals = [];
  },
  setInterval: function() {
    this.intervals.push(setInterval.apply(null, arguments));
  },
  componentWillUnmount: function() {
    this.intervals.forEach(clearInterval);
  }
};

var createReactClass = require('create-react-class');

var TickTock = createReactClass({
  mixins: [SetIntervalMixin], // Використовуємо міксин
  getInitialState: function() {
    return {seconds: 0};
  },
  componentDidMount: function() {
    this.setInterval(this.tick, 1000); // Викликаємо метод на міксині
  },
  tick: function() {
    this.setState({seconds: this.state.seconds + 1});
  },
  render: function() {
    return (
      <p>
        React працював {this.state.seconds} секунд.
      </p>
    );
  }
});

ReactDOM.render(
  <TickTock />,
  document.getElementById('example')
);
```

Якщо компонент використовує декілька міксинів і вони визначають одинакові методи життєвого циклу (наприклад, декілька міксинів хочуть виконати очистку коли компонент буде знищеним), всі методи життєвого циклу будуть гарантовано викликані. Методи, визначені на міксинах, запускаються в порядку перерахування міксинів після виклику методу на компоненті.
