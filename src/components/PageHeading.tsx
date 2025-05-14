/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import Breadcrumbs from 'components/Breadcrumbs';
import Tag from 'components/Tag';
import {H1} from './MDX/Heading';
import type {RouteTag, RouteItem} from './Layout/getRouteMeta';
import * as React from 'react';
import {IconCanary} from './Icon/IconCanary';
import {IconExperimental} from './Icon/IconExperimental';

interface PageHeadingProps {
  title: string;
  version?: 'experimental' | 'canary';
  experimental?: boolean;
  status?: string;
  description?: string;
  tags?: RouteTag[];
  breadcrumbs: RouteItem[];
}

function PageHeading({
  title,
  status,
  version,
  tags = [],
  breadcrumbs,
}: PageHeadingProps) {
  console.log('version', version);
  return (
    <div className="px-5 sm:px-12 pt-3.5">
      <div className="max-w-4xl ms-0 2xl:mx-auto">
        {breadcrumbs ? <Breadcrumbs breadcrumbs={breadcrumbs} /> : null}
        <H1 className="mt-0 text-primary dark:text-primary-dark -mx-.5 break-words">
          {title}
          {version === 'canary' && (
            <IconCanary
<<<<<<< HEAD
              title=" - ця функція доступна в останній canary-версії"
=======
              title=" - This feature is available in the latest Canary version of React"
              className="ms-4 mt-1 text-gray-50 dark:text-gray-40 inline-block w-6 h-6 align-[-1px]"
            />
          )}
          {version === 'experimental' && (
            <IconExperimental
              title=" - This feature is available in the latest Experimental version of React"
>>>>>>> a3e9466dfeea700696211533a3570bc48d7bc3d3
              className="ms-4 mt-1 text-gray-50 dark:text-gray-40 inline-block w-6 h-6 align-[-1px]"
            />
          )}
          {status ? <em>—{status}</em> : ''}
        </H1>
        {tags?.length > 0 && (
          <div className="mt-4">
            {tags.map((tag) => (
              <Tag key={tag} variant={tag as RouteTag} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default PageHeading;
