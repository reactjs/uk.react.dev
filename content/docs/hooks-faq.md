---
id: hooks-faq
title: "Хуки: FAQ"
permalink: docs/hooks-faq.html
prev: hooks-reference.html
---

*Хуки* — це новинка в React 16.8. Вони дозволяють вам використовувати стан та інші можливості React без написання класу.

На цій сторінці ви знайдете відповіді на деякі поширені питання щодо [хуків](/docs/hooks-overview.html).

<!--
  якщо вам доведеться колись згенерувати це заново, наступний уривок коду, введений у інструменти розробника, може вам допомогти:

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
  * [Чи можу я зробити реф на функціональний компонент?](#can-i-make-a-ref-to-a-function-component)
  * [Як я можу обмежити вузол DOM?](#how-can-i-measure-a-dom-node)
  * [Що означає const [thing, setThing] = useState()?](#what-does-const-thing-setthing--usestate-mean)
* **[Оптимізація продуктивності](#performance-optimizations)**
  * [Чи можу я пропустити ефект при оновленні?](#can-i-skip-an-effect-on-updates)
  * [Чи безпечно не вказувати в списку залежностей функції?](#is-it-safe-to-omit-functions-from-the-list-of-dependencies)
  * [Що я можу зробити, якщо залежності мого ефекту змінюються надто часто?](#what-can-i-do-if-my-effect-dependencies-change-too-often)
  * [Як я можу реалізувати shouldComponentUpdate?](#how-do-i-implement-shouldcomponentupdate)
  * [Як запам'ятати обчислення?](#how-to-memoize-calculations)
  * [Як ліниво обчислити вартісні об'єкти?](#how-to-create-expensive-objects-lazily)
  * [Чи є хуки повільними через створення функцій при рендері?](#are-hooks-slow-because-of-creating-functions-in-render)
  * [Як уникнути передачі функцій зворотнього виклику вниз?](#how-to-avoid-passing-callbacks-down)
  * [Як прочитати часто змінюване значення з useCallback?](#how-to-read-an-often-changing-value-from-usecallback)
* **[Деталі реалізації](#under-the-hood)**
  * [Як React асоціює виклики хуків з компонентами?](#how-does-react-associate-hook-calls-with-components)
  * [Що лежить в основі дизайну хуків?](#what-is-the-prior-art-for-hooks)

## Стратегія впровадження хуків {#adoption-strategy}

### Які версії React включають хуки? {#which-versions-of-react-include-hooks}

Починаючи з версії 16.8.0, React включає стабільну реалізацію хуків для:

* React DOM
* React DOM Server
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

Нашою метою є покриття всіх можливостей класів хуками якнайшвидше. Наразі немає альтернативи у вигляді хуків для таких рідковживаних методів життєвого циклу як `getSnapshotBeforeUpdate` та `componentDidCatch`, але ми плануємо скоро їх додати.

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
* Хуки викликаються в однаковому порядку при кожному рендері.

Існує ще кілька правил, що можуть змінитись відповідно до того, як ми змінюємо правила для балансування між пошуком помилок і уникненням хибних спрацювань.

## Від класів до хуків {#from-classes-to-hooks}

### Як методи життєвого циклу співвідносяться з хуками? {#how-do-lifecycle-methods-correspond-to-hooks}

* `constructor`: Функціональні компоненти не потребують конструктора. Ви можете ініціалізувати стан при виклику [`useState`](/docs/hooks-reference.html#usestate). Якщо обчислення початкового стану є вартісною операцію, можна передати функцію до `useState`.

* `getDerivedStateFromProps`: Натомість заплануйте оновлення [при рендерингу](#how-do-i-implement-getderivedstatefromprops).

* `shouldComponentUpdate`: Зверніть увагу на `React.memo` [нижче](#how-do-i-implement-shouldcomponentupdate).

* `render`: Це тіло функціонального компонента.

* `componentDidMount`, `componentDidUpdate`, `componentWillUnmount`: Хук [`useEffect`](/docs/hooks-reference.html#useeffect) може замінити всі їхні комбінації (включно з [менш](#can-i-skip-an-effect-on-updates) [частими](#can-i-run-an-effect-only-on-updates) випадками).

* `componentDidCatch` і `getDerivedStateFromError`: Поки що немає хуків, еквівалентних цим методам, але вони будуть додані найближчим часом.

### Як я можу робити вибірку даних з допомогою хуків? {#how-can-i-do-data-fetching-with-hooks}

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

Якщо ви звикли до класів, ви скоріш за все викликали `useState()` один раз і зберігали весь стан в одному об'єкті. І якщо ви хочете, то ви можете так вчинити і з хуками. Ось приклад компонента, що слідує за рухами мишки. Ми зберігаємо його позицію і розмір у локальному стані:

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

Об'єднання потрібне оскільки при оновленні змінної стану ми *замінюємо* її значення. Дана поведінка відрізняється від методу `this.setState` у класі, який *об'єднує* оновлені поля в об'єкт.

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

### Як я можу реалізувати `getDerivedStateFromProps`? {#how-do-i-implement-getderivedstatefromprops}

Незважаючи на те, що скоріш за все [він вам не потрібен](/blog/2018/06/07/you-probably-dont-need-derived-state.html), у випадку потреби (наприклад реалізації компонента `<Transition>`), ви можете оновити стан прямо під час рендерингу. React негайно зробить повторний рендер компонента з оновленим станом після виходу з першого рендеру без особливих накладних витрат.

У наступному прикладі ми зберігаємо попереднє значення пропу `row` у змінній стану для порівняння:

```js
function ScrollView({row}) {
  let [isScrollingDown, setIsScrollingDown] = useState(false);
  let [prevRow, setPrevRow] = useState(null);

  if (row !== prevRow) {
    // Row змінився після останнього рендеру. Оновлюємо isScrollingDown.
    setIsScrollingDown(prevRow !== null && row > prevRow);
    setPrevRow(row);
  }

  return `Гортаємо вниз: ${isScrollingDown}`;
}
```

Спочатку це може виглядати дивно, але оновлення під час рендеру це, по суті, і є те чим завжди концептуально був `getDerivedStateFromProps`.

### Чи є щось схоже на forceUpdate? {#is-there-something-like-forceupdate}

Хуки `useState` та `useReducer` [припиняють оновлення](/docs/hooks-reference.html#bailing-out-of-a-state-update) якщо наступне значення дорівнює попередньому. Зміна стану на місці і виклик `setState` не спричинять повторного рендеру.

Як правило, ви не повинні змінювати локальний стан у React. Проте, у якості запасного виходу, ви можете використати збільшення лічильника, щоб спричинити повторний рендер, навіть якщо стан не змінився:

```js
  const [ignored, forceUpdate] = useReducer(x => x + 1, 0);

  function handleClick() {
    forceUpdate();
  }
```

По можливості намагайтесь уникати такого підходу.

### Чи можу я зробити реф на функціональний компонент? {#can-i-make-a-ref-to-a-function-component}

Хоча це і не потрібно надто часто, ви можете надати деякі імперативні методи батьківському компоненту, використавши хук [`useImperativeHandle`](/docs/hooks-reference.html#useimperativehandle).

### Як я можу обмежити вузол DOM? {#how-can-i-measure-a-dom-node}

Для обмеження положення чи розміру вузла DOM, ви можете використати [реф зворотнього виклику](/docs/refs-and-the-dom.html#callback-refs). React викличе функцію зворотнього виклику кожного разу, коли реф прикріплюється до іншого вузла. Ось [невеличка демонстрація](https://codesandbox.io/s/l7m0v5x4v9):

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
      <h2>Заголовок вище має висоту {Math.round(height)} пікселів</h2>
    </>
  );
}
```

У цьому прикладі ми не використали `useRef`, оскільки об'єкт рефу не повідомляє нас про *зміни* поточного значення рефу. Використання рефу зворотнього виклику гарантує, що [навіть якщо дочірній компонент відображає обмежений вузол пізніше](https://codesandbox.io/s/818zzk8m78) (наприклад, у відповідь на натискання), ми все рівно отримаємо повідомлення про це у батьківському компоненті і зможемо оновити обмеження.

Зверніть увагу на передачу `[]` у якості масива залежностей `useCallback`. Вона гарантує, що наш реф зворотнього виклику не зміниться між повторними рендерами, а отже React не буде викликати його без необхідності.

За бажанням можна [виокремити цю логіку](https://codesandbox.io/s/m5o42082xy) у повторно використовуваний хук:

```js{2}
function MeasureExample() {
  const [rect, ref] = useClientRect();
  return (
    <>
      <h1 ref={ref}>Hello, world</h1>
      {rect !== null &&
        <h2>Заголовок вище має висоту {Math.round(rect.height)} пікселів</h2>
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


### Що означає const [thing, setThing] = useState()? {#what-does-const-thing-setthing--usestate-mean}

Якщо ви не знайомі з цим синтаксисом, прочитайте [пояснення](/docs/hooks-state.html#tip-what-do-square-brackets-mean) у документації для хука стану.


## Оптимізація продуктивності {#performance-optimizations}

### Чи можу я пропустити ефект при оновленні? {#can-i-skip-an-effect-on-updates}

Так. Дивіться [умовне спрацювання ефекту](/docs/hooks-reference.html#conditionally-firing-an-effect). Зверніть увагу, якщо ви забудете обробити оновлення, то ви можете [спричинити помилки](/docs/hooks-effect.html#explanation-why-effects-run-on-each-update). Саме тому це і не є поведінкою за замовчуванням.

### Чи безпечно не вказувати в списку залежностей функції? {#is-it-safe-to-omit-functions-from-the-list-of-dependencies}

У загальному випадку — ні.

```js{3,8}
function Example({ someProp }) {
  function doSomething() {
    console.log(someProp);
  }

  useEffect(() => {
    doSomething();
  }, []); // 🔴 Це небезбечно (виклик `doSomething`, що використовує `someProp`)
}
```

Доволі складно запам'ятати які пропси чи стан використовуються функціями ззовні ефекту. Саме тому **функції, що потрібні ефекту, оголошуються безпосередньо *в* ефекті.** Так буде простіше побачити, від яких значень з області видимості компонента залежить ефект:

```js{4,8}
function Example({ someProp }) {
  useEffect(() => {
    function doSomething() {
      console.log(someProp);
    }

    doSomething();
  }, [someProp]); // ✅ OK (наш ефект використовує лише `someProp`)
}
```

Якщо після подібної зміни ми не використовуємо жодних значень з області видимості компонента, то ми можемо безпечно вказати `[]`:

```js{7}
useEffect(() => {
  function doSomething() {
    console.log('hello');
  }

  doSomething();
}, []); // ✅ OK у цьому прикладі, тому що ми не використовуємо *жодних* значень з області видимості компонента
```

Залежно від ваших потреб є ще кілька варіантів, описаних нижче.

>Примітка
>
>Ми надаємо правило [`exhaustive-deps`](https://github.com/facebook/react/issues/14920), як частину нашого пакунку [`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks#installation). Воно допоможе знайти компоненти, які не оброблюють оновлення належним чином.

Давайте глянемо, чому це важливо.

Якщо ви вкажете [список залежностей](/docs/hooks-reference.html#conditionally-firing-an-effect) в якості останнього аргумента `useEffect`, `useMemo`, `useCallback` чи `useImperativeHandle`, він має містити всі значення, що використовуються у потоці даних React, включно з пропсами, станом і їх похідними.

Можна безпечно пропустити функцію з списку залежностей **лише** тоді, коли вона (чи функції, які вона викликає) не посилається на пропси, стан чи їх похідні. У цьому прикладі є помилка:

```js{5,12}
function ProductPage({ productId }) {
  const [product, setProduct] = useState(null);

  async function fetchProduct() {
    const response = await fetch('http://myapi/product' + productId); // Використовує проп productId
    const json = await response.json();
    setProduct(json);
  }

  useEffect(() => {
    fetchProduct();
  }, []); // 🔴 Неправильно, тому що `fetchProduct` використовує `productId`
  // ...
}
```

**Рекомендується виправляти таку помилку, виконавши переміщення функції _всередину_ вашого ефекту**. Так буде простіше побачити, які пропси чи стан використовуються ефектом і впевнитись, що всі вони оголошені:

```js{5-10,13}
function ProductPage({ productId }) {
  const [product, setProduct] = useState(null);

  useEffect(() => {
    // Перемістивши функцію всередину ефекту, ми можемо відразу помітити, які значення він використовує.
    async function fetchProduct() {
      const response = await fetch('http://myapi/product' + productId);
      const json = await response.json();
      setProduct(json);
    }

    fetchProduct();
  }, [productId]); // ✅ Вірно, тому що наш ефект використовує лише productId
  // ...
}
```

Крім того, це дозволяє вам обробляти невпорядковані відповіді, використавши локальну змінну всередині ефекту:

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

Ми перемістили функцію в ефект, щоб не вказувати її в списку залежностей.

>Порада
>
>Перегляньте [це невеличке демо](https://codesandbox.io/s/jvvkoo8pq3) і [цю статтю](https://www.robinwieruch.de/react-hooks-fetch-data/), щоб дізнатися більше про вибірку даних з хуками.

**Якщо ви з певних причин _не можете_ перемістити функцію в ефект, є кілька інших варіантів:**

* **Ви можете спробувати винести функцію за межі вашого компонента**. У цьому випадку, функція гарантовано не буде посилатись на пропси чи стан, тому її можна не вказувати у списку залежностей.
* Якщо функція, яку ви викликаєте, є чистим обчисленням і її можна безпечно викликати під час рендерингу, то ви можете **викликати її поза межами ефекту** і зробити ефект залежним від повернутого значення.
* У крайньому випадку, ви можете **додати функцію до залежностей ефекту, але при цьому _обгорнути її визначення_** у хук [`useCallback`](/docs/hooks-reference.html#usecallback). Це гарантує її незмінність при кожному рендері, допоки не зміняться *її власні* залежності:

```js{2-5}
function ProductPage({ productId }) {
  // ✅ Обгортаємо в useCallback, щоб запобігти зміни при кожному рендері
  const fetchProduct = useCallback(() => {
    // ... Робимо щось з productId ...
  }, [productId]); // ✅ Перераховуємо всі залежності useCallback

  return <ProductDetails fetchProduct={fetchProduct} />;
}

function ProductDetails({ fetchProduct })
  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]); // ✅ Усі залежності useEffect вказані
  // ...
}
```

Зверніть увагу, що у прикладі вище, ми **повинні** вказати функцію у списку залежностей. Це гарантує, що зміна пропу `productId` компонента `ProductPage` автоматично запустить повторну вибірку даних у компоненті `ProductDetails`.

### Що я можу зробити, якщо залежності мого ефекту змінюються надто часто? {#what-can-i-do-if-my-effect-dependencies-change-too-often}

Часом ваш ефект може залежати від стану, що змінюється надто часто. У вас може виникнути бажання пропустити цей стан із списку залежностей, але зазвичай це приводить до помилок:

```js{6,9}
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(count + 1); // Цей ефект залежить від стану `count`
    }, 1000);
    return () => clearInterval(id);
  }, []); // 🔴 Помилка: змінна `count` не вказана як залежність

  return <h1>{count}</h1>;
}
```

Вказання `[count]` у якості списка залежностей виправить помилку, але спричинить скидання інтервалу на кожному оновленні. Така поведінка може бути небажаною. Щоб виправити це, ми можемо використати [функціональну форму оновлення `setState`](/docs/hooks-reference.html#functional-updates). Вона дозволить нам вказати *як* стан має змінитись, при цьому не посилаючись на *поточний* стан:

```js{6,9}
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1); // ✅ Цей рядок не залежить від змінної `count` ззовні
    }, 1000);
    return () => clearInterval(id);
  }, []); // ✅ Наш ефект не використовує жодних змінних в області видимості компонента

  return <h1>{count}</h1>;
}
```

(Ідентичність функції `setCount` гарантована, а тому її можна безпечно пропустити.)

У більш складних випадках (наприклад, коли стан залежить від іншого стану), спробуйте винести логіку оновлення стану з ефекта, використавши [хук `useReducer`](/docs/hooks-reference.html#usereducer). [Ця стаття](https://adamrackis.dev/state-and-use-reducer/) прпопонує приклад того, як це можна зробити. **Ідентичність функції `dispatch`, хука `useReducer`, завжди незмінна** — навіть якщо функція-редюсер оголошена всередині компонента і читає його пропси.

У крайньому випадку, якщо ви хочете щось схоже на `this` у класі, ви можете [використати реф](/docs/hooks-faq.html#is-there-something-like-instance-variables) для збереження змінної, яку ви можете зчитувати і перезаписувати. Наприклад:

```js{2-6,10-11,16}
function Example(props) {
  // Зберегти останні пропси у рефі.
  let latestProps = useRef(props);
  useEffect(() => {
    latestProps.current = props;
  });

  useEffect(() => {
    function tick() {
      // Прочитати останні пропси у будь-який момент
      console.log(latestProps.current);
    }

    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []); // Цей ефект ніколи не буде запущено повторно
}
```

Робіть так лише якщо ви не можете знайти кращої альтернативи, тому що поведінка компонентів, яка покладається на змінність, є менш передбачуваною. Якщо існує якийсь шаблон, який ви не можете гарно виразити, [відкрийте проблему](https://github.com/facebook/react/issues/new) з прикладом виконуваного коду і ми постараємося вам допомогти.

### Як я можу реалізувати shouldComponentUpdate? {#how-do-i-implement-shouldcomponentupdate}

Ви можете обгорнути функціональний компонент у виклик `React.memo`, щоб поверхнево порівняти його пропси:

```js
const Button = React.memo((props) => {
  // ваш компонент
});
```

Це не є хуком, тому що ця функція не веде себе як хук. `React.memo` є еквівалентом `PureComponent`, але вона порівнює тільки пропси. (Ви також можете передати другий аргумент, щоб вказати власну функцію порівняння, яка приймає старі і нові пропси. Якщо вона повертає true, оновлення не відбудеться.)

`React.memo` не порівнює стан, тому що не існує єдиного об'єкта стану, який би можна було б порівняти. Але ви також можете зробити дочірні компоненти чистими чи навіть [оптимізувати їх вибірково, використавши хук `useMemo`](/docs/hooks-faq.html#how-to-memoize-calculations).

### Як запам'ятати обчислення? {#how-to-memoize-calculations}

Хук [`useMemo`](/docs/hooks-reference.html#usememo) дозволяє вам закешувати обчислення між кількома рендерами, "запам'ятавши" попереднє обчислення:

```js
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

Цей код викликає `computeExpensiveValue(a, b)`. Але якщо аргументи `[a, b]` не змінились у порівнянні з їх попередніми значеннями, `useMemo` пропустить повторний виклик і просто перевикористає останнє повернуте значення.

Пам'ятайте, що функція, передана до `useMemo`, запускається під час рендерингу. Не робіть у ній нічого, що ви зазвичай не робите під час рендерингу. Наприклад, побічні ефекти мають бути в `useEffect`, а не `useMemo`.

**Ви можете покластись на `useMemo` як на оптимізацію продуктивності, а не на семантичу гарантію.** У майбутньому React може вирішити "забути" деякі попередньо мемоізовані значення і переобчислити їх при наступному рендері, наприклад, для звільнення пам'яті для компонентів поза областю видимості екрана. Напишіть ваш код так, щоб він працював без `useMemo`, а потім додайте його для оптимізації продуктивності. (У нечастих випадках, коли значення *ніколи* не обчислюється повторно, ви можете [ліниво ініціалізувати](#how-to-create-expensive-objects-lazily) реф.)

Зручно також те, що `useMemo` дає можливість пропускати вартісний повторний рендер потомків:

```js
function Parent({ a, b }) {
  // Повторно рендериться при зміні `a`:
  const child1 = useMemo(() => <Child1 a={a} />, [a]);
  // Повторно рендериться при зміні `b`:
  const child2 = useMemo(() => <Child2 b={b} />, [b]);
  return (
    <>
      {child1}
      {child2}
    </>
  )
}
```

Зверніть увагу, що цей підхід не спрацює у циклі, тому що виклики хуків [не можна](/docs/hooks-rules.html) помістити в цикл. Але ви можете виокремити компонент для елемента списку і викликати `useMemo` там.

### Як ліниво обчислити вартісні об'єкти? {#how-to-create-expensive-objects-lazily}

`useMemo` дозволяє [запам'ятати вартісне обчислення](#how-to-memoize-calculations) для однакових вхідних даних. Проте він відіграє лише роль підказки для React і *не гарантує*, що повторні обчислення не будуть виконані знову. Але часом ви маєте бути впевнені, що об'єкт був створений лише раз.

**Першим поширеним випадком є вартісне створення початкового стану:**

```js
function Table(props) {
  // ⚠️ createRows() викликається при кожному рендері
  const [rows, setRows] = useState(createRows(props.count));
  // ...
}
```

Щоб запобігти повторному створенню початкового стану, ми можемо передати **функцію** до `useState`:

```js
function Table(props) {
  // ✅ createRows() буде викликана лише раз
  const [rows, setRows] = useState(() => createRows(props.count));
  // ...
}
```

React викличе цю функцію лише під час першого рендеру. Перегляньте [API-довідник для хука `useState`](/docs/hooks-reference.html#usestate).

**Іноді ви можете захотіти уникнути повторного створення початкового значення `useRef()`.** Наприклад, ви хочете впевнитись, що екземпляр деякого імперативного класу буде створений лише раз:

```js
function Image(props) {
  // ⚠️ IntersectionObserver створюється при кожному рендері
  const ref = useRef(new IntersectionObserver(onIntersect));
  // ...
}
```

`useRef` **не** реалізує перевантаження, що дозволяє приймати особливу функцію як `useState`. Замість цього ви можете написати вашу власну функцію, що ліниво створить і ініціалізує його значення:

```js
function Image(props) {
  const ref = useRef(null);

  // ✅ IntersectionObserver ліниво створюється один раз
  function getObserver() {
    let observer = ref.current;
    if (observer !== null) {
      return observer;
    }
    let newObserver = new IntersectionObserver(onIntersect);
    ref.current = newObserver;
    return newObserver;
  }

  // Викличіть getObserver() за потреби
  // ...
}
```

Такий варіант дозволить уникнути створення вартісного об'єкта до моменту, коли він дійсно потрібен вперше. Якщо ви використовуєте Flow чи TypeScript, ви також можете встановити ненульовий `getObserver()` тип для зручності.


### Чи є хуки повільними через створення функцій при рендері? {#are-hooks-slow-because-of-creating-functions-in-render}

Ні. У сучасних браузерах сира продуктивність замикань не надто відрізняється від класів, крім деяких особливих випадків.

Також враховуйте, що реалізація хуків більш ефективна у кількох напрямках:

* Хуки не роблять зайвої роботи, що потрібна класам, наприклад, створення екземплярів класу і прив'язка обробників події у конструкторі.

* **Характерний код з використанням хуків не потребує глибокого дерева компонентів**, що є поширених у кодових базах з використаням компонентів вищого порядку, рендер пропсів та контексту. React матиме менше роботи з меншими деревами компонентів.

Традиційно, проблеми продуктивності вбудованих функцій у React були пов'язані з тим, як передача нових функцій зворотнього виклику при кожному рендері порушує оптимізації `shouldComponentUpdate` у дочірніх компонентах. Хуки підходять до цієї проблеми з трьох сторін.

* Хук [`useCallback`](/docs/hooks-reference.html#usecallback) дозволяє вам зберегти посилання на ту саму функцію зворотнього виклику між повторними рендерами, а тому `shouldComponentUpdate` продовжить коректно працювати:

    ```js{2}
    // Зміниться лише при зміні `a` чи `b`
    const memoizedCallback = useCallback(() => {
      doSomething(a, b);
    }, [a, b]);
    ```

* Використання [хука `useMemo`](/docs/hooks-faq.html#how-to-memoize-calculations) полегшує контроль оновлення індивідуальних потомків, зменшуючи потребу в чистих компонентах.

* Нарешті, хук `useReducer` зменшує потребу глибокої передачі функцій зворотнього виклику, як пояснюється нижче.

### Як уникнути передачі функцій зворотнього виклику вниз? {#how-to-avoid-passing-callbacks-down}

Ми зрозуміли, що більшості людей не подобається вручну передавати функції зворотнього виклику вниз на кожному рівні дерева компонентів. Незважаючи на те, що це виглядає більш явно, це може здатись надзвичайно громіздким.

У великих деревах компонентів у якості альтернативи ми радимо передавати функцію `dispatch` хука [`useReducer`](/docs/hooks-reference.html#usereducer) через контекст:

```js{4,5}
const TodosDispatch = React.createContext(null);

function TodosApp() {
  // Примітка: `dispatch` не змінюється при повторних рендерах
  const [todos, dispatch] = useReducer(todosReducer);

  return (
    <TodosDispatch.Provider value={dispatch}>
      <DeepTree todos={todos} />
    </TodosDispatch.Provider>
  );
}
```

Будь-який потомок у дереві всередині `TodosApp` може використовувати функцію `dispatch`, щоб передати дії вверх до `TodosApp`:

```js{2,3}
function DeepChild(props) {
  // Якщо ми хочемо виконати дію, ми можемо отримати dispatch з контексту.
  const dispatch = useContext(TodosDispatch);

  function handleClick() {
    dispatch({ type: 'add', text: 'привіт' });
  }

  return (
    <button onClick={handleClick}>Додати завдання</button>
  );
}
```

Цей варіант зручніше як з точки зору підтримки коду (немає потреби у передачі зайвих функцій зворотнього виклику), так і вирішує проблему функцій зворотнього виклику в цілому. Передача `dispatch` вниз, як у вищенаведеному прикладі, є рекомендованим шаблоном для глибоких оновлень.

Зверніть увагу, що ви й досі вільні обирати чи передавати *стан* вниз у якості пропсів (більш явно) або ж у якості контексту (більш зручно для глибоких оновлень). Якщо ваш контекст також передає вниз стан, використовуйте два різних типи контексту, оскільки контекст `dispatch` ніколи не змінюється, а отже компоненти, що зчитують його, не потребують повторного рендеру, якщо тільки вони не потребують контекст зі станом додатку.

### Як прочитати часто змінюване значення з useCallback? {#how-to-read-an-often-changing-value-from-usecallback}

>Примітка
>
>Ми радимо [передавати `dispatch` у контексті вниз](#how-to-avoid-passing-callbacks-down), а не окремих функцій зворотнього виклику в пропсах. Підхід нижче описаний лише для повноти і у якості запасного виходу.
>
>Також зверніть увагу, що цей шаблон може спричинити проблеми у [конкурентному режимі](/blog/2018/03/27/update-on-async-rendering.html). Ми плануємо надати більш зручні альтернативи у майбутньому, але найбезпечнішим рішенням наразі — скасування функції зворотнього виклику при зміні хоча б одного значення від якого він залежить.

У нечастих випадках вам може бути потрібно запам'ятати функцію зворотнього виклику, використавши [`useCallback`](/docs/hooks-reference.html#usecallback), але запам'ятовування не спрацює як слід, тому що внутрішня функція повинна повторно створюватись надто часто. Якщо функція, яку ви запам'ятовуєте, є оброником події і не використовується під час рендерингу, то ви можете [використати реф як змінну екземпляра](#is-there-something-like-instance-variables) і зберегти у ньому останнє значення вручну:

```js{6,10}
function Form() {
  const [text, updateText] = useState('');
  const textRef = useRef();

  useEffect(() => {
    textRef.current = text; // Записати значення у реф
  });

  const handleSubmit = useCallback(() => {
    const currentText = textRef.current; // Прочитати значення рефу
    alert(currentText);
  }, [textRef]); // Не створювати handleSubmit повторно, як би було у випадку з [text]

  return (
    <>
      <input value={text} onChange={e => updateText(e.target.value)} />
      <ExpensiveTree onSubmit={handleSubmit} />
    </>
  );
}
```

Це доволі заплутаний підхід, але він показує, що ви можете покластись на цю оптимізацію як на запасний вихід. Буде більш адекватно винести її у окремий хук:

```js{4,16}
function Form() {
  const [text, updateText] = useState('');
  // Буде мемоізована навіть при зміні `text`:
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
    throw new Error('Неможливо викликати обробник події під час рендерингу.');
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

У будь-якому випадку, ми **не радимо використовувати цей підхід** і показуємо його тут лише для повноти документації. Натомість, надайте перевагу [уникненню передачі функцій зворотнього виклику глибоко вниз](#how-to-avoid-passing-callbacks-down).


## Деталі реалізації {#under-the-hood}

### Як React асоціює виклики хуків з компонентами? {#how-does-react-associate-hook-calls-with-components}

React відслідковує, який компонент рендериться у даний момент. Завдяки [правилам хуків](/docs/hooks-rules.html) ми знаємо, що хуки можуть викликатись лише з React-компонентів (чи користувацьких хуків, які теж викликаються лише з React-компонентів).

Існує внутрішній список "комірок пам'яті", пов'язаних з кожним компонентом. Вони є звичайними об'єктами JavaScript у яких ми можемо зберегти певні дані. Коли ви викликаєте хук на зразок `useState()`, він зчитує поточну комірку (чи ініціалізує її під час першого рендеру) і зсуває вказівник на наступну. Саме так різні виклики `useState()` отримують незалежний локальний стан.

### Що лежить в основі дизайну хуків? {#what-is-the-prior-art-for-hooks}

Хуки об'єднують у собі ідеї кількох різних концепцій:

* Наші старі експерименти з функціональними API у репозиторії [react-future](https://github.com/reactjs/react-future/tree/master/07%20-%20Returning%20State).
* Експерименти спільноти React з API рендер пропсів, включно з [Reactions Component](https://github.com/reactions/component) [Раяна Флоренса (Ryan Florence)](https://github.com/ryanflorence).
* Пропозиція [ключового слова `adopt`](https://gist.github.com/trueadm/17beb64288e30192f3aa29cad0218067), як синтаксичного цукру для рендер пропсів, запропонована [Домініком Ґенневеєм (Dominic Gannaway)](https://github.com/trueadm).
* Змінні стану і комірки стану в [DisplayScript](http://displayscript.org/introduction.html).
* [Компоненти-редюсери](https://reasonml.github.io/reason-react/docs/en/state-actions-reducer.html) у ReasonReact.
* [Підписки](http://reactivex.io/rxjs/class/es6/Subscription.js~Subscription.html) в Rx.
* [Алгебраїчні ефекти](https://github.com/ocamllabs/ocaml-effects-tutorial#2-effectful-computations-in-a-pure-setting) в Multicore OCaml.

[Себастьян Маркбоге (Sebastian Markbåge)](https://github.com/sebmarkbage) запропонував початковий дизайн хуків, який удосконалили [Ендрю Кларк (Andrew Clark)](https://github.com/acdlite), [Софі Алперт (Sophie Alpert)](https://github.com/sophiebits), [Домінік Ґенневей (Dominic Gannaway)](https://github.com/trueadm) та інші члени команди React.
