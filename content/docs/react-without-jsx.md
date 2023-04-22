---
id: react-without-jsx
title: React без JSX
permalink: docs/react-without-jsx.html
---

<div class="scary">

> These docs are old and won't be updated. Go to [react.dev](https://react.dev/) for the new React docs.

</div>

JSX не є вимогою для роботи з React. Використання React без JSX є найзручнішим тоді, коли ви не бажаєте налаштовувати компіляцію у вашому середовищі збірки.

Кожен JSX-елемент являє собою "синтаксичний цукор" для виклику `React.createElement(component, props, ...children)`. Отже, все що можна зробити за допомогою JSX, може також бути виконаним на чистому JavaScript.

Наприклад, ось код на JSX:

```js
class Hello extends React.Component {
  render() {
    return <div>Привіт,  {this.props.toWhat}</div>;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Hello toWhat="світе" />);
```

Його можна переписати таким чином, що JSX не буде використовуватися:

```js
class Hello extends React.Component {
  render() {
    return React.createElement('div', null, `Привіт, ${this.props.toWhat}`);
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(Hello, {toWhat: 'світе'}, null));
```

Якщо ви зацікавлені в інших прикладах того, як JSX компілюється в JavaScript-код, спробуйте [онлайн Babel-компілятор](babel://jsx-simple-example).

Компонент може бути представлений у вигляді рядку, як підклас `React.Component` або у вигляді звичайної функції.

Якщо вас втомлює написання `React.createElement`, поширеною практикою є призначення "скорочення":

```js
const e = React.createElement;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(e('div', null, 'Привіт, світе'));
```

Якщо ви використаєте дане скорочення для `React.createElement`, то робота з React без JSX буде такою ж зручною.

Також ви можете ознайомитися з іншими проектами, як [`react-hyperscript`](https://github.com/mlmorg/react-hyperscript) і [`hyperscript-helpers`](https://github.com/ohanhi/hyperscript-helpers), які пропонують більш короткий синтаксис.

