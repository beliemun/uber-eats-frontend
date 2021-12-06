describe("<SignInScreen />", () => {
  it("should go to Sign In Screen", () => {
    cy.visit("http://localhost:3000")
      .title()
      .should("eq", "Sign In | Uber Eats");
  });
  it("can see email, password validation erorrs", () => {
    cy.visit("/");
    cy.findByPlaceholderText(/email/i).type("test@test");
    cy.findByRole("alert").should("have.text", "• It must be in email format.");
    cy.findByPlaceholderText(/email/i).clear().type("client@google.com");
    cy.findByPlaceholderText(/password/i).type("123");
    cy.findByRole("alert").should(
      "have.text",
      "• Password should be longer than 4."
    );
  });
  it("can fill out the form", () => {
    cy.visit("/");
    cy.findByPlaceholderText(/email/i).type("client@google.com");
    cy.findByPlaceholderText(/password/i).type("1234");
    cy.findByRole("button")
      .should("not.have.class", "pointer-events-none")
      .click();
    cy.window().its("localStorage.token").should("be.a", "string");
  });
});
