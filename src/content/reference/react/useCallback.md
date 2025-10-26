---
title: useCallback
---

<Intro>

`useCallback` це хук, який дозволяє кешувати визначення функції між повторними рендерами.

```js
const cachedFn = useCallback(fn, dependencies)
```

</Intro>

<Note>

[React Compiler](/learn/react-compiler) автоматично мемоізує значення та функції, зменшуючи потребу у ручних викликах `useCallback`. Ви можете використовувати компілятор, щоб автоматично керувати мемоізацією.
</Note>

<InlineToc />

---

## Опис {/*reference*/}

### `useCallback(fn, dependencies)` {/*usecallback*/}

Викличте `useCallback` на верхньому рівні компонента, щоб кешувати визначення функції між повторними рендерами:

```js {4,9}
import { useCallback } from 'react';

export default function ProductPage({ productId, referrer, theme }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]);
```

[Перегляньте більше прикладів нижче.](#usage)

#### Параметри {/*parameters*/}

* `fn`: Функція, яку ви хочете кешувати. Вона може приймати будь-які аргументи та повертати будь-які значення. React поверне (але не викличе!) вашу функцію під час початкового рендеру. При наступних рендерах React надасть вам ту саму функцію знову, якщо `dependencies` не змінилися з попереднього рендеру. Інакше він надасть вам функцію, яку ви передали під час поточного рендеру, і збереже її на випадок, якщо її можна буде використати пізніше. React не викличе вашу функцію. Функція повертається вам, щоб ви могли вирішити, коли і чи викликати її.

* `dependencies`: Список усіх реактивних значень, на які посилається код `fn`. Реактивні значення включають пропси, стан та всі змінні та функції, оголошені безпосередньо всередині тіла вашого компонента. Якщо ваш лінтер [налаштований для React](/learn/editor-setup#linting), він перевірить, що кожне реактивне значення правильно вказано як залежність. Список залежностей повинен мати постійну кількість елементів і бути написаним вбудованим способом, як `[dep1, dep2, dep3]`. React порівняє кожну залежність з її попереднім значенням, використовуючи алгоритм порівняння [`Object.is`](https://webdoky.org/uk/docs/Web/JavaScript/Reference/Global_Objects/Object/is).

#### Результат {/*returns*/}

При початковому рендері `useCallback` повертає функцію `fn`, яку ви передали.

При наступних рендерах він або поверне вже збережену функцію `fn` з попереднього рендеру (якщо залежності не змінилися), або поверне функцію `fn`, яку ви передали під час цього рендеру.

#### Застереження {/*caveats*/}

* `useCallback` — це хук, тому ви можете викликати його лише **на верхньому рівні вашого компонента** або ваших власних хуків. Ви не можете викликати його всередині циклів або умов. Якщо вам це потрібно, винесіть новий компонент і перенесіть стан до нього.
* React **не викине кешовану функцію, якщо немає конкретної причини для цього.** Наприклад, у режимі розробки React викидає кеш, коли ви редагуєте файл вашого компонента. Як у режимі розробки, так і в публічному середовищі React викине кеш, якщо ваш компонент призупиняється під час початкового монтування. У майбутньому React може додати більше функцій, які використовують переваги викидання кешу — наприклад, якщо React додасть вбудовану підтримку віртуалізованих списків у майбутньому, буде логічно викидати кеш для елементів, які прокручуються за межі віртуалізованого перегляду таблиці. Це повинно відповідати вашим очікуванням, якщо ви покладаєтеся на `useCallback` як на оптимізацію продуктивності. Інакше [змінна стану](/reference/react/useState#im-trying-to-set-state-to-a-function-but-it-gets-called-instead) або [реф](/reference/react/useRef#avoiding-recreating-the-ref-contents) можуть бути більш доречними.

---

## Використання {/*usage*/}

### Пропуск повторного рендеру компонентів {/*skipping-re-rendering-of-components*/}

Коли ви оптимізуєте продуктивність рендеру, іноді вам потрібно кешувати функції, які ви передаєте дочірнім компонентам. Спочатку подивимося на синтаксис того, як це зробити, а потім побачимо, у яких випадках це корисно.

Щоб кешувати функцію між повторними рендерами вашого компонента, обгорніть її визначення в хук `useCallback`:

```js [[3, 4, "handleSubmit"], [2, 9, "[productId, referrer]"]]
import { useCallback } from 'react';

function ProductPage({ productId, referrer, theme }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]);
  // ...
```

Вам потрібно передати дві речі до `useCallback`:

1. Визначення функції, яку ви хочете кешувати між повторними рендерами.
2. <CodeStep step={2}>Список залежностей</CodeStep>, включаючи кожне значення всередині вашого компонента, яке використовується всередині вашої функції.

При початковому рендері <CodeStep step={3}>повернена функція</CodeStep>, яку ви отримаєте від `useCallback`, буде функцією, яку ви передали.

При наступних рендерах React порівняє <CodeStep step={2}>залежності</CodeStep> з залежностями, які ви передали під час попереднього рендеру. Якщо жодна з залежностей не змінилася (порівняно з [`Object.is`](https://webdoky.org/uk/docs/Web/JavaScript/Reference/Global_Objects/Object/is)), `useCallback` поверне ту саму функцію, що й раніше. Інакше `useCallback` поверне функцію, яку ви передали під час *цього* рендеру.

Іншими словами, `useCallback` кешує функцію між повторними рендерами, поки її залежності не зміняться.

**Давайте розглянемо приклад, щоб побачити, коли це корисно.**

Скажімо, ви передаєте функцію `handleSubmit` з `ProductPage` до компонента `ShippingForm`:

```js {5}
function ProductPage({ productId, referrer, theme }) {
  // ...
  return (
    <div className={theme}>
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
```

Ви помітили, що перемикання пропа `theme` на мить заморожує застосунок, але якщо ви видалите `<ShippingForm />` з вашого JSX, він працює швидко. Це говорить вам, що варто спробувати оптимізувати компонент `ShippingForm`.

**За замовчуванням, коли компонент повторно рендериться, React повторно рендерить усіх його дочірніх компонентів рекурсивно.** Ось чому, коли `ProductPage` повторно рендериться з іншою `theme`, компонент `ShippingForm` *також* повторно рендериться. Це нормально для компонентів, які не потребують багато обчислень для повторного рендеру. Але якщо ви перевірили, що повторний рендер повільний, ви можете сказати `ShippingForm` пропустити повторний рендер, коли його пропси такі ж самі, як на попередньому рендері, обгорнувши його в [`memo`:](/reference/react/memo)

```js {3,5}
import { memo } from 'react';

const ShippingForm = memo(function ShippingForm({ onSubmit }) {
  // ...
});
```

**З цією зміною `ShippingForm` пропустить повторний рендер, якщо всі його пропси *такі ж самі*, як на попередньому рендері.** Ось коли кешування функції стає важливим! Скажімо, ви визначили `handleSubmit` без `useCallback`:

```js {2,3,8,12-13}
function ProductPage({ productId, referrer, theme }) {
  // Кожного разу, коли theme змінюється, це буде інша функція...
  function handleSubmit(orderDetails) {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }

  return (
    <div className={theme}>
      {/* ... тому пропси ShippingForm ніколи не будуть однаковими, і він буде повторно рендеритися кожного разу */}
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
}
```

**У JavaScript `function () {}` або `() => {}` завжди створює *іншу* функцію,** подібно до того, як літерал об'єкта `{}` завжди створює новий об'єкт. Зазвичай це не було б проблемою, але це означає, що пропси `ShippingForm` ніколи не будуть однаковими, і ваша оптимізація [`memo`](/reference/react/memo) не працюватиме. Ось де `useCallback` стає в нагоді:

```js {2,3,8,12-13}
function ProductPage({ productId, referrer, theme }) {
  // Скажіть React кешувати вашу функцію між повторними рендерами...
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]); // ...поки ці залежності не зміняться...

  return (
    <div className={theme}>
      {/* ...ShippingForm отримає ті ж самі пропси і зможе пропустити повторний рендер */}
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
}
```

**Обгорнувши `handleSubmit` в `useCallback`, ви гарантуєте, що це *та сама* функція між повторними рендерами** (поки залежності не зміняться). Ви не *зобов'язані* обгортати функцію в `useCallback`, якщо не робите це з якоїсь конкретної причини. У цьому прикладі причина в тому, що ви передаєте її компоненту, обгорнутому в [`memo`,](/reference/react/memo) і це дозволяє йому пропустити повторний рендер. Є інші причини, чому вам може знадобитися `useCallback`, які описані далі на цій сторінці.

<Note>

**Ви повинні покладатися на `useCallback` лише як на оптимізацію продуктивності.** Якщо ваш код не працює без нього, знайдіть основну проблему і виправте її спочатку. Потім ви можете додати `useCallback` назад.

</Note>

<DeepDive>

#### Як useCallback пов'язаний з useMemo? {/*how-is-usecallback-related-to-usememo*/}

Ви часто побачите [`useMemo`](/reference/react/useMemo) поруч з `useCallback`. Обидва корисні, коли ви намагаєтеся оптимізувати дочірній компонент. Вони дозволяють вам [мемоізувати](https://uk.wikipedia.org/wiki/%D0%9C%D0%B5%D0%BC%D0%BE%D1%96%D0%B7%D0%B0%D1%86%D1%96%D1%8F) (або, іншими словами, кешувати) щось, що ви передаєте вниз:

```js {6-8,10-15,19}
import { useMemo, useCallback } from 'react';

function ProductPage({ productId, referrer }) {
  const product = useData('/product/' + productId);

  const requirements = useMemo(() => { // Викликає вашу функцію і кешує її результат
    return computeRequirements(product);
  }, [product]);

  const handleSubmit = useCallback((orderDetails) => { // Кешує саму вашу функцію
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]);

  return (
    <div className={theme}>
      <ShippingForm requirements={requirements} onSubmit={handleSubmit} />
    </div>
  );
}
```

Різниця в тому, *що* вони дозволяють вам кешувати:

* **[`useMemo`](/reference/react/useMemo) кешує *результат* виклику вашої функції.** У цьому прикладі він кешує результат виклику `computeRequirements(product)`, тому що він не змінюється, поки `product` не зміниться. Це дозволяє вам передавати об'єкт `requirements` вниз без непотрібного повторного рендеру `ShippingForm`. Коли потрібно, React викличе функцію, яку ви передали під час рендеру, щоб обчислити результат.
* **`useCallback` кешує *саму функцію*.** На відміну від `useMemo`, він не викликає функцію, яку ви надаєте. Натомість він кешує функцію, яку ви надали, тому що `handleSubmit` *сама* не змінюється, поки `productId` або `referrer` не зміняться. Це дозволяє вам передавати функцію `handleSubmit` вниз без непотрібного повторного рендеру `ShippingForm`. Ваш код не виконається, поки користувач не відправить форму.

Якщо ви вже знайомі з [`useMemo`,](/reference/react/useMemo) вам може бути корисно думати про `useCallback` як про це:

```js {expectedErrors: {'react-compiler': [3]}}
// Спрощена реалізація (всередині React)
function useCallback(fn, dependencies) {
  return useMemo(() => fn, dependencies);
}
```

[Дізнайтеся більше про різницю між `useMemo` і `useCallback`.](/reference/react/useMemo#memoizing-a-function)

</DeepDive>

<DeepDive>

#### Чи слід додавати useCallback скрізь? {/*should-you-add-usecallback-everywhere*/}

Якщо ваш застосунок схожий на цей сайт, і більшість взаємодій грубі (як заміна сторінки або цілого розділу), мемоізація зазвичай не потрібна. З іншого боку, якщо ваш застосунок більше схожий на редактор малюнків, і більшість взаємодій детальні (як переміщення фігур), тоді ви можете знайти мемоізацію дуже корисною.

Кешування функції з `useCallback` цінне лише в кількох випадках:

- Ви передаєте її як проп компоненту, обгорнутому в [`memo`.](/reference/react/memo) Ви хочете пропустити повторний рендер, якщо значення не змінилося. Мемоізація дозволяє вашому компоненту повторно рендеритися лише якщо залежності змінилися.
- Функція, яку ви передаєте, пізніше використовується як залежність якогось хука. Наприклад, інша функція, обгорнута в `useCallback`, залежить від неї, або ви залежите від цієї функції в [`useEffect`.](/reference/react/useEffect)

Немає переваг від обгортання функції в `useCallback` в інших випадках. Немає також значної шкоди від цього, тому деякі команди вибирають не думати про окремі випадки і мемоізують якнайбільше. Недолік у тому, що код стає менш читабельним. Також не вся мемоізація ефективна: одне значення, яке "завжди нове", достатньо, щоб зламати мемоізацію для всього компонента.

Зауважте, що `useCallback` не запобігає *створенню* функції. Ви завжди створюєте функцію (і це нормально!), але React ігнорує її і повертає вам кешовану функцію, якщо нічого не змінилося.

**На практиці ви можете зробити багато мемоізації непотрібною, дотримуючись кількох принципів:**

1. Коли компонент візуально обгортає інші компоненти, дозвольте йому [приймати JSX як дочірні елементи.](/learn/passing-props-to-a-component#passing-jsx-as-children) Тоді, якщо компонент-обгортка оновлює свій власний стан, React знає, що його дочірні елементи не потребують повторного рендеру.
2. Віддавайте перевагу локальному стану і не [піднімайте стан](/learn/sharing-state-between-components) далі, ніж потрібно. Не зберігайте тимчасовий стан, як форми і чи наведено курсор на елемент, на верхньому рівні вашого дерева або в глобальній бібліотеці стану.
3. Тримайте вашу [логіку рендеру чистою.](/learn/keeping-components-pure) Якщо повторний рендер компонента викликає проблему або створює якийсь помітний візуальний артефакт, це помилка у вашому компоненті! Виправте помилку замість додавання мемоізації.
4. Уникайте [непотрібних ефектів, які оновлюють стан.](/learn/you-might-not-need-an-effect) Більшість проблем з продуктивністю в React застосунках викликані ланцюжками оновлень, що походять від ефектів, які змушують ваші компоненти рендеритися знову і знову.
5. Намагайтеся [видалити непотрібні залежності з ваших ефектів.](/learn/removing-effect-dependencies) Наприклад, замість мемоізації часто простіше перемістити якийсь об'єкт або функцію всередину ефекту або поза компонент.

Якщо конкретна взаємодія все ще здається повільною, [використовуйте профайлер інструментів розробника React](https://legacy.reactjs.org/blog/2018/09/10/introducing-the-react-profiler.html), щоб побачити, які компоненти отримують найбільшу користь від мемоізації, і додайте мемоізацію там, де потрібно. Ці принципи роблять ваші компоненти легшими для налагодження і розуміння, тому добре дотримуватися їх у будь-якому випадку. У довгостроковій перспективі ми досліджуємо [автоматичну мемоізацію](https://www.youtube.com/watch?v=lGEMwh32soc), щоб вирішити це раз і назавжди.

</DeepDive>

<Recipes titleText="Різниця між useCallback і прямим оголошенням функції" titleId="examples-rerendering">

#### Пропуск повторного рендеру з `useCallback` і `memo` {/*skipping-re-rendering-with-usecallback-and-memo*/}

У цьому прикладі компонент `ShippingForm` **штучно сповільнений**, щоб ви могли побачити, що відбувається, коли React компонент, який ви рендерите, справді повільний. Спробуйте збільшити лічильник і перемкнути тему.

Збільшення лічильника здається повільним, тому що воно змушує сповільнений `ShippingForm` повторно рендеритися. Це очікувано, тому що лічильник змінився, і тому вам потрібно відобразити новий вибір користувача на екрані.

Далі спробуйте перемкнути тему. **Завдяки `useCallback` разом з [`memo`](/reference/react/memo), це швидко, незважаючи на штучне сповільнення!** `ShippingForm` пропустив повторний рендер, тому що функція `handleSubmit` не змінилася. Функція `handleSubmit` не змінилася, тому що і `productId`, і `referrer` (ваші залежності `useCallback`) не змінилися з попереднього рендеру.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ProductPage from './ProductPage.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Темний режим
      </label>
      <hr />
      <ProductPage
        referrerId="wizard_of_oz"
        productId={123}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js src/ProductPage.js active
import { useCallback } from 'react';
import ShippingForm from './ShippingForm.js';

export default function ProductPage({ productId, referrer, theme }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]);

  return (
    <div className={theme}>
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
}

function post(url, data) {
  // Уявімо, що це надсилає запит....
  console.log('POST /' + url);
  console.log(data);
}
```

```js {expectedErrors: {'react-compiler': [7, 8]}} src/ShippingForm.js
import { memo, useState } from 'react';

const ShippingForm = memo(function ShippingForm({ onSubmit }) {
  const [count, setCount] = useState(1);

  console.log('[ШТУЧНО СПОВІЛЬНЕНО] Рендер <ShippingForm />');
  let startTime = performance.now();
  while (performance.now() - startTime < 500) {
    // Нічого не робити 500 мс, щоб імітувати надзвичайно повільний код
  }

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const orderDetails = {
      ...Object.fromEntries(formData),
      count
    };
    onSubmit(orderDetails);
  }

  return (
    <form onSubmit={handleSubmit}>
      <p><b>Примітка: <code>ShippingForm</code> штучно сповільнений!</b></p>
      <label>
        Кількість елементів:
        <button type="button" onClick={() => setCount(count - 1)}>–</button>
        {count}
        <button type="button" onClick={() => setCount(count + 1)}>+</button>
      </label>
      <label>
        Вулиця:
        <input name="street" />
      </label>
      <label>
        Місто:
        <input name="city" />
      </label>
      <label>
        Поштовий індекс:
        <input name="zipCode" />
      </label>
      <button type="submit">Відправити</button>
    </form>
  );
});

export default ShippingForm;
```

```css
label {
  display: block; margin-top: 10px;
}

input {
  margin-left: 5px;
}

button[type="button"] {
  margin: 5px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>

<Solution />

#### Завжди повторно рендерити компонент {/*always-re-rendering-a-component*/}

У цьому прикладі реалізація `ShippingForm` також **штучно сповільнена**, щоб ви могли побачити, що відбувається, коли якийсь React компонент, який ви рендерите, справді повільний. Спробуйте збільшити лічильник і перемкнути тему.

На відміну від попереднього прикладу, перемикання теми тепер також повільне! Це тому, що **в цій версії немає виклику `useCallback`**, тому `handleSubmit` завжди нова функція, і сповільнений компонент `ShippingForm` не може пропустити повторний рендер.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ProductPage from './ProductPage.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Темний режим
      </label>
      <hr />
      <ProductPage
        referrerId="wizard_of_oz"
        productId={123}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js src/ProductPage.js active
import ShippingForm from './ShippingForm.js';

export default function ProductPage({ productId, referrer, theme }) {
  function handleSubmit(orderDetails) {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }

  return (
    <div className={theme}>
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
}

function post(url, data) {
  // Уявімо, що це надсилає запит...
  console.log('POST /' + url);
  console.log(data);
}
```

```js {expectedErrors: {'react-compiler': [7, 8]}} src/ShippingForm.js
import { memo, useState } from 'react';

const ShippingForm = memo(function ShippingForm({ onSubmit }) {
  const [count, setCount] = useState(1);

  console.log('[ШТУЧНО СПОВІЛЬНЕНО] Рендер <ShippingForm />');
  let startTime = performance.now();
  while (performance.now() - startTime < 500) {
    // Нічого не робити 500 мс, щоб імітувати надзвичайно повільний код
  }

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const orderDetails = {
      ...Object.fromEntries(formData),
      count
    };
    onSubmit(orderDetails);
  }

  return (
    <form onSubmit={handleSubmit}>
      <p><b>Примітка: <code>ShippingForm</code> штучно сповільнений!</b></p>
      <label>
        Кількість елементів:
        <button type="button" onClick={() => setCount(count - 1)}>–</button>
        {count}
        <button type="button" onClick={() => setCount(count + 1)}>+</button>
      </label>
      <label>
        Вулиця:
        <input name="street" />
      </label>
      <label>
        Місто:
        <input name="city" />
      </label>
      <label>
        Поштовий індекс:
        <input name="zipCode" />
      </label>
      <button type="submit">Відправити</button>
    </form>
  );
});

export default ShippingForm;
```

```css
label {
  display: block; margin-top: 10px;
}

input {
  margin-left: 5px;
}

button[type="button"] {
  margin: 5px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>


Однак ось той самий код **з видаленим штучним сповільненням.** Чи відчувається відсутність `useCallback` помітною чи ні?

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ProductPage from './ProductPage.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Темний режим
      </label>
      <hr />
      <ProductPage
        referrerId="wizard_of_oz"
        productId={123}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js src/ProductPage.js active
import ShippingForm from './ShippingForm.js';

export default function ProductPage({ productId, referrer, theme }) {
  function handleSubmit(orderDetails) {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }

  return (
    <div className={theme}>
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
}

function post(url, data) {
  // Уявімо, що це надсилає запит...
  console.log('POST /' + url);
  console.log(data);
}
```

```js src/ShippingForm.js
import { memo, useState } from 'react';

const ShippingForm = memo(function ShippingForm({ onSubmit }) {
  const [count, setCount] = useState(1);

  console.log('Рендер <ShippingForm />');

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const orderDetails = {
      ...Object.fromEntries(formData),
      count
    };
    onSubmit(orderDetails);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Кількість елементів:
        <button type="button" onClick={() => setCount(count - 1)}>–</button>
        {count}
        <button type="button" onClick={() => setCount(count + 1)}>+</button>
      </label>
      <label>
        Вулиця:
        <input name="street" />
      </label>
      <label>
        Місто:
        <input name="city" />
      </label>
      <label>
        Поштовий індекс:
        <input name="zipCode" />
      </label>
      <button type="submit">Відправити</button>
    </form>
  );
});

export default ShippingForm;
```

```css
label {
  display: block; margin-top: 10px;
}

input {
  margin-left: 5px;
}

button[type="button"] {
  margin: 5px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>


Досить часто код без мемоізації працює добре. Якщо ваші взаємодії досить швидкі, вам не потрібна мемоізація.

Пам'ятайте, що вам потрібно запустити React у режимі публічного середовища, вимкнути [інструменти розробника React](/learn/react-developer-tools) і використовувати пристрої, схожі на ті, які мають користувачі вашого застосунку, щоб отримати реалістичне уявлення про те, що насправді сповільнює ваш застосунок.

<Solution />

</Recipes>

---

### Оновлення стану з мемоізованого колбека {/*updating-state-from-a-memoized-callback*/}

Іноді вам може знадобитися оновити стан на основі попереднього стану з мемоізованого колбека.

Ця функція `handleAddTodo` вказує `todos` як залежність, тому що вона обчислює наступні todos з неї:

```js {6,7}
function TodoList() {
  const [todos, setTodos] = useState([]);

  const handleAddTodo = useCallback((text) => {
    const newTodo = { id: nextId++, text };
    setTodos([...todos, newTodo]);
  }, [todos]);
  // ...
```

Зазвичай ви хочете, щоб мемоізовані функції мали якомога менше залежностей. Коли ви читаєте якийсь стан лише для обчислення наступного стану, ви можете видалити цю залежність, передавши [функцію оновлення](/reference/react/useState#updating-state-based-on-the-previous-state) замість цього:

```js {6,7}
function TodoList() {
  const [todos, setTodos] = useState([]);

  const handleAddTodo = useCallback((text) => {
    const newTodo = { id: nextId++, text };
    setTodos(todos => [...todos, newTodo]);
  }, []); // ✅ Немає потреби в залежності todos
  // ...
```

Тут замість того, щоб робити `todos` залежністю і читати її всередині, ви передаєте інструкцію про те, *як* оновити стан (`todos => [...todos, newTodo]`) до React. [Дізнайтеся більше про функції оновлення.](/reference/react/useState#updating-state-based-on-the-previous-state)

---

### Запобігання занадто частим спрацюванням ефекту {/*preventing-an-effect-from-firing-too-often*/}

Іноді вам може знадобитися викликати функцію зсередини [eфекту:](/learn/synchronizing-with-effects)

```js {4-9,12}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  function createOptions() {
    return {
      serverUrl: 'https://localhost:1234',
      roomId: roomId
    };
  }

  useEffect(() => {
    const options = createOptions();
    const connection = createConnection(options);
    connection.connect();
    // ...
```

Це створює проблему. [Кожне реактивне значення повинно бути оголошено як залежність вашого ефекту.](/learn/lifecycle-of-reactive-effects#react-verifies-that-you-specified-every-reactive-value-as-a-dependency) Однак, якщо ви оголосите `createOptions` як залежність, це змусить ваш ефект постійно перепідключатися до чат-кімнати:


```js {6}
  useEffect(() => {
    const options = createOptions();
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [createOptions]); // 🔴 Проблема: ця залежність змінюється під час кожного рендера
  // ...
```

Щоб вирішити це, ви можете обгорнути функцію, яку вам потрібно викликати з ефекту, в `useCallback`:

```js {4-9,16}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  const createOptions = useCallback(() => {
    return {
      serverUrl: 'https://localhost:1234',
      roomId: roomId
    };
  }, [roomId]); // ✅ Змінюється лише тоді, коли змінюється roomId

  useEffect(() => {
    const options = createOptions();
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [createOptions]); // ✅ Змінюється лише тоді, коли змінюється createOptions
  // ...
```

Це гарантує, що функція `createOptions` однакова між повторними рендерами, якщо `roomId` однаковий. **Однак ще краще видалити потребу в залежності функції.** Перемістіть вашу функцію *всередину* ефекту:

```js {5-10,16}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    function createOptions() { // ✅ Немає потреби в useCallback або залежностях функції!
      return {
        serverUrl: 'https://localhost:1234',
        roomId: roomId
      };
    }

    const options = createOptions();
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ Змінюється лише тоді, коли змінюється roomId
  // ...
```

Тепер ваш код простіший і не потребує `useCallback`. [Дізнайтеся більше про видалення залежностей ефекту.](/learn/removing-effect-dependencies#move-dynamic-objects-and-functions-inside-your-effect)

---

### Оптимізація власного хука {/*optimizing-a-custom-hook*/}

Якщо ви пишете [власний хук,](/learn/reusing-logic-with-custom-hooks) рекомендується обгорнути будь-які функції, які він повертає, в `useCallback`:

```js {4-6,8-10}
function useRouter() {
  const { dispatch } = useContext(RouterStateContext);

  const navigate = useCallback((url) => {
    dispatch({ type: 'navigate', url });
  }, [dispatch]);

  const goBack = useCallback(() => {
    dispatch({ type: 'back' });
  }, [dispatch]);

  return {
    navigate,
    goBack,
  };
}
```

Це гарантує, що споживачі вашого хука можуть оптимізувати свій власний код, коли потрібно.

---

## Налагодження {/*troubleshooting*/}

### Кожного разу, коли мій компонент рендериться, `useCallback` повертає іншу функцію {/*every-time-my-component-renders-usecallback-returns-a-different-function*/}

Переконайтеся, що ви вказали масив залежностей як другий аргумент!

Якщо ви забудете масив залежностей, `useCallback` поверне нову функцію кожного разу:

```js {7}
function ProductPage({ productId, referrer }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }); // 🔴 Повертає нову функцію кожного разу: немає масиву залежностей
  // ...
```

Ось виправлена версія, що передає масив залежностей як другий аргумент:

```js {7}
function ProductPage({ productId, referrer }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]); // ✅ Не повертає нову функцію без потреби
  // ...
```

Якщо це не допомагає, то проблема в тому, що принаймні одна з ваших залежностей відрізняється від попереднього рендеру. Ви можете налагодити цю проблему, вручну виводячи ваші залежності в консоль:

```js {5}
  const handleSubmit = useCallback((orderDetails) => {
    // ..
  }, [productId, referrer]);

  console.log([productId, referrer]);
```

Потім ви можете натиснути правою кнопкою миші на масиви з різних повторних рендерів у консолі і вибрати "Store as a global variable" для обох з них. Припускаючи, що перший збережено як `temp1`, а другий як `temp2`, ви можете використовувати консоль браузера, щоб перевірити, чи кожна залежність в обох масивах однакова:

```js
Object.is(temp1[0], temp2[0]); // Чи перша залежність однакова між масивами?
Object.is(temp1[1], temp2[1]); // Чи друга залежність однакова між масивами?
Object.is(temp1[2], temp2[2]); // ... і так далі для кожної залежності ...
```

Коли ви знайдете, яка залежність ламає мемоізацію, або знайдіть спосіб видалити її, або [мемоізуйте її також.](/reference/react/useMemo#memoizing-a-dependency-of-another-hook)

---

### Мені потрібно викликати `useCallback` для кожного елемента списку в циклі, але це не дозволено {/*i-need-to-call-usememo-for-each-list-item-in-a-loop-but-its-not-allowed*/}

Припустимо, компонент `Chart` обгорнутий в [`memo`](/reference/react/memo). Ви хочете пропустити повторний рендер кожного `Chart` у списку, коли компонент `ReportList` повторно рендериться. Однак ви не можете викликати `useCallback` в циклі:

```js {expectedErrors: {'react-compiler': [6]}} {5-14}
function ReportList({ items }) {
  return (
    <article>
      {items.map(item => {
        // 🔴 Ви не можете викликати useCallback в циклі таким чином:
        const handleClick = useCallback(() => {
          sendReport(item)
        }, [item]);

        return (
          <figure key={item.id}>
            <Chart onClick={handleClick} />
          </figure>
        );
      })}
    </article>
  );
}
```

Замість цього винесіть компонент для окремого елемента і помістіть `useCallback` туди:

```js {5,12-21}
function ReportList({ items }) {
  return (
    <article>
      {items.map(item =>
        <Report key={item.id} item={item} />
      )}
    </article>
  );
}

function Report({ item }) {
  // ✅ Викликайте useCallback на верхньому рівні:
  const handleClick = useCallback(() => {
    sendReport(item)
  }, [item]);

  return (
    <figure>
      <Chart onClick={handleClick} />
    </figure>
  );
}
```

Альтернативно, ви можете видалити `useCallback` в останньому фрагменті і замість цього обгорнути сам `Report` в [`memo`.](/reference/react/memo) Якщо проп `item` не змінюється, `Report` пропустить повторний рендер, тому `Chart` також пропустить повторний рендер:

```js {5,6-8,15}
function ReportList({ items }) {
  // ...
}

const Report = memo(function Report({ item }) {
  function handleClick() {
    sendReport(item);
  }

  return (
    <figure>
      <Chart onClick={handleClick} />
    </figure>
  );
});
```
