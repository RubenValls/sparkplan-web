import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import DonationCard from "../DonationCard";

const messages = {
  DONATION: {
    TITLE: "Support SparkPlan",
    DESCRIPTION: "Help keep this project free and open",
    BUTTON: "Donate via PayPal"
  }
};

const renderComponent = (props = {}) => {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <DonationCard {...props} />
    </NextIntlClientProvider>
  );
};

describe("DonationCard", () => {
  it("should render with default email", () => {
    const { container } = renderComponent();
    
    const businessInput = container.querySelector('input[name="business"]') as HTMLInputElement;
    
    expect(businessInput?.value).toBe("r.vallsaparici@gmail.com");
  });

  it("should render with custom email", () => {
    const { container } = renderComponent({ email: "custom@email.com" });
    
    const businessInput = container.querySelector('input[name="business"]') as HTMLInputElement;
    
    expect(businessInput?.value).toBe("custom@email.com");
  });

  it("should render translated texts", () => {
    renderComponent();
    
    expect(screen.getByText("Support SparkPlan")).toBeInTheDocument();
    expect(screen.getByText("Help keep this project free and open")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Donate via PayPal" })).toBeInTheDocument();
  });

  it("should configure PayPal form correctly", () => {
    const { container } = renderComponent();
    
    const form = container.querySelector("form") as HTMLFormElement;
    const currencyInput = container.querySelector('input[name="currency_code"]') as HTMLInputElement;
    const recurringInput = container.querySelector('input[name="no_recurring"]') as HTMLInputElement;
    
    expect(form.action).toBe("https://www.paypal.com/donate");
    expect(form.method).toBe("post");
    expect(form.target).toBe("_blank");
    expect(currencyInput?.value).toBe("EUR");
    expect(recurringInput?.value).toBe("0");
  });

  it("should render submit button with correct attributes", () => {
    const { container } = renderComponent();
    
    const button = screen.getByRole("button", { name: "Donate via PayPal" });
    const icon = button.querySelector("svg");
    
    expect(button).toHaveAttribute("type", "submit");
    expect(button).toHaveAttribute("aria-label", "Donate via PayPal");
    expect(icon).toBeInTheDocument();
  });
});