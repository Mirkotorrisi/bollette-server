const request = require("supertest");
const jwt = require("jsonwebtoken");
const config = require("config");
let server;
const getMultiplier = (ticket) => {
  let res = 1;
  ticket.map((item) => {
    res *= item.odd;
  });
  return res;
};

// describe("POST /bets ", () => {
//   beforeEach(() => (server = require("../api")));
//   afterEach(() => {
//     server.close();
//   });
//   it("should put some bets on selected matches", async () => {
//     const retrieveMatches = await request(server).get("/championships/serie_a");
//     const firstCall = await request(server)
//       .post("/bets")
//       .send({ match: "0", odd: "1" });
//     let ticket_id = firstCall.body.checkout.ticket_id;
//     await request(server).post("/bets").send({ match: 1, odd: "1", ticket_id });
//     await request(server).post("/bets").send({ match: 2, odd: "1", ticket_id });
//     const res = await request(server)
//       .post("/bets")
//       .send({ match: 3, odd: "1", ticket_id });
//     expect(res.status).toBe(200);
//     expect(res.body.ticket.length).toBe(4);
//     res.body.ticket.map((item) => {
//       expect(item.teams.length).toBe(2);
//       expect(item.start).toBeDefined();
//       expect(item.result).toMatch("1");
//       expect(item.odd).toBeGreaterThan(0);
//     });
//     expect(res.body.checkout).toMatchObject({
//       multiplier: getMultiplier(res.body.ticket),
//     });
//   });
//   it("should put only the last bet when the same match is selected more than once ", async () => {
//     const firstCall = await request(server)
//       .post("/bets")
//       .send({ match: 0, odd: "1" });
//     let ticket_id = firstCall.body.checkout.ticket_id;
//     await request(server).post("/bets").send({ match: 0, odd: "2", ticket_id });
//     await request(server).post("/bets").send({ match: 0, odd: "X", ticket_id });
//     const res = await request(server)
//       .post("/bets")
//       .send({ match: 0, odd: "2", ticket_id });
//     expect(res.status).toBe(200);
//     expect(res.body.ticket.length).toBe(1);
//     res.body.ticket.map((item) => {
//       expect(item.teams.length).toBe(2);
//       expect(item.start).toBeDefined();
//       expect(item.result).toBeDefined();
//       expect(item.odd).toBeGreaterThan(0);
//     });
//     expect(res.body.checkout).toMatchObject({
//       multiplier: getMultiplier(res.body.ticket),
//     });
//   });
//   it("should return error when the invalid parameters are passed ", async () => {
//     const res = await request(server)
//       .post("/bets")
//       .send({ match: "parameters", odd: "invalid" });
//     expect(res.status).toBe(400);
//     expect(res.text).toMatch("Not a valid bet");
//   });
// });
// describe("DELETE /bets ", () => {
//   beforeEach(() => (server = require("../api")));
//   afterEach(() => {
//     server.close();
//   });
//   it("should delete selected bet", async () => {
//     let res = await request(server).post("/bets").send({ match: 0, odd: "1" });
//     await request(server)
//       .post("/bets")
//       .send({ match: 1, odd: "1", ticket_id: res.body.checkout.ticket_id });
//     await request(server)
//       .post("/bets")
//       .send({ match: 2, odd: "1", ticket_id: res.body.checkout.ticket_id });
//     await request(server)
//       .post("/bets")
//       .send({ match: 3, odd: "1", ticket_id: res.body.checkout.ticket_id });
//     await request(server)
//       .post("/bets")
//       .send({ match: 4, odd: "1", ticket_id: res.body.checkout.ticket_id });
//     res = await request(server)
//       .post("/bets")
//       .send({ match: 5, odd: "1", ticket_id: res.body.checkout.ticket_id });
//     res.body.ticket.map(
//       async (_, i) =>
//         await request(server).delete("/bets").send({
//           match: i,
//           ticket_id: res.body.ticket_id,
//         })
//     );
//     res = await request(server).post("/bets").send({ match: 0, odd: "1" });
//     expect(res.status).toBe(200);
//     expect(res.body.ticket.length).toBe(1);
//     expect(res.body.checkout).toMatchObject({
//       multiplier: getMultiplier(res.body.ticket),
//     });
//   });
//   it("should return error when the invalid parameters are passed ", async () => {
//     const res = await request(server).delete("/bets").send({
//       match: "invalid",
//       ticket_id: "parameter",
//     });
//     expect(res.status).toBe(400);
//   });
// });
describe("POST /bets/checkout/:betId", () => {
  beforeEach(() => (server = require("../api")));
  afterEach(() => server.close());
  it("should give the total amount of bet given a import", async () => {
    const login = await request(server)
      .post("/users/login")
      .send({ usernameOrEmail: "camillo", password: "123456ciao" });
    const token = login.header["x-auth-token"];
    let firstRes = await request(server)
      .post("/bets")
      .send({ match: 0, odd: "1" });
    const multiplier = getMultiplier(firstRes.body.ticket);
    let ticket_id = firstRes.body.checkout.ticket_id;
    const lastRes = await request(server)
      .post(`/bets/checkout/${ticket_id}`)
      .send({ betImport: 5 })
      .set({
        "Access-Control-Expose-Headers": "x-auth-token",
        "x-auth-token": token,
      });
    expect(lastRes.status).toBe(200);
    expect(lastRes.body).toMatchObject({
      multiplier,
      import: 5,
      maxWin: multiplier * 5,
      ticket_id: ticket_id.toString(),
    });
  });
  it("should return error if invalid import is passed", async () => {
    await request(server).get("/championships/serie_a").set({ token: "pippo" });
    let res = await request(server).post("/bets").send({ match: 5, odd: "1" });
    res = await request(server)
      .post("/bets/checkout/" + res.body.checkout.ticket_id)
      .send({ betImport: "invalid" });
    expect(res.status).toBe(400);
  });
  it("should return error if invalid import is passed", async () => {
    const res = await request(server).post("/bets/checkout/invalidID");
    expect(res.status).toBe(400);
  });
});
