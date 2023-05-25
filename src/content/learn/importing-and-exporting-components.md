---
title: Імпорт та експорт компонентів
---

<Intro>

Магія компонентів полягає в їхньому повторному використанні: ви можете створювати компоненти, які складаються з інших компонентів. Але якщо ви вкладаєте все більше і більше компонентів, часто буває доцільно розділити їх на різні файли. Це дозволяє зберігати файли простими для розуміння та повторно використовувати компоненти в більшій кількості місць.

</Intro>

<YouWillLearn>

* Що таке файл кореневого компонента
* Як імпортувати та експортувати компонент
* Коли використовувати дефолтні та іменовані імпорти та експорти
* Як імпортувати та експортувати декілька компонентів з одного файлу
* Як розділити компоненти на декілька файлів

</YouWillLearn>

## Файл кореневого компонента {/*the-root-component-file*/}

У [Ваш перший компонент ](/learn/your-first-component), ви створили компонент `Profile` та компонент `Gallery`, який його відображає:

<Sandpack>

```js
function Profile() {
  return (
    <img
      src="https://i.imgur.com/MK3eW3As.jpg"
      alt="Кетерін Джонсон (Katherine Johnson)"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>Видатні вчені</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

Ці компоненти зараз знаходяться в **файлі кореневого компонента** з назвою `App.js` в цьому прикладі. У [Create React App](https://create-react-app.dev/) ваш додаток знаходиться в `src/App.js`. Залежно від вашої конфігурації, ваш кореневий компонент може бути у іншому файлі. Якщо ви використовуєте фреймворк з роутингом на основі файлів, такий як Next.js, ваш кореневий компонент буде різним для кожної сторінки.

## Експорт та імпорт компонента {/*exporting-and-importing-a-component*/}

Що, якщо ви захочете змінити стартовий екран у майбутньому і розмістити там список наукових книг? Або розмістити всі профілі десь інде? Розумно було б витягнути компоненти `Gallery` і `Profile` з файлу кореневого компоненту. Це зробить їх більш модульними та дасть можливість повторно використовувати їх в інших файлах. Ви можете перемістити компонент за три кроки:

1. **Створіть** новий JS файл, щоб помістити компоненти в нього.
2. **Експортуйте** ваш функціональний компонент з цього файлу (використовуючи або [дефолтний](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/export#using_the_default_export) або [іменований](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/export#using_named_exports) експорти).
3. **Імпортуйте** його в файл, де ви будете використовувати цей компонент (використовуючи відповідну техніку імпорту для [дефолтного](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/import#importing_defaults) або [іменованого](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/import#import_a_single_export_from_a_module) експортів).

Обидва компоненти `Profile` та `Gallery` були перенесені з `App.js` в новий файл під назвою `Gallery.js`. Тепер ви можете змінити `App.js`, щоб імпортувати `Gallery` з `Gallery.js`:

<Sandpack>

```js App.js
import Gallery from './Gallery.js';

export default function App() {
  return (
    <Gallery />
  );
}
```

```js Gallery.js
function Profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Алан Л. Гарт (Alan L. Hart)"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>Видатні вчені</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

Зверніть увагу, як цей приклад розбито на два файли компонентів:

1. `Gallery.js`:
     - Визначає компонент `Profile`, який використовується лише в межах цього ж файлу і не експортується.
     - Експортує компонент `Gallery` як **дефолтний експорт.**
2. `App.js`:
     - Імпортує `Gallery` як **дефолтний імпорт** з `Gallery.js`.
     - Експортує кореневий компонент `App` як **дефолтний експорт.**


<Note>

Можливо, ви зустрінете файли, які не мають розширення `.js`, як наприклад:

```js 
import Gallery from './Gallery';
```

