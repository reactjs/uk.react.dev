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
const version = '18.2.0';
>>>>>>> b0ccb47f33e52315b0ec65edb9a49dc4910dd99c
const babelURL = 'https://unpkg.com/babel-standalone@6.26.0/babel.min.js';

export {babelURL, urlRoot, version};
