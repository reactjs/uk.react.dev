---
id: portals
title: Портали
permalink: docs/portals.html
---

Портали дозволяють рендерити дочірні елементи в DOM-вузол, який знаходиться поза DOM-ієрархії батьківського компонента.

```js
ReactDOM.createPortal(child, container)
```

Перший аргумент (`child`) — це [будь-який React-компонент, який може бути відрендерен](/docs/react-component.html#render), такий як елемент, строка або фрагмент. Другий аргумент (`container`) — це DOM-елемент.

## Застосування {#usage}

Зазвичай, коли ви повертаєте елемент з рендер-методу компонента, він монтується в DOM як дочірній елемент найближчого батьківського вузла:

```js{4,6}
render() {
  // React монтує новий div і рендерить в нього дочірні елементи
  return (
    <div>
      {this.props.children}
    </div>
  );
}
```

Однак іноді потрібно помістити дочірній елемент в інше місце в DOM:

```js{6}
render() {
  // React *не* створює новий div. Він рендерить дочірні елементи в `domNode`.
  // `domNode` — це будь-який валідний DOM-вузол, що знаходиться в будь-якому місці в DOM.
  return ReactDOM.createPortal(
    this.props.children,
    domNode
  );
}
```

Типовий випадок застосування порталів — коли в батьківському компоненті задані стилі `overflow: hidden` або `z-index`, але вам потрібно щоб дочірній елемент візуально виходив за рамки свого контейнера. Наприклад, діалоги, спливаючі картки та спливаючі підказки.

> Примітка:
>
> При роботі з порталами, пам'ятайте, що потрібно приділити увагу [управлінню фокусом за допомогою клавіатури](/docs/accessibility.html#programmatically-managing-focus).
>
> Для модальних діалогів, переконайтеся, що будь-який користувач буде здатний взаємодіяти з ними, слідуючи  [практикам розробки модальних вікон WAI-ARIA](https://www.w3.org/TR/wai-aria-practices-1.1/#dialog_modal).

[**Спробувати на CodePen**](https://codepen.io/gaearon/pen/yzMaBd)

## Спливання подій через портали {#event-bubbling-through-portals}

Як вже було сказано, портал може перебувати в будь-якому місці DOM-дерева. Незважаючи на це, у всіх інших аспектах він поводиться як звичайний React-компонент. Такі можливості, як контекст, працюють звичним чином, навіть якщо нащадок є порталом, оскільки сам портал все ще знаходиться в *React-дереві*, незважаючи на його розташування в *DOM-дереві*.

Так само працює і спливання подій. Подія, сгенерована зсередини порталу, буде поширюватися до батьків, що містять *React-дерево*, навіть якщо ці елементи не є батьківськими в *DOM-дереві*. Представимо таку HTML-структуру:

```html
<html>
  <body>
    <div id="app-root"></div>
    <div id="modal-root"></div>
  </body>
</html>
```

`Батьківський ` компонент в `#app-root` зможе зловити неперехвачену спливаючу подію з сусіднього вузла `#modal-root`.

```js{28-31,42-49,53,61-63,70-71,74}
// Це два сусідніх контейнера в DOM
const appRoot = document.getElementById('app-root');
const modalRoot = document.getElementById('modal-root');

class Modal extends React.Component {
  constructor(props) {
    super(props);
    this.el = document.createElement('div');
  }

  componentDidMount() {
    // Елемент порталу додається в DOM-дерево після того, як
    // дочірні компоненти Modal будуть змонтовані, це означає,
    // що дочірні компоненти будуть монтуватися на окремому DOM-вузлі.
    // Якщо дочірній компонент повинен бути приєднаний до DOM-дерева
    // відразу при підключенні, наприклад, для вимірювань DOM-вузла
    // або виклику в дочірньому елементі 'autoFocus', додайте в компонент Modal
    // стан і рендеріть дочірні елементи тільки тоді, коли
    // компонент Modal вже вставлений в DOM-дерево.
    modalRoot.appendChild(this.el);
  }

  componentWillUnmount() {
    modalRoot.removeChild(this.el);
  }

  render() {
    return ReactDOM.createPortal(
      this.props.children,
      this.el,
    );
  }
}

class Parent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {clicks: 0};
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    // Ця функція буде викликана при кліку по кнопці в компоненті Child,
    // оновлюючи стан компонента Parent, незважаючи на те,
    // що кнопка не є прямим нащадком в DOM.
    this.setState(state => ({
      clicks: state.clicks + 1
    }));
  }

  render() {
    return (
      <div onClick={this.handleClick}>
        <p>Кількість кліків: {this.state.clicks}</p>
        <p>
          Відкрийте DevTools браузера,
          щоб переконатися, що кнопка
          не є нащадком блоку div
          з обробником onClick.
        </p>
        <Modal>
          <Child />
        </Modal>
      </div>
    );
  }
}

function Child() {
  // Подія кліка по цій кнопці буде спливати вгору до батьківського елемента,
  // тому що не визначено атрибут "onClick"
  return (
    <div className="modal">
      <button>Натисніть</button>
    </div>
  );
}

ReactDOM.render(<Parent />, appRoot);
```

[**Спробувати на CodePen**](https://codepen.io/gaearon/pen/jGBWpE)

Перехоплення подій, спливаючих від порталу до батьківського компоненту, дозволяє створювати абстракції, що не спроектовані спеціально під портали. Наприклад, ви відрендерили компонент `<Modal />`. Тоді його події можуть бути перехоплені батьківським компонентом, незалежно від того, чи був `<Modal />` реалізований з використанням порталів чи без них.
