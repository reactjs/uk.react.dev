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

Він має назву JSX, і це розширення синтаксису для JavaScript. Ми рекомендуємо використовувати його в React, щоб описати, як повинен виглядати інтерфейс користувача (UI). JSX може нагадувати мову шаблонів, але з усіма перевагами JavaScript. 

JSX створює React "елементи". Ми розглянемо їх вивід в DOM в [наступному розділі](/docs/rendering-elements.html). Нижче Ви можете знайти основи JSX, необхідні для початку роботи.

### Чому JSX? {#why-jsx}

React використовує той факт, що логіка виводу пов'язана з іншою логікою UI: як обробляються події, як змінюється стан з часом, і як дані готуються для відображення.

Замість того, щоб штучно відокремити *технології*, розмістивши розмітку і логіку в окремих файлах, React [розділяє *відповідальність*](https://en.wikipedia.org/wiki/Separation_of_concerns) між вільно зв'язаними одиницями, що містять обидві технології і називаються "компонентами". Ми повернемося до компонентів у [наступному розділі](/docs/components-and-props.html), але якщо Вам ще досі не комфортно розміщувати розмітку в JS, [це обговорення](https://www.youtube.com/watch?v=x7cQ3mrcKaY) може переконати Вас в протилежному.

React [не вимагає](/docs/react-without-jsx.html) використання JSX, але більшість людей цінують його за візуальну допомогу при роботі з UI в коді JavaScript. Він також дозволяє React показати зрозуміліші повідомлення про помилки та попередження.

<!---With that out of the way, let's get started!--->
З цим розібрались, давайте почнемо!

### Вставка виразів у JSX {#embedding-expressions-in-jsx}

<!---In the example below, we declare a variable called `name` and then use it inside JSX by wrapping it in curly braces:--->
У прикладі нижче ми оголошуємо змінну `name`, а потім використовуємо її в JSX, обертаючи її у фігурні дужки:

```js{1,2}
const name = 'Josh Perez';
const element = <h1>Hello, {name}</h1>;

ReactDOM.render(
  element,
  document.getElementById('root')
);
```

<!---You can put any valid [JavaScript expression](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_Operators#Expressions) inside the curly braces in JSX. For example, `2 + 2`, `user.firstName`, or `formatName(user)` are all valid JavaScript expressions.--->
Ви можете помістити будь-який валідний [JavaScript вираз](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_Operators#Expressions) всередині фігурних дужок у JSX. Наприклад, `2 + 2`, `user.firstName`, або `formatName(user)` є валідними виразами JavaScript.

<!---In the example below, we embed the result of calling a JavaScript function, `formatName(user)`, into an `<h1>` element.--->
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

[](codepen://introducing-jsx)

<!---We split JSX over multiple lines for readability. While it isn't required, when doing this, we also recommend wrapping it in parentheses to avoid the pitfalls of [automatic semicolon insertion](http://stackoverflow.com/q/2846283).--->
Ми розбиваємо JSX на декілька рядків для покращення читабельності. Хоча це не потрібно, при цьому ми також рекомендуємо охоплювати його дужками, щоб уникнути проблеми, пов'язаних з [автоматичною вставкою крапки з комою](http://stackoverflow.com/q/2846283).

### JSX також є виразом {#jsx-is-an-expression-too}

<!---After compilation, JSX expressions become regular JavaScript function calls and evaluate to JavaScript objects.--->
Після компіляції вирази JSX стають звичайними викликами функцій JavaScript, що повертають об'єкти JavaScript.

<!---This means that you can use JSX inside of `if` statements and `for` loops, assign it to variables, accept it as arguments, and return it from functions:--->
Це означає, що ви можете використовувати JSX всередині `if` виразів і циклів `for`, присвоювати йому змінні, приймати його як аргументи і повертати його з функцій:

```js{3,5}
function getGreeting(user) {
  if (user) {
    return <h1>Hello, {formatName(user)}!</h1>;
  }
  return <h1>Hello, Stranger.</h1>;
}
```

### Визначення атрибутів за допомогою JSX {#specifying-attributes-with-jsx}

<!---You may use quotes to specify string literals as attributes:--->
Ви можете використовувати лапки для задання рядкових літералів як атрибутів:

```js
const element = <div tabIndex="0"></div>;
```

<!---You may also use curly braces to embed a JavaScript expression in an attribute:--->
Ви також можете використовувати фігурні дужки, щоб вставити вираз JavaScript у атрибут:

```js
const element = <img src={user.avatarUrl}></img>;
```

<!---Don't put quotes around curly braces when embedding a JavaScript expression in an attribute. You should either use quotes (for string values) or curly braces (for expressions), but not both in the same attribute.--->
Не вставляйте лапки навколо фігурних дужок, коли вкладаєте вираз JavaScript у атрибут. Ви повинні використовувати лапки (для рядків) або фігурні дужки (для виразів), але не обидва в одному атрибуті.

>**Увага:**
>
>Оскільки JSX ближче до JavaScript, ніж до HTML, React DOM використовує правило іменування властивостей camelCase замість імен атрибутів HTML.
>
>Наприклад, `class` в JSX стає [`className`](https://developer.mozilla.org/en-US/docs/Web/API/Element/className), `tabindex` - [`tabIndex`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/tabIndex).

### Визначення дочірніх елементів JSX {#specifying-children-with-jsx}

<!---If a tag is empty, you may close it immediately with `/>`, like XML:--->
Якщо тег порожній, ви можете зразу закрити його за допомогою `/>`, як XML:

```js
const element = <img src={user.avatarUrl} />;
```

<!---JSX tags may contain children:--->
Теги JSX можуть мати дочірні елементи:

```js
const element = (
  <div>
    <h1>Hello!</h1>
    <h2>Good to see you here.</h2>
  </div>
);
```

### JSX попереджає зловмисне включення коду (Injection Attack) {#jsx-prevents-injection-attacks}

<!---It is safe to embed user input in JSX:--->
Можна безпечно вставляти дані, введенні користувачем, в JSX:

```js
const title = response.potentiallyMaliciousInput;
// Це безпечно:
const element = <h1>{title}</h1>;
```

<!---By default, React DOM [escapes](http://stackoverflow.com/questions/7381974/which-characters-need-to-be-escaped-on-html) any values embedded in JSX before rendering them. Thus it ensures that you can never inject anything that's not explicitly written in your application. Everything is converted to a string before being rendered. This helps prevent [XSS (cross-site-scripting)](https://en.wikipedia.org/wiki/Cross-site_scripting) attacks.--->
По-замовчуванню, React DOM [екранує](http://stackoverflow.com/questions/7381974/which-characters-need-to-be-escaped-on-html) будь-які значення, які включені в JSX, перед їх відображенням. Таким чином, це гарантує, що Ви ніколи на включите в код те, що явно не написане в Вашому додатку. Перед виводом все перетворюється на рядок. Це допомагає запобігти атакам [XSS (cross-site-scripting)](https://en.wikipedia.org/wiki/Cross-site_scripting).

### JSX - це об'єкти по суті {#jsx-represents-objects}

<!---Babel compiles JSX down to `React.createElement()` calls.--->
Babel компілює JSX до викликів `React.createElement()`.

<!---These two examples are identical:--->
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

<!---`React.createElement()` performs a few checks to help you write bug-free code but essentially it creates an object like this:--->
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

<!---These objects are called "React elements". You can think of them as descriptions of what you want to see on the screen. React reads these objects and uses them to construct the DOM and keep it up to date.--->
Ці об'єкти називаються "React елементами". Ви можете вважати їх описами того, що ви хочете бачити на екрані. React читає ці об'єкти і використовує їх для побудови DOM і підтримки його в актуальному стані.

<!---We will explore rendering React elements to the DOM in the next section.--->
Ми розглянемо вивід React елементів в DOM у наступному розділі.

>**Порада:**
>
<!--->We recommend using the ["Babel" language definition](http://babeljs.io/docs/editors) for your editor of choice so that both ES6 and JSX code is properly highlighted. This website uses the [Oceanic Next](https://labs.voronianski.com/oceanic-next-color-scheme/) color scheme which is compatible with it.--->
>Ми рекомендуємо використовувати ["Babel" language definition](http://babeljs.io/docs/editors) для свого редактора, щоб код ES6 та JSX правильно виділявся. Даний веб-сайт використовує сумісну з нею колірну схему [Oceanic Next](https://labs.voronianski.com/oceanic-next-color-scheme/).
