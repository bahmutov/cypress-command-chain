/// <reference types="cypress" />

import '../..'

it('confirms a value', () => {
  cy.wrap('hello').should('equal', 'hello')
  cy.log('done')
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

it.only('prints a number', () => {
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
