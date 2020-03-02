---
id: integrating-with-other-libraries
title: Integrating with Other Libraries
permalink: docs/integrating-with-other-libraries.html
---

React може бути використаний в будь-якому веб додатку. Його можна вбудовувати в інші додатки, та й з невеликими зусиллями інші додатки можуть бути вбудовані в React. В цій статті будуть розглядатися деякі з найпоширеніших випадків використання React, а саме, ми сфокусуємося на інтеграції з [jQuery](https://jquery.com/) та [Backbone](https://backbonejs.org/), але ці ж ідеї можна застосувати до інтеграції компонентів в будь-який існуючий код.

## Інтеграція з плагінами, які змінюють DOM {#integrating-with-dom-manipulation-plugins}

React не знає про зміни в DOM, які були внесені поза React. Він визначає оновлення на основі свого внутрішнього представлення і якщо один і той самий DOM вузол зазнає змін від іншої бібліотеки, то React плутається і не має можливості розібратися.

Але це не означає, що не можливо або, навіть обов'язково, важко об'єднати React з іншими способами впливу на DOM, ви просто повинні пам’ятати про те, що кожен спосіб робить.

Найлегше не допустити конфліктів — це запобігти оновленню React компонента. Ви можете зробити це через рендер елементів, які React не має причин оновлювати, наприклад, порожній`<div />`.

### Як підійти до вирішення проблеми {#how-to-approach-the-problem}

Для демонстрації створимо базову обгортку для узагальненого jQuery плагіна.

Ми прикріпино [реф](/docs/refs-and-the-dom.html) до кореневого DOM елементу. Всередині `componentDidMount`, ми отримаємо посилання на цей елемент, і таким чином ми можемо використати його в jQuery плагіні.

Щоб React не оновлював DOM після монтування ми повернемо порожній `<div />` з методу `render()`. Елемент `<div />` не має жодних пропсів чи дочірніх компонентів, отже React немає жодних причин для його оновлення, таким чином jQuery плагін має повний контроль над цією частиною DOM:

```js{3,4,8,12}
class SomePlugin extends React.Component {
  componentDidMount() {
    this.$el = $(this.el);
    this.$el.somePlugin();
  }

  componentWillUnmount() {
    this.$el.somePlugin('destroy');
  }

  render() {
    return <div ref={el => this.el = el} />;
  }
}
```

Зауважте, що ми визначили два [методи життєвого циклу](/docs/react-component.html#the-component-lifecycle): `componentDidMount` та `componentWillUnmount`. Багато jQuery плагінів додають обробники подій до DOM, а отже дуже важливо видаляти їх всередині методу `componentWillUnmount`. Якщо плагін не забезпечує спосіб очищення, то вам, ймовірно, потрібно буде створити його самостійно, пам'ятаючи про видалення всіх обробників подій, які плагін додав, щоб запобігти витоку пам'яті.

### Інтеграці з jQuery плагіном Chosen {#integrating-with-jquery-chosen-plugin}

Щоб краще проілюструвати вищезазначені поняття, давайте напишемо мінімальний фрагмент коду, який огортає плагін [Chosen](https://harvesthq.github.io/chosen/), який розширює можливості поля вводу `<select>`.

>**Примітка:**
>
>Навіть якщо це можливо, це не означає, що це найкращий підхід для React додатків. Ми радимо використовувати компоненти React, якщо це можливо. Вони простіші у використанні у React додатках, а також дають більший контроль над своєю поведінкою та зовнішнім виглядом.

Для початку розглянемо що Chosen робить з DOM.

Якщо ви викликаєте його на DOM вузлі `<select>`, він зчитує атрибути з даного вузла DOM, ховає його за допомогою вбудованих стилів та потім вставляє окремий DOM вузол зі своїм власними візуальним представленням одразу після `<select>`. Потім він запускає події jQuery щоб повідомити нас про зміни.

Скажімо, що ми прагнемо надати такий API для обгортки `<Chosen>` React компонентом:

```js
function Example() {
  return (
    <Chosen onChange={value => console.log(value)}>
      <option>vanilla</option>
      <option>chocolate</option>
      <option>strawberry</option>
    </Chosen>
  );
}
```

Для простоти ми будемо робити це за допомогою [неконтрольованого компоненту](/docs/uncontrolled-components.html).

По-перше, з методу `render()` ми будемо повертати компонент `<div>` всередині якого буде `<select>`:

```js{4,5}
class Chosen extends React.Component {
  render() {
    return (
      <div>
        <select className="Chosen-select" ref={el => this.el = el}>
          {this.props.children}
        </select>
      </div>
    );
  }
}
```

Зверніть увагу, що ми загорнули `<select>` в додатковий `<div>`. Це необхідно, тому що Chosen додасть новий елемент одразу після `<select>`. Однак, з точки зору React `<div>` завжди має лише один дочірній елемент. Таким чином оновлення React не будуть конфліктувати з Chosen елементами. Важливо розуміти, що якщо ви змінюєте DOM поза React, то ви маєте впевнитися що React не має жодних причин оновлювати ті DOM вузли.

Далі, ми створимо методи життєвого циклу. Нам потрібно ініціалізувати Chosen з рефом на вузлі `<select>` в методі `componentDidMount`, та прибрати його в `componentWillUnmount`:

```js{2,3,7}
componentDidMount() {
  this.$el = $(this.el);
  this.$el.chosen();
}

componentWillUnmount() {
  this.$el.chosen('destroy');
}
```

[**Спробувати на CodePen**](https://codepen.io/gaearon/pen/qmqeQx?editors=0010)

Зауважте, що React не надає якогось особливого значення полю `this.el`. Це працює лише тому, що ми попередньо присвоїли цьому полю значення `ref` в методі `render()`:

```js
<select className="Chosen-select" ref={el => this.el = el}>
```

Цього цілком достатньо щоб рендерити наш компонент, але ми також хочемо бути поінформовані про зміни значень. Для цього ми підпишемося на jQuery подію `change` у елемента `<select>`, який керується Chosen.

Ми не будемо напряму передавати `this.props.onChange` у Chosen, тому що пропси компонента можуть з часом змінюватися, включаючи й обробники подій. Натомість, ми створимо метод `handleChange()`, який буде викликати `this.props.onChange` та підпишемо його на jQuery подію `change`:

```js{5,6,10,14-16}
componentDidMount() {
  this.$el = $(this.el);
  this.$el.chosen();

  this.handleChange = this.handleChange.bind(this);
  this.$el.on('change', this.handleChange);
}

componentWillUnmount() {
  this.$el.off('change', this.handleChange);
  this.$el.chosen('destroy');
}

handleChange(e) {
  this.props.onChange(e.target.value);
}
```

[**Спробувати на CodePen**](https://codepen.io/gaearon/pen/bWgbeE?editors=0010)

Залишилося ще одне питання. В React пропси можуть змінюватися з часом. Наприклад, компонент `<Chosen>` може отримати різні дочірні компоненти якщо у батьківського компонента зміниться стан. Це означає, що в місцях інтеграції необхідно вручну оновити DOM у відповідь на зміни властивостей, оскільки в цих місцях React не зробить це для нас.

Документація Chosen пропонує нам використовувати jQuery метод `trigger()` для сповіщення про зміни в оригінальному елементі DOM. Ми дозволимо React піклуватися про зміни `this.props.children` в `<select>`, але ми також додамо метод життєвого циклу `componentDidUpdate()`, який буде повідомляти Chosen про зміни в списку дочірніх компонентів:

```js{2,3}
componentDidUpdate(prevProps) {
  if (prevProps.children !== this.props.children) {
    this.$el.trigger("chosen:updated");
  }
}
```

В такий спосіб, Chosen буде знати що необхідно змінити свої DOM елементи, якщо React змінив дочірні елементи `<select>`.

Повна реалізація `Chosen` компонента виглядає так:

```js
class Chosen extends React.Component {
  componentDidMount() {
    this.$el = $(this.el);
    this.$el.chosen();

    this.handleChange = this.handleChange.bind(this);
    this.$el.on('change', this.handleChange);
  }
  
  componentDidUpdate(prevProps) {
    if (prevProps.children !== this.props.children) {
      this.$el.trigger("chosen:updated");
    }
  }

  componentWillUnmount() {
    this.$el.off('change', this.handleChange);
    this.$el.chosen('destroy');
  }
  
  handleChange(e) {
    this.props.onChange(e.target.value);
  }

  render() {
    return (
      <div>
        <select className="Chosen-select" ref={el => this.el = el}>
          {this.props.children}
        </select>
      </div>
    );
  }
}
```

[**Спробувати на CodePen**](https://codepen.io/gaearon/pen/xdgKOz?editors=0010)

## Integrating with Other View Libraries {#integrating-with-other-view-libraries}

React can be embedded into other applications thanks to the flexibility of [`ReactDOM.render()`](/docs/react-dom.html#render).

Although React is commonly used at startup to load a single root React component into the DOM, `ReactDOM.render()` can also be called multiple times for independent parts of the UI which can be as small as a button, or as large as an app.

In fact, this is exactly how React is used at Facebook. This lets us write applications in React piece by piece, and combine them with our existing server-generated templates and other client-side code.

### Replacing String-Based Rendering with React {#replacing-string-based-rendering-with-react}

A common pattern in older web applications is to describe chunks of the DOM as a string and insert it into the DOM like so: `$el.html(htmlString)`. These points in a codebase are perfect for introducing React. Just rewrite the string based rendering as a React component.

So the following jQuery implementation...

```js
$('#container').html('<button id="btn">Say Hello</button>');
$('#btn').click(function() {
  alert('Hello!');
});
```

...could be rewritten using a React component:

```js
function Button() {
  return <button id="btn">Say Hello</button>;
}

ReactDOM.render(
  <Button />,
  document.getElementById('container'),
  function() {
    $('#btn').click(function() {
      alert('Hello!');
    });
  }
);
```

From here you could start moving more logic into the component and begin adopting more common React practices. For example, in components it is best not to rely on IDs because the same component can be rendered multiple times. Instead, we will use the [React event system](/docs/handling-events.html) and register the click handler directly on the React `<button>` element:

```js{2,6,9}
function Button(props) {
  return <button onClick={props.onClick}>Say Hello</button>;
}

function HelloButton() {
  function handleClick() {
    alert('Hello!');
  }
  return <Button onClick={handleClick} />;
}

ReactDOM.render(
  <HelloButton />,
  document.getElementById('container')
);
```

[**Try it on CodePen**](https://codepen.io/gaearon/pen/RVKbvW?editors=1010)

You can have as many such isolated components as you like, and use `ReactDOM.render()` to render them to different DOM containers. Gradually, as you convert more of your app to React, you will be able to combine them into larger components, and move some of the `ReactDOM.render()` calls up the hierarchy.

### Embedding React in a Backbone View {#embedding-react-in-a-backbone-view}

[Backbone](https://backbonejs.org/) views typically use HTML strings, or string-producing template functions, to create the content for their DOM elements. This process, too, can be replaced with rendering a React component.

Below, we will create a Backbone view called `ParagraphView`. It will override Backbone's `render()` function to render a React `<Paragraph>` component into the DOM element provided by Backbone (`this.el`). Here, too, we are using [`ReactDOM.render()`](/docs/react-dom.html#render):

```js{1,5,8,12}
function Paragraph(props) {
  return <p>{props.text}</p>;
}

const ParagraphView = Backbone.View.extend({
  render() {
    const text = this.model.get('text');
    ReactDOM.render(<Paragraph text={text} />, this.el);
    return this;
  },
  remove() {
    ReactDOM.unmountComponentAtNode(this.el);
    Backbone.View.prototype.remove.call(this);
  }
});
```

[**Try it on CodePen**](https://codepen.io/gaearon/pen/gWgOYL?editors=0010)

It is important that we also call `ReactDOM.unmountComponentAtNode()` in the `remove` method so that React unregisters event handlers and other resources associated with the component tree when it is detached.

When a component is removed *from within* a React tree, the cleanup is performed automatically, but because we are removing the entire tree by hand, we must call this method.

## Integrating with Model Layers {#integrating-with-model-layers}

While it is generally recommended to use unidirectional data flow such as [React state](/docs/lifting-state-up.html), [Flux](https://facebook.github.io/flux/), or [Redux](https://redux.js.org/), React components can use a model layer from other frameworks and libraries.

### Using Backbone Models in React Components {#using-backbone-models-in-react-components}

The simplest way to consume [Backbone](https://backbonejs.org/) models and collections from a React component is to listen to the various change events and manually force an update.

Components responsible for rendering models would listen to `'change'` events, while components responsible for rendering collections would listen for `'add'` and `'remove'` events. In both cases, call [`this.forceUpdate()`](/docs/react-component.html#forceupdate) to rerender the component with the new data.

In the example below, the `List` component renders a Backbone collection, using the `Item` component to render individual items.

```js{1,7-9,12,16,24,30-32,35,39,46}
class Item extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange() {
    this.forceUpdate();
  }

  componentDidMount() {
    this.props.model.on('change', this.handleChange);
  }

  componentWillUnmount() {
    this.props.model.off('change', this.handleChange);
  }

  render() {
    return <li>{this.props.model.get('text')}</li>;
  }
}

class List extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange() {
    this.forceUpdate();
  }

  componentDidMount() {
    this.props.collection.on('add', 'remove', this.handleChange);
  }

  componentWillUnmount() {
    this.props.collection.off('add', 'remove', this.handleChange);
  }

  render() {
    return (
      <ul>
        {this.props.collection.map(model => (
          <Item key={model.cid} model={model} />
        ))}
      </ul>
    );
  }
}
```

[**Try it on CodePen**](https://codepen.io/gaearon/pen/GmrREm?editors=0010)

### Extracting Data from Backbone Models {#extracting-data-from-backbone-models}

The approach above requires your React components to be aware of the Backbone models and collections. If you later plan to migrate to another data management solution, you might want to concentrate the knowledge about Backbone in as few parts of the code as possible.

One solution to this is to extract the model's attributes as plain data whenever it changes, and keep this logic in a single place. The following is [a higher-order component](/docs/higher-order-components.html) that extracts all attributes of a Backbone model into state, passing the data to the wrapped component.

This way, only the higher-order component needs to know about Backbone model internals, and most components in the app can stay agnostic of Backbone.

In the example below, we will make a copy of the model's attributes to form the initial state. We subscribe to the `change` event (and unsubscribe on unmounting), and when it happens, we update the state with the model's current attributes. Finally, we make sure that if the `model` prop itself changes, we don't forget to unsubscribe from the old model, and subscribe to the new one.

Note that this example is not meant to be exhaustive with regards to working with Backbone, but it should give you an idea for how to approach this in a generic way:

```js{1,5,10,14,16,17,22,26,32}
function connectToBackboneModel(WrappedComponent) {
  return class BackboneComponent extends React.Component {
    constructor(props) {
      super(props);
      this.state = Object.assign({}, props.model.attributes);
      this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
      this.props.model.on('change', this.handleChange);
    }

    componentWillReceiveProps(nextProps) {
      this.setState(Object.assign({}, nextProps.model.attributes));
      if (nextProps.model !== this.props.model) {
        this.props.model.off('change', this.handleChange);
        nextProps.model.on('change', this.handleChange);
      }
    }

    componentWillUnmount() {
      this.props.model.off('change', this.handleChange);
    }

    handleChange(model) {
      this.setState(model.changedAttributes());
    }

    render() {
      const propsExceptModel = Object.assign({}, this.props);
      delete propsExceptModel.model;
      return <WrappedComponent {...propsExceptModel} {...this.state} />;
    }
  }
}
```

To demonstrate how to use it, we will connect a `NameInput` React component to a Backbone model, and update its `firstName` attribute every time the input changes:

```js{4,6,11,15,19-21}
function NameInput(props) {
  return (
    <p>
      <input value={props.firstName} onChange={props.handleChange} />
      <br />
      My name is {props.firstName}.
    </p>
  );
}

const BackboneNameInput = connectToBackboneModel(NameInput);

function Example(props) {
  function handleChange(e) {
    props.model.set('firstName', e.target.value);
  }

  return (
    <BackboneNameInput
      model={props.model}
      handleChange={handleChange}
    />
  );
}

const model = new Backbone.Model({ firstName: 'Frodo' });
ReactDOM.render(
  <Example model={model} />,
  document.getElementById('root')
);
```

[**Try it on CodePen**](https://codepen.io/gaearon/pen/PmWwwa?editors=0010)

This technique is not limited to Backbone. You can use React with any model library by subscribing to its changes in the lifecycle methods and, optionally, copying the data into the local React state.
