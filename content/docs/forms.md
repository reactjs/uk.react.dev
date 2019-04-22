---
id: forms
title: Форми
permalink: docs/forms.html
prev: lists-and-keys.html
next: lifting-state-up.html
redirect_from:
  - "tips/controlled-input-null-value.html"
  - "docs/forms-zh-CN.html"
---

В React HTML-елементи форм працюють дещо інакше ніж інші DOM-елементи, тому що елементи форм від початку мають певний внутрішній стан. Наприклад, в цю HTML-форму можна ввести ім'я:

```html
<form>
  <label>
    Ім'я:
    <input type="text" name="name" />
  </label>
  <input type="submit" value="Надіслати" />
</form>
```

За замовчуванням браузер переходить на іншу сторінку при відправленні HTML-форм, в тому числі і цієї. Якщо вас це влаштовує, то не треба нічого міняти, в React форми працюють як зазвичай. Однак, найчастіше форму зручніше обробляти за допомогою JavaScript-функції, у якій є доступ до введених даних. Стандартний спосіб реалізації такої поведінки називається "керовані компоненти".

## Керовані компоненти {#controlled-components}

В HTML елементи форми, такі як `<input>`, `<textarea>` і `<select>`, зазвичай самі керують своїм станом і оновлюють його коли користувач вводить дані. В React змінний стан зазвичай міститься у властивості стану компонентів і оновлюється тільки через виклик [`setState()`](/docs/react-component.html#setstate)

Ми можемо скомбінувати обидва підходи і зробити стан React-компоненту "єдиним джерелом правди". Тоді React-компонент, який буде рендерити форму, також буде контролювати її поведінку у відповідь введення даних користувача. Значення елемента форми в цьому випадку буде контролювати React, а сам елемент буде називатися "керований компонент".

Наприклад, якщо ми хочемо щоб у прикладі вище після відправлення форми передані дані виводилися у консолі, то ми можемо переписати форму як "керований компонент":

```javascript{4,10-12,24}
class NameForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: ''};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    alert('Ім'я, що було надіслано: ' + this.state.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Ім'я:
          <input type="text" value={this.state.value} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Надіслати" />
      </form>
    );
  }
}
```

[**Спробуйте це на CodePen**](https://codepen.io/gaearon/pen/VmmPgp?editors=0010)

Оскільки ми встановили атрибут `value` для нашого елементу форми, відображене значення завжди буде `this.state.value`, що робить стан React "джерелом правди". Оскільки `handleChange` працює при кожному натисканні клавіші для оновлення стану React, відображуване значення оновиться разом з вводом користувача.

З контрольованим компонентом кожна мутація стану матиме відповідну функцію обробника. Це дозволяє просто змінювати або перевіряти дані вводу користувача. Наприклад, якщо ми б хотіли встановити примусове правило, щоб імена були написані всіма великими літерами, ми могли б написати `handleChange` так:

```javascript{2}
handleChange(event) {
  this.setState({value: event.target.value.toUpperCase()});
}
```

## Тег textarea {#the-textarea-tag}

HTML-елемент `<textarea>` визначає введений текст я дочірній елемент:

```html
<textarea>
  Привіт, це текст у текстовій області
</textarea>
```

Натомість в React `<textarea>` використовує атрибут `value`. Таким чином, форма, яка використовує `<textarea>` може бути написана дуже подібно до форми, яка використовує однорядковий ввід:

```javascript{4-6,12-14,26}
class EssayForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 'Будь ласка, напишіть есе про ваш улюблений елемент DOM.'
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    alert('Есе, що було надіслано: ' + this.state.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Essay:
          <textarea value={this.state.value} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Надіслати" />
      </form>
    );
  }
}
```

Зверніть увагу на те, що `this.state.value` ініціалізується в конструкторі, так що область тексту з самого початку має певний текст.

## Тег select {#the-select-tag}

В HTML елемент `<select>` створює список, який можна відкрити. Наприклад, цей HTML створює список ароматів:

```html
<select>
  <option value="grapefruit">Грейпфрут</option>
  <option value="lime">Лайм</option>
  <option selected value="coconut">Кокос</option>
  <option value="mango">Манго</option>
</select>
```

Зверніть увагу на те, що опція "Кокос" обрана за замовчуванням за допомогою атрибуту `selected`. Замість того, щоб використовувати атрибут `selected`, React використовує атрибут `value` кореневого тегу `select`. Це зручніше в контрольованому компоненті, тому що потрібно оновити його лише в одному місці. Наприклад:

```javascript{4,10-12,24}
class FlavorForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: 'coconut'};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    alert('Ваш улюблений аромат: ' + this.state.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Оберіть ваш улюблений аромат:
          <select value={this.state.value} onChange={this.handleChange}>
            <option value="grapefruit">Грейпфрут</option>
            <option value="lime">Лайм</option>
            <option value="coconut">Кокос</option>
            <option value="mango">Манго</option>
          </select>
        </label>
        <input type="submit" value="Надіслати" />
      </form>
    );
  }
}
```

[**Спробуйте це на CodePen**](https://codepen.io/gaearon/pen/JbbEzX?editors=0010)

Загалом, все зроблено таким чином, що `<input type="text">`, `<textarea>` і `<select>` працюють дуже подібно — всі вони приймають атрибут `value`, який можна використовувати для реалізації контрольованого компоненту.

> Примітка
>
> Ви можете передати масив у атрибут `value`, що дозволяє вибрати декілька параметрів у тезі `select`:
>
>```js
><select multiple={true} value={['B', 'C']}>
>```

## Тег завантаження файлу {#the-file-input-tag}

В HTML, `<input type ="file">` дозволяє користувачеві вибрати один або кілька файлів зі сховища пристроїв, які будуть завантажені на сервер або маніпулювати ними за допомогою JavaScript через [File API](https://developer.mozilla.org/en-US/docs/Web/API/File/Using_files_from_web_applications).

```html
<input type="file" />
```

Оскільки його значення доступне лише для читання, це **неконтрольований** компонент в React. Це обговорюється разом з іншими неконтрольованими компонентами [пізніше в документації](/docs/uncontrolled-components.html#the-file-input-tag).

## Обробка кількох полів введення даних {#handling-multiple-inputs}

Коли вам потрібно обробляти декілька контрольованих елементів `input`, ви можете додати атрибут `name` до кожного елемента і дозволити функції-обробнику вибрати, що робити спираючись на значення `event.target.name`.

Наприклад:

```javascript{15,18,28,37}
class Reservation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isGoing: true,
      numberOfGuests: 2
    };

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  render() {
    return (
      <form>
        <label>
          Триває:
          <input
            name="isGoing"
            type="checkbox"
            checked={this.state.isGoing}
            onChange={this.handleInputChange} />
        </label>
        <br />
        <label>
          Кількість гостей:
          <input
            name="numberOfGuests"
            type="number"
            value={this.state.numberOfGuests}
            onChange={this.handleInputChange} />
        </label>
      </form>
    );
  }
}
```

[**Спробуйте це на CodePen**](https://codepen.io/gaearon/pen/wgedvV?editors=0010)

Зауважте як ми використали ES6 синтаксис для [розрахованих імен властивостей](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Object_initializer#Computed_property_names), щоб оновити стан за ключами які співпадають зі значенням атрибуту `name` відповідних полів введення:

```js{2}
this.setState({
  [name]: value
});
```

Це те ж саме що й такий ES5 код:

```js{2}
var partialState = {};
partialState[name] = value;
this.setState(partialState);
```

Крім того, оскільки `setState()` автоматично об'єднує [частковий стан у поточний стан](/docs/state-і-lifecycle.html#state-updates-are-merged), нам потрібно було лише викликати його зі зміненими частинами.

## Значення null контрольованого поля введення даних {#controlled-input-null-value}

Встановлення значення пропсу `value` в [контрольованому компоненті](/docs/forms.html#controlled-components) не дозволяє користувачеві змінювати введені дані, якщо ви цього не бажаєте. Якщо ви вказали `value`, але вхідні дані все ще можна редагувати, можливо, ви випадково встановили значення для `value`, як `undefined` або `null`.

Наступний код демонструє це. (Поле вводу спочатку заблоковане, але стає доступним для редагування після невеликої затримки.)

```javascript
ReactDOM.render(<input value="hi" />, mountNode);

setTimeout(function() {
  ReactDOM.render(<input value={null} />, mountNode);
}, 1000);

```

## Альтернативи контрольованим компонентам {#alternatives-to-controlled-components}

Іноді використання контрольованих компонентів може бути досить важким заняттям, оскільки вам потрібно написати обробник подій для кожного випадку, коли ваші дані можуть бути змінені, і провести весь стан форми через компонент React. Це може стати особливо дратівливим, коли ви перетворюєте вже наявну кодову базу в React, або інтегруєте програму React з бібліотекою, що не є реактивною. У таких ситуаціях можна спробувати [неконтрольовані компоненти](/docs/uncontrolled-components.html), як альтернативну техніку для обробки даних форм.

## Повноцінні рішення {#fully-fledged-solutions}

Якщо ви шукаєте комплексне рішення, включаючи перевірку, відстеження відвідуваних полів та обробку відправлення даних форми, то бібліотека [Formik](https://jaredpalmer.com/formik) є одним з популярних варіантів. Однак вона теж побудована на тих же принципах, що і контрольовані компоненти та керування станом — то ж не нехтуйте їх вивченням.
