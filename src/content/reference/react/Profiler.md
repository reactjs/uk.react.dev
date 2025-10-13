---
title: <Profiler>
---

<Intro>

`<Profiler>` дає вам змогу програмно вимірювати продуктивність рендеру React-дерева.

```js
<Profiler id="App" onRender={onRender}>
  <App />
</Profiler>
```

</Intro>

<InlineToc />

---

## Опис {/*reference*/}

### `<Profiler>` {/*profiler*/}

Обгорніть дерево компонентів у `<Profiler>`, щоб виміряти продуктивність його рендеру.

```js
<Profiler id="App" onRender={onRender}>
  <App />
</Profiler>
```

#### Пропси {/*props*/}

* `id`: Стрічковий ідентифікатор тієї частини UI, продуктивність якої ви вимірюєте.
* `onRender`: [Функція зворотного виклику `onRender`](#onrender-callback), яку React викликає щоразу, коли компоненти всередині профільованого дерева оновлюються. Вона отримує інформацію про те, що було відрендерено і скільки часу це зайняло.

#### Застереження {/*caveats*/}

<<<<<<< HEAD
* Профілювання створює додаткове навантаження, тому **початково воно вимкнене у збірці для впровадження (production).** Щоб профілювати у публічному середовищі, потрібно скористатися [спеціальною збіркою для впровадження з увімкненим профілюванням.](https://fb.me/react-profiling)
=======
* Profiling adds some additional overhead, so **it is disabled in the production build by default.** To opt into production profiling, you need to enable a [special production build with profiling enabled.](/reference/dev-tools/react-performance-tracks#using-profiling-builds)
>>>>>>> 0d05d9b6ef0f115ec0b96a2726ab0699a9ebafe1

---

### Функція зворотного виклику `onRender` {/*onrender-callback*/}

React викличе вашу функцію зворотного виклику `onRender` з інформацією про те, що було відрендерено.

```js
function onRender(id, phase, actualDuration, baseDuration, startTime, commitTime) {
  // Зберіть або виведіть дані про тривалість рендеру...
}
```

#### Параметри {/*onrender-parameters*/}

* `id`: Стрічковий проп `id` дерева `<Profiler>`, яке щойно було внесено (committed). Він дає вам змогу визначити, яку саме частину дерева було внесено, якщо ви використовуєте кілька профілювачів.
* `phase`: `"mount"`, `"update"` або `"nested-update"`. Дає змогу дізнатися, чи дерево було щойно змонтовано вперше або ж рендерено повторно через зміни в стані, пропсах чи хуках.
* `actualDuration`: Кількість мілісекунд, витрачених на рендеринг компонента `<Profiler>` і його дочірніх компонентів під час поточного оновлення. Вказує на те, наскільки ефективно піддерево використовує мемоїзацію (наприклад, [`memo`](/reference/react/memo) і [`useMemo`](/reference/react/useMemo)). В ідеалі, це значення повинно значно зменшитися після першого монтування, оскільки багато з дочірніх компонентів буде перерендерюватися лише за зміни пропсів.
* `baseDuration`: Кількість мілісекунд, яка відображає, скільки часу займе повторний рендер усього піддерева компонента `<Profiler>` без будь-якої оптимізації. Це значення розраховується як сума часу останніх рендерів кожного компонента в дереві. Воно показує найгірший сценарій рендерингу (наприклад, перше монтування або дерево без мемоїзації). Порівняйте `actualDuration` з ним, щоби перевірити, чи працює мемоїзація.
* `startTime`: Числове значення, яке вказує на момент часу, коли React почав рендеринг поточного оновлення.
* `commitTime`: Числове значення, яке вказує на момент часу, коли React вніс поточне оновлення. Це значення однакове в усіх профілювачів у коміті, що дає змогу згрупувати їх за потреби.

---

## Використання {/*usage*/}

### Програмне вимірювання продуктивності рендерингу {/*measuring-rendering-performance-programmatically*/}

Обгорніть компонент `<Profiler>` навколо React-дерева, щоб визначити продуктивність його рендеру.

```js {2,4}
<App>
  <Profiler id="Sidebar" onRender={onRender}>
    <Sidebar />
  </Profiler>
  <PageContent />
</App>
```

Він потребує двох пропсів: `id` (стрічка) і функцію зворотного виклику `onRender`, яку React викличе, коли будь-який компонент всередині дерева "закомітить" (внесе) оновлення.

<Pitfall>

<<<<<<< HEAD
* Профілювання створює додаткове навантаження, тому **початково воно вимкнене у збірці для впровадження (production).** Щоб профілювати у публічному середовищі, потрібно скористатися [спеціальною збіркою для впровадження з увімкненим профілюванням.](https://fb.me/react-profiling)
=======
Profiling adds some additional overhead, so **it is disabled in the production build by default.** To opt into production profiling, you need to enable a [special production build with profiling enabled.](/reference/dev-tools/react-performance-tracks#using-profiling-builds)
>>>>>>> 0d05d9b6ef0f115ec0b96a2726ab0699a9ebafe1

</Pitfall>

<Note>

`<Profiler>` дає вам змогу збирати показники програмно. Якщо ви шукаєте інтерактивний профілювач, спробуйте вкладку Profiler в [Інструментах React розробника](/learn/react-developer-tools). Вона надає подібний функціонал як розширення для браузера.

Components wrapped in `<Profiler>` will also be marked in the [Component tracks](/reference/dev-tools/react-performance-tracks#components) of React Performance tracks even in profiling builds.
In development builds, all components are marked in the Components track regardless of whether they're wrapped in `<Profiler>`.

</Note>

---

### Вимірювання продуктивності різних частин застосунку {/*measuring-different-parts-of-the-application*/}

Ви можете використовувати кілька компонентів `<Profiler>`, щоб виміряти продуктивність різних частин вашого застосунку:

```js {5,7}
<App>
  <Profiler id="Sidebar" onRender={onRender}>
    <Sidebar />
  </Profiler>
  <Profiler id="Content" onRender={onRender}>
    <Content />
  </Profiler>
</App>
```

Ви також можете вкладувати компоненти `<Profiler>`:

```js {5,7,9,12}
<App>
  <Profiler id="Sidebar" onRender={onRender}>
    <Sidebar />
  </Profiler>
  <Profiler id="Content" onRender={onRender}>
    <Content>
      <Profiler id="Editor" onRender={onRender}>
        <Editor />
      </Profiler>
      <Preview />
    </Content>
  </Profiler>
</App>
```

Хоча `<Profiler>` є легким компонентом, його слід використовувати лише за необхідності. Кожне його використання додає певне навантаження на CPU та пам'ять вашого застосунку.

---

