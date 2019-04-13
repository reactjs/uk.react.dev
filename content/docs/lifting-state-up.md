---
id: lifting-state-up
title: Підйом стану
permalink: docs/lifting-state-up.html
prev: forms.html
next: composition-vs-inheritance.html
redirect_from:
  - "docs/flux-overview.html"
  - "docs/flux-todo-list.html"
---

Часто кілька компонентів повинні відображати ті ж самі зміни. Ми рекомендуємо підняти загальний стан до свого найближчого спільного предка. Давайте подивимося, як це працює.
<!--Often, several components need to reflect the same changing data. We recommend lifting the shared state up to their closest common ancestor. Let's see how this works in action.-->

У цьому розділі ми створимо калькулятор температури, який обчислює, чи буде вода закипати при заданій температурі.
<!--In this section, we will create a temperature calculator that calculates whether the water would boil at a given temperature.-->

Почнемо з компонента під назвою `BoilingVerdict`. Він приймає температуру `celsius` як проп, і виводе, чи її достатньо для закіпання:
<!--We will start with a component called `BoilingVerdict`. It accepts the `celsius` temperature as a prop, and prints whether it is enough to boil the water:-->

```js{3,5}
function BoilingVerdict(props) {
  if (props.celsius >= 100) {
    return <p>Вода закипить.</p>;
  }
  return <p>Вода не закипить.</p>;
}
```

Далі ми створимо компонент під назвою `Calculator`. Він рендерить `<input>`, що дозволяє вводити температуру і зберігає його значення в `this.state.temperature`.
<!--Next, we will create a component called `Calculator`. It renders an `<input>` that lets you enter the temperature, and keeps its value in `this.state.temperature`.->

Крім того, він рендерить `BoilingVerdict` для поточного вхідного значення.
<!--Additionally, it renders the `BoilingVerdict` for the current input value.-->

```js{5,9,13,17-21}
class Calculator extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {temperature: ''};
  }

  handleChange(e) {
    this.setState({temperature: e.target.value});
  }

  render() {
    const temperature = this.state.temperature;
    return (
      <fieldset>
        <legend>Введіть температуру в градусах Цельсія:</legend>
        <input
          value={temperature}
          onChange={this.handleChange} />
        <BoilingVerdict
          celsius={parseFloat(temperature)} />
      </fieldset>
    );
  }
}
```

