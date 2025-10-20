---
title: Збереження та скидання стану
---

<Intro>

Стан ізольований між компонентами. React відстежує, який стан належить якому компоненту, виходячи з їх місця в дереві інтерфейсу користувача. Ви можете керувати тим, коли зберігати стан, а коли скидати його між рендерами.

</Intro>

<YouWillLearn>

* Коли React зберігає або скидає стан
* Як примусити React скинути стан компоненти
* Як ключі та типи впливають на збереження стану 

</YouWillLearn>

## Стан прив'язаний до позиції у дереві рендерингу {/*state-is-tied-to-a-position-in-the-tree*/}

React будує [дерева рендерингу](learn/understanding-your-ui-as-a-tree#the-render-tree) для структури компонентів у вашому інтерфейсі.

Коли ви надаєте компоненту стан, ви можете подумати, що стан "живе" всередині компонента. Але насправді стан зберігається всередині React. React пов'язує кожен фрагмент стану, який він утримує, з відповідним компонентом, по тому де цей компонент знаходиться в дереві рендерингу.

В даному прикладі використовується тільки один JSX тег `<Counter />`, але він рендериться в двох різних позиціях.

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  const counter = <Counter />;
  return (
    <div>
      {counter}
      {counter}
    </div>
  );
}

function Counter() {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Додати один
      </button>
    </div>
  );
}
```

```css
label {
  display: block;
  clear: both;
}

.counter {
  width: 150px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

Ось як вони відображаються у вигляді дерева:

<DiagramGroup>

<Diagram name="preserving_state_tree" height={248} width={395} alt="Діаграма дерева React-компонентів. Кореневий вузол позначений як 'div' та має двоє дочірніх компонентів. Кожний дочірній компонент названий 'Counter' і обидва містять бульбашку стану з назвою 'count' із значенням 0.">

Дерево React

</Diagram>

</DiagramGroup>

**Це два окремі лічильника, оскільки кожен із них рендериться на своїй позиції в дереві.**  Зазвичай вам не потрібно думати про ці позиції щоб використовувати React, але розуміння того, як це працює, може бути корисним.

В React, кожен компонент на екрані має повністю ізольований стан. Для прикладу, якщо ви рендерите два компоненти `Counter` поруч, кожен з них отримає свої власні, незалежні стани `score` та `hover`.

Спробуйте натиснути на обидва лічильника і ви помітите, що вони не впливають один на одного:

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  return (
    <div>
      <Counter />
      <Counter />
    </div>
  );
}

function Counter() {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Додати один
      </button>
    </div>
  );
}
```

```css
.counter {
  width: 150px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

Як ви можете бачити, коли один лічильник оновлюється, тільки стан тієї компоненти оновлюється: 


<DiagramGroup>

<Diagram name="preserving_state_increment" height={248} width={441} alt="Діаграма дерева React-компонентів. Кореневий вузол позначений як 'div' та має двоє дочірніх компонентів. Лівий нащадок має назву 'Counter' та містить бульбашку стану з назвою 'count' із значенням 0. Правий нащадок називається 'Counter' та містить бульбашку стану з назвою 'count' із значенням 1. Бульбашка стану правого нащадка підсвічена жовтим, щоб показати, що його значення було оновлено.">

Оновлення стану

</Diagram>

</DiagramGroup>


React зберігатиме цей стан доти, доки ви рендерите той самий компонент у тій самій позиції в дереві. Щоб побачити це, збільште обидва лічильника, потім видаліть другий компонент, знявши галочку "Рендерити другий лічильник", а потім додайте його назад, поставивши галочку знову:

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  const [showB, setShowB] = useState(true);
  return (
    <div>
      <Counter />
      {showB && <Counter />} 
      <label>
        <input
          type="checkbox"
          checked={showB}
          onChange={e => {
            setShowB(e.target.checked)
          }}
        />
        Рендерити другий лічильник
      </label>
    </div>
  );
}

function Counter() {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Додати один
      </button>
    </div>
  );
}
```

```css
label {
  display: block;
  clear: both;
}

.counter {
  width: 150px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

Зверніть увагу, що як тільки ви зупиняєте рендеринг другого лічильника, його стан повністю зникає. Це тому, що коли React видаляє компонент, він знищує його стан.

<DiagramGroup>

<Diagram name="preserving_state_remove_component" height={253} width={422} alt="Діаграма дерева React-компонентів. Кореневий вузол позначений як 'div' та має двоє дочірніх компонентів. Лівий нащадок має назву 'Counter' та містить бульбашку стану з назвою 'count' із значенням 0. Правий нащадок відсутній, проте на його місці знаходиться жовта піктограма 'пуф', яка виділяє компонент, що видалився із дерева.">

Видалення компонента

</Diagram>

</DiagramGroup>

Коли ви вибираєте "Рендерити другий лічильник", другий `Counter` і його стан ініціалізуються з нуля (`рахунок = 0`) і додаються до DOM.

<DiagramGroup>

<Diagram name="preserving_state_add_component" height={258} width={500} alt="Діаграма дерева React-компонентів. Кореневий вузол позначений як 'div' та має двоє дочірніх компонентів. Лівий нащадок має назву 'Counter' та містить бульбашку стану з назвою 'count' із значенням 0. Правий нащадок має назву 'Counter' та містить бульбашку стану з назвою 'count' із значенням 0. Весь правий дочірній вузол виділено жовтим, що вказує на те, що він був добавлений до дерева.">

Додавання компонента

</Diagram>

</DiagramGroup>

**React зберігає стан компоненти до тих пір, поки компонент рендериться на своєму місці в дереві інтерфейсу користувача.** Якщо його буде видалено, або на тому ж місці буде відрендерено інший компонент, React очистить його стейт.

## Той самий компонент у тій самій позиції зберігає стан {/*same-component-at-the-same-position-preserves-state*/}

У цьому прикладі є два різних `<Counter />` теги:

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  const [isFancy, setIsFancy] = useState(false);
  return (
    <div>
      {isFancy ? (
        <Counter isFancy={true} /> 
      ) : (
        <Counter isFancy={false} /> 
      )}
      <label>
        <input
          type="checkbox"
          checked={isFancy}
          onChange={e => {
            setIsFancy(e.target.checked)
          }}
        />
        Використати вишукану стилізацію
      </label>
    </div>
  );
}

