/// <reference types="cypress" />

describe('Manage Workspaces', () => {
  beforeEach(() => {
    cy.loginAsAdmin();
  });

  it('should create a new workspace', () => {
    cy.visit('https://sent-io.site/admin/workspaces');
    cy.get('button').contains('New Workspace').click();
    cy.get('input[name="name"]').type('Test Workspace');
    cy.get('[name="description"]').type('This is a test workspace created by Cypress.');
    cy.get('button').contains('Create').click();
    // cy.get('.notification').should('contain', 'Workspace created successfully');
  });

  it('should edit an existing workspace', () => {
    cy.visit('https://sent-io.site/admin/workspaces');
    cy.get('button').contains('Edit').first().click();
    // cy.get('input[name="name"]').clear().type('Updated Workspace');
    // cy.get('button').contains('Save').click();
    // cy.get('.notification').should('contain', 'Workspace updated successfully');
  });
});
