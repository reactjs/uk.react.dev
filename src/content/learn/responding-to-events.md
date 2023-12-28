---
title: Реагування на події
---

<Intro>

React надає вам можливість додавати *обробники подій* до вашого JSX. Обробники подій — це ваші власні функції, які виконуватимуться у відповідь на різні взаємодії, як-от натискання мишкою, наведення курсора, фокусування в елементі введення даних у формі тощо.

</Intro>

<YouWillLearn>

* Різні способи написання обробника подій
* Як передати логіку обробки подій від батьківського компонента
* Поширення подій і як це зупинити

</YouWillLearn>

## Додавання обробників подій {/*adding-event-handlers*/}

Щоб додати обробник подій, спочатку визначте функцію, а потім [передайте її як проп](/learn/passing-props-to-a-component) у відповідний JSX-тег. Наприклад, ось кнопка, яка ще нічого не робить:

<Sandpack>

```js
export default function Button() {
  return (
    <button>
      Я нічого не роблю
    </button>
  );
}
```

</Sandpack>

Ви можете налаштувати показ повідомлення, коли користувач натискає на неї, виконавши ці три кроки:

1. Оголосіть функцію з назвою `handleClick` *усередині* вашого компонента `Button`.
2. Реалізуйте логіку всередині цієї функції (використовуйте `alert`, щоб показати повідомлення).
3. Додайте `onClick={handleClick}` до `<button>` JSX.

<Sandpack>

```js
export default function Button() {
  function handleClick() {
    alert('Ви натиснули на мене!');
  }

  return (
    <button onClick={handleClick}>
      Натисни на мене
    </button>
  );
}
```

```css
button { margin-right: 10px; }
```

</Sandpack>

Ви визначили функцію `handleClick`, а потім [передали її як проп](/learn/passing-props-to-a-component) до `<button>`. `handleClick` є **обробником події.** Функції-обробники подій:

* Зазвичай визначаються *всередині* ваших компонентів.
* Мають назви, які починаються з `handle`, після якого зазначена назва події.

Зазвичай, типова назва обробників подій складається з `handle` (`обробити`) та назви події. Ви часто побачите щось на кшталт `onClick={handleClick}`, `onMouseEnter={handleMouseEnter}` тощо.

Крім того, ви можете визначити обробник подій, вбудований у JSX:

```jsx
<button onClick={function handleClick() {
  alert('Ви натиснули на мене!');
}}>
```

Або більш стисло за допомогою функції зі стрілкою (анонімною):

```jsx
<button onClick={() => {
  alert('Ви натиснули на мене!');
}}>
```

Усі ці стилі рівноцінні. Вбудовані обробники подій зручні для коротких функцій.

<Pitfall>

Функції, що передаються обробникам подій, повинні передаватися, а не викликатися. Наприклад:

| передавання функції (правильно)     | виклик функції (неправильно)     |
| -------------------------------- | ---------------------------------- |
| `<button onClick={handleClick}>` | `<button onClick={handleClick()}>` |

Різниця незначна. У першому прикладі функція `handleClick` передається як обробник події `onClick`. Це вказує React запам'ятати її та викликати вашу функцію лише тоді, коли користувач натискає на кнопку.

У другому прикладі круглі дужки `()` наприкінці `handleClick()` викликають функцію *одразу* під час [рендерингу](/learn/render-and-commit) і без будь-яких натискань. Це відбувається тому, що JavaScript всередині [`{` і `} у JSX`](/learn/javascript-in-jsx-with-curly-braces) виконується одразу.

Коли ви пишете вбудований у JSX код, той самий підводний камінь з'являється трохи в іншому місці:

| передавання функції (правильно)            | виклик функції (неправильно)    |
| --------------------------------------- | --------------------------------- |
| `<button onClick={() => alert('...')}>` | `<button onClick={alert('...')}>` |


Передання вбудованого коду, подібного до цього, не запускатиметься після натискання — він виконуватиметься кожного разу під час рендерингу компонента:

```jsx
// Це сповіщення спрацьовує під час рендерингу компонента, а не після натискання!
<button onClick={alert('Ви натисли на мене!')}>
```

Якщо ви хочете визначити свій вбудований обробник подій, оберніть його в анонімну функцію так:

