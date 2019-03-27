# uk.reactjs.org

Цей репозиторій містить вихідний код та документацію для сайту [uk.reactjs.org](https://uk.reactjs.org/).

## Початок

### Передумови

1. Git
1. Node: будь-яка версія 8.x починаючи з 8.4.0 або вище
1. Yarn: Див. [сайт Yarn з інструкціями по встановленню](https://yarnpkg.com/uk/docs/install)
1. Зробити форк цього репозиторію (для пропозицій змін)
1. Клонувати [uk.reactjs.org repo](https://github.com/reactjs/uk.reactjs.org) на ваш компьютер

### Встановлення

1. `cd uk.reactjs.org` для переходу в кореневу директорію проекту
1. `yarn` для встановлення npm-залежностей проекту

### Запуск проекта локально

1. `yarn dev` для запуску сервера розробки з підтримкою гарячого перезавантаження (на основі [Gatsby](https://www.gatsbyjs.org))
1. `open http://localhost:8000` щоб відкрити сайт в браузері за замовченням

## Contributing

### Guidelines

The documentation is divided into several sections with a different tone and purpose. If you plan to write more than a few sentences, you might find it helpful to get familiar with the [contributing guidelines](https://github.com/reactjs/reactjs.org/blob/master/CONTRIBUTING.md#guidelines-for-text) for the appropriate sections.

### Create a branch

1. `git checkout master` from any folder in your local `reactjs.org` repository
1. `git pull origin master` to ensure you have the latest main code
1. `git checkout -b the-name-of-my-branch` (replacing `the-name-of-my-branch` with a suitable name) to create a branch

### Make the change

1. Follow the "Running locally" instructions
1. Save the files and check in the browser
  1. Changes to React components in `src` will hot-reload
  1. Changes to markdown files in `content` will hot-reload
  1. If working with plugins, you may need to remove the `.cache` directory and restart the server

### Test the change

1. If possible, test any visual changes in all latest versions of common browsers, on both desktop and mobile.
1. Run `yarn check-all` from the project root. (This will run Prettier, ESLint, and Flow.)

### Push it

1. `git add -A && git commit -m "My message"` (replacing `My message` with a commit message, such as `Fixed header logo on Android`) to stage and commit your changes
1. `git push my-fork-name the-name-of-my-branch`
1. Go to the [reactjs.org repo](https://github.com/reactjs/reactjs.org) and you should see recently pushed branches.
1. Follow GitHub's instructions.
1. If possible, include screenshots of visual changes. A Netlify build will also be automatically created once you make your PR so other people can see your change.

## Translation

If you are interested in translating `reactjs.org`, please see the current translation efforts at [isreacttranslatedyet.com](https://www.isreacttranslatedyet.com/).


If your language does not have a translation and you would like to create one, please follow the instructions at [reactjs.org Translations](https://github.com/reactjs/reactjs.org-translation#translating-reactjsorg).

## Troubleshooting

- `yarn reset` to clear the local cache

## License
Content submitted to [reactjs.org](https://reactjs.org/) is CC-BY-4.0 licensed, as found in the [LICENSE-DOCS.md](https://github.com/open-source-explorer/reactjs.org/blob/master/LICENSE-DOCS.md) file.