function Counter({ isFancy }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }
  if (isFancy) {
    className += ' fancy';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Додати один
      </button>
    </div>
  );
}
```

```css
label {
  display: block;
  clear: both;
}

.counter {
  width: 150px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.fancy {
  border: 5px solid gold;
  color: #ff6767;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

Коли ви встановлюєте або знімаєте прапорець, стан лічильника не обнуляється. Не залежно від того, чи `isFancy` є `true` або `false`, у вас завжди є `<Counter />` як перший дочірній елемент `div`, що повертається з кореневого компонента `App`.

<DiagramGroup>

<Diagram name="preserving_state_same_component" height={461} width={600} alt="Діаграма з двома секціями, розділеними стрілкою, що переходить між ними. Кожна секція містить макет компонентів з батьківським компонентом, позначеним як 'App', що містить бульбашку стану, позначену як isFancy. Цей компонент має одного дочірнього елемента з назвою 'div', що створює бульбашку пропсів, яка містить isFancy (виділено фіолетовим кольором), що передається єдиному дочірньому елементу. Останній нащадок, що має назву 'Counter' і містить бульбашку станку з назвою 'count' та значенням 3 на обох діаграмах. У лівій частині діаграми нічого не виділено, а значення батьківського isFancy дорівнює false. У правій частині діаграми, значення батьківського стану isFancy змінилося на true і він виділений жовтим, так само як і бульбашка пропсів нижче, яка також змінила своє значення isFancy на true.">

Оновлення стану `App` не обнуляє `Counter`, оскільки `Counter` залишається на тій самій позиції

</Diagram>

</DiagramGroup>


Це той самий компонент на тій самій позиції, отже з точки зору React, це той самий лічильник.

<Pitfall>

Пам'ятайте, що **це позиція в дереві інтерфейсу користувача — не в JSX-розмітці — для React це важливо!** Цей компонент має два `return` пункти з різними `<Counter />` JSX-тегами в середині та зовні `if`:

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  const [isFancy, setIsFancy] = useState(false);
  if (isFancy) {
    return (
      <div>
        <Counter isFancy={true} />
        <label>
          <input
            type="checkbox"
            checked={isFancy}
            onChange={e => {
              setIsFancy(e.target.checked)
            }}
          />
          Використати вишукану стилізацію
        </label>
      </div>
    );
  }
  return (
    <div>
      <Counter isFancy={false} />
      <label>
        <input
          type="checkbox"
          checked={isFancy}
          onChange={e => {
            setIsFancy(e.target.checked)
          }}
        />
        Використати вишукану стилізацію
      </label>
    </div>
  );
}

function Counter({ isFancy }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }
  if (isFancy) {
    className += ' fancy';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Додати один
      </button>
    </div>
  );
}
```

```css
label {
  display: block;
  clear: both;
}

.counter {
  width: 150px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.fancy {
  border: 5px solid gold;
  color: #ff6767;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

Ви можете очікувати, що стан буде обнулено, коли ви поставите галочку, але цього не станеться! Це тому, що **обидва теги `<Counter />` рендеряться на тій самій позиції.** React не знає, де ви розміщуєте умови у вашій функції. Все, що він "бачить" — це дерево, що ви повертаєте.

В обох випадках, `App` компонент повертає `<div>` із `<Counter />` як першим дочірнім елементом. Для React ці два лічильника мають однакову "адресу": перший нащадок першого нащадка кореня. Ось як React зіставляє їх між попереднім і наступним рендерингом, незалежно від того, як ви структуруєте свою логіку.

</Pitfall>

## Різні компоненти на тій самій позиції скидають стан {/*different-components-at-the-same-position-reset-state*/}

В цьому прикладі встановлення прапорця замінить `<Counter>` на `<p>`:

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  const [isPaused, setIsPaused] = useState(false);
  return (
    <div>
      {isPaused ? (
        <p>Побачимось!</p> 
      ) : (
        <Counter /> 
      )}
      <label>
        <input
          type="checkbox"
          checked={isPaused}
          onChange={e => {
            setIsPaused(e.target.checked)
          }}
        />
        Зробіть перерву
      </label>
    </div>
  );
}

function Counter() {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Додати один
      </button>
    </div>
  );
}
```

```css
label {
  display: block;
  clear: both;
}

.counter {
  width: 150px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

Тут, ви переключаєте між _різними_ типами компонент на одній позиції. Початково перший дочірній елемент `<div>` містив `Counter`. Але коли ви замінили його на `p`, React видалив `Counter` з дерева інтерфейсу та знищив його стан.

<DiagramGroup>

<Diagram name="preserving_state_diff_pt1" height={290} width={753} alt="Діаграма з трьома секціями, розділеними стрілкою, що переходить між ними. Перша секція містить React компонент названий 'div' з єдиним дочірнім елементом названим 'Counter', що містить бульбашковий стан названий 'count' із значенням 3. Центральна секція має той самий батьківський 'div' але дочірній компонент тепер видалено, на що вказує жовте зображення 'poof'. Третя секція має знову той самий батьківський 'div', тепер із новим дочірнім елементом названим 'p', який виділено жовтим.">

Коли `Counter` змінюється на `p`, то `Counter` видалено та `p` добавлено

</Diagram>

</DiagramGroup>

<DiagramGroup>

<Diagram name="preserving_state_diff_pt2" height={290} width={753} alt="Діаграма з трьома секціями, розділеними стрілкою, що переходить між ними. Перша секція містить React компонент названий 'p'. Центральна секція має той самий батьківський 'div' але дочірній компонент тепер видалено, на що вказує жовте зображення 'poof'. Третя секція має знову той самий батьківський 'div', тепер із новим дочірнім елементом названим 'Counter', що містить бульбашковий стан названий 'count' із значенням 0, що підсвічено жовтим.">

Коли перемикаємо назад, `p` видалено та `Counter` додано

</Diagram>

</DiagramGroup>

Крім того, **коли ви рендерите інший компонент у тому самому місці, це скидає стан усього його піддерева.** Щоб побачити, як це працює, збільште лічильник і потім встановіть прапорець:

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  const [isFancy, setIsFancy] = useState(false);
  return (
    <div>
      {isFancy ? (
        <div>
          <Counter isFancy={true} /> 
        </div>
      ) : (
        <section>
          <Counter isFancy={false} />
        </section>
      )}
      <label>
        <input
          type="checkbox"
          checked={isFancy}
          onChange={e => {
            setIsFancy(e.target.checked)
          }}
        />
        Використовувати вишукану стилізацію
      </label>
    </div>
  );
}

