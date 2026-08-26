import { describe, it, expect } from "vitest";
import {
  extractCarrier,
  extractOrderRef,
  extractReturnId,
} from "@/lib/parser/carrier";

describe("extractCarrier", () => {
  it("identifies Evri", () => {
    expect(extractCarrier("Your Evri return label is attached")).toBe("evri");
  });

  it("identifies Hermes as Evri", () => {
    expect(extractCarrier("Drop at your local Hermes ParcelShop")).toBe("evri");
  });

  it("identifies Royal Mail", () => {
    expect(extractCarrier("Take it to a Royal Mail postbox")).toBe("royal-mail");
  });

  it("identifies InPost", () => {
    expect(extractCarrier("Scan the QR at any InPost locker")).toBe("inpost");
  });

  it("is case insensitive", () => {
    expect(extractCarrier("YOUR DPD LABEL")).toBe("dpd");
  });

  it("returns null when no carrier is named", () => {
    expect(extractCarrier("Thanks for your order")).toBeNull();
  });
});

describe("extractOrderRef", () => {
  it("extracts a labelled order number", () => {
    expect(extractOrderRef("Order number: 401234567")).toBe("401234567");
  });

  it("handles the hash form", () => {
    expect(extractOrderRef("Order #AB-123456")).toBe("AB-123456");
  });

  it("returns null when absent", () => {
    expect(extractOrderRef("Thanks for shopping")).toBeNull();
  });

  it("handles a fullwidth colon", () => {
    // SHEIN's UK templates use U+FF1A, not an ASCII colon.
    expect(extractOrderRef("Order number：GSO187019000B2Y")).toBe(
      "GSO187019000B2Y",
    );
  });
});

describe("reference tokens must contain a digit", () => {
  it("does not mistake a following word for a return ID", () => {
    // "return your item" must not yield "your" — a reference always has
    // at least one digit in it.
    expect(extractReturnId("Please return your item by Friday")).toBeNull();
  });

  it("does not mistake a following word for an order ref", () => {
    expect(extractOrderRef("Please order more soon")).toBeNull();
  });
});

describe("extractReturnId", () => {
  it("extracts a labelled return ID", () => {
    expect(extractReturnId("Return ID: RTN-88213004")).toBe("RTN-88213004");
  });

  it("handles the RMA phrasing", () => {
    expect(extractReturnId("RMA number: 55512")).toBe("55512");
  });

  it("returns null when absent", () => {
    expect(extractReturnId("Your parcel is on its way")).toBeNull();
  });
});

describe("real-world reference formats", () => {
  it("handles Temu's 'Order ID:' phrasing", () => {
    expect(
      extractOrderRef("Return ID: PO-210-08628606700151400-D03 Order ID: PO-210-08628606700151400"),
    ).toBe("PO-210-08628606700151400");
  });

  it("extracts the return ID from the same Temu line", () => {
    expect(
      extractReturnId("Return ID: PO-210-08628606700151400-D03 Order ID: PO-210-08628606700151400"),
    ).toBe("PO-210-08628606700151400-D03");
  });
});
