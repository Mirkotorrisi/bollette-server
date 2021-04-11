const request = require("supertest");
let server;

describe("GET championships/championship ", () => {
  beforeEach(() => (server = require("../api")));
  afterEach(() => server.close());
  it("should return a list of serie a matches with final result odds", async () => {
    const res = await request(server).get("/championships/serie_a/h2h");
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    res.body.map((item) => {
      expect(item.teams.length).toBeGreaterThan(0);
      expect(item.odds["1"]).toBeDefined();
      expect(item.odds["X"]).toBeDefined();
      expect(item.odds["2"]).toBeDefined();
    });
  });
  it("should return a list of serie a matches with total number of goals odds", async () => {
    const res = await request(server).get("/championships/serie_a/totals");
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    res.body.map((item) => {
      expect(item.teams.length).toBeGreaterThan(0);
      expect(item.odds["over"]).toBeDefined();
      expect(item.odds["under"]).toBeDefined();
    });
  });
});
