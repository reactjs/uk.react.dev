---
id: hooks-faq
title: Хуки: FAQ
permalink: docs/hooks-faq.html
prev: hooks-reference.html
---

*Хуки* — це новинка в React 16.8. Вони дозволяють вам використовувати стан та інші можливості React без написання класу.

На цій сторінці ви знайдете відповіді на деякі поширені питання щодо [хуків](/docs/hooks-overview.html).

<!--
  якщо вам доведеться колись згенерувати це наново, наступний уривок коду введений у інструменти розробника може вам допомогти:

  $$('.anchor').map(a =>
    `${' '.repeat(2 * +a.parentNode.nodeName.slice(1))}` +
    `[${a.parentNode.textContent}](${a.getAttribute('href')})`
  ).join('\n')
-->

* **[Стратегія впровадження хуків](#adoption-strategy)**
  * [Які версії React включають хуки?](#which-versions-of-react-include-hooks)
  * [Чи маю я переписувати всі мої класові компоненти?](#do-i-need-to-rewrite-all-my-class-components)
  * [Що я можу зробити з хуками такого, чого не можу з класами?](#what-can-i-do-with-hooks-that-i-couldnt-with-classes)
  * [Яка частина моїх знань React залишиться актуальною?](#how-much-of-my-react-knowledge-stays-relevant)
  * [Що я маю використовувати: хуки, класи чи їх комбінацію?](#should-i-use-hooks-classes-or-a-mix-of-both)
  * [Чи покривають хуки всі варіанти використання класів?](#do-hooks-cover-all-use-cases-for-classes)
  * [Чи замінять хуки рендер пропси та компоненти вищого порядку?](#do-hooks-replace-render-props-and-higher-order-components)
  * [Що означають хуки для популярних API, таких як Redux connect() чи React Router?](#what-do-hooks-mean-for-popular-apis-like-redux-connect-and-react-router)
  * [Чи працюють хуки зі статичною типізацією?](#do-hooks-work-with-static-typing)
  * [Як тестувати компоненти, які використовують хуки?](#how-to-test-components-that-use-hooks)
  * [Що саме перевіряють правила лінтера у хуках?](#what-exactly-do-the-lint-rules-enforce)
* **[Від класів до хуків](#from-classes-to-hooks)**
  * [Як методи життєвого циклу співвідносяться з хуками?](#how-do-lifecycle-methods-correspond-to-hooks)
  * [Як я можу робити вибірку даних з допомогою хуків?](#how-can-i-do-data-fetching-with-hooks)
  * [Чи є щось подібне до змінних екземпляра класу?](#is-there-something-like-instance-variables)
  * [Скільки змінних стану мені слід використовувати — одну чи декілька?](#should-i-use-one-or-many-state-variables)
  * [Чи можна запускати ефект лише при оновленні?](#can-i-run-an-effect-only-on-updates)
  * [Як отримати попередні пропси чи стан?](#how-to-get-the-previous-props-or-state)
  * [Чому я бачу застарілі значення пропсів чи стану всередині моєї функції?](#why-am-i-seeing-stale-props-or-state-inside-my-function)
  * [Як я можу реалізувати getDerivedStateFromProps?](#how-do-i-implement-getderivedstatefromprops)
  * [Чи є щось схоже на forceUpdate?](#is-there-something-like-forceupdate)
  * [Чи можу я зробити реф на функціональий компонент?](#can-i-make-a-ref-to-a-function-component)
  * [Як я можу обмежити вузол DOM?](#how-can-i-measure-a-dom-node)
  * [Що означає const [thing, setThing] = useState()?](#what-does-const-thing-setthing--usestate-mean)
* **[Оптимізація продуктивності](#performance-optimizations)**
  * [Чи можу я пропустити ефект при оновленні?](#can-i-skip-an-effect-on-updates)
  * [Чи безпечно не вказувати в списку залежностей функції?](#is-it-safe-to-omit-functions-from-the-list-of-dependencies)
  * [Що я можу зробити, якщо залежності мого ефекту змінюються надто часто?](#what-can-i-do-if-my-effect-dependencies-change-too-often)
  * [Як я можу реалізувати shouldComponentUpdate?](#how-do-i-implement-shouldcomponentupdate)
  * [Як запам'ятати обчислення?](#how-to-memoize-calculations)
  * [Як ліниво обчислити вартісні об'єкти?](#how-to-create-expensive-objects-lazily)
  * [Чи є хуки повільними через створення функцій у рендері?](#are-hooks-slow-because-of-creating-functions-in-render)
  * [Як уникнути передачі функцій зворотнього виклику вниз?](#how-to-avoid-passing-callbacks-down)
  * [Як прочитати часто змінюване значення з useCallback?](#how-to-read-an-often-changing-value-from-usecallback)
* **[Деталі реалізації](#under-the-hood)**
  * [Як React асоціює виклики хуків з компонентами?](#how-does-react-associate-hook-calls-with-components)
  * [Що лежить в основі дизайну хуків?](#what-is-the-prior-art-for-hooks)

## Стратегія впровадження хуків {#adoption-strategy}

### Які версії React включають хуки? {#which-versions-of-react-include-hooks}

Починаючи з версії 16.8.0, React включає стабільну реалізацію хуків для:

* React DOM
* React DOM Сервер
* Тестовий рендерер React
* Поверхневий рендерер React

Зверніть увагу на те, **що всі пакунки React мають бути версії 16.8.0 або вище, щоб підтримувати хуки**. Хуки не будуть працювати, якщо ви забудете оновити, наприклад, React DOM.

React Native отримає повну підтримку хуків у наступному стабільному релізі.

### Чи маю я переписувати всі мої класові компоненти? {#do-i-need-to-rewrite-all-my-class-components}

Ні. Ми [не плануємо](/docs/hooks-intro.html#gradual-adoption-strategy) видаляти класи з React -- нам потрібно поставляти програмні продукти і ми не можемо дозволити собі переписувати кодову базу. Ми рекомендуємо спробувати хуки у новому коді.

### Що я можу зробити з хуками такого, чого не можу з класами? {#what-can-i-do-with-hooks-that-i-couldnt-with-classes}

Хуки пропонують новий, потужний і виразний шлях для повторного використання функціональності між компонентами. ["Створення користувацьких хуків"](/docs/hooks-custom.html) надає уявлення того, що ви можете реалізувати. [Ця стаття](https://medium.com/@dan_abramov/making-sense-of-react-hooks-fdbde8803889), написана членом основної команди розробників React, детально розповідає про нові можливості, які відкривають хуки.

### Яка частина моїх знань React залишиться актуальною? {#how-much-of-my-react-knowledge-stays-relevant}

Хуки — це більш прямий спосіб використання особливостей React про які ви вже знаєте: стан, життєвий цикл, контекст і рефи. Хуки не змінюють основні принципи роботи React і ваші знання компонентів, пропсів та низхідного потоку даних залишаться актуальними.

Хуки самі по собі мають криву вивчення. Якщо у цій документації чогось не вистачає, [підніміть питання](https://github.com/reactjs/reactjs.org/issues/new) і ми спробуємо допомогти вам.

### Що я маю використовувати: хуки, класи чи їх комбінацію? {#should-i-use-hooks-classes-or-a-mix-of-both}

Коли ви будете готові, ми заохочуємо вас почати використовувати хуки у ваших нових компонентах. Впевніться, що кожен член вашої команди підтримує їх використання і ознайомлений з документацією. Ми не рекомендуємо переписувати існуючі класи з використанням хуків, якщо ви не плануєте їх переписувати у будь-якому випадку (наприклад, щоб виправити помилку).

Ви не можете використовувати хуки *всередині* класового компонента, але ви безумовно можете комбінувати класи і функціональні компоненти з хуками в одному дереві. Чи є компонент класом, чи функцією — неважливо, оскільки це лише деталь реалізації цього компонента. Ми очікуємо, що в майбутньому хуки будуть основним методом написання React-компонентів.

### Чи покривають хуки всі варіанти використання класів? {#do-hooks-cover-all-use-cases-for-classes}

Нашоє метою є покриття всіх можливостей класів хуками якнайшвидше. Наразі немає альтернативи у вигляді хуків для таких рідковживаних методів життєвого циклу як `getSnapshotBeforeUpdate` та `componentDidCatch`, але ми плануємо скоро їх додати.

Оскільки хуки з'явились зовсім нещодавно, то не всі сторонні бібліотеки можуть бути сумісними з ними.

### Чи замінять хуки рендер пропси та компоненти вищого порядку? {#do-hooks-replace-render-props-and-higher-order-components}

Часто рендер пропси та компоненти вищого порядку рендерять лише одного нащадка. Ми вважаємо, що хуки є простішим шляхом для того, щоб зробити це. Все ще ми можемо використовувати обидва шаблони (наприклад, віртуальний компонент скролінгу може мати проп `renderItem` чи візуальний контейнер може мати власну структуру DOM). Але у більшості випадків, хуків буде достатньо для зменшення кількості вкладень у ващому дереві.

### Що означають хуки для популярних API, таких як Redux connect() чи React Router?{#what-do-hooks-mean-for-popular-apis-like-redux-connect-and-react-router}

Ви можете використовувати ті ж самі API, що і завжди — вони продовжують працювати.

У майбутньому, нові версії цих бібліотек можуть експортувати користувацькі хуки на кшталт `useRedux()` чи `useRouter()` і це дозволить вам використовувати той же функціонал без необхідності у компонентах-обгортках.

### Чи працюють хуки зі статичною типізацією? {#do-hooks-work-with-static-typing}

Хуки були спроектовані з урахуванням статичної типізації. Оскільки вони є функціями, то їх легше правильно типізувати, аніж, скажімо, компоненти вищого порядку. Найновіші версії Flow і TypeScript для React вже включають підтримку хуків.

Не менш важливо і те, що користувацькі хуки надають вам можливість накласти обмеження на React API, якщо вам потрібно типізувати їх більш строго певним чином. React надає вам примітиви, які ви можете комбінувати іншими способами, котрі ми передбачили у бібліотеці безпосередньо.

### Як тестувати компоненти, які використовують хуки? {#how-to-test-components-that-use-hooks}

З точки зору React, компонент, що використовує хуки, є цілком звичайним компонентом. Якщо ваш спосіб тестування не покладається на деталі реалізації React, тестування компонентів з хуками не має відрізнятись від тестування будь-яких інших компонентів.

Наприклад, ми маємо такий компонент лічильника:

```js
function Example() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    document.title = `Ви натиснули ${count} разів`;
  });
  return (
    <div>
      <p>Ви натиснули {count} разів</p>
      <button onClick={() => setCount(count + 1)}>
        Натисни мене
      </button>
    </div>
  );
}
```

Ми протестуємо його з використанням React DOM. Щоб впевнитись у тому, що поведінка співпадає з браузерною, ми обгорнемо код для рендерингу й оновлення у виклики [`ReactTestUtils.act()`](/docs/test-utils.html#act):

```js{3,20-22,29-31}
import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import Counter from './Counter';

let container;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  document.body.removeChild(container);
  container = null;
});

it('can render and update a counter', () => {
  // Тестуємо перший рендер і ефект
  act(() => {
    ReactDOM.render(<Counter />, container);
  });
  const button = container.querySelector('button');
  const label = container.querySelector('p');
  expect(label.textContent).toBe('Ви натиснули 0 разів');
  expect(document.title).toBe('Ви натиснули 0 разів');

  // Тестуємо другий рендер і ефект
  act(() => {
    button.dispatchEvent(new MouseEvent('click', {bubbles: true}));
  });
  expect(label.textContent).toBe('Ви натиснули 1 разів');
  expect(document.title).toBe('Ви натиснули 1 разів');
});
```

Виклики `act()` також миттєво запустять вкладені в них ефекти.

Якщо вам потрібно протестувати користувацький хук, ви можете зробити це, створивши компонент у вашому тесті і використати хук у ньому. Після цього ви можете протестувати щойно написаний компонент.

Щоб зменшити об'єм шаблонного коду, ми рекомендуємо використовувати [`react-testing-library`](https://git.io/react-testing-library), яка спроектована з метою заохочення написання тестів, що використовують ваші компоненти так, як це будуть робити кінцеві користувачі.

### Що саме перевіряють [правила лінтера](https://www.npmjs.com/package/eslint-plugin-react-hooks) у хуках? {#what-exactly-do-the-lint-rules-enforce}

Ми надаємо [плагін для ESLint](https://www.npmjs.com/package/eslint-plugin-react-hooks), котрий змушує дотримуватись [правил хуків](/docs/hooks-rules.html) для уникнення помилок. Він припускає, що кожна функція, яка починається з "`use`" і великої літери після нього, є хуком. Ми розуміємо, що це припущення не ідеальне і може привести до хибних спрацювань, але без подібної домовленості на рівні екосистеми просто неможливо змусити хуки працювати коректно, а довші імена можуть завадити людям впроваджувати хуки або ж дотримуватись домовленості.

У деталях правила вимагають, щоб:

* Виклики хуків знаходяться всередині `PascalCase`-функції (тобто компонента) чи іншої `useSomething` функції (тобто користувацького хука).
* Хуки викликаються у однаковому порядку при кожному рендері.

Існує ще кілька правил, що можуть змінитись відповідно до того, як ми змінюємо правила для балансування між пошуком помилок і уникненням хибних спрацювань.

## Від класів до хуків {#from-classes-to-hooks}

### Як методи життєвого циклу співвідносяться з хуками? {#how-do-lifecycle-methods-correspond-to-hooks}

* `constructor`: Функціональні компоненти не потребують конструктора. Ви можете ініціалізувати стан при виклику [`useState`](/docs/hooks-reference.html#usestate). Якщо обчислення початкового стану є вартісною операцію, можна передати функцію до `useState`.

* `getDerivedStateFromProps`: Натомість заплануйте оновлення [при рендерингу](#how-do-i-implement-getderivedstatefromprops).

* `shouldComponentUpdate`: Зверніть увагу на `React.memo` [нижче](#how-do-i-implement-shouldcomponentupdate).

* `render`: Це тіло функціонального компонента.

* `componentDidMount`, `componentDidUpdate`, `componentWillUnmount`: Хук [`useEffect`](/docs/hooks-reference.html#useeffect) може замінити всі їхні комбінації (включно з [менш](#can-i-skip-an-effect-on-updates) [частими](#can-i-run-an-effect-only-on-updates) випадками).

* `componentDidCatch` і `getDerivedStateFromError`: Поки що немає хуків, еквівалентних цим методам, але вони будуть додані найближчим часом.

### Як я можу робити вибірку даних з допомогою хуків?

Ось [невелике демо](https://codesandbox.io/s/jvvkoo8pq3), що допоможе вам розпочати. Щоб дізнатися більше, ознайомтесь з [цією статтею](https://www.robinwieruch.de/react-hooks-fetch-data/) про вибірку даних з допомогою хуків.

### Чи є щось подібне до змінних екземпляра класу? {#is-there-something-like-instance-variables}

Так! Хук [`useRef()`](/docs/hooks-reference.html#useref) може використовуватись не лише для рефів DOM. Об'єкт "ref" є загальним контейнером, властивість `current` якого, є змінною і може містити будь-яке значення, подібно до властивості екземпляра класу.

Ви можете записати значення всередині `useEffect`:

```js{2,8}
function Timer() {
  const intervalRef = useRef();

  useEffect(() => {
    const id = setInterval(() => {
      // ...
    });
    intervalRef.current = id;
    return () => {
      clearInterval(intervalRef.current);
    };
  });

  // ...
}
```

Якщо б ми лише хотіли встановити інтервал, реф був би непотрібний (`id` може бути локальним для ефекту), але він міг бути корисним для очищення інтервалу з обробника події:

```js{3}
  // ...
  function handleCancelClick() {
    clearInterval(intervalRef.current);
  }
  // ...
```

У загальному випадку ви можете вважати рефи схожими на змінні екземпляра класу. Уникайте встановлення рефів під час рендерингу, якщо ви не реалізовуєте [ліниву ініціалізацію](#how-to-create-expensive-objects-lazily) -- це може привести до неочікуваної поведінки. Як правило, ви захочете змінювати значення рефів у обробниках подій та ефектах.

### Скільки змінних стану мені слід використовувати — одну чи декілька? {#should-i-use-one-or-many-state-variables}

Якщо ви звикли до класів, ви скоріш за все звикли викликати `useState()` один раз і зберігати весь стан у одному об'єкті. І якщо ви хочете, то ви можете так вчинити і з хуками. Ось приклад компонента, що слідує за рухами мишки. Ми зберігаємо його позицію і розмір у локальному стані:

```js
function Box() {
  const [state, setState] = useState({ left: 0, top: 0, width: 100, height: 100 });
  // ...
}
```

Скажімо, що ми хочемо написати деяку логіку, яка змінить значення `left` і `top`, коли користувач рухає мишкою. Зверніть увагу, що ми маємо об'єднувати ці поля з попереднім об'єктом стану вручну:

```js{4,5}
  // ...
  useEffect(() => {
    function handleWindowMouseMove(e) {
      // Розпакування "...state" гарантує, що ми не "втратимо" width and height
      setState(state => ({ ...state, left: e.pageX, top: e.pageY }));
    }
    // Примітка: ця реалізація дещо спрощена
    window.addEventListener('mousemove', handleWindowMouseMove);
    return () => window.removeEventListener('mousemove', handleWindowMouseMove);
  }, []);
  // ...
```

Об'єднання потрібне оскільки при оновленні змінною стану ми *замінюємо* її значення. Дана поведінка відрізняється від методу `this.setState` у класі, який *об'єднує* оновлені поля в об'єкт.

Якщо вам не вистачає автоматичного об'єднання, ви можете написати користувацький `useLegacyState` хук, що об'єднує оновлення об'єкта стану. Проте **ми радимо розділити стан на декілька змінних з урахуванням того, які значення скоріше за все будуть змінюватися разом.**

Наприклад, ми могли розділити стан нашого компонента на об'єкти `position` та `size` і завжди замінювати `position` без необхідності в об'єднанні:

```js{2,7}
function Box() {
  const [position, setPosition] = useState({ left: 0, top: 0 });
  const [size, setSize] = useState({ width: 100, height: 100 });

  useEffect(() => {
    function handleWindowMouseMove(e) {
      setPosition({ left: e.pageX, top: e.pageY });
    }
    // ...
```

Крім того, розділення стану на незалежні змінні має ще одну перевагу. Це допоможе легко виокремити спільну логіку у користувацький хук пізніше, наприклад:

```js{2,7}
function Box() {
  const position = useWindowPosition();
  const [size, setSize] = useState({ width: 100, height: 100 });
  // ...
}

function useWindowPosition() {
  const [position, setPosition] = useState({ left: 0, top: 0 });
  useEffect(() => {
    // ...
  }, []);
  return position;
}
```

Зверніть увагу на те, як ми змогли винести виклик `useState` для змінної стану `position` і відповідний ефект у користувацький хук без зміни їхнього коду. Якби весь стан був одним об'єктом, то зробити це було б значно складніше.

Чи зерігаєте ви весь стан з використанням одного виклику `useState`, чи викликаєте `useState` для кожного поля окремо — обидва підходи будуть працювати. Але компоненти буде легше читати, якщо ви знайдете баланс між підходами і будете групувати пов'язані між собою змінні стану. Якщо логіка стану стає складною, ми радимо [керувати нею з допомогою редюсера](/docs/hooks-reference.html#usereducer) чи користувацького хука.

### Чи можна запускати ефект лише при оновленні? {#can-i-run-an-effect-only-on-updates}

Це доволі нечастий випадок. Якщо вам це потрібно, ви можете [використати змінний реф](#is-there-something-like-instance-variables), щоб вручну зберегти логічне значення, що вказує на те чи відбувся, а потім перевірити його значення у вашому ефекті. (Якщо вам потрібно робити це часто, можете створити для цього користувацький хук.)

### Як отримати попередні пропси чи стан? {#how-to-get-the-previous-props-or-state}

Наразі ви можете зробити це вручну, [використавши реф](#is-there-something-like-instance-variables):

```js{6,8}
function Counter() {
  const [count, setCount] = useState(0);

  const prevCountRef = useRef();
  useEffect(() => {
    prevCountRef.current = count;
  });
  const prevCount = prevCountRef.current;

  return <h1>Зараз: {count}, а до цього: {prevCount}</h1>;
}
```

Це може виглядати дещо ускладненим, але ви можете виокремити логіку в користувацький хук:

```js{3,7}
function Counter() {
  const [count, setCount] = useState(0);
  const prevCount = usePrevious(count);
  return <h1>Зараз: {count}, а до цього: {prevCount}</h1>;
}

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}
```

Зверніть увагу, що це спрацює для пропсів, стану чи будь-якого іншого обчисленого значення.

```js{5}
function Counter() {
  const [count, setCount] = useState(0);

  const calculation = count * 100;
  const prevCalculation = usePrevious(calculation);
  // ...
```

Цілком можливо, що у майбутньому у React буде реалізовано хук `usePrevious`, оскільки це потрібно відносно часто.

Також дивіться [рекомендований шаблон для похідного стану](#how-do-i-implement-getderivedstatefromprops).

### Чому я бачу застарілі значення пропсів чи стану всередині моєї функції? {#why-am-i-seeing-stale-props-or-state-inside-my-function}

Кожна функція в компоненті, включно з обробниками подій та ефектами, "бачить" значення пропсів та стану того рендеру, під час якого вони були створені. Наприклад, розглянемо такий код:

```js
function Example() {
  const [count, setCount] = useState(0);

  function handleAlertClick() {
    setTimeout(() => {
      alert('Ви натиснули на: ' + count);
    }, 3000);
  }

  return (
    <div>
      <p>Ви натиснули {count} раз</p>
      <button onClick={() => setCount(count + 1)}>
        Натисни на мене
      </button>
      <button onClick={handleAlertClick}>
        Показати попередження
      </button>
    </div>
  );
}
```

Якщо ви спочатку натиснента "Показати попередженняt", а потім інкрементуєте лічильник, попередження покаже значення змінної `count` **на момент натискання кнопки "Показати попередження"**. Це виключає помилки в коді, що припускає незмінність стану чи пропсів.

Якщо ви навмисно хочете зчитати *найновіший* стан з деякої асинхронної функції зворотнього виклику, ви можете зберегти його в [рефі](/docs/hooks-faq.html#is-there-something-like-instance-variables), змінити його і прочитати його значення.

Окрім цього, іншою можливою причиною того, що ви бачите застарілі пропси чи стан можуть бути неправильно вказані значення залежностей при використанні оптимізації за допомогою "масиву залежностей". Наприклад, в ефекті другим аргументом вказано значення `[]`, але при цьому він зчитує значення `someProp`, він продовжить "бачити" початкове значення `someProp`. Рішенням може бути вказання правильного масиву залежностей або відмова від нього взагалі. Ось тут можна дізнатись [як вести себе з функціями](#is-it-safe-to-omit-functions-from-the-list-of-dependencies), а тут [інші відомі способи](#what-can-i-do-if-my-effect-dependencies-change-too-often) зниження частоти запуску ефектів без пропускання передачі залежностей.

>Примітка
>
>Ми надаємо правило [`exhaustive-deps`](https://github.com/facebook/react/issues/14920), як частину нашого пакунку [`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks#installation). Воно попереджує про те, що залежності вказані невірно і пропонує рішення.

### How do I implement `getDerivedStateFromProps`? {#how-do-i-implement-getderivedstatefromprops}

While you probably [don't need it](/blog/2018/06/07/you-probably-dont-need-derived-state.html), in rare cases that you do (such as implementing a `<Transition>` component), you can update the state right during rendering. React will re-run the component with updated state immediately after exiting the first render so it wouldn't be expensive.

Here, we store the previous value of the `row` prop in a state variable so that we can compare:

```js
function ScrollView({row}) {
  let [isScrollingDown, setIsScrollingDown] = useState(false);
  let [prevRow, setPrevRow] = useState(null);

  if (row !== prevRow) {
    // Row changed since last render. Update isScrollingDown.
    setIsScrollingDown(prevRow !== null && row > prevRow);
    setPrevRow(row);
  }

  return `Scrolling down: ${isScrollingDown}`;
}
```

This might look strange at first, but an update during rendering is exactly what `getDerivedStateFromProps` has always been like conceptually.

### Is there something like forceUpdate? {#is-there-something-like-forceupdate}

Both `useState` and `useReducer` Hooks [bail out of updates](/docs/hooks-reference.html#bailing-out-of-a-state-update) if the next value is the same as the previous one. Mutating state in place and calling `setState` will not cause a re-render.

Normally, you shouldn't mutate local state in React. However, as an escape hatch, you can use an incrementing counter to force a re-render even if the state has not changed:

```js
  const [ignored, forceUpdate] = useReducer(x => x + 1, 0);

  function handleClick() {
    forceUpdate();
  }
```

Try to avoid this pattern if possible.

### Can I make a ref to a function component? {#can-i-make-a-ref-to-a-function-component}

While you shouldn't need this often, you may expose some imperative methods to a parent component with the [`useImperativeHandle`](/docs/hooks-reference.html#useimperativehandle) Hook.

### How can I measure a DOM node? {#how-can-i-measure-a-dom-node}

In order to measure the position or size of a DOM node, you can use a [callback ref](/docs/refs-and-the-dom.html#callback-refs). React will call that callback whenever the ref gets attached to a different node. Here is a [small demo](https://codesandbox.io/s/l7m0v5x4v9):

```js{4-8,12}
function MeasureExample() {
  const [height, setHeight] = useState(0);

  const measuredRef = useCallback(node => {
    if (node !== null) {
      setHeight(node.getBoundingClientRect().height);
    }
  }, []);

  return (
    <>
      <h1 ref={measuredRef}>Hello, world</h1>
      <h2>The above header is {Math.round(height)}px tall</h2>
    </>
  );
}
```

We didn't choose `useRef` in this example because an object ref doesn't notify us about *changes* to the current ref value. Using a callback ref ensures that [even if a child component displays the measured node later](https://codesandbox.io/s/818zzk8m78) (e.g. in response to a click), we still get notified about it in the parent component and can update the measurements.

Note that we pass `[]` as a dependency array to `useCallback`. This ensures that our ref callback doesn't change between the re-renders, and so React won't call it unnecessarily.

If you want, you can [extract this logic](https://codesandbox.io/s/m5o42082xy) into a reusable Hook:

```js{2}
function MeasureExample() {
  const [rect, ref] = useClientRect();
  return (
    <>
      <h1 ref={ref}>Hello, world</h1>
      {rect !== null &&
        <h2>The above header is {Math.round(rect.height)}px tall</h2>
      }
    </>
  );
}

function useClientRect() {
  const [rect, setRect] = useState(null);
  const ref = useCallback(node => {
    if (node !== null) {
      setRect(node.getBoundingClientRect());
    }
  }, []);
  return [rect, ref];
}
```


### What does `const [thing, setThing] = useState()` mean? {#what-does-const-thing-setthing--usestate-mean}

If you're not familiar with this syntax, check out the [explanation](/docs/hooks-state.html#tip-what-do-square-brackets-mean) in the State Hook documentation.


## Performance Optimizations {#performance-optimizations}

### Can I skip an effect on updates? {#can-i-skip-an-effect-on-updates}

Yes. See [conditionally firing an effect](/docs/hooks-reference.html#conditionally-firing-an-effect). Note that forgetting to handle updates often [introduces bugs](/docs/hooks-effect.html#explanation-why-effects-run-on-each-update), which is why this isn't the default behavior.

### Is it safe to omit functions from the list of dependencies? {#is-it-safe-to-omit-functions-from-the-list-of-dependencies}

Generally speaking, no.

```js{3,8}
function Example({ someProp }) {
  function doSomething() {
    console.log(someProp);
  }

  useEffect(() => {
    doSomething();
  }, []); // 🔴 This is not safe (it calls `doSomething` which uses `someProp`)
}
```

It's difficult to remember which props or state are used by functions outside of the effect. This is why **usually you'll want to declare functions needed by an effect *inside* of it.** Then it's easy to see what values from the component scope that effect depends on:

```js{4,8}
function Example({ someProp }) {
  useEffect(() => {
    function doSomething() {
      console.log(someProp);
    }

    doSomething();
  }, [someProp]); // ✅ OK (our effect only uses `someProp`)
}
```

If after that we still don't use any values from the component scope, it's safe to specify `[]`:

```js{7}
useEffect(() => {
  function doSomething() {
    console.log('hello');
  }

  doSomething();
}, []); // ✅ OK in this example because we don't use *any* values from component scope
```

Depending on your use case, there are a few more options described below.

>Note
>
>We provide the [`exhaustive-deps`](https://github.com/facebook/react/issues/14920) ESLint rule as a part of the [`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks#installation) package. It help you find components that don't handle updates consistently.

Let's see why this matters.

If you specify a [list of dependencies](/docs/hooks-reference.html#conditionally-firing-an-effect) as the last argument to `useEffect`, `useMemo`, `useCallback`, or `useImperativeHandle`, it must include all values used inside that participate in the React data flow. That includes props, state, and anything derived from them.  

It is **only** safe to omit a function from the dependency list if nothing in it (or the functions called by it) references props, state, or values derived from them. This example has a bug:

```js{5,12}
function ProductPage({ productId }) {
  const [product, setProduct] = useState(null);

  async function fetchProduct() {
    const response = await fetch('http://myapi/product' + productId); // Uses productId prop
    const json = await response.json();
    setProduct(json);
  }

  useEffect(() => {
    fetchProduct();
  }, []); // 🔴 Invalid because `fetchProduct` uses `productId`
  // ...
}
```

**The recommended fix is to move that function _inside_ of your effect**. That makes it easy to see which props or state your effect uses, and to ensure they're all declared:

```js{5-10,13}
function ProductPage({ productId }) {
  const [product, setProduct] = useState(null);

  useEffect(() => {
    // By moving this function inside the effect, we can clearly see the values it uses.
    async function fetchProduct() {
      const response = await fetch('http://myapi/product' + productId);
      const json = await response.json();
      setProduct(json);
    }

    fetchProduct();
  }, [productId]); // ✅ Valid because our effect only uses productId
  // ...
}
```

This also allows you to handle out-of-order responses with a local variable inside the effect:

```js{2,6,8}
  useEffect(() => {
    let ignore = false;
    async function fetchProduct() {
      const response = await fetch('http://myapi/product/' + productId);
      const json = await response.json();
      if (!ignore) setProduct(json);
    }
    return () => { ignore = true };
  }, [productId]);
```

We moved the function inside the effect so it doesn't need to be in its dependency list.

>Tip
>
>Check out [this small demo](https://codesandbox.io/s/jvvkoo8pq3) and [this article](https://www.robinwieruch.de/react-hooks-fetch-data/) to learn more about data fetching with Hooks.

**If for some reason you _can't_ move a function inside an effect, there are a few more options:**

* **You can try moving that function outside of your component**. In that case, the function is guaranteed to not reference any props or state, and also doesn't need to be in the list of dependencies.
* If the function you're calling is a pure computation and is safe to call while rendering, you may **call it outside of the effect instead,** and make the effect depend on the returned value.
* As a last resort, you can **add a function to effect dependencies but _wrap its definition_** into the [`useCallback`](/docs/hooks-reference.html#usecallback) Hook. This ensures it doesn't change on every render unless *its own* dependencies also change:

```js{2-5}
function ProductPage({ productId }) {
  // ✅ Wrap with useCallback to avoid change on every render
  const fetchProduct = useCallback(() => {
    // ... Does something with productId ...
  }, [productId]); // ✅ All useCallback dependencies are specified

  return <ProductDetails fetchProduct={fetchProduct} />;
}

function ProductDetails({ fetchProduct })
  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]); // ✅ All useEffect dependencies are specified
  // ...
}
```

Note that in the above example we **need** to keep the function in the dependencies list. This ensures that a change in the `productId` prop of `ProductPage` automatically triggers a refetch in the `ProductDetails` component.

### What can I do if my effect dependencies change too often?

Sometimes, your effect may be using reading state that changes too often. You might be tempted to omit that state from a list of dependencies, but that usually leads to bugs:

```js{6,9}
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(count + 1); // This effect depends on the `count` state
    }, 1000);
    return () => clearInterval(id);
  }, []); // 🔴 Bug: `count` is not specified as a dependency

  return <h1>{count}</h1>;
}
```

Specifying `[count]` as a list of dependencies would fix the bug, but would cause the interval to be reset on every change. That may not be desirable. To fix this, we can use the [functional update form of `setState`](/docs/hooks-reference.html#functional-updates). It lets us specify *how* the state needs to change without referencing the *current* state:

```js{6,9}
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1); // ✅ This doesn't depend on `count` variable outside
    }, 1000);
    return () => clearInterval(id);
  }, []); // ✅ Our effect doesn't use any variables in the component scope

  return <h1>{count}</h1>;
}
```

(The identity of the `setCount` function is guaranteed to be stable so it's safe to omit.)

In more complex cases (such as if one state depends on another state), try moving the state update logic outside the effect with the [`useReducer` Hook](/docs/hooks-reference.html#usereducer). [This article](https://adamrackis.dev/state-and-use-reducer/) offers an example of how you can do this. **The identity of the `dispatch` function from `useReducer` is always stable** — even if the reducer function is declared inside the component and reads its props.

As a last resort, if you want to something like `this` in a class, you can [use a ref](/docs/hooks-faq.html#is-there-something-like-instance-variables) to hold a mutable variable. Then you can write and read to it. For example:

```js{2-6,10-11,16}
function Example(props) {
  // Keep latest props in a ref.
  let latestProps = useRef(props);
  useEffect(() => {
    latestProps.current = props;
  });

  useEffect(() => {
    function tick() {
      // Read latest props at any time
      console.log(latestProps.current);
    }

    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []); // This effect never re-runs
}
```

Only do this if you couldn't find a better alternative, as relying on mutation makes components less predictable. If there's a specific pattern that doesn't translate well, [file an issue](https://github.com/facebook/react/issues/new) with a runnable example code and we can try to help.

### How do I implement `shouldComponentUpdate`? {#how-do-i-implement-shouldcomponentupdate}

You can wrap a function component with `React.memo` to shallowly compare its props:

```js
const Button = React.memo((props) => {
  // your component
});
```

It's not a Hook because it doesn't compose like Hooks do. `React.memo` is equivalent to `PureComponent`, but it only compares props. (You can also add a second argument to specify a custom comparison function that takes the old and new props. If it returns true, the update is skipped.)

`React.memo` doesn't compare state because there is no single state object to compare. But you can make children pure too, or even [optimize individual children with `useMemo`](/docs/hooks-faq.html#how-to-memoize-calculations).

### How to memoize calculations? {#how-to-memoize-calculations}

The [`useMemo`](/docs/hooks-reference.html#usememo) Hook lets you cache calculations between multiple renders by "remembering" the previous computation:

```js
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

This code calls `computeExpensiveValue(a, b)`. But if the inputs `[a, b]` haven't changed since the last value, `useMemo` skips calling it a second time and simply reuses the last value it returned.

Remember that the function passed to `useMemo` runs during rendering. Don't do anything there that you wouldn't normally do while rendering. For example, side effects belong in `useEffect`, not `useMemo`.

**You may rely on `useMemo` as a performance optimization, not as a semantic guarantee.** In the future, React may choose to "forget" some previously memoized values and recalculate them on next render, e.g. to free memory for offscreen components. Write your code so that it still works without `useMemo` — and then add it to optimize performance. (For rare cases when a value must *never* be recomputed, you can [lazily initialize](#how-to-create-expensive-objects-lazily) a ref.)

Conveniently, `useMemo` also lets you skip an expensive re-render of a child:

```js
function Parent({ a, b }) {
  // Only re-rendered if `a` changes:
  const child1 = useMemo(() => <Child1 a={a} />, [a]);
  // Only re-rendered if `b` changes:
  const child2 = useMemo(() => <Child2 b={b} />, [b]);
  return (
    <>
      {child1}
      {child2}
    </>
  )
}
```

Note that this approach won't work in a loop because Hook calls [can't](/docs/hooks-rules.html) be placed inside loops. But you can extract a separate component for the list item, and call `useMemo` there.

### How to create expensive objects lazily? {#how-to-create-expensive-objects-lazily}

`useMemo` lets you [memoize an expensive calculation](#how-to-memoize-calculations) if the inputs are the same. However, it only serves as a hint, and doesn't *guarantee* the computation won't re-run. But sometimes you need to be sure an object is only created once.

**The first common use case is when creating the initial state is expensive:**

```js
function Table(props) {
  // ⚠️ createRows() is called on every render
  const [rows, setRows] = useState(createRows(props.count));
  // ...
}
```

To avoid re-creating the ignored initial state, we can pass a **function** to `useState`:

```js
function Table(props) {
  // ✅ createRows() is only called once
  const [rows, setRows] = useState(() => createRows(props.count));
  // ...
}
```

React will only call this function during the first render. See the [`useState` API reference](/docs/hooks-reference.html#usestate).

**You might also occasionally want to avoid re-creating the `useRef()` initial value.** For example, maybe you want to ensure some imperative class instance only gets created once:

```js
function Image(props) {
  // ⚠️ IntersectionObserver is created on every render
  const ref = useRef(new IntersectionObserver(onIntersect));
  // ...
}
```

`useRef` **does not** accept a special function overload like `useState`. Instead, you can write your own function that creates and sets it lazily:

```js
function Image(props) {
  const ref = useRef(null);

  // ✅ IntersectionObserver is created lazily once
  function getObserver() {
    let observer = ref.current;
    if (observer !== null) {
      return observer;
    }
    let newObserver = new IntersectionObserver(onIntersect);
    ref.current = newObserver;
    return newObserver;
  }

  // When you need it, call getObserver()
  // ...
}
```

This avoids creating an expensive object until it's truly needed for the first time. If you use Flow or TypeScript, you can also give `getObserver()` a non-nullable type for convenience.


### Are Hooks slow because of creating functions in render? {#are-hooks-slow-because-of-creating-functions-in-render}

No. In modern browsers, the raw performance of closures compared to classes doesn't differ significantly except in extreme scenarios.

In addition, consider that the design of Hooks is more efficient in a couple ways:

* Hooks avoid a lot of the overhead that classes require, like the cost of creating class instances and binding event handlers in the constructor.

* **Idiomatic code using Hooks doesn't need the deep component tree nesting** that is prevalent in codebases that use higher-order components, render props, and context. With smaller component trees, React has less work to do.

Traditionally, performance concerns around inline functions in React have been related to how passing new callbacks on each render breaks `shouldComponentUpdate` optimizations in child components. Hooks approach this problem from three sides.

* The [`useCallback`](/docs/hooks-reference.html#usecallback) Hook lets you keep the same callback reference between re-renders so that `shouldComponentUpdate` continues to work:

    ```js{2}
    // Will not change unless `a` or `b` changes
    const memoizedCallback = useCallback(() => {
      doSomething(a, b);
    }, [a, b]);
    ```

* The [`useMemo` Hook](/docs/hooks-faq.html#how-to-memoize-calculations) makes it easier to control when individual children update, reducing the need for pure components.

* Finally, the `useReducer` Hook reduces the need to pass callbacks deeply, as explained below.

### How to avoid passing callbacks down? {#how-to-avoid-passing-callbacks-down}

We've found that most people don't enjoy manually passing callbacks through every level of a component tree. Even though it is more explicit, it can feel like a lot of "plumbing".

In large component trees, an alternative we recommend is to pass down a `dispatch` function from [`useReducer`](/docs/hooks-reference.html#usereducer) via context:

```js{4,5}
const TodosDispatch = React.createContext(null);

function TodosApp() {
  // Note: `dispatch` won't change between re-renders
  const [todos, dispatch] = useReducer(todosReducer);

  return (
    <TodosDispatch.Provider value={dispatch}>
      <DeepTree todos={todos} />
    </TodosDispatch.Provider>
  );
}
```

Any child in the tree inside `TodosApp` can use the `dispatch` function to pass actions up to `TodosApp`:

```js{2,3}
function DeepChild(props) {
  // If we want to perform an action, we can get dispatch from context.
  const dispatch = useContext(TodosDispatch);

  function handleClick() {
    dispatch({ type: 'add', text: 'hello' });
  }

  return (
    <button onClick={handleClick}>Add todo</button>
  );
}
```

This is both more convenient from the maintenance perspective (no need to keep forwarding callbacks), and avoids the callback problem altogether. Passing `dispatch` down like this is the recommended pattern for deep updates.

Note that you can still choose whether to pass the application *state* down as props (more explicit) or as context (more convenient for very deep updates). If you use context to pass down the state too, use two different context types -- the `dispatch` context never changes, so components that read it don't need to rerender unless they also need the application state.

### How to read an often-changing value from `useCallback`? {#how-to-read-an-often-changing-value-from-usecallback}

>Note
>
>We recommend to [pass `dispatch` down in context](#how-to-avoid-passing-callbacks-down) rather than individual callbacks in props. The approach below is only mentioned here for completeness and as an escape hatch.
>
>Also note that this pattern might cause problems in the [concurrent mode](/blog/2018/03/27/update-on-async-rendering.html). We plan to provide more ergonomic alternatives in the future, but the safest solution right now is to always invalidate the callback if some value it depends on changes.

In some rare cases you might need to memoize a callback with [`useCallback`](/docs/hooks-reference.html#usecallback) but the memoization doesn't work very well because the inner function has to be re-created too often. If the function you're memoizing is an event handler and isn't used during rendering, you can use [ref as an instance variable](#is-there-something-like-instance-variables), and save the last committed value into it manually:

```js{6,10}
function Form() {
  const [text, updateText] = useState('');
  const textRef = useRef();

  useEffect(() => {
    textRef.current = text; // Write it to the ref
  });

  const handleSubmit = useCallback(() => {
    const currentText = textRef.current; // Read it from the ref
    alert(currentText);
  }, [textRef]); // Don't recreate handleSubmit like [text] would do

  return (
    <>
      <input value={text} onChange={e => updateText(e.target.value)} />
      <ExpensiveTree onSubmit={handleSubmit} />
    </>Can I run an effect only on updates? {#can-i-run-an-effect-only-on-updates}

Th
  );
}
```

This is a rather convoluted pattern but it shows that you can do this escape hatch optimization if you need it. It's more bearable if you extract it to a custom Hook:

```js{4,16}
function Form() {
  const [text, updateText] = useState('');
  // Will be memoized even if `text` changes:
  const handleSubmit = useEventCallback(() => {
    alert(text);
  }, [text]);

  return (
    <>
      <input value={text} onChange={e => updateText(e.target.value)} />
      <ExpensiveTree onSubmit={handleSubmit} />
    </>
  );
}

function useEventCallback(fn, dependencies) {
  const ref = useRef(() => {
    throw new Error('Cannot call an event handler while rendering.');
  });

  useEffect(() => {
    ref.current = fn;
  }, [fn, ...dependencies]);

  return useCallback(() => {
    const fn = ref.current;
    return fn();
  }, [ref]);
}
```

In either case, we **don't recommend this pattern** and only show it here for completeness. Instead, it is preferable to [avoid passing callbacks deep down](#how-to-avoid-passing-callbacks-down).


## Under the Hood {#under-the-hood}

### How does React associate Hook calls with components? {#how-does-react-associate-hook-calls-with-components}

React keeps track of the currently rendering component. Thanks to the [Rules of Hooks](/docs/hooks-rules.html), we know that Hooks are only called from React components (or custom Hooks -- which are also only called from React components).

There is an internal list of "memory cells" associated with each component. They're just JavaScript objects where we can put some data. When you call a Hook like `useState()`, it reads the current cell (or initializes it during the first render), and then moves the pointer to the next one. This is how multiple `useState()` calls each get independent local state.

### What is the prior art for Hooks? {#what-is-the-prior-art-for-hooks}

Hooks synthesize ideas from several different sources:

* Our old experiments with functional APIs in the [react-future](https://github.com/reactjs/react-future/tree/master/07%20-%20Returning%20State) repository.
* React community's experiments with render prop APIs, including [Ryan Florence](https://github.com/ryanflorence)'s [Reactions Component](https://github.com/reactions/component).
* [Dominic Gannaway](https://github.com/trueadm)'s [`adopt` keyword](https://gist.github.com/trueadm/17beb64288e30192f3aa29cad0218067) proposal as a sugar syntax for render props.
* State variables and state cells in [DisplayScript](http://displayscript.org/introduction.html).
* [Reducer components](https://reasonml.github.io/reason-react/docs/en/state-actions-reducer.html) in ReasonReact.
* [Subscriptions](http://reactivex.io/rxjs/class/es6/Subscription.js~Subscription.html) in Rx.
* [Algebraic effects](https://github.com/ocamllabs/ocaml-effects-tutorial#2-effectful-computations-in-a-pure-setting) in Multicore OCaml.

[Sebastian Markbåge](https://github.com/sebmarkbage) came up with the original design for Hooks, later refined by [Andrew Clark](https://github.com/acdlite), [Sophie Alpert](https://github.com/sophiebits), [Dominic Gannaway](https://github.com/trueadm), and other members of the React team.
