import { render } from "@testing-library/react";
import { Header } from "../header";
import { BrowserRouter as Router } from "react-router-dom";

describe("<Header />", () => {
  it("should render with props", () => {
    const { debug } = render(
      <Router>
        <Header />
      </Router>
    );
    debug();
  });
});
