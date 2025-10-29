---
title: useState
---

<Intro>

`useState` — хук React, який дозволяє додати [змінну стану](/learn/state-a-components-memory) до вашого компонента.

```js
const [state, setState] = useState(initialState)
```

</Intro>

<InlineToc />

---

## Опис {/*reference*/}

### `useState(initialState)` {/*usestate*/}

Викликачте `useState` на верхньому рівні вашого компонента, щоб оголосити [змінну стану.](/learn/state-a-components-memory)

```js
import { useState } from 'react';

function MyComponent() {
  const [age, setAge] = useState(28);
  const [name, setName] = useState('Тейлор');
  const [todos, setTodos] = useState(() => createTodos());
  // ...
```

Зазвичай змінні стану називають як от `[щось, setЩось]`, використовуючи [деструктуризацію масиву.](https://javascript.info/destructuring-assignment)

[Дивіться більше прикладів нижче.](#usage)

#### Параметри {/*parameters*/}

* `initialState`: Значення, яке ви хочете встановити як початкове для стану. Це може бути значення будь-якого типу, але якщо це функція — діють особливі правила. Цей аргумент ігнорується після першого рендеру.
  * Якщо ви передаєте функцію як `initialState`, вона спрацює як як _функція-ініціалізатор_. Вона має бути чистою, без аргументів, і повертати будь-яке значення. React викличе її під час ініціалізації компонента й збереже те, що вона поверне, як початковий стан. [Дивіться приклад нижче.](#avoiding-recreating-the-initial-state)

#### Результат {/*returns*/}

`useState` повертає масив, що містить рівно два значення:

1. Поточний стан. Під час першого рендеру він дорівнює переданому `initialState`.
2. [Функція `set`](#setstate), яка дозволяє оновити стан на нове значення і викликає повторний рендер.

#### Застереження {/*caveats*/}

* `useState` — це хук, тому його можна викликати **лише на верхньому рівні вашого компонента** або вашого власного хука. Не можна викликати його в циклах чи умовах. За потреби — перенесіть стан в новий компонент.
* У режимі Strict Mode React буде **викликати вашу функцію-ініціалізатор двічі**, щоб [допомогти виявити випадкові побічні ефекти.](#my-initializer-or-updater-function-runs-twice) Це відбувається лише під час розробки і не впливає на продакшн. Якщо ваша функція-ініціалізатор чиста (якою вона і має бути), це не позначиться на поведінці компонента. Результат одного з викликів буде проігноровано.

---

### Функції `set`, наприклад `setSomething(nextState)` {/*setstate*/}

Функція `set`, яку повертає `useState`, дозволяє оновити стан на інше значення і викликати повторний рендер. Ви можете передати нове значення напряму або функцію, яка обчислює його з попереднього стану:

```js
const [name, setName] = useState('Едвард');

function handleClick() {
  setName('Тейлор');
  setAge(a => a + 1);
  // ...
```

#### Параметри {/*setstate-parameters*/}

* `nextState`: Значення, яке ви хочете встановити як новий стан. Це може бути значення будь-якого типу, але якщо це функція — діють особливі правила.
  * Якщо ви передасте функцію, React сприйме її як _функцію-оновлювач_. Вона має бути чистою, приймати поточний (ще не оновлений) стан як єдиний аргумент, і повертати нове значення стану. React додасть вашу функцію до черги оновлень і перерендерить компонент. Під час наступного рендеру React розрахує новий стан, послідовно застосовуючи всі функції з черги до попереднього стану. [Дивіться приклад нижче.](#updating-state-based-on-the-previous-state)

#### Повернення {/*setstate-returns*/}

Функції `set` не повертають значення

#### Застереження {/*setstate-caveats*/}

* Функція `set` **оновлює змінну стану лише для *наступного* рендеру**. Якщо звернутися до змінної стану одразу після виклику `set`, [ви все ще отримаєте попереднє значення](#ive-updated-the-state-but-logging-gives-me-the-old-value), яке було актуальним до оновлення.

* Якщо нове значення, яке ви передаєте, ідентичне поточному `state` (згідно з [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is)), React **пропустить повторний рендер компонента та його нащадків.** Це оптимізація. Хоча в деяких випадках React усе ж може викликати ваш компонент перед тим, як пропустити рендер нащадків, це не має вплинути на роботу вашого коду.

* React [обробляє оновлення стану пакетно.](/learn/queueing-a-series-of-state-updates) Він оновлює інтерфейс **після завершення всіх обробників подій**, які викликали свої функції `set`. Це запобігає кільком перерендерам під час однієї події. У рідкісних випадках, коли вам потрібно примусово оновити інтерфейс раніше (наприклад, щоб звернутися до DOM), ви можете скористатися [`flushSync`.](/reference/react-dom/flushSync)

* Функція `set` має стабільну ідентичність, тож її часто не включають до залежностей у Effect. Але навіть якщо додати — це не спричинить повторного виклику Effect. Якщо лінтер дозволяє не вказувати залежність без помилок — так можна зробити. [Дізнайтеся більше про видалення залежностей у Effect.](/learn/removing-effect-dependencies#move-dynamic-objects-and-functions-inside-your-effect)

* Виклик функції `set` *під час рендеру* дозволено лише всередині компонента, що наразі рендериться. React відкине його поточний результат і негайно спробує перерендерити компонент з новим станом. Такий підхід потрібен рідко, але його можна використати, щоб **зберігати інформацію з попередніх рендерів**. [Дивіться приклад нижче.](#storing-information-from-previous-renders)

* У режимі Strict Mode React **двічі викликає вашу функцію-оновлювач**, щоб [допомогти виявити випадкові побічні ефекти.](#my-initializer-or-updater-function-runs-twice) Це відбувається лише під час розробки і **не впливає на продакшн**. Якщо ваша функція-оновлювач **чиста (як і має бути)**, це **не вплине на поведінку компонента**. Результат одного з викликів буде **проігноровано**.

---

## Використання {/*usage*/}

### Додавання стану до компонента {/*adding-state-to-a-component*/}

Викликайте `useState` на верхньому рівні вашого компонента, щоб оголосити одну або кілька [змінних стану.](/learn/state-a-components-memory)

```js [[1, 4, "age"], [2, 4, "setAge"], [3, 4, "42"], [1, 5, "name"], [2, 5, "setName"], [3, 5, "'Тейлор'"]]
import { useState } from 'react';

function MyComponent() {
  const [age, setAge] = useState(42);
  const [name, setName] = useState('Тейлор');
  // ...
```

Зазвичай змінні стану називають у форматі `[щось, setЩось]`, використовуючи [деструктуризацію масиву.](https://javascript.info/destructuring-assignment)

`useState` повертає масив, що містить рівно два елементи:

1. <CodeStep step={1}>Поточний стан</CodeStep> цієї змінної стану, який спочатку дорівнює <CodeStep step={3}>початковому значенню</CodeStep>, переданому вами.
2. <CodeStep step={2}>Функцію `set`</CodeStep>, яка дає змогу змінювати цей стан у відповідь на взаємодію.

Щоб оновити інтерфейс, викличте функцію `set` з новим станом:

```js [[2, 2, "setName"]]
function handleClick() {
  setName('Робін');
}
```

React збереже новий стан, повторно відрендерить компонент із цими значеннями та оновить інтерфейс.

<Pitfall>

Виклик функції `set` [**не змінює** поточний стан у коді, що вже виконується](#ive-updated-the-state-but-logging-gives-me-the-old-value):

```js {3}
function handleClick() {
  setName('Робін');
  console.log(name); // Все ще "Тейлор"!
}
```

Він впливає лише на те, що `useState` повертатиме починаючи з *наступного* рендеру.

</Pitfall>

<Recipes titleText="Приклади використання useState" titleId="examples-basic">

#### Лічильник (число) {/*counter-number*/}

У цьому прикладі змінна стану `count` зберігає число. Натискання кнопки збільшує його на одиницю.

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <button onClick={handleClick}>
      Ви натиснули на мене {count} раз(ів)
    </button>
  );
}
```

</Sandpack>

<Solution />

#### Текстове поле (рядок) {/*text-field-string*/}

У цьому прикладі змінна стану `text` зберігає рядок. Коли ви щось вводите, `handleChange` зчитує останнє значення з DOM-елемента `<input>` у браузері та викликає `setText`, щоб оновити стан. Це дає змогу відображати поточне значення `text` поряд.

<Sandpack>

```js
import { useState } from 'react';

export default function MyInput() {
  const [text, setText] = useState('Привіт!');

  function handleChange(e) {
    setText(e.target.value);
  }

  return (
    <>
      <input value={text} onChange={handleChange} />
      <p>Ви ввели: {text}</p>
      <button onClick={() => setText('Привіт!')}>
        Скинути
      </button>
    </>
  );
}
```

</Sandpack>

<Solution />

#### Прапорець (булеве значення) {/*checkbox-boolean*/}

У цьому прикладі змінна стану `liked` зберігає булеве значення. Коли ви натискаєте на прапорець, `setLiked` оновлює стан `liked` відповідно до того, чи встановлено прапорець у браузері. Змінна `liked` використовується для відображення тексту поруч із прапорцем.

<Sandpack>

```js
import { useState } from 'react';

export default function MyCheckbox() {
  const [liked, setLiked] = useState(true);

  function handleChange(e) {
    setLiked(e.target.checked);
  }

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={liked}
          onChange={handleChange}
        />
        Мені сподобалося
      </label>
      <p>Вам це {liked ? 'сподобалося' : 'не сподобалося'}.</p>
    </>
  );
}
```

</Sandpack>

<Solution />

#### Форма (дві змінні) {/*form-two-variables*/}

У тому самому компоненті можна оголосити більше ніж одну змінну стану. Кожна змінна стану є повністю незалежною.

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [name, setName] = useState('Тейлор');
  const [age, setAge] = useState(42);

  return (
    <>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button onClick={() => setAge(age + 1)}>
        Збільшити вік
      </button>
      <p>Привіт, {name}. Тобі {age}.</p>
    </>
  );
}
```

```css
button { display: block; margin-top: 10px; }
```

</Sandpack>

<Solution />

</Recipes>

---

### Оновлення стану на основі попереднього {/*updating-state-based-on-the-previous-state*/}

Припустимо, значення `age` дорівнює `42`. Цей обробник викликає `setAge(age + 1)` тричі:

```js
function handleClick() {
  setAge(age + 1); // setAge(42 + 1)
  setAge(age + 1); // setAge(42 + 1)
  setAge(age + 1); // setAge(42 + 1)
}
```

Однак після одного кліка `age` буде `43`, а не `45`! Це тому, що виклик функції `set` [не оновлює](/learn/state-as-a-snapshot) змінну `age` у коді, що вже виконується. Тож кожен виклик `setAge(age + 1)` стає `setAge(43)`.

Щоб вирішити цю проблему, **можна передати до `setAge` *функцію-оновлювач*** замість нового значення:

```js [[1, 2, "a", 0], [2, 2, "a + 1"], [1, 3, "a", 0], [2, 3, "a + 1"], [1, 4, "a", 0], [2, 4, "a + 1"]]
function handleClick() {
  setAge(a => a + 1); // setAge(42 => 43)
  setAge(a => a + 1); // setAge(43 => 44)
  setAge(a => a + 1); // setAge(44 => 45)
}
```

Тут `a => a + 1` — це ваша функція-оновлювач. Вона приймає <CodeStep step={1}>поточне значення</CodeStep> стану та обчислює з нього <CodeStep step={2}>наступне значення</CodeStep>.

React ставить усі функції-оновлювачі у [чергу.](/learn/queueing-a-series-of-state-updates) Під час наступного рендеру він викличе їх у тому ж порядку:

1. `a => a + 1` отримає `42` як поточне значення та поверне `43`.
2. `a => a + 1` отримає `43` як поточне значення та поверне `44`.
3. `a => a + 1` отримає `44` як поточне значення та поверне `45`.

Інших оновлень у черзі немає, тож React зрештою збереже `45` як поточне значення стану.

Зазвичай аргумент функції-оновлювача називають першою літерою назви змінної стану — наприклад, `a` для `age`. Однак ви також можете використати назви типу `prevAge` або будь-які інші, які вам зрозуміліші.

У режимі розробки React може [викликати функції-оновлювачі двічі](#my-initializer-or-updater-function-runs-twice), щоб переконатися, що вони [чисті.](/learn/keeping-components-pure)

<DeepDive>

#### Чи завжди варто використовувати функцію-оновлювач? {/*is-using-an-updater-always-preferred*/}

Ви могли чути пораду завжди писати код у стилі `setAge(a => a + 1)`, якщо новий стан обчислюється на основі попереднього. Це не завдає шкоди, але й не завжди є необхідним.

У більшості випадків немає різниці між цими двома підходами. React завжди гарантує, що для свідомих дій користувача, як-от кліки, значення змінної `age` буде оновлено до наступного кліку. Це означає, що обробник кліку не побачить "застаріле" значення `age` на початку виконання.

Однак якщо ви виконуєте кілька оновлень у межах однієї події, функції-оновлювачі можуть бути корисними. Вони також зручні, коли доступ до змінної стану ускладнений (з цим можна зіткнутися під час оптимізації повторного рендеру).

Якщо для вас важлива послідовність навіть за ціною трохи багатослівнішого синтаксису, цілком логічно завжди використовувати функцію-оновлювач, коли новий стан залежить від попереднього. Якщо ж нове значення залежить від попереднього стану *іншої* змінної, можливо, варто об'єднати їх в один об'єкт і [використати редюсер.](/learn/extracting-state-logic-into-a-reducer)

</DeepDive>

<Recipes titleText="Різниця між передаванням функції-оновлювача та безпосереднього значення" titleId="examples-updater">

#### Передавання функції-оновлювача {/*passing-the-updater-function*/}

У цьому прикладі передається функція-оновлювач, тож кнопка "+3" працює як очікується.

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [age, setAge] = useState(42);

  function increment() {
    setAge(a => a + 1);
  }

  return (
    <>
      <h1>Ваш вік: {age}</h1>
      <button onClick={() => {
        increment();
        increment();
        increment();
      }}>+3</button>
      <button onClick={() => {
        increment();
      }}>+1</button>
    </>
  );
}
```

```css
button { display: block; margin: 10px; font-size: 20px; }
h1 { display: block; margin: 10px; }
```

</Sandpack>

<Solution />

#### Передавання наступного значення напряму {/*passing-the-next-state-directly*/}

У цьому прикладі **не** передається функція-оновлювач, тому кнопка "+3" **не працює як очікується**.

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [age, setAge] = useState(42);

  function increment() {
    setAge(age + 1);
  }

  return (
    <>
      <h1>Ваш вік: {age}</h1>
      <button onClick={() => {
        increment();
        increment();
        increment();
      }}>+3</button>
      <button onClick={() => {
        increment();
      }}>+1</button>
    </>
  );
}
```

```css
button { display: block; margin: 10px; font-size: 20px; }
h1 { display: block; margin: 10px; }
```

</Sandpack>

<Solution />

</Recipes>

---

### Оновлення стану, що містить об’єкти та масиви {/*updating-objects-and-arrays-in-state*/}

У стан можна поміщати об'єкти та масиви. У React стан доступний лише для читання, тому **його слід *замінювати*, а не *змінювати* наявні об'єкти**. Наприклад, якщо у вас є об'єкт `form` у стані, не змінюйте його ось так:

```js
// 🚩 Не змінюйте об'єкт у стані безпосередньо:
form.firstName = 'Тейлор';
```

Замість цього замініть весь об'єкт, створивши новий:

```js
// ✅ Замініть стан новим об'єктом
setForm({
  ...form,
  firstName: 'Тейлор'
});
```

Про це докладніше у розділах [оновлення об'єктів у стані](/learn/updating-objects-in-state) та [оновлення масивів у стані.](/learn/updating-arrays-in-state).

<Recipes titleText="Приклади об'єктів і масивів у стані" titleId="examples-objects">

#### Форма (об'єкт) {/*form-object*/}

У цьому прикладі змінна стану `form` зберігає об'єкт. Кожне поле вводу має обробник зміни, який викликає `setForm` із новим станом усієї форми. Синтаксис розпакування `{ ...form }` гарантує, що об'єкт стану буде замінено, а не змінено напряму.

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [form, setForm] = useState({
    firstName: 'Барбара',
    lastName: 'Гепворт',
    email: 'bhepworth@sculpture.com',
  });

  return (
    <>
      <label>
        Ім’я:
        <input
          value={form.firstName}
          onChange={e => {
            setForm({
              ...form,
              firstName: e.target.value
            });
          }}
        />
      </label>
      <label>
        Прізвище:
        <input
          value={form.lastName}
          onChange={e => {
            setForm({
              ...form,
              lastName: e.target.value
            });
          }}
        />
      </label>
      <label>
        Email:
        <input
          value={form.email}
          onChange={e => {
            setForm({
              ...form,
              email: e.target.value
            });
          }}
        />
      </label>
      <p>
        {form.firstName}{' '}
        {form.lastName}{' '}
        ({form.email})
      </p>
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; }
```

</Sandpack>

<Solution />

#### Форма (вкладений об'єкт) {/*form-nested-object*/}

У цьому прикладі стан є більш вкладеним. Коли ви оновлюєте вкладений стан, необхідно створити копію як об'єкта, який оновлюється, так і всіх об'єктів, які його містять, на шляху догори. Докладніше читайте у розділі [оновлення вкладеного об'єкта](/learn/updating-objects-in-state#updating-a-nested-object).

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [person, setPerson] = useState({
    name: 'Нікі де Сен-Фаль',
    artwork: {
      title: 'Синя Нана',
      city: 'Гамбург',
      image: 'https://i.imgur.com/Sd1AgUOm.jpg',
    }
  });

  function handleNameChange(e) {
    setPerson({
      ...person,
      name: e.target.value
    });
  }

  function handleTitleChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        title: e.target.value
      }
    });
  }

  function handleCityChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        city: e.target.value
      }
    });
  }

  function handleImageChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        image: e.target.value
      }
    });
  }

  return (
    <>
      <label>
        Ім’я:
        <input
          value={person.name}
          onChange={handleNameChange}
        />
      </label>
      <label>
        Назва:
        <input
          value={person.artwork.title}
          onChange={handleTitleChange}
        />
      </label>
      <label>
        Місто:
        <input
          value={person.artwork.city}
          onChange={handleCityChange}
        />
      </label>
      <label>
        Зображення:
        <input
          value={person.artwork.image}
          onChange={handleImageChange}
        />
      </label>
      <p>
        <i>{person.artwork.title}</i>
        {' авторства '}
        {person.name}
        <br />
        (знаходиться у {person.artwork.city})
      </p>
      <img 
        src={person.artwork.image} 
        alt={person.artwork.title}
      />
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
img { width: 200px; height: 200px; }
```

</Sandpack>

<Solution />

#### Список (масив) {/*list-array*/}

У цьому прикладі змінна стану `todos` зберігає масив. Кожен обробник кнопки викликає `setTodos` з наступною версією цього масиву. Синтаксис розпакування `[...todos]`, а також методи `todos.map()` і `todos.filter()` гарантують, що масив буде замінено, а не змінено напряму.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import AddTodo from './AddTodo.js';
import TaskList from './TaskList.js';

let nextId = 3;
const initialTodos = [
  { id: 0, title: 'Купити молоко', done: true },
  { id: 1, title: 'З’їсти тако', done: false },
  { id: 2, title: 'Заварити чай', done: false },
];

export default function TaskApp() {
  const [todos, setTodos] = useState(initialTodos);

  function handleAddTodo(title) {
    setTodos([
      ...todos,
      {
        id: nextId++,
        title: title,
        done: false
      }
    ]);
  }

  function handleChangeTodo(nextTodo) {
    setTodos(todos.map(t => {
      if (t.id === nextTodo.id) {
        return nextTodo;
      } else {
        return t;
      }
    }));
  }

  function handleDeleteTodo(todoId) {
    setTodos(
      todos.filter(t => t.id !== todoId)
    );
  }

  return (
    <>
      <AddTodo
        onAddTodo={handleAddTodo}
      />
      <TaskList
        todos={todos}
        onChangeTodo={handleChangeTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </>
  );
}
```

```js src/AddTodo.js
import { useState } from 'react';

export default function AddTodo({ onAddTodo }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Додати завдання"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddTodo(title);
      }}>Додати</button>
    </>
  )
}
```

```js src/TaskList.js
import { useState } from 'react';

export default function TaskList({
  todos,
  onChangeTodo,
  onDeleteTodo
}) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <Task
            todo={todo}
            onChange={onChangeTodo}
            onDelete={onDeleteTodo}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ todo, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let todoContent;
  if (isEditing) {
    todoContent = (
      <>
        <input
          value={todo.title}
          onChange={e => {
            onChange({
              ...todo,
              title: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Зберегти
        </button>
      </>
    );
  } else {
    todoContent = (
      <>
        {todo.title}
        <button onClick={() => setIsEditing(true)}>
          Редагувати
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={e => {
          onChange({
            ...todo,
            done: e.target.checked
          });
        }}
      />
      {todoContent}
      <button onClick={() => onDelete(todo.id)}>
        Видалити
      </button>
    </label>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
```

</Sandpack>

<Solution />

#### Лаконічна логіка оновлення з Immer {/*writing-concise-update-logic-with-immer*/}

Якщо оновлення масивів та об’єктів без мутацій здається клопітким, щоб зменшити кількість повторюваного коду, можна скористатися бібліотекою на кшталт [Immer](https://github.com/immerjs/use-immer). Immer дозволяє писати лаконічний код, ніби ви змінюєте об’єкти напряму, але за лаштунками він виконує оновлення без мутацій:

<Sandpack>

```js
import { useState } from 'react';
import { useImmer } from 'use-immer';

let nextId = 3;
const initialList = [
  { id: 0, title: 'Баба Галя в люмінолі', seen: false },
  { id: 1, title: 'Вишиванка з шумом', seen: false },
  { id: 2, title: 'Килим на стелі', seen: true },
];

export default function BucketList() {
  const [list, updateList] = useImmer(initialList);

  function handleToggle(artworkId, nextSeen) {
    updateList(draft => {
      const artwork = draft.find(a =>
        a.id === artworkId
      );
      artwork.seen = nextSeen;
    });
  }

  return (
    <>
      <h1>Мистецький список бажань</h1> 
      <h2>Я хочу побачити:</h2>
      <ItemList
        artworks={list}
        onToggle={handleToggle} />
    </>
  );
}

function ItemList({ artworks, onToggle }) {
  return (
    <ul>
      {artworks.map(artwork => (
        <li key={artwork.id}>
          <label>
            <input
              type="checkbox"
              checked={artwork.seen}
              onChange={e => {
                onToggle(
                  artwork.id,
                  e.target.checked
                );
              }}
            />
            {artwork.title}
          </label>
        </li>
      ))}
    </ul>
  );
}
```

```json package.json
{
  "dependencies": {
    "immer": "1.7.3",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "use-immer": "0.5.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

</Sandpack>

<Solution />

</Recipes>

---

### Уникайте повторного створення початкового стану {/*avoiding-recreating-the-initial-state*/}

React зберігає початковий стан один раз і ігнорує його під час наступних рендерів.

```js
function TodoList() {
  const [todos, setTodos] = useState(createInitialTodos());
  // ...
```

Хоча результат `createInitialTodos()` використовується лише під час першого рендеру, ви все одно викликаєте цю функцію на кожному рендері. Це може бути неефективно, якщо функція створює великі масиви або виконує ресурсоємні обчислення.

Щоб уникнути цього, у `useState` **передайте її як _функцію-ініціалізатор_**:

```js
function TodoList() {
  const [todos, setTodos] = useState(createInitialTodos);
  // ...
```

Зверніть увагу, що ви передаєте `createInitialTodos`, тобто *саму функцію*, а не `createInitialTodos()`, що є результатом її виклику. Якщо ви передаєте функцію в `useState`, React викликає її лише під час ініціалізації.

У режимі розробки React може [двічі викликати ваші ініціалізатори](#my-initializer-or-updater-function-runs-twice), щоб переконатися, що вони [чисті.](/learn/keeping-components-pure)

<Recipes titleText="Різниця між передаванням ініціалізатора і передаванням початкового стану напряму" titleId="examples-initializer">

#### Передавання функції-ініціалізатора {/*passing-the-initializer-function*/}

У цьому прикладі передається функція-ініціалізатор, тому `createInitialTodos` виконується лише під час ініціалізації. Вона **не виконується** під час повторних рендерів компонента, наприклад, коли ви щось вводите в поле.

<Sandpack>

```js
import { useState } from 'react';

function createInitialTodos() {
  const initialTodos = [];
  for (let i = 0; i < 50; i++) {
    initialTodos.push({
      id: i,
      text: 'Елемент ' + (i + 1)
    });
  }
  return initialTodos;
}

export default function TodoList() {
  const [todos, setTodos] = useState(createInitialTodos);
  const [text, setText] = useState('');

  return (
    <>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => {
        setText('');
        setTodos([{
          id: todos.length,
          text: text
        }, ...todos]);
      }}>Додати</button>
      <ul>
        {todos.map(item => (
          <li key={item.id}>
            {item.text}
          </li>
        ))}
      </ul>
    </>
  );
}
```

</Sandpack>

<Solution />

#### Передавання початкового стану напряму {/*passing-the-initial-state-directly*/}

У цьому прикладі **не передається** функція-ініціалізатор, тому `createInitialTodos` виконується **на кожному рендері**, зокрема й при введенні тексту в інпут. Поведінка компонента не змінюється, але це менш ефективний підхід.

<Sandpack>

```js
import { useState } from 'react';

function createInitialTodos() {
  const initialTodos = [];
  for (let i = 0; i < 50; i++) {
    initialTodos.push({
      id: i,
      text: 'Елемент ' + (i + 1)
    });
  }
  return initialTodos;
}

export default function TodoList() {
  const [todos, setTodos] = useState(createInitialTodos());
  const [text, setText] = useState('');

  return (
    <>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => {
        setText('');
        setTodos([{
          id: todos.length,
          text: text
        }, ...todos]);
      }}>Додати</button>
      <ul>
        {todos.map(item => (
          <li key={item.id}>
            {item.text}
          </li>
        ))}
      </ul>
    </>
  );
}
```

</Sandpack>

<Solution />

</Recipes>

---

### Скидання стану за допомогою `key` {/*resetting-state-with-a-key*/}

Ви часто зустрічатимете атрибут `key` при [рендерінгу списків.](/learn/rendering-lists) Але він має ще одну цікаву властивість.

Ви можете **скинути стан компонента, передавши йому інше значення `key`.** У цьому прикладі кнопка Reset змінює змінну стану `version`, яку ми передаємо як `key` компоненту `Form`. Коли значення `key` змінюється, React створює компонент `Form` (і всіх його нащадків) заново, тож його стан скидається.

Докладніше читайте в розділі [збереження і скидання стану](/learn/preserving-and-resetting-state).

<Sandpack>

```js src/App.js
import { useState } from 'react';

export default function App() {
  const [version, setVersion] = useState(0);

  function handleReset() {
    setVersion(version + 1);
  }

  return (
    <>
      <button onClick={handleReset}>Скинути</button>
      <Form key={version} />
    </>
  );
}

function Form() {
  const [name, setName] = useState('Тейлор');

  return (
    <>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <p>Привіт, {name}.</p>
    </>
  );
}
```

```css
button { display: block; margin-bottom: 20px; }
```

</Sandpack>

---

### Збереження інформації з попередніх рендерів {/*storing-information-from-previous-renders*/}

Зазвичай ви оновлюєте стан у обробниках подій. Але іноді виникає потреба змінити стан у відповідь на сам рендер — наприклад, змінити стан, коли змінюється пропс.

У більшості випадків це не потрібно:

* **Якщо значення можна обчислити на основі поточних пропсів або стану — [взагалі не зберігайте його в стані.](/learn/choosing-the-state-structure#avoid-redundant-state)** Якщо ви переймаєтеся через повторне обчислення, допоможе хук [`useMemo`](/reference/react/useMemo).
* Якщо потрібно скинути стан усього піддерева компонентів — [передайте новий `key` вашому компоненту.](#resetting-state-with-a-key)
* Якщо можливо — оновлюйте увесь потрібний стан всередині обробників подій.

У рідкісних випадках, коли жодне з цих рішень не підходить, можна скористатися шаблоном, у якому функція `set` викликається під час рендеру, аби оновити стан на основі значень, які вже були відрендерені.

Ось приклад. Компонент `CountLabel` показує проп `count`, який йому передано:

```js src/CountLabel.js
export default function CountLabel({ count }) {
  return <h1>{count}</h1>
}
```

Скажімо, ви хочете показувати, чи значення лічильника *зросло чи зменшилося* з моменту останньої зміни. Сам по собі `count` цього не показує — потрібно зберігати його попереднє значення. Додайте змінну стану `prevCount`, щоб відстежувати його. Додайте також `trend`, яка зберігатиме, зростає значення чи зменшується. Порівняйте `prevCount` і `count`, і якщо вони не рівні — оновіть обидва. Тепер ви можете показати не лише поточне значення, але й *як воно змінилось*.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import CountLabel from './CountLabel.js';

export default function App() {
  const [count, setCount] = useState(0);
  return (
    <>
      <button onClick={() => setCount(count + 1)}>
        Збільшити
      </button>
      <button onClick={() => setCount(count - 1)}>
        Зменшити
      </button>
      <CountLabel count={count} />
    </>
  );
}
```

```js src/CountLabel.js active
import { useState } from 'react';

export default function CountLabel({ count }) {
  const [prevCount, setPrevCount] = useState(count);
  const [trend, setTrend] = useState(null);
  if (prevCount !== count) {
    setPrevCount(count);
    setTrend(count > prevCount ? 'зростає' : 'спадає');
  }
  return (
    <>
      <h1>{count}</h1>
      {trend && <p>Значення {trend}</p>}
    </>
  );
}
```

```css
button { margin-bottom: 10px; }
```

</Sandpack>

Зверніть увагу: якщо ви викликаєте `set` під час рендеру, це має бути всередині умови на кшталт `prevCount !== count`, і в тій же умові має бути виклик `setPrevCount(count)`. Інакше компонент зациклиться і зламається. Крім того, так можна оновлювати стан лише *поточного компонента*. Виклик `set` в *іншому* компоненті під час рендеру — помилка. Нарешті, виклик `set` усе одно має [оновлювати стан без мутацій](#updating-objects-and-arrays-in-state), також це не дозвіл порушувати інші [правила чистих функцій.](/learn/keeping-components-pure)

Цей патерн досить складний для розуміння і зазвичай краще його уникати. Але він кращий, ніж оновлення стану в ефекті. Коли ви викликаєте `set` під час рендеру, React виконає повторний рендер компонента одразу після `return`, до того, як почне рендерити дочірні. Тобто, дочірні компоненти не рендеряться двічі. Решта вашої функції-компонента все одно виконається (але її результат буде відкинуто). Якщо умова виклику `set` йде після всіх хуків — можна зробити ранній `return;`, аби почати рендер раніше.

---

## Поширені проблеми {/*troubleshooting*/}

### Я оновив стан, але в консолі виводиться старе значення {/*ive-updated-the-state-but-logging-gives-me-the-old-value*/}

Виклик функції `set` **не змінює стан у виконуваному коді**:

```js {4,5,8}
function handleClick() {
  console.log(count);  // 0

  setCount(count + 1); // Запит на ререндер із 1
  console.log(count);  // Все ще 0!

  setTimeout(() => {
    console.log(count); // Також 0!
  }, 5000);
}
```

Це тому, що [стан поводиться як знімок (snapshot).](/learn/state-as-a-snapshot) Оновлення стану — це запит на новий рендер із новим значенням стану, але воно не змінює змінну `count` у вже виконуваному обробнику подій.

Якщо вам потрібно використати наступний стан — збережіть його в змінну перед переданням у `set`:

```js
const nextCount = count + 1;
setCount(nextCount);

console.log(count);     // 0
console.log(nextCount); // 1
```

---

### Я оновив стан, але інтерфейс не оновлюється {/*ive-updated-the-state-but-the-screen-doesnt-update*/}

React **ігноруватиме ваше оновлення, якщо новий стан ідентичний попередньому,** згідно з порівнянням за [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is). Це зазвичай трапляється, коли ви напряму змінюєте об’єкт або масив у стані:

```js
obj.x = 10;  // 🚩 Помилка: мутація існуючого об’єкта
setObj(obj); // 🚩 Не спрацює
```

Ви змінили існуючий об’єкт `obj` і знову передали його у `setObj`, тому React проігнорував оновлення. Щоб це виправити, потрібно завжди [_замінювати_ об’єкти й масиви у стані замість того, щоб _мутувати_ їх](#updating-objects-and-arrays-in-state):

```js
// ✅ Правильно: створення нового об’єкта
setObj({
  ...obj,
  x: 10
});
```

---

### Я отримую помилку: "Too many re-renders" {/*im-getting-an-error-too-many-re-renders*/}

Ви можете побачити помилку: `Too many re-renders. React limits the number of renders to prevent an infinite loop.` Зазвичай це означає, що ви безумовно викликаєте оновлення стану *під час рендеру*, тому компонент входить у цикл: рендер, оновлення стану (яке спричиняє рендер), рендер, оновлення стану і так далі. Дуже часто це трапляється через помилку в написанні обробника подій:

```js {1-2}
// 🚩 Помилка: обробник викликається під час рендеру
return <button onClick={handleClick()}>Натисни мене</button>

// ✅ Правильно: передається посилання на обробник
return <button onClick={handleClick}>Натисни мене</button>

// ✅ Правильно: передається стрілочна функція
return <button onClick={(e) => handleClick(e)}>Натисни мене</button>
```

Якщо не можете знайти причину цієї помилки, натисніть стрілку поруч із повідомленням у консолі та перегляньте стек викликів JavaScript, щоб знайти конкретний виклик функції `set`, що спричиняє помилку.

---

### Моя функція-ініціалізатор або функція-оновлювач виконується двічі {/*my-initializer-or-updater-function-runs-twice*/}

У [режимі Strict Mode](/reference/react/StrictMode) React викликає деякі з ваших функцій двічі замість одного разу:

```js {2,5-6,11-12}
function TodoList() {
  // Ця функція-компонент виконуватиметься двічі під час кожного рендеру.

  const [todos, setTodos] = useState(() => {
    // Ця функція-ініціалізатор буде викликана двічі під час ініціалізації.
    return createTodos();
  });

  function handleClick() {
    setTodos(prevTodos => {
      // Ця функція-оновлювач буде викликана двічі при кожному кліку.
      return [...prevTodos, createTodo()];
    });
  }
  // ...
```

Це очікувана поведінка і вона не повинна порушити логіку вашого коду.

Це **лише для розробки** і допомагає [зберігати компоненти чистими.](/learn/keeping-components-pure) React використовує результат одного з викликів і ігнорує результат іншого. Якщо ваш компонент, ініціалізатор і функція-оновлювач є чистими, ця поведінка не повинна вплинути на логіку. Якщо ж вони мають побічні ефекти — це допоможе виявити помилки.

Наприклад, ось ця нечиста функція-оновлювач мутує масив у стані:

```js {2,3}
setTodos(prevTodos => {
  // 🚩 Помилка: мутація стану
  prevTodos.push(createTodo());
});
```

Оскільки React викликає вашу функцію-оновлювач двічі, ви побачите, що todo додано двічі — це сигналізує про помилку. У цьому випадку можна виправити це [замінюючи масив новим, а не мутуючи його](#updating-objects-and-arrays-in-state):

```js {2,3}
setTodos(prevTodos => {
  // ✅ Правильно: створення нового стану
  return [...prevTodos, createTodo()];
});
```

Тепер, коли ця функція-оновлювач чиста, її повторний виклик не змінює поведінки. Саме тому подвійний виклик допомагає виявляти помилки. **Лише функції компонента, ініціалізатора та оновлення повинні бути чистими.** Обробники подій не повинні бути чистими, тож React ніколи не викликатиме їх двічі.

Дізнайтесь більше з розділу [про чистоту компонентів.](/learn/keeping-components-pure)

---

### Я намагаюся зберегти у стан функцію, але вона викликається замість цього {/*im-trying-to-set-state-to-a-function-but-it-gets-called-instead*/}

Не можна зберігати функцію у стан ось так:

```js
const [fn, setFn] = useState(someFunction);

function handleClick() {
  setFn(someOtherFunction);
}
```

Оскільки ви передаєте функцію, React припускає, що `someFunction` — це [функція-ініціалізатор](#avoiding-recreating-the-initial-state), а `someOtherFunction` — [функція-оновлювач](#updating-state-based-on-the-previous-state), тому намагається викликати їх і зберегти результат. Щоб насправді *зберегти* функцію, потрібно додати `() =>` перед ними в обох випадках. Тоді React збереже передані вами функції.

```js {1,4}
const [fn, setFn] = useState(() => someFunction);

function handleClick() {
  setFn(() => someOtherFunction);
}
```
