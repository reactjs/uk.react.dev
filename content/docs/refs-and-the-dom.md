---
id: refs-and-the-dom
title: Refs and the DOM
redirect_from:
  - "docs/working-with-the-browser.html"
  - "docs/more-about-refs.html"
  - "docs/more-about-refs-ko-KR.html"
  - "docs/more-about-refs-zh-CN.html"
  - "tips/expose-component-functions.html"
  - "tips/children-undefined.html"
permalink: docs/refs-and-the-dom.html
---

Рефи надають доступ до DOM-вузлів чи React-елементів, що створюються під час рендеру.

In the typical React dataflow, [props](/docs/components-and-props.html) are the only way that parent components interact with their children. To modify a child, you re-render it with new props. However, there are a few cases where you need to imperatively modify a child outside of the typical dataflow. The child to be modified could be an instance of a React component, or it could be a DOM element. For both of these cases, React provides an escape hatch.

### Коли використовувати рефи {#when-to-use-refs}

Існує декілька ситуацій доцільного використання рефів:

* Контроль фокуса, виділення тексту чи media playback.
* Виклик імперативної анімації.
* Інтеграція зі сторонніми DOM-бібліотеками.

Уникайте використання рефів для будь-чого, що можна зробити декларативно.

Наприклад, замість виклику методів `open()` та `close()` компоненту `Dialog`, передайте йому проп `isOpen`.

### Don't Overuse Refs {#dont-overuse-refs}

Мабуть першим бажанням буде використання рефів для того, щоб "все працювало" у вашому додатку. Якщо це так, зупиніться та подумайте більш критично про те, який з компонентів з ієрархії має контролювати стан. Зазвичай, стає зрозуміло, що відповідне місце для контролю стану лежить на верхніх рівнях ієрархії. Ознайомтеся з розділом [Підняття стану](/docs/lifting-state-up.html) для прикладів такої поведінки.

> Примітка
>
> Приклади нижче були оновлені для використання `React.createRef()` API, що з'явилося у React 16.3. Якщо ви користуєтеся більш ранньою версією React, ми рекомендуємо використувати [рефи як функції зворотнього викливку](#callback-refs).

### Створення рефів {#creating-refs}

Рефи створюються за допомогою виклику методу `React.createRef()` та приєднюються до React-елемента через атрибут `ref`. Рефи визначаються як властивість Refs are commonly assigned to an instance property when a component is constructed so they can be referenced throughout the component.

```javascript{4,7}
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
  }
  render() {
    return <div ref={this.myRef} />;
  }
}
```

### Accessing Refs {#accessing-refs}

When a ref is passed to an element in `render`, a reference to the node becomes accessible at the `current` attribute of the ref.

```javascript
const node = this.myRef.current;
```

Значення рефа може відрізнятися в залежності від типу вузла:

- Коли атрибут `ref` визначений у HTML-елемента, тоді `ref`, що створений у конструкторі за допомогою методу `React.createRef()`, отримає доступ до відповідого DOM-елемента через свою властивість `current`.
- Коли атрибут `ref` визначений у компонента користувача, тоді об'єкт `ref` отримає посилання на вмонтований через його властивіть `current`. object receives the mounted instance of the component as its `current`.
- **You may not use the `ref` attribute on function components** because they don't have instances.

На прикладах нижче можна побачити різницю.

#### Застосування рефу до DOM-елемента {#adding-a-ref-to-a-dom-element}

Код нижче використовує `ref`, щоб отримати посилання на DOM-вузол:

```javascript{5,12,22}
class CustomTextInput extends React.Component {
  constructor(props) {
    super(props);
    // створимо реф, щоб отримати посилання на DOM-елемент поля введення
    this.textInput = React.createRef();
    this.focusTextInput = this.focusTextInput.bind(this);
  }

  focusTextInput() {
    // Переведемо фокус на текстове поле введення, використовуючи нативне DOM API
    // Примітка: ми використовуємо "current", щоб отримати DOM-вузол
    this.textInput.current.focus();
  }

  render() {
    // вкажемо React, що ми хочемо зв'язати реф елементу <input>
    // з `textInput`, що був визначений в конструкторі
    return (
      <div>
        <input
          type="text"
          ref={this.textInput} />
        <input
          type="button"
          value="Перенести фокус на текстове поле введення"
          onClick={this.focusTextInput}
        />
      </div>
    );
  }
}
```

