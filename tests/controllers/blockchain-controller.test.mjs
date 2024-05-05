import { test, expect, describe } from "vitest";
import { endpoint, http } from "../../config/settings.mjs";

describe("Blockchain Controller Test", () => {
  test("Get /api/v1/blockchain", async () => {
    const response = await fetch(http[5001] + endpoint.blockchain, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.statusCode).toBe(200);
    expect(data.data).toBeTypeOf("object");
    expect(data.data).toHaveProperty("chain");
  });
});
