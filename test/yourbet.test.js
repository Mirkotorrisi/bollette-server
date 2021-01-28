// const request = require("supertest");
// let server;

// describe("GET /yourbet/:ticketid", () => {
//   beforeEach(() => (server = require("../api")));
//   afterEach(() => server.close());
//   it("should retrieve the bet from db", async () => {
//     const retrieveMatches = await request(server)
//       .get("/championships/serie_a")
//       .set({ token: "pippo" });
//     const firstCall = await request(server)
//       .post("/bets")
//       .send({ match: 0, odd: "1" });
//     await request(server)
//       .post(`/bets/checkout/${firstCall.body.checkout.ticket_id}`)
//       .send({ betImport: 5 });

//     const finres = await request(server).get(
//       `/yourbet/${firstCall.body.checkout.ticket_id}`
//     );
//     expect(finres.status).toBe(200);
//     expect(finres.body.fetched.length).toBeGreaterThan(0);
//     expect(finres.body.bollette_results.length).toBeGreaterThan(0);
//   });
//   it("should give error when invalid ticket id is passed", async () => {
//     const res = await request(server).get("/yourbet/invalid");
//     expect(res.status).toBe(400);
//     expect(res.body.errors.length).toBeGreaterThan(0);
//   });
//   it("should give 404 when no ticket id is found", async () => {
//     const res = await request(server).get("/yourbet/1");
//     expect(res.status).toBe(404);
//     expect(res.body.message).toMatch("No ticket found");
//   });
// });
