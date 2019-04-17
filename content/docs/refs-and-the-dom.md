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

**You may not use the `ref` attribute on function components** because they don't have instances:

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

### Exposing DOM Refs to Parent Components {#exposing-dom-refs-to-parent-components}

In rare cases, you might want to have access to a child's DOM node from a parent component. This is generally not recommended because it breaks component encapsulation, but it can occasionally be useful for triggering focus or measuring the size or position of a child DOM node.

While you could [add a ref to the child component](#adding-a-ref-to-a-class-component), this is not an ideal solution, as you would only get a component instance rather than a DOM node. Additionally, this wouldn't work with function components.

If you use React 16.3 or higher, we recommend to use [ref forwarding](/docs/forwarding-refs.html) for these cases. **Ref forwarding lets components opt into exposing any child component's ref as their own**. You can find a detailed example of how to expose a child's DOM node to a parent component [in the ref forwarding documentation](/docs/forwarding-refs.html#forwarding-refs-to-dom-components).

If you use React 16.2 or lower, or if you need more flexibility than provided by ref forwarding, you can use [this alternative approach](https://gist.github.com/gaearon/1a018a023347fe1c2476073330cc5509) and explicitly pass a ref as a differently named prop.

When possible, we advise against exposing DOM nodes, but it can be a useful escape hatch. Note that this approach requires you to add some code to the child component. If you have absolutely no control over the child component implementation, your last option is to use [`findDOMNode()`](/docs/react-dom.html#finddomnode), but it is discouraged and deprecated in [`StrictMode`](/docs/strict-mode.html#warning-about-deprecated-finddomnode-usage).

### Callback Refs {#callback-refs}

React also supports another way to set refs called "callback refs", which gives more fine-grain control over when refs are set and unset.

Instead of passing a `ref` attribute created by `createRef()`, you pass a function. The function receives the React component instance or HTML DOM element as its argument, which can be stored and accessed elsewhere.

The example below implements a common pattern: using the `ref` callback to store a reference to a DOM node in an instance property.

```javascript{5,7-9,11-14,19,29,34}
class CustomTextInput extends React.Component {
  constructor(props) {
    super(props);

    this.textInput = null;

    this.setTextInputRef = element => {
      this.textInput = element;
    };

    this.focusTextInput = () => {
      // Focus the text input using the raw DOM API
      if (this.textInput) this.textInput.focus();
    };
  }

  componentDidMount() {
    // autofocus the input on mount
    this.focusTextInput();
  }

  render() {
    // Use the `ref` callback to store a reference to the text input DOM
    // element in an instance field (for example, this.textInput).
    return (
      <div>
        <input
          type="text"
          ref={this.setTextInputRef}
        />
        <input
          type="button"
          value="Focus the text input"
          onClick={this.focusTextInput}
        />
      </div>
    );
  }
}
```

React will call the `ref` callback with the DOM element when the component mounts, and call it with `null` when it unmounts. Refs are guaranteed to be up-to-date before `componentDidMount` or `componentDidUpdate` fires.

You can pass callback refs between components like you can with object refs that were created with `React.createRef()`.

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

### Legacy API: String Refs {#legacy-api-string-refs}

If you worked with React before, you might be familiar with an older API where the `ref` attribute is a string, like `"textInput"`, and the DOM node is accessed as `this.refs.textInput`. We advise against it because string refs have [some issues](https://github.com/facebook/react/pull/8333#issuecomment-271648615), are considered legacy, and **are likely to be removed in one of the future releases**.

> Note
>
> If you're currently using `this.refs.textInput` to access refs, we recommend using either the [callback pattern](#callback-refs) or the [`createRef` API](#creating-refs) instead.

### Caveats with callback refs {#caveats-with-callback-refs}

If the `ref` callback is defined as an inline function, it will get called twice during updates, first with `null` and then again with the DOM element. This is because a new instance of the function is created with each render, so React needs to clear the old ref and set up the new one. You can avoid this by defining the `ref` callback as a bound method on the class, but note that it shouldn't matter in most cases.
