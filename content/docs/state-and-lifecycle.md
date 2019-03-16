---
id: state-and-lifecycle
title: Стан та життєвий цикл
permalink: docs/state-and-lifecycle.html
redirect_from:
  - "docs/interactivity-and-dynamic-uis.html"
prev: components-and-props.html
next: handling-events.html
---

На цій сторінці представлено поняття стану та життєвого циклу у React-компоненті. Ви можете знайти [детальньний API довідник на компонент тут](/docs/react-component.html).

Розглянемо приклад відліку годинника з [одного з попередніх розділів] (/ docs / rendering-elements.html # updating-the-rendered-element). 
В [Рендеринг елементів] (/ docs / rendering-elements.html # rendering-an-element-into-the-dom) ми дізналися лише один спосіб оновлення UI. Ми називаємо `ReactDOM.render ()`, щоб змінити відрендерний вивід інформації:

```js{8-11}
function tick() {
  const element = (
    <div>
      <h1>Hello, world!</h1>
      <h2>It is {new Date().toLocaleTimeString()}.</h2>
    </div>
  );
  ReactDOM.render(
    element,
    document.getElementById('root')
  );
}

setInterval(tick, 1000);
```

[**Try it on CodePen**](https://codepen.io/gaearon/pen/gwoJZk?editors=0010)

У цьому розділі ми дізнаємося, як зробити компонент 'Clock' дійсно багаторазовим та інкапсульованим. Компонент сам налаштує свій таймер та оновлюватиметься кожну секунду.

Ми можемо почати з того, як виглядає годинник:  

```js{3-6,12}
function Clock(props) {
  return (
    <div>
      <h1>Hello, world!</h1>
      <h2>It is {props.date.toLocaleTimeString()}.</h2>
    </div>
  );
}

function tick() {
  ReactDOM.render(
    <Clock date={new Date()} />,
    document.getElementById('root')
  );
}

setInterval(tick, 1000);
```

[**Спробуйте на CodePen**](https://codepen.io/gaearon/pen/dpdoYR?editors=0010)

Однак, це пропускає важливу вимогу: той факт, що "Clock" встановлює таймер і оновлює UI кожну секунду, має бути деталлю реалізації "Clock".

В ідеалі ми хочемо написати це один раз аби `Clock` оновлював себе сам:

```js{2}
ReactDOM.render(
  <Clock />,
  document.getElementById('root')
);
```

Аби це реалізувати, нам потрібно додати "state" до компонента 'Clock'.

Стан - подібний до пропсів, але він приватний і повністю контролюється компонентом.

Ми [згадували раніше](/docs/components-and-props.html#functional-and-class-components), що компоненти, визначені як класи, мають деякі додаткові функції. Внутрішній стан - це і є функція яка доступна тільки для класів.

## Перетворення функції на клас {#converting-a-function-to-a-class}

Ви можете перетворити функцію компоненту `Clock` на клас у п'ять кроків:

1. Створіть клас [ES6 class](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Classes) з тим же ім'ям, що продовжує `React.Component`.

2. Додайте до нього один порожній метод, який називається `render()`.

3. Перемістіть зміст функції в метод `render()`.

4. Замініть `props` на` this.props` в змісті `render()`.

Видаліть порожні оголошення функції які залишилися.
5. Видаліть порожні оголошення функції які залишилися.

```js
class Clock extends React.Component {
  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.props.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}
```

[**Спробуйте на CodePen**](https://codepen.io/gaearon/pen/zKRGpo?editors=0010)

`Clock` тепер визначається як клас, а не як функція.

Метод `render` буде викликатися кожного разу, коли відбуватиметься оновлення, але до тих пір, поки ми рендеремо `<Clock />` в той же вузол DOM, буде використано лише один екземпляр класу `Clock`. Це дозволяє нам використовувати додаткові функції, такі як методи внутрішнього стану та життєвого циклу.
 
## Додавання внутрішнього стану до класу {#adding-local-state-to-a-class}

Ми перемістимо `date` від пропсів до стану, в три етапи:

1) Замінити `this.props.date` на `this.state.date` у методі `render()`:

```js{6}
class Clock extends React.Component {
  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}
```

2) Додайте [class constructor](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Classes#Constructor), який призначає початковий `this.state`:

```js{4}
class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }

  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}
```

Зверніть увагу на те, як ми передаємо `props`(пропси) базовому конструктору:


```js{2}
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }
```
Компоненти класу повинні завжди викликати базовий конструктор з `props`.

3) Видалити елемент `date` з елемента `<Clock />`:

```js{2}
ReactDOM.render(
  <Clock />,
  document.getElementById('root')
);
```
Пізніше ми додамо код таймера назад до самого компонента.

Результат виглядає так:

```js{2-5,11,18}
class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }

  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}

ReactDOM.render(
  <Clock />,
  document.getElementById('root')
);
```

[**Спробуйте на CodePen**](https://codepen.io/gaearon/pen/KgQpJd?editors=0010)

Далі, ми зробимо так аби `Clock` сам налаштувати свій таймер і оновлювався себе кожну секунду.

## Додавання методів життєвого циклу до класу {#adding-lifecycle-methods-to-a-class}

У додатках з багатьма компонентами дуже важливо вивільнити ресурси, що вилучаються компонентами, коли вони знищуються.

Ми хочемо [налаштувати таймер](https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/setInterval) всякий раз, коли `Clock` буде передано DOM вперше. Це називається "монтаж" в React.

Ми також хочемо [оновити цей таймер](https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/clearInterval), коли DOM видаляється. Це називається "розмотування" в React.

Ми можемо оголосити спеціальні методи на класі компонентів для запуску деякого коду, коли компонент монтується і розмотується:

```js{7-9,11-13}
class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}
```

Ці методи називаються "методами життєвого циклу".

Метод `componentDidMount()` виконується після того, як компонентний вивід був переданий DOM. Це гарне місце для налаштування таймера:

```js{2-5}
  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  }
```

Note how we save the timer ID right on `this`.

While `this.props` is set up by React itself and `this.state` has a special meaning, you are free to add additional fields to the class manually if you need to store something that doesn’t participate in the data flow (like a timer ID).

We will tear down the timer in the `componentWillUnmount()` lifecycle method:

```js{2}
  componentWillUnmount() {
    clearInterval(this.timerID);
  }
```

Finally, we will implement a method called `tick()` that the `Clock` component will run every second.

It will use `this.setState()` to schedule updates to the component local state:

```js{18-22}
class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }

  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    this.setState({
      date: new Date()
    });
  }

  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}

ReactDOM.render(
  <Clock />,
  document.getElementById('root')
);
```

[**Спробуйте на CodePen**](https://codepen.io/gaearon/pen/amqdNA?editors=0010)

Now the clock ticks every second.

Let's quickly recap what's going on and the order in which the methods are called:

1) When `<Clock />` is passed to `ReactDOM.render()`, React calls the constructor of the `Clock` component. Since `Clock` needs to display the current time, it initializes `this.state` with an object including the current time. We will later update this state.

2) React then calls the `Clock` component's `render()` method. This is how React learns what should be displayed on the screen. React then updates the DOM to match the `Clock`'s render output.

3) When the `Clock` output is inserted in the DOM, React calls the `componentDidMount()` lifecycle method. Inside it, the `Clock` component asks the browser to set up a timer to call the component's `tick()` method once a second.

4) Every second the browser calls the `tick()` method. Inside it, the `Clock` component schedules a UI update by calling `setState()` with an object containing the current time. Thanks to the `setState()` call, React knows the state has changed, and calls the `render()` method again to learn what should be on the screen. This time, `this.state.date` in the `render()` method will be different, and so the render output will include the updated time. React updates the DOM accordingly.

5) If the `Clock` component is ever removed from the DOM, React calls the `componentWillUnmount()` lifecycle method so the timer is stopped.

## Using State Correctly {#using-state-correctly}

There are three things you should know about `setState()`.

### Do Not Modify State Directly {#do-not-modify-state-directly}

For example, this will not re-render a component:

```js
// Wrong
this.state.comment = 'Hello';
```

Instead, use `setState()`:

```js
// Correct
this.setState({comment: 'Hello'});
```

The only place where you can assign `this.state` is the constructor.

### State Updates May Be Asynchronous {#state-updates-may-be-asynchronous}

React may batch multiple `setState()` calls into a single update for performance.

Because `this.props` and `this.state` may be updated asynchronously, you should not rely on their values for calculating the next state.

For example, this code may fail to update the counter:

```js
// Wrong
this.setState({
  counter: this.state.counter + this.props.increment,
});
```

To fix it, use a second form of `setState()` that accepts a function rather than an object. That function will receive the previous state as the first argument, and the props at the time the update is applied as the second argument:

```js
// Correct
this.setState((state, props) => ({
  counter: state.counter + props.increment
}));
```

We used an [arrow function](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Functions/Arrow_functions) above, but it also works with regular functions:

```js
// Correct
this.setState(function(state, props) {
  return {
    counter: state.counter + props.increment
  };
});
```

### State Updates are Merged {#state-updates-are-merged}

When you call `setState()`, React merges the object you provide into the current state.

For example, your state may contain several independent variables:

```js{4,5}
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      comments: []
    };
  }
```

Then you can update them independently with separate `setState()` calls:

```js{4,10}
  componentDidMount() {
    fetchPosts().then(response => {
      this.setState({
        posts: response.posts
      });
    });

    fetchComments().then(response => {
      this.setState({
        comments: response.comments
      });
    });
  }
```

The merging is shallow, so `this.setState({comments})` leaves `this.state.posts` intact, but completely replaces `this.state.comments`.

## The Data Flows Down {#the-data-flows-down}

Neither parent nor child components can know if a certain component is stateful or stateless, and they shouldn't care whether it is defined as a function or a class.

This is why state is often called local or encapsulated. It is not accessible to any component other than the one that owns and sets it.

A component may choose to pass its state down as props to its child components:

```js
<h2>It is {this.state.date.toLocaleTimeString()}.</h2>
```

This also works for user-defined components:

```js
<FormattedDate date={this.state.date} />
```

The `FormattedDate` component would receive the `date` in its props and wouldn't know whether it came from the `Clock`'s state, from the `Clock`'s props, or was typed by hand:

```js
function FormattedDate(props) {
  return <h2>It is {props.date.toLocaleTimeString()}.</h2>;
}
```

[**Спробуйте на CodePen**](https://codepen.io/gaearon/pen/zKRqNB?editors=0010)

This is commonly called a "top-down" or "unidirectional" data flow. Any state is always owned by some specific component, and any data or UI derived from that state can only affect components "below" them in the tree.

If you imagine a component tree as a waterfall of props, each component's state is like an additional water source that joins it at an arbitrary point but also flows down.

To show that all components are truly isolated, we can create an `App` component that renders three `<Clock>`s:

```js{4-6}
function App() {
  return (
    <div>
      <Clock />
      <Clock />
      <Clock />
    </div>
  );
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
```

[**Спробуйте на CodePen**](https://codepen.io/gaearon/pen/vXdGmd?editors=0010)

Each `Clock` sets up its own timer and updates independently.

In React apps, whether a component is stateful or stateless is considered an implementation detail of the component that may change over time. You can use stateless components inside stateful components, and vice versa.
