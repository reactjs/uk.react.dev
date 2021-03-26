---
id: create-fragment
title: Фрагменти з Ключами
permalink: docs/create-fragment.html
layout: docs
category: Доповнення
---

> Note:
>
> `React.addons` використвання застаріле станом на React v15.5. Тепер у нас є першокласна підтримка фрагментів, про яку ви можете прочитати [тут](/docs/fragments.html).

## Імпортування {#importing}

```javascript
import createFragment from 'react-addons-create-fragment'; // ES6
var createFragment = require('react-addons-create-fragment'); // ES5 з npm
```

## Огляд {#overview}

У більшості випадків ви можете використовувати властивість `key`, щоб вказати ключі елементів, які ви повертаєте з методу `render`. Однак, це не спрацює в одній ситуації: якщо у вас є два набори дочірніх компонентів, порядок яких вам потрібно змінити, у такому разі немає способу задати ключ кожному набору без додавання обгорткового компонента.

Це те саме, якби ви мали наступний компонент:

```js
function Swapper(props) {
  let children;
  if (props.swapped) {
    children = [props.rightChildren, props.leftChildren];
  } else {
    children = [props.leftChildren, props.rightChildren];
  }
  return <div>{children}</div>;
}
```

Діти будуть демонтуватися та перемонтовуватися, коли ви змінюєте властивість `swapped`, оскільки у двох наборах дочірніх елементів не зазначено жодних клавіш.

Щоб вирішити цю проблему, ви можете використовувати доповнення `createFragment` для передачі ключів до наборів дочірніх елементів.

#### `Array<ReactNode> createFragment(object children)` {#arrayreactnode-createfragmentobject-children}

Замість того, щоб створювати масиви, ми пишемо:

```javascript
import createFragment from 'react-addons-create-fragment';

function Swapper(props) {
  let children;
  if (props.swapped) {
    children = createFragment({
      right: props.rightChildren,
      left: props.leftChildren
    });
  } else {
    children = createFragment({
      left: props.leftChildren,
      right: props.rightChildren
    });
  }
  return <div>{children}</div>;
}
```

Ключі переданого об'єкта (тобто `left` та` right`) використовуються як ключі для всього набору дочірніх елементів, а порядок ключів об'єкта використовується для визначення порядку рендерингу дочірніх елементів. З цією зміною два набори дітей будуть належним чином упорядковані в DOM без демонтування.

Повернене значення `createFragment` слід розглядати як непрозорий об'єкт; Ви можете скористатися помічниками [`React.Children`](/docs/response-api.html#response.children), щоб пройтися по фрагменту, але не слід безпосередньо отримувати до нього доступ. Зауважте також, що ми покладаємось на рушій JavaScript, що зберігає тут порядок перелічення об’єктів, що не гарантується специфікацією, але реалізується усіма основними браузерами та віртуальними машинами для об’єктів з нечисловими клавішами.
