---
id: introducing-jsx
title: Вступ до JSX
permalink: docs/introducing-jsx.html
prev: hello-world.html
next: rendering-elements.html
---

Розглянемо оголошення змінної:

```js
const element = <h1>Hello, world!</h1>;
```

Цей кумедний синтаксис тегів не є ні рядком, ні HTML.

Він має назву JSX, і це розширення синтаксису для JavaScript. Ми рекомендуємо використовувати його в React, щоб описати, як повинен виглядати інтерфейс користувача. JSX може нагадувати мову шаблонів, але з усіма перевагами JavaScript. 

JSX створює "React-елементи". Ми розглянемо їх рендеринг в DOM в [наступному розділі](/docs/rendering-elements.html). Нижче ви можете знайти основи JSX, необхідні для початку роботи.

### Чому JSX? {#why-jsx}

React використовує той факт, що логіка виводу пов'язана з іншою логікою інтерфейсу користувача: як обробляються події, як змінюється стан з часом і як дані готуються для рендерингу.

Замість того, щоб штучно відокремити *технології*, розмістивши розмітку і логіку в окремих файлах, React [розділяє *відповідальність*](https://en.wikipedia.org/wiki/Separation_of_concerns) між вільно зв'язаними одиницями, що містять обидві технології і називаються "компонентами". Ми повернемося до компонентів у [наступному розділі](/docs/components-and-props.html), але якщо вам ще досі не комфортно розміщувати розмітку в JS, [ця доповідь](https://www.youtube.com/watch?v=x7cQ3mrcKaY) може переконати вас в протилежному.

React [не вимагає](/docs/react-without-jsx.html) використання JSX, але більшість людей цінують його за візуальну допомогу при роботі з інтерфейсом користувача в коді JavaScript. Він також дозволяє React показати зрозуміліші повідомлення про помилки та попередження.

З цим розібрались, давайте почнемо!

### Вставка виразів у JSX {#embedding-expressions-in-jsx}

У прикладі нижче ми оголошуємо змінну `name`, а потім використовуємо її в JSX, обертаючи її у фігурні дужки:

```js{1,2}
const name = 'Josh Perez';
const element = <h1>Hello, {name}</h1>;

ReactDOM.render(
  element,
  document.getElementById('root')
);
```

ви можете помістити будь-який валідний [JavaScript вираз](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_Operators#Expressions) всередину фігурних дужок у JSX. Наприклад, `2 + 2`, `user.firstName`, або `formatName(user)` є валідними виразами JavaScript.

У наведеному нижче прикладі ми вставляємо результат виклику функції JavaScript, `formatName(user)` в елемент `<h1>`.

```js{12}
function formatName(user) {
  return user.firstName + ' ' + user.lastName;
}

const user = {
  firstName: 'Harper',
  lastName: 'Perez'
};

const element = (
  <h1>
    Hello, {formatName(user)}!
  </h1>
);

ReactDOM.render(
  element,
  document.getElementById('root')
);
```

[Спробуйте на CodePen](codepen://introducing-jsx)

<<<<<<< HEAD
Ми розбиваємо JSX на декілька рядків для покращення читабельності. Хоча це не потрібно, ми також рекомендуємо охоплювати його дужками, щоб уникнути проблем, пов'язаних з [автоматичною вставкою крапки з комою](http://stackoverflow.com/q/2846283).
=======
We split JSX over multiple lines for readability. While it isn't required, when doing this, we also recommend wrapping it in parentheses to avoid the pitfalls of [automatic semicolon insertion](https://stackoverflow.com/q/2846283).
>>>>>>> d615c5b7bcceef420c7f9246035f8ae3ba8ae11a

### JSX також є виразом {#jsx-is-an-expression-too}

Після компіляції вирази JSX стають звичайними викликами функцій JavaScript, що повертають об'єкти JavaScript.

Це означає, що ви можете використовувати JSX всередині `if` виразів і циклів `for`, присвоювати його змінним, приймати його як аргументи і повертати його з функцій:

```js{3,5}
function getGreeting(user) {
  if (user) {
    return <h1>Hello, {formatName(user)}!</h1>;
  }
  return <h1>Hello, Stranger.</h1>;
}
```

### Визначення атрибутів за допомогою JSX {#specifying-attributes-with-jsx}

ви можете використовувати лапки для задання рядкових літералів як атрибутів:

```js
const element = <div tabIndex="0"></div>;
```

ви також можете використовувати фігурні дужки, щоб вставити вираз JavaScript у атрибут:

```js
const element = <img src={user.avatarUrl}></img>;
```

Не вставляйте лапки навколо фігурних дужок, коли вкладаєте вираз JavaScript в атрибут. ви повинні використовувати лапки (для рядків) або фігурні дужки (для виразів), але не обидва в одному атрибуті.

>**Увага:**
>
>Оскільки JSX схожий більше на JavaScript, ніж на HTML, React DOM використовує правило іменування властивостей camelCase замість імен атрибутів HTML.
>
>Наприклад, `class` в JSX стає [`className`](https://developer.mozilla.org/en-US/docs/Web/API/Element/className), `tabindex` - [`tabIndex`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/tabIndex).

### Визначення дочірніх елементів JSX {#specifying-children-with-jsx}

Якщо тег порожній, ви можете одразу закрити його за допомогою `/>`, як XML:

```js
const element = <img src={user.avatarUrl} />;
```

Теги JSX можуть мати дочірні елементи:

```js
const element = (
  <div>
    <h1>Hello!</h1>
    <h2>Good to see you here.</h2>
  </div>
);
```

### JSX запобігає вставці зловмисного коду (Injection Attack) {#jsx-prevents-injection-attacks}

Можна безпечно вставляти дані, введенні користувачем, в JSX:

```js
const title = response.potentiallyMaliciousInput;
// Це безпечно:
const element = <h1>{title}</h1>;
```

<<<<<<< HEAD
За замовчуванням, React DOM [екранує](http://stackoverflow.com/questions/7381974/which-characters-need-to-be-escaped-on-html) будь-які значення, що включені в JSX, перед їх рендерингом. Таким чином, це гарантує, що ви ніколи не включите в код те, що явно не написано у вашому додатку. Перед виводом все перетворюється на рядок. Це допомагає запобігти атакам [XSS (cross-site-scripting)](https://en.wikipedia.org/wiki/Cross-site_scripting).
=======
By default, React DOM [escapes](https://stackoverflow.com/questions/7381974/which-characters-need-to-be-escaped-on-html) any values embedded in JSX before rendering them. Thus it ensures that you can never inject anything that's not explicitly written in your application. Everything is converted to a string before being rendered. This helps prevent [XSS (cross-site-scripting)](https://en.wikipedia.org/wiki/Cross-site_scripting) attacks.
>>>>>>> d615c5b7bcceef420c7f9246035f8ae3ba8ae11a

### JSX - це об'єкти по суті {#jsx-represents-objects}

Babel компілює JSX до викликів `React.createElement()`.

Ці два приклади ідентичні між собою:

```js
const element = (
  <h1 className="greeting">
    Hello, world!
  </h1>
);
```

```js
const element = React.createElement(
  'h1',
  {className: 'greeting'},
  'Hello, world!'
);
```

`React.createElement()` виконує кілька перевірок, які допоможуть вам написати код, що не містить помилок, але, по суті, він створює об'єкт, наведений нижче:

```js
// Примітка: ця структура спрощена
const element = {
  type: 'h1',
  props: {
    className: 'greeting',
    children: 'Hello, world!'
  }
};
```

Ці об'єкти називаються "React-елементами". ви можете вважати їх описами того, що хочете бачити на екрані. React читає ці об'єкти і використовує їх для побудови DOM і підтримки його в актуальному стані.

Ми розглянемо рендеринг React-елементів в DOM у наступному розділі.

>**Порада:**
>
<<<<<<< HEAD
>Ми рекомендуємо використовувати ["Babel" language definition](http://babeljs.io/docs/editors) для вашого редактора, щоб код ES6 та JSX правильно виділявся. Даний веб-сайт використовує сумісну колірну схему [Oceanic Next](https://labs.voronianski.com/oceanic-next-color-scheme/).
=======
>We recommend using the ["Babel" language definition](https://babeljs.io/docs/editors) for your editor of choice so that both ES6 and JSX code is properly highlighted. This website uses the [Oceanic Next](https://labs.voronianski.com/oceanic-next-color-scheme/) color scheme which is compatible with it.
>>>>>>> d615c5b7bcceef420c7f9246035f8ae3ba8ae11a
