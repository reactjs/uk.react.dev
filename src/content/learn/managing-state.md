---
title: Управління станом
---

<Intro>

У міру того, як ваш додаток зростає, варто більш уважно ставитися до того, як організовано ваш стан і як відбувається обмін даними між компонентами. Надлишковий або дублюючий стан є поширеним джерелом помилок. У цій главі ви дізнаєтеся, як добре структурувати свій стан, як підтримувати логіку оновлення стану і як ділитися станом між віддаленими компонентами.

</Intro>

<YouWillLearn isChapter={true}>

* [Як сприймати зміни інтерфейсу як зміни стану](/learn/reacting-to-input-with-state)
* [Як правильно структурувати стан](/learn/choosing-the-state-structure)
* [Як «підняти стан», щоб поділитися ним між компонентами](/learn/sharing-state-between-components)
* [Як керувати збереженням або скиданням стану](/learn/preserving-and-resetting-state)
* [Як звести складну логіку станів у функцію](/learn/extracting-state-logic-into-a-reducer)
* [Як передавати інформацію без «prop drilling»](/learn/passing-data-deeply-with-context)
* [Як масштабувати управління станами по мірі зростання вашого додатку](/learn/scaling-up-with-reducer-and-context)

</YouWillLearn>

## Реагування на поле вводу зі станом {/*reacting-to-input-with-state*/}

З React ви не зможете змінювати інтерфейс безпосередньо з коду. Наприклад, ви не будете писати команди на кшталт «вимкнути кнопку», «увімкнути кнопку», «показати повідомлення про успіх» тощо. Замість цього ви опишете інтерфейс, який хочете бачити для різних візуальних станів вашого компонента («початковий стан», «стан введення», «стан успіху»), а потім запустите зміну стану у відповідь на введення користувачем. Це схоже на те, як дизайнери думають про інтерфейс.

Ось форма вікторини, створена з використанням React. Зверніть увагу, як вона використовує змінну стану `status` для визначення того, чи вмикати або вимикати кнопку надсилання, і чи показувати замість неї повідомлення про успішне завершення.

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('друкування');

  if (status === 'успіх') {
    return <h1>That's right!</h1>
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('надсилання');
    try {
      await submitForm(answer);
      setStatus('успіх');
    } catch (err) {
      setStatus('друкування');
      setError(err);
    }
  }

  function handleTextareaChange(e) {
    setAnswer(e.target.value);
  }

  return (
    <>
      <h2>Міська вікторина</h2>
      <p>
          У якому місті є білборд, що перетворює повітря на питну воду?
      </p>
      <form onSubmit={handleSubmit}>
        <textarea
          value={answer}
          onChange={handleTextareaChange}
          disabled={status === 'надсилання'}
        />
        <br />
        <button disabled={
          answer.length === 0 ||
          status === 'надсилання'
        }>
          Submit
        </button>
        {error !== null &&
          <p className="Error">
            {error.message}
          </p>
        }
      </form>
    </>
  );
}

function submitForm(answer) {
  // Уявіть що запит надсилається у мережу.
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      let shouldError = answer.toLowerCase() !== 'lima'
      if (shouldError) {
        reject(new Error('Хороша здогадка, але невірна відповідь. Спробуй ще раз!'));
      } else {
        resolve();
      }
    }, 1500);
  });
}
```

```css
.Error { color: red; }
```

</Sandpack>

<LearnMore path="/learn/reacting-to-input-with-state">

Прочитайте **[Реагування на Поле Вводу зі Станом](/learn/reacting-to-input-with-state)** щоб дізнатися, як підходити до взаємодії з мисленням, керованим станом.

</LearnMore>

## Вибір структури стану {/*choosing-the-state-structure*/}

Правильне структурування стану може зробити різницю між компонентом, який приємно модифікувати та налагоджувати, і компонентом, який є постійним джерелом помилок. Найважливіший принцип полягає в тому, що стан не повинен містити надлишкової або дубльованої інформації. Якщо стан непотрібний, його легко забути оновити, що призведе до появи багів!

Наприклад, ця форма має **надлишкову** змінну стану `fullName`:

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [fullName, setFullName] = useState('');

  function handleFirstNameChange(e) {
    setFirstName(e.target.value);
    setFullName(e.target.value + ' ' + lastName);
  }

  function handleLastNameChange(e) {
    setLastName(e.target.value);
    setFullName(firstName + ' ' + e.target.value);
  }

  return (
    <>
      <h2>Давайте зареєструємо вас</h2>
      <label>
        Ім'я:{' '}
        <input
          value={firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Прізвище:{' '}
        <input
          value={lastName}
          onChange={handleLastNameChange}
        />
      </label>
      <p>
         Ваш квиток буде виданий на ім'я: <b>{fullName}</b>
      </p>
    </>
  );
}
```

