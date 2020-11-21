---
id: create-fragment
title: Keyed Fragments
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

У більшості випадків ви можете використовувати властивість `key`, щоб вказати ключі елементам, які ви повертаєте з методу `render`. Однак, це не працює в одній ситуації: якщо у вас є два набори дочірніх компонентів, порядок яких вам потрібно змінити, у такому разі немає способу задати ключ кожному набоу без додавання обгорнутого компоненту.

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

The children will unmount and remount as you change the `swapped` prop because there aren't any keys marked on the two sets of children.

To solve this problem, you can use the `createFragment` add-on to give keys to the sets of children.

#### `Array<ReactNode> createFragment(object children)` {#arrayreactnode-createfragmentobject-children}

Instead of creating arrays, we write:

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

The keys of the passed object (that is, `left` and `right`) are used as keys for the entire set of children, and the order of the object's keys is used to determine the order of the rendered children. With this change, the two sets of children will be properly reordered in the DOM without unmounting.

The return value of `createFragment` should be treated as an opaque object; you can use the [`React.Children`](/docs/react-api.html#react.children) helpers to loop through a fragment but should not access it directly. Note also that we're relying on the JavaScript engine preserving object enumeration order here, which is not guaranteed by the spec but is implemented by all major browsers and VMs for objects with non-numeric keys.
