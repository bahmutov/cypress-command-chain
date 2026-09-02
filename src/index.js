/// <reference types="cypress" />

const pluginLabel = 'cypress-command-chain'

// TODO: handle functions etc
const stringify = (args) => {
  if (!Array.isArray(args)) {
    return ''
  }

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
      if (Cypress._.isPlainObject(x)) {
        const s = JSON.stringify(x)
        if (s.length > 200) {
          return s.slice(0, 200) + '...'
        }
        return s
      }
      return Cypress.utils.stringify(x)
    })
    .join(', ')
}

const COLORS = {
  assertions: {
    pending: '#7eb0db',
    passing: '#07b282',
    failed: '#cc3943',
  },
}

Cypress.on('command:enqueued', (command) => {
  // console.log('command enqueued', command)
  if (!el) {
    return
  }
  const commandEl = document.createElement('p')
  commandEl.style.opacity = 0.25
  commandEl.style.marginBottom = '4px'
  commandEl.dataset.chainerId = command.chainerId
  commandEl.dataset.commandName = command.name
  commandEl.dataset.finished = false
  commandEl.dataset.commandType = command.type
  if (command.type === 'assertion') {
    commandEl.style.color = COLORS.assertions.pending
  }
  // console.log('chainer', command.chainerId)
  const commandText = command.name + ' ' + stringify(command.args)
  const text = document.createTextNode(
    command.type === 'assertion' ? ' - ' + commandText : commandText,
  )
  commandEl.appendChild(text)

  // insert the command at the right place
  if (runningCommandEl && nextScheduledCommandEl) {
    nextScheduledCommandEl.insertAdjacentElement('beforebegin', commandEl)
  } else {
    // there are no running commands, just
    // add the new command to the back of the queue
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
    nextScheduledCommandEl = commandEl.nextElementSibling
    commandEl.scrollIntoView(false)
  } else {
    console.warn(
      '%s: could not find command',
      pluginLabel,
      command.attributes.name,
    )
  }
})

function finishCommand(commandEl, failed) {
  if (failed) {
    commandEl.style.color = COLORS.assertions.failed
  }

  if (commandEl.dataset.commandType === 'assertion') {
    commandEl.style.color = failed
      ? COLORS.assertions.failed
      : COLORS.assertions.passing
  }
  commandEl.style.opacity = 0.75
  commandEl.style.fontWeight = 'normal'
  commandEl.scrollIntoView(false)
}

function finishRunningCommandsBefore(commandEl) {
  if (!commandEl) {
    return
  }

  // make all commands _before_ it as done
  // this is useful because the assertions do not get "start" or "end" events
  let el = commandEl
  while (el.previousSibling) {
    // console.log('previous sibling')
    el = el.previousSibling
    if (el && el.dataset.finished === 'false') {
      finishCommand(el)
    }
  }
}

function findReporterContainer() {
  // different versions of Cypress has different reporter structure
  let reporter = window.top.document.querySelector('.reporter .container')

  if (!reporter) {
    // trying reporter iframe (Cypress 15.21.0)
    const frame = window.top.document.querySelector('#reporter-frame')
    if (frame) {
      reporter = frame.contentDocument.querySelector('.reporter .container')
    }
  }

  return reporter
}

function finishRunningCommand(failed) {
  finishRunningCommandsBefore(runningCommandEl)
  if (runningCommandEl) {
    finishCommand(runningCommandEl, failed)

    // when finishing a command, finish all directly attached assertions
    let el = runningCommandEl
    // console.log(el.nextElementSibling.dataset)
    while (
      el.nextElementSibling &&
      el.nextElementSibling.dataset.commandType === 'assertion'
    ) {
      finishCommand(el.nextElementSibling, failed)
      el = el.nextSibling
    }

    // make sure to scroll to the command when finishing it
    runningCommandEl = null
    nextScheduledCommandEl = null
  }
}

Cypress.on('command:end', (command) => {
  // console.log('command:end', command.attributes.name)
  finishRunningCommand()
})

Cypress.on('test:after:run', (current) => {
  // console.log('test:after:run', current)
  const failed = current.state === 'failed'
  finishRunningCommand(failed)
})

let el
let runningCommandEl
// when a command starts, this is the next command to run
// used to queue more commands if the running command requires
let nextScheduledCommandEl

before(() => {
  if (el) {
    return
  }

  const reporter = findReporterContainer()
  if (!reporter) {
    console.warn('%s: could not find reporter element', pluginLabel)
    return
  }

  el = reporter.querySelector('#command-queue')
  if (el) {
    // our custom element already exists, do not create it again
    return
  }

  el = document.createElement('p')
  el.id = 'command-queue'
  el.style.fontSize = '1.2em'
  el.style.paddingLeft = '12px'
  el.style.paddingTop = '6px'
  el.style.marginBottom = 0
  el.style.maxHeight = '250px'
  el.style.overflowY = 'scroll'

  if (reporter.children.length > 0) {
    reporter.insertBefore(el, reporter.children[0])
  } else {
    reporter.appendChild(el)
  }
})

beforeEach(() => {
  if (el) {
    // clear our custom element before each test
    while (el.firstChild) el.removeChild(el.firstChild)
  }
})
