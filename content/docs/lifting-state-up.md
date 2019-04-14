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

Часто кілька компонентів повинні відображати одні і ті ж зміни. Ми рекомендуємо підняти спільний стан до свого найближчого спільного предка. Давайте подивимося, як це працює.

У цьому розділі ми створимо калькулятор температури, який обчислює чи буде вода закипати при заданій температурі.

Почнемо з компонента під назвою `BoilingVerdict`. Він приймає температуру `celsius` як проп і виводить, чи її достатньо для закипання:

```js{3,5}
function BoilingVerdict(props) {
  if (props.celsius >= 100) {
    return <p>Вода закипить.</p>;
  }
  return <p>Вода не закипить.</p>;
}
```

Далі ми створимо компонент під назвою `Calculator`. Він рендерить `<input>`, що дозволяє вводити температуру і зберігає його значення в `this.state.temperature`.

Крім того, він рендерить `BoilingVerdict` для поточного введеного значення.

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

Наша нова вимога полягає в тому, що крім поля вводу за Цельсієм, ми надамо можливість вводити температуру за Фаренгейтом, і ці два поля будуть синхронізовані між собою.

Ми можемо почати з того, що витягнемо компонент `TemperatureInput` з `Calculator`. До нього додамо проп `scale` , який може бути `"c"` або `"f"`:

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

Ми також не можемо відобразити `BoilingVerdict` з` Calculator`. `Calculator` не знає поточну температуру, тому що вона прихована всередині `TemperatureInput`.

## Написання функцій перетворення {#writing-conversion-functions}

Для початку ми напишемо дві функції для перетворення температури з градусів по Цельсію у градуси по Фаренгейту і навпаки:

```js
function toCelsius(fahrenheit) {
  return (fahrenheit - 32) * 5 / 9;
}

function toFahrenheit(celsius) {
  return (celsius * 9 / 5) + 32;
}
```

Ці дві функції перетворюють числа. Ми напишемо ще одну функцію, яка приймає два аргумента: рядок `temperature` і функцію перетворення `convert`, і повертає рядок. Ми будемо використовувати його для обчислення значення одного поля вводу на основі іншого.

Функція повертатиме порожній рядок при помилковому значенні `temperature` або рядок, що відповідає значенню, округленому до третього числа після коми:

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

Наприклад, `tryConvert('abc', toCelsius)` повертає порожній рядок і `tryConvert('10.22', toFahrenheit)` повертає `'50.396'`.

## Підйом стану {#lifting-state-up}

В даний час обидва компоненти `TemperatureInput` незалежно зберігають свої значення в локальному стані:

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

Однак ми хочемо, щоб ці два поля вводу були синхронізовані одне з одним. Коли ми оновлюємо поле Цельсія, поле Фаренгейта повинне відображати перетворену температуру і навпаки.

Обмін станом у React здійснюється шляхом переміщення його до найближчого спільного предка компонентів, які його потребують. Це називається "підйом стану вгору". Ми видалимо локальний стан з `TemperatureInput` і перемістимо його в `Calculator`.

Якщо `Calculator` володіє спільним станом, він стає "джерелом істини" для поточної температури в обох полях вводу. Він може надати їм обом значення, які узгоджуються один з одним. Оскільки пропси обох компонентів `TemperatureInput` приходять з одного і того ж батьківського компонента `Calculator`, то їх поля вводу завжди будуть синхронізовані.

Давайте подивимося, як це працює крок за кроком.

Спершу ми замінимо `this.state.temperature` на `this.props.temperature` у компоненті `TemperatureInput`. Наразі давайте вдамо, що `this.props.temperature` вже існує, хоча в майбутньому нам доведеться передавати його з `Calculator`:

```js{3}
  render() {
    // До того: const temperature = this.state.temperature;
    const temperature = this.props.temperature;
    // ...
```

