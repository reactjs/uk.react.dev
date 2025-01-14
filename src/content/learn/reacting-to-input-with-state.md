---
title: Реагування станом на введення
---

<Intro>

React надає декларативний спосіб маніпулювання UI. Замість маніпулювання окремими шматочками UI безпосередньо, слід описувати різні стани, в яких може перебувати компонент, і перемикатися між ними у відповідь на введення користувачем. Це схоже на те, як UI уявляють дизайнери.

</Intro>

<YouWillLearn>

* Як декларативне програмування UI відрізняється від імперативного
* Як перелічити різні візуальні стани, в яких може перебувати компонент
* Як у коді запустити зміни між різними візуальними станами

</YouWillLearn>

## Як декларативний UI відрізняється від імперативного {/*how-declarative-ui-compares-to-imperative*/}

Під час розробки взаємодій із UI, ймовірно, ви думаєте про те, як UI *змінюється* у відповідь на дії користувача. Уявіть форму, що дає користувачу змогу надіслати відповідь:

* Коли ви друкуєте щось у формі, кнопка "Надіслати" **стає увімкненою.**
* Коли ви натискаєте "Надіслати", то і форма, і кнопка **стають вимкненими,** а натомість **з'являється** елемент індикації надсилання.
* Якщо мережевий запит успішний, то форма **ховається,** і **з'являється** повідомлення "Дякуємо".
* Якщо мережевий запит невдалий, то **з'являється** повідомлення про помилку, а форма знову **стає ввімкненою.**

В **імперативному програмуванні** описане вище безпосередньо відповідає тому, як реалізується взаємодія. Доводиться писати прямі інструкції для маніпулювання UI, залежно від того, що відбувається. Ось іще один спосіб подумати про це: уявіть, що їдете з кимось в авто й керуєте поїздкою, називаючи кожний поворот.

<Illustration src="/images/docs/illustrations/i_imperative-ui-programming.png"  alt="В авто, що керується стривоженою особою, яка уособлює JavaScript, пасажир пропонує водієві виконати послідовність складних навігацій, поворот за поворотом." />

Водій не знає, куди ви хочете потрапити, він просто виконує команди. (І якщо ви переплутаєте орієнтири, то опинитеся не там!) Це зветься *імперативним*, тому що доводиться "командувати" кожним елементом, від індикатора до кнопки, кажучи комп'ютеру, *як саме* оновлювати UI.

У цьому прикладі імперативного програмування UI форма створена *без* React. Вна використовує лише браузерний [DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model):

<Sandpack>

```js src/index.js active
async function handleFormSubmit(e) {
  e.preventDefault();
  disable(textarea);
  disable(button);
  show(loadingMessage);
  hide(errorMessage);
  try {
    await submitForm(textarea.value);
    show(successMessage);
    hide(form);
  } catch (err) {
    show(errorMessage);
    errorMessage.textContent = err.message;
  } finally {
    hide(loadingMessage);
    enable(textarea);
    enable(button);
  }
}

function handleTextareaChange() {
  if (textarea.value.length === 0) {
    disable(button);
  } else {
    enable(button);
  }
}

function hide(el) {
  el.style.display = 'none';
}

function show(el) {
  el.style.display = '';
}

function enable(el) {
  el.disabled = false;
}

function disable(el) {
  el.disabled = true;
}

function submitForm(answer) {
  // Зробімо вигляд, що тут відбувається мережевий запит.
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (answer.toLowerCase() === 'стамбул') {
        resolve();
      } else {
        reject(new Error('Гарний варіант, але неправильна відповідь. Спробуйте ще!'));
      }
    }, 1500);
  });
}

let form = document.getElementById('form');
let textarea = document.getElementById('textarea');
let button = document.getElementById('button');
let loadingMessage = document.getElementById('loading');
let errorMessage = document.getElementById('error');
let successMessage = document.getElementById('success');
form.onsubmit = handleFormSubmit;
textarea.oninput = handleTextareaChange;
```

```js sandbox.config.json hidden
{
  "hardReloadOnChange": true
}
```

```html public/index.html
<form id="form">
  <h2>Вікторина міст</h2>
  <p>
    Яке місто розташовано на двох континентах?
  </p>
  <textarea id="textarea"></textarea>
  <br />
  <button id="button" disabled>Надіслати</button>
  <p id="loading" style="display: none">Завантаження...</p>
  <p id="error" style="display: none; color: red;"></p>
</form>
<h1 id="success" style="display: none">Правильно!</h1>

<style>
* { box-sizing: border-box; }
body { font-family: sans-serif; margin: 20px; padding: 0; }
</style>
```

</Sandpack>

