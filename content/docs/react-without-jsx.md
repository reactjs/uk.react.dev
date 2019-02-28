---
id: react-without-jsx
title: React без JSX
permalink: docs/react-without-jsx.html
---

JSX не є вимогою для роботи з React. Використання React без JSX є найбільш зручним коли ви не бажаєте налаштовувати компіляцію в вашому середовищі збірки.

Кожен JSX-елемент являє собой "синтаксичний цукор" для виклику `React.createElement(component, props, ...children)`. Отже, все що ви можете зробити з JSX, може також бути виконаним на чистому JavaScript.

Наприклад, ось код на JSX:

```js
class Hello extends React.Component {
  render() {
    return <div>Hello {this.props.toWhat}</div>;
  }
}

ReactDOM.render(
  <Hello toWhat="World" />,
  document.getElementById('root')
);
```

Його можна так переписати, щоб не використовувати його:

```js
class Hello extends React.Component {
  render() {
    return React.createElement('div', null, `Hello ${this.props.toWhat}`);
  }
}

ReactDOM.render(
  React.createElement(Hello, {toWhat: 'World'}, null),
  document.getElementById('root')
);
```

Якщо ви зацікавлені в інших прикладах того, як JSX компілюєтья в JavaScript-код, спробуйте [онлайн Babel-компілятор](babel://jsx-simple-example).

Компонент може бути представлений в виді рядку, як класс-спадкоємець `React.Component` або в виді звичайної функції для компонентів без стану.

Якщо вас утомлює печатання `React.createElement`, то поширеною практикою є створення "скорочення":

```js
const e = React.createElement;

ReactDOM.render(
  e('div', null, 'Hello World'),
  document.getElementById('root')
);
```

Якщо ви використаєте дане скорочення для `React.createElement`, то робота з React без JSX буде такою ж зручною.

Також, ви можете ознайомитися з іншими проектами, як [`react-hyperscript`](https://github.com/mlmorg/react-hyperscript) і [`hyperscript-helpers`](https://github.com/ohanhi/hyperscript-helpers), які пропонують більш короткий синтаксис.

