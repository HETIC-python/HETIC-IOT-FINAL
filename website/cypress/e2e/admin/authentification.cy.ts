describe('Admin Authentication', () => {
  it('should log in admin using custom command', () => {
    cy.loginAsAdmin();
    
    cy.url().should('include', '/admin');
    cy.contains('Admin Dashboard').should('be.visible'); 
  });
});
