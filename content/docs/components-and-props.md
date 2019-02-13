---
id: components-and-props
title: Компоненти і пропси
permalink: docs/components-and-props.html
redirect_from:
  - "docs/reusable-components.html"
  - "docs/reusable-components-zh-CN.html"
  - "docs/transferring-props.html"
  - "docs/transferring-props-it-IT.html"
  - "docs/transferring-props-ja-JP.html"
  - "docs/transferring-props-ko-KR.html"
  - "docs/transferring-props-zh-CN.html"
  - "tips/props-in-getInitialState-as-anti-pattern.html"
  - "tips/communicate-between-components.html"
prev: rendering-elements.html
next: state-and-lifecycle.html
---

Компоненти дозволяють розділити інтерфейс користувача на незалежні, багаторазові частини, і сприймати їх як такі, що функціонують окремо один від одного. На цій сторінці викладений вступ до ідеї компонентів. Ви можете знайти [докладний опис API компонентів тут](/docs/react-component.html).

Концептуально компоненти є подібними до функцій JavaScript. Вони приймають довільні входи (так звані, "пропси") і повертають React-елементи, що описують те, що повинно з'явитися на екрані.

## Функціональні компоненти та компоненти класів {#function-and-class-components}

Найпростішим способом визначення компонента є написання функції JavaScript:

```js
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}
```

Ця функція є валідним React-компонентом, оскільки вона приймає один "пропс" (який є властивістю) з даними і повертає React-елемент. Такі компоненти ми називаємо "функціональними компонентами", оскільки вони буквально є JavaScript функціями.

