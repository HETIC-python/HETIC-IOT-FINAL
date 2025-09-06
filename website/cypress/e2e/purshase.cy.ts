/// <reference types="cypress" />

describe('Purchase Flow', () => {
  it('should complete the purchase flow with shipping information', () => {
    cy.visit('https://sent-io.site');
    cy.get('.grid > .text-center > .flex > a > .inline-flex').click();
    cy.get('.px-8').click();
    cy.get('.space-y-4 > .grid > :nth-child(1) > .w-full').type('John'); 
    cy.get('.grid > :nth-child(2) > .w-full').type('Doe');
    cy.get('.space-y-4 > :nth-child(2) > .w-full').type('john.doe@example.com'); 
    cy.get('.space-y-4 > :nth-child(3) > .w-full').type('1234567890');
    cy.get(':nth-child(4) > .w-full').type('102 Route de la Pyramide, Paris, France');
   
    cy.get('.pac-container').should('be.visible')
      .find('.pac-item')
      .first()
      .click();

    cy.get('.px-6').click();
    
    
    // cy.url().should('include', 'checkout.stripe.com');
  });
});