```css
label { display: block; margin-bottom: 5px; }
```

</Sandpack>

Ви можете прибрати його і спростити код, обчислюючи `fullName` під час рендерингу компонента:

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const fullName = firstName + ' ' + lastName;

  function handleFirstNameChange(e) {
    setFirstName(e.target.value);
  }

  function handleLastNameChange(e) {
    setLastName(e.target.value);
  }

  return (
    <>
      <h2>Let’s check you in</h2>
      <label>
        Ім'я:{' '}
        <input
          value={firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Прізвище:{' '}
        <input
          value={lastName}
          onChange={handleLastNameChange}
        />
      </label>
      <p>
        Ваш квиток буде виданий на ім'я: <b>{fullName}</b>
      </p>
    </>
  );
}
```

```css
label { display: block; margin-bottom: 5px; }
```

</Sandpack>

Це може здатися невеликою зміною, але багато помилок у React-додатках виправляються саме таким чином.

<LearnMore path="/learn/choosing-the-state-structure">

Прочитайте **[Вибір структури стану](/learn/choosing-the-state-structure)** для того, щоб навчитися проектувати форму стану, щоб уникнути помилок.

</LearnMore>

## Спільний доступ до стану між компонентами {/*sharing-state-between-components*/}

Іноді ви хочете, щоб стан двох компонентів завжди змінювався разом. Для цього вилучіть стан з обох компонентів, перемістіть його до їхнього найближчого спільного батька, а потім передайте його їм через пропси. Це називається «підняттям стану вгору», і це одна з найпоширеніших речей, які ви будете робити під час написання React-коду.

У цьому прикладі лише одна панель має бути активною одночасно. Щоб досягти цього, замість того, щоб тримати активний стан всередині кожної окремої панелі, батьківський компонент тримає стан і визначає пропси для своїх дочірніх компонентів.

<Sandpack>

```js
import { useState } from 'react';

export default function Accordion() {
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <>
      <h2>Алмати, Казахстан</h2>
      <Panel
        title="About"
        isActive={activeIndex === 0}
        onShow={() => setActiveIndex(0)}
      >
        Алмати з населенням близько 2 мільйонів є найбільшим містом Казахстану. З 1929 по 1997 рік він був його столицею.
      </Panel>
      <Panel
        title="Етимологія"
        isActive={activeIndex === 1}
        onShow={() => setActiveIndex(1)}
      >
        Назва походить від <span lang="kk-KZ">алма</span>, Казахстанського слова "яблоко" і часто перекладається як "повний яблук". Насправді, регіон навколо Алмати вважається прабатьківщиною яблука, а дикий <i lang=«la»>Malus sieversii</i> вважається ймовірним кандидатом на предка сучасного домашнього яблука.
      </Panel>
    </>
  );
}

function Panel({
  title,
  children,
  isActive,
  onShow
}) {
  return (
    <section className="panel">
      <h3>{title}</h3>
      {isActive ? (
        <p>{children}</p>
      ) : (
        <button onClick={onShow}>
          Показати
        </button>
      )}
    </section>
  );
}
```

```css
h3, p { margin: 5px 0px; }
.panel {
  padding: 10px;
  border: 1px solid #aaa;
}
```

</Sandpack>

<LearnMore path="/learn/sharing-state-between-components">

Прочитайте **[Розподіл стану між компонентами](/learn/sharing-state-between-components)** щоб навчитися піднімати стан і синхронізувати компоненти.

</LearnMore>

##  Збереження та скидання стану {/*preserving-and-resetting-state*/}

Коли ви повторно рендерите компонент, React має вирішити, які частини дерева зберегти (і оновити), а які відкинути або створити з нуля. У більшості випадків автоматична поведінка React працює досить добре. За замовчуванням React зберігає ті частини дерева, які «збігаються» з попередньо відрендереним деревом компонента.

Однак іноді це не те, чого ви хочете. У цьому додатку чату введення повідомлення, а потім перемикання одержувача не скидає введене значення. Це може призвести до того, що користувач випадково надішле повідомлення не тій людині:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';

export default function Messenger() {
  const [to, setTo] = useState(contacts[0]);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedContact={to}
        onSelect={contact => setTo(contact)}
      />
      <Chat contact={to} />
    </div>
  )
}

const contacts = [
  { name: 'Тейлор', email: 'taylor@mail.com' },
  { name: 'Аліса', email: 'alice@mail.com' },
  { name: 'Боб', email: 'bob@mail.com' }
];
```

