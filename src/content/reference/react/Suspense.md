---
title: <Suspense>
---

<Intro>

`<Suspense>` дає вам змогу відображати запасний варіант (fallback), доки його дочірні компоненти не завершать завантаження.


```js
<Suspense fallback={<Loading />}>
  <SomeComponent />
</Suspense>
```

</Intro>

<InlineToc />

---

## Опис {/*reference*/}

### `<Suspense>` {/*suspense*/}

#### Пропси {/*props*/}
* `children`: Очікуваний UI, який ви хочете відрендерити. Якщо `children` затримується (suspends) під час рендерингу, межа (boundary) Suspense перемкнеться на рендер `fallback`.
* `fallback`: Альтернативний UI, який рендериться замість очікуваного UI, якщо той ще не завершив завантаження. Проп приймає будь-який валідний React-вузол, хоча на практиці запасний варіант є невеличким елементом для заповнення області перегляду, як-от спінер чи скелетон. Suspense автоматично перемкнеться на `fallback`, коли `children` затримується, і назад на `children`, коли дані будуть готові. Якщо `fallback` затримується під час рендеру, найближча батьківська межа Suspense буде активована.

#### Застереження {/*caveats*/}

- React не зберігає жодного стану для рендерів, затриманих до першого монтування (mount). Коли компонент завантажиться, React ще раз спробує відрендерити затримане дерево компонентів із нуля.
- Якщо Suspense відображав вміст, але затримався повторно, `fallback` буде відображено знову, за винятком випадків, коли оновлення, яке це спричинило, зумовлене функціями [`startTransition`](/reference/react/startTransition) або [`useDeferredValue`](/reference/react/useDeferredValue).
- Якщо React потрібно сховати вже видимий вміст через повторну затримку, він скине [ефекти макета](/reference/react/useLayoutEffect) в дереві компонентів. Коли вміст буде знову готовий до показу, React викличе ефекти макета знову. Це запевняє, що ефекти, які проводять виміри DOM-макета, не намагатимуться робити цього, доки вміст прихований.
- React має вбудовані оптимізації інтегровані в Suspense, як-от *Потоковий рендеринг на стороні сервера* і *Вибіркову гідрацію*. Прочитайте [архітектурний огляд](https://github.com/reactwg/react-18/discussions/37) і подивіться [технічну доповідь](https://www.youtube.com/watch?v=pj5N-Khihgc), щоб дізнатися більше.

---

## Використання {/*usage*/}

### Відображення запасного варіанту під час завантаження вмісту {/*displaying-a-fallback-while-content-is-loading*/}

Ви можете загорнути будь-яку частину вашого застосунку в межу Suspense:

```js [[1, 1, "<Loading />"], [2, 2, "<Albums />"]]
<Suspense fallback={<Loading />}>
  <Albums />
</Suspense>
```

React відображатиме ваш <CodeStep step={1}>запасний варіант завантаження</CodeStep>, доки всесь код та дані, які потребує <CodeStep step={2}>дочірній компонент</CodeStep>, не будуть завантажені.

У прикладі вище, компонент `Albums` *затримується* під час отримання списку альбомів. Доки він не буде готовим до рендеру, React переключиться на найближчу межу Suspense вверху дерева, щоб показати запасний варіант - ваш компонент `Loading`. Коли дані завантажаться, React сховає запасний варіант `Loading` і відрендерить компонент `Albums` з даними.

<Sandpack>

```js src/App.js hidden
import { useState } from 'react';
import ArtistPage from './ArtistPage.js';

export default function App() {
  const [show, setShow] = useState(false);
  if (show) {
    return (
      <ArtistPage
        artist={{
          id: 'the-beatles',
          name: 'The Beatles',
        }}
      />
    );
  } else {
    return (
      <button onClick={() => setShow(true)}>
        Відкрити сторінку виконавця The Beatles
      </button>
    );
  }
}
```

```js src/ArtistPage.js active
import { Suspense } from 'react';
import Albums from './Albums.js';

export default function ArtistPage({ artist }) {
  return (
    <>
      <h1>{artist.name}</h1>
      <Suspense fallback={<Loading />}>
        <Albums artistId={artist.id} />
      </Suspense>
    </>
  );
}

function Loading() {
  return <h2>🌀 Завантаження...</h2>;
}
```

```js src/Albums.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function Albums({ artistId }) {
  const albums = use(fetchData(`/${artistId}/albums`));
  return (
    <ul>
      {albums.map(album => (
        <li key={album.id}>
          {album.title} ({album.year})
        </li>
      ))}
    </ul>
  );
}
```

```js src/data.js hidden
// Примітка: те, як ви будете отримувати дані, залежить
// від фреймворку, який ви використовуєте разом із Suspense.
// Зазвичай логіка кешування буде всередині фреймворку.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url === '/the-beatles/albums') {
    return await getAlbums();
  } else {
    throw Error('Not implemented');
  }
}

async function getAlbums() {
  // Додаємо штучну затримку, щоб очікування було помітним.
  await new Promise(resolve => {
    setTimeout(resolve, 3000);
  });

  return [{
    id: 13,
    title: 'Let It Be',
    year: 1970
  }, {
    id: 12,
    title: 'Abbey Road',
    year: 1969
  }, {
    id: 11,
    title: 'Yellow Submarine',
    year: 1969
  }, {
    id: 10,
    title: 'The Beatles',
    year: 1968
  }, {
    id: 9,
    title: 'Magical Mystery Tour',
    year: 1967
  }, {
    id: 8,
    title: 'Sgt. Pepper\'s Lonely Hearts Club Band',
    year: 1967
  }, {
    id: 7,
    title: 'Revolver',
    year: 1966
  }, {
    id: 6,
    title: 'Rubber Soul',
    year: 1965
  }, {
    id: 5,
    title: 'Help!',
    year: 1965
  }, {
    id: 4,
    title: 'Beatles For Sale',
    year: 1964
  }, {
    id: 3,
    title: 'A Hard Day\'s Night',
    year: 1964
  }, {
    id: 2,
    title: 'With The Beatles',
    year: 1963
  }, {
    id: 1,
    title: 'Please Please Me',
    year: 1963
  }];
}
```

</Sandpack>

<Note>

**Тільки джерела даних із підтримкою Suspense активують компонент Suspense.** Вони включають:

-Отримання даних із фреймворками, що підтримують Suspense, наприклад, [Relay](https://relay.dev/docs/guided-tour/rendering/loading-states/) та [Next.js](https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming#streaming-with-suspense)
- Компоненти з відкладеним завантаженням, які використовують [`lazy`](/reference/react/lazy)
- Зчитування значення кешованого Promise з [`use`](/reference/react/use)

Suspense **не** реагує, коли дані отримуються всередині ефекта чи обробника подій.

Спосіб, у який ви будете отримувати дані в компоненті `Albums`, наведеному вище, залежить від вашого фреймоворку. Якщо ви використовуєте фреймворк із підтримкою Suspense, ви знайдете деталі в його документації щодо отримання даних.

Отримання даних із Suspense, але без використання фреймворку, наразі не підтримується. Вимоги до реалізації джерела даних із підтримкою Suspense нестабільні й незадокументовані. Офіційний API для інтеграції джерел даних та Suspense буде випущено в майбутній версії React. 

</Note>

---

### Одночасне відображення всього вмісту {/*revealing-content-together-at-once*/}

Початково, усе дерево всередині Suspense сприймається як один компонент. Для прикладу, навіть якщо *тільки один* із цих компонентів затримується, очікуючи на дані, *всі* з них буде замінено на індикатор завантаження:

```js {2-5}
<Suspense fallback={<Loading />}>
  <Biography />
  <Panel>
    <Albums />
  </Panel>
</Suspense>
```

Коли всі з них будуть готові до відображення, вони зв'являться всі разом в один момент.

У прикладі нижче, обидва компоненти `Biography` і `Albums` отримують якісь дані. Проте, через те що вони згруповані всередині одної межі Suspense, ці компоненти завжди "вискакуватимуть" одночасно.

<Sandpack>

```js src/App.js hidden
import { useState } from 'react';
import ArtistPage from './ArtistPage.js';

export default function App() {
  const [show, setShow] = useState(false);
  if (show) {
    return (
      <ArtistPage
        artist={{
          id: 'the-beatles',
          name: 'The Beatles',
        }}
      />
    );
  } else {
    return (
      <button onClick={() => setShow(true)}>
        Відкрити сторінку виконавця The Beatles
      </button>
    );
  }
}
```

```js src/ArtistPage.js active
import { Suspense } from 'react';
import Albums from './Albums.js';
import Biography from './Biography.js';
import Panel from './Panel.js';

export default function ArtistPage({ artist }) {
  return (
    <>
      <h1>{artist.name}</h1>
      <Suspense fallback={<Loading />}>
        <Biography artistId={artist.id} />
        <Panel>
          <Albums artistId={artist.id} />
        </Panel>
      </Suspense>
    </>
  );
}

function Loading() {
  return <h2>🌀 Завантаження...</h2>;
}
```

```js src/Panel.js
export default function Panel({ children }) {
  return (
    <section className="panel">
      {children}
    </section>
  );
}
```

```js src/Biography.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function Biography({ artistId }) {
  const bio = use(fetchData(`/${artistId}/bio`));
  return (
    <section>
      <p className="bio">{bio}</p>
    </section>
  );
}
```

```js src/Albums.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function Albums({ artistId }) {
  const albums = use(fetchData(`/${artistId}/albums`));
  return (
    <ul>
      {albums.map(album => (
        <li key={album.id}>
          {album.title} ({album.year})
        </li>
      ))}
    </ul>
  );
}
```

```js src/data.js hidden
// Примітка: те, як ви будете отримувати дані, залежить
// від фреймворку, який ви використовуєте разом із Suspense.
// Зазвичай логіка кешування буде всередині фреймворку.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url === '/the-beatles/albums') {
    return await getAlbums();
  } else if (url === '/the-beatles/bio') {
    return await getBio();
  } else {
    throw Error('Not implemented');
  }
}

async function getBio() {
  // Додаємо штучну затримку, щоб очікування було помітним.
  await new Promise(resolve => {
    setTimeout(resolve, 1500);
  });

  return `The Beatles був англійським рок-гуртом, 
    cтвореним у Ліверпулі в 1960 році, до складу якого  
    входили Джон Леннон (John Lennon), Пол Маккартні (Paul McCartney), 
    Джордж Гаррісон (George Harrison) і Рінго Старр (Ringo Starr).`;
}

async function getAlbums() {
  // Додаємо штучну затримку, щоб очікування було помітним.
  await new Promise(resolve => {
    setTimeout(resolve, 3000);
  });

  return [{
    id: 13,
    title: 'Let It Be',
    year: 1970
  }, {
    id: 12,
    title: 'Abbey Road',
    year: 1969
  }, {
    id: 11,
    title: 'Yellow Submarine',
    year: 1969
  }, {
    id: 10,
    title: 'The Beatles',
    year: 1968
  }, {
    id: 9,
    title: 'Magical Mystery Tour',
    year: 1967
  }, {
    id: 8,
    title: 'Sgt. Pepper\'s Lonely Hearts Club Band',
    year: 1967
  }, {
    id: 7,
    title: 'Revolver',
    year: 1966
  }, {
    id: 6,
    title: 'Rubber Soul',
    year: 1965
  }, {
    id: 5,
    title: 'Help!',
    year: 1965
  }, {
    id: 4,
    title: 'Beatles For Sale',
    year: 1964
  }, {
    id: 3,
    title: 'A Hard Day\'s Night',
    year: 1964
  }, {
    id: 2,
    title: 'With The Beatles',
    year: 1963
  }, {
    id: 1,
    title: 'Please Please Me',
    year: 1963
  }];
}
```

```css
.bio { font-style: italic; }

.panel {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}
```

</Sandpack>

Компоненти, що завантажують дані, можуть не бути прямими дочірніми компонентами межі Suspense. Наприклад, ви можете перенести `Biography` і `Albums` у новий компонент `Details`. Це не вплине на поведінку. `Biography` і `Albums` поділяють одну найближчу батьківську межу Suspense, тому їхнє відображення координується разом.

```js {2,8-11}
<Suspense fallback={<Loading />}>
  <Details artistId={artist.id} />
</Suspense>

function Details({ artistId }) {
  return (
    <>
      <Biography artistId={artistId} />
      <Panel>
        <Albums artistId={artistId} />
      </Panel>
    </>
  );
}
```

---

### Відображення вкладеного вмісту поступово, відповідно до його завантаження {/*revealing-nested-content-as-it-loads*/}

Коли компонент затримується, найближчий батьківський компонент Suspense відображає запасний варіант. Це дає вам змогу вкладувати кілька компонентів Suspense, щоб сворити послідовність завантаження. Кожен запасний варіант Suspense буде замінено, коли наступний рівень вмісту буде доступним. Наприклад, ви можете дати списку альбомів власний запасний варіант:

```js {3,7}
<Suspense fallback={<BigSpinner />}>
  <Biography />
  <Suspense fallback={<AlbumsGlimmer />}>
    <Panel>
      <Albums />
    </Panel>
  </Suspense>
</Suspense>
```

Із цією зміною, для відображення `Biography` не потрібно "чекати" завантаження `Albums`.

Послідовність буде такою:

1. Якщо `Biography` ще не завантажився, `BigSpinner` буде показано замість усього вмісту.
2. Як тільки `Biography` закінчить завантаження, `BigSpinner` буде замінено бажаним вмістом.
3. Якщо `Albums` ще не завантажився, `AlbumsGlimmer` буде показано замість `Albums` і його батьківського компонента `Panel`.
4. Нарешті, як тільки `Albums` закінчить завантаження, він замінить `AlbumsGlimmer`.

<Sandpack>

```js src/App.js hidden
import { useState } from 'react';
import ArtistPage from './ArtistPage.js';

export default function App() {
  const [show, setShow] = useState(false);
  if (show) {
    return (
      <ArtistPage
        artist={{
          id: 'the-beatles',
          name: 'The Beatles',
        }}
      />
    );
  } else {
    return (
      <button onClick={() => setShow(true)}>
        Відкрити сторінку виконавця The Beatles
      </button>
    );
  }
}
```

```js src/ArtistPage.js active
import { Suspense } from 'react';
import Albums from './Albums.js';
import Biography from './Biography.js';
import Panel from './Panel.js';

export default function ArtistPage({ artist }) {
  return (
    <>
      <h1>{artist.name}</h1>
      <Suspense fallback={<BigSpinner />}>
        <Biography artistId={artist.id} />
        <Suspense fallback={<AlbumsGlimmer />}>
          <Panel>
            <Albums artistId={artist.id} />
          </Panel>
        </Suspense>
      </Suspense>
    </>
  );
}

function BigSpinner() {
  return <h2>🌀 Завантаження...</h2>;
}

function AlbumsGlimmer() {
  return (
    <div className="glimmer-panel">
      <div className="glimmer-line" />
      <div className="glimmer-line" />
      <div className="glimmer-line" />
    </div>
  );
}
```

```js src/Panel.js
export default function Panel({ children }) {
  return (
    <section className="panel">
      {children}
    </section>
  );
}
```

```js src/Biography.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function Biography({ artistId }) {
  const bio = use(fetchData(`/${artistId}/bio`));
  return (
    <section>
      <p className="bio">{bio}</p>
    </section>
  );
}
```

```js src/Albums.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function Albums({ artistId }) {
  const albums = use(fetchData(`/${artistId}/albums`));
  return (
    <ul>
      {albums.map(album => (
        <li key={album.id}>
          {album.title} ({album.year})
        </li>
      ))}
    </ul>
  );
}
```

```js src/data.js hidden
// Примітка: те, як ви будете отримувати дані, залежить
// від фреймворку, який ви використовуєте разом із Suspense.
// Зазвичай логіка кешування буде всередині фреймворку.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url === '/the-beatles/albums') {
    return await getAlbums();
  } else if (url === '/the-beatles/bio') {
    return await getBio();
  } else {
    throw Error('Not implemented');
  }
}

async function getBio() {
  // Додаємо штучну затримку, щоб очікування було помітним.
  await new Promise(resolve => {
    setTimeout(resolve, 500);
  });

  return `The Beatles був англійським рок-гуртом, 
    cтвореним у Ліверпулі в 1960 році, до складу якого  
    входили Джон Леннон (John Lennon), Пол Маккартні (Paul McCartney), 
    Джордж Гаррісон (George Harrison) і Рінго Старр (Ringo Starr).`;
}

async function getAlbums() {
  // Додаємо штучну затримку, щоб очікування було помітним.
  await new Promise(resolve => {
    setTimeout(resolve, 3000);
  });

  return [{
    id: 13,
    title: 'Let It Be',
    year: 1970
  }, {
    id: 12,
    title: 'Abbey Road',
    year: 1969
  }, {
    id: 11,
    title: 'Yellow Submarine',
    year: 1969
  }, {
    id: 10,
    title: 'The Beatles',
    year: 1968
  }, {
    id: 9,
    title: 'Magical Mystery Tour',
    year: 1967
  }, {
    id: 8,
    title: 'Sgt. Pepper\'s Lonely Hearts Club Band',
    year: 1967
  }, {
    id: 7,
    title: 'Revolver',
    year: 1966
  }, {
    id: 6,
    title: 'Rubber Soul',
    year: 1965
  }, {
    id: 5,
    title: 'Help!',
    year: 1965
  }, {
    id: 4,
    title: 'Beatles For Sale',
    year: 1964
  }, {
    id: 3,
    title: 'A Hard Day\'s Night',
    year: 1964
  }, {
    id: 2,
    title: 'With The Beatles',
    year: 1963
  }, {
    id: 1,
    title: 'Please Please Me',
    year: 1963
  }];
}
```

```css
.bio { font-style: italic; }

.panel {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}

.glimmer-panel {
  border: 1px dashed #aaa;
  background: linear-gradient(90deg, rgba(221,221,221,1) 0%, rgba(255,255,255,1) 100%);
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}

.glimmer-line {
  display: block;
  width: 60%;
  height: 20px;
  margin: 10px;
  border-radius: 4px;
  background: #f0f0f0;
}
```

</Sandpack>

Межі Suspense дають вам змогу контролювати, які частини UI повинні завжди з'являтися одночасно, і які частини повинні поступово показувати більше вмісту відповідно до послідовності завантаження. Ви можете додавати, переставляти або видаляти межі Suspense в будь-якому місці дерева компонетів, без впливу на поведінку решти застосунку.

Не ставте межу Suspense навколо кожного компонента. Межі Suspense не повинні бути більш частими, ніж послідовність завантаження, яку ви хочете, щоб користувач побачив. Якщо ви працюєте з дизайнером, запитайте його, де повинні відображатися індикатори завантаження — висока вірогідність, що вони вже включили їх у макети дизайну.

---

### Відображення застарілого вмісту під час завантаження нового {/*showing-stale-content-while-fresh-content-is-loading*/}

У цьому прикладі, компонент `SearchResults` затримується, доки завантажує результати пошуку. Введіть `"a"`, зачекайте на результат, а тоді змініть на `"ab"`. Результати для `"a"` будуть замінені запасним варінтом завантаження.

<Sandpack>

```js src/App.js
import { Suspense, useState } from 'react';
import SearchResults from './SearchResults.js';

export default function App() {
  const [query, setQuery] = useState('');
  return (
    <>
      <label>
        Пошук альбомів:
        <input value={query} onChange={e => setQuery(e.target.value)} />
      </label>
      <Suspense fallback={<h2>Завантаження...</h2>}>
        <SearchResults query={query} />
      </Suspense>
    </>
  );
}
```

```js src/SearchResults.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function SearchResults({ query }) {
  if (query === '') {
    return null;
  }
  const albums = use(fetchData(`/search?q=${query}`));
  if (albums.length === 0) {
    return <p>Не знайдено результатів для <i>"{query}"</i></p>;
  }
  return (
    <ul>
      {albums.map(album => (
        <li key={album.id}>
          {album.title} ({album.year})
        </li>
      ))}
    </ul>
  );
}
```

```js src/data.js hidden
// Примітка: те, як ви будете отримувати дані, залежить
// від фреймворку, який ви використовуєте разом із Suspense.
// Зазвичай логіка кешування буде всередині фреймворку.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url.startsWith('/search?q=')) {
    return await getSearchResults(url.slice('/search?q='.length));
  } else {
    throw Error('Not implemented');
  }
}

async function getSearchResults(query) {
  // Додаємо штучну затримку, щоб очікування було помітним.
  await new Promise(resolve => {
    setTimeout(resolve, 500);
  });

  const allAlbums = [{
    id: 13,
    title: 'Let It Be',
    year: 1970
  }, {
    id: 12,
    title: 'Abbey Road',
    year: 1969
  }, {
    id: 11,
    title: 'Yellow Submarine',
    year: 1969
  }, {
    id: 10,
    title: 'The Beatles',
    year: 1968
  }, {
    id: 9,
    title: 'Magical Mystery Tour',
    year: 1967
  }, {
    id: 8,
    title: 'Sgt. Pepper\'s Lonely Hearts Club Band',
    year: 1967
  }, {
    id: 7,
    title: 'Revolver',
    year: 1966
  }, {
    id: 6,
    title: 'Rubber Soul',
    year: 1965
  }, {
    id: 5,
    title: 'Help!',
    year: 1965
  }, {
    id: 4,
    title: 'Beatles For Sale',
    year: 1964
  }, {
    id: 3,
    title: 'A Hard Day\'s Night',
    year: 1964
  }, {
    id: 2,
    title: 'With The Beatles',
    year: 1963
  }, {
    id: 1,
    title: 'Please Please Me',
    year: 1963
  }];

  const lowerQuery = query.trim().toLowerCase();
  return allAlbums.filter(album => {
    const lowerTitle = album.title.toLowerCase();
    return (
      lowerTitle.startsWith(lowerQuery) ||
      lowerTitle.indexOf(' ' + lowerQuery) !== -1
    )
  });
}
```

```css
input { margin: 10px; }
```

</Sandpack>

Поширеним альтернативним UI паттерном є *відкладене* оновлення списку з показом попередніх результатів, доки нові результати не будуть готові. Хук [`useDeferredValue`](/reference/react/useDeferredValue) дає змогу передавати відкладений варіант запиту вниз по дереву: 

```js {3,11}
export default function App() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  return (
    <>
      <label>
        Пошук альбомів:
        <input value={query} onChange={e => setQuery(e.target.value)} />
      </label>
      <Suspense fallback={<h2>Завантаження...</h2>}>
        <SearchResults query={deferredQuery} />
      </Suspense>
    </>
  );
}
```

`query` оновиться одразу, тому пошуковий рядок відображатиме нове значення. Проте, `deferredQuery` збереже попереднє значення, доки дані не будуть завантажені, тож `SearchResults` на деякий час відобразить застарілі результати.

Щоб зробити це більш очевидним для користувача, ви можете додати візуальний індикатор під час відображення застарілого вмісту:

```js {2}
<div style={{
  opacity: query !== deferredQuery ? 0.5 : 1 
}}>
  <SearchResults query={deferredQuery} />
</div>
```

Введіть `"a"` у прикладі нижче, зачекайте на результат, тоді змініть значення на `"ab"`. Зверніть увагу, як замість запасного варіанту, ви бачите затемнений список попередніх результатів, доки нові результати не завантажилися:


<Sandpack>

```js src/App.js
import { Suspense, useState, useDeferredValue } from 'react';
import SearchResults from './SearchResults.js';

export default function App() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  const isStale = query !== deferredQuery;
  return (
    <>
      <label>
        Пошук альбомів:
        <input value={query} onChange={e => setQuery(e.target.value)} />
      </label>
      <Suspense fallback={<h2>Завантаження...</h2>}>
        <div style={{ opacity: isStale ? 0.5 : 1 }}>
          <SearchResults query={deferredQuery} />
        </div>
      </Suspense>
    </>
  );
}
```

```js src/SearchResults.js hidden
import {use} from 'react';
import { fetchData } from './data.js';

export default function SearchResults({ query }) {
  if (query === '') {
    return null;
  }
  const albums = use(fetchData(`/search?q=${query}`));
  if (albums.length === 0) {
    return <p>Не знайдено результатів для <i>"{query}"</i></p>;
  }
  return (
    <ul>
      {albums.map(album => (
        <li key={album.id}>
          {album.title} ({album.year})
        </li>
      ))}
    </ul>
  );
}
```

```js src/data.js hidden
// Примітка: те, як ви будете отримувати дані, залежить
// від фреймворку, який ви використовуєте разом із Suspense.
// Зазвичай логіка кешування буде всередині фреймворку.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url.startsWith('/search?q=')) {
    return await getSearchResults(url.slice('/search?q='.length));
  } else {
    throw Error('Not implemented');
  }
}

async function getSearchResults(query) {
  // Додаємо штучну затримку, щоб очікування було помітним.
  await new Promise(resolve => {
    setTimeout(resolve, 500);
  });

  const allAlbums = [{
    id: 13,
    title: 'Let It Be',
    year: 1970
  }, {
    id: 12,
    title: 'Abbey Road',
    year: 1969
  }, {
    id: 11,
    title: 'Yellow Submarine',
    year: 1969
  }, {
    id: 10,
    title: 'The Beatles',
    year: 1968
  }, {
    id: 9,
    title: 'Magical Mystery Tour',
    year: 1967
  }, {
    id: 8,
    title: 'Sgt. Pepper\'s Lonely Hearts Club Band',
    year: 1967
  }, {
    id: 7,
    title: 'Revolver',
    year: 1966
  }, {
    id: 6,
    title: 'Rubber Soul',
    year: 1965
  }, {
    id: 5,
    title: 'Help!',
    year: 1965
  }, {
    id: 4,
    title: 'Beatles For Sale',
    year: 1964
  }, {
    id: 3,
    title: 'A Hard Day\'s Night',
    year: 1964
  }, {
    id: 2,
    title: 'With The Beatles',
    year: 1963
  }, {
    id: 1,
    title: 'Please Please Me',
    year: 1963
  }];

  const lowerQuery = query.trim().toLowerCase();
  return allAlbums.filter(album => {
    const lowerTitle = album.title.toLowerCase();
    return (
      lowerTitle.startsWith(lowerQuery) ||
      lowerTitle.indexOf(' ' + lowerQuery) !== -1
    )
  });
}
```

```css
input { margin: 10px; }
```

</Sandpack>

<Note>

Як затримані значення так і [переходи](#preventing-already-revealed-content-from-hiding) дають вам змогу уникнути відображення запасного варіанту Suspense, натомість відображаючи індикатор безпосередньо у вмісті. Переходи відмічають оновлення як нетермінові, тож вони часто використовуються фреймворками та бібліотеками-маршрутизаторами для навігації. З іншого боку, відкладені значення, переважно використовуються в коді застосунку там, де ви хочете відмітити частину UI як нетермінову й дозволити їй "відставати" від решти UI.

</Note>

---

### Запобігання заміни запасним варіантом уже відображеного вмісту {/*preventing-already-revealed-content-from-hiding*/}

Коли компонент затримується, найближча батьківська межа Suspense перемикається на показ запасного варіанту. Це може призвести до неприємного користувацького досвіду у випадку, якщо якийсь вміст уже відображався. Спробуйте настинути цю кнопку:

<Sandpack>

```js src/App.js
import { Suspense, useState } from 'react';
import IndexPage from './IndexPage.js';
import ArtistPage from './ArtistPage.js';
import Layout from './Layout.js';

export default function App() {
  return (
    <Suspense fallback={<BigSpinner />}>
      <Router />
    </Suspense>
  );
}

function Router() {
  const [page, setPage] = useState('/');

  function navigate(url) {
    setPage(url);
  }

  let content;
  if (page === '/') {
    content = (
      <IndexPage navigate={navigate} />
    );
  } else if (page === '/the-beatles') {
    content = (
      <ArtistPage
        artist={{
          id: 'the-beatles',
          name: 'The Beatles',
        }}
      />
    );
  }
  return (
    <Layout>
      {content}
    </Layout>
  );
}

function BigSpinner() {
  return <h2>🌀 Завантаження...</h2>;
}
```

```js src/Layout.js
export default function Layout({ children }) {
  return (
    <div className="layout">
      <section className="header">
        Музичний браузер
      </section>
      <main>
        {children}
      </main>
    </div>
  );
}
```

```js src/IndexPage.js
export default function IndexPage({ navigate }) {
  return (
    <button onClick={() => navigate('/the-beatles')}>
      Відкрити сторінку виконавця The Beatles
    </button>
  );
}
```

```js src/ArtistPage.js
import { Suspense } from 'react';
import Albums from './Albums.js';
import Biography from './Biography.js';
import Panel from './Panel.js';

export default function ArtistPage({ artist }) {
  return (
    <>
      <h1>{artist.name}</h1>
      <Biography artistId={artist.id} />
      <Suspense fallback={<AlbumsGlimmer />}>
        <Panel>
          <Albums artistId={artist.id} />
        </Panel>
      </Suspense>
    </>
  );
}

function AlbumsGlimmer() {
  return (
    <div className="glimmer-panel">
      <div className="glimmer-line" />
      <div className="glimmer-line" />
      <div className="glimmer-line" />
    </div>
  );
}
```

```js src/Albums.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function Albums({ artistId }) {
  const albums = use(fetchData(`/${artistId}/albums`));
  return (
    <ul>
      {albums.map(album => (
        <li key={album.id}>
          {album.title} ({album.year})
        </li>
      ))}
    </ul>
  );
}
```

```js src/Biography.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function Biography({ artistId }) {
  const bio = use(fetchData(`/${artistId}/bio`));
  return (
    <section>
      <p className="bio">{bio}</p>
    </section>
  );
}
```

```js src/Panel.js
export default function Panel({ children }) {
  return (
    <section className="panel">
      {children}
    </section>
  );
}
```

```js src/data.js hidden
// Примітка: те, як ви будете отримувати дані, залежить
// від фреймворку, який ви використовуєте разом із Suspense.
// Зазвичай логіка кешування буде всередині фреймворку.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url === '/the-beatles/albums') {
    return await getAlbums();
  } else if (url === '/the-beatles/bio') {
    return await getBio();
  } else {
    throw Error('Not implemented');
  }
}

async function getBio() {
  // Додаємо штучну затримку, щоб очікування було помітним.
  await new Promise(resolve => {
    setTimeout(resolve, 500);
  });

  return `The Beatles був англійським рок-гуртом, 
    cтвореним у Ліверпулі в 1960 році, до складу якого  
    входили Джон Леннон (John Lennon), Пол Маккартні (Paul McCartney), 
    Джордж Гаррісон (George Harrison) і Рінго Старр (Ringo Starr).`;
}

async function getAlbums() {
  // Додаємо штучну затримку, щоб очікування було помітним.
  await new Promise(resolve => {
    setTimeout(resolve, 3000);
  });

  return [{
    id: 13,
    title: 'Let It Be',
    year: 1970
  }, {
    id: 12,
    title: 'Abbey Road',
    year: 1969
  }, {
    id: 11,
    title: 'Yellow Submarine',
    year: 1969
  }, {
    id: 10,
    title: 'The Beatles',
    year: 1968
  }, {
    id: 9,
    title: 'Magical Mystery Tour',
    year: 1967
  }, {
    id: 8,
    title: 'Sgt. Pepper\'s Lonely Hearts Club Band',
    year: 1967
  }, {
    id: 7,
    title: 'Revolver',
    year: 1966
  }, {
    id: 6,
    title: 'Rubber Soul',
    year: 1965
  }, {
    id: 5,
    title: 'Help!',
    year: 1965
  }, {
    id: 4,
    title: 'Beatles For Sale',
    year: 1964
  }, {
    id: 3,
    title: 'A Hard Day\'s Night',
    year: 1964
  }, {
    id: 2,
    title: 'With The Beatles',
    year: 1963
  }, {
    id: 1,
    title: 'Please Please Me',
    year: 1963
  }];
}
```

```css
main {
  min-height: 200px;
  padding: 10px;
}

.layout {
  border: 1px solid black;
}

.header {
  background: #222;
  padding: 10px;
  text-align: center;
  color: white;
}

.bio { font-style: italic; }

.panel {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}

.glimmer-panel {
  border: 1px dashed #aaa;
  background: linear-gradient(90deg, rgba(221,221,221,1) 0%, rgba(255,255,255,1) 100%);
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}

.glimmer-line {
  display: block;
  width: 60%;
  height: 20px;
  margin: 10px;
  border-radius: 4px;
  background: #f0f0f0;
}
```

</Sandpack>

Коли ви натиснули кнопку, компонент `Router` відрендерив `ArtistPage` замість `IndexPage`. Компонент всередині `ArtistPage` затриманий, тож найближча межа Suspense почала відображати запасний варіант. Найближча межа Suspense була біля корневого компонента, тому весь макет сайту було замінено на `BigSpinner`.

Щоб запобігти цьому, ви можете відмітити оновлення стану навігації як *перехід*, використовуючи [`startTransition`:](/reference/react/startTransition)

```js {5,7}
function Router() {
  const [page, setPage] = useState('/');

  function navigate(url) {
    startTransition(() => {
      setPage(url);      
    });
  }
  // ...
```

Це говорить React що перехід стану не є терміновим і краще продовжити показувати попередню сторінку, замість того, щоб ховати вже відображений вміст. Тепер натискання на кнопку "очікує", доки `Biography` завантажиться:

<Sandpack>

```js src/App.js
import { Suspense, startTransition, useState } from 'react';
import IndexPage from './IndexPage.js';
import ArtistPage from './ArtistPage.js';
import Layout from './Layout.js';

export default function App() {
  return (
    <Suspense fallback={<BigSpinner />}>
      <Router />
    </Suspense>
  );
}

function Router() {
  const [page, setPage] = useState('/');

  function navigate(url) {
    startTransition(() => {
      setPage(url);
    });
  }

  let content;
  if (page === '/') {
    content = (
      <IndexPage navigate={navigate} />
    );
  } else if (page === '/the-beatles') {
    content = (
      <ArtistPage
        artist={{
          id: 'the-beatles',
          name: 'The Beatles',
        }}
      />
    );
  }
  return (
    <Layout>
      {content}
    </Layout>
  );
}

function BigSpinner() {
  return <h2>🌀 Завантаження...</h2>;
}
```

```js src/Layout.js
export default function Layout({ children }) {
  return (
    <div className="layout">
      <section className="header">
        Музичний Браузер
      </section>
      <main>
        {children}
      </main>
    </div>
  );
}
```

```js src/IndexPage.js
export default function IndexPage({ navigate }) {
  return (
    <button onClick={() => navigate('/the-beatles')}>
      Відкрити сторінку виконавця The Beatles
    </button>
  );
}
```

```js src/ArtistPage.js
import { Suspense } from 'react';
import Albums from './Albums.js';
import Biography from './Biography.js';
import Panel from './Panel.js';

export default function ArtistPage({ artist }) {
  return (
    <>
      <h1>{artist.name}</h1>
      <Biography artistId={artist.id} />
      <Suspense fallback={<AlbumsGlimmer />}>
        <Panel>
          <Albums artistId={artist.id} />
        </Panel>
      </Suspense>
    </>
  );
}

function AlbumsGlimmer() {
  return (
    <div className="glimmer-panel">
      <div className="glimmer-line" />
      <div className="glimmer-line" />
      <div className="glimmer-line" />
    </div>
  );
}
```

```js src/Albums.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function Albums({ artistId }) {
  const albums = use(fetchData(`/${artistId}/albums`));
  return (
    <ul>
      {albums.map(album => (
        <li key={album.id}>
          {album.title} ({album.year})
        </li>
      ))}
    </ul>
  );
}
```

```js src/Biography.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function Biography({ artistId }) {
  const bio = use(fetchData(`/${artistId}/bio`));
  return (
    <section>
      <p className="bio">{bio}</p>
    </section>
  );
}
```

```js src/Panel.js
export default function Panel({ children }) {
  return (
    <section className="panel">
      {children}
    </section>
  );
}
```

```js src/data.js hidden
// Примітка: те, як ви будете отримувати дані, залежить
// від фреймворку, який ви використовуєте разом із Suspense.
// Зазвичай логіка кешування буде всередині фреймворку.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url === '/the-beatles/albums') {
    return await getAlbums();
  } else if (url === '/the-beatles/bio') {
    return await getBio();
  } else {
    throw Error('Not implemented');
  }
}

async function getBio() {
  // Додаємо штучну затримку, щоб очікування було помітним.
  await new Promise(resolve => {
    setTimeout(resolve, 500);
  });

  return `The Beatles був англійським рок-гуртом, 
    cтвореним у Ліверпулі в 1960 році, до складу якого  
    входили Джон Леннон (John Lennon), Пол Маккартні (Paul McCartney), 
    Джордж Гаррісон (George Harrison) і Рінго Старр (Ringo Starr).`;
}

async function getAlbums() {
  // Додаємо штучну затримку, щоб очікування було помітним.
  await new Promise(resolve => {
    setTimeout(resolve, 3000);
  });

  return [{
    id: 13,
    title: 'Let It Be',
    year: 1970
  }, {
    id: 12,
    title: 'Abbey Road',
    year: 1969
  }, {
    id: 11,
    title: 'Yellow Submarine',
    year: 1969
  }, {
    id: 10,
    title: 'The Beatles',
    year: 1968
  }, {
    id: 9,
    title: 'Magical Mystery Tour',
    year: 1967
  }, {
    id: 8,
    title: 'Sgt. Pepper\'s Lonely Hearts Club Band',
    year: 1967
  }, {
    id: 7,
    title: 'Revolver',
    year: 1966
  }, {
    id: 6,
    title: 'Rubber Soul',
    year: 1965
  }, {
    id: 5,
    title: 'Help!',
    year: 1965
  }, {
    id: 4,
    title: 'Beatles For Sale',
    year: 1964
  }, {
    id: 3,
    title: 'A Hard Day\'s Night',
    year: 1964
  }, {
    id: 2,
    title: 'With The Beatles',
    year: 1963
  }, {
    id: 1,
    title: 'Please Please Me',
    year: 1963
  }];
}
```

```css
main {
  min-height: 200px;
  padding: 10px;
}

.layout {
  border: 1px solid black;
}

.header {
  background: #222;
  padding: 10px;
  text-align: center;
  color: white;
}

.bio { font-style: italic; }

.panel {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}

.glimmer-panel {
  border: 1px dashed #aaa;
  background: linear-gradient(90deg, rgba(221,221,221,1) 0%, rgba(255,255,255,1) 100%);
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}

.glimmer-line {
  display: block;
  width: 60%;
  height: 20px;
  margin: 10px;
  border-radius: 4px;
  background: #f0f0f0;
}
```

</Sandpack>

Перехід не чекає на завантаження *всього* вмісту. Він лише чекає достатньо довго, щоб уникнути приховання вже відображеного вмісту. Для прикладу, `Layout` вебсайту вже було відображено, тому було би погано ховати його за спіннером завантаження. Проте, вкладена межа `Suspense` навколо `Albums` нова, тому перехід не чекає на неї.

<Note>

Передбачається, що маршрутизатори з інтегрованим Suspense заздалегідь огортатимуть оновлення навігації в перехід.

</Note>

---

### Індикація переходу {/*indicating-that-a-transition-is-happening*/}

У прикладі зверху, як тільки ви натискаєте на кнопку, відсутній візуальний сигнал того, що відбувається навігація. Щоб додати індикатор, ви можете замінити [`startTransition`](/reference/react/startTransition) на [`useTransition`](/reference/react/useTransition), який дає вам булеве значення `isPending`. У прикладі нище, воно використовується, щоб змінити стилі хедеру вебсайту, доки відбувається перехід:

<Sandpack>

```js src/App.js
import { Suspense, useState, useTransition } from 'react';
import IndexPage from './IndexPage.js';
import ArtistPage from './ArtistPage.js';
import Layout from './Layout.js';

export default function App() {
  return (
    <Suspense fallback={<BigSpinner />}>
      <Router />
    </Suspense>
  );
}

function Router() {
  const [page, setPage] = useState('/');
  const [isPending, startTransition] = useTransition();

  function navigate(url) {
    startTransition(() => {
      setPage(url);
    });
  }

  let content;
  if (page === '/') {
    content = (
      <IndexPage navigate={navigate} />
    );
  } else if (page === '/the-beatles') {
    content = (
      <ArtistPage
        artist={{
          id: 'the-beatles',
          name: 'The Beatles',
        }}
      />
    );
  }
  return (
    <Layout isPending={isPending}>
      {content}
    </Layout>
  );
}

function BigSpinner() {
  return <h2>🌀 Loading...</h2>;
}
```

```js src/Layout.js
export default function Layout({ children, isPending }) {
  return (
    <div className="layout">
      <section className="header" style={{
        opacity: isPending ? 0.7 : 1
      }}>
       Музичний Браузер
      </section>
      <main>
        {children}
      </main>
    </div>
  );
}
```

```js src/IndexPage.js
export default function IndexPage({ navigate }) {
  return (
    <button onClick={() => navigate('/the-beatles')}>
      Відкрити сторінку виконавця The Beatles
    </button>
  );
}
```

```js src/ArtistPage.js
import { Suspense } from 'react';
import Albums from './Albums.js';
import Biography from './Biography.js';
import Panel from './Panel.js';

export default function ArtistPage({ artist }) {
  return (
    <>
      <h1>{artist.name}</h1>
      <Biography artistId={artist.id} />
      <Suspense fallback={<AlbumsGlimmer />}>
        <Panel>
          <Albums artistId={artist.id} />
        </Panel>
      </Suspense>
    </>
  );
}

function AlbumsGlimmer() {
  return (
    <div className="glimmer-panel">
      <div className="glimmer-line" />
      <div className="glimmer-line" />
      <div className="glimmer-line" />
    </div>
  );
}
```

```js src/Albums.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function Albums({ artistId }) {
  const albums = use(fetchData(`/${artistId}/albums`));
  return (
    <ul>
      {albums.map(album => (
        <li key={album.id}>
          {album.title} ({album.year})
        </li>
      ))}
    </ul>
  );
}
```

```js src/Biography.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function Biography({ artistId }) {
  const bio = use(fetchData(`/${artistId}/bio`));
  return (
    <section>
      <p className="bio">{bio}</p>
    </section>
  );
}
```

```js src/Panel.js
export default function Panel({ children }) {
  return (
    <section className="panel">
      {children}
    </section>
  );
}
```

```js src/data.js hidden
// Примітка: те, як ви будете отримувати дані, залежить
// від фреймворку, який ви використовуєте разом із Suspense.
// Зазвичай логіка кешування буде всередині фреймворку.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url === '/the-beatles/albums') {
    return await getAlbums();
  } else if (url === '/the-beatles/bio') {
    return await getBio();
  } else {
    throw Error('Not implemented');
  }
}

async function getBio() {
  // Додаємо штучну затримку, щоб очікування було помітним.
  await new Promise(resolve => {
    setTimeout(resolve, 500);
  });

  return `The Beatles був англійським рок-гуртом, 
    cтвореним у Ліверпулі в 1960 році, до складу якого  
    входили Джон Леннон (John Lennon), Пол Маккартні (Paul McCartney), 
    Джордж Гаррісон (George Harrison) і Рінго Старр (Ringo Starr).`;
}

async function getAlbums() {
  // Додаємо штучну затримку, щоб очікування було помітним.
  await new Promise(resolve => {
    setTimeout(resolve, 3000);
  });

  return [{
    id: 13,
    title: 'Let It Be',
    year: 1970
  }, {
    id: 12,
    title: 'Abbey Road',
    year: 1969
  }, {
    id: 11,
    title: 'Yellow Submarine',
    year: 1969
  }, {
    id: 10,
    title: 'The Beatles',
    year: 1968
  }, {
    id: 9,
    title: 'Magical Mystery Tour',
    year: 1967
  }, {
    id: 8,
    title: 'Sgt. Pepper\'s Lonely Hearts Club Band',
    year: 1967
  }, {
    id: 7,
    title: 'Revolver',
    year: 1966
  }, {
    id: 6,
    title: 'Rubber Soul',
    year: 1965
  }, {
    id: 5,
    title: 'Help!',
    year: 1965
  }, {
    id: 4,
    title: 'Beatles For Sale',
    year: 1964
  }, {
    id: 3,
    title: 'A Hard Day\'s Night',
    year: 1964
  }, {
    id: 2,
    title: 'With The Beatles',
    year: 1963
  }, {
    id: 1,
    title: 'Please Please Me',
    year: 1963
  }];
}
```

```css
main {
  min-height: 200px;
  padding: 10px;
}

.layout {
  border: 1px solid black;
}

.header {
  background: #222;
  padding: 10px;
  text-align: center;
  color: white;
}

.bio { font-style: italic; }

.panel {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}

.glimmer-panel {
  border: 1px dashed #aaa;
  background: linear-gradient(90deg, rgba(221,221,221,1) 0%, rgba(255,255,255,1) 100%);
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}

.glimmer-line {
  display: block;
  width: 60%;
  height: 20px;
  margin: 10px;
  border-radius: 4px;
  background: #f0f0f0;
}
```

</Sandpack>

---

### Скидання меж Suspense під час навігації {/*resetting-suspense-boundaries-on-navigation*/}

Під час переходу, React уникне приховання вже відображеного вмісту. Проте, якщо ви перейдете на маршрут з іншими параметрами, ви захочете сказати React, що це *інший* вміст. Ви можете досягнути цього з `key`:

```js
<ProfilePage key={queryParams.id} />
```

Уявіть, що ви переходите всередині сторінки профілю користувача, і щось затримується. Якщо те оновлення використовує перехід, воно не буде викликати запасний варіант для вже відображеного вмісту. Така поведінка є очікуваною.

А тепер уявіть, що ви переходите між профілями двох різних користувачів. У такому випадку доцільно відображати запасний варіант. Наприклад, вміст стрічки одного користувача *відрізняється*, від стрічки іншого користувача. Вказуючи `key`, ви запевняєтеся, що React розглядає профілі різних користувачів як різні компоненти і скидає межу Suspense під час навігації. Маршрутизатори з інтегрованим Suspense повинні робити це автоматично.

---

### Застосування запасного варіанту для серверних помилок та вмісту, що опрацьовується тільки на стороні клієнта {/*providing-a-fallback-for-server-errors-and-client-only-content*/}

Якщо ви використовуєте якийсь з [API для потокового рендеру на стороні сервера](/reference/react-dom/server) (або фреймворк, що покладається на них), React також використовуватими вашу межу `<Suspense>`, щоб обробляти помилки на стороні сервера. Якщо компонент видає помилку на стороні сервера, React не відмінить серверний рендеринг. Натомість, він знайде найближчий компонент `<Suspense>` вище нього й додасть його запасний варіант (наприклад спіннер) у згенерований сервером HTML. Спочатку користувач побачить спіннер.

На стороні клієнта, React спробує відрендерити той же компонент знову. Якщо в ньому виникає помилка й на стороні клієнта, React видасть помилку і відобразить найближчу [границю помилки.](/reference/react/Component#static-getderivedstatefromerror) Проте, якщо він не видає помилки на стороні клієнта, React не буде відображати користувачу помилку, тому що вміст усе ж був відображений коректно.

Ви можете використати це, щоб виключити деякі компоненти з рендерингу на стороні сервера. Щоб зробити це, видайте помилку в серверному оточенні й обгорніть ці компоненти в межу `<Suspense>`, щоб замінити їхній HTML запасним варіантом:

```js
<Suspense fallback={<Loading />}>
  <Chat />
</Suspense>

function Chat() {
  if (typeof window === 'undefined') {
    throw Error('Чат повинен рендеритися тільки на стороні клієнта.');
  }
  // ...
}
```

Відрендерений на стороні сервера HTML включатиме лише індикатор завантаження. Його буде замінено компонентом `Chat` на стороні клієнта.

---

## Усунення неполадок {/*troubleshooting*/}

### Як я можу запобігти заміні UI запасним варіантом під час оновлення? {/*preventing-unwanted-fallbacks*/}

Заміна видимого UI запасним варіантом спричиняє неприємний користувацький досвід. Це стається, коли оновлення спричиняє затримку компонента, а найближчий Suspense вже показує вміст користувачу.

Щоб запобігти цьому, [відмітьте оновлення нетерміновим, використовуючи `startTransition`](#preventing-already-revealed-content-from-hiding). Під час переходу, React зачекає на завантаження даних, щоб запобігти відображенню небажаного запасного варіанту:

```js {2-3,5}
function handleNextPageClick() {
  // Якщо це оновлення затримається, уже відображений вміст не буде сховано
  startTransition(() => {
    setCurrentPage(currentPage + 1);
  });
}
```

Це допоможе уникнути приховання вже існуючого вмісту. Однак, будь-яка наново відрендерена межа `Suspense`, усе ще відображатиме запасний варіант, щоб уникнути блокування UI і дасть змогу користувачу бачити вміст як тільки він стане доступним.

**React запобігатиме небажаним запасним варіантам лише під час нетермінових оновлень**. Він не затримуватиме рендеринг, якщо це результат термінового оновлення. Ви повинні увімкнути це з API, наприклад, [`startTransition`](/reference/react/startTransition) або [`useDeferredValue`](/reference/react/useDeferredValue).

Якщо у ваш маршрутизатор інтегровано Suspense, він повинен огортати оновлення у [`startTransition`](/reference/react/startTransition) автоматично.