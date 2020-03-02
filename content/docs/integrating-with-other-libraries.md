---
id: integrating-with-other-libraries
title: Взаємодія зі сторонніми бібліотеками
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

## Інтеграція з іншими візуальними бібліотеками Integrating with Other View Libraries {#integrating-with-other-view-libraries}

Вбудовування React у інші програми можливе завдяки гнучкості функції [`ReactDOM.render()`](/docs/react-dom.html#render)

Хоча React широко використовується для вставлення єдиниго кореневого компоненту в DOM, метод `ReactDOM.render()` також може бути викликаний багато разів для незалежних частин користувацького інтерфейсу, які можуть бути малими як кнопка й великими як окремий великий додаток.

Насправді саме так ми використовуємо React у Facebook. Такий підхід дозволяє нам писати програми по частинах і комбінувати їх із існуючими шаблонами, створеними на стороні сервера або з іншим клієнтським кодом.

### Заміна рядкових шаблонів за допомогою React {#replacing-string-based-rendering-with-react}

Поширений підхід в старих веб-додатках - опис і вставка частин DOM за допомогою рядків, наприклад: `$el.html(htmlString)`. Ці місця в кодовій базі ідеально підходять для заміни їх за допомогою React. Просто перепишіть рендер на основі рядку через компонент React.

Отже наступний jQuery код...

```js
$('#container').html('<button id="btn">Say Hello</button>');
$('#btn').click(function() {
  alert('Hello!');
});
```

...може бути переписаний за допомогою React компонента:

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

З цього моменту ви можете починати передавати все більше логіки самому компоненту і застосовувати все більше і більше React підходів до насписання коду. Наприклад, в компенентах не варто використовувати ідентифікатори тому, що один і той самий компонент може бути відрендерений декілька разів. Натомість, ми будемо використовувати [систему подій React](/docs/handling-events.html) та зареєструємо метод обробник події click безпосередньо на React елементі `<button>`:

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

[**Спробувати на CodePen**](https://codepen.io/gaearon/pen/RVKbvW?editors=1010)

Ви можете написати скільки завгодно ізольованих компонентів, а також рендерити їх у різних DOM контейнерах за допомогою функції `ReactDOM.render()`. Поступово, коли ви трансформуєте все більше коду програми, деякі з цих компонентів можна об'єднати у більші компоненти, а виклики до `ReactDOM.render()` можна перемістити вгору за ієрархією.

### Вставка React в Backbone {#embedding-react-in-a-backbone-view}

[Backbone](https://backbonejs.org/) пердставлення зазвичай використовують HTML рядки або функції, які генерують рядкові шаблони, для створення вмісту їх DOM елементів. Цей процес також може бути замінений за допомого рендеру компонентів React.

Нижче ми створимо Backbone представлення `ParagraphView`. Воно перевизначить метод `render()` з Backbone для рендерингу React компоненту `<Paragraph>`  в елемент DOM, наданий Backbone (`this.el`). Також ми використовуємо метод [`ReactDOM.render()`](/docs/react-dom.html#render):

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

[**Спробувати на CodePen**](https://codepen.io/gaearon/pen/gWgOYL?editors=0010)

Варто особливо відміти, що ми викликаємо метод `ReactDOM.unmountComponentAtNode()` в середині методу `remove`. Таким чином React видаляє зареєстровані обробники подій та інші ресурси, які пов'язані з деревом компонентів в момент коли воно видаляється.

Коли компонент видаляється з дерева React *зсередини*, очищення проводиться автоматично, але оскільки ми видаляємо усе дерево вручну, то зобов'язані викликати цей метод.

## Інтеграція з рівнем моделей {#integrating-with-model-layers}

Зазвичай рекомендується використовувати односпрямований потік даних, на кшталт [React стан](/docs/lifting-state-up.html), [Flux](https://facebook.github.io/flux/) або [Redux](https://redux.js.org/). Але компоненти React можуть також використовувати шар даних з інших бібліотек і фреймворків.

### Використання Backbone моделей в React компонентах {#using-backbone-models-in-react-components}

Прослуховування різних подій та вручну форсування оновлень — найпростіший спосіб використання [Backbone](https://backbonejs.org/) моделей та колекцій всередині React компонентів.

Компоненти, що відповідають за рендеринг моделей, будуть обробляти події типу `'change'`, а компоненти, що відповідають за рендеринг колекцій, будуть обробляти події типів `'add'` та `'remove'`. В обох випадках для відображення нових даних потрібно викликати [`this.forceUpdate()`](/docs/react-component.html#forceupdate)

У наведеному нижче прикладі компонент `List` рендерить Backbone колекцію, а окремі елементи цього списку відображаються за допомогою компонента `Item`.

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

### Отримання даних з моделей Backbone {#extracting-data-from-backbone-models}

Вищеописаний підхід вимагає, щоб ваші React компоненти були обізнані про використання Backbone моделей та колекцій у вашій програмі. Однак якщо ви плануєте пізніше перейти на інше рішення для управління даними, варто концентрувати використання коду який стосується Backbone.

Один з підходів — коли при кожній зміні моделі, ви отримуєте її атрибути у вигляді простих даних і зберігайте всю логіку в одному місці. Наступний [компонент вищого порядку](/docs/higher-order-components.html) отримує всі атрибути Backbone моделі та передає їх до компоненту який огортає.

В такий спосіб, тільки компонент вищого порядку має знати про модель Backbone, а більшість компонентів в додатку можуть нічого й не знати про Backbone.

В прикладі нижче, ми зробимо копію атрибутів моделі для утворення початкового стану. Ми підпишемось на подію `change` (та відпишемось від неї при демонтуванні), і коли ця подія спрацює ми оновимо стан поточними атрибутами моделі. Нарешті, ми переконаємось, що будь-яка зміна властивостей `model` призведе до видалення підписки зі старої моделі та підключення до нових змін.

Зауважте, що цей приклад охоплює не всі способи взаємодії з Backbone. Але його має бути достатньо, щоб проілюструвати, загальний ідею цього підходу:

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

Для демонстрації використання ми з'єднаємо React компонент `NameInput` з Backbone моделлю і будемо оновлювати її атрибут `firstName` при кожній зміні поля введення:

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

[**Спробувати на CodePen**](https://codepen.io/gaearon/pen/PmWwwa?editors=0010)

Ця методика не обмежується лише Backbone. Ви можете використовувати будь-яку бібліотеку для роботи з даними разом з React. Просто підпишіться на зміни методів життєвого циклу компонентів і, при необхідності, скопіюйте дані в локальний стан React.