```jsx
<button onClick={() => alert('Ви натисли на мене!')}>
```

Замість того, щоб виконувати код всередині під час кожного рендеру, це створює функцію, яка буде викликатися пізніше.

В обох випадках ви хочете передати саме функцію:

* `<button onClick={handleClick}>` передає функцію `handleClick`.
* `<button onClick={() => alert('...')}>` передає функцію `() => alert('...')`.

[Докладніше про функції зі стрілками.](https://uk.javascript.info/arrow-functions-basics)

</Pitfall>

### Читання пропсів в обробниках подій {/*reading-props-in-event-handlers*/}

Оскільки обробники подій оголошені всередині компонента, вони мають доступ до пропсів компонента. Ось кнопка, при натисканні на яку відображається сповіщення з текстом із пропу `message` (повідомлення):

<Sandpack>

```js
function AlertButton({ message, children }) {
  return (
    <button onClick={() => alert(message)}>
      {children}
    </button>
  );
}

export default function Toolbar() {
  return (
    <div>
      <AlertButton message="Відтворюється!">
        Відтворити фільм
      </AlertButton>
      <AlertButton message="Завантажується!">
        Завантажити зображення
      </AlertButton>
    </div>
  );
}
```

```css
button { margin-right: 10px; }
```

</Sandpack>

У такий спосіб ці дві кнопки відображатимуть різні повідомлення. Спробуйте змінити повідомлення, які їм передаються.

### Передавання обробників подій як пропсів {/*passing-event-handlers-as-props*/}

Часто потрібно, щоб батьківський компонент визначав обробник подій для дочірнього. Розгляньте кнопки: залежно від того, де використовується компонент `Button`, ви можете виконати іншу функцію — до прикладу, одна відтворює фільм, а інша завантажує зображення. 

Для цього передайте проп як обробник подій, який компонент отримає від свого батька, ось так:

<Sandpack>

```js
function Button({ onClick, children }) {
  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}

function PlayButton({ movieName }) {
  function handlePlayClick() {
    alert(`Відтворюється ${movieName}!`);
  }

  return (
    <Button onClick={handlePlayClick}>
      Відтворити "{movieName}"
    </Button>
  );
}

function UploadButton() {
  return (
    <Button onClick={() => alert('Завантажується!')}>
      Завантажити зображення
    </Button>
  );
}

export default function Toolbar() {
  return (
    <div>
      <PlayButton movieName="Сервіс доставлення Кікі" />
      <UploadButton />
    </div>
  );
}
```

```css
button { margin-right: 10px; }
```

</Sandpack>

У цьому прикладі компонент `Toolbar` рендерить кнопки `PlayButton` і `UploadButton`:

- `PlayButton` передає `handlePlayClick` як проп `onClick` до `Button`.
- `UploadButton` передає `() => alert('Завантажується!')` як проп `onClick` до `Button`.

Нарешті, ваш компонент `Button` приймає проп `onClick`. Він передає цей проп одразу у вбудований тег браузера `<button>` за допомогою `onClick={onClick}`. Це вказує React викликати передану функцію після натискання.

Якщо ви використовуєте певну [систему дизайну](https://uxdesign.cc/everything-you-need-to-know-about-design-systems-54b109851969), то компоненти, як-от кнопки, зазвичай містять стилізацію, але не визначають поведінку. Натомість такі компоненти, як `PlayButton` і `UploadButton`, передаватимуть обробники подій.

### Іменування пропсів обробників подій {/*naming-event-handler-props*/}

Вбудовані компоненти, як-от `<button>` і `<div>`, підтримують лише [назви подій браузера](/reference/react-dom/components/common#common-props), як `onClick`. Однак, коли ви створюєте власні компоненти, ви можете назвати їхні пропси обробників подій як завгодно.

За домовленістю пропси обробників подій мають починатися з `on`, за якою йде велика літера.

Наприклад, проп `onClick` компонента `Button` міг би називатися `onSmash`:

<Sandpack>

```js
function Button({ onSmash, children }) {
  return (
    <button onClick={onSmash}>
      {children}
    </button>
  );
}

export default function App() {
  return (
    <div>
      <Button onSmash={() => alert('Відтворюється!')}>
        Відтворити фільм
      </Button>
      <Button onSmash={() => alert('Завантажується!')}>
        Завантажити зображення
      </Button>
    </div>
  );
}
```

```css
button { margin-right: 10px; }
```

</Sandpack>

У цьому прикладі `<button onClick={onSmash}>` показує, що браузерний тег `<button>` (нижній регістр) усе ще потребує проп із назвою `onClick`, але назва пропу, отримана вашим власним компонентом `Button`, повністю залежить від вас!

Якщо ваш компонент підтримує кілька типів взаємодії, ви можете назвати пропси обробників подій відповідно до мети їхнього застосування. Наприклад, цей компонент `Toolbar` отримує обробники подій `onPlayMovie` і `onUploadImage`:

<Sandpack>

```js
export default function App() {
  return (
    <Toolbar
      onPlayMovie={() => alert('Відтворюється!')}
      onUploadImage={() => alert('Завантажується!')}
    />
  );
}

function Toolbar({ onPlayMovie, onUploadImage }) {
  return (
    <div>
      <Button onClick={onPlayMovie}>
        Відтворити фільм
      </Button>
      <Button onClick={onUploadImage}>
        Завантажити зображення
      </Button>
    </div>
  );
}

function Button({ onClick, children }) {
  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}
```

```css
button { margin-right: 10px; }
```

</Sandpack>

Зверніть увагу, що компоненту `App` не потрібно знати, *що* `Toolbar` робитиме з `onPlayMovie` або `onUploadImage`. То вже частина реалізації `Toolbar`. Тут `Toolbar` передає їх як обробники `onClick` своїм компонентам `Button`, але він також може викликати їх потім у відповідь на певне сполучення клавіш. Іменування пропсів за типом взаємодії з програмою, як-от `onPlayMovie`, дає вам можливість змінити спосіб їх використання пізніше.
  
<Note>

Переконайтеся, що ви використовуєте відповідні теги HTML для своїх обробників подій. Наприклад, для обробки натискань використовуйте [`<button onClick={handleClick}>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button) замість `<div onClick={handleClick}>`. Використання наявного у браузері тегу `<button>` дає змогу використовувати вбудовані функції браузера, як-от навігація за допомогою клавіатури. Якщо вам не до вподоби початкова стилізація кнопки у браузері і ви бажаєте зробити її більше схожою на посилання чи інший елемент UI, використовуйте CSS. [Докладніше про створення доступної розмітки.](https://developer.mozilla.org/en-US/docs/Learn/Accessibility/HTML)
  
</Note>

## Поширення події {/*event-propagation*/}

Обробники подій також будуть реагувати на події від будь-яких дочірніх компонентів вашого компонента. Ми говоримо, що подія "спливає" ("bubbles") або "поширюється" ("propagates") деревом: вона починається з того місця, де відбулася подія, а потім піднімається деревом.

Цей `<div>` містить дві кнопки. `<div>` *і* кожна кнопка мають власні обробники `onClick`. Як ви думаєте, які обробники спрацюють, коли ви натиснете на кнопку?

<Sandpack>

```js
export default function Toolbar() {
  return (
    <div className="Toolbar" onClick={() => {
      alert('You clicked on the toolbar!');
    }}>
      <button onClick={() => alert('Відтворюється!')}>
        Відтворити фільм
      </button>
      <button onClick={() => alert('Завантажується!')}>
        Завантажити зображення
      </button>
    </div>
  );
}
```

```css
.Toolbar {
  background: #aaa;
  padding: 5px;
}
button { margin: 5px; }
```

</Sandpack>

Якщо ви натиснете на будь-яку кнопку, спочатку виконається її `onClick`, а потім `onClick` батьківського `<div>`. Отже, з'являться два повідомлення. Якщо ви натиснете на саму панель інструментів, виконається лише `onClick` батьківського `<div>`.

<Pitfall>

У React поширюються усі події, крім `onScroll`, який працює лише з тегом JSX, до якого ви його прикріплюєте.

</Pitfall>

### Зупинка поширення {/*stopping-propagation*/}

Обробники подій отримують лиш один аргумент — **об'єкт події**. За домовленістю його зазвичай оголошують як `e` — скорочено від "event", що означає "подія". Ви можете використовувати цей об'єкт для читання інформації про подію.

Цей об'єкт події також дозволяє зупинити поширення. Якщо ви хочете, щоб подія не дійшла до батьківських компонентів, вам потрібно викликати `e.stopPropagation()` подібно до цього компонента `Button`:

<Sandpack>

```js
function Button({ onClick, children }) {
  return (
    <button onClick={e => {
      e.stopPropagation();
      onClick();
    }}>
      {children}
    </button>
  );
}

export default function Toolbar() {
  return (
    <div className="Toolbar" onClick={() => {
      alert('You clicked on the toolbar!');
    }}>
      <Button onClick={() => alert('Відтворюється!')}>
        Відтворити фільм
      </Button>
      <Button onClick={() => alert('Завантажується!')}>
        Завантажити зображення
      </Button>
    </div>
  );
}
```

```css
.Toolbar {
  background: #aaa;
  padding: 5px;
}
button { margin: 5px; }
```

</Sandpack>

Коли ви натискаєте на кнопку:

1. React викликає обробник `onClick`, переданий до `<button>`.
2. Той обробник, що визначений у `Button`, спрацьовує так:
   * Викликає `e.stopPropagation()`, запобігаючи подальшому спливанню події.
   * Викликає функцію `onClick`, яка є пропом, переданим із компонента `Toolbar`.
3. Ця функція, що визначена у компоненті `Toolbar`, відображає відповідне для цієї кнопки сповіщення.
4. Оскільки поширення було зупинено, обробник `onClick` батьківського `<div>` *не* виконується.

У результаті виклику `e.stopPropagation()` після натискання на кнопки тепер показується лише одне сповіщення (від `<button>`), а не два (від `<button>` та від `<div>` із батьківської панелі інструментів). Натискання на кнопку — це не те саме, що натискання на панель інструментів довкола, тому для цього UI розумно зупинити поширення.

<DeepDive>

#### Події у фазі занурення {/*capture-phase-events*/}

У рідкісних випадках вам може знадобитися перехопити всі події для дочірніх елементах, *навіть якщо вони зупинили поширення*. Наприклад, можливо, ви хочете додавати кожен клік до аналітики незалежно від логіки поширення. Це можна зробити, додавши `Capture` у кінці назви події:

```js
<div onClickCapture={() => { /* цей код виконується спочатку */ }}>
  <button onClick={e => e.stopPropagation()} />
  <button onClick={e => e.stopPropagation()} />
</div>
```

Поширення кожної події складається із трьох фаз:

1. Вона рухається вниз, викликаючи всі обробники `onClickCapture` — занурення.
2. Викликає обробник `onClick` елемента, на який натиснули.
3. Вона рухається вгору, викликаючи всі обробники `onClick` — спливання.

Події у фазі занурення корисні для навігації (routers) чи аналітики, але ви, ймовірно, не будете використовувати їх безпосередньо у застосунку.

</DeepDive>

### Передавання обробників як альтернатива поширенню {/*passing-handlers-as-alternative-to-propagation*/}

Зверніть увагу, як цей обробник кліків виконує рядок коду, _а потім_ викликає проп `onClick` від батька:

```js {4,5}
function Button({ onClick, children }) {
  return (
    <button onClick={e => {
      e.stopPropagation();
      onClick();
    }}>
      {children}
    </button>
  );
}
```

Ви також можете додати більше коду до цього обробника перед викликом батьківського обробника події `onClick`. Цей патерн надає *альтернативу* поширенню. Це дає змогу дочірньому компоненту обробляти подію, а також батьківському — вказувати деяку додаткову поведінку. На відміну від поширення, це не відбувається автоматично. Але перевага цього патерну полягає в тому, що ви можете чітко стежити за всім ланцюжком коду, який виконується у відповідь на якусь подію.

Якщо ви покладаєтеся на поширення і вам важко відстежити, які обробники виконуються та чому, спробуйте натомість цей підхід.

### Запобігання стандартній поведінці {/*preventing-default-behavior*/}

Для деяких подій у браузері існує відповідна стандартна поведінка. Наприклад, подія надсилання форми `<form>`, яка відбувається після натискання на кнопку всередині неї, стандартно перезавантажить всю сторінку:

<Sandpack>

```js
export default function Signup() {
  return (
    <form onSubmit={() => alert('Надсилається!')}>
      <input />
      <button>Надіслати</button>
    </form>
  );
}
```

```css
button { margin-left: 5px; }
```

</Sandpack>

Ви можете викликати `e.preventDefault()` для об'єкта події, щоб цього не відбувалося:

<Sandpack>

```js
export default function Signup() {
  return (
    <form onSubmit={e => {
      e.preventDefault();
      alert('Надсилається!');
    }}>
      <input />
      <button>Надіслати</button>
    </form>
  );
}
```

```css
button { margin-left: 5px; }
```

</Sandpack>

Не плутайте `e.stopPropagation()` і `e.preventDefault()`. Вони обидва корисні, але не пов'язані між собою:

* [`e.stopPropagation()`](https://developer.mozilla.org/docs/Web/API/Event/stopPropagation) зупиняє виконання обробників подій, доданих до тегів вище деревом.
* [`e.preventDefault()` ](https://developer.mozilla.org/docs/Web/API/Event/preventDefault) запобігає стандартній поведінці браузера для кількох подій, які її мають.

## Чи можуть обробники подій мати побічні ефекти? {/*can-event-handlers-have-side-effects*/}

Звісно! Обробники подій — найкраще місце для побічних ефектів (side effects).

На відміну від функцій рендерингу, обробники подій не обов'язково мають бути [чистими](/learn/keeping-components-pure), тому це чудове місце, щоб щось *змінити* — наприклад, змінити значення у полі введення у відповідь на друкування або змінити список у відповідь на натискання на кнопку. Однак для того, щоб змінити деяку інформацію, вам спочатку потрібен спосіб її зберігання. У React це можна зробити за допомогою [стану — пам'яті компонента.](/learn/state-a-components-memory) Ви дізнаєтеся про все це на наступній сторінці.

<Recap>

* Ви можете обробляти події, передавши функцію як проп до елемента на зразок `<button>`.
* Необхідно передавати обробники подій, **а не викликати їх!** `onClick={handleClick}`, а не `onClick={handleClick()}`.
* Ви можете визначити функцію обробника подій окремо або всередині JSX.
* Обробники подій визначені всередині компонента, тому вони можуть отримати доступ до пропсів.
* Ви можете оголосити обробник події у батьківському елементі та передати його як проп дочірньому.
* Ви можете визначити власні пропси обробників подій із назвами, що відповідають меті їхнього застосування.
* Події поширюються (спливають) вгору. Викличте `e.stopPropagation()` для першого аргументу, щоб запобігти цьому.
* Події можуть мати небажану стандартну поведінку браузера. Викличте `e.preventDefault()`, щоб запобігти цьому.
* Явний виклик пропу обробника події в обробнику дочірнього компонента є хорошою альтернативою поширенню.

</Recap>



<Challenges>

#### Виправте обробник події {/*fix-an-event-handler*/}

Натискання цієї кнопки передбачає перемикання фону сторінки між білим і чорним кольорами. Однак нічого не відбувається, коли ви натискаєте на неї. Вирішіть проблему. (Не турбуйтеся про логіку всередині `handleClick` — ця частина в порядку.)

<Sandpack>

```js
export default function LightSwitch() {
  function handleClick() {
    let bodyStyle = document.body.style;
    if (bodyStyle.backgroundColor === 'black') {
      bodyStyle.backgroundColor = 'white';
    } else {
      bodyStyle.backgroundColor = 'black';
    }
  }

  return (
    <button onClick={handleClick()}>
      Перемкнути фон
    </button>
  );
}
```

</Sandpack>

<Solution>

Проблема полягає в тому, що `<button onClick={handleClick()}>` _викликає_ функцію `handleClick` під час рендерингу замість її _передавання_. Видалення виклику `()` ось так — `<button onClick={handleClick}>` — вирішує проблему:

<Sandpack>

```js
export default function LightSwitch() {
  function handleClick() {
    let bodyStyle = document.body.style;
    if (bodyStyle.backgroundColor === 'black') {
      bodyStyle.backgroundColor = 'white';
    } else {
      bodyStyle.backgroundColor = 'black';
    }
  }

  return (
    <button onClick={handleClick}>
      Перемкнути фон
    </button>
  );
}
```

</Sandpack>

Крім того, ви можете обернути виклик в іншу функцію, наприклад `<button onClick={() => handleClick()}>`:

<Sandpack>

```js
export default function LightSwitch() {
  function handleClick() {
    let bodyStyle = document.body.style;
    if (bodyStyle.backgroundColor === 'black') {
      bodyStyle.backgroundColor = 'white';
    } else {
      bodyStyle.backgroundColor = 'black';
    }
  }

  return (
    <button onClick={() => handleClick()}>
      Перемкнути фон
    </button>
  );
}
```

</Sandpack>

</Solution>

#### Під'єднайте події {/*wire-up-the-events*/}

Цей компонент `ColorSwitch` рендерить кнопку. Вона має змінювати колір сторінки. Під'єднайте її до пропу обробника події `onChangeColor`, який він отримує від батьківського елемента, щоб натискання кнопки змінювало колір.

Після цього зверніть увагу, що натискання кнопки також збільшує лічильник кліків сторінки. Ваш колега, який написав батьківський компонент, наполягає на тому, що `onChangeColor` не збільшує жодних лічильників. Що це таке відбувається? Виправте так, щоб натискання кнопки *лише* змінювало колір, а _не_ збільшувало лічильник.

<Sandpack>

```js src/ColorSwitch.js active
export default function ColorSwitch({
  onChangeColor
}) {
  return (
    <button>
      Змінити колір
    </button>
  );
}
```

```js src/App.js hidden
import { useState } from 'react';
import ColorSwitch from './ColorSwitch.js';

export default function App() {
  const [clicks, setClicks] = useState(0);

  function handleClickOutside() {
    setClicks(c => c + 1);
  }

  function getRandomLightColor() {
    let r = 150 + Math.round(100 * Math.random());
    let g = 150 + Math.round(100 * Math.random());
    let b = 150 + Math.round(100 * Math.random());
    return `rgb(${r}, ${g}, ${b})`;
  }

  function handleChangeColor() {
    let bodyStyle = document.body.style;
    bodyStyle.backgroundColor = getRandomLightColor();
  }

  return (
    <div style={{ width: '100%', height: '100%' }} onClick={handleClickOutside}>
      <ColorSwitch onChangeColor={handleChangeColor} />
      <br />
      <br />
      <h2>Кліків на сторінці: {clicks}</h2>
    </div>
  );
}
```

</Sandpack>

<Solution>

По-перше, вам потрібно додати обробник події, наприклад `<button onClick={onChangeColor}>`.

Однак це створює проблему збільшення лічильника. Якщо `onChangeColor` не робить цього, як наполягає ваш колега, тоді проблема полягає в тому, що ця подія поширюється вгору, і це робить якийсь обробник вище. Щоб вирішити цю проблему, потрібно зупинити поширення. Але не забувайте, що ви все одно повинні викликати `onChangeColor`.

<Sandpack>

```js src/ColorSwitch.js active
export default function ColorSwitch({
  onChangeColor
}) {
  return (
    <button onClick={e => {
      e.stopPropagation();
      onChangeColor();
    }}>
      Змінити колір
    </button>
  );
}
```

```js src/App.js hidden
import { useState } from 'react';
import ColorSwitch from './ColorSwitch.js';

export default function App() {
  const [clicks, setClicks] = useState(0);

  function handleClickOutside() {
    setClicks(c => c + 1);
  }

  function getRandomLightColor() {
    let r = 150 + Math.round(100 * Math.random());
    let g = 150 + Math.round(100 * Math.random());
    let b = 150 + Math.round(100 * Math.random());
    return `rgb(${r}, ${g}, ${b})`;
  }

  function handleChangeColor() {
    let bodyStyle = document.body.style;
    bodyStyle.backgroundColor = getRandomLightColor();
  }

  return (
    <div style={{ width: '100%', height: '100%' }} onClick={handleClickOutside}>
      <ColorSwitch onChangeColor={handleChangeColor} />
      <br />
      <br />
      <h2>Кліків на сторінці: {clicks}</h2>
    </div>
  );
}
```

</Sandpack>

</Solution>

</Challenges>
