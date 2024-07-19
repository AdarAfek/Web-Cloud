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
  if (rows.length > 0) {
    const userId = rows[0].user_id;
    return userId;
  }

  await db.closeConnection();
};
const findPreferenceById = async (preferenceId) => {
  const connection = await db.createConnection();
  const [rows] = await connection.execute(
    "SELECT * FROM tbl_11_preferences WHERE preference_id = ?",
    [preferenceId]
  );
  return rows[0];
};

const updatePreference = async (req, res) => {
  try {
    const { preferenceId } = req.params;
    const preferenceToUpdate = await findPreferenceById(preferenceId);
    if (!preferenceToUpdate) {
      throw new Error("Preference to update not found");
    }
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
      "UPDATE tbl_11_preferences SET destination = ?, start_date = ?, end_date = ?, type = ? WHERE preference_id= ?",
      [destination, startDate, endDate, vacationType, preferenceId]
    );
    await db.closeConnection();

    res.status(200).json({ preferenceId });
  } catch (error) {
    res
      .status(500)
      .json({ error: `Failed to update preferences: ${error.message}` });
  }
};
const getPreferences = async (req, res) => {
  try {
    const connection = await db.createConnection();
    const [allPreferences] = await connection.execute(
      "select * from tbl_11_preferences "
    );
    return res.status(200).json(allPreferences);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const addPreference = async (req, res) => {
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
      "INSERT INTO tbl_11_preferences(user_id,start_date,end_date,destination,type) VALUES (?, ?, ?, ?, ?)",
      [userId, startDate, endDate, destination, vacationType]
    );
    await db.closeConnection();

    res.status(200).json({ preference_id: result.insertId });
  } catch (error) {
    res
      .status(500)
      .json({ error: `Failed to add preferences: ${error.message}` });
  }
};

module.exports = { addPreference, updatePreference, getPreferences };
