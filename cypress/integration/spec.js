/// <reference types="cypress" />

// TODO: handle functions etc
const stringify = (args) => {
  return args
    .map((x) => {
      if (typeof x === 'function') {
        return (x.name ? x.name : 'cb') + '()'
      }
      if (typeof x === 'undefined') {
        return 'undefined ⚠️'
      }
      if (typeof x === 'string') {
        return `"${x}"`
      }
      return x
    })
    .join(', ')
}

Cypress.on('command:enqueued', (command) => {
  // console.log('command enqueued', command)
  if (el) {
    const commandEl = document.createElement('p')
    commandEl.style.opacity = 0.25
    commandEl.style.marginBottom = '4px'
    commandEl.dataset.chainerId = command.chainerId
    commandEl.dataset.commandName = command.name
    commandEl.dataset.finished = false
    // console.log('chainer', command.chainerId)
    const text = document.createTextNode(
      command.name + ' ' + stringify(command.args),
    )
    commandEl.appendChild(text)
    el.appendChild(commandEl)
  }
})

function findCommandElement(command) {
  if (!el) {
    return
  }
  const commandEl = Cypress._.find(el.children, (x) => {
    return (
      x.dataset.chainerId === command.attributes.chainerId &&
      x.dataset.finished === 'false' &&
      x.dataset.commandName === command.attributes.name
    )
  })

  if (!commandEl) {
    console.warn('did not find command', command.attributes.name)
  }
  return commandEl
}

// Cypress.on('command:retry', (command) => {
//   console.log('command:retry', command.attributes.name)
// })

Cypress.on('command:start', (command) => {
  // console.log('command:start', command.attributes.name)

  const commandEl = findCommandElement(command)
  if (commandEl) {
    commandEl.style.opacity = 1
    commandEl.style.fontWeight = 'bold'
    commandEl.dataset.finished = true
    runningCommandEl = commandEl
    commandEl.scrollIntoView(false)
  } else {
    console.log('could not find command', command.attributes.name)
  }
})

Cypress.on('command:end', (command) => {
  // console.log('command:end', command.attributes.name)

  if (runningCommandEl) {
    runningCommandEl.style.opacity = 0.75
    runningCommandEl.style.fontWeight = 'normal'
    runningCommandEl = null
  }
})

let el
let runningCommandEl

before(() => {
  if (el) {
    return
  }
  el = window.top.document.querySelector('#command-queue')
  if (el) {
    return
  }

  const reporter = window.top.document.querySelector('.reporter .container')
  el = document.createElement('p')
  el.id = 'command-queue'
  el.style.fontSize = '1.2em'
  el.style.paddingLeft = '12px'
  el.style.paddingTop = '6px'
  el.style.marginBottom = 0
  el.style.maxHeight = '250px'
  el.style.overflowY = 'scroll'
  const text = document.createTextNode('Hello there')
  el.appendChild(text)

  if (reporter.children.length > 0) {
    reporter.insertBefore(el, reporter.children[0])
  } else {
    reporter.appendChild(el)
  }
})

beforeEach(() => {
  if (el) {
    while (el.firstChild) el.removeChild(el.firstChild)
  }
})

it('confirms a value', () => {
  cy.wrap('hello').should('equal', 'hello')
})

it('logs values', () => {
  cy.log('hello')
  cy.log('hello', 'world')
  cy.log('hello %d', 42)
  cy.wait(2000).then(() => {
    cy.log('After the wait')
    cy.wait(1000)
    cy.log('waited')
  })
})

it('prints a number', () => {
  cy.wait(1000)
  cy.visit('/')
  cy.wait(1000)
  let n
  cy.get('#projects-count')
    .invoke('text')
    .should('match', /^\d+/)
    .wait(2000)
    .then((text) => {
      n = text.split(' ')[0]
    })
  cy.log(n).wait(1000)
  // Cypress._.times(100, () => {
  //   cy.wrap(1).should('be.equal', 1)
  // })
})
