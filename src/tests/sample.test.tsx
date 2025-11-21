import { render, screen } from "@testing-library/react";

function Sample() {
  return <h1>SparkPlan Ready</h1>;
}

test("renders sample component", () => {
  render(<Sample />);
  expect(screen.getByText("SparkPlan Ready")).toBeInTheDocument();
});