```js src/ContactList.js
export default function ContactList({
  selectedContact,
  contacts,
  onSelect
}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map(contact =>
          <li key={contact.email}>
            <button onClick={() => {
              onSelect(contact);
            }}>
              {contact.name}
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js src/Chat.js
import { useState } from 'react';

export default function Chat({ contact }) {
  const [text, setText] = useState('');
  return (
    <section className="chat">
      <textarea
        value={text}
        placeholder={'Чат з ' + contact.name}
        onChange={e => setText(e.target.value)}
      />
      <br />
      <button>Відправити {contact.email}</button>
    </section>
  );
}
```

```css
.chat, .contact-list {
  float: left;
  margin-bottom: 20px;
}
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

React дозволяє вам перевизначити поведінку за замовчуванням і *примусити* компонент скинути свій стан, передавши йому інший `ключ`, наприклад, `<Chat key={email} />`. Це повідомляє React, що якщо одержувач інший, його слід вважати *іншим* компонентом `Chat`, який потрібно перестворити з нуля з новими даними (та інтерфейсом користувача, наприклад, входами). Тепер перемикання між одержувачами скидає поле введення - навіть якщо ви рендерите той самий компонент.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';

export default function Messenger() {
  const [to, setTo] = useState(contacts[0]);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedContact={to}
        onSelect={contact => setTo(contact)}
      />
      <Chat key={to.email} contact={to} />
    </div>
  )
}

const contacts = [
  { name: 'Тейлор', email: 'taylor@mail.com' },
  { name: 'Аліса', email: 'alice@mail.com' },
  { name: 'Боб', email: 'bob@mail.com' }
];
```

```js src/ContactList.js
export default function ContactList({
  selectedContact,
  contacts,
  onSelect
}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map(contact =>
          <li key={contact.email}>
            <button onClick={() => {
              onSelect(contact);
            }}>
              {contact.name}
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js src/Chat.js
import { useState } from 'react';

export default function Chat({ contact }) {
  const [text, setText] = useState('');
  return (
    <section className="chat">
      <textarea
        value={text}
        placeholder={'Чат з ' + contact.name}
        onChange={e => setText(e.target.value)}
      />
      <br />
      <button>Відправити {contact.email}</button>
    </section>
  );
}
```

```css
.chat, .contact-list {
  float: left;
  margin-bottom: 20px;
}
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

<LearnMore path="/learn/preserving-and-resetting-state">

Прочитайте **[Збереження та скидання стану](/learn/preserving-and-resetting-state)** щоб дізнатися, як довго живе стан і як його контролювати.

</LearnMore>

## Вилучення логіки станів у редуктор {/*extracting-state-logic-into-a-reducer*/}

Компоненти з великою кількістю оновлень стану, розподілених між багатьма обробниками подій, можуть стати перевантаженими. Для таких випадків ви можете консолідувати всю логіку оновлення стану за межами вашого компонента в одній функції, яка називається «редуктор». Ваші обробники подій стають лаконічнішими, оскільки вони визначають лише «дії» користувача. У нижній частині файлу функція-редуктор визначає, як стан повинен оновлюватися у відповідь на кожну дію!

<Sandpack>

```js src/App.js
import { useReducer } from 'react';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';

export default function TaskApp() {
  const [tasks, dispatch] = useReducer(
    tasksReducer,
    initialTasks
  );

  function handleAddTask(text) {
    dispatch({
      type: 'доданий',
      id: nextId++,
      text: text,
    });
  }

  function handleChangeTask(task) {
    dispatch({
      type: 'змінений',
      task: task
    });
  }

  function handleDeleteTask(taskId) {
    dispatch({
      type: 'видалений',
      id: taskId
    });
  }

  return (
    <>
      <h1>Празький маршрут</h1>
      <AddTask
        onAddTask={handleAddTask}
      />
      <TaskList
        tasks={tasks}
        onChangeTask={handleChangeTask}
        onDeleteTask={handleDeleteTask}
      />
    </>
  );
}

function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'доданий': {
      return [...tasks, {
        id: action.id,
        text: action.text,
        done: false
      }];
    }
    case 'змінений': {
      return tasks.map(t => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'видалений': {
      return tasks.filter(t => t.id !== action.id);
    }
    default: {
      throw Error('Невідома дія: ' + action.type);
    }
  }
}

let nextId = 3;
const initialTasks = [
  { id: 0, text: 'Відвідати музей Кафки', done: true },
  { id: 1, text: 'Подивитись лялкову виставу', done: false },
  { id: 2, text: 'Настінне зображення Леннона', done: false }
];
```

```js src/AddTask.js hidden
import { useState } from 'react';

export default function AddTask({ onAddTask }) {
  const [text, setText] = useState('');
  return (
    <>
      <input
        placeholder="Добавити задачу"
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => {
        setText('');
        onAddTask(text);
      }}>Добавити</button>
    </>
  )
}
```

```js src/TaskList.js hidden
import { useState } from 'react';

