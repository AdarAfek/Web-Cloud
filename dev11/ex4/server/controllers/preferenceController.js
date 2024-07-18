const db = require("../db");
const destinations = [
  "Rome",
  "Berlin",
  "New York City",
  "Los Angeles",
  "Madrid",
  "London",
  "Athens",
  "Sydney",
  "Tokyo",
  "Barcelona",
];
const typesOfVacation = {
  1: "Culinary",
  2: "Basketball",
  3: "Football",
  4: "Relax",
  5: "Road trip",
};
const typeKeys = Object.keys(typesOfVacation)
  .map((key) => parseInt(key))
  .filter((key) => !isNaN(key));

const destinationValid = (dest) => {
  return destinations.includes(dest);
};

const typesOfVacationValid = (key) => {
  return typeKeys.includes(key);
};
const verifyAccessToken = async (accessToken) => {
  const connection = await db.createConnection();
  const [rows] = await connection.execute(
    "SELECT user_id FROM tbl_11_users WHERE access_code = ?",
    [accessToken]
  );
  return rows[0].userId;
};
const addPreferences = async (req, res) => {
  try {
    const { destination, startDate, endDate, accessToken, vacationType } =
      req.body;
    if (
      !destination ||
      !startDate ||
      !endDate ||
      !vacationType ||
      !accessToken
    ) {
      throw new Error("Missing fields");
    }

    const userId = await verifyAccessToken(accessToken);
    if (!userId) {
      return res.status(401).json({ error: "Invalid Access Token" });
    }

    if (!destinationValid(destination)) {
      return res.status(400).json({
        error: `Invalid destination: ${destination}. Valid destinations: ${destinations.join(
          ", "
        )}`,
      });
    }

    if (!typesOfVacationValid(vacationType)) {
      return res.status(400).json({
        error: `Invalid vacation type key: ${vacationType}. Valid vacation types: ${Object.values(
          typesOfVacation
        ).join(", ")}`,
      });
    }

    const connection = await db.createConnection();
    const [result] = await connection.execute(
      "INSERT INTO user_preferences (user_id, start_date, end_date, destination, vacation_type) VALUES (?, ?, ?, ?, ?)",
      [userId, startDate, endDate, destination, vacationType]
    );
    await db.closeConnection();

    res.status(200).json({ insertId: result.insertId });
  } catch (error) {
    res
      .status(500)
      .json({ error: `Failed to add preferences: ${error.message}` });
  }
};

module.exports = { addPreferences };

