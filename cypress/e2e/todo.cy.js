describe("Todo creation tests", () => {
    beforeEach(() => {
        cy.loginAsAdmin(); // Ensure the user is logged in as admin
    });

    it("should create a todo with valid data", () => {
        // Intercept the POST request for creating a todo
        cy.intercept('POST', '/todo', {
            statusCode: 201,
            body: {
                message: 'Todo created successfully!',
                data: {
                    id: 1,
                    todoName: 'Test Todo',
                    description: 'This is a test todo',
                    dueDate: new Date().toISOString(),
                    isCompleted: false,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                }
            }
        }).as('createTodo');

        // Open the create todo modal
        cy.contains('Create Todo').click()

        // Fill the form (adjust selectors as needed)
        cy.getDataTest("todo-name-input").as('todoNameInput');
        cy.get('@todoNameInput')
            .type('Test Todo')
            .should('have.value', 'Test Todo');

        cy.getDataTest("todo-description-input").as('descriptionInput');
        cy.get('@descriptionInput')
            .type('This is a test todo')
            .should('have.value', 'This is a test todo');

        cy.getDataTest("todo-date-input").as('dueDateInput');
        cy.get('@dueDateInput')
            .type('2024-12-31')
            .should('have.value', '2024-12-31');

        cy.getDataTest("todo-userid-input").as('userIdInput');
        cy.get('@userIdInput')
            .type('1') // Assuming user ID 1 exists
            .should('have.value', '1');

        cy.getDataTest("todo-status-pending").as('statusPending');
        cy.get('@statusPending')
            .should('have.attr', 'type', 'radio')
            .check()
            .should('be.checked');

        // Submit the form
        cy.getDataTest("createtodo-submit-button").as('submitButton');
        cy.get('@submitButton')
            .should('contain.text', 'Create')
            .should('not.be.disabled')
            .click();

        // Wait for the intercepted request and assert
        cy.wait('@createTodo').then((interception) => {
            expect(interception.response.statusCode).to.eq(201);
            expect(interception.request.body).to.deep.include({
                todoName: 'Test Todo',
                description: 'This is a test todo',
                dueDate: '2024-12-31'
            });
        });



        // Assert success message
        cy.contains(/Todo created successfully/i, { timeout: 1000 });
    });
});