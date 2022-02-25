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
  console.log('command enqueued', command)
  if (el) {
    const commandEl = document.createElement('p')
    commandEl.style.opacity = 0.25
    commandEl.style.marginBottom = '4px'
    commandEl.dataset.chainerId = command.chainerId
    commandEl.dataset.commandName = command.name
    commandEl.dataset.finished = false
    commandEl.dataset.type === command.type
    if (command.type === 'assertion') {
      commandEl.style.color = '#07b282'
    }
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
    finishRunningCommandsBefore(commandEl)
    runningCommandEl = commandEl
    commandEl.scrollIntoView(false)
  } else {
    console.log('could not find command', command.attributes.name)
  }
})

function finishCommand(commandEl) {
  commandEl.style.opacity = 0.75
  commandEl.style.fontWeight = 'normal'
}

function finishRunningCommandsBefore(commandEl) {
  if (!commandEl) {
    return
  }

  // make all commands _before_ it as done
  // this is useful because the assertions do not get "start" or "end" events
  let el = commandEl
  while (el.previousSibling) {
    console.log('previous sibling')
    el = el.previousSibling
    if (el && el.dataset.finished === 'false') {
      finishCommand(el)
    }
  }
}

function finishRunningCommand() {
  finishRunningCommandsBefore(runningCommandEl)
  if (runningCommandEl) {
    finishCommand(runningCommandEl)
    runningCommandEl = null
  }
}

Cypress.on('command:end', (command) => {
  // console.log('command:end', command.attributes.name)
  finishRunningCommand()
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
