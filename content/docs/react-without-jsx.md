---
id: react-without-jsx
title: React без JSX
permalink: docs/react-without-jsx.html
---

JSX не є вимогою для роботи з React. Використання React без JSX є найзручнішим тоді, коли ви не бажаєте налаштовувати компіляцію у вашому середовищі збірки.

Кожен JSX-елемент являє собою "синтаксичний цукор" для виклику `React.createElement(component, props, ...children)`. Отже, все що можна зробити за допомогою JSX, може також бути виконаним на чистому JavaScript.

Наприклад, ось код на JSX:

```js
class Hello extends React.Component {
  render() {
    return <div>Привіт,  {this.props.toWhat}</div>;
  }
}

<<<<<<< HEAD
ReactDOM.render(
  <Hello toWhat="світе" />,
  document.getElementById('root')
);
=======
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Hello toWhat="World" />);
>>>>>>> d483aebbac6d3c8f059b52abf21240bc91d0b96e
```

Його можна переписати таким чином, що JSX не буде використовуватися:

```js
class Hello extends React.Component {
  render() {
    return React.createElement('div', null, `Привіт, ${this.props.toWhat}`);
  }
}

<<<<<<< HEAD
ReactDOM.render(
  React.createElement(Hello, {toWhat: 'світе'}, null),
  document.getElementById('root')
);
=======
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(Hello, {toWhat: 'World'}, null));
>>>>>>> d483aebbac6d3c8f059b52abf21240bc91d0b96e
```

Якщо ви зацікавлені в інших прикладах того, як JSX компілюється в JavaScript-код, спробуйте [онлайн Babel-компілятор](babel://jsx-simple-example).

Компонент може бути представлений у вигляді рядку, як підклас `React.Component` або у вигляді звичайної функції.

Якщо вас втомлює написання `React.createElement`, поширеною практикою є призначення "скорочення":

```js
const e = React.createElement;

<<<<<<< HEAD
ReactDOM.render(
  e('div', null, 'Привіт, світе'),
  document.getElementById('root')
);
=======
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(e('div', null, 'Hello World'));
>>>>>>> d483aebbac6d3c8f059b52abf21240bc91d0b96e
```

Якщо ви використаєте дане скорочення для `React.createElement`, то робота з React без JSX буде такою ж зручною.

Також ви можете ознайомитися з іншими проектами, як [`react-hyperscript`](https://github.com/mlmorg/react-hyperscript) і [`hyperscript-helpers`](https://github.com/ohanhi/hyperscript-helpers), які пропонують більш короткий синтаксис.

