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
const mostFrequentlyType = async () => {
  const connection = await db.createConnection();
  try {
    const [result] = await connection.execute(
      `SELECT type FROM tbl_11_preferences 
       GROUP BY type 
       ORDER BY COUNT(type) DESC, type ASC 
       LIMIT 1`
    );
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("Error fetching the most frequently occurring type:", error);
  } finally {
    await connection.end();
  }
};
const mostFrequentlyDest = async () => {
  const connection = await db.createConnection();
  try {
    const [result] = await connection.execute(
      `SELECT dest FROM tbl_11_preferences 
       GROUP BY dest 
       ORDER BY COUNT(dest) DESC, dest ASC 
       LIMIT 1`
    );
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error(
      "Error fetching the most frequently occurring destination:",
      error
    );
  } finally {
    await connection.end();
  }
};
const chosenDates = (preferences) => {
  const dates = preferences.map((date) => ({
    startDate: new Date(date.start_date),
    endDate: new Date(date.end_date),
  }));
  if (dates.length === 0) return null;

  let chosenStartDate = new Date(
    Math.max(...dates.map((vacation) => vacation.startDate.getTime()))
  );
  let chosenEndDate = new Date(
    Math.min(...dates.map((vacation) => vacation.endDate.getTime()))
  );
  if (chosenStartDate < chosenEndDate) {
    return { start_date: chosenStartDate, end_date: chosenEndDate };
  } else return null;
};
const chosenVacation = async (req, res) => {
  const connection = await db.createConnection();
  const [allPreferences] = await connection.execute(
    "select * from tbl_11_preferences "
  );

  if (allPreferences.length === 0) {
    res.status(400).json({ message: "No preferences found" });
    return;
  }

  if (allPreferences.length < 5) {
    res
      .status(400)
      .json({ message: "Not enough preferences to calculate (need 5)" });
    return;
  }
  const chosenDest = mostFrequentlyDest();
  const chosenType = mostFrequentlyType();
  const dates = chosenDates(allPreferences);
  if (!dates || !chosenDest || !chosenType) {
    const defaultVacation = allPreferences[0];
    res.status(400).json({
      message:
        "default Vacation selected since no overlapping dates or chosen type or chosen destination was found.",
      defaultVacation,
    });
    return;
  }
  res.status(200).json({
    chosenDest,
    chosenType,
    dates,
  });
};
module.exports = {
  addPreference,
  updatePreference,
  getPreferences,
  chosenVacation,
};
