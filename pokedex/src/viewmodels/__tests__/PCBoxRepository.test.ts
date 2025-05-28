import { PCBoxRepository } from "../../data/repositories/PCBoxRepository";

describe("PCBoxRepository", () => {
  let repo: PCBoxRepository;

  beforeEach(() => {
    repo = new PCBoxRepository();
  });

  it("should create a new box with defined types", async () => {
    const name = "Elétricos";
    const types = ["electric"];

    const createdBox = await repo.addBox(name, types);
    const boxes = await repo.getBoxes();

    expect(createdBox).toEqual(expect.objectContaining({ name, types }));

    expect(boxes).toEqual(
      expect.arrayContaining([expect.objectContaining({ name, types })])
    );
  });
});