[**Спробуйте на CodePen**](https://codepen.io/gaearon/pen/ZXeOBm?editors=0010)

## Додавання другого поля вводу {#adding-a-second-input}

Наша нова вимога полягає в тому, що, крім входу за Цельсієм, ми надаємо вхід Фаренгейта, і вони зберігаються в синхронізації.
<!--Our new requirement is that, in addition to a Celsius input, we provide a Fahrenheit input, and they are kept in sync.-->

Ми можемо почати з того, що дістанемо компонент `TemperatureInput` з `Calculator`. До нього додамо проп `scale`, який може бути `"c"` або `"f"`:
<!--We can start by extracting a `TemperatureInput` component from `Calculator`. We will add a new `scale` prop to it that can either be `"c"` or `"f"`:-->

```js{1-4,19,22}
const scaleNames = {
  c: 'Цельсій',
  f: 'Фаренгейт'
};

class TemperatureInput extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {temperature: ''};
  }

  handleChange(e) {
    this.setState({temperature: e.target.value});
  }

  render() {
    const temperature = this.state.temperature;
    const scale = this.props.scale;
    return (
      <fieldset>
        <legend>Введіть температуру в градусах {scaleNames[scale]}:</legend>
        <input value={temperature}
               onChange={this.handleChange} />
      </fieldset>
    );
  }
}
```

Тепер ми можемо змінити `Calculator` для рендеру двох окремих полів вводу температури:
<!--We can now change the `Calculator` to render two separate temperature inputs:-->

```js{5,6}
class Calculator extends React.Component {
  render() {
    return (
      <div>
        <TemperatureInput scale="c" />
        <TemperatureInput scale="f" />
      </div>
    );
  }
}
```

[**Спробуйте на CodePen**](https://codepen.io/gaearon/pen/jGBryx?editors=0010)

Зараз ми маємо два поля вводу, але коли ви вводите температуру в одному з них, інший не оновлюється. Це суперечить нашій вимозі: ми хочемо, щоб вони були синхронізовані.
<!--We have two inputs now, but when you enter the temperature in one of them, the other doesn't update. This contradicts our requirement: we want to keep them in sync.-->

Ми також не можемо відобразити `BoilingVerdict` з` Calculator`. `Calculator` не знає поточну температуру, тому що вона прихована всередині` TemperatureInput`.
<!--We also can't display the `BoilingVerdict` from `Calculator`. The `Calculator` doesn't know the current temperature because it is hidden inside the `TemperatureInput`.-->

## Написання функцій перетворення {#writing-conversion-functions}

По-перше, ми напишемо дві функції для перетворення з Цельсія на Фаренгейт і назад:
<!--First, we will write two functions to convert from Celsius to Fahrenheit and back:-->

```js
function toCelsius(fahrenheit) {
  return (fahrenheit - 32) * 5 / 9;
}

function toFahrenheit(celsius) {
  return (celsius * 9 / 5) + 32;
}
```

Ці дві функції перетворюють числа. Ми напишемо ще одну функцію, яка приймає рядок `temperature` і функцію перетворення `convert` як аргументи і повертає рядок. Ми будемо використовувати його для обчислення значення одного входу на основі іншого.
<!--These two functions convert numbers. We will write another function that takes a string `temperature` and a converter function as arguments and returns a string. We will use it to calculate the value of one input based on the other input.-->

Вона повертає порожній рядок при помилковому значенні `temperature`, або рядок, що відповідає значенню, округленому до третього числа після коми:
<!--It returns an empty string on an invalid `temperature`, and it keeps the output rounded to the third decimal place:-->

```js
function tryConvert(temperature, convert) {
  const input = parseFloat(temperature);
  if (Number.isNaN(input)) {
    return '';
  }
  const output = convert(input);
  const rounded = Math.round(output * 1000) / 1000;
  return rounded.toString();
}
```

Наприклад, `tryConvert('abc', toCelsius)` повертає порожній рядок, і `tryConvert('10.22', toFahrenheit)` повертає `'50.396'`.
<!--For example, `tryConvert('abc', toCelsius)` returns an empty string, and `tryConvert('10.22', toFahrenheit)` returns `'50.396'`.-->

## Підйом стану {#lifting-state-up}

В даний час обидва компоненти `TemperatureInput` незалежно зберігають свої значення в локальному стані:
<!--Currently, both `TemperatureInput` components independently keep their values in the local state:-->

```js{5,9,13}
class TemperatureInput extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {temperature: ''};
  }

  handleChange(e) {
    this.setState({temperature: e.target.value});
  }

  render() {
    const temperature = this.state.temperature;
    // ...  
```

Однак, ми хочемо, щоб ці два поля вводу були синхронізовані один з одним. Коли ми оновлюємо поле Цельсія, поле Фаренгейта повинне відображати перетворену температуру, і навпаки.
<!--However, we want these two inputs to be in sync with each other. When we update the Celsius input, the Fahrenheit input should reflect the converted temperature, and vice versa.-->

Обмін станом у React здійснюється шляхом переміщення його до найближчого спільного предка компонентів, які його потребують. Це називається "підйом стану вгору". Ми видалимо локальний стан з `TemperatureInput` і перемістимо його в `Calculator`.
<!--In React, sharing state is accomplished by moving it up to the closest common ancestor of the components that need it. This is called "lifting state up". We will remove the local state from the `TemperatureInput` and move it into the `Calculator` instead.-->

Якщо `Calculator` володіє спільним станом, він стає "джерелом істини" для поточної температури в обох полях вводу. Він може надати їм обом значення, які узгоджуються один з одним. Оскільки пропси обох компонентів `TemperatureInput` приходять з одного і того ж батьківського компонента `Calculator`, то їх поля вводу завжди будуть синхронізовані.
<!--If the `Calculator` owns the shared state, it becomes the "source of truth" for the current temperature in both inputs. It can instruct them both to have values that are consistent with each other. Since the props of both `TemperatureInput` components are coming from the same parent `Calculator` component, the two inputs will always be in sync.-->

Давайте подивимося, як це працює крок за кроком.
<!--Let's see how this works step by step.-->

Спершу ми будемо замінювати `this.state.temperature` на `this.props.temperature` в компоненті `TemperatureInput`. Наразі давайте представимо, що `this.props.temperature` вже існує, хоча в майбутньому нам доведеться передавати його з `Calculator`:
<!--First, we will replace `this.state.temperature` with `this.props.temperature` in the `TemperatureInput` component. For now, let's pretend `this.props.temperature` already exists, although we will need to pass it from the `Calculator` in the future:-->

```js{3}
  render() {
    // До того: const temperature = this.state.temperature;
    const temperature = this.props.temperature;
    // ...
```

Ми знаємо, що [пропси можна тільки читати](/docs/components-and-props.html#props-are-read-only). Коли `temperature` була в локальному стані, `TemperatureInput` можна було просто викликати `this.setState()`, щоб змінити його. Однак тепер, коли `temperature` надходить від батьківського компонента як пропс, `TemperatureInput` не має контролю над ним.
<!--We know that [props are read-only](/docs/components-and-props.html#props-are-read-only). When the `temperature` was in the local state, the `TemperatureInput` could just call `this.setState()` to change it. However, now that the `temperature` is coming from the parent as a prop, the `TemperatureInput` has no control over it.-->

У React це, як правило, вирішується шляхом створення "контрольованого" компонента. Так само, як DOM-елемент `<input>` приймає атрибути `value` і `onChange`, так і користувацький `TemperatureInput` може прийняти пропси `temperature` і `onTemperatureChange` зі свого батьківського компонента `Calculator`.
<!--In React, this is usually solved by making a component "controlled". Just like the DOM `<input>` accepts both a `value` and an `onChange` prop, so can the custom `TemperatureInput` accept both `temperature` and `onTemperatureChange` props from its parent `Calculator`.-->

Тепер, коли `TemperatureInput` "хоче" оновити свою температуру, він викликає `this.props.onTemperatureChange`:
<!--Now, when the `TemperatureInput` wants to update its temperature, it calls `this.props.onTemperatureChange`:-->

```js{3}
  handleChange(e) {
    // До того: this.setState({temperature: e.target.value});
    this.props.onTemperatureChange(e.target.value);
    // ...
```

>Примітка:
> 
>Немає спеціального сенсу в іменах `temperature` або `onTemperatureChange` в користувацьких компонентах. Ми могли б назвати їх будь-як інакше. Наприклад, `value` і `onChange`, що є загальноприйнятими значеннями.

Проп `onTemperatureChange` передасться разом з `temperature` від батьківського компонента `Calculator`. Він буде обробляти зміни, змінюючи свій власний локальний стан, і таким чином провокувати повторний рендер обох полів вводу з новими значеннями. Незабаром ми розглянемо нову реалізацію `Calculator`.
<!--The `onTemperatureChange` prop will be provided together with the `temperature` prop by the parent `Calculator` component. It will handle the change by modifying its own local state, thus re-rendering both inputs with the new values. We will look at the new `Calculator` implementation very soon.-->

Перед тим, як зануритися в зміни в `Calculator`, давайте підсумуємо наші зміни компонента `TemperatureInput`. Ми видалили з нього локальний стан, і замість `this.state.temperature` використовуємо `this.props.temperature`. Замість виклику `this.setState()`, коли ми хочемо внести зміни, тепер викликаємо `this.props.onTemperatureChange()`, який буде отриманий від компонента `Calculator`:
<!--Before diving into the changes in the `Calculator`, let's recap our changes to the `TemperatureInput` component. We have removed the local state from it, and instead of reading `this.state.temperature`, we now read `this.props.temperature`. Instead of calling `this.setState()` when we want to make a change, we now call `this.props.onTemperatureChange()`, which will be provided by the `Calculator`:-->

```js{8,12}
class TemperatureInput extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.props.onTemperatureChange(e.target.value);
  }

  render() {
    const temperature = this.props.temperature;
    const scale = this.props.scale;
    return (
      <fieldset>
        <legend>Введіть температуру в градусах {scaleNames[scale]}:</legend>
        <input value={temperature}
               onChange={this.handleChange} />
      </fieldset>
    );
  }
}
```

Тепер перейдемо до компонента `Calculator`.
<!--Now let's turn to the `Calculator` component.-->

Ми будемо зберігати значення `temperature` і `scale` у своєму локальному стані. Це стан, який ми "підняли" з полів вводу, і він буде служити "джерелом істини" для них обох. Це мінімальне представлення всіх даних, які ми повинні знати, щоб відрендерити обидва поля вводу.
<!--We will store the current input's `temperature` and `scale` in its local state. This is the state we "lifted up" from the inputs, and it will serve as the "source of truth" for both of them. It is the minimal representation of all the data we need to know in order to render both inputs.-->

Наприклад, якщо ми введемо 37 у поле Цельсія, стан компонента `Calculator` буде:
<!--For example, if we enter 37 into the Celsius input, the state of the `Calculator` component will be:-->

```js
{
  temperature: '37',
  scale: 'c'
}
```

Якщо ми пізніше змінимо поле Фаренгейта на 212, стан компонента `Calculator` буде:
<!--If we later edit the Fahrenheit field to be 212, the state of the `Calculator` will be:-->

```js
{
  temperature: '212',
  scale: 'f'
}
```

Ми могли б зберегти значення обох входів, але це непотрібно. Достатньо зберегти значення останнього зміненого поля вводу і шкалу, яку він представляє. Тоді ми можемо зробити висновок про значення іншого входу, виходячи з поточних `temperature` і `scale.
<!--We could have stored the value of both inputs but it turns out to be unnecessary. It is enough to store the value of the most recently changed input, and the scale that it represents. We can then infer the value of the other input based on the current `temperature` and `scale` alone.-->

Поля вводу залишаються синхронізованими, оскільки їх значення обчислюються з одного і того ж стану:
<!--The inputs stay in sync because their values are computed from the same state:-->

```js{6,10,14,18-21,27-28,31-32,34}
class Calculator extends React.Component {
  constructor(props) {
    super(props);
    this.handleCelsiusChange = this.handleCelsiusChange.bind(this);
    this.handleFahrenheitChange = this.handleFahrenheitChange.bind(this);
    this.state = {temperature: '', scale: 'c'};
  }

  handleCelsiusChange(temperature) {
    this.setState({scale: 'c', temperature});
  }

  handleFahrenheitChange(temperature) {
    this.setState({scale: 'f', temperature});
  }

  render() {
    const scale = this.state.scale;
    const temperature = this.state.temperature;
    const celsius = scale === 'f' ? tryConvert(temperature, toCelsius) : temperature;
    const fahrenheit = scale === 'c' ? tryConvert(temperature, toFahrenheit) : temperature;

    return (
      <div>
        <TemperatureInput
          scale="c"
          temperature={celsius}
          onTemperatureChange={this.handleCelsiusChange} />
        <TemperatureInput
          scale="f"
          temperature={fahrenheit}
          onTemperatureChange={this.handleFahrenheitChange} />
        <BoilingVerdict
          celsius={parseFloat(celsius)} />
      </div>
    );
  }
}
```

[**Спробуйте на CodePen**](https://codepen.io/gaearon/pen/WZpxpz?editors=0010)

Тепер, незалежно від того, яке поле ви редагуєте, `this.state.temperature` і` this.state.scale` в `Calculator` будуть оновлені. Одне з полів отримає значення, яке ввів користувач, а інше - значення, перераховане на його основі.
<!--Now, no matter which input you edit, `this.state.temperature` and `this.state.scale` in the `Calculator` get updated. One of the inputs gets the value as is, so any user input is preserved, and the other input value is always recalculated based on it.-->

Давайте підсумуємо, що відбувається, коли ви редагуєте поля вводу:
<!--Let's recap what happens when you edit an input:-->

* React викликає функцію, задану як `onChange` в DOM-елементі `<input>`. У нашому випадку, це метод `handleChange` в компоненті `TemperatureInput`.
* Метод `handleChange` в компоненті `TemperatureInput` викликає `this.props.onTemperatureChange()` з новим значенням. Його пропси, включаючи `onTemperatureChange`, були надані його батьківським компонентом `Calculator`.
* Коли він раніше був відрендерений, `Calculator` вказав, що `onTemperatureChange` компонента `TemperatureInput` за Цельсієм є методом `handleCelsiusChange` компонента  `Calculator`, а `onTemperatureChange` компонента `TemperatureInput` за Фаренгейтом є методом `handleFahrenheitChange` компонента  `Calculator`. Таким чином, будь-який з цих двох методів `Calculator` викликається в залежності від того, яке поле вводу ми редагували.
* Усередині цих методів компонент `Calculator` просить React повторно зробити рендер самого себе, шляхом виклику `this.setState()` з новим вхідним значенням і поточною шкалою вводу, яку ми щойно редагували.
* React викликає метод `render` компонента` Calculator`, щоб дізнатися, як повинен виглядати UI. Значення обох полів вводу перераховуються на основі поточної температури і шкали. Також тут відбувається перетворення температури.
* React викликає методи `render` окремих компонентів `TemperatureInput` з новими пропсами, визначеними `Calculator`, і дізнається, як повинен виглядати їх UI.
* React викликає метод `render` компонента `BoilingVerdict`, передаючи температуру в градусах Цельсія в якості пропу.
* React DOM оновлює DOM у відповідності значенням в полях вводу. Поле, яке ми щойно редагували, отримує поточне значення, а інше - оновлюється до температури після перетворення.

Кожне оновлення проходить ті ж кроки, щоб поля вводу залишалися синхронізованими.
<!--Every update goes through the same steps so the inputs stay in sync.-->

## Засвоєні уроки {#lessons-learned}

Необхідно створити єдине "джерело істини" для будь-яких даних, які змінюються у додатку React. Зазвичай стан спочатку додають до компонента, який його потребує для рендеринга. Потім, якщо інші компоненти також потребують цього, ви можете підняти його до свого найближчого спільного предка. Замість того, щоб намагатися синхронізувати стан між різними компонентами, слід покладатися на [потік даних вниз](/docs/state-and-lifecycle.html#the-data-flows-down).
<!--There should be a single "source of truth" for any data that changes in a React application. Usually, the state is first added to the component that needs it for rendering. Then, if other components also need it, you can lift it up to their closest common ancestor. Instead of trying to sync the state between different components, you should rely on the [top-down data flow](/docs/state-and-lifecycle.html#the-data-flows-down).-->

Підйом стану передбачає написання більше "шаблону" коду, ніж двосторонній підхід до зв'язування даних. В результаті це надасть нам певні певаги - щоб знайти і ізолювати помилки потрібно буде затратити менше часу. Оскільки будь-який стан "живе" в певному компоненті і сам компонент може його змінити, місця пошуку помилок значно зменшуються. Крім того, ви можете реалізувати будь-яку користувацьку логіку, щоб відхилити або перетворити дані, введені користувачем.
<!--Lifting state involves writing more "boilerplate" code than two-way binding approaches, but as a benefit, it takes less work to find and isolate bugs. Since any state "lives" in some component and that component alone can change it, the surface area for bugs is greatly reduced. Additionally, you can implement any custom logic to reject or transform user input.-->

Якщо щось може бути отримано або з пропсів, або з стану, це, ймовірно, не повинно бути в стані. Наприклад, замість того, щоб зберігати і `celsiusValue`, і `fahrenheitValue`, ми зберігаємо тільки останню редаговану `температуру` і її `шкалу`. Значення інших вхідних даних завжди може бути обчислено з них у методі `render()`. Це дозволяє очистити або застосувати округлення до іншого поля без втрати будь-якої точності введених даних користувачем.
<!--If something can be derived from either props or state, it probably shouldn't be in the state. For example, instead of storing both `celsiusValue` and `fahrenheitValue`, we store just the last edited `temperature` and its `scale`. The value of the other input can always be calculated from them in the `render()` method. This lets us clear or apply rounding to the other field without losing any precision in the user input.-->

Коли ви бачите яку помилку в UI, ви можете скористатися [React Developer Tools](https://github.com/facebook/react-devtools) для перевірки пропсів і переміщення вгору по дереву, поки не знайдете компонент, відповідальний за оновлення стану. Це дозволяє відслідковувати джерело помилок:
<!--When you see something wrong in the UI, you can use [React Developer Tools](https://github.com/facebook/react-devtools) to inspect the props and move up the tree until you find the component responsible for updating the state. This lets you trace the bugs to their source:-->

<img src="../images/docs/react-devtools-state.gif" alt="Контроль стану в React DevTools" max-width="100%" height="100%">

