/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import {Page} from 'components/Layout/Page';
import {MDXComponents} from 'components/MDX/MDXComponents';
import sidebarLearn from '../sidebarLearn.json';

const {Intro, MaxWidth, p: P, a: A} = MDXComponents;

export default function NotFound() {
  return (
    <Page toc={[]} meta={{title: 'Не знайдено'}} routeTree={sidebarLearn}>
      <MaxWidth>
        <Intro>
          <P>Цієї сторінки немає.</P>
          <P>
            Якщо це помилка{', '}
            <A href="https://github.com/reactjs/react.dev/issues/new">
              напишіть нам
            </A>
            {', '}і ми спробуємо це виправити!
          </P>
        </Intro>
      </MaxWidth>
    </Page>
  );
}
