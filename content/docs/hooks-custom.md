---
id: hooks-custom
title: Створення користувацьких хуків
permalink: docs/hooks-custom.html
next: hooks-reference.html
prev: hooks-rules.html
---

*Хуки* — це новинка в React 16.8. Вони дозволяють вам використовувати стан та інші можливості React без написання класу.

Створення власних хуків дозволить вам винести логіку компонента у функції, придатні для повторного використання.

Коли ми розглядали [використання хука ефекту](/docs/hooks-effect.html#example-using-hooks-1), ми бачили цей компонент з додатку чату, який відображає повідомлення про те, чи знаходиться наш друг у мережі:

```js{4-15}
import React, { useState, useEffect } from 'react';

function FriendStatus(props) {
  const [isOnline, setIsOnline] = useState(null);

  function handleStatusChange(status) {
    setIsOnline(status.isOnline);
  }

  useEffect(() => {
    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });

  if (isOnline === null) {
    return 'Завантаження...';
  }
  return isOnline ? 'В мережі' : 'Не в мережі';
}
```

Скажімо, що в нашому додатку чату також є список контактів і ми хочемо відобразити зеленим кольором імена користувачів, які знаходяться в мережі. Ми б могли скопіювати і вставити наведену вище логіку в наш компонент `FriendListItem`, але це не найкращий варіант:

```js{4-15}
import React, { useState, useEffect } from 'react';

function FriendListItem(props) {
  const [isOnline, setIsOnline] = useState(null);

  function handleStatusChange(status) {
    setIsOnline(status.isOnline);
  }

  useEffect(() => {
    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });

  return (
    <li style={{ color: isOnline ? 'green' : 'black' }}>
      {props.friend.name}
    </li>
  );
}
```

Замість цього ми б хотіли, щоб `FriendStatus` і `FriendListItem` розділяли цю логіку.

Інколи треба повторно використовувати однакову логіку стану в декількох компонентах. Традиційно використовувалися два підходи: [компоненти вищого порядку](/docs/higher-order-components.html) та [рендер-пропси](/docs/render-props.html). Зараз ми побачимо, як за допомогою хуків вирішити багато схожих проблем без додавання непотрібних компонентів у дерево.

## Виокремлення користувацького хука{#extracting-a-custom-hook}

Коли ми хочемо, щоб дві функції JavaScript розділяли спільну логіку, ми виокремлюємо спільну логіку в третю функцію. Компоненти та хуки є функціями, а тому це правило працює і для них!

**Користувацький хук — це JavaScript-функція, ім'я якої починається з "`use`", і яка може викликати інші хуки.** Наприклад, `useFriendStatus` нижче -- наш перший користувацький хук:

```js{3}
import React, { useState, useEffect } from 'react';

function useFriendStatus(friendID) {
  const [isOnline, setIsOnline] = useState(null);

  function handleStatusChange(status) {
    setIsOnline(status.isOnline);
  }

  useEffect(() => {
    ChatAPI.subscribeToFriendStatus(friendID, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(friendID, handleStatusChange);
    };
  });

  return isOnline;
}
```

Тут немає нічого нового — логіка повністю скопійована з компонентів вище. Так само як і в компонентах, ви маєте впевнитись, що не використовуєте хуки в межах умовних операторів і викликаєте їх на верхньому рівні вашого власного хука.

На відміну від React-компонента, користувацький хук не повинен мати особливої сигнатури. Ми можемо вирішувати, що він прийматиме як аргументи, яке значення він буде повертати і чи буде повертати його взагалі. Іншими словами, все як для звичайної функції. Ім'я функції-хука варто завжди починати з `use`, щоб ви могли відразу розпізнати, що для неї виконуються [правила хуків](/docs/hooks-rules.html).

Метою нашого `useFriendStatus` хука є підписка на статус друга. Саме тому він приймає `friendID` у якості аргумента та повертає статус друга в мережі:

```js
function useFriendStatus(friendID) {
  const [isOnline, setIsOnline] = useState(null);

  // ...

  return isOnline;
}
```

Тепер давайте поглянемо, як ми можемо використовувати наш користувацький хук.

## Використання користувацького хука {#using-a-custom-hook}

Спочатку нашою метою було усунення повторної логіки з компонентів `FriendStatus` і `FriendListItem`. Кожен з них хоче знати, чи знаходиться друг у мережі.

Тепер, коли ми виокремили цю логіку в хук `useFriendStatus`, ми можемо *просто використати його:*

```js{2}
function FriendStatus(props) {
  const isOnline = useFriendStatus(props.friend.id);

  if (isOnline === null) {
    return 'Завантаження...';
  }
  return isOnline ? 'В мережі' : 'Не в мережі';
}
```

```js{2}
function FriendListItem(props) {
  const isOnline = useFriendStatus(props.friend.id);

  return (
    <li style={{ color: isOnline ? 'green' : 'black' }}>
      {props.friend.name}
    </li>
  );
}
```

**Чи є цей код еквівалентним початковим прикладам?** Так, він працює абсолютно таким самим чином. Придивіться ближче і ви побачите, що ми не внесли ніяких змін у логіку. Все, що ми зробили, це виокремили спільних для обох функцій код в окрему функцію. **Користувацькі хуки — це більше домовленість, яка природньо випливає з дизайну хуків, а не особливість функціоналу React.**

**Чи повинен я починати імена моїх хуків з “`use`”?** Так, будь ласка. Ця домовленість є дуже важливою. Без неї ми не зможемо автоматично перевіряти порушення [правил хуків](/docs/hooks-rules.html), тому що ми не зможемо визначити, чи містить певна функція виклики хуків.

**Чи є однаковим стан двох компонентів, які використовують той самий хук?** Ні. Користувацькі хуки — це механізм повторного використання *логіки зі станом* (наприклад, налаштування підписки і збереження поточного значення), але кожного разу, коли ви використовуєте користувацький хук, увесь стан та ефекти всередині нього є повністю незалежними.

**Як користувацький хук отримує власний ізольований стан?** Кожен *виклик* хука отримує ізольований стан. Незважаючи на те, що ми напряму викликаємо `useFriendStatus`, з точки зору React наш компонент просто викликає `useState` і `useEffect`. І як ми [дізналися](/docs/hooks-state.html#tip-using-multiple-state-variables) [раніше](/docs/hooks-effect.html#tip-use-multiple-effects-to-separate-concerns), ми можемо викликати `useState` та `useEffect` багато разів в одному компоненті і при цьому вони будуть повністю незалежними.

### Порада: Передача інформації між хуками {#tip-pass-information-between-hooks}

Оскільки хуки є функціями, ми можемо передавати інформацію між ними.

Щоб продемонструвати це, ми використаємо інший компонент з нашого гіпотетичного прикладу чату. Цей компонент дає можливість обрати отримувача повідомлення і показує, чи є вибраний на даний момент друг у мережі:

```js{8-9,13}
const friendList = [
  { id: 1, name: 'Маруся' },
  { id: 2, name: 'Гриць' },
  { id: 3, name: 'Галя' },
];

function ChatRecipientPicker() {
  const [recipientID, setRecipientID] = useState(1);
  const isRecipientOnline = useFriendStatus(recipientID);

  return (
    <>
      <Circle color={isRecipientOnline ? 'green' : 'red'} />
      <select
        value={recipientID}
        onChange={e => setRecipientID(Number(e.target.value))}
      >
        {friendList.map(friend => (
          <option key={friend.id} value={friend.id}>
            {friend.name}
          </option>
        ))}
      </select>
    </>
  );
}
```

Ми зберігаємо поточний ID друга у змінній стану `recipientID` і оновлюємо її, якщо користувач обирає іншого друга в `<select>`.

Оскільки виклик хука `useState` надає нам останнє значення змінної стану `recipientID`, ми можемо передати його у наш користувацький хук `useFriendStatus` у якості аргумента:

```js
  const [recipientID, setRecipientID] = useState(1);
  const isRecipientOnline = useFriendStatus(recipientID);
```

Це дозволяє нам дізнатись, чи є *наразі обраний* друг у мережі. Якщо ми оберемо іншого друга і оновимо змінну стану `recipientID`, наш хук `useFriendStatus` відпишеться від попередньо обраного друга і підпишеться на статус щойно обраного.

## `useYourImagination()` {#useyourimagination}

Користувацькі хуки пропонують раніше неможливу у React-компонентах гнучкість використання спільної логіки. Ви можете писати користувацькі хуки, що охоплюють широкий спектр випадків, таких як: обробка форм, анімація, декларативні підписки, таймери і, певно, багато інших про які ми навіть не розглянули. Навіть більше, ви можете створювати хуки настільки ж прості у використанні, як і звичайні функції, які підтримує React.

Спробуйте уникнути додавання абстракції на ранніх етапах. Зараз, коли функціональні компоненти можуть робити більше, цілком можливо, що середній функціональний компонент у вашій кодовій базі стане довшим. Це цілком нормально і не думайте, що ви *повинні* негайно розділити його на хуки. Але ми також рекомендуємо вам помічати випадки, в яких користувацький хук може приховати складну логіку за простим інтерфейсом чи допоможе розплутати заплутаний компонент.

Наприклад, ви хочете мати складний компонент, що містить багато локальних змінних стану і керується особливим чином. `useState` не спрощує централізацію логіки оновлення, а тому ви можете захотіти переписати його у вигляді редюсера [Redux](https://redux.js.org/):

```js
function todosReducer(state, action) {
  switch (action.type) {
    case 'add':
      return [...state, {
        text: action.text,
        completed: false
      }];
    // ... інші дії ...
    default:
      return state;
  }
}
```

Редюсери дуже зручні для тестування в ізоляції і масштабування для вираження більш складної логіки оновлення. За необхідності ви можете розбити їх на менші за об'ємом редюсери. Однак вам можуть подобатися переваги використання локального стану React або ж ви не хочете встановлювати додаткову бібліотеку.

А що, якби ми могли написати хук `useReducer`, що дозволяє вам керувати *локальним* станом нашого компоненту, використовуючи редюсер? Його спрощена версія може виглядати так:

```js
function useReducer(reducer, initialState) {
  const [state, setState] = useState(initialState);

  function dispatch(action) {
    const nextState = reducer(state, action);
    setState(nextState);
  }

  return [state, dispatch];
}
```

Тепер ми можемо використати цей хук в нашому компоненті і дозволити редюсеру керувати його станом:

```js{2}
function Todos() {
  const [todos, dispatch] = useReducer(todosReducer, []);

  function handleAddClick(text) {
    dispatch({ type: 'add', text });
  }

  // ...
}
```

Потреба керувати локальним станом складного компонента за допомогою редюсера доволі поширена. Саме тому ми вже додали хук `useReducer` до React. Ви знайдете його разом з іншими вбудованими хуками у [API-довіднику хуків](/docs/hooks-reference.html).