Ми знаємо, що [пропси можна тільки читати](/docs/components-and-props.html#props-are-read-only). Коли `temperature` була в локальному стані, в компоненті `TemperatureInput` можна було просто викликати `this.setState()`, щоб змінити її. Однак тепер, коли `temperature` надходить від батьківського компонента як проп, `TemperatureInput` не має контролю над ним.

У React це, як правило, вирішується шляхом створення "контрольованого" компонента. Так само, як DOM-елемент `<input>` приймає атрибути `value` і `onChange`, так і користувацький `TemperatureInput` може прийняти пропси `temperature` і `onTemperatureChange` зі свого батьківського компонента `Calculator`.

Тепер, коли `TemperatureInput` "хоче" оновити свою температуру, він викликає `this.props.onTemperatureChange`:

```js{3}
  handleChange(e) {
    // До того: this.setState({temperature: e.target.value});
    this.props.onTemperatureChange(e.target.value);
    // ...
```

>Примітка:
> 
>Немає спеціального сенсу в іменах `temperature` або `onTemperatureChange` в користувацьких компонентах. Ми могли б назвати їх будь-як інакше. Наприклад, `value` і `onChange`, що є загальноприйнятими значеннями.

Проп `onTemperatureChange` передасться разом з пропом `temperature` від батьківського компонента `Calculator`. Він буде обробляти зміни, змінюючи свій власний локальний стан, і таким чином провокувати повторний рендер обох полів вводу з новими значеннями. Незабаром ми розглянемо нову реалізацію `Calculator`.

Перед тим як зануритися в зміни в `Calculator`, давайте підсумуємо наші зміни компонента `TemperatureInput`. Ми видалили з нього локальний стан і замість `this.state.temperature` використовуємо `this.props.temperature`. Замість виклику `this.setState()`, коли ми хочемо внести зміни, тепер викликаємо `this.props.onTemperatureChange()`, який буде отриманий від компонента `Calculator`:

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

Ми будемо зберігати значення `temperature` і `scale` у його локальному стані. Це стан, який ми "підняли" з полів вводу, і він буде служити "джерелом істини" для них обох. Це мінімальне представлення всіх даних, які ми повинні знати, щоб відрендерити обидва поля вводу.

Наприклад, якщо ми введемо 37 у поле Цельсія, стан компонента `Calculator` буде:

```js
{
  temperature: '37',
  scale: 'c'
}
```

Якщо ми пізніше змінимо поле Фаренгейта на 212, стан компонента `Calculator` буде:

```js
{
  temperature: '212',
  scale: 'f'
}
```

Ми могли б зберегти значення обох полів, але це непотрібно. Достатньо зберегти значення останнього зміненого поля вводу і шкалу, яку він представляє. Тоді ми можемо зробити висновок про значення іншого поля, виходячи з поточних `temperature` і `scale`.

Поля вводу залишаються синхронізованими, оскільки їх значення обчислюються з одного і того ж стану:

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

Давайте підсумуємо, що відбувається, коли ви редагуєте поля вводу:

* React викликає функцію, задану як `onChange` у DOM-елементі `<input>`. У нашому випадку, це метод `handleChange` у компоненті `TemperatureInput`.
* Метод `handleChange` у компоненті `TemperatureInput` викликає `this.props.onTemperatureChange()` з новим значенням. Його пропси, включно з `onTemperatureChange`, були надані його батьківським компонентом `Calculator`.
* Коли він раніше був відрендерений, `Calculator` вказав, що `onTemperatureChange` компонента `TemperatureInput` за Цельсієм є методом `handleCelsiusChange` компонента  `Calculator`, а `onTemperatureChange` компонента `TemperatureInput` за Фаренгейтом є методом `handleFahrenheitChange` компонента  `Calculator`. Таким чином, будь-який з цих двох методів `Calculator` викликається в залежності від того, яке поле вводу ми редагували.
* Усередині цих методів компонент `Calculator` просить React повторно зробити рендер самого себе, шляхом виклику `this.setState()` з новим введеним значенням і поточною шкалою вводу, яку ми щойно редагували.
* React викликає метод `render` компонента` Calculator`, щоб дізнатися, як повинен виглядати UI. Значення обох полів вводу перераховуються на основі поточної температури і шкали. Також тут відбувається перетворення температури.
* React викликає методи `render` окремих компонентів `TemperatureInput` з новими пропсами, визначеними `Calculator`, і дізнається, як повинен виглядати їх UI.
* React викликає метод `render` компонента `BoilingVerdict`, передаючи температуру в градусах Цельсія в якості пропу.
* React DOM оновлює DOM відповідно до значень полів вводу. Поле, яке ми щойно редагували, отримує поточне значення, а інше - оновлюється до температури після перетворення.

Кожне оновлення проходить ті ж кроки, щоб поля вводу залишалися синхронізованими.

## Засвоєні уроки {#lessons-learned}

Необхідно створити єдине "джерело істини" для будь-яких даних, які змінюються у додатку React. Зазвичай стан спочатку додають до компонента, який його потребує для рендеринга. Потім, якщо інші компоненти також потребують цього стану, ви можете підняти його до їхнього найближчого спільного предка. Замість того, щоб намагатися синхронізувати стан між різними компонентами, слід покладатися на [потік даних вниз](/docs/state-and-lifecycle.html#the-data-flows-down).

Підйом стану передбачає написання більше "шаблонного" коду, ніж при підході з двосторонньою прив'язкою даних. В результаті це надасть нам певні переваги - щоб знайти і ізолювати помилки потрібно буде затратити менше часу. Оскільки будь-який стан "живе" в певному компоненті і сам компонент може його змінити, область пошуку помилок значно зменшується. Крім того, ви можете реалізувати будь-яку користувацьку логіку, щоб відхилити або перетворити дані, введені користувачем.

Якщо щось може бути обчислено або з пропсів, або з стану, це, ймовірно, не повинно бути в стані. Наприклад, замість того, щоб зберігати і `celsiusValue`, і `fahrenheitValue`, ми зберігаємо тільки останню редаговану `temperature` і її `scale`. Значення інших вхідних даних завжди може бути обчислено на їх основі у методі `render()`. Це дозволяє очистити або застосувати округлення до іншого поля без втрати будь-якої точності введених даних користувачем.

Коли ви бачите якусь помилку в UI, ви можете скористатися [React Developer Tools](https://github.com/facebook/react-devtools) для перевірки пропсів і переміщуватися вгору по дереву, поки не знайдете компонент, відповідальний за оновлення стану. Це дозволяє відслідковувати джерело помилок:

<img src="../images/docs/react-devtools-state.gif" alt="Контроль стану в React DevTools" max-width="100%" height="100%">

