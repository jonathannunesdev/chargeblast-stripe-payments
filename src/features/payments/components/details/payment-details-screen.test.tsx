import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { Providers } from "@/app/providers";

import { PaymentDetailsScreen } from "./payment-details-screen";

const params = { id: "" };
vi.mock("next/navigation", () => ({
  useParams: () => params,
  useRouter: () => ({ push: vi.fn() }),
}));

function renderDetails(id: string) {
  params.id = id;
  render(
    <Providers>
      <PaymentDetailsScreen />
    </Providers>,
  );
}

describe("PaymentDetailsScreen", () => {
  beforeEach(() => {
    params.id = "";
  });

  it("shows the payment with its timeline", async () => {
    renderDetails("pi_3kMg5AEfd5tYxm9rM6ynPK98");

    expect(
      await screen.findByRole("heading", { level: 1, name: /\$9\.88 USD/ }),
    ).toBeInTheDocument();
    expect(screen.getByText("Payment failed")).toBeInTheDocument();
    expect(screen.getByText("Transaction not allowed")).toBeInTheDocument();
    expect(screen.getByText("Payment started")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Metadata" }),
    ).toBeInTheDocument();
    expect(screen.getByText("pi_3kMg5AEfd5tYxm9rM6ynPK98")).toBeInTheDocument();
  });

  it("explains when the payment does not exist", async () => {
    renderDetails("pi_unknown");

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "No payment matches pi_unknown",
    );
  });
});
