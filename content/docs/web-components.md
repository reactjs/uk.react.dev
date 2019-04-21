---
id: web-components
title: Веб-компоненти
permalink: docs/web-components.html
redirect_from:
  - "docs/webcomponents.html"
---

React та [веб-компоненти](https://developer.mozilla.org/en-US/docs/Web/Web_Components) створені для вирішення різних проблем.  Веб-компоненти забезпечують надійну інкапсуляцію для повторно використовуваних компонентів, в той час як React надає декларативну бібліотеку для синхронізації даних з DOM. Дві цілі доповнюють одна одну. Як розробник, ви можете використовувати React у своїх веб-компонентах, або використовувати веб-компоненти у React, або і те, і інше.

Більшість React-розробників не використовують веб-компоненти, але у вас може з'явитися бажання спробувати їх. Наприклад, якщо ваш проект використовує сторонні UI-компоненти, написані за допомогою веб-компонентів.

## Використання веб-компонентів у React {#using-web-components-in-react}

```javascript
class HelloMessage extends React.Component {
  render() {
    return <div>Привіт <x-search>{this.props.name}</x-search>!</div>;
  }
}
```

> Примітка:
>
> Веб-компоненти часто надають імперативний API. Наприклад, `video` веб-компонент може надавати функції play() і pause(). Щоб отримати доступ до необхідних API-інтерфейсів веб-компонентів, необхідно використовувати реф для взаємодії з DOM-вузлом безпосередньо. Якщо ви використовуєте сторонні веб-компоненти, то ви зможете створити React-компонент і використовувати його як веб-компонент.
>
> Події, створені веб-компонентами, можуть неправильно поширюватися через дерево React-компонентів. 
> Вам потрібно вручну додати обробники для таких подій у власні React-компоненти.

Одна з поширених помилок — це те, що у веб-компонентах використовується "class" замість "className".

```javascript
function BrickFlipbox() {
  return (
    <brick-flipbox class="demo">
      <div>front</div>
      <div>back</div>
    </brick-flipbox>
  );
}
```

## Використання React у ваших веб-компонентах {#using-react-in-your-web-components}

```javascript
class XSearch extends HTMLElement {
  connectedCallback() {
    const mountPoint = document.createElement('span');
    this.attachShadow({ mode: 'open' }).appendChild(mountPoint);

    const name = this.getAttribute('name');
    const url = 'https://www.google.com/search?q=' + encodeURIComponent(name);
    ReactDOM.render(<a href={url}>{name}</a>, mountPoint);
  }
}
customElements.define('x-search', XSearch);
```

>Примітка:
>
>Цей код **не буде** працювати, якщо ви перетворюєте класи за допомогою Babel. Див. [це питання](https://github.com/w3c/webcomponents/issues/587) з обговоренням.
>Додайте [custom-elements-es5-adapter](https://github.com/webcomponents/webcomponentsjs#custom-elements-es5-adapterjs) перед завантаженням веб-компонентів, щоб вирішити цю проблему.
