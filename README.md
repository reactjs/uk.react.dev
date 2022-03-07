# uk.reactjs.org

Цей репозиторій містить вихідний код та документацію для сайту [uk.reactjs.org](https://uk.reactjs.org/).

## Початок

### Передумови

1. Git
1. Node: будь-яка версія 12.x, починаючи з 12.0.0 або вище
1. Yarn: Див. [сайт Yarn з інструкціями по встановленню](https://yarnpkg.com/uk/docs/install)
1. Зробити форк цього репозиторію (для пропозицій змін)
1. Клонувати [uk.reactjs.org repo](https://github.com/reactjs/uk.reactjs.org) на ваш комп'ютер

### Встановлення

1. `cd uk.reactjs.org` для переходу в кореневу директорію проекту
1. `yarn` для встановлення npm-залежностей проекту

### Запуск проекта локально

1. `yarn dev` для запуску сервера розробки з підтримкою гарячого перезавантаження (на основі [Gatsby](https://www.gatsbyjs.org))
1. `open http://localhost:8000` щоб відкрити сайт в браузері за замовчуванням

## Участь у проекті

### Рекомендації

<<<<<<< HEAD
Ця документація поділена на декілька частин з різними стилями та цілями. Якщо ви плануєте написати більше, ніж декілька речень, вам може бути корисно ознайомитись з [допоміжними вказівками (англ.)](https://github.com/reactjs/uk.reactjs.org/blob/master/CONTRIBUTING.md#guidelines-for-text) для відповідних розділів.
=======
The documentation is divided into several sections with a different tone and purpose. If you plan to write more than a few sentences, you might find it helpful to get familiar with the [contributing guidelines](https://github.com/reactjs/reactjs.org/blob/main/CONTRIBUTING.md#guidelines-for-text) for the appropriate sections.
>>>>>>> a08e1fd4b574a4d2d55e292af9eb01d55a526303

### Створення гілки

<<<<<<< HEAD
1. `git checkout master` в будь-якій директорії вашої локальної копії проекту `uk.reactjs.org`
1. `git pull origin master`, щоб пересвідчитись що у вас остання версія коду
1. `git checkout -b the-name-of-my-branch` (замініть `the-name-of-my-branch` на підходяще ім'я) для створення гілки
=======
1. `git checkout main` from any folder in your local `reactjs.org` repository
1. `git pull origin main` to ensure you have the latest main code
1. `git checkout -b the-name-of-my-branch` (replacing `the-name-of-my-branch` with a suitable name) to create a branch
>>>>>>> a08e1fd4b574a4d2d55e292af9eb01d55a526303

### Внесення змін

1. Дотримуйтесь інструкцій з розділу ["Запуск проекта локально"](#running-locally)
1. Збережіть файли і перевірте зміни в браузері
  1. Зміни до React-компонентів всередині `src` застосовуються відразу
  1. Зміни до файлів markdown всередині `content` застосовуються відразу
  1. При роботі з плагінами можливо знадобиться видалити директорію `.cache` та перезавантажити сервер

### Перевірка змін

1. Якщо можливо, перевіряйте всі візуальні зміни в усіх останніх версіях розповсюджених браузерів: настільних та мобільних.
1. Виконайте `yarn check-all` з кореневої директорії проекту. (Це виконає Prettier, ESLint та Flow.)

### Публікація змін

1. `git add -A && git commit -m "My message"` (замініть `My message` на назву коміту, наприклад `Fix header logo on Android`), для збереження ваших змін
1. `git push my-fork-name the-name-of-my-branch`
<<<<<<< HEAD
1. Перейдіть на [сторінку репозиторію uk.reactjs.org](https://github.com/reactjs/uk.reactjs.org) і ви повинні побачити нещодавно оновлені гілки.
1. Дотримуйтесь інструкцій на GitHub.
1. По можливості додайте знімок екрану ваших візуальних змін. Netlify створить сторінку для попереднього перегляду автоматично після створення PR для того, щоб інші люди могли бачити ваші зміни.
=======
1. Go to the [reactjs.org repo](https://github.com/reactjs/reactjs.org) and you should see recently pushed branches.
1. Follow GitHub's instructions.
1. If possible, include screenshots of visual changes. A preview build is triggered after your changes are pushed to GitHub.
>>>>>>> a08e1fd4b574a4d2d55e292af9eb01d55a526303

## Переклад

<<<<<<< HEAD
Якщо ви зацікавлені у перекладі `reactjs.org`, будь-ласка ознайомтесь з поточним прогресом перекладу на сторінці [isreacttranslatedyet.com](https://www.isreacttranslatedyet.com/).
=======
If you are interested in translating `reactjs.org`, please see the current translation efforts at [translations.reactjs.org](https://translations.reactjs.org/).
>>>>>>> a08e1fd4b574a4d2d55e292af9eb01d55a526303


Якщо переклад на вашу мову наразі не існує і ви б хотіли його створити, то дотримуйтесь інструкцій [Перекладу reactjs.org](https://github.com/reactjs/reactjs.org-translation#translating-reactjsorg).

## Вирішення проблем

- `yarn reset` для очищення локального кешу

## Ліцензія
Контент, наданий на [uk.reactjs.org](https://uk.reactjs.org/), надається по ліцензії CC-BY-4.0, як описано в файлі [LICENSE-DOCS.md](https://github.com/open-source-explorer/reactjs.org/blob/master/LICENSE-DOCS.md).