Ви також можете використовувати [ES6 класи](https://developer.mozilla.org/uk/docs/Web/JavaScript/Reference/Classes), щоб визначити компонент:

```js
class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

Два компоненти, що наведені вище, є еквівалентними з точки зору React.

Класи мають деякі додаткові особливості, які ми обговоримо в [наступних розділах](/docs/state-і-lifecycle.html). До тих пір ми будемо використовувати функціональні компоненти через їх лаконічність.

## Рендеринг компонентів {#rendering-a-component}

Раніше ми зустрічали лише React-елементи, які представляють теги DOM:

```js
const element = <div />;
```

Однак елементи можуть також представляти визначені користувачем компоненти:

```js
const element = <Welcome name="Sara" />;
```

Коли React бачить елемент, що представляє визначений користувачем компонент, він передає атрибути JSX цьому компоненту як єдиний об'єкт. Ми називаємо цей об'єкт "пропси".

Наприклад, код нижче виводить на сторінці "Hello, Sara":

```js{1,5}
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

const element = <Welcome name="Sara" />;
ReactDOM.render(
  element,
  document.getElementById('root')
);
```

[Спробуйте на CodePen](codepen://components-and-props/rendering-a-component)

Давайте розберемо, що відбувається в цьому прикладі:

1. Ми викликаємо `ReactDOM.render()` з елементом `<Welcome name="Sara" />`.
2. React викликає компонент `Welcome` з пропсом `{name: 'Sara'}`.
3. `Welcome` компонент повертає елемент `<h1>Hello, Sara</h1>`.
4. React DOM ефективно оновлює DOM для отримання `<h1>Hello, Sara</h1>`.

>**Примітка:** Завжди починайте писати імена компонентів з великої літери.
>
>React розглядає компоненти, що починаються з малих літер, як теги DOM. Наприклад, `<div />` представляє тег HTML div, але `<Welcome />` являє собою компонент і вимагає, щоб `Welcome` знаходився в області застосування.
>
>Щоб дізнатися більше про причини такої поведінки, прочитайте [Поглиблений розгляд JSX](/docs/jsx-in-depth.html#user-defined-components-must-be-capitalized).

## Компонування компонентів {#composing-components}

Компоненти можуть посилатися на інші компоненти під час виведення. Це дозволяє нам використовувати одну і ту ж абстракцію компонентів для будь-якого рівня деталізації. Кнопка, форма, діалогове вікно, екран: у React-додатках всі вони зазвичай виражаються як компоненти.

Наприклад, ми можемо створити компонент `App`, що відрендерить компонент `Welcome` багато разів:

```js{8-10}
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

function App() {
  return (
    <div>
      <Welcome name="Sara" />
      <Welcome name="Cahal" />
      <Welcome name="Edite" />
    </div>
  );
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
```

[Спробуйте на CodePen](codepen://components-and-props/composing-components)

Як правило, нові React-додатки мають єдиний компонент `App`, що знаходиться зверху дерева ієрархій елементів. Однак, якщо ви інтегруєте React у існуючий додаток, ви можете почати знизу вгору з невеликим компонентом, наприклад `Button`, і поступово працювати у верхній частині ієрархії перегляду.

## Розбиття компонентів на частини {#extracting-components}

Не бійтеся розбивати компоненти на дрібніші компоненти.

Наприклад, розглянемо компонент `Comment`:

```js
function Comment(props) {
  return (
    <div className="Comment">
      <div className="UserInfo">
        <img className="Avatar"
          src={props.author.avatarUrl}
          alt={props.author.name}
        />
        <div className="UserInfo-name">
          {props.author.name}
        </div>
      </div>
      <div className="Comment-text">
        {props.text}
      </div>
      <div className="Comment-date">
        {formatDate(props.date)}
      </div>
    </div>
  );
}
```

[Спробуйте на CodePen](codepen://components-and-props/extracting-components)

Він приймає `author` (об'єкт), `text` (рядок) і `date` (дату) як пропси і представляє собою коментар в соціальній мережі.

З цим компонентом можуть виникнути складнощі у випадку зміни вкладених елементів. Також важко повторно використовувати окремі його частини. Давайте витягнемо з нього кілька компонентів.

По-перше, ми витягнемо `Avatar`:

```js{3-6}
function Avatar(props) {
  return (
    <img className="Avatar"
      src={props.user.avatarUrl}
      alt={props.user.name}
    />
  );
}
```

Компонент `Avatar` не повинен знати, що він рендериться всередині компонента `Comment`. Ось чому ми дали нашому пропсу більш загальну назву: `user`, а не `author`.

Ми рекомендуємо називати пропси з точки зору компонента, а не з контексту, в якому вони використовуються.

Тепер ми можемо спростити і зменшити `Comment`:

```js{5}
function Comment(props) {
  return (
    <div className="Comment">
      <div className="UserInfo">
        <Avatar user={props.author} />
        <div className="UserInfo-name">
          {props.author.name}
        </div>
      </div>
      <div className="Comment-text">
        {props.text}
      </div>
      <div className="Comment-date">
        {formatDate(props.date)}
      </div>
    </div>
  );
}
```

Далі ми витягнемо компонент `UserInfo`, який відрендерить `Avatar` поруч з ім'ям користувача:

```js{3-8}
function UserInfo(props) {
  return (
    <div className="UserInfo">
      <Avatar user={props.user} />
      <div className="UserInfo-name">
        {props.user.name}
      </div>
    </div>
  );
}
```

Це дозволить нам ще більше спростити `Comment`:

```js{4}
function Comment(props) {
  return (
    <div className="Comment">
      <UserInfo user={props.author} />
      <div className="Comment-text">
        {props.text}
      </div>
      <div className="Comment-date">
        {formatDate(props.date)}
      </div>
    </div>
  );
}
```

[Спробуйте на CodePen](codepen://components-and-props/extracting-components-continued)

Розбиття компонентів може здатися спочатку невдячною роботою. Проте, у великих додатках така велика кількість багаторазових компонентів є дуже корисною. Суть в тому, що якщо частина вашого інтерфейсу використовується кілька разів (`Button`,`Panel`, `Avatar`), або сама собою досить складна (`App`, `FeedStory`,`Comment`), краще винести її в окремий компонент.

## Пропси тільки для читання {#props-are-read-only}

Незалежно від того як ви оголосите компонент [як функцію чи клас](#function-and-class-components), він ніколи не повинен змінювати свої власні пропси. Розглянемо функцію `sum`:

```js
function sum(a, b) {
  return a + b;
}
```

Такі функції називаються ["чистими"](https://en.wikipedia.org/wiki/Pure_function), оскільки вони не намагаються змінити свої аргументи і завжди повертають один і той же результат для тих же аргументів.

Для порівняння, наступна функція нечиста, оскільки вона змінює свої власні аргументи:

```js
function withdraw(account, amount) {
  account.total -= amount;
}
```

React досить гнучкий, але має одне суворе правило:

**Всі React-компоненти повинні працювати як чисті функції відносно їхніх пропсів.**

Звичайно, інтерфейси користувачів в додатках динамічні і змінюються з часом. У [наступному розділі](/docs/state-and-lifecycle.html) ми представимо нову концепцію "станів". Стан дозволяє React-компонентам змінювати їхній вивід кожного разу у відповідь на дії користувача, відповіді мережі та всього іншого, не порушуючи цього правила.
