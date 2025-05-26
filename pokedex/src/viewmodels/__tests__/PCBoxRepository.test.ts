import { PCBoxRepository } from "../../data/repositories/PCBoxRepository";

describe("PCBoxRepository", () => {
  const repo = new PCBoxRepository();

  it("deve criar uma nova box com tipos definidos", async () => {
    const name = "Elétricos";
    const types = ["electric"];

    const created = await repo.addBox(name, types);
    const boxes = await repo.getBoxes();

    expect(boxes).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: "Elétricos", types: ["electric"] }),
      ])
    );
  });
});
