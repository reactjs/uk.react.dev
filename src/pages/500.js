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
    <Page toc={[]} routeTree={sidebarLearn} meta={{title: 'Щось не так'}}>
      <MaxWidth>
        <Intro>
          <P>Щось дуже не так.</P>
          <P>Вибачте за це.</P>
          <P>
            На бажання, будь ласка{', '}
            <A href="https://github.com/reactjs/react.dev/issues/new">
              повідомте про помилку.
            </A>
          </P>
        </Intro>
      </MaxWidth>
    </Page>
  );
}