export default function TaskList({
  tasks,
  onChangeTask,
  onDeleteTask
}) {
  return (
    <ul>
      {tasks.map(task => (
        <li key={task.id}>
          <Task
            task={task}
            onChange={onChangeTask}
            onDelete={onDeleteTask}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ task, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={e => {
            onChange({
              ...task,
              text: e.target.value
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
          onChange({
            ...task,
            done: e.target.checked
          });
        }}
      />
      {taskContent}
      <button onClick={() => onDelete(task.id)}>
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

<LearnMore path="/learn/extracting-state-logic-into-a-reducer">

Прочитайте **[Вилучення логіки станів у редуктор](/learn/extracting-state-logic-into-a-reducer)** щоб навчитися консолідувати логіку у функції редуктора.

</LearnMore>

## Глибока передача даних з контекстом {/*passing-data-deeply-with-context*/}

Зазвичай, ви передаєте інформацію від батьківського компонента до дочірнього за допомогою пропсів. Але передача пропсів може бути незручною, якщо вам потрібно передати якийсь пропс багатьом компонентам, або якщо багатьом компонентам потрібна однакова інформація. Контекст дозволяє батьківському компоненту зробити певну інформацію доступною для будь-якого компонента у дереві під ним - незалежно від того, наскільки глибоко він знаходиться - без явної передачі її через пропси.

Тут компонент `Heading` визначає рівень свого заголовка, «запитуючи» найближчий `Section` про його рівень. Кожен `Section` відстежує свій власний рівень, запитуючи батьківський `Section` і додаючи до нього один. Кожен `Section` надає інформацію всім компонентам, розташованим нижче нього, без передачі пропсів - він робить це через контекст.

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section>
      <Heading>Назва</Heading>
      <Section>
        <Heading>Заголовок</Heading>
        <Heading>Заголовок</Heading>
        <Heading>Заголовок</Heading>
        <Section>
          <Heading>Підзаголовок</Heading>
          <Heading>Підзаголовок</Heading>
          <Heading>Підзаголовок</Heading>
          <Section>
            <Heading>Підзаголовок 2 рівня</Heading>
            <Heading>Підзаголовок 2 рівня</Heading>
            <Heading>Підзаголовок 2 рівня</Heading>
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
      <LevelContext.Provider value={level + 1}>
        {children}
      </LevelContext.Provider>
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
      throw Error('Заголовок має бути всередині Секції!');
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

<LearnMore path="/learn/passing-data-deeply-with-context">

Прочитайте **[Глибока передача даних з контекстом](/learn/passing-data-deeply-with-context)** щоб дізнатися про використання контексту як альтернативу передачі пропсів.

</LearnMore>

## Масштабування за допомогою редуктора та контексту {/*scaling-up-with-reducer-and-context*/}

Редуктори дозволяють консолідувати логіку оновлення стану компонента. Контекст дозволяє передавати інформацію вглиб інших компонентів. Ви можете комбінувати редуктори та контекст для керування станом складного екрану.

При такому підході батьківський компонент зі складним станом керує ним за допомогою редуктора. Інші компоненти, що знаходяться в глибині дерева, можуть читати його стан через контекст. Вони також можуть відправляти дії для оновлення цього стану.

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
    <TasksContext.Provider value={tasks}>
      <TasksDispatchContext.Provider
        value={dispatch}
      >
        {children}
      </TasksDispatchContext.Provider>
    </TasksContext.Provider>
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
    case 'доданий': {
      return [...tasks, {
        id: action.id,
        text: action.text,
        done: false
      }];
    }
    case 'змінений': {
      return tasks.map(t => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'видалений': {
      return tasks.filter(t => t.id !== action.id);
    }
    default: {
      throw Error('Невідома дія: ' + action.type);
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

export default function AddTask({ onAddTask }) {
  const [text, setText] = useState('');
  const dispatch = useTasksDispatch();
  return (
    <>
      <input
        placeholder="Добавити задачу"
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => {
        setText('');
        dispatch({
          type: 'доданий',
          id: nextId++,
          text: text,
        });
      }}>Добавити</button>
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
              type: 'змінений',
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
            type: 'змінений',
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
          type: 'видалений',
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

<LearnMore path="/learn/scaling-up-with-reducer-and-context">

Прочитайте **[Масштабування за допомогою редуктора та контексту](/learn/scaling-up-with-reducer-and-context)** щоб дізнатися, як масштабується управління станом у зростаючому додатку.

</LearnMore>

## Що далі? {/*whats-next*/}

Перейдіть на сторінку [Реагування на вхід зі станом] (/learn/reacting-to-input-with-state), щоб почати читати цей розділ сторінка за сторінкою!

Або, якщо ви вже знайомі з цими темами, чому б не прочитати про [навмисні витоки в абстрактному шарі.] (/learn/escape-hatches)?