Імперативна маніпуляція UI добре працює в ізольованих прикладах, але її складність зростає експоненційно в складніших системах. Уявіть оновлення сторінки, сповненої різних форм, схожих на цю. Додавання нового елемента UI або нової взаємодії може вимагати ретельної перевірки всього наявного коду, аби пересвідчитись, що не з'явився якийсь дефект (наприклад, не забули показати чи приховати щось).

React створений для розв'язання цієї проблеми.

У React ви не маніпулюєте UI безпосередньо, тобто ви не вмикаєте, вимикаєте, показуєте чи приховуєте компоненти безпосередньо. Замість цього ви **оголошуєте, що хочете показати,** і React з'ясовує, як оновити UI. Уявіть, що ви ніби сідаєте в таксі й кажете водієві, куди хочете поїхати, але не керуєте кожним його поворотом. Це його робота — довезти вас туди, і він може навіть знати короткі шляхи, про які ви б не подумали!

<Illustration src="/images/docs/illustrations/i_declarative-ui-programming.png" alt="В авто, яким кермує React, пасажир просить довезти його до конкретного місця на мапі. React з'ясовує, як це зробити." />

## Декларативне осмислення UI {/*thinking-about-ui-declaratively*/}

Вище ви побачили, як реалізувати форму імперативно. Щоб краще зрозуміти, як мислити у стилі React, далі ми проведемо вас крізь повторну реалізацію того самого UI за допомогою React:

1. **З'ясуйте** різні візуальні стани свого компонента
2. **Визначте**, що збуджує ці зміни стану
3. **Представте** стан у пам'яті за допомогою `useState`
4. **Вилучіть** усі несуттєві змінні стану
5. **Приєднайте** обробники подій, щоб задати стан

### Крок 1. З'ясуйте різні візуальні стани свого компонента {/*step-1-identify-your-components-different-visual-states*/}

Досліджуючи комп'ютерні науки, ви могли чути про ["скінченний автомат"](https://uk.wikipedia.org/wiki/%D0%A1%D0%BA%D1%96%D0%BD%D1%87%D0%B5%D0%BD%D0%BD%D0%B8%D0%B9_%D0%B0%D0%B2%D1%82%D0%BE%D0%BC%D0%B0%D1%82), що перебуває в одному з декількох "станів". Якщо ви працюєте разом із дизайнером, то могли бачити макети різних "візуальних станів". React розташований на перетині дизайну та комп'ютерних наук, тож обидві ці ідеї — наші джерела натхнення.

По-перше, необхідно візуалізувати всі різні "стани" UI, які користувач може побачити:

* **Порожній** — форма має вимкнену кнопку "Надіслати".
* **Друкування** — форма має ввімкнену кнопку "Надіслати".
* **Надсилання** — форма повністю вимкнена. Показано індикатор надсилання.
* **Успіх** — замість форми показано повідомлення "Дякуємо".
* **Помилка** — те саме, що для стану "Друкування", але з додатковим повідомленням про помилку.

Як і дизайнеру, вам захочеться "макетувати" чи створити "макети" ("mocks") різних станів, перш ніж додавати логіку. Наприклад, ось макет суто візуальної частини форми. Цей макет контролюється пропом `status`, чиє усталене значення — `'empty'`:

<Sandpack>

```js
export default function Form({
  status = 'empty'
}) {
  if (status === 'success') {
    return <h1>Правильно!</h1>
  }
  return (
    <>
      <h2>Вікторина міст</h2>
      <p>
        У якому місті є білборд, що перетворює повітря на питну воду?
      </p>
      <form>
        <textarea />
        <br />
        <button>
          Надіслати
        </button>
      </form>
    </>
  )
}
```

</Sandpack>

Цей проп можна назвати як завгодно, назва тут неважлива. Спробуйте замінити `status = 'empty'` на `status = 'success'`, щоб побачити появу повідомлення про успіх. Макетування дає змогу швидко ітеруватися в розробці UI перед під'єднанням будь-якої логіки. Ось змістовніший прототип того самого компонента, так само "контрольований" пропом `status`:

<Sandpack>

```js
export default function Form({
  // Спробуйте 'submitting', 'error', 'success':
  status = 'empty'
}) {
  if (status === 'success') {
    return <h1>Правильно!</h1>
  }
  return (
    <>
      <h2>Вікторина міст</h2>
      <p>
        У якому місті є білборд, що перетворює повітря на питну воду?
      </p>
      <form>
        <textarea disabled={
          status === 'submitting'
        } />
        <br />
        <button disabled={
          status === 'empty' ||
          status === 'submitting'
        }>
          Надіслати
        </button>
        {status === 'error' &&
          <p className="Error">
            Гарний варіант, але неправильна відповідь. Спробуйте ще!
          </p>
        }
      </form>
      </>
  );
}
```

```css
.Error { color: red; }
```

</Sandpack>

<DeepDive>

