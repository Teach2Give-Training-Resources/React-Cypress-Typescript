/* eslint-disable @typescript-eslint/no-namespace */
export { }
declare global {
    namespace Cypress {
        interface Chainable {
            getDataTest(value: string): Chainable<JQuery<HTMLElement>>;
            loginAsAdmin(email?: string, password?: string): Chainable<void>;
        }
    }
} 