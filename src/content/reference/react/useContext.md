---
title: useContext
---

<Intro>

`useContext` це хук, який дозволяє читати [контекст](/learn/passing-data-deeply-with-context) компонента та підписуватися на нього.

```js
const value = useContext(SomeContext)
```

</Intro>

<InlineToc />

---

## Опис {/*reference*/}

### `useContext(SomeContext)` {/*usecontext*/}

Викличте `useContext` на верхньому рівні компонента, щоб прочитати та підписатися на [контекст.](/learn/passing-data-deeply-with-context)

```js
import { useContext } from 'react';

function MyComponent() {
  const theme = useContext(ThemeContext);
  // ...
```

[Перегляньте більше прикладів нижче.](#usage)

#### Параметри {/*parameters*/}

* `SomeContext`: це об'єкт контексту, який було створено за допомогою функції [`createContext`](/reference/react/createContext). Контекст безпосередньо не містить інформацію, він лише визначає, що ви можете передати або отримати з компонентів.

#### Результат {/*returns*/}

`useContext` повертає значення контексту для компонента, що викликає цей хук. Це значення визначається як `value`, передане найближчому `SomeContext`, розташованому вище деревом відносно поточного компонента. Якщо такого провайдера немає, повертається значення `defaultValue`, яке ви передали функції [`createContext`](/reference/react/createContext). Повернуте значення завжди актуальне. React автоматично повторно рендерить усі компоненти, що використовують контекст, якщо значення контексту змінюється.

#### Застереження {/*caveats*/}

* Eлементи-провайдери не впливають на виклик `useContext()` у компоненті, з якого й повертаються. Відповідний `<Context>` **повинен бути розташований *вище*** компонента, що викликає `useContext()`.
* React **автоматично оновлює** всі дочірні компоненти, які використовують певний контекст, починаючи з провайдера, що отримує змінене значення `value`. Попереднє та наступне значення порівнюються за допомогою [`Object.is`](https://webdoky.org/uk/docs/Web/JavaScript/Reference/Global_Objects/Object/is/). Пропуск повторних рендерів за допомогою [`memo`](/reference/react/memo) не заважає дочірнім компонентам отримувати оновлене значення контексту.
* Якщо ваша система збирання створює дублікати модулів у вихідному коді (що може статися через символьні посилання), це може порушити контекст. Передавання через контекст працює тільки у разі, якщо `SomeContext` для надання контексту та `SomeContext` для його зчитування є ***точно* тим самим об'єктом**, що визначається порівнянням `===`.

---

## Використання {/*usage*/}


### Передавання даних глибоко в дерево компонентів {/*passing-data-deeply-into-the-tree*/}

Викликайте `useContext` на верхньому рівні вашого компонента, щоб зчитувати та підписуватися на [контекст.](/learn/passing-data-deeply-with-context)

```js [[2, 4, "theme"], [1, 4, "ThemeContext"]]
import { useContext } from 'react';

function Button() {
  const theme = useContext(ThemeContext);
  // ...
```

`useContext` повертає <CodeStep step={2}>значення</CodeStep> для <CodeStep step={1}>контексту</CodeStep>, який ви передали. Щоб визначити це значення, React шукає деревом компонентів та знаходить **найближчого провайдера вище** для цього конкретного контексту.

Щоб передати контекст до компонента `Button`, обгорніть його або один із його батьківських компонентів у відповідний провайдер:

```js [[1, 3, "ThemeContext"], [2, 3, "\\"dark\\""], [1, 5, "ThemeContext"]]
function MyPage() {
  return (
    <ThemeContext value="dark">
      <Form />
    </ThemeContext>
  );
}

function Form() {
  // ... рендерить кнопки всередині ...
}
```

Не має значення, скільки шарів компонентів між провайдером та `Button`. Якщо `Button` у *будь-якому* місці всередині `Form` викликає `useContext(ThemeContext)`, він отримає `"dark"` у якості значення.

<Pitfall>

`useContext()` завжди шукає найближчого провайдера *над* компонентом, що його викликає. Він просувається вгору деревом компонентів і **не** враховує провайдери в тому самому компоненті, де викликається `useContext()`.

</Pitfall>

<Sandpack>

```js
import { createContext, useContext } from 'react';

const ThemeContext = createContext(null);

export default function MyApp() {
  return (
    <ThemeContext value="dark">
      <Form />
    </ThemeContext>
  )
}

function Form() {
  return (
    <Panel title="Ласкаво просимо">
      <Button>Зареєструватися</Button>
      <Button>Увійти</Button>
    </Panel>
  );
}

function Panel({ title, children }) {
  const theme = useContext(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ children }) {
  const theme = useContext(ThemeContext);
  const className = 'button-' + theme;
  return (
    <button className={className}>
      {children}
    </button>
  );
}
```

```css
.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>

---

### Оновлення даних, переданих через контекст {/*updating-data-passed-via-context*/}

Часто виникає потреба змінювати контекст. Щоб оновлювати контекст, поєднайте його зі [станом.](/reference/react/useState) Оголосіть змінну стану в батьківському компоненті та передайте поточний стан як <CodeStep step={2}>значення контексту</CodeStep> провайдеру.

```js {2} [[1, 4, "ThemeContext"], [2, 4, "theme"], [1, 11, "ThemeContext"]]
function MyPage() {
  const [theme, setTheme] = useState('dark');
  return (
    <ThemeContext value={theme}>
      <Form />
      <Button onClick={() => {
        setTheme('light');
      }}>
        Увімкнути світлу тему
      </Button>
    </ThemeContext>
  );
}
```

Тепер будь-який `Button` всередині провайдера отримає поточне значення `theme`. Якщо викличете `setTheme`, щоб оновити значення `theme`, яке передається провайдеру, всі компоненти `Button` автоматично відрендеряться з новим значенням `'light'`.

<Recipes titleText="Приклад оновлення контексту" titleId="examples-basic">

#### Оновлення значення за допомогою контексту {/*updating-a-value-via-context*/}

У цьому прикладі компонент `MyApp` містить змінну стану, яка передається провайдеру `ThemeContext`. Вибір прапорця "Темний режим" оновлює стан. Зміна переданого значення викликає повторний рендер усіх компонентів, які використовують цей контекст.

<Sandpack>

```js
import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext(null);

export default function MyApp() {
  const [theme, setTheme] = useState('light');
  return (
    <ThemeContext value={theme}>
      <Form />
      <label>
        <input
          type="checkbox"
          checked={theme === 'dark'}
          onChange={(e) => {
            setTheme(e.target.checked ? 'dark' : 'light')
          }}
        />
        Темний режим
      </label>
    </ThemeContext>
  )
}

function Form({ children }) {
  return (
    <Panel title="Ласкаво просимо">
      <Button>Зареєструватися</Button>
      <Button>Увійти</Button>
    </Panel>
  );
}

function Panel({ title, children }) {
  const theme = useContext(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ children }) {
  const theme = useContext(ThemeContext);
  const className = 'button-' + theme;
  return (
    <button className={className}>
      {children}
    </button>
  );
}
```

```css
.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 10px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>

Зверніть увагу, що `value="dark"` передає стрічкову змінну `"dark"`, але `value={theme}` передає значення змінної JavaScript `theme` із [фігурними дужками JSX.](/learn/javascript-in-jsx-with-curly-braces) Фігурні дужки також дають змогу передавати значення контексту, які не є стрічками.

<Solution />

#### Оновлення об'єкта через контекст {/*updating-an-object-via-context*/}

У цьому прикладі є змінна стану `currentUser`, яка містить об'єкт. Об'єднайте `{ currentUser, setCurrentUser }` в один об'єкт і передайте його як значення контексту через `value={}`. Це дасть змогу будь-якому компоненту нижче, як-от `LoginButton`, зчитувати як значення `currentUser`, так і функцію `setCurrentUser`, а також викликати останню за потреби.

<Sandpack>

```js
import { createContext, useContext, useState } from 'react';

const CurrentUserContext = createContext(null);

export default function MyApp() {
  const [currentUser, setCurrentUser] = useState(null);
  return (
    <CurrentUserContext
      value={{
        currentUser,
        setCurrentUser
      }}
    >
      <Form />
    </CurrentUserContext>
  );
}

function Form({ children }) {
  return (
    <Panel title="Ласкаво просимо">
      <LoginButton />
    </Panel>
  );
}

function LoginButton() {
  const {
    currentUser,
    setCurrentUser
  } = useContext(CurrentUserContext);

  if (currentUser !== null) {
    return <p>Ви увійшли як {currentUser.name}.</p>;
  }

  return (
    <Button onClick={() => {
      setCurrentUser({ name: 'Advika' })
    }}>Увійти як Advika</Button>
  );
}

function Panel({ title, children }) {
  return (
    <section className="panel">
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}
```

```css
label {
  display: block;
}

.panel {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 10px;
}

.button {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}
```

</Sandpack>

<Solution />

#### Декілька контекстів {/*multiple-contexts*/}

У цьому прикладі є два незалежних контексти. `ThemeContext` надає поточну тему як стрічкову змінну, тоді як `CurrentUserContext` містить об'єкт, що представляє поточного користувача.

<Sandpack>

```js
import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext(null);
const CurrentUserContext = createContext(null);

export default function MyApp() {
  const [theme, setTheme] = useState('light');
  const [currentUser, setCurrentUser] = useState(null);
  return (
    <ThemeContext value={theme}>
      <CurrentUserContext
        value={{
          currentUser,
          setCurrentUser
        }}
      >
        <WelcomePanel />
        <label>
          <input
            type="checkbox"
            checked={theme === 'dark'}
            onChange={(e) => {
              setTheme(e.target.checked ? 'dark' : 'light')
            }}
          />
          Темний режим
        </label>
      </CurrentUserContext>
    </ThemeContext>
  )
}

function WelcomePanel({ children }) {
  const {currentUser} = useContext(CurrentUserContext);
  return (
    <Panel title="Ласкаво просимо">
      {currentUser !== null ?
        <Greeting /> :
        <LoginForm />
      }
    </Panel>
  );
}

function Greeting() {
  const {currentUser} = useContext(CurrentUserContext);
  return (
    <p>Ви увійшли як {currentUser.name}.</p>
  )
}

function LoginForm() {
  const {setCurrentUser} = useContext(CurrentUserContext);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const canLogin = firstName.trim() !== '' && lastName.trim() !== '';
  return (
    <>
      <label>
        Ім'я{': '}
        <input
          required
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
        />
      </label>
      <label>
        Прізвище{': '}
        <input
        required
          value={lastName}
          onChange={e => setLastName(e.target.value)}
        />
      </label>
      <Button
        disabled={!canLogin}
        onClick={() => {
          setCurrentUser({
            name: firstName + ' ' + lastName
          });
        }}
      >
        Увійти
      </Button>
      {!canLogin && <i>Заповніть обидва поля.</i>}
    </>
  );
}

function Panel({ title, children }) {
  const theme = useContext(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ children, disabled, onClick }) {
  const theme = useContext(ThemeContext);
  const className = 'button-' + theme;
  return (
    <button
      className={className}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
```

```css
label {
  display: block;
}

.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 10px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>

<Solution />

#### Винесення провайдерів в окремий компонент {/*extracting-providers-to-a-component*/}

Коли ваш застосунок зростає, ближче до кореня з'являється "піраміда" контекстів. Це цілком нормально. Однак, якщо вам не подобається складна ієрархія з естетичної точки зору, ви можете винести провайдери в окремий компонент. У цьому прикладі `MyProviders` приховує "технічні деталі" і рендерить передані йому дочірні компоненти всередині необхідних провайдерів. Зверніть увагу, що стан `theme` і `setTheme` необхідний безпосередньо в компоненті `MyApp`, тому `MyApp` все ще керує цією частиною стану.

<Sandpack>

```js
import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext(null);
const CurrentUserContext = createContext(null);

export default function MyApp() {
  const [theme, setTheme] = useState('light');
  return (
    <MyProviders theme={theme} setTheme={setTheme}>
      <WelcomePanel />
      <label>
        <input
          type="checkbox"
          checked={theme === 'dark'}
          onChange={(e) => {
            setTheme(e.target.checked ? 'dark' : 'light')
          }}
        />
        Темний режим
      </label>
    </MyProviders>
  );
}

function MyProviders({ children, theme, setTheme }) {
  const [currentUser, setCurrentUser] = useState(null);
  return (
    <ThemeContext value={theme}>
      <CurrentUserContext
        value={{
          currentUser,
          setCurrentUser
        }}
      >
        {children}
      </CurrentUserContext>
    </ThemeContext>
  );
}

function WelcomePanel({ children }) {
  const {currentUser} = useContext(CurrentUserContext);
  return (
    <Panel title="Ласкаво просимо">
      {currentUser !== null ?
        <Greeting /> :
        <LoginForm />
      }
    </Panel>
  );
}

function Greeting() {
  const {currentUser} = useContext(CurrentUserContext);
  return (
    <p>Ви увійшли як {currentUser.name}.</p>
  )
}

function LoginForm() {
  const {setCurrentUser} = useContext(CurrentUserContext);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const canLogin = firstName !== '' && lastName !== '';
  return (
    <>
      <label>
        Ім'я{': '}
        <input
          required
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
        />
      </label>
      <label>
        Прізвище{': '}
        <input
        required
          value={lastName}
          onChange={e => setLastName(e.target.value)}
        />
      </label>
      <Button
        disabled={!canLogin}
        onClick={() => {
          setCurrentUser({
            name: firstName + ' ' + lastName
          });
        }}
      >
        Увійти
      </Button>
      {!canLogin && <i>Заповніть обидва поля.</i>}
    </>
  );
}

function Panel({ title, children }) {
  const theme = useContext(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ children, disabled, onClick }) {
  const theme = useContext(ThemeContext);
  const className = 'button-' + theme;
  return (
    <button
      className={className}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
```

```css
label {
  display: block;
}

.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 10px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>

<Solution />

#### Масштабування з використанням контексту та редюсера {/*scaling-up-with-context-and-a-reducer*/}

У більших застосунках часто поєднують контекст із [редюсером](/reference/react/useReducer), щоб винести пов'язану зі станом логіку за межі компонентів. У цьому прикладі вся "інфраструктура" прихована в `TasksContext.js`, який містить редюсер і два окремих контексти.

Перегляньте [повний приклад](/learn/scaling-up-with-reducer-and-context) цього процесу.

<Sandpack>

```js src/App.js
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';
import { TasksProvider } from './TasksContext.js';

export default function TaskApp() {
  return (
    <TasksProvider>
      <h1>Вихідний день у Кіото</h1>
      <AddTask />
      <TaskList />
    </TasksProvider>
  );
}
```

```js src/TasksContext.js
import { createContext, useContext, useReducer } from 'react';

const TasksContext = createContext(null);

const TasksDispatchContext = createContext(null);

export function TasksProvider({ children }) {
  const [tasks, dispatch] = useReducer(
    tasksReducer,
    initialTasks
  );

  return (
    <TasksContext value={tasks}>
      <TasksDispatchContext value={dispatch}>
        {children}
      </TasksDispatchContext>
    </TasksContext>
  );
}

export function useTasks() {
  return useContext(TasksContext);
}

export function useTasksDispatch() {
  return useContext(TasksDispatchContext);
}

function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      return [...tasks, {
        id: action.id,
        text: action.text,
        done: false
      }];
    }
    case 'changed': {
      return tasks.map(t => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter(t => t.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

const initialTasks = [
  { id: 0, text: 'Шлях філософа', done: true },
  { id: 1, text: 'Відвідати храм', done: false },
  { id: 2, text: 'Випити матчу', done: false }
];
```

```js src/AddTask.js
import { useState, useContext } from 'react';
import { useTasksDispatch } from './TasksContext.js';

export default function AddTask() {
  const [text, setText] = useState('');
  const dispatch = useTasksDispatch();
  return (
    <>
      <input
        placeholder="Додати завдання"
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => {
        setText('');
        dispatch({
          type: 'added',
          id: nextId++,
          text: text,
        });
<<<<<<< HEAD
      }}>Додати</button>
=======
      }}>Add</button>
>>>>>>> abe931a8cb3aee3e8b15ef7e187214789164162a
    </>
  );
}

let nextId = 3;
```

```js src/TaskList.js
import { useState, useContext } from 'react';
import { useTasks, useTasksDispatch } from './TasksContext.js';

export default function TaskList() {
  const tasks = useTasks();
  return (
    <ul>
      {tasks.map(task => (
        <li key={task.id}>
          <Task task={task} />
        </li>
      ))}
    </ul>
  );
}

function Task({ task }) {
  const [isEditing, setIsEditing] = useState(false);
  const dispatch = useTasksDispatch();
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={e => {
            dispatch({
              type: 'changed',
              task: {
                ...task,
                text: e.target.value
              }
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Зберегти
        </button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
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
        checked={task.done}
        onChange={e => {
          dispatch({
            type: 'changed',
            task: {
              ...task,
              done: e.target.checked
            }
          });
        }}
      />
      {taskContent}
      <button onClick={() => {
        dispatch({
          type: 'deleted',
          id: task.id
        });
      }}>
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

</Recipes>

---

### Задання початкового значення {/*specifying-a-fallback-default-value*/}

Якщо React не знайде жодного провайдера для конкретного <CodeStep step={1}>контексту</CodeStep> у дереві батьківських компонентів, значення, яке повертає `useContext()`, буде дорівнювати <CodeStep step={3}>початковому значенню</CodeStep>, вказаному під час [створення контексту](/reference/react/createContext):

```js [[1, 1, "ThemeContext"], [3, 1, "null"]]
const ThemeContext = createContext(null);
```

Початкове значення **ніколи не змінюється**. Якщо ви хочете оновити контекст, використовуйте його разом зі станом, як [описано вище.](#updating-data-passed-via-context)

Зазвичай замість `null` можна визначити якесь більш змістовне початкове значення, наприклад:

```js [[1, 1, "ThemeContext"], [3, 1, "light"]]
const ThemeContext = createContext('light');
```

Так, якщо випадково відрендерите якийсь компонент без відповідного провайдера, це не призведе до помилки. І також допоможе компонентам відпрацювати в тестовому середовищі без налаштування провайдерів.

У прикладі нижче кнопка "Перемкнути тему" завжди буде світлою, тому що вона **знаходиться поза жодним провайдером теми**, а початкове значенням теми — `'light'`. Спробуйте змінити початкову тему на `'dark'`.

<Sandpack>

```js
import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext('light');

export default function MyApp() {
  const [theme, setTheme] = useState('light');
  return (
    <>
      <ThemeContext value={theme}>
        <Form />
      </ThemeContext>
      <Button onClick={() => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
      }}>
        Перемкнути тему
      </Button>
    </>
  )
}

function Form({ children }) {
  return (
    <Panel title="Ласкаво просимо">
      <Button>Зареєструватися</Button>
      <Button>Увійти</Button>
    </Panel>
  );
}

function Panel({ title, children }) {
  const theme = useContext(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ children, onClick }) {
  const theme = useContext(ThemeContext);
  const className = 'button-' + theme;
  return (
    <button className={className} onClick={onClick}>
      {children}
    </button>
  );
}
```

```css
.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 10px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>

---

### Перевизначення контексту частини дерева {/*overriding-context-for-a-part-of-the-tree*/}

Можливо перевизначити контекст для частини дерева компонентів, обгорнувши цю частину у провайдер з іншим значенням.

```js {3,5}
<ThemeContext value="dark">
  ...
  <ThemeContext value="light">
    <Footer />
  </ThemeContext>
  ...
</ThemeContext>
```

Провайдери можна вкладати і перевизначати без обмежень.

<Recipes titleText="Приклади перевизначення контексту">

#### Перевизначення теми {/*overriding-a-theme*/}

У цьому прикладі кнопка *всередині* `Footer` отримує інше значення контексту (`"light"`), ніж кнопки зовні (`"dark"`).

<Sandpack>

```js
import { createContext, useContext } from 'react';

const ThemeContext = createContext(null);

export default function MyApp() {
  return (
    <ThemeContext value="dark">
      <Form />
    </ThemeContext>
  )
}

function Form() {
  return (
    <Panel title="Ласкаво просимо">
      <Button>Зареєструватися</Button>
      <Button>Увійти</Button>
      <ThemeContext value="light">
        <Footer />
      </ThemeContext>
    </Panel>
  );
}

function Footer() {
  return (
    <footer>
      <Button>Налаштування</Button>
    </footer>
  );
}

function Panel({ title, children }) {
  const theme = useContext(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      {title && <h1>{title}</h1>}
      {children}
    </section>
  )
}

function Button({ children }) {
  const theme = useContext(ThemeContext);
  const className = 'button-' + theme;
  return (
    <button className={className}>
      {children}
    </button>
  );
}
```

```css
footer {
  margin-top: 20px;
  border-top: 1px solid #aaa;
}

.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>

<Solution />

#### Автоматичне вкладення заголовків {/*automatically-nested-headings*/}

Ви можете "накопичувати" інформацію, коли вкладаєте провайдери контексту один в одного. У цьому прикладі компонент `Section` відстежує `LevelContext`, який визначає глибину вкладення секцій. Він зчитує `LevelContext` із батьківської секції та передає зі збільшеним на одиницю значенням своїм дочірнім елементам. У підсумку компонент `Heading` може автоматично визначати, який із тегів `<h1>`, `<h2>`, `<h3>`, ... , використовувати в залежності від кількості вкладених компонентів `Section`.

Перегляньте [детальний приклад](/learn/passing-data-deeply-with-context) цього процесу.

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section>
      <Heading>Title</Heading>
      <Section>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Section>
          <Heading>Sub-heading</Heading>
          <Heading>Sub-heading</Heading>
          <Heading>Sub-heading</Heading>
          <Section>
            <Heading>Sub-sub-heading</Heading>
            <Heading>Sub-sub-heading</Heading>
            <Heading>Sub-sub-heading</Heading>
          </Section>
        </Section>
      </Section>
    </Section>
  );
}
```

```js src/Section.js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Section({ children }) {
  const level = useContext(LevelContext);
  return (
    <section className="section">
      <LevelContext value={level + 1}>
        {children}
      </LevelContext>
    </section>
  );
}
```

```js src/Heading.js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Heading({ children }) {
  const level = useContext(LevelContext);
  switch (level) {
    case 0:
      throw Error('Заголовок повинен бути всередині секції!');
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('Невідомий рівень: ' + level);
  }
}
```

```js src/LevelContext.js
import { createContext } from 'react';

export const LevelContext = createContext(0);
```

```css
.section {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
}
```

</Sandpack>

<Solution />

</Recipes>

---

### Усунення зайвих рендерів під час передавання об'єктів і функцій {/*optimizing-re-renders-when-passing-objects-and-functions*/}

Ви можете передавати будь-які значення через контекст, включно з об'єктами та функціями.

```js [[2, 10, "{ currentUser, login }"]]
function MyApp() {
  const [currentUser, setCurrentUser] = useState(null);

  function login(response) {
    storeCredentials(response.credentials);
    setCurrentUser(response.user);
  }

  return (
    <AuthContext value={{ currentUser, login }}>
      <Page />
    </AuthContext>
  );
}
```

Тут <CodeStep step={2}>значення контексту</CodeStep> є об'єктом JavaScript із двома властивостями, одна з яких є функцією. Щоразу, коли `MyApp` повторно рендериться (наприклад, під час оновлення маршруту), це буде *інший* об'єкт, що вказує на *іншу* функцію, тому React доведеться повторно рендерити всі глибоко розташовані в дереві компоненти, які викликають `useContext(AuthContext)`.

У менших застосунках це не є проблемою. Однак немає потреби повторно рендерити компоненти, якщо основні дані, як-от `currentUser`, не змінилися. Щоб оптимізувати роботу React, ви можете обгорнути функцію `login` у [`useCallback`](/reference/react/useCallback), а створення об'єкта — в [`useMemo`](/reference/react/useMemo). Це є оптимізацією продуктивності:

```js {6,9,11,14,17}
import { useCallback, useMemo } from 'react';

function MyApp() {
  const [currentUser, setCurrentUser] = useState(null);

  const login = useCallback((response) => {
    storeCredentials(response.credentials);
    setCurrentUser(response.user);
  }, []);

  const contextValue = useMemo(() => ({
    currentUser,
    login
  }), [currentUser, login]);

  return (
    <AuthContext value={contextValue}>
      <Page />
    </AuthContext>
  );
}
```

Як наслідок цієї зміни, навіть якщо `MyApp` потребує повторного рендеру, компоненти, що викликають `useContext(AuthContext)`, не потребуватимуть його, якщо `currentUser` не змінився.

Дізнайтеся більше про [`useMemo`](/reference/react/useMemo#skipping-re-rendering-of-components) та [`useCallback`.](/reference/react/useCallback#skipping-re-rendering-of-components)

---

## Усунення несправностей {/*troubleshooting*/}

### Компонент не бачить значення з провайдера {/*my-component-doesnt-see-the-value-from-my-provider*/}

Існує кілька поширених причин, чому це може статися:

1. Ви розміщуєте `<SomeContext>` у тому ж компоненті або нижче, ніж компонент, де викликано `useContext()`. Перемістіть `<SomeContext>` *вище і зовні* компонента, який викликає `useContext()`.
2. Можливо, ви забули обгорнути свій компонент у `<SomeContext>` або розмістили його в іншій, ніж задумали, частині дерева. Переконайтеся за допомогою [React DevTools](/learn/react-developer-tools), що ієрархія компонентів налаштована правильно.
3. Можливо, ви зіткнулися з проблемою збирання, через яку `SomeContext` із компонента-провайдера і `SomeContext` компонента-читача є різними об'єктами. Це може статися, наприклад, якщо ви використовуєте символьні посилання. Можете перевірити це, присвоївши їх глобальним змінним, як-от `window.SomeContext1` і `window.SomeContext2`, а потім порівняти `window.SomeContext1 === window.SomeContext2` в консолі. Якщо вони не тотожні, виправте цю проблему на рівні збирання.

### Я завжди отримую `undefined` із контексту, хоча початкове значення інше {/*i-am-always-getting-undefined-from-my-context-although-the-default-value-is-different*/}

Можливо, у вас є провайдер без `value` у дереві:

```js {1,2}
// 🚩 Не працює: немає пропа value
<ThemeContext>
   <Button />
</ThemeContext>
```

Якщо ви забули вказати `value`, це еквівалентно передаванню `value={undefined}`.

Також, можливо, ви випадково застосували помилкову назву пропа:

```js {1,2}
// 🚩 Не працює: проп має називатися "value"
<ThemeContext theme={theme}>
   <Button />
</ThemeContext>
```

В обох випадках React покаже попередження у консолі. Щоб виправити це, назвіть проп `value`:

```js {1,2}
// ✅ Передача пропа value
<ThemeContext value={theme}>
   <Button />
</ThemeContext>
```

Зверніть увагу, що [початкове значення, яке ви передали у `createContext(defaultValue)`](#specifying-a-fallback-default-value), застосовується, **тільки якщо вище в ієрархії не знайдено жодного провайдера.** Якщо в будь-якому місці дерева батьківських компонентів є `<SomeContext value={undefined}>`, компонент, що викликає `useContext(SomeContext)`, *отримає* `undefined` як значення контексту.
