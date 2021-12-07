describe("Edit Profile", () => {
  it("can go to /edit-profile using the header", () => {
    cy.signIn("test@google.com", "1234");
    cy.wait(1000);
    cy.get('a[href="/edit-profile"]').click();
    cy.assertTitle("Edit Profile");
  });
  it("can change email", () => {
    cy.intercept("POST", "http://localhost:4000/graphql", (req) => {
      const { operationName, variables } = req.body;
      if (operationName && operationName === "editProfile") {
        variables.input.email = "test@google.com";
        req.reply((res) => {
          res.send({ fixture: "user/edit-profile.json" });
        });
      }
    });
    cy.findByPlaceholderText(/email/i).clear().type("test1@google.com");
    cy.get(".button").click();
  });
});
