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
})

it('correctly prints the number in then cb', () => {
  cy.visit('/')
  cy.get('#projects-count').invoke('text').should('match', /^\d+/).then(cy.log)
})

it.skip('has a long queue of commands', () => {
  Cypress._.times(100, () => {
    cy.wrap(1).should('be.equal', 1)
  })
})

it('passes after retries', () => {
  const person = {
    work: 'company',
    age: 20,
    position: 'developer',
  }
  setTimeout(() => {
    person.name = 'Joe'
  }, 2000)
  cy.wrap(person).should('have.property', 'name', 'Joe')
  cy.wrap(20).should('be.equal', 20)
})

it('shows the should assertion', () => {
  cy.wrap(10).should('be.equal', 10)
})

it.skip('fails', () => {
  cy.wrap(20, { timeout: 0 }).should('be.equal', 21)
})

it.skip('fails after retries', () => {
  // first chain passes
  cy.wrap('first').wait(1000).should('be.equal', 'first')
  // second chain fails
  cy.wrap(20).wait(1000).should('be.equal', 21)
})

it('inserts new commands at the right place', () => {
  cy.wait(2000)
  cy.wait(2000)
    .then(() => {
      cy.log('inserted new commands').wait(3000)
      cy.log('.then callback finished')
    })
    .wait(2000)
})

it('lots of assertions at the end', () => {
  cy.wrap(200)
    .should('be.equal', 200)
    .and('be.a', 'number')
    .and('be.within', 199, 201)
    .and('be.a', 'number')
    .and('be.within', 199, 201)
    .and('be.a', 'number')
    .and('be.within', 199, 201)
    .and('be.a', 'number')
    .and('be.within', 199, 201)
    .and('be.a', 'number')
    .and('be.within', 199, 201)
    .and('be.a', 'number')
    .and('be.within', 199, 201)
})
