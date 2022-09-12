const express = require("express");
const mysql = require("mysql2/promise");
const randomName = require("node-random-name");

const app = express();
const port = 3000;

const pool = mysql.createPool({
  host: "db",
  user: "root",
  password: "root",
  database: "nodedb",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function create(name) {
  await pool.execute(`INSERT INTO people(name) VALUES (?)`, [name]);
}

async function findAll() {
  const [results] = await pool.execute(`SELECT id, name FROM people`);
  return results;
}

app.get("/", async (req, res, next) => {
  try {
    const name = req.query.name || randomName();
    await create(name);
    const people = await findAll();
    res.send(`
    <div style="text-align: center;">
      <h1 style="font-weight: bolder;">Full Cycle Rocks!</h1>
      <hr />
      <p style="font-weight: bolder;">Lista de nomes cadastrada no banco de dados:</p>
      <div>
        ${people.map((p) => `<p>${p.name}</p>`).join("\n\t")}
      </div>
    </div> 
    `);
  } catch (err) {
    next(err);
  }
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(err.message, err.stack);
  res.status(statusCode).send(`<p>Error:</p><p>${err.message}</p>`);
  return;
});

app.listen(port, () => {
  console.log(`running on ${port}`);
});
