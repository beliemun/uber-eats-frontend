describe("Sign Up", () => {
  it("should see email, password validation errors", () => {
    cy.visit("/");
    cy.findByText(/create an account/i).click();
    cy.findByPlaceholderText(/email/i).type("test@test");
    cy.findByRole("alert").should("have.text", "• It must be in email format.");
    cy.findByPlaceholderText(/email/i).clear().type("test@google.com");
    cy.findByPlaceholderText(/password/i).type("123");
    cy.findByRole("alert").should(
      "have.text",
      "• Password should be longer than 4."
    );
  });
  it("should be able to create account and sign in", () => {
    cy.intercept("http://localhost:4000/graphql", (req) => {
      const { operationName } = req.body;
      if (operationName && operationName === "createAccountMutation") {
        req.reply((res) => {
          res.send({
            data: {
              createAccount: {
                ok: true,
                error: null,
                __typename: "CreateAccountOutput",
              },
            },
          });
        });
      }
    });
    cy.visit("/sign-up");
    cy.findByPlaceholderText(/email/i).type("test@google.com");
    cy.findByPlaceholderText(/password/i).type("1234");
    cy.findByRole("button").click();
    // sign-up 에서 sign-in 페이지로 이동하는 시간을 기다려준다.
    cy.wait(1000);
    cy.signIn("test@google.com", "1234");
  });
});