#### Виведення кількох візуальних станів водночас {/*displaying-many-visual-states-at-once*/}

Якщо компонент має багато візуальних станів, було б зручніше показати їх на одній сторінці:

<Sandpack>

```js src/App.js active
import Form from './Form.js';

let statuses = [
  'empty',
  'typing',
  'submitting',
  'success',
  'error',
];

export default function App() {
  return (
    <>
      {statuses.map(status => (
        <section key={status}>
          <h4>Форма ({status}):</h4>
          <Form status={status} />
        </section>
      ))}
    </>
  );
}
```

```js src/Form.js
export default function Form({ status }) {
  if (status === 'success') {
    return <h1>Правильно!</h1>
  }
  return (
    <form>
      <textarea disabled={
        status === 'submitting'
      } />
      <br />
      <button disabled={
        status === 'empty' ||
        status === 'submitting'
      }>
        Надіслати
      </button>
      {status === 'error' &&
        <p className="Error">
          Гарний варіант, але неправильна відповідь. Спробуйте ще!
        </p>
      }
    </form>
  );
}
```

```css
section { border-bottom: 1px solid #aaa; padding: 20px; }
h4 { color: #222; }
body { margin: 0; }
.Error { color: red; }
```

</Sandpack>

Сторінки, схожі на цю, нерідко звуть "живими стилістичними настановами" ("living styleguides") або "сторибуками" ("storybooks").

</DeepDive>

### Крок 2. Визначте, що збуджує ці зміни стану {/*step-2-determine-what-triggers-those-state-changes*/}

Збудити зміни стану можна у відповідь на два види введення:

* **Людське введення,** наприклад, клацання кнопки, друкування в полі, перехід за посиланням.
* **Комп'ютерне введення,** наприклад, надходження мережевої відповіді, завершення таймера, завантаження зображення.

<IllustrationBlock>
  <Illustration caption="Людське введення" alt="Палець." src="/images/docs/illustrations/i_inputs1.png" />
  <Illustration caption="Комп'ютерне введення" alt="Одиниці та нулі." src="/images/docs/illustrations/i_inputs2.png" />
</IllustrationBlock>

