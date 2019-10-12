---
title: Special Props Warning
layout: single
permalink: warnings/special-props.html
---

Більшість пропсів JSX-елемента передаються компоненту напряму. Однак, є два спеціальних пропса (`ref` та `key`), які React використовує напряму, і тому компонент їх не отримує.

Наприклад, отримати доступ до `this.props.key` з компонента (тобто, функції рендерингу чи [propTypes](/docs/typechecking-with-proptypes.html#proptypes)) не вийде. Якщо дочірньому компоненту потрібне це значення, передайте його під іншим ім'ям (наприклад, `<ListItemWrapper key={result.id} id={result.id} />`). Це може здатися незручним, але допомогає розділяти логіку додатку від спеціальних інструкцій для самого React.