Будь-який з варіантів, `'./Gallery.js'` або `'./Gallery'`, працюватиме з React, хоча перший варіант ближчий до того, як працюють [нативні ES модулі](https://developer.mozilla.org/docs/Web/JavaScript/Guide/Modules)

</Note>

<DeepDive>

#### Дефолтний експорт vs іменований {/*default-vs-named-exports*/}

Є два основних способи експортування значень у JavaScript: дефолтний та іменований експорти. До цього моменту в наших прикладах ми використовували тільки дефолтний експорт. Але ви можете використовувати один або обидва способи в тому ж файлі. **У файлі може бути не більше одного _дефолтного_ експорту, але можна мати стільки _іменованих_ експортів, скільки ви бажаєте.**

![Default and named exports](/images/docs/illustrations/i_import-export.svg)

Як ви експортуєте свій компонент, так вам потрібно його і імпортувати. Ви отримаєте помилку, якщо спробуєте імпортувати дефолтний експорт таким же чином, як й іменований експорт! Ця таблиця може допомогти вам зорієнтуватися:

| Синтаксис           | Вираз експорту                           | Вираз імпорту                          |
| -----------      | -----------                                | -----------                               |
| Дефолтний  | `export default function Button() {}` | `import Button from './Button.js';`     |
| Іменований    | `export function Button() {}`         | `import { Button } from './Button.js';` |

Коли ви робите _дефолтний_ імпорт, ви можете використовувати будь-яке ім'я, яке вам подобається після `import`. Наприклад, ви можете написати `import Banana from './Button.js'`, і ви все ще отримаєте той самий дефолтний експорт. Натомість, з іменованим імпортом ім'я повинно збігатися з обох боків. Тому вони називаються _іменованими_ імпортами!


**Люди часто використовують дефолтний експорт, якщо файл експортує тільки один компонент, і використовують іменований експорт, якщо файл експортує кілька компонентів та значень.** Незалежно від того, який стиль написання коду вам подобається, завжди давайте змістовні назви функціям компонентів та файлам, які їх містять. Компоненти без імен, наприклад, `export default () => {}`, не рекомендується використовувати, оскільки це ускладнює процес налагодження коду.

</DeepDive>

## Експорт та імпорт кількох компонентів з одного файлу {/*exporting-and-importing-multiple-components-from-the-same-file*/}

Що, якщо ви хочете показати лише один компонент `Profile`, а не галерею? Ви можете експортувати компонент `Profile` також. Але в `Gallery.js` вже є *дефолтний* експорт, і не можна мати _два_ дефолтних експорти. Ви можете створити новий файл з дефолтним експортом або додати іменований експорт для `Profile`. **Файл може мати тільки один дефолтний експорт, але може мати безліч іменованих експортів!**

<Note>

Для того, щоб зменшити можливість плутанини між дефолтним та іменованим експортом, деякі команди вибирають використання лише одного стилю (дефолтного або іменованого), або уникнення їх змішування в одному файлі. Робіть так, як вам зручно!

</Note>

Спочатку, **експортуйте** `Profile` з `Gallery.js`, використовуючи іменований експорт (без ключового слова `default`):

```js
export function Profile() {
  // ...
}
```

Потім, **імпортуйте** `Profile` з `Gallery.js` в `App.js`, використовуючи іменований імпорт (з фігурними дужками):

```js
import { Profile } from './Gallery.js';
```

Нарешті, **відрендеріть** компонент `<Profile />` з компоненту `App`:

```js
export default function App() {
  return <Profile />;
}
```


Тепер в `Gallery.js` знаходяться два експорти: дефолтний експорт `Gallery` та іменований експорт `Profile`. `App.js` імпортує їх обох. Спробуйте змінити `<Profile />` на `<Gallery />` та навпаки у цьому прикладі:

<Sandpack>

```js App.js
import Gallery from './Gallery.js';
import { Profile } from './Gallery.js';

export default function App() {
  return (
    <Profile />
  );
}
```

```js Gallery.js
export function Profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Алан Л. Гарт (Alan L. Hart)"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>Видатні вчені</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

Тепер ви використовуєте комбінацію дефолтного та іменованого експортів:

* `Gallery.js`:
  - Експортує компонент `Profile` як **іменований експорт з назвою `Profile`.**
  - Експортує компонент `Gallery` як **дефолтний експорт.**
* `App.js`:
  - Імпортує `Profile` як **іменований імпорт з назвою `Profile`** із `Gallery.js`.
  - Імпортує `Gallery` як **дефолтний імпорт** з `Gallery.js`.
  - Експортує кореневий компонент `App` як **дефолтний експорт.**

<Recap>

На цій сторінці ви дізналися:


* Що таке файл кореневого компонента
* Як імпортувати та експортувати компонент
* Коли і як використовувати дефолтні та іменовані імпорти та експорти
* Як імпортувати та експортувати декілька компонентів з одного файлу

</Recap>



<Challenges>

#### Розбити компоненти на менші частини {/*split-the-components-further*/}

Зараз `Gallery.js` експортує як `Profile`, так і `Gallery`, що дещо заплутує розуміння.

Перенесіть компонент `Profile` у окремий файл `Profile.js`, а потім змініть компонент `App` так, щоб він рендерив `<Profile />` та `<Gallery />` один за іншим.

Ви можете використовувати як дефолтний, так і іменований експорт для `Profile`, проте переконайтеся, що використовуєте відповідний синтаксис імпорту як в `App.js`, так і в `Gallery.js`! Ви можете скористатися таблицею з розділу про поглиблений аналіз вище:


| Синтаксис           | Вираз експорту                           | Вираз імпорту                          |
| -----------      | -----------                                | -----------                               |
| Дефолтний  | `export default function Button() {}` | `import Button from './Button.js';`     |
| Іменований    | `export function Button() {}`         | `import { Button } from './Button.js';` |

<Hint>

Не забудьте імпортувати свої компоненти там, де вони викликаються. Чи не використовує `Gallery` також `Profile`?

</Hint>

<Sandpack>

```js App.js
import Gallery from './Gallery.js';
import { Profile } from './Gallery.js';

export default function App() {
  return (
    <div>
      <Profile />
    </div>
  );
}
```

```js Gallery.js active
// Перенесіть мене у Profile.js!
export function Profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Алан Л. Гарт (Alan L. Hart)"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>Видатні вчені</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```js Profile.js
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

Після того, як зробите цей приклад робочим з одним типом експорту, зробіть це з іншим типом.

<Solution>

Це розв'язання з іменованими експортами:

<Sandpack>

```js App.js
import Gallery from './Gallery.js';
import { Profile } from './Profile.js';

export default function App() {
  return (
    <div>
      <Profile />
      <Gallery />
    </div>
  );
}
```

```js Gallery.js
import { Profile } from './Profile.js';

export default function Gallery() {
  return (
    <section>
      <h1>Видатні вчені</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```js Profile.js
export function Profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Алан Л. Гарт (Alan L. Hart)"
    />
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

Це розв'язання з дефолтними експортами:

<Sandpack>

```js App.js
import Gallery from './Gallery.js';
import Profile from './Profile.js';

export default function App() {
  return (
    <div>
      <Profile />
      <Gallery />
    </div>
  );
}
```

```js Gallery.js
import Profile from './Profile.js';

export default function Gallery() {
  return (
    <section>
      <h1>Видатні вчені</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```js Profile.js
export default function Profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Алан Л. Гарт (Alan L. Hart)"
    />
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

</Solution>

</Challenges>
