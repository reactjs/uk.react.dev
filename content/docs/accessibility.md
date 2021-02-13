---
id: accessibility
title: Доступність
permalink: docs/accessibility.html
---

## Навіщо нам доступність? {#why-accessibility}

Веб-доступність (також відома як [**a11y**](https://en.wiktionary.org/wiki/a11y)) ґрунтується на дизайні та розробці сайтів, які можуть використовуватися будь-ким. Підтримка доступності необхідна, щоб дозволити допоміжним технологіям інтерпретувати веб-сторінки.

React повністю підтримує створення доступних веб-сайтів, часто за допомогою стандартних методів HTML.

## Стандарти та рекомендації {#standards-and-guidelines}

### WCAG {#wcag}

[Правила доступності веб-контенту (Web Content Accessibility Guidelines)](https://www.w3.org/WAI/intro/wcag) надають рекомендації щодо створення доступних веб-сайтів.

Наступні контрольні списки WCAG надають огляд загальних правил:

- [Контрольний список WCAG від Wuhcag](https://www.wuhcag.com/wcag-checklist/)
- [Контрольний список WCAG від WebAIM](https://webaim.org/standards/wcag/checklist)
- [Список від проекту A11Y](https://a11yproject.com/checklist.html)

### WAI-ARIA {#wai-aria}

Документ [Web Accessibility Initiative - Accessible Rich Internet Applications](https://www.w3.org/WAI/intro/aria) містить набір технік для розробки повністю доступних JavaScript-віджетів.

Зверніть увагу, що всі `aria-*` HTML-атрибути повністю підтримуються у JSX. У той час як більшість DOM-властивостей і атрибутів у React записуються у верблюжому регістрі (camelСase, ще називають горба́тий регістр, верблюже письмо), ці атрибути мають бути записані у дефіс-регістрі (hyphen-case, також відомий як кебаб-регістр, LISP-регістр, і т.д.), оскільки вони знаходяться у простому HTML:

```javascript{3,4}
<input
  type="text"
  aria-label={labelText}
  aria-required="true"
  onChange={onchangeHandler}
  value={inputValue}
  name="name"
/>
```

## Семантичний HTML {#semantic-html}
Семантичний HTML — це основа доступності у веб-застосунках. Використання різних елементів HTML для посилення значення інформації на наших веб-сайтах часто надає нам доступність «безкоштовно».

- [Повний перелік HTML-елементів на MDN](https://developer.mozilla.org/uk/docs/Web/HTML/%D0%95%D0%BB%D0%B5%D0%BC%D0%B5%D0%BD%D1%82)

Іноді ми порушуємо HTML-семантику, коли додаємо елементи `<div>` до нашого JSX, щоб наш React-код працював, особливо при роботі зі списками (`<ol>`, `<ul>` та `<dl>`) та `<table>` (HTML-таблиця).

У такому випадку краще використовувати [React-фрагменти](/docs/fragments.html), щоб згрупувати декілька елементів разом.

Наприклад,

```javascript{1,5,8}
import React, { Fragment } from 'react';

function ListItem({ item }) {
  return (
    <Fragment>
      <dt>{item.term}</dt>
      <dd>{item.description}</dd>
    </Fragment>
  );
}

function Glossary(props) {
  return (
    <dl>
      {props.items.map(item => (
        <ListItem item={item} key={item.id} />
      ))}
    </dl>
  );
}
```

Ви можете перетворити колекцію на масив фрагментів, так само як і на масив будь-яких інший елементів:

```javascript{6,9}
function Glossary(props) {
  return (
    <dl>
      {props.items.map(item => (
        // Фрагменти також повинні мати пропс `key` при відображенні колекцій
        <Fragment key={item.id}>
          <dt>{item.term}</dt>
          <dd>{item.description}</dd>
        </Fragment>
      ))}
    </dl>
  );
}
```

Коли вам не потрібні ніякі пропси тегу Fragment, ви можете скористатися [коротким синтаксисом](/docs/fragments.html#short-syntax), якщо ваш інструментарій це підтримує:

```javascript{3,6}
function ListItem({ item }) {
  return (
    <>
      <dt>{item.term}</dt>
      <dd>{item.description}</dd>
    </>
  );
}
```

Для більш детальної інформації, перегляньте [документацію фрагментів](/docs/fragments.html).

## Доступні форми {#accessible-forms}

### Підписи елементів форм {#labeling}
Кожен елемент HTML-форми, наприклад `<input>` або `<textarea>`, повинен мати підпис, який забезпечує доступність контенту. Підписи потрібно виконувати так, щоб їх могли використовувати екранні зчитувальні пристрої.

Наступні ресурси показують нам як це робити:

- [W3C показує, як підписувати елементи](https://www.w3.org/WAI/tutorials/forms/labels/)
- [WebAIM показує, як підписувати елементи](https://webaim.org/techniques/forms/controls)
- [Paciello Group пояснює доступні найменування](https://www.paciellogroup.com/blog/2017/04/what-is-an-accessible-name/)

Ці стандартні практики HTML можна використовувати безпосередньо в React, але зауважте, що атрибут `for` у JSX записується як `htmlFor`:

```javascript{1}
<label htmlFor="namedInput">Ім'я:</label>
<input id="namedInput" type="text" name="name"/>
```

### Повідомляємо користувача про помилки {#notifying-the-user-of-errors}

Випадки з помилками мають бути зрозумілими для всіх користувачів. Наступні посилання показують як зробити текст помилок доступним для пристроїв зчитування з екрану:

- [W3C демонструє повідомлення для користувача](https://www.w3.org/WAI/tutorials/forms/notifications/)
- [Погляд WebAIM на перевірку форм](https://webaim.org/techniques/formvalidation/)

## Контроль фокусу {#focus-control}

Переконайтеся, що ваш веб-додаток можна повноцінно використовувати, в тому числі, лише за допомогою клавіатури:

- [WebAIM розповідає про доступність при роботі з клавіатурою](https://webaim.org/techniques/keyboard/)

### Фокус клавіатури та контур елемента {#keyboard-focus-and-focus-outline}

Фокус клавіатури посилається на поточний елемент у DOM, який вибрано для отримання вводу з клавіатури. Зазвичай такий елемент виділяється контуром, як це показано на малюнку:

<img src="../images/docs/keyboard-focus.png" alt="Синій контур навколо посилання, вибраного з клавіатури." />

Використовуйте CSS, який видаляє цей контур (наприклад, встановлюючи `outline: 0`), тільки в тому випадку, якщо ви реалізуєте фокус-контур якимось іншим чином.

### Механізм швидкого переходу до бажаного змісту {#mechanisms-to-skip-to-desired-content}

Забезпечте механізм, що дозволяє користувачам пропускати розділи під час навігації у додатку, оскільки це допомагає і пришвидшує навігацію за допомогою клавіатури.

Так звані «пропускні посилання» чи «пропускні навігаційні посилання» - це приховані навігаційні посилання, які стають видимими лише тоді, коли користувачі клавіатури взаємодіють зі сторінкою. Їх дуже просто реалізувати за допомогою внутрішніх якорів сторінки та певного стилю:

- [WebAIM - пропускні навігаційні посилання](https://webaim.org/techniques/skipnav/)

Також використовуйте структурні елементи та ролі, такі як `<main>` та `<aside>`, для розмежування регіонів сторінок, оскільки допоміжна технологія дозволяє користувачеві швидко переходити до цих розділів.

Детальніше про використання цих елементів для підвищення доступності читайте тут:

- [Доступні орієнтири](https://www.scottohara.me/blog/2018/03/03/landmarks.html)

### Керуємо фокусом програмним шляхом {#programmatically-managing-focus}

Наші React-додатки постійно змінюють HTML DOM під час виконання, іноді це призводить до того, що фокус клавіатури втрачається або встановлюється на несподіваний елемент. Для того, щоб виправити це, нам потрібно програмно просунути фокус клавіатури в потрібному напрямку. Наприклад, після закриття модального вікна перевести фокус клавіатури на кнопку, яка його відкрила.

MDN Web Docs розглядає це і описує, як ми можемо побудувати [віджети JavaScript, орієнтовані на клавіатуру](https://developer.mozilla.org/en-US/docs/Web/Accessibility/Keyboard-navigable_JavaScript_widgets).

Щоб встановити фокус у React, ми можемо використовувати [рефи на елементи DOM](/docs/refs-and-the-dom.html).

Використовуючи цей спосіб, спочатку ми створюємо реф у класі компонента на елемент у JSX:

```javascript{4-5,8-9,13}
class CustomTextInput extends React.Component {
  constructor(props) {
    super(props);
    // Створюємо реф на текстове поле вводу як елемент DOM
    this.textInput = React.createRef();
  }
  render() {
  // Використовуємо зворотній виклик `ref` щоб зберегти реф на текстове поле вводу
  // як елемент DOM в полі екземпляру (наприклад, this.textInput).
    return (
      <input
        type="text"
        ref={this.textInput}
      />
    );
  }
}
```

Потім ми можемо примусово встановити фокус на елемент за потреби будь-де у нашому компоненті:

 ```javascript
 focus() {
   // Безпосередньо фокусуємося на текстовому полі за допомогою DOM API
   // Примітка: ми використовуємо властивість "current", щоб дістатися вузла DOM
   this.textInput.current.focus();
 }
 ```

Іноді батьківській компонент потребує встановити фокус на елементі у дочірньому компоненті. Ми можемо зробити це за допомогою [передачі DOM-рефів батьківським компонентам](/docs/refs-and-the-dom.html#exposing-dom-refs-to-parent-components) через спеціальний проп дочірнього компонента який передає батьківському компоненту реф на вузол DOM дочірнього компонента.

```javascript{4,12,16}
function CustomTextInput(props) {
  return (
    <div>
      <input ref={props.inputRef} />
    </div>
  );
}

class Parent extends React.Component {
  constructor(props) {
    super(props);
    this.inputElement = React.createRef();
  }
  render() {
    return (
      <CustomTextInput inputRef={this.inputElement} />
    );
  }
}

// Тепер ви можете встановити фокус, коли потрібно.
this.inputElement.current.focus();
```

Якщо ви використовуєте КВП щоб розширити компоненти, рекомендується [перенаправляти рефи](/docs/forwarding-refs.html) до обгорнутого компоненту за допомогою React-функції `forwardRef`. Якщо сторонній КВП не реалізує перенаправлення, підхід описаний вище все ще може бути використаний для зворотньої сумісності.

В якості чудового прикладу керування фокусом можна використовувати компонент [react-aria-modal](https://github.com/davidtheclark/react-aria-modal). Це доволі рідкий випадок реалізацій повністю доступного модального вікна. Мало того, що він задає початковий фокус
на кнопці "Скасувати" (заважає користувачеві клавіатури випадково активувати успішну дію) і захоплює фокус клавіатури всередині вікна, він також скидає фокус назад на елемент, який спочатку запустив модальне вікно.

>Примітка:
>
> Хоча це й дуже важлива функціональність доступності, вона водночас є технікою, яку слід використовувати обачливо. Використовуйте її для відновлення потоку фокусування на клавіатурі, коли його було порушено, але не для того, щоб намагатися передбачити, як користувачі хочуть використовувати додатки.

## Робота з подіями миші {#mouse-and-pointer-events}

Переконайтесь, що до всіх функціональних можливостей, реалізованих через події миші чи вказівника, можна також отримати доступ за допомогою самої клавіатури. Надмірна залежність від миші чи вказівника може призвести до багатьох випадків, коли користувачі клавіатури не зможуть використовувати вашу програму.

Щоб проілюструвати це, давайте розглянемо докладний приклад порушеної доступності, спричиненої подіями натискання кнопки миші. Це шаблон натискання кнопки миші поза елементом, коли користувач може закрити відкритий елемент, клацнувши поза ним.

<img src="../images/docs/outerclick-with-mouse.gif" alt="Кнопка перемикання, що відкриває список, реалізований за допомогою шаблону натискання кнопки миші поза елементом та керується мишкою, що показує, що подія закриття працює." />

Зазвичай це реалізується шляхом приєднання події `click` до об'єкту `window`, яка закриває відкритий елемент:

```javascript{12-14,26-30}
class OuterClickExample extends React.Component {
  constructor(props) {
    super(props);

    this.state = { isOpen: false };
    this.toggleContainer = React.createRef();

    this.onClickHandler = this.onClickHandler.bind(this);
    this.onClickOutsideHandler = this.onClickOutsideHandler.bind(this);
  }

  componentDidMount() {
    window.addEventListener('click', this.onClickOutsideHandler);
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.onClickOutsideHandler);
  }

  onClickHandler() {
    this.setState(currentState => ({
      isOpen: !currentState.isOpen
    }));
  }

  onClickOutsideHandler(event) {
    if (this.state.isOpen && !this.toggleContainer.current.contains(event.target)) {
      this.setState({ isOpen: false });
    }
  }

  render() {
    return (
      <div ref={this.toggleContainer}>
        <button onClick={this.onClickHandler}>Select an option</button>
        {this.state.isOpen && (
          <ul>
            <li>Option 1</li>
            <li>Option 2</li>
            <li>Option 3</li>
          </ul>
        )}
      </div>
    );
  }
}
```

Такий підхід добре працює для користувачів із вказівними пристроями, такими як миша, але робота з цим компонентом за допомогою самої клавіатури призводить до порушення функціональності при спробі перемкнутися на наступний елемент, оскільки об'єкт `window` ніколи не отримує події `click`. Це може призвести до того, що певну функціональність буде приховано, що заважатиме користувачам працювати з вашою програмою.

<img src="../images/docs/outerclick-with-keyboard.gif" alt="Кнопка перемикання, що відкриває список, реалізований за допомогою шаблону натискання кнопки миші поза елементом та керується клавіатурою, показуючи, що список не закривається під час перемикання фокусу з елементу, і тому перекриває інші елементи екрана." />

Тієї ж функціональності можна досягти, використовуючи натомість відповідні обробники подій, як `onBlur` та `onFocus`:

```javascript{19-29,31-34,37-38,40-41}
class BlurExample extends React.Component {
  constructor(props) {
    super(props);

    this.state = { isOpen: false };
    this.timeOutId = null;

    this.onClickHandler = this.onClickHandler.bind(this);
    this.onBlurHandler = this.onBlurHandler.bind(this);
    this.onFocusHandler = this.onFocusHandler.bind(this);
  }

  onClickHandler() {
    this.setState(currentState => ({
      isOpen: !currentState.isOpen
    }));
  }

  // Ми закриваємо відкритий список за допомогою setTimeout.
  // Це необхідно, щоб перевірити,
  // що інший дочірній елемент отримав фокус, оскільки
  // подія 'blur' відбувається завжди перед подією 'focus'.
  onBlurHandler() {
    this.timeOutId = setTimeout(() => {
      this.setState({
        isOpen: false
      });
    });
  }

  // Якщо дочірній елемент отримав фокус, то список не закриваємо.
  onFocusHandler() {
    clearTimeout(this.timeOutId);
  }

  render() {
    // React допомагає нам, підіймаючи події `blur` та
    // `focus` до батьківського елемента.
    return (
      <div onBlur={this.onBlurHandler}
           onFocus={this.onFocusHandler}>
        <button onClick={this.onClickHandler}
                aria-haspopup="true"
                aria-expanded={this.state.isOpen}>
          Select an option
        </button>
        {this.state.isOpen && (
          <ul>
            <li>Option 1</li>
            <li>Option 2</li>
            <li>Option 3</li>
          </ul>
        )}
      </div>
    );
  }
}
```

Цей код робить функціонал доступним як для вказівного пристрою, так і для користувачів клавіатури. Також зверніть увагу на додані `aria-*` властивості для підтримки користувачів пристроїв екранного зчитування. Задля простоти прикладу тут не було реалізовано перехід по списку за допомогою клавіш зі стрілками через події клавіатури.

<img src="../images/docs/blur-popover-close.gif" alt="Список, що правильно закривається для користувачів миші та клавіатури." />

Це один із прикладів багатьох випадків, коли залежно від подій лише вказівника та миші буде порушено функціональність для користувачів клавіатури. Постійне тестування за допомогою клавіатури негайно виділить проблемні області, які потім можна виправити, використовуючи обробники подій, які доступні для клавіатури.

## Більш складні рішення {#more-complex-widgets}

Ускладнення користувальницького інтерфейсу не повинно погіршувати доступність контенту. Незважаючи на те, що найкращий результат досягається при максимальному використанні синтаксису HTML, навіть дуже складний компонент можна зробити доступним для всіх.

Тут ми потребуємо знання [ARIA-ролей](https://www.w3.org/TR/wai-aria/#roles), а також [станів та властивостей ARIA ](https://www.w3.org/TR/wai-aria/#states_and_properties).
Наведені вище посилання є наборами інструкцій по HTML-атрибутам, які повністю підтримуються в JSX. Використовуючи їх, можна створювати високофункціональні і при цьому повністю доступні React-компоненти.

Кожен з таких компонентів наслідує спеціальний шаблон дизайну, та має функціонувати певним чином незалежно від користувача та агента користувача (браузера):

- [Практичні рекомендації WAI-ARIA по архітектурі та компонентам](https://www.w3.org/TR/wai-aria-practices/#aria_ex)
- [Приклади з блоґа Хейдона Піккерінга (Heydon Pickering)](https://heydonworks.com/practical_aria_examples/)
- [Інклюзивні компоненти](https://inclusive-components.design/)

## На що ще потрібно звернути увагу {#other-points-for-consideration}

### Встановлення мови сторінки {#setting-the-language}

Обов'язково вказуйте мову текста на сторінці. Це необхідно для правильних головних налаштувань екранних зчитувальних пристроїв:

- [WebAIM - визначення мови сторінок](https://webaim.org/techniques/screenreader/#language)

### Встановлення заголовка документа {#setting-the-document-title}

Встановіть `<title>` документа, щоб коректно визначити зміст сторінки, оскільки це дає змогу користувачеві орієнтуватися в контексті поточної сторінки:

- [WCAG - розуміння вимог до заголовка документа](https://www.w3.org/TR/UNDERSTANDING-WCAG20/navigation-mechanisms-title.html)

у React ми можемо зробити це, використовуючи [компонент «React Document Title»](https://github.com/gaearon/react-document-title).

### Контрастність кольорів {#color-contrast}

Переконайтесь, що весь текст для читання на вашому веб-сайті має достатній кольоровий контраст, щоб він залишався максимально доступним для зчитування користувачами зі слабким зором:

- [WCAG - розуміння вимог до контрастності кольорів](https://www.w3.org/TR/UNDERSTANDING-WCAG20/visual-audio-contrast-contrast.html)
- [Все про контрастність кольорів і чому ви маєте переосмислити ваш підхід до неї](https://www.smashingmagazine.com/2014/10/color-contrast-tips-and-tools-for-accessibility/)
- [A11yProject - що таке контрастність кольорів](https://a11yproject.com/posts/what-is-color-contrast/)

Ручний розрахунок правильних поєднань кольорів для усіх випадків на вашому веб-сайті може бути досить важким. Замість цього ви можете [визначити всю доступну палітру кольорів за допомогою Colorable](https://jxnblk.com/colorable/).

Згадані нижче інструменти aXe та WAVE також включають тести на контрастність кольорів та повідомлять про помилки.

Якщо ви хочете розширити свої можливості тестування контрастності, ви можете скористатися цими інструментами:

- [WebAIM - інспектор контрастності кольорів](https://webaim.org/resources/contrastchecker/)
- [The Paciello Group - аналізатор контрастності кольорів](https://www.paciellogroup.com/resources/contrastanalyser/)

## Інструменти розробки та тестування {#development-and-testing-tools}

Існує багато інструментів, якими ми можемо скористатися для створення доступних веб-додатків.

## Клавіатура {#the-keyboard}

На сьогоднішній день найпростіша, а також одна з найважливіших перевірок - це тестування клавіатурою. Така перевірка дозволяє визначити доступність контенту на вашому сайті при роботі тільки з клавіатурою. Це можна зробити так:

1. Від'єднайте вашу мишу.
1. Використовуйте `Tab` та `Shift+Tab` для переміщення сторінкою.
1. Використовуйте `Enter` для активації елементів.
1. Якщо потрібно, використовуйте клавіші зі стрілками клавіатури для взаємодії з деякими елементами, такими як меню та списки, що випадають.

### Підтримка у розробці {#development-assistance}

Ми можемо перевірити певну доступнісну функціональність безпосередньо у JSX коді. Часто списки автоматичного доповнення, які передбачені в IDE з підтримкою JSX, доступні також для ролей, станів та властивостей ARIA. Також ми можемо скористатися наступним інструментом:

#### eslint-plugin-jsx-a11y {#eslint-plugin-jsx-a11y}

ESLint-плагін [eslint-plugin-jsx-a11y](https://github.com/evcohen/eslint-plugin-jsx-a11y) надає змогу аналізувати АСД (Абстрактне синтаксичне дерево) стосовно проблем доступності у вашому JSX. Багато IDE дозволяють інтегрувати ці висновки безпосередньо до аналізатору коду та вікна вихідного коду.

У [Create React App](https://github.com/facebookincubator/create-react-app) цей плагін активовано з певною підмножиною правил. Якщо ви хочете ввімкнути ще більше правил доступності, ви можете створити файл `.eslintrc` в корені вашого проекту з цим вмістом:

  ```json
  {
    "extends": ["react-app", "plugin:jsx-a11y/recommended"],
    "plugins": ["jsx-a11y"]
  }
  ```

### Тестування доступності в браузері {#testing-accessibility-in-the-browser}

Існує багато інструментів, які можуть запускати аудит доступності на веб-сторінках вашого браузера. Будь ласка, використовуйте їх у поєднанні з іншими перевірками доступності, згаданими тут, оскільки вони можуть перевірити тільки технічну доступність вашого HTML.

#### aXe, aXe-core та react-axe {#axe-axe-core-and-react-axe}

Deque Systems пропонує [aXe-core](https://github.com/dequelabs/axe-core) для автоматизованих тестів доступності ваших програм. Цей модуль включає інтеграцію для Selenium.

[The Accessibility Engine](https://www.deque.com/products/axe/) або aXe - це інспектор доступності в браузері на базі `aXe-core`.

Ви також можете використовувати модуль [react-axe](https://github.com/dylanb/react-axe), щоб бачити повідомлення про проблеми доступності у консолі безпосередньо під час розробки та перевірки помилок.

#### WebAIM WAVE {#webaim-wave}

[Web Accessibility Evaluation Tool](https://wave.webaim.org/extension/) - ще один інструмент для перевірки доступності в браузері.

#### Інспектори доступності да дерево доступності {#accessibility-inspectors-and-the-accessibility-tree}

[Дерево доступності](https://www.paciellogroup.com/blog/2015/01/the-browser-accessibility-tree/) - це підмножина дерева DOM, яка містить доступні об'єкти для кожного елемента DOM, що мають бути представлені допоміжним технологіям, таким як пристрої для зчитування екрану.

У деяких браузерах ми можемо легко переглядати інформацію про доступність кожного елемента в дереві доступності:

- [Використання інспектора доступності в Firefox](https://developer.mozilla.org/en-US/docs/Tools/Accessibility_inspector)
- [Використання інспектора доступності в Chrome](https://developers.google.com/web/tools/chrome-devtools/accessibility/reference#pane)
- [Використання інспектора доступності в OS X Safari](https://developer.apple.com/library/content/documentation/Accessibility/Conceptual/AccessibilityMacOSX/OSXAXTestingApps.html)

### Пристрої для зчитування екрану {#screen-readers}

Тестування за допомогою пристроїв зчитування екрану має бути невід'ємною частиною вашого тестування доступності.

Зверніть увагу, що комбінації веб-переглядача та пристрою зчитування мають значення. Рекомендується протестувати свою програму у веб-переглядачі, який найкраще підходить для певного пристрою зчитування екрану.

### Найпопулярніші пристрої зчитування екрану {#commonly-used-screen-readers}

#### NVDA в Firefox {#nvda-in-firefox}

[NonVisual Desktop Access](https://www.nvaccess.org/) або NVDA це зчитувач екрану з відкритим кодом, який широко використовується в Windows.

Зверніть увагу на настуні рекомендації по використанню NVDA:

- [WebAIM - використання NVDA для оцінки доступності](https://webaim.org/articles/nvda/)
- [Deque - клавіатурні скорочення для NVDA](https://dequeuniversity.com/screenreaders/nvda-keyboard-shortcuts)

#### VoiceOver в Safari {#voiceover-in-safari}

VoiceOver це інтегрований зчитувач екрану для пристроїв Apple.

Зверніться до наступних посібників з активації та використання VoiceOver:

- [WebAIM - використання VoiceOver для оцінки доступності](https://webaim.org/articles/voiceover/)
- [Deque - клавіатурні скорочення для VoiceOver на OS X](https://dequeuniversity.com/screenreaders/voiceover-keyboard-shortcuts)
- [Deque - клавіатурні скорочення VoiceOver для iOS](https://dequeuniversity.com/screenreaders/voiceover-ios-shortcuts)

#### JAWS в Internet Explorer {#jaws-in-internet-explorer}

[Job Access With Speech](https://www.freedomscientific.com/Products/software/JAWS/) або JAWS є широко використовуваним зчитувачем екранів у Windows.

Зверніться до наступних посібників, щоб якнайкраще скористатися JAWS:

- [WebAIM - використання JAWS для оцінки доступності](https://webaim.org/articles/jaws/)
- [Deque - клавіатурні скорочення для JAWS](https://dequeuniversity.com/screenreaders/jaws-keyboard-shortcuts)

### Інші пристрої зчитування екрану {#other-screen-readers}

#### ChromeVox в Google Chrome {#chromevox-in-google-chrome}

[ChromeVox](https://www.chromevox.com/) є інтегрованим зчитувачем екрана на Chromebook і доступний [як плагін](https://chrome.google.com/webstore/detail/chromevox/kgejglhpjiefppelpmljglcjbhoiplfn?hl=en) для Google Chrome.

Зверніться до наступних посібників, щоб якнайкраще скористатися ChromeVox:

- [Google Chromebook Help - використання вбудованого зчитувача екрану](https://support.google.com/chromebook/answer/7031755?hl=en)
- [ChromeVox: перелік класичних клавіатурних скорочень](https://www.chromevox.com/keyboard_shortcuts.html)
