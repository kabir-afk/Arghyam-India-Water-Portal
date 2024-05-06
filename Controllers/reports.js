const mysql = require("mysql2");

const allowedTables = [
  "Precipitation",
  "Average_Temperature",
  "Cloud_Cover",
  "Diurnal_Temperature_Range",
  "Ground_Frost_Frequency",
  "Maximum_Temperature",
  "Minimum_Temperature",
  "Potential_Evapotranspiration",
  "Reference_Crop_Evapotranspiration",
  "Vapour_Pressure",
  "Wet_Day_Frequency",
];

let pool;

async function getData(req, res, sql) {
  if (!pool) {
    pool = mysql
      .createPool({
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
      })
      .promise();
  }
  const connection = await pool.getConnection();
  try {
    const { table, state, district, startYear, endYear } = req.body;
    if (!allowedTables.includes(table)) {
      throw new Error("Unauthorized table access");
    }
    const sqlValues = [state, district, startYear, endYear];
    const results = [];
    for (const element of sql) {
      const [data] = await connection.query(element, sqlValues);
      results.push(data);
    }
    return results;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching data" });
  } finally {
    connection.release();
  }
}

async function homePage(req, res) {
  res.status(200).json({
    success: true,
    msg: "Welcome to homepage",
  });
}

async function getMonthlyMean(req, res) {
  const { table } = req.body;
  const getMonthsSql = `SELECT 
  jan,feb,mar,apr,may,jun,jul,aug,sep,oct,nov,december
  FROM ${table}
  WHERE State = ? 
  AND Distict = ?
  AND year_val BETWEEN ? AND ?;`;

  const getAvgSql = `SELECT
  ROUND(AVG(jan),2) AS avg_jan,
  ROUND(AVG(feb),2) AS avg_feb,
  ROUND(AVG(mar),2) AS avg_mar,
  ROUND(AVG(apr),2) AS avg_apr,
  ROUND(AVG(may),2) AS avg_may,
  ROUND(AVG(jun),2) AS avg_jun,
  ROUND(AVG(jul),2) AS avg_jul,
  ROUND(AVG(aug),2) AS avg_aug,
  ROUND(AVG(sep),2) AS avg_sep,
  ROUND(AVG(oct),2) AS avg_oct,
  ROUND(AVG(nov),2) AS avg_nov,
  ROUND(AVG(december),2) AS avg_dec
  FROM ${table} 
  WHERE State = ? 
  AND Distict = ?
  AND year_val BETWEEN ? AND ?;`;
  const results = await getData(req, res, [getMonthsSql, getAvgSql]);
  const [getMonths, monthlyMean] = results;
  res.status(201).json({ getMonths, monthlyMean });
}

async function getAnnualMean(req, res) {
  const { table } = req.body;

  const annualMeanSql = `SELECT
*,
ROUND(((jan + feb +mar+apr+may+jun+jul+aug+sep+oct+nov+december)/12),2) AS annual_mean
FROM ${table} 
WHERE State = ? 
AND Distict = ?
AND year_val BETWEEN ? AND ?;`;

  const results = await getData(req, res, [annualMeanSql]);
  const [annualMean] = results;
  res.status(201).json({ annualMean });
}
async function getAnnualTotal(req, res) {
  const { table } = req.body;

  const annualTotalSql = `SELECT
  *,
  ROUND((jan + feb +mar+apr+may+jun+jul+aug+sep+oct+nov+december),2) AS annual_totals
  FROM ${table} 
  WHERE State = ? 
  AND Distict = ?
  AND year_val BETWEEN ? AND ?;`;

  const results = await getData(req, res, [annualTotalSql]);
  const [annualTotals] = results;
  res.status(201).json({ annualTotals });
}

module.exports = { homePage, getMonthlyMean, getAnnualMean, getAnnualTotal };
