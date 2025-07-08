/// <reference types="cypress" />

describe('Todos CRUD E2E Test', () => {
    let todoName = `Cypress E2E Test Todo ${Date.now()}`;
    let updatedTodoName = `Updated Cypress Todo ${Date.now()}`;

    before(() => {
        cy.loginAsAdmin();
    });

    after(() => {
        // Clean up any todos created during the test
        cy.window().then((win) => {
            const token = win.localStorage.getItem('token');
            cy.request({
                method: 'GET',
                url: '/todos',
                headers: { Authorization: `Bearer ${token}` }
            }).then((resp) => {
                const todos = resp.body.data || [];
                const testTodos = todos.filter(todo =>
                    todo.todoName.includes('Cypress E2E Test Todo') ||
                    todo.todoName.includes('Updated Cypress Todo')
                );
                testTodos.forEach(todo => {
                    cy.request({
                        method: 'DELETE',
                        url: `/todo/${todo.id}`,
                        headers: { Authorization: `Bearer ${token}` }
                    });
                });
            });
        });
    });

    it('should create, update, and delete a todo (full CRUD)', () => {
        // CREATE
        cy.getDataTest('create-todo-button').click();
        cy.getDataTest('todo-name-input').type(todoName);
        cy.getDataTest('todo-description-input').type('This todo was created during Cypress testing.');
        cy.getDataTest('todo-userid-input').clear().type('4');
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const formattedTomorrow = tomorrow.toISOString().split('T')[0];
        cy.getDataTest('todo-date-input').type(formattedTomorrow);
        cy.getDataTest('todo-status-completed').click();
        cy.getDataTest('createtodo-submit-button').click();
        cy.contains(todoName).should('exist');

        // UPDATE
        cy.contains('tr', todoName, { timeout: 10000 }).should('exist').within(() => {
            cy.getDataTest('edit-todo-button').click();
        });
        cy.getDataTest('edit-todo-name-input').clear().type(updatedTodoName);
        cy.getDataTest('edit-todo-description-input').clear().type('Updated description.');
        const twoDaysLater = new Date();
        twoDaysLater.setDate(twoDaysLater.getDate() + 2);
        const formattedTwoDaysLater = twoDaysLater.toISOString().split('T')[0];
        cy.getDataTest('edit-todo-date-input').clear().type(formattedTwoDaysLater);
        cy.getDataTest('edit-todo-status-pending').click();
        cy.getDataTest('update-todo-button').click();
        cy.contains(updatedTodoName).should('exist');

        // DELETE
        cy.contains('tr', updatedTodoName).within(() => {
            cy.getDataTest('delete-todo-button').click();
        });
        cy.getDataTest('delete-todo-confirm-button').click();

        // Wait for the success message
        cy.contains('Todo deleted successfully', { timeout: 5000 }).should('be.visible');

        // Wait for the modal to disappear (if you have a modal)
        cy.getDataTest('delete-todo-modal').should('not.exist');

        // Optionally reload if your UI does not auto-refresh
        // cy.reload();

        // Now check the table for the row
        cy.get('table').should('exist');
        cy.get('tr').contains(updatedTodoName).should('not.exist');

        // Also check that no modal or toast contains the text
        cy.get('body').should('not.contain', updatedTodoName);
    });
});