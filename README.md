# cypress-command-chain ![cypress version](https://img.shields.io/badge/cypress-11.1.0-brightgreen)

Watch the video [Cypress Command Chain Plugin Introduction](https://youtu.be/K5x2oXWsWqI) and read the blog posts [Visualize Cypress Command Queue](https://glebbahmutov.com/blog/visualize-cypress-command-queue/) and [Cypress Cannot Add Out-Of-Band Commands](https://glebbahmutov.com/blog/cypress-out-of-band/).

- 🎓 See the course [Cypress Plugins](https://cypress.tips/courses/cypress-plugins)
- 🎓 See the course [Cypress Network Testing Exercises](https://cypress.tips/courses/network-testing)

## Install

```
# install using NPM
$ npm i -D cypress-command-chain
# or install using Yarn
$ yarn add -D cypress-command-chain
```

## Use

In the spec or in the support file import this package

```js
import 'cypress-command-chain'
```

This plugin adds a queue list to the Cypress Command Log, showing all commands (finished, current, and enqueued) for the current test.

![Command queue](./images/queue.png)

## Small print

Author: Gleb Bahmutov &lt;gleb.bahmutov@gmail.com&gt; &copy; 2022

- [@bahmutov](https://twitter.com/bahmutov)
- [glebbahmutov.com](https://glebbahmutov.com)
- [blog](https://glebbahmutov.com/blog)
- [videos](https://www.youtube.com/glebbahmutov)
- [presentations](https://slides.com/bahmutov)
- [cypress.tips](https://cypress.tips)
- [Cypress Tips & Tricks Newsletter](https://cypresstips.substack.com/)
- [my Cypress courses](https://cypress.tips/courses)

License: MIT - do anything with the code, but don't blame me if it does not work.

Support: if you find any problems with this module, email / tweet /
[open issue](https://github.com/bahmutov/cypress-command-chain/issues) on Github

## MIT License

Copyright (c) 2022 Gleb Bahmutov &lt;gleb.bahmutov@gmail.com&gt;

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
