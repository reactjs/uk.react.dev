/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * @providesModule site-constants
 * @flow
 */

// NOTE: We can't just use `location.toString()` because when we are rendering
// the SSR part in node.js we won't have a proper location.
<<<<<<< HEAD
const urlRoot = 'https://uk.reactjs.org';
const version = '16.13.1';
=======
const urlRoot = 'https://reactjs.org';
const version = '17.0.2';
>>>>>>> f3baa6d075c8de475b688abf035d7054bc8a9606
const babelURL = 'https://unpkg.com/babel-standalone@6.26.0/babel.min.js';

export {babelURL, urlRoot, version};
