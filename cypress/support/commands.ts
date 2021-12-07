// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
import "@testing-library/cypress/add-commands";

Cypress.Commands.add("assertSignIn", () => {
  cy.window().its("localStorage.token").should("be.a", "string");
});

Cypress.Commands.add("assertSignOut", () => {
  cy.window().its("localStorage.token").should("be.undefined");
});

Cypress.Commands.add("signIn", (email, password) => {
  cy.visit("/");
  cy.assertSignOut();
  cy.assertTitle("Sign In");
  cy.findByPlaceholderText(/email/i).type(email);
  cy.findByPlaceholderText(/password/i).type(password);
  cy.findByRole("button")
    .should("not.have.class", "pointer-events-none")
    .click();

  cy.assertSignIn();
});

Cypress.Commands.add("assertTitle", (title) => {
  cy.title().should("eq", `${title} | Uber Eats`);
});

declare global {
  namespace Cypress {
    interface Chainable {
      assertSignIn(): void;
      assertSignOut(): void;
      assertTitle(title: string): void;
      signIn(email: string, password: string): void;
    }
  }
}
