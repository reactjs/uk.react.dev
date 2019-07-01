---
id: fragments
title: Фрагменти
permalink: docs/fragments.html
---

Повернення кількох елементів з компонента є поширеною практикою в React. Фрагменти дозволяють формувати список дочірніх елементів, не створюючи зайвих вузлів в DOM.

```js
render() {
  return (
    <React.Fragment>
      <ChildA />
      <ChildB />
      <ChildC />
    </React.Fragment>
  );
}
```

<<<<<<< HEAD
Також існує [скорочений запис](#short-syntax), проте ще не всі популярні інструменти підтримують його.
=======
There is also a new [short syntax](#short-syntax) for declaring them.
>>>>>>> c024001caf50180a896c09467d06b2ad7b2fb8f4

## Мотивація {#motivation}

Повернення списку дочірніх елементів з компонента є поширеною практикою. Розглянемо приклад на React:

```jsx
class Table extends React.Component {
  render() {
    return (
      <table>
        <tr>
          <Columns />
        </tr>
      </table>
    );
  }
}
```

`<Columns />` повинен повернути кілька елементів `<td>`, щоб HTML вийшов валідним. Якщо використовувати div як батьківський елемент всередині методу `render()` компонента `<Columns />`, то HTML виявиться невалідним.

```jsx
class Columns extends React.Component {
  render() {
    return (
      <div>
        <td>Привіт</td>
        <td>Світe</td>
      </div>
    );
  }
}
```

Результатом виводу `<Table />` буде:

```jsx
<table>
  <tr>
    <div>
      <td>Привіт</td>
      <td>Світe</td>
    </div>
  </tr>
</table>
```

Фрагменти вирішують цю проблему.

## Використання {#usage}

```jsx{4,7}
class Columns extends React.Component {
  render() {
    return (
      <React.Fragment>
        <td>Привіт</td>
        <td>Світe</td>
      </React.Fragment>
    );
  }
}
```

Результатом буде правильний вивід `<Table />`:

```jsx
<table>
  <tr>
    <td>Привіт</td>
    <td>Світe</td>
  </tr>
</table>
```

### Скорочений запис {#short-syntax}

Існує скорочений запис оголошення фрагментів. Він виглядає як порожні теги:

```jsx{4,7}
class Columns extends React.Component {
  render() {
    return (
      <>
        <td>Привіт</td>
        <td>Світe</td>
      </>
    );
  }
}
```

Ви можете використовувати `<></>` так само, як і будь-який інший елемент, проте такий запис не підтримує ключі або атрибути.

<<<<<<< HEAD
Зверніть увагу, що **[більшість інструментів ще не підтримують скорочений запис](/blog/2017/11/28/react-v16.2.0-fragment-support.html#support-for-fragment-syntax)**, тому можна явно писати `<React.Fragment>`, поки не з'явиться підтримка.

### Фрагменти з ключами {#keyed-fragments}
=======
### Keyed Fragments {#keyed-fragments}
>>>>>>> c024001caf50180a896c09467d06b2ad7b2fb8f4

Фрагменти, які оголошені за допомогою  `<React.Fragment>` можуть мати ключі. Наприклад, їх можна використовувати при створенні списку визначень, перетворивши колекцію в масив фрагментів.

```jsx
function Glossary(props) {
  return (
    <dl>
      {props.items.map(item => (
        // Без атрибута `key`, React видасть попередження про його відсутність
        <React.Fragment key={item.id}>
          <dt>{item.term}</dt>
          <dd>{item.description}</dd>
        </React.Fragment>
      ))}
    </dl>
  );
}
```

`key` — це єдиний атрибут, який можна передати у `Fragment`. В майбутньому планується додати підтримку додаткових атрибутів, наприклад, обробників подій.

### Живий приклад {#live-demo}

Новий синтаксис JSX фрагментів можна спробувати на [CodePen](https://codepen.io/reactjs/pen/VrEbjE?editors=1000).