В обох випадках **необхідно задати [змінні стану](/learn/state-a-components-memory#anatomy-of-usestate), щоб UI оновився.** У формі, що ми розробляємо, необхідно змінити стан у відповідь на кілька різних введень:

* **Зміни в текстовому полі** (людське) повинні перемкнути форму зі стану *Порожній* до стану *Друкування* та навпаки, залежно від того, чи є текстове поле порожнім.
* **Клацання кнопки "Надіслати"** (людське) повинно перемкнути форму до стану *Надсилання*.
* **Успішна мережева відповідь** (комп'ютерне) повинна перемикати її до стану *Успіх*.
* **Невдала мережева відповідь** (комп'ютерне) повинна перемикати її до стану *Помилка* з відповідним повідомленням про помилку.

<Note>

Зверніть увагу: людське введення нерідко потребує [обробників подій](/learn/responding-to-events)!

</Note>

Щоб легше візуалізувати ці переходи, спробуйте намалювати кожний стан на папері як підписане коло, а кожну зміну між двома станами — стрілкою. Так ви можете накреслити чимало переходів і знайти дефекти задовго до початку реалізації.

<DiagramGroup>

<Diagram name="responding_to_input_flow" height={350} width={688} alt="Діаграма зліва направо, що має 5 вузлів. Перший вузол підписаний 'Empty' (порожній) і має стрілку, підписану 'Start typing' (початок друку), сполучену з вузлом, підписаним 'Submitting' (надсилання), з якого виходять дві стрілки. Стрілка ліворуч підписана 'Network error' (мережева помилка) і сполучає з вузлом, підписаним 'Error' (помилка). Стрілка праворуч підписана 'Network success' (мережевий успіх) і сполучає з вузлом, підписаним 'Success' (успіх).">

Стани форми

</Diagram>

</DiagramGroup>

### Крок 3. Представте стан у пам'яті за допомогою `useState` {/*step-3-represent-the-state-in-memory-with-usestate*/}

Далі необхідно представити візуальні стани свого компонента у пам'яті, використовуючи [`useState`.](/reference/react/useState) Ключовою в цій справі є простота: кожна дрібка стану — це "рухома деталь", і **вам краще мати якомога менше таких "рухомих деталей".** Більше складності — більше помилок!

Почніть зі стану, який *безсумнівно повинен* бути присутній. Наприклад, необхідно зберігати `answer` — значення поля, а також за наявності `error` — останню помилку:

```js
const [answer, setAnswer] = useState('');
const [error, setError] = useState(null);
```

Далі потрібна змінна стану, що представляє те, який із візуальних станів має бути виведений. Зазвичай є більш ніж один спосіб представити це в пам'яті, тому доведеться з цим поекспериментувати.

Якщо вам важко одразу вигадати найкращий спосіб, почніть із додавання такої кількості стану, щоб *напевно* були покриті всі можливі візуальні стани:

```js
const [isEmpty, setIsEmpty] = useState(true);
const [isTyping, setIsTyping] = useState(false);
const [isSubmitting, setIsSubmitting] = useState(false);
const [isSuccess, setIsSuccess] = useState(false);
const [isError, setIsError] = useState(false);
```

Ваш перший варіант навряд буде найкращим із можливих, але це нормально: рефакторинг стану — частина процесу розробки!

### Крок 4. Вилучіть усі несуттєві змінні стану {/*step-4-remove-any-non-essential-state-variables*/}

Краще уникати дублювання вмісту стану, щоб відстежувати лише те, що суттєво. Якщо витратити трохи часу на рефакторинг структури стану, то компоненти стануть легшими для розуміння, зменшиться дублювання, буде менше плутанини. Ваша мета — **уникнути випадків, коли стан у пам'яті не представляє жодного валідного UI, який ви хочете показати користувачу.** (Наприклад, ви не хочете, щоб водночас можна було побачити повідомлення про помилку та вимкнене поле, бо тоді користувач не зможе виправити помилку!)

Ось кілька питань, котрі можна поставити, щодо змінних стану:

* **Чи призводить цей стан до парадоксів?** Наприклад, `isTyping` і `isSubmitting` не можуть водночас бути `true`. Парадокс зазвичай означає, що на стан накладено недостатньо обмежень. Є чотири можливі комбінації двох булевих змінних, але лише три з них відповідають валідним станам. Щоб позбавитися "неможливого" стану, можна поєднати ці змінні в одну змінну `status`, яка повинна мати одне з трьох значень: `'typing'`, `'submitting'` або `'success'`.
* **Чи доступна та сама інформація в іншій змінній стану?** Ще один парадокс: `isEmpty` й `isTyping` не можуть водночас мати значення `true`. Їхнє розділення загрожує можливою розсинхронізацією та породженням помилок. На щастя, можна вилучити `isEmpty`, а натомість перевіряти `answer.length === 0`.
* **Чи можна отримати ту саму інформацію через інверсію іншої змінної стану?** Змінна `isError` не потрібна, тому що можна натомість перевірити `error !== null`.

Після такого прибирання залишаються 3 (із 7 на початку!) *суттєві* змінні стану:

```js
const [answer, setAnswer] = useState('');
const [error, setError] = useState(null);
const [status, setStatus] = useState('typing'); // 'typing', 'submitting' або 'success'
```

Вони суттєві, тому що жодну з них не можна вилучити, не зламавши функціональність.

<DeepDive>

#### Усунення "неможливих" станів за допомогою редюсера {/*eliminating-impossible-states-with-a-reducer*/}

Ці три змінні доволі добре представляють стан цієї форми. Проте є деякі проміжні стани, що не зовсім мають зміст. Наприклад, ненульове значення `error` не має змісту, коли `status` має значення `success`. Щоб точніше змоделювати стан, його можна [виокремити в редюсер.](/learn/extracting-state-logic-into-a-reducer) Редюсери дають змогу уніфікувати кілька змінних стану в один об'єкт, а також скріпити всю пов'язану з ними логіку!

</DeepDive>

### Крок 5. Приєднайте обробники подій, щоб задати стан {/*step-5-connect-the-event-handlers-to-set-state*/}

Врешті-решт, створімо обробники подій, що оновлюють стан. Нижче — остаточний вигляд форми, де під'єднані всі обробники подій:

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('typing');

  if (status === 'success') {
    return <h1>Правильно!</h1>
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('submitting');
    try {
      await submitForm(answer);
      setStatus('success');
    } catch (err) {
      setStatus('typing');
      setError(err);
    }
  }

  function handleTextareaChange(e) {
    setAnswer(e.target.value);
  }

  return (
    <>
      <h2>Вікторина міст</h2>
      <p>
        У якому місті є білборд, що перетворює повітря на питну воду?
      </p>
      <form onSubmit={handleSubmit}>
        <textarea
          value={answer}
          onChange={handleTextareaChange}
          disabled={status === 'submitting'}
        />
        <br />
        <button disabled={
          answer.length === 0 ||
          status === 'submitting'
        }>
          Надіслати
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
  // Удаймо, що тут звертання до мережі.
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      let shouldError = answer.toLowerCase() !== 'lima'
      if (shouldError) {
        reject(new Error('Гарний варіант, але неправильна відповідь. Спробуйте ще!'));
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

Попри те, що цей код не перевищує за розміром вихідний імперативний приклад, він значно надійніший. Вираження всіх взаємодій як змін до стану дає змогу пізніше додавати нові візуальні стани, не ламаючи наявних. Також це дає змогу змінювати те, що повинно виводитися в кожному стані, не змінюючи логіки самої взаємодії.

<Recap>

* Декларативне програмування означає описувати UI для кожного візуального стану, а не займатися мікроменеджментом UI (імперативним стилем).
* Для розробки компонента:
  1. З'ясуйте всі його візуальні стани.
  2. Визначте людські та комп'ютерні тригери змін стану.
  3. Змоделюйте стан за допомогою `useState`.
  4. Вилучіть несуттєві частини стану, щоб уникнути помилок і парадоксів.
  5. Під'єднайте обробників подій, що задаватимуть значення стану.

</Recap>



<Challenges>

#### Додавання та вилучення класу CSS {/*add-and-remove-a-css-class*/}

Зробіть так, щоб клацання картинки *вилучало* клас CSS `background--active` із зовнішнього `<div>`, але *додавало* клас `picture--active` до `<img>`. Повторне клацання фону повинно відновлювати вихідні класи CSS.

Візуально слід очікувати, що клацання картинки вилучить фіолетовий фон і виділить межі картинки. Клацання поза картинкою виділяє фон, але вилучає виділення меж картинки.

<Sandpack>

```js
export default function Picture() {
  return (
    <div className="background background--active">
      <img
        className="picture"
        alt="Веселкові будинки в Кампунг Пелангі, Індонезія"
        src="https://i.imgur.com/5qwVYb1.jpeg"
      />
    </div>
  );
}
```

```css
body { margin: 0; padding: 0; height: 250px; }

.background {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #eee;
}

.background--active {
  background: #a6b5ff;
}

.picture {
  width: 200px;
  height: 200px;
  border-radius: 10px;
  border: 5px solid transparent;
}

.picture--active {
  border: 5px solid #a6b5ff;
}
```

</Sandpack>

<Solution>

Цей компонент має два візуальні стани: коли активне зображення і коли воно неактивне:

* Коли зображення активне, класи CSS — `background` і `picture picture--active`.
* Коли зображення неактивне, класи CSS — `background background--active` і `picture`.

Однієї-єдиної булевої змінної достатньо, щоб пам'ятати, чи є зображення активним. Початковим завданням було вилучити або додати класи CSS. Проте в React необхідно *описати*, що ви хочете побачити, а не *маніпулювати* елементами UI. Тож вам доведеться обчислити обидва класи CSS на основі поточного стану. Також знадобиться [зупинити поширення події](/learn/responding-to-events#stopping-propagation), щоб клацання зображення не реєструвалося як клацання фону.

Перевірте, що ця версія працює, клацнувши зображення, а тоді поза ним:

<Sandpack>

```js
import { useState } from 'react';

export default function Picture() {
  const [isActive, setIsActive] = useState(false);

  let backgroundClassName = 'background';
  let pictureClassName = 'picture';
  if (isActive) {
    pictureClassName += ' picture--active';
  } else {
    backgroundClassName += ' background--active';
  }

  return (
    <div
      className={backgroundClassName}
      onClick={() => setIsActive(false)}
    >
      <img
        onClick={e => {
          e.stopPropagation();
          setIsActive(true);
        }}
        className={pictureClassName}
        alt="Веселкові будинки в Кампунг Пелангі, Індонезія"
        src="https://i.imgur.com/5qwVYb1.jpeg"
      />
    </div>
  );
}
```

```css
body { margin: 0; padding: 0; height: 250px; }

.background {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #eee;
}

.background--active {
  background: #a6b5ff;
}

.picture {
  width: 200px;
  height: 200px;
  border-radius: 10px;
  border: 5px solid transparent;
}

.picture--active {
  border: 5px solid #a6b5ff;
}
```

</Sandpack>

Інший варіант — можна повернути два окремі шматки JSX:

<Sandpack>

```js
import { useState } from 'react';

export default function Picture() {
  const [isActive, setIsActive] = useState(false);
  if (isActive) {
    return (
      <div
        className="background"
        onClick={() => setIsActive(false)}
      >
        <img
          className="picture picture--active"
          alt="Веселкові будинки в Кампунг Пелангі, Індонезія"
          src="https://i.imgur.com/5qwVYb1.jpeg"
          onClick={e => e.stopPropagation()}
        />
      </div>
    );
  }
  return (
    <div className="background background--active">
      <img
        className="picture"
        alt="Веселкові будинки в Кампунг Пелангі, Індонезія"
        src="https://i.imgur.com/5qwVYb1.jpeg"
        onClick={() => setIsActive(true)}
      />
    </div>
  );
}
```

```css
body { margin: 0; padding: 0; height: 250px; }

.background {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #eee;
}

.background--active {
  background: #a6b5ff;
}

.picture {
  width: 200px;
  height: 200px;
  border-radius: 10px;
  border: 5px solid transparent;
}

.picture--active {
  border: 5px solid #a6b5ff;
}
```

</Sandpack>

Пам'ятайте, що якщо два різні шматки JSX описують одне й те ж дерево, то їхня вкладеність (перший `<div>` → перший `<img>`) повинна бути однаковою. Інакше перемикання `isActive` перестворить ціле дерево нижче і [скине його стан.](/learn/preserving-and-resetting-state) Саме тому якщо в обох випадках повертається подібне дерево JSX, то ці випадки краще реалізувати як один шматок JSX.

</Solution>

#### Редактор профілю {/*profile-editor*/}

Це невеличка форма, реалізована за допомогою простого JavaScript і DOM. Пограйтеся з нею, щоб зрозуміти її логіку:

<Sandpack>

```js src/index.js active
function handleFormSubmit(e) {
  e.preventDefault();
  if (editButton.textContent === 'Редагувати профіль') {
    editButton.textContent = 'Зберегти профіль';
    hide(firstNameText);
    hide(lastNameText);
    show(firstNameInput);
    show(lastNameInput);
  } else {
    editButton.textContent = 'Редагувати профіль';
    hide(firstNameInput);
    hide(lastNameInput);
    show(firstNameText);
    show(lastNameText);
  }
}

function handleFirstNameChange() {
  firstNameText.textContent = firstNameInput.value;
  helloText.textContent = (
    'Привіт, ' +
    firstNameInput.value + ' ' +
    lastNameInput.value + '!'
  );
}

function handleLastNameChange() {
  lastNameText.textContent = lastNameInput.value;
  helloText.textContent = (
    'Привіт, ' +
    firstNameInput.value + ' ' +
    lastNameInput.value + '!'
  );
}

function hide(el) {
  el.style.display = 'none';
}

function show(el) {
  el.style.display = '';
}

let form = document.getElementById('form');
let editButton = document.getElementById('editButton');
let firstNameInput = document.getElementById('firstNameInput');
let firstNameText = document.getElementById('firstNameText');
let lastNameInput = document.getElementById('lastNameInput');
let lastNameText = document.getElementById('lastNameText');
let helloText = document.getElementById('helloText');
form.onsubmit = handleFormSubmit;
firstNameInput.oninput = handleFirstNameChange;
lastNameInput.oninput = handleLastNameChange;
```

```js sandbox.config.json hidden
{
  "hardReloadOnChange": true
}
```

```html public/index.html
<form id="form">
  <label>
    Ім'я:
    <b id="firstNameText">Яна</b>
    <input
      id="firstNameInput"
      value="Яна"
      style="display: none">
  </label>
  <label>
    Прізвище:
    <b id="lastNameText">Яківчук</b>
    <input
      id="lastNameInput"
      value="Яківчук"
      style="display: none">
  </label>
  <button type="submit" id="editButton">Редагувати профіль</button>
  <p><i id="helloText">Привіт, Яна Яківчук!</i></p>
</form>

<style>
* { box-sizing: border-box; }
body { font-family: sans-serif; margin: 20px; padding: 0; }
label { display: block; margin-bottom: 20px; }
</style>
```

</Sandpack>

Ця форма перемикається між двома режимами: в режимі редагування видно поля, а в режимі перегляду — лише результат. Підпис кнопки змінюється з "Редагувати" на "Зберегти" й навпаки, залежно від поточного режиму. Коли змінити щось у полях, то привітальне повідомлення внизу оновлюється в реальному часі.

Ваше завдання — реалізувати цю форму в React у пісочниці нижче. Для вашої зручності розмітка вже перетворена на JSX, але вам доведеться змусити її показувати та приховувати поля, як у реалізації вище.

Перевірте, що вона також оновлює текст унизу!

<Sandpack>

```js
export default function EditProfile() {
  return (
    <form>
      <label>
        Ім'я:{' '}
        <b>Яна</b>
        <input />
      </label>
      <label>
        Прізвище:{' '}
        <b>Яківчук</b>
        <input />
      </label>
      <button type="submit">
        Редагувати профіль
      </button>
      <p><i>Привіт, Яна Яківчук!</i></p>
    </form>
  );
}
```

```css
label { display: block; margin-bottom: 20px; }
```

</Sandpack>

<Solution>

Вам знадобляться дві змінні стану для збереження значень полів: `firstName` і `lastName`. Також потрібна змінна стану `isEditing`, щоб зберігати те, чи виводити поля. Вам _не_ потрібна змінна `fullName`, тому що повне ім'я може завжди обчислюватися на основі `firstName` і `lastName`.

Врешті-решт, слід скористатися [умовним рендерингом](/learn/conditional-rendering), щоб показувати та приховувати поля залежно від `isEditing`.

<Sandpack>

```js
import { useState } from 'react';

export default function EditProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState('Яна');
  const [lastName, setLastName] = useState('Яківчук');

  return (
    <form onSubmit={e => {
      e.preventDefault();
      setIsEditing(!isEditing);
    }}>
      <label>
        Ім'я:{' '}
        {isEditing ? (
          <input
            value={firstName}
            onChange={e => {
              setFirstName(e.target.value)
            }}
          />
        ) : (
          <b>{firstName}</b>
        )}
      </label>
      <label>
        Прізвище:{' '}
        {isEditing ? (
          <input
            value={lastName}
            onChange={e => {
              setLastName(e.target.value)
            }}
          />
        ) : (
          <b>{lastName}</b>
        )}
      </label>
      <button type="submit">
        {isEditing ? 'Зберегти' : 'Редагувати'} профіль
      </button>
      <p><i>Привіт, {firstName} {lastName}!</i></p>
    </form>
  );
}
```

```css
label { display: block; margin-bottom: 20px; }
```

</Sandpack>

Порівняйте це рішення з початковим імперативним кодом. Як вони відрізняються?

</Solution>

#### Рефакторинг імперативного рішення без React {/*refactor-the-imperative-solution-without-react*/}

Ось вихідна пісочниця з попереднього завдання, написана в імперативному стилі, без React:

<Sandpack>

```js src/index.js active
function handleFormSubmit(e) {
  e.preventDefault();
  if (editButton.textContent === 'Редагувати профіль') {
    editButton.textContent = 'Зберегти профіль';
    hide(firstNameText);
    hide(lastNameText);
    show(firstNameInput);
    show(lastNameInput);
  } else {
    editButton.textContent = 'Редагувати профіль';
    hide(firstNameInput);
    hide(lastNameInput);
    show(firstNameText);
    show(lastNameText);
  }
}

function handleFirstNameChange() {
  firstNameText.textContent = firstNameInput.value;
  helloText.textContent = (
    'Привіт, ' +
    firstNameInput.value + ' ' +
    lastNameInput.value + '!'
  );
}

function handleLastNameChange() {
  lastNameText.textContent = lastNameInput.value;
  helloText.textContent = (
    'Привіт, ' +
    firstNameInput.value + ' ' +
    lastNameInput.value + '!'
  );
}

function hide(el) {
  el.style.display = 'none';
}

function show(el) {
  el.style.display = '';
}

let form = document.getElementById('form');
let editButton = document.getElementById('editButton');
let firstNameInput = document.getElementById('firstNameInput');
let firstNameText = document.getElementById('firstNameText');
let lastNameInput = document.getElementById('lastNameInput');
let lastNameText = document.getElementById('lastNameText');
let helloText = document.getElementById('helloText');
form.onsubmit = handleFormSubmit;
firstNameInput.oninput = handleFirstNameChange;
lastNameInput.oninput = handleLastNameChange;
```

```js sandbox.config.json hidden
{
  "hardReloadOnChange": true
}
```

```html public/index.html
<form id="form">
  <label>
    Ім'я:
    <b id="firstNameText">Яна</b>
    <input
      id="firstNameInput"
      value="Яна"
      style="display: none">
  </label>
  <label>
    Прізвище:
    <b id="lastNameText">Яківчук</b>
    <input
      id="lastNameInput"
      value="Яківчук"
      style="display: none">
  </label>
  <button type="submit" id="editButton">Редагувати профіль</button>
  <p><i id="helloText">Привіт, Яна Яківчук!</i></p>
</form>

<style>
* { box-sizing: border-box; }
body { font-family: sans-serif; margin: 20px; padding: 0; }
label { display: block; margin-bottom: 20px; }
</style>
```

</Sandpack>

Уявіть, що React не існує. Чи можна відрефакторити цей код у такий спосіб, що зробить логіку надійнішою та більш подібною на варіант із React? На що це було б схоже, якби стан був явним, неначе в React?

Якщо вам важко зрозуміти, з чого почати, то заготовка нижче містить більшість структури. Якщо починаєте з неї, то додайте логіку, якої не вистачає, у функції `updateDOM`. (Звіряйтеся з вихідним кодом, коли знадобиться.)

<Sandpack>

```js src/index.js active
let firstName = 'Яна';
let lastName = 'Яківчук';
let isEditing = false;

function handleFormSubmit(e) {
  e.preventDefault();
  setIsEditing(!isEditing);
}

function handleFirstNameChange(e) {
  setFirstName(e.target.value);
}

function handleLastNameChange(e) {
  setLastName(e.target.value);
}

function setFirstName(value) {
  firstName = value;
  updateDOM();
}

function setLastName(value) {
  lastName = value;
  updateDOM();
}

function setIsEditing(value) {
  isEditing = value;
  updateDOM();
}

function updateDOM() {
  if (isEditing) {
    editButton.textContent = 'Зберегти профіль';
    // TODO: показати поля, приховати вміст
  } else {
    editButton.textContent = 'Редагувати профіль';
    // TODO: приховати поля, показати вміст
  }
  // TODO: оновити текстові підписи
}

function hide(el) {
  el.style.display = 'none';
}

function show(el) {
  el.style.display = '';
}

let form = document.getElementById('form');
let editButton = document.getElementById('editButton');
let firstNameInput = document.getElementById('firstNameInput');
let firstNameText = document.getElementById('firstNameText');
let lastNameInput = document.getElementById('lastNameInput');
let lastNameText = document.getElementById('lastNameText');
let helloText = document.getElementById('helloText');
form.onsubmit = handleFormSubmit;
firstNameInput.oninput = handleFirstNameChange;
lastNameInput.oninput = handleLastNameChange;
```

```js sandbox.config.json hidden
{
  "hardReloadOnChange": true
}
```

```html public/index.html
<form id="form">
  <label>
    Ім'я:
    <b id="firstNameText">Яна</b>
    <input
      id="firstNameInput"
      value="Яна"
      style="display: none">
  </label>
  <label>
    Прізвище:
    <b id="lastNameText">Яківчук</b>
    <input
      id="lastNameInput"
      value="Яківчук"
      style="display: none">
  </label>
  <button type="submit" id="editButton">Редагувати профіль</button>
  <p><i id="helloText">Привіт, Яна Яківчук!</i></p>
</form>

<style>
* { box-sizing: border-box; }
body { font-family: sans-serif; margin: 20px; padding: 0; }
label { display: block; margin-bottom: 20px; }
</style>
```

</Sandpack>

<Solution>

Логіка, якої не вистачає, — перемикання виведення полів і вмісту, а також оновлення підписів:

<Sandpack>

```js src/index.js active
let firstName = 'Яна';
let lastName = 'Яківчук';
let isEditing = false;

function handleFormSubmit(e) {
  e.preventDefault();
  setIsEditing(!isEditing);
}

function handleFirstNameChange(e) {
  setFirstName(e.target.value);
}

function handleLastNameChange(e) {
  setLastName(e.target.value);
}

function setFirstName(value) {
  firstName = value;
  updateDOM();
}

function setLastName(value) {
  lastName = value;
  updateDOM();
}

function setIsEditing(value) {
  isEditing = value;
  updateDOM();
}

function updateDOM() {
  if (isEditing) {
    editButton.textContent = 'Зберегти профіль';
    hide(firstNameText);
    hide(lastNameText);
    show(firstNameInput);
    show(lastNameInput);
  } else {
    editButton.textContent = 'Редагувати профіль';
    hide(firstNameInput);
    hide(lastNameInput);
    show(firstNameText);
    show(lastNameText);
  }
  firstNameText.textContent = firstName;
  lastNameText.textContent = lastName;
  helloText.textContent = (
    'Привіт, ' +
    firstName + ' ' +
    lastName + '!'
  );
}

function hide(el) {
  el.style.display = 'none';
}

function show(el) {
  el.style.display = '';
}

let form = document.getElementById('form');
let editButton = document.getElementById('editButton');
let firstNameInput = document.getElementById('firstNameInput');
let firstNameText = document.getElementById('firstNameText');
let lastNameInput = document.getElementById('lastNameInput');
let lastNameText = document.getElementById('lastNameText');
let helloText = document.getElementById('helloText');
form.onsubmit = handleFormSubmit;
firstNameInput.oninput = handleFirstNameChange;
lastNameInput.oninput = handleLastNameChange;
```

```js sandbox.config.json hidden
{
  "hardReloadOnChange": true
}
```

```html public/index.html
<form id="form">
  <label>
    Ім'я:
    <b id="firstNameText">Яна</b>
    <input
      id="firstNameInput"
      value="Яна"
      style="display: none">
  </label>
  <label>
    Прізвище:
    <b id="lastNameText">Яківчук</b>
    <input
      id="lastNameInput"
      value="Яківчук"
      style="display: none">
  </label>
  <button type="submit" id="editButton">Редагувати профіль</button>
  <p><i id="helloText">Привіт, Яна Яківчук!</i></p>
</form>

<style>
* { box-sizing: border-box; }
body { font-family: sans-serif; margin: 20px; padding: 0; }
label { display: block; margin-bottom: 20px; }
</style>
```

</Sandpack>

Написана вами функція `updateDOM` демонструє те, що React робить за лаштунками, коли ви задаєте значення стану. (Проте React також уникає втручань у DOM щодо властивостей, які не змінилися після останнього разу, коли їх було задано.)

</Solution>

</Challenges>