React зв'яже властисть `current` з DOM-елементом, коли компонент буде вмонтований, та встановить назад в `null`, коли компонент буде прибрано з DOM. Оновлення `ref` відбувається перед `componentDidMount` або `componentDidUpdate`.

#### Застосування рефу до компонента {#adding-a-ref-to-a-class-component}

Якби ми захотіли обернути передній `CustomTextInput`, щоб симулювати натискання по ньому одразу після вмонтування, ми могли б використати реф, щоб отримати доступ до користувацького поля введення та виклакати його метод `focusTextInput` напряму:

```javascript{4,8,13}
class AutoFocusTextInput extends React.Component {
  constructor(props) {
    super(props);
    this.textInput = React.createRef();
  }

  componentDidMount() {
    this.textInput.current.focusTextInput();
  }

  render() {
    return (
      <CustomTextInput ref={this.textInput} />
    );
  }
}
```

Зауважте, що це працює тільки, якщо `CustomTextInput` визначений як клас:

```js{1}
class CustomTextInput extends React.Component {
  // ...
}
```

#### Рефи та функціональні компоненти {#refs-and-function-components}

**Ви не зможете застосувати атрибут `ref` до функціональних компонентів**, тому що у них немає екзеплярів:

```javascript{1,8,13}
function MyFunctionComponent() {
  return <input />;
}

class Parent extends React.Component {
  constructor(props) {
    super(props);
    this.textInput = React.createRef();
  }
  render() {
    // Це *не* буде працювати!
    return (
      <MyFunctionComponent ref={this.textInput} />
    );
  }
}
```

Ви маєте перетворити компонент в клас, якщо ви хочете використовувати реф для нього, так само як ви б робили, коли вам потрібні методи життєвого циклу або стан.

Проте ви можете **використовувати атрибут `ref` в середині функціональних компонентів** за умови, що ви визначаєте їх на DOM-елементах або класових компонентах:

```javascript{2,3,6,13}
function CustomTextInput(props) {
  // textInput повинен бути визначений тут, щоб реф міг посилатися на нього
  let textInput = React.createRef();

  function handleClick() {
    textInput.current.focus();
  }

  return (
    <div>
      <input
        type="text"
        ref={textInput} />
      <input
        type="button"
        value="Перенести фокус на текстове поле введення"
        onClick={handleClick}
      />
    </div>
  );
}
```

### Підйом DOM рефів у батьківський компонент{#exposing-dom-refs-to-parent-components}

У рідкісних випадках, ви можете захотіти мати доступ до DOM вузлів нащадків з батьківського компонента. Зазвичай так нерекомендовано робити, тому що це руйнує інкапсуляцію компонентів, але може бути використано для зміни фокусу або визначення розмірів або положення DOM вузлів нащадка.

