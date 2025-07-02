/// <reference types="cypress" />

// ***********************************************
Cypress.Commands.add('getDataTest', (dataTestSelector) => {
    return cy.get(`[data-test="${dataTestSelector}"]`)
})


//login Admin user
Cypress.Commands.add('loginAsAdmin', (email = 'bkemboi590@gmail.com', password = 'mypassword123') => {
    cy.visit('/login')
    cy.getDataTest('login-email-input').type(email)
    cy.getDataTest('login-password-input').type(password)
    cy.getDataTest('login-submit-button').click()
    cy.url().should('include', '/admin/dashboard/todos').as('adminDashboardUrl').as('adminDashboardUrl')
    // Welcome to your Admin dashboard - contains
    cy.get('body').should('contain.text', 'Welcome to your Admin dashboard') //body is the root element of the page

})