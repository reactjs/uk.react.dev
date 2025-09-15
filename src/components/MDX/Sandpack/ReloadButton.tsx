/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import * as React from 'react';
import {IconRestart} from '../../Icon/IconRestart';
export interface ReloadButtonProps {
  onReload: () => void;
}

export function ReloadButton({onReload}: ReloadButtonProps) {
  return (
    <button
      className="text-sm text-primary dark:text-primary-dark inline-flex items-center hover:text-link duration-100 ease-in transition mx-1"
<<<<<<< HEAD:src/components/MDX/Sandpack/ResetButton.tsx
      onClick={onReset}
      title="Почати пісочницю наново"
      type="button">
      <IconRestart className="inline mx-1 relative" /> Скинути
=======
      onClick={onReload}
      title="Keep your edits and reload sandbox"
      type="button">
      <IconRestart className="inline mx-1 relative" />
      <span className="hidden md:block">Reload</span>
>>>>>>> a5181c291f01896735b65772f156cfde34df20ee:src/components/MDX/Sandpack/ReloadButton.tsx
    </button>
  );
}