function Counter({ isFancy }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }
  if (isFancy) {
    className += ' fancy';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Додати один
      </button>
    </div>
  );
}
```

```css
label {
  display: block;
  clear: both;
}

.counter {
  width: 150px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.fancy {
  border: 5px solid gold;
  color: #ff6767;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

Стан лічильника скидається коли ви натискаєте на прапорець. Хоча ви рендерите `Counter`, перший дочірній елемент `div` змінюється з `div` на `section`. Коли дочірній елемент `div` було видалено з DOM, все дерево під ним (включаючи `Counter` та його стан) було також знищено.

<DiagramGroup>

<Diagram name="preserving_state_diff_same_pt1" height={350} width={794} alt="Діаграма з трьома секціями, розділеними стрілкою, що переходить між ними. Перша секція містить React компонент названий 'div' з єдиним дочірнім елементом названим 'section', який має єдиний дочірній елемент названий 'Counter', що містить бульбашковий стан названий 'count' із значенням 3. Центральна секція має той самий батьківський 'div' але дочірні компоненти тепер видалені, на що вказує жовте зображення 'poof'. Третя секція має знову той самий батьківський 'div', тепер із новим дочірнім елементом названим 'div', що підсвічено жовтим, також із новим дочірнім елементом названим 'Counter' що містить бульбашковий стан названий 'count' із значенням 0, все підсвічено жовтим.">

Коли `section` змінюється на `div`, тоді `section` видаляється і новий `div` додається

</Diagram>

</DiagramGroup>

<DiagramGroup>

<Diagram name="preserving_state_diff_same_pt2" height={350} width={794} alt="Діаграма з трьома секціями, розділеними стрілкою, що переходить між ними. Перша секція містить React компонент названий 'div' з єдиним дочірнім елементом названим 'div', який має єдиний дочірній елемент названий 'Counter', що містить бульбашковий стан названий 'count' із значенням 0. Центральна секція має той самий батьківський 'div' але дочірні компоненти тепер видалені, на що вказує жовте зображення 'poof'. Третя секція має знову той самий батьківський 'div', тепер із новим дочірнім елементом названим 'section', що підсвічено жовтим, також із новим дочірнім елементом названим 'Counter' що містить бульбашковий стан названий 'count' із значенням 0, все підсвічено жовтим.">

При перемиканні назад, `div` видаляється і нова `section` додається

</Diagram>

</DiagramGroup>

Як правила, **якщо ви хочете зберегти стан між повторними рендерами, структура вашого дерева повинна "збігатися"** від одного рендера до іншого. Якщо структура відрізняється, стан знищується, оскільки React знищує стан, коли видаляє компонент із дерева.

<Pitfall>

Ось чому вам не варто вкладати визначення функційних компонент.

Тут, `MyTextField` функційний компонент визначено *всередині* `MyComponent`:

<Sandpack>

```js
import { useState } from 'react';

export default function MyComponent() {
  const [counter, setCounter] = useState(0);

  function MyTextField() {
    const [text, setText] = useState('');

    return (
      <input
        value={text}
        onChange={e => setText(e.target.value)}
      />
    );
  }

  return (
    <>
      <MyTextField />
      <button onClick={() => {
        setCounter(counter + 1)
      }}>Клацнуто разів: {counter}</button>
    </>
  );
}
```

</Sandpack>


Кожного разу, коли ви натискаєте кнопку, стан введення зникає! Це відбувається тому, що *інша* `MyTextField` функція створюється на кожен рендер `MyComponent`. Ви рендерите *інший* компонент у тому самому місці, тому React скидає весь стан нижче. Це призводить до проблем та проблем із продуктивністю. Щоб уникнути цієї проблеми **завжди оголошуйте функційні компоненти на найвищому рівні і не вкладайте їхнє визначення.**

</Pitfall>

## Скидання стану в тому самому місці {/*resetting-state-at-the-same-position*/}

За замовчуванням, React зберігає стан компонента, поки він залишається на тому самому місці. Зазвичай, це саме те, що ви хочете, тому це має сенс як поведінка за замовчуванням. Але інколи вам може знадобитися скинути стан компонента. Розглянемо цей додаток, який дозволяє двом гравцям відстежувати свої результати під час кожного ходу:

<Sandpack>

```js
import { useState } from 'react';

export default function Scoreboard() {
  const [isPlayerA, setIsPlayerA] = useState(true);
  return (
    <div>
      {isPlayerA ? (
        <Counter person="Тейлора" />
      ) : (
        <Counter person="Сари" />
      )}
      <button onClick={() => {
        setIsPlayerA(!isPlayerA);
      }}>
        Наступний гравець!
      </button>
    </div>
  );
}

function Counter({ person }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>Рахунок {person}: {score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Додати один
      </button>
    </div>
  );
}
```

```css
h1 {
  font-size: 18px;
}

.counter {
  width: 150px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

Зараз, коли ви змінюєте гравця, рахунок зберігається. Обидва `Counter` з'являються на одній і тій самій позиції, тому React сприймає їх як *один і той самий* `Counter`, у якого просто змінився проп `person`.

Але концептуально в цьому застосунку вони повинні бути двома окремими лічильниками. Вони можуть відображатися на одному й тому ж місці в інтерфейсі користувача, але один з них є лічильником для Тейлора, а інший — лічильником для Сари.

Є два способи скинути стан при перемиканні між ними:

1. Рендерити компоненти на різних позиціях
2. Дати кожному компоненту явну ідентичність за допомогою `key`


### Спосіб 1: Рендерити компонент в різних місцях {/*option-1-rendering-a-component-in-different-positions*/}

Якщо ви хочете, щоб ці два `Counter`, були незалежними, вам потрібно рендерити їх в двох різних позиціях:

<Sandpack>

```js
import { useState } from 'react';

export default function Scoreboard() {
  const [isPlayerA, setIsPlayerA] = useState(true);
  return (
    <div>
      {isPlayerA &&
        <Counter person="Тайлера" />
      }
      {!isPlayerA &&
        <Counter person="Сари" />
      }
      <button onClick={() => {
        setIsPlayerA(!isPlayerA);
      }}>
        Наступний гравець!
      </button>
    </div>
  );
}

function Counter({ person }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>Рахунок {person}: {score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Додати один
      </button>
    </div>
  );
}
```

```css
h1 {
  font-size: 18px;
}

.counter {
  width: 150px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

* Спочатку `isPlayerA` дорівнює `true`. Тому перша позиція містить стан `Counter`, а друга — порожня.
* Коли ви натискаєте кнопку "Наступний гравець", перша позиція очищується, а друга тепер містить `Counter`.

<DiagramGroup>

<Diagram name="preserving_state_diff_position_p1" height={375} width={504} alt="Діаграма з деревом React компонент. Батько названий 'Scoreboard' із бульбашковим станом названим isPlayerA із значенням 'true'. Єдиний дочірній елемент, розташований ліворуч, названий Counter із бульбашковим станом названим 'count' із значенням 0. Вся ліва частина дочірніх елементів підсвічена жовтим, що вказує на те, що вона була додана.">

Початковий стан

</Diagram>

<Diagram name="preserving_state_diff_position_p2" height={375} width={504} alt="Діаграма з деревом React компонент. Батько названий 'Scoreboard' із бульбашковим станом названим isPlayerA із значенням 'false'. Бульбашковий стан підсвічено жовтим, що вказує, на його зміну. Лівий дочірній елемент змінено на жовте 'poof' зображення, що вказує на те, що воно було видалено, а праворуч появився новий дочірній елемент, що підсвічено жовтим, що вказує на те, що його було додано. Новий дочірній елемент названо 'Counter' та містить бульбашковий стан названий 'count' із значенням 0.">

Натискання "наступний"

</Diagram>

<Diagram name="preserving_state_diff_position_p3" height={375} width={504} alt="Діаграма з деревом React компонент. Батько названий 'Scoreboard' із бульбашковим станом названим isPlayerA із значенням 'true'. Бульбашковий стан підсвічено жовтим, що вказує, на його зміну. Ліворуч появився новий дочірній елемент, який підсвічено жовтим, що вказує на те, що його було додано. Новий дочірній елемент названий 'Counter' та містить бульбашковий стан названий 'count' із значенням 0. Правий дочірній елемента замінено на 'poof' зображення, що вказує на те, що його було видалено.">

Натискання "наступний" знову

</Diagram>

</DiagramGroup>

Стан кожного `Counter` знищується щоразу, коли його видаляють із DOM. Саме тому вони скидаються щоразу, коли ви натискаєте кнопку.

Це рішення зручне, коли у вас лише кілька незалежних компонент, які рендеряться на одному місці. У цьому прикладі їх лише два, тому не складно рендерити обидві окремо в JSX.

### Спосіб 2: Скидання стану за допомогою ключа {/*option-2-resetting-state-with-a-key*/}

Існує також інший, більш загальний спосіб скидання стану компонента.

Ви могли бачити `key` коли [рендерите списки.](/learn/rendering-lists#keeping-list-items-in-order-with-key) Ключі не тільки для списків! Ви можете використовувати ключі, щоб React розрізняв будь-які компоненти. За замовчуванням React використовує порядок в середині батьківського елемента ("перший лічильник", "другий лічильник"), щоб розрізняти компоненти. Але ключі дають можливість вам сказати до React, що це не просто *перший* лічильник або *другий* лічильник а конкретний лічильник — для прикладу, лічильник *Тайлера*. Таким чином, React буде знати лічильник *Тайлера* будь-коли він з'явиться в дереві!

В цьому прикладі, два `<Counter />` не поширюють стан, хоча вони появляються в одному місці в JSX:

<Sandpack>

```js
import { useState } from 'react';

export default function Scoreboard() {
  const [isPlayerA, setIsPlayerA] = useState(true);
  return (
    <div>
      {isPlayerA ? (
        <Counter key="Taylor" person="Тайлера" />
      ) : (
        <Counter key="Sarah" person="Сари" />
      )}
      <button onClick={() => {
        setIsPlayerA(!isPlayerA);
      }}>
        Наступний гравець!
      </button>
    </div>
  );
}

function Counter({ person }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>Рахунок {person}: {score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Додати один
      </button>
    </div>
  );
}
```

```css
h1 {
  font-size: 18px;
}

.counter {
  width: 150px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

Переключення між станом Тайлера і Сари не зберігає стан. Це тому що **ви дали їм різні `key`:**

```js
{isPlayerA ? (
  <Counter key="Taylor" person="Тайлер" />
) : (
  <Counter key="Sarah" person="Сара" />
)}
```

Вказуючи `key` ви кажете React використовувати `key` як частину місця розташування замість його власного порядку в середині батьківського елемента. Саме через це, навіть якщо ви рендерите їх в одному місці в JSX, React бачить їх як два різних лічильника, саме тому вони ніколи не поширюватимуть стан. Кожного разу коли лічильник появляється на екрані, його стан створюється. Кожен раз коли він видалений, його стан знищується. Переключення між ними скидає їхній стан знову і знову.

<Note>

Пам'ятайте, що ключі не є глобально унікальними. Вони лише визначають позицію *в середині батьківського елемента*.

</Note>

### Скидання форми за допомогою ключа {/*resetting-a-form-with-a-key*/}

Скидання стану за допомогою ключа є особливо корисне при роботі з формами.

В цьому чат-застосунку компонент `<Chat>` містить стан поля введення тексту:

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
  { id: 0, name: 'Тайлер', email: 'taylor@mail.com' },
  { id: 1, name: 'Аліса', email: 'alice@mail.com' },
  { id: 2, name: 'Боб', email: 'bob@mail.com' }
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
          <li key={contact.id}>
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
        placeholder={'Написати до: ' + contact.name}
        onChange={e => setText(e.target.value)}
      />
      <br />
      <button>Надіслати на {contact.email}</button>
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

Спробуйте ввести щось в поле введення і потім натиснути "Аліса" або "Боб" щоб вибрати іншого отримувача. Ви помітите, що стан поля введення збережено, тому що `<Chat>` рендериться в тому самому місці в дереві.

**В більшості застосунків це може бути бажана поведінка але не в чат-застосунку!** Ви не хочете дозволити користувачу надіслати повідомлення, яке вони вже написали до іншої особи через випадкове натискання. Щоб виправити це, додайте `key`:

```js
<Chat key={to.id} contact={to} />
```

Це гарантує, що коли ви виберете іншого отримувача, компонент `Chat` буде створено заново, разом із усім станом у дереві під ним. React також створить нові DOM-елементи замість повторного використання старих.

Тепер при перемиканні отримувача поле введення завжди очищується:

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
      <Chat key={to.id} contact={to} />
    </div>
  )
}

const contacts = [
  { id: 0, name: 'Тайлер', email: 'taylor@mail.com' },
  { id: 1, name: 'Аліса', email: 'alice@mail.com' },
  { id: 2, name: 'Боб', email: 'bob@mail.com' }
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
          <li key={contact.id}>
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
        placeholder={'Написати до ' + contact.name}
        onChange={e => setText(e.target.value)}
      />
      <br />
      <button>Надіслати до {contact.email}</button>
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

<DeepDive>

#### Збереження стану для видалених компонент {/*preserving-state-for-removed-components*/}

В справжньому чат-застосунку, ви можливо захочете відновити стан поля введення коли користувач знову вибирає попереднього отримувача. Є декілька способів, щоб зберегти стан "живим" для компоненти, що більше не є видимою:

- Ви можете рендерити _всі_ чати замість одного поточного але сховати всі інші за допомогою CSS. Чати не будуть видалені із дерева, тому їхній локальний стан буде збережено. Це рішення добре працює для простих інтерфейсів користувача. Але, воно може стати дуже повільним, якщо приховані дерева великі та містять багато DOM-вузлів.
- Ви можете [підняти стан вгору](/learn/sharing-state-between-components) і тримати очікуване повідомлення для кожного отримувача в батьківському компоненті. Цим методом, коли дочірній компонент буде видалено, це немає значення, тому що його батько зберігає важливу інформацію. Це найпоширеніше рішення.
- Ви також можете використовувати інший джерело разом із станом React. Для прикладу, ви можливо хочете, щоб чернетка із повідомленням була присутня навіть коли користувач випадково закрив сторінку. Щоб реалізувати це, вам потрібно щоб `Chat` компонент ініціалізував власний стан і читав його із [`локального сховища`](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage), та зберігав чернетку там.

Не залежно від того, яку стратегію ви оберете, чат _із Алісою_ концептуально відрізняється від чату _з Бобом_, тому є сенс надати `ключ` до `<Chat>` дерева на основі поточного отримувача.

</DeepDive>

<Recap>

- React Зберігає стан доти, доки той самий компонент відрендерений в тому самому місці.
- Стан не зберігається в JSX-тегах. Він пов'язаний з позицією дерева, де ви помістили цей JSX.
- Ви можете примусити піддерево скинути власний стан даючи йому інший ключ.
- Не вкладайте визначення компонентів, інакше ви випадково скинете стан.

</Recap>



<Challenges>

#### Виправити зникнення введеного тексту {/*fix-disappearing-input-text*/}

В цьому прикладі показано повідомлення коли ви натискаєте на кнопку. Однак, натискання кнопки також випадково очищає поле введення. Чому це трапляється? Виправте це, щоб під час натискання кнопки поле для введення не очищувалось.

<Sandpack>

```js src/App.js
import { useState } from 'react';

export default function App() {
  const [showHint, setShowHint] = useState(false);
  if (showHint) {
    return (
      <div>
        <p><i>Підказка: Яке ваше улюблене місто?</i></p>
        <Form />
        <button onClick={() => {
          setShowHint(false);
        }}>Сховати підказку</button>
      </div>
    );
  }
  return (
    <div>
      <Form />
      <button onClick={() => {
        setShowHint(true);
      }}>Показати підказку</button>
    </div>
  );
}

function Form() {
  const [text, setText] = useState('');
  return (
    <textarea
      value={text}
      onChange={e => setText(e.target.value)}
    />
  );
}
```

```css
textarea { display: block; margin: 10px 0; }
```

</Sandpack>

<Solution>

Проблема в тому, що `Form` рендериться в різних позиціях. У гілці `if` він є другим дочірнім елементом `<div>`, а у гілці `else` він є першим дочірнім елементом. Тому тип компонента на кожній позиції змінюється. Перша позиція змінюється між `p` та `Form`, коли друга позиція змінюється між `Form` та `button`. React скидає стан щоразу, коли тип компонента змінюється.

Найлегшим рішенням є об'єднання гілок, щоб `Form` завжди рендерився в одному і тому ж положені:

<Sandpack>

```js src/App.js
import { useState } from 'react';

export default function App() {
  const [showHint, setShowHint] = useState(false);
  return (
    <div>
      {showHint &&
        <p><i>Підказка: Яке ваше улюблене місто?</i></p>
      }
      <Form />
      {showHint ? (
        <button onClick={() => {
          setShowHint(false);
        }}>Сховати підказку</button>
      ) : (
        <button onClick={() => {
          setShowHint(true);
        }}>Показати підказку</button>
      )}
    </div>
  );
}

function Form() {
  const [text, setText] = useState('');
  return (
    <textarea
      value={text}
      onChange={e => setText(e.target.value)}
    />
  );
}
```

```css
textarea { display: block; margin: 10px 0; }
```

</Sandpack>


Технічно, ви також можете добавити `null` перед `<Form />` в гілці `else`, щоб відповідати структурі `if` гілки:

<Sandpack>

```js src/App.js
import { useState } from 'react';

export default function App() {
  const [showHint, setShowHint] = useState(false);
  if (showHint) {
    return (
      <div>
        <p><i>Підказка: Яке ваше улюблене місто?</i></p>
        <Form />
        <button onClick={() => {
          setShowHint(false);
        }}>Сховати підказку</button>
      </div>
    );
  }
  return (
    <div>
      {null}
      <Form />
      <button onClick={() => {
        setShowHint(true);
      }}>Показати підказку</button>
    </div>
  );
}

function Form() {
  const [text, setText] = useState('');
  return (
    <textarea
      value={text}
      onChange={e => setText(e.target.value)}
    />
  );
}
```

```css
textarea { display: block; margin: 10px 0; }
```

</Sandpack>

У цьому випадку, `Form` завжди є другим дочірнім елементом, отже вона залишається на тому самому місці та зберігає стан. Але даний підхід  є менш очевидним та представляє ризик, що хтось інший видалить цей `null`.

</Solution>

#### Поміняти два поля форми {/*swap-two-form-fields*/}

Ця форма дозволяє вам ввести ім'я та прізвище. Вона також має прапорець, який контролює яке поле буде відображатись першим. Коли ви виберете прапорець, поле "Прізвище" появиться перед полем "Ім'я".

Це майже працює але є помилка. Якщо ви заповните поле "Ім'я" та виберете прапорець, то текст залишиться в першому поллі для введення (котре тепер "Прізвище"). Виправте це, щоб той текст поля введення *також* переміщався коли змінюється порядок.

<Hint>

Схоже, що для цих полів введення, їхня позиція в батьківському елементі не є достатньою. Чи є якийсь спосіб повідомити React, як узгодити стан між повторними рендерингами?

</Hint>

<Sandpack>

```js src/App.js
import { useState } from 'react';

export default function App() {
  const [reverse, setReverse] = useState(false);
  let checkbox = (
    <label>
      <input
        type="checkbox"
        checked={reverse}
        onChange={e => setReverse(e.target.checked)}
      />
      Зворотний порядок
    </label>
  );
  if (reverse) {
    return (
      <>
        <Field label="Прізвище" /> 
        <Field label="Ім'я" />
        {checkbox}
      </>
    );
  } else {
    return (
      <>
        <Field label="Ім'я" /> 
        <Field label="Прізвище" />
        {checkbox}
      </>
    );    
  }
}

function Field({ label }) {
  const [text, setText] = useState('');
  return (
    <label>
      {label}:{' '}
      <input
        type="text"
        value={text}
        placeholder={label}
        onChange={e => setText(e.target.value)}
      />
    </label>
  );
}
```

```css
label { display: block; margin: 10px 0; }
```

</Sandpack>

<Solution>

Дайте `key` до обох `<Field>` компонентів в обох `if` та `else` гілках. Це повідомить React, як "зіставити" конкретний стан для кожного `<Field>` навіть коли їхній порядок в батьківському елементі змінюється:

<Sandpack>

```js src/App.js
import { useState } from 'react';

export default function App() {
  const [reverse, setReverse] = useState(false);
  let checkbox = (
    <label>
      <input
        type="checkbox"
        checked={reverse}
        onChange={e => setReverse(e.target.checked)}
      />
      Змінити порядок
    </label>
  );
  if (reverse) {
    return (
      <>
        <Field key="lastName" label="Прізвище" /> 
        <Field key="firstName" label="Ім'я" />
        {checkbox}
      </>
    );
  } else {
    return (
      <>
        <Field key="firstName" label="Ім'я" /> 
        <Field key="lastName" label="Прізвище" />
        {checkbox}
      </>
    );    
  }
}

function Field({ label }) {
  const [text, setText] = useState('');
  return (
    <label>
      {label}:{' '}
      <input
        type="text"
        value={text}
        placeholder={label}
        onChange={e => setText(e.target.value)}
      />
    </label>
  );
}
```

```css
label { display: block; margin: 10px 0; }
```

</Sandpack>

</Solution>

#### Скинути форми деталей {/*reset-a-detail-form*/}

Це список контактів, який можна редагувати. Ви можете редагувати дані вибраного контакту, а потім натиснути "Зберегти", щоб оновити їх, або "Скинути", щоб скасувати ваші зміни.

Коли ви вибираєте інший контакт (для прикладу, Аліса), Стан змінюється але форма продовжує показувати дані попереднього контакту. Виправте це так, щоб форма скидалася при зміні вибраного контакту.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ContactList from './ContactList.js';
import EditContact from './EditContact.js';

export default function ContactManager() {
  const [
    contacts,
    setContacts
  ] = useState(initialContacts);
  const [
    selectedId,
    setSelectedId
  ] = useState(0);
  const selectedContact = contacts.find(c =>
    c.id === selectedId
  );

  function handleSave(updatedData) {
    const nextContacts = contacts.map(c => {
      if (c.id === updatedData.id) {
        return updatedData;
      } else {
        return c;
      }
    });
    setContacts(nextContacts);
  }

  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={selectedId}
        onSelect={id => setSelectedId(id)}
      />
      <hr />
      <EditContact
        initialData={selectedContact}
        onSave={handleSave}
      />
    </div>
  )
}

const initialContacts = [
  { id: 0, name: 'Тайлер', email: 'taylor@mail.com' },
  { id: 1, name: 'Аліса', email: 'alice@mail.com' },
  { id: 2, name: 'Боб', email: 'bob@mail.com' }
];
```

```js src/ContactList.js
export default function ContactList({
  contacts,
  selectedId,
  onSelect
}) {
  return (
    <section>
      <ul>
        {contacts.map(contact =>
          <li key={contact.id}>
            <button onClick={() => {
              onSelect(contact.id);
            }}>
              {contact.id === selectedId ?
                <b>{contact.name}</b> :
                contact.name
              }
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js src/EditContact.js
import { useState } from 'react';

export default function EditContact({ initialData, onSave }) {
  const [name, setName] = useState(initialData.name);
  const [email, setEmail] = useState(initialData.email);
  return (
    <section>
      <label>
        Ім'я:{' '}
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </label>
      <label>
        Пошта:{' '}
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </label>
      <button onClick={() => {
        const updatedData = {
          id: initialData.id,
          name: name,
          email: email
        };
        onSave(updatedData);
      }}>
        Зберегти
      </button>
      <button onClick={() => {
        setName(initialData.name);
        setEmail(initialData.email);
      }}>
        Скинути
      </button>
    </section>
  );
}
```

```css
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li { display: inline-block; }
li button {
  padding: 10px;
}
label {
  display: block;
  margin: 10px 0;
}
button {
  margin-right: 10px;
  margin-bottom: 10px;
}
```

</Sandpack>

<Solution>

Дайте `key={selectedId}` до `EditContact` компонента. Таким чином, перемикання між різними контактами буде скидати форму:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ContactList from './ContactList.js';
import EditContact from './EditContact.js';

export default function ContactManager() {
  const [
    contacts,
    setContacts
  ] = useState(initialContacts);
  const [
    selectedId,
    setSelectedId
  ] = useState(0);
  const selectedContact = contacts.find(c =>
    c.id === selectedId
  );

  function handleSave(updatedData) {
    const nextContacts = contacts.map(c => {
      if (c.id === updatedData.id) {
        return updatedData;
      } else {
        return c;
      }
    });
    setContacts(nextContacts);
  }

  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={selectedId}
        onSelect={id => setSelectedId(id)}
      />
      <hr />
      <EditContact
        key={selectedId}
        initialData={selectedContact}
        onSave={handleSave}
      />
    </div>
  )
}

const initialContacts = [
  { id: 0, name: 'Тайлер', email: 'taylor@mail.com' },
  { id: 1, name: 'Аліса', email: 'alice@mail.com' },
  { id: 2, name: 'Боб', email: 'bob@mail.com' }
];
```

```js src/ContactList.js
export default function ContactList({
  contacts,
  selectedId,
  onSelect
}) {
  return (
    <section>
      <ul>
        {contacts.map(contact =>
          <li key={contact.id}>
            <button onClick={() => {
              onSelect(contact.id);
            }}>
              {contact.id === selectedId ?
                <b>{contact.name}</b> :
                contact.name
              }
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js src/EditContact.js
import { useState } from 'react';

export default function EditContact({ initialData, onSave }) {
  const [name, setName] = useState(initialData.name);
  const [email, setEmail] = useState(initialData.email);
  return (
    <section>
      <label>
        Ім'я:{' '}
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </label>
      <label>
        Пошта:{' '}
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </label>
      <button onClick={() => {
        const updatedData = {
          id: initialData.id,
          name: name,
          email: email
        };
        onSave(updatedData);
      }}>
        Зберегти
      </button>
      <button onClick={() => {
        setName(initialData.name);
        setEmail(initialData.email);
      }}>
        Скинути
      </button>
    </section>
  );
}
```

```css
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li { display: inline-block; }
li button {
  padding: 10px;
}
label {
  display: block;
  margin: 10px 0;
}
button {
  margin-right: 10px;
  margin-bottom: 10px;
}
```

</Sandpack>

</Solution>

#### Очистити зображення під час його завантаження {/*clear-an-image-while-its-loading*/}

Коли ви натискаєте "Далі", браузер починає завантажувати наступне зображення. Однак, тому що воно відображається в тому самому тегу `<img>`, то за замовчуванням ви будете бачити попереднє зображення до того моменту поки не завантажиться наступне. Це може бути небажаним, якщо важливо, щоб текст завжди відповідав зображенню. Змініть це так, щоб коли ви натискаєте "Далі", попереднє зображення моментально очищається    When you press "Next", the browser starts loading the next image. However, because it's displayed in the same `<img>` tag, by default you would still see the previous image until the next one loads. This may be undesirable if it's important for the text to always match the image. Change it so that the moment you press "Next", the previous image immediately clears.

<Hint>

Чи є спосіб сказати React перестворювати DOM замість того, щоб  його перевикористання?

</Hint>

<Sandpack>

```js
import { useState } from 'react';

export default function Gallery() {
  const [index, setIndex] = useState(0);
  const hasNext = index < images.length - 1;

  function handleClick() {
    if (hasNext) {
      setIndex(index + 1);
    } else {
      setIndex(0);
    }
  }

  let image = images[index];
  return (
    <>
      <button onClick={handleClick}>
        Наступне
      </button>
      <h3>
        Зображення {index + 1} із {images.length}
      </h3>
      <img src={image.src} />
      <p>
        {image.place}
      </p>
    </>
  );
}

let images = [{
  place: 'Penang, Malaysia',
  src: 'https://i.imgur.com/FJeJR8M.jpg'
}, {
  place: 'Lisbon, Portugal',
  src: 'https://i.imgur.com/dB2LRbj.jpg'
}, {
  place: 'Bilbao, Spain',
  src: 'https://i.imgur.com/z08o2TS.jpg'
}, {
  place: 'Valparaíso, Chile',
  src: 'https://i.imgur.com/Y3utgTi.jpg'
}, {
  place: 'Schwyz, Switzerland',
  src: 'https://i.imgur.com/JBbMpWY.jpg'
}, {
  place: 'Prague, Czechia',
  src: 'https://i.imgur.com/QwUKKmF.jpg'
}, {
  place: 'Ljubljana, Slovenia',
  src: 'https://i.imgur.com/3aIiwfm.jpg'
}];
```

```css
img { width: 150px; height: 150px; }
```

</Sandpack>

<Solution>

Ви можете надати `key` до `<img>` тегу. Коли цей `key` змінюється, React перестворює `<img>` DOM-вузол з нуля. Це спричиняє коротке миготіння під час завантаження кожного зображення, отже це може бути не те, що ви захочете робити для кожного зображення в вашому застосунку. Але це доцільно, якщо ви хочете переконатись, що зображення завжди відповідало тексту.

<Sandpack>

```js
import { useState } from 'react';

export default function Gallery() {
  const [index, setIndex] = useState(0);
  const hasNext = index < images.length - 1;

  function handleClick() {
    if (hasNext) {
      setIndex(index + 1);
    } else {
      setIndex(0);
    }
  }

  let image = images[index];
  return (
    <>
      <button onClick={handleClick}>
        Далі
      </button>
      <h3>
        Зображення {index + 1} of {images.length}
      </h3>
      <img key={image.src} src={image.src} />
      <p>
        {image.place}
      </p>
    </>
  );
}

let images = [{
  place: 'Penang, Malaysia',
  src: 'https://i.imgur.com/FJeJR8M.jpg'
}, {
  place: 'Lisbon, Portugal',
  src: 'https://i.imgur.com/dB2LRbj.jpg'
}, {
  place: 'Bilbao, Spain',
  src: 'https://i.imgur.com/z08o2TS.jpg'
}, {
  place: 'Valparaíso, Chile',
  src: 'https://i.imgur.com/Y3utgTi.jpg'
}, {
  place: 'Schwyz, Switzerland',
  src: 'https://i.imgur.com/JBbMpWY.jpg'
}, {
  place: 'Prague, Czechia',
  src: 'https://i.imgur.com/QwUKKmF.jpg'
}, {
  place: 'Ljubljana, Slovenia',
  src: 'https://i.imgur.com/3aIiwfm.jpg'
}];
```

```css
img { width: 150px; height: 150px; }
```

</Sandpack>

</Solution>

#### Виправити неправильне розміщення стану в списку {/*fix-misplaced-state-in-the-list*/}

В списку, кожний `Contact` має стан, що визначає чи "Показати пошту" буде натиснуте для цього. Натисніть "Показати пошту" для Аліси, І потім виберіть "Показати в зворотному порядку" прапорець. Ви помітите, що пошта _Тайлера_ розгорнута але пошта Аліси, яка була перенесена в низ, згорнута.

Виправте, це так, щоб розгорнутий стан відповідав кожному контакту, не зважаючи на вибраний порядок.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import Contact from './Contact.js';

export default function ContactList() {
  const [reverse, setReverse] = useState(false);

  const displayedContacts = [...contacts];
  if (reverse) {
    displayedContacts.reverse();
  }

  return (
    <>
      <label>
        <input
          type="checkbox"
          value={reverse}
          onChange={e => {
            setReverse(e.target.checked)
          }}
        />{' '}
        Показати у зворотному порядку
      </label>
      <ul>
        {displayedContacts.map((contact, i) =>
          <li key={i}>
            <Contact contact={contact} />
          </li>
        )}
      </ul>
    </>
  );
}

const contacts = [
  { id: 0, name: 'Аліса', email: 'alice@mail.com' },
  { id: 1, name: 'Bob', email: 'bob@mail.com' },
  { id: 2, name: 'Тайлер', email: 'taylor@mail.com' }
];
```

```js src/Contact.js
import { useState } from 'react';

export default function Contact({ contact }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <>
      <p><b>{contact.name}</b></p>
      {expanded &&
        <p><i>{contact.email}</i></p>
      }
      <button onClick={() => {
        setExpanded(!expanded);
      }}>
        {expanded ? 'Сховати' : 'Показати'} пошту
      </button>
    </>
  );
}
```

```css
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li {
  margin-bottom: 20px;
}
label {
  display: block;
  margin: 10px 0;
}
button {
  margin-right: 10px;
  margin-bottom: 10px;
}
```

</Sandpack>

<Solution>

Проблемою є те, що в цьому прикладі було використано індекс як `key`:

```js
{displayedContacts.map((contact, i) =>
  <li key={i}>
```

Однак ви хочете, щоб стан був пов'язаний із _кожним конкретним контактом_.

Використання ідентифікатора контакту як `key` вирішує цю проблему:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import Contact from './Contact.js';

export default function ContactList() {
  const [reverse, setReverse] = useState(false);

  const displayedContacts = [...contacts];
  if (reverse) {
    displayedContacts.reverse();
  }

  return (
    <>
      <label>
        <input
          type="checkbox"
          value={reverse}
          onChange={e => {
            setReverse(e.target.checked)
          }}
        />{' '}
        Показати в зворотному порядку
      </label>
      <ul>
        {displayedContacts.map(contact =>
          <li key={contact.id}>
            <Contact contact={contact} />
          </li>
        )}
      </ul>
    </>
  );
}

const contacts = [
  { id: 0, name: 'Аліса', email: 'alice@mail.com' },
  { id: 1, name: 'Боб', email: 'bob@mail.com' },
  { id: 2, name: 'Тайлер', email: 'taylor@mail.com' }
];
```

```js src/Contact.js
import { useState } from 'react';

export default function Contact({ contact }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <>
      <p><b>{contact.name}</b></p>
      {expanded &&
        <p><i>{contact.email}</i></p>
      }
      <button onClick={() => {
        setExpanded(!expanded);
      }}>
        {expanded ? 'Сховати' : 'Показати'} пошту
      </button>
    </>
  );
}
```

```css
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li {
  margin-bottom: 20px;
}
label {
  display: block;
  margin: 10px 0;
}
button {
  margin-right: 10px;
  margin-bottom: 10px;
}
```

</Sandpack>

Стан пов'язаний із позицією дерева. За допомогою `key` можна вказати позицію за назвою, а не покладатися на порядок.

</Solution>

</Challenges>
