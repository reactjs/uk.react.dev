---
title: Invalid ARIA Prop Warning
layout: single
permalink: warnings/invalid-aria-prop.html
---

Попередження invalid-aria-prop генерується, коли ви намагаєтеся відрендерити DOM-елемент з пропом aria-*, якого немає в [специфікації](https://www.w3.org/TR/wai-aria-1.1/#states_and_properties) Web Accessibility Initiative (WAI) Accessible Rich Internet Application (ARIA).

1. Якщо вам здається, що ви використовуєте валідний проп, перевірте правильність його написання. `aria-labelledby` та `aria-activedescendant` часто бувають написані з помилками.

2. React поки що не розпізнає вказаний вами атрибут. Це, ймовірно, буде виправлено в майбутній версії React. Однак, на даний момент React видаляє всі невідомі атрибути, тому їх присутність у вашому React-додатку не призведе до їх рендеру.

3. Otherwise, if you're on the latest version of React DOM and verified that you're using a valid property name listed in the ARIA specification, please [report a bug](https://github.com/facebook/react/issues/new/choose).