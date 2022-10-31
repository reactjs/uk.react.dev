---
id: integrating-with-other-libraries
title: Взаємодія зі сторонніми бібліотеками
permalink: docs/integrating-with-other-libraries.html
---

React можна використовувати у будь-якому веб-додатку. Його можна вбудовувати в інші додатки, та, з невеликими зусиллями, інші додатки можна вбудувати в React. У цьому гайді ми розглянемо деякі з більш поширених випадків використання React, а саме - інтеграцію з [jQuery](https://jquery.com/) та [Backbone](https://backbonejs.org/). Проте ці ж ідеї можна застосувати до інтеграції компонентів з будь-яким іншим кодом.

## Інтеграція з плагінами, які змінюють DOM {#integrating-with-dom-manipulation-plugins}

Бібліотека React не знає про зміни в DOM, які були внесені поза React. Вона визначає оновлення на основі внутрішнього представлення. І якщо один і той самий DOM-вузол зазнає змін від іншої бібліотеки, все закінчується тим, що React дає збій.

Це не означає, що неможливо або однозначно важко об’єднати React з іншими способами впливу на DOM. Просто необхідно бути уважним до того, що робить кожен спосіб.

Найлегше не допустити конфліктів — це запобігти оновленню React компонента. Можна зробити це через рендер елементів, які React не має причин оновлювати, як-от порожній `<div />`.

### Як підійти до вирішення проблеми {#how-to-approach-the-problem}

Для демонстрації створимо базову обгортку для узагальненого jQuery-плагіна.

Прикріпляємо [реф](/docs/refs-and-the-dom.html) до кореневого DOM-елементу. Всередині `componentDidMount` отримуємо посилання на цей елемент і у такий спосіб можемо передати його до jQuery-плагіну.

Щоб React не оновлював DOM після монтування, повертаємо порожній `<div />` з методу `render()`. Елемент `<div />` не має жодних пропсів чи дочірніх компонентів, отже, React немає жодних причин для його оновлення. Таким чином, jQuery-плагін має повний контроль над цією частиною DOM:

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

Зауважте, що ми визначили два [методи життєвого циклу](/docs/react-component.html#the-component-lifecycle): `componentDidMount` та `componentWillUnmount`. Багато jQuery-плагінів додають обробники подій до DOM, тож дуже важливо видаляти їх всередині методу `componentWillUnmount`. Якщо плагін не забезпечує метод очищення, то вам, скоріш за все, потрібно буде створити його самостійно, пам’ятаючи про видалення всіх обробників подій, які плагін додав, щоб запобігти витоку пам’яті.

### Інтеграція з jQuery-плагіном Chosen {#integrating-with-jquery-chosen-plugin}

Щоб краще проілюструвати вищезазначені поняття, давайте напишемо мінімальний фрагмент коду, який огортає плагін [Chosen](https://harvesthq.github.io/chosen/), що розширює можливості поля вводу `<select>`.

>**Примітка:**
>
>Те, що цей спосіб працює, ще не означає, що це найкращий підхід для React. Ми радимо використовувати React-компоненти, коли це можливо. Їх простіше повторно використовувати у React-додатках. Також часто є більше можливостей керувати їх поведінкою та зовнішнім виглядом.

Для початку, розглянемо, що Chosen робить з DOM.

Якщо викликати його на DOM-вузлі `<select>`, він зчитує атрибути з даного DOM-вузла, ховає його за допомогою вбудованих стилів і потім вставляє окремий DOM-вузол із власним візуальним представленням одразу після `<select>`. Далі він запускає події jQuery, щоб повідомити про зміни.

Скажімо, ми хочемо надати такий API за допомогою React-компонента `<Chosen>`, що буде обгорткою для плагіна:

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

Для простоти зробимо це за допомогою [неконтрольованого компоненту](/docs/uncontrolled-components.html).

Спочатку з методу `render()` повертаємо елемент `<div>`, всередині якого `<select>`:

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

Зверніть увагу, як ми загорнули `<select>` в додатковий `<div>`. Це необхідно, адже Chosen додасть новий елемент одразу після `<select>`, який ми передали. Однак, що стосується React, `<div>` завжди має лише один дочірній елемент. Ось, як ми піклуємось про те, щоб React оновлення не конфліктували з елементами Chosen. Важливо розуміти, що якщо ви змінюєте DOM поза React, то переконайтеся, що React не має жодних причин оновлювати ті DOM-вузли.

Далі, використовуємо методи життєвого циклу. Нам потрібно ініціалізувати Chosen з рефом на вузлі `<select>` в методі `componentDidMount` та прибрати його в `componentWillUnmount`:

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

Цього цілком достатньо, щоб відрендерити наш компонент, але ми також маємо бути в курсі змін значень. Для цього підписуємося на jQuery-подію `change` у елемента `<select>`, який керується Chosen.

Ми не будемо безпосередньо передавати `this.props.onChange` у Chosen, тому що пропси компонента можуть із часом змінюватися, включно з обробниками подій. Натомість, створюємо метод `handleChange()`, який викликає `this.props.onChange`, та підписуємо його на jQuery-подію `change`:

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

Маємо ще дещо зробити наостанок. У React пропси можуть змінюватися з часом. Наприклад, компонент `<Chosen>` може отримати різні дочірні компоненти, якщо в батьківського компонента зміниться стан. Це означає, що в місцях інтеграції важливо вручну оновити DOM у відповідь на зміни властивостей, оскільки ми більше не дозволяємо React робити це для нас.

Документація Chosen пропонує використовувати метод jQuery `trigger()` для сповіщення про зміни в оригінальному DOM-елементі. Дозволяємо React піклуватися про зміни `this.props.children` у `<select>`, але також додаємо метод життєвого циклу `componentDidUpdate()`, що повідомляє Chosen про зміни в списку дочірніх компонентів:

```js{2,3}
componentDidUpdate(prevProps) {
  if (prevProps.children !== this.props.children) {
    this.$el.trigger("chosen:updated");
  }
}
```

Таким чином, Chosen знає, що необхідно змінити свої DOM-елементи, якщо React змінив дочірні елементи `<select>`.

Повна реалізація `Chosen`-компонента виглядає так:

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

## Інтеграція з іншими візуальними бібліотеками {#integrating-with-other-view-libraries}

<<<<<<< HEAD
React можна вбудовувати в інші додатки, завдяки гнучкості функції [`ReactDOM.render()`](/docs/react-dom.html#render).

Хоча React широко використовується для завантаження єдиного кореневого компоненту в DOM, метод `ReactDOM.render()` також може бути викликаний багато разів для незалежних частин UI, що можуть бути такими малими, як кнопка, або такими великими, як окремий додаток.
=======
React can be embedded into other applications thanks to the flexibility of [`createRoot()`](/docs/react-dom-client.html#createRoot).

Although React is commonly used at startup to load a single root React component into the DOM, `createRoot()` can also be called multiple times for independent parts of the UI which can be as small as a button, or as large as an app.
>>>>>>> e21b37c8cc8b4e308015ea87659f13aa26bd6356

Насправді, саме так Facebook використовує React. Такий підхід дозволяє писати програми частинами і комбінувати їх з шаблонами, створеними на сервері, або з іншим клієнтським кодом.

### Заміна рядкових шаблонів за допомогою React {#replacing-string-based-rendering-with-react}

Поширений підхід у старих веб-додатках — опис DOM-частин за допомогою рядків і їх вставка у DOM ось так: `$el.html(htmlString)`. Ці частинки коду ідеально підійдуть для інтеграції React. Просто перепишіть рендер на основі рядку в React-компонент.

Отже, наступний код jQuery...

```js
$('#container').html('<button id="btn">Say Hello</button>');
$('#btn').click(function() {
  alert('Hello!');
});
```

...можна переписати, використовуючи React-компонент:

```js
function Button() {
  return <button id="btn">Say Hello</button>;
}

$('#btn').click(function() {
  alert('Hello!');
});
```

З цього моменту можете починати передавати все більше логіки самому компоненту й застосовувати все більше й більше React-підходів до написання коду. Наприклад, у компонентах найкраще не покладатись на ідентифікатори тому, що один і той самий компонент може бути відрендерений декілька разів. Натомість, використовуємо [систему подій React](/docs/handling-events.html) та реєструємо метод-обробник події click безпосередньо на React-елементі `<button>`:

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
```

[**Спробувати на CodePen**](https://codepen.io/gaearon/pen/RVKbvW?editors=1010)

<<<<<<< HEAD
Ви можете написати скільки завгодно ізольованих компонентів, а також ренедрити їх у різних DOM-контейнерах за допомогою функції`ReactDOM.render()`. Поступово, коли трансформуєте все більше коду програми у React-компоненти, можна буде об’єднати їх в більші компоненти, а деякі з викликів до `ReactDOM.render()` — перемістити вгору за ієрархією.
=======
You can have as many such isolated components as you like, and use `ReactDOM.createRoot()` to render them to different DOM containers. Gradually, as you convert more of your app to React, you will be able to combine them into larger components, and move some of the `ReactDOM.createRoot()` calls up the hierarchy.
>>>>>>> e21b37c8cc8b4e308015ea87659f13aa26bd6356

### Вставка React у представлення Backbone {#embedding-react-in-a-backbone-view}

Представлення у [Backbone](https://backbonejs.org/) зазвичай використовують HTML-рядки або функції, які генерують рядкові шаблони, для створення вмісту їх DOM-елементів. Цей процес також може бути замінений за допомого рендеру React-компонентів.

<<<<<<< HEAD
Нижче – приклад того, як ми створюємо Backbone-представлення, що називається `ParagraphView`. Воно перевизначить `render()` метод Backbone для рендерингу React-компоненту `<Paragraph>` у DOM-елемент, наданий Backbone (`this.el`). Тут ми також використовуємо метод [`ReactDOM.render()`](/docs/react-dom.html#render):
=======
Below, we will create a Backbone view called `ParagraphView`. It will override Backbone's `render()` function to render a React `<Paragraph>` component into the DOM element provided by Backbone (`this.el`). Here, too, we are using [`ReactDOM.createRoot()`](/docs/react-dom-client.html#createroot):
>>>>>>> e21b37c8cc8b4e308015ea87659f13aa26bd6356

```js{7,11,15}
function Paragraph(props) {
  return <p>{props.text}</p>;
}

const ParagraphView = Backbone.View.extend({
  initialize(options) {
    this.reactRoot = ReactDOM.createRoot(this.el);
  },
  render() {
    const text = this.model.get('text');
    this.reactRoot.render(<Paragraph text={text} />);
    return this;
  },
  remove() {
    this.reactRoot.unmount();
    Backbone.View.prototype.remove.call(this);
  }
});
```

[**Спробувати на CodePen**](https://codepen.io/gaearon/pen/gWgOYL?editors=0010)

<<<<<<< HEAD
Важливо також викликати метод `ReactDOM.unmountComponentAtNode()` у середині методу `remove`, щоб React видаляв зареєстровані обробники подій та інші ресурси, які пов’язані з деревом компонентів, у момент, коли воно видаляється.
=======
It is important that we also call `root.unmount()` in the `remove` method so that React unregisters event handlers and other resources associated with the component tree when it is detached.
>>>>>>> e21b37c8cc8b4e308015ea87659f13aa26bd6356

Коли компонент видаляється з React-дерева *зсередини*, очищення проводиться автоматично. Проте оскільки ми видаляємо все дерево вручну, мусимо викликати цей метод.

## Інтеграція з шаром моделей {#integrating-with-model-layers}

Зазвичай рекомендується використовувати односпрямований потік даних, на кшталт [React-стану](/docs/lifting-state-up.html), [Flux](https://facebook.github.io/flux/) або [Redux](https://redux.js.org/). Проте React-компоненти можуть також використовувати шар даних з інших бібліотек і фреймворків.

### Використання моделей Backbone у React-компонентах {#using-backbone-models-in-react-components}

Обробка різних `change`-подій та форсування оновлень вручну — найпростіший спосіб використання [Backbone](https://backbonejs.org/)-моделей та колекцій всередині React-компонентів.

Компоненти, що відповідають за рендеринг моделей, будуть обробляти події типу `'change'`, а компоненти, що відповідають за рендеринг колекцій, обробляють `'add'`- та `'remove'`-події. В обох випадках для відображення нових даних потрібно викликати [`this.forceUpdate()`](/docs/react-component.html#forceupdate)

У наведеному нижче прикладі, `List`-компонент рендерить колекцію Backbone, використовуючи `Item`-компонент для того, аби відобразити окремі елементи цього списку.

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

[**Спробувати на CodePen**](https://codepen.io/gaearon/pen/GmrREm?editors=0010)

### Отримання даних із Backbone-моделей {#extracting-data-from-backbone-models}

Вищеописаний підхід вимагає, щоб ваші React-компоненти знали про використання моделей та колекцій Backbone у вашій програмі. Однак, якщо ви плануєте пізніше перейти на інше рішення для управління даними, варто сконцентрувати використання Backbone у якомога меншій кількості рядків коду.

Одне з рішень — з кожною зміною моделі, «витягувати» атрибути моделі як прості дані і зберігати всю цю логіку в одному місці. Ось — [компонент вищого порядку](/docs/higher-order-components.html), що отримує всі атрибути Backbone-моделі та передає їх до компоненту, що огортається.

Таким чином, тільки компонент вищого порядку має знати про властивості Backbone-моделі, а більшість компонентів у додатку можуть й далі собі функціонувати, не відаючи про Backbone.

У прикладі нижче, робимо копію атрибутів моделі для утворення початкового стану. Підписуємося на подію `change` (і відписуємося під час демонтування), і коли ця подія спрацює, оновимо стан поточними атрибутами моделі. Нарешті переконуємось, що якщо сам model-проп змінюється, ми не забудемо відписатися від старої моделі і підписатися на нову.

Зауважте, що цей приклад не охоплює усі способи взаємодії з Backbone. Але його має бути достатньо, щоб дати уявлення про загальний підхід:

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

Для прикладу його використання, з’єднуємо React-компонент `NameInput` з Backbone-моделлю й оновлюємо її атрибут `firstName`після кожної зміни поля введення:

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
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Example model={model} />);
```

[**Спробувати на CodePen**](https://codepen.io/gaearon/pen/PmWwwa?editors=0010)

Ця методика не обмежується лише Backbone. Ви можете використовувати React для роботи з будь-якою model-бібліотекою. Просто підпишіться на її зміни в методах життєвого циклу і, за бажанням, скопіюйте дані в локальний React-стан.
