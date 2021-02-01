const db = require("./db");
const getRanking = () =>
  db
    .query("SELECT username, account_sum FROM users ORDER BY account_sum DESC")
    .catch((err) => {
      throw new Error(err);
    });
const getBestMultiplier = () =>
  db
    .query(
      "SELECT bolletta.max_win, u.username FROM bolletta INNER JOIN (SELECT id, username FROM users) u ON u.id = bolletta.user_id WHERE status='won' ORDER BY max_win DESC"
    )
    .catch((err) => {
      throw new Error(err);
    });
const updateBetStatus = (result, total, team_1, team_2) => {
  return db
    .query(
      `UPDATE bet SET  status = (CASE WHEN (result = '${result}' OR result = '${total}') THEN 'won' ELSE 'lost' END) WHERE (status = 'ongoing' AND team_1 LIKE '%${team_1}%'AND team_2 LIKE '%${team_2}%');`
    )
    .catch((err) => {
      throw new Error(err);
    });
};

const updateBollettaStatus = () =>
  db
    .query(
      `UPDATE bolletta set status = (CASE WHEN (SELECT SUM(ticket_id) FROM bet WHERE bet.ticket_id = bolletta.ticket_id AND bet.status = 'lost') > 0 THEN 'lost' WHEN (SELECT SUM(ticket_id) FROM bet WHERE bet.ticket_id = bolletta.ticket_id) =(SELECT SUM(ticket_id) FROM bet WHERE (bet.ticket_id = bolletta.ticket_id AND bet.status = 'won')) THEN 'won' ELSE 'ongoing' END)`
    )
    .catch((err) => {
      throw new Error(err);
    });
const updateUserSum = async () => {
  console.log("dio salame");

  const won_ticket_id = await db
    .query(
      `SELECT ticket_id,max_win,user_id FROM bolletta WHERE (status = 'won' AND paid=FALSE)`
    )
    .catch((err) => {
      throw new Error(err);
    });
  won_ticket_id.forEach(async ({ ticket_id, max_win, user_id }) => {
    console.log("dio sorcio");
    const first = await db
      .query(
        `UPDATE users set account_sum = account_sum + ${max_win} WHERE id = ${user_id};`
      )
      .catch((err) => {
        throw new Error(err);
      });
    console.log(first);
    const second = await db
      .query(`UPDATE bolletta set paid = TRUE WHERE ticket_id = ${ticket_id};`)
      .catch((err) => {
        throw new Error(err);
      });
    console.log(second);
  });
};

const insertBolletta = (ticket_id, betImport, maxWin, id) =>
  db
    .query(
      `INSERT into bolletta (ticket_id, import, max_win, user_id) VALUES ('${ticket_id}', '${betImport}', '${maxWin}','${id}');`
    )
    .catch((err) => {
      throw new Error(err);
    });
const decrementUserSum = (betImport, id) =>
  db
    .query(
      `UPDATE users SET account_sum = account_sum - ${betImport} WHERE (id = ${id})`
    )
    .catch((err) => {
      throw new Error(err);
    });

const getUserSum = (id) =>
  db.query(`SELECT account_sum from users WHERE (id = ${id})`).catch((err) => {
    throw new Error(err);
  });

const insertBet = (values) =>
  db
    .query(
      `INSERT INTO bet (team_1, team_2, result, odd, ticket_id, commence_time) VALUES ?`,
      [values]
    )
    .catch((err) => {
      throw new Error(err);
    });
const getUser = (email, username) =>
  db
    .query(
      `SELECT * FROM users WHERE email = '${email}' OR username = '${username}';`
    )
    .catch((err) => {
      throw new Error(err);
    });

const insertUser = (username, email, hashed) =>
  db
    .query(
      `INSERT INTO users (username, email, password) VALUES ('${username}', '${email}', '${hashed}');`
    )
    .catch((err) => {
      throw new Error(err);
    });
const getTicketsByUser = (id) =>
  db
    .query(
      `SELECT team_1,team_2,result,odd,bet.ticket_id,commence_time,bet.status AS bet_status, bolletta.status AS bolletta_status,import AS bet_import,max_win FROM (bet INNER JOIN bolletta) WHERE bet.ticket_id = bolletta.ticket_id AND bolletta.user_id =${id};`
    )
    .catch((err) => {
      throw new Error(err);
    });

module.exports = {
  getRanking,
  getBestMultiplier,
  updateBetStatus,
  updateBollettaStatus,
  updateUserSum,
  insertBolletta,
  decrementUserSum,
  getUserSum,
  insertBet,
  getUser,
  insertUser,
  getTicketsByUser,
};