While you could [add a ref to the child component](#adding-a-ref-to-a-class-component), this is not an ideal solution, as you would only get a component instance rather than a DOM node. Additionally, this wouldn't work with function components.

Якщо ви користуєтеся React 16.3 або вище, ми рекомендуємо використовувати [перенаправлення рефів](/docs/forwarding-refs.html) для цих задач. **Ref forwarding lets components opt into exposing any child component's ref as their own**. Ви можете знайти детальний приклад підйому DOM вузлів нащадка у батьківський компонент [у розділі перенаправлення рефів](/docs/forwarding-refs.html#forwarding-refs-to-dom-components).

Якщо ви користуєтеся React 16.2 або нижче, або ви потребуєте більшої гнучкості, ніж вам дає перенаправлення рефів, ви можете скористатися [альтернативним підходом](https://gist.github.com/gaearon/1a018a023347fe1c2476073330cc5509) та явно передати реф як проп з іменем відмінним від `ref`.

Коли можливо, ми не рекомендуємо підхід підйом DOM вузлів, але це може When possible, we advise against exposing DOM nodes, but it can be a useful escape hatch. Note that this approach requires you to add some code to the child component. If you have absolutely no control over the child component implementation, your last option is to use [`findDOMNode()`](/docs/react-dom.html#finddomnode), but it is discouraged and deprecated in [`StrictMode`](/docs/strict-mode.html#warning-about-deprecated-finddomnode-usage).

### Рефи через функції зворотнього виклику {#callback-refs}

React також підтримує інший варіант ініціалізації рефів, що називається "callback refs" (рефи через функції зворотнього виклику), що дає більший контроль над which gives more fine-grain control over when refs are set and unset.

На відміну від передачі через атрибути `ref`, що створений функцією `createRef()`, ви передаєте функцію. Функція отримує екземпляр компонента чи HTML DOM-елемент у вигляді аргумента, яким можна скористатися або зберігти.

Приклад нижче реалізує поширений паттерн: використання функції зворотнього виклику у `ref` для отримання та зберігання посилання на DOM-вузл в екземплері.

```javascript{5,7-9,11-14,19,29,34}
class CustomTextInput extends React.Component {
  constructor(props) {
    super(props);

    this.textInput = null;

    this.setTextInputRef = element => {
      this.textInput = element;
    };

    this.focusTextInput = () => {
      // Фокусування на текстовому полі введення за допомогою нативного DOM API
      if (this.textInput) this.textInput.focus();
    };
  }

  componentDidMount() {
    // автофокус на полі введення при монтуванні
    this.focusTextInput();
  }

  render() {
    // Використання функції зворотнього виклику в `ref` для зберігання посилання на DOM-елемент
    // текстове поле введення в екземплярі (наприклад, this.textInput).
    return (
      <div>
        <input
          type="text"
          ref={this.setTextInputRef}
        />
        <input
          type="button"
          value="Фокус на текстовому полі введення"
          onClick={this.focusTextInput}
        />
      </div>
    );
  }
}
```

React виконає функцію зворотнього виклику `ref` з DOM-елементом, коли компонент буде вмонтований, та виконає її зі значення `null`, коли компонент буде прибрано. Рефи гарантують актуальність перед викликом метода `componentDidMount` або `componentDidUpdate`.

Ми можете передавати You can pass callback refs between components like you can with object refs that were created with `React.createRef()`.

```javascript{4,13}
function CustomTextInput(props) {
  return (
    <div>
      <input ref={props.inputRef} />
    </div>
  );
}

class Parent extends React.Component {
  render() {
    return (
      <CustomTextInput
        inputRef={el => this.inputElement = el}
      />
    );
  }
}
```

In the example above, `Parent` passes its ref callback as an `inputRef` prop to the `CustomTextInput`, and the `CustomTextInput` passes the same function as a special `ref` attribute to the `<input>`. As a result, `this.inputElement` in `Parent` will be set to the DOM node corresponding to the `<input>` element in the `CustomTextInput`.

### Застраліле API: рядкові рефи {#legacy-api-string-refs}

Якщо ви працювали з React раніше, ви мабуть знайомі зі старим API, де атрибут `ref` - рядок, наприклад `"textInput"`, та DOM вузол доступний через `this.refs.textInput`. Ми не радимо користуватися ним, тому що рядкові рефи мають [деякі проблеми](https://github.com/facebook/react/pull/8333#issuecomment-271648615), також це API вважається застарілим, та **ймовірно буде видалено в одній з майбутніх версій**.

> Примітка
>
> Якщо ви досі користуєте `this.refs.textInput` для доступу до рефів, ми рекомендуємо натомість користовуватися [функціями зворотнього виклику](#callback-refs) або [`createRef` API](#creating-refs).

### Застереження with callback refs {#caveats-with-callback-refs}

 Якщо `ref` визначено як інлайнову функцію, то вона буде виклакана двічі протягом оновлень, перший раз з `null`, потім з посиланням на DOM-елемент. Це відбувається, тому що створюється новий екземпляр функції під час кожного рендеру, так як React потребує очистити старий реф та встановити новий. Щоб запобігти цьому, передайте `ref` метод класу, проте в більшості випадків це немає значення.
