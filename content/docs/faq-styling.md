---
id: faq-styling
title: Styling and CSS
permalink: docs/faq-styling.html
layout: docs
category: FAQ
---

### Як додавати CSS класи до компонентів? {#how-do-i-add-css-classes-to-components}

Передайте рядок як проп `className`:

```jsx
render() {
  return <span className="menu navigation-menu">Меню</span>
}
```

Класи зазвичай залежать від пропсів та стану компоненту:

```jsx
render() {
  let className = 'menu';
  if (this.props.isActive) {
    className += ' menu-active';
  }
  return <span className={className}>Меню</span>
}
```

>Порада
>
>Якщо ви часто пишете такий код, пакунок [classnames](https://www.npmjs.com/package/classnames#usage-with-reactjs)
може спростити його.

### Чи можу я використовувати inline стилі? {#can-i-use-inline-styles}

Так, дивіться [документ](/docs/dom-elements.html#style) щодо стилізування .

### Чи є inline стилі поганою практикою? {#are-inline-styles-bad}

Зазвичай CSS класи кращі за продуктивністю ніж inline стилі.

### Що таке CSS-in-JS? {#what-is-css-in-js}

"CSS-in-JS" відносяться до патерну, де CSS описується з використанням JavaScript замість описування у зовнішніх файлах.

_Зауважте, що цей функціонал не є частиною React, але надається сторонніми бібліотеками._ React не має чіткої точки зору стосовно визначення стилів; якщо ви маєте сумнів, гарним початком може бути визначення ваших стилів в окремому `*.css` файлі з посиланням на них використовуючи [`className`](/docs/dom-elements.html#classname).

### Чи можу я робити анімації в React? {#can-i-do-animations-in-react}

<<<<<<< HEAD
React може використовуватися для роботи з анімаціями. Для прикладів, дивіться [React Transition Group](https://reactcommunity.org/react-transition-group/) та [React Spring](https://github.com/react-spring/react-spring).
=======
React can be used to power animations. See [React Transition Group](https://reactcommunity.org/react-transition-group/), [React Motion](https://github.com/chenglou/react-motion), [React Spring](https://github.com/react-spring/react-spring), or [Framer Motion](https://framer.com/motion), for example.
>>>>>>> 1d21630e126af0f4c04ff392934dcee80fc54892
