---
title: Special Props Warning
layout: single
permalink: warnings/special-props.html
---

Більшість пропів елемента JSX передаються компоненту. Однак, є два спеціальних пропи (`ref` та `key`), які використовуються React безпосередньо, і тому компонент їх не отримую.

Наприклад, отримати доступ до `this.props.key` з компоненту (тобто, функції рендерингу чи [propTypes](/docs/typechecking-with-proptypes.html#proptypes)) не вийде. Якщо дочірньому компоненту потрібне це значення, передайте його під іншим ім'ям (наприклад, `<ListItemWrapper key={result.id} id={result.id} />`). Це може здатися незручним, але допомогає відділяти логіку додатку від спеціальних інструкцій для самого React.
