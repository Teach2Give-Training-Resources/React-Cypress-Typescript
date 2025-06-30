/* eslint-disable @typescript-eslint/no-namespace */
export { }
declare global {
    namespace Cypress {
        interface Chainable {
            getDataTest(value: string): Chainable<JQuery<HTMLElement>>;
        }
    }
} //used to define custom commands in Cypress that can be used in tests
//the decalre global block extends the Cypress namespace to include a new method getDataTest
//this method takes a string value and returns a Chainable object that can be used to interact
//with elements in the DOM that have a data-test attribute matching the value passed to the method
//this allows for more readable and maintainable tests by using data-test attributes instead of relying on
//class names or IDs which may change over time