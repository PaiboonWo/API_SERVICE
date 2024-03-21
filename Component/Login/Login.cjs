const express = require("express");
const oracledb = require("oracledb");

const app = express();
const port = 5000;


app.use(express.json());

oracledb.initOracleClient({
  tnsnames: process.env.TNS_ADMIN,
 });

 const AVO = {
  user: "avo",
  password: "avo",
  connectString: "TCIX01",
};

const QAD = {
  user: "qad",
  password: "qad",
  connectString: "TCIX01",
};

const CUSR = {
  user: "cusr",
  password: "cusr",
  connectString: "TCIX01",
};

// Login
module.exports.login = async function (req, res) {
  try {
    const  User  = req.query.username;
    const  Password  = req.query.password;
    const connect = await oracledb.getConnection(CUSR);
    const query = `
        SELECT R.ROLE_ID ,T.USER_FNAME , T.USER_SURNAME , T.USER_LOGIN 
        ,T.USER_EMP_ID , REPLACE(R.ROLE_NAME,'FAS-','') AS ROLE_NAME_SHOW
        FROM CU_USER_M T
        INNER JOIN CU_ROLE_USER RU ON RU.USER_LOGIN = T.USER_LOGIN
        INNER JOIN CU_ROLE_M R ON R.ROLE_ID = RU.ROLE_ID
        WHERE T.USER_LOGIN = '${User}'
        AND T.USER_PASSWORD = '${Password}'
        AND R.SYSTEM_ID = '65'
       `;
    const result = await connect.execute(query);
    connect.release();
    res.json(result.rows);
    
  } catch (error) {
    console.error("Data search errors:", error.message);
  }
};

//Menu
module.exports.menu = async function (req, res) {
  try {
    const  Userlogin  = req.query.userlogin;
    const  Role  = req.query.role;
    const connect = await oracledb.getConnection(CUSR);
    const query = 
    `SELECT DISTINCT M.MENU_ID,
                M.MENU_NAME,
                M.MENU_DESC,
                M.MENU_PARENT_ID,
                M.MENU_SORT
                FROM CU_ROLE_USER T
                INNER JOIN CU_ROLE_M R ON R.ROLE_ID = T.ROLE_ID
                LEFT JOIN CU_ROLE_MENU RM ON RM.ROLE_ID = T.ROLE_ID
                LEFT JOIN CU_MENU_M M ON M.MENU_ID = RM.MENU_ID AND M.SYSTEM_ID = R.SYSTEM_ID
                WHERE T.USER_LOGIN = '${Userlogin}' 
                AND R.SYSTEM_ID = '65'
                ORDER BY CAST(M.MENU_ID AS INTEGER),CAST(M.MENU_PARENT_ID AS INTEGER),M.MENU_SORT`;
    const result = await connect.execute(query);
    connect.release();
    res.json(result.rows);
    
  } catch (error) {
    console.error("Data search errors:", error.message);
  }
};
module.exports.mainmenu = async function (req, res) {
  try {
    const connect = await oracledb.getConnection(CUSR);
    const query = 
    `SELECT DISTINCT M.MENU_ID,
    M.MENU_NAME,
    M.MENU_DESC,
    M.MENU_PARENT_ID,
    M.MENU_SORT
FROM CU_ROLE_USER T
INNER JOIN CU_ROLE_M R ON R.ROLE_ID = T.ROLE_ID
LEFT JOIN CU_ROLE_MENU RM ON RM.ROLE_ID = T.ROLE_ID
LEFT JOIN CU_MENU_M M ON M.MENU_ID = RM.MENU_ID AND M.SYSTEM_ID = R.SYSTEM_ID
AND R.SYSTEM_ID = '65'
AND M.MENU_PARENT_ID IS NULL 
ORDER BY CAST(M.MENU_ID AS INTEGER),CAST(M.MENU_PARENT_ID AS INTEGER),M.MENU_SORT`;
    const result = await connect.execute(query);
    connect.release();
    res.json(result.rows);
  } catch (error) {
    console.error("Data search errors:", error.message);
  }
};


module.exports.submenu = async function (req, res) {
  try {
    const  Userlogin  = req.query.userlogin;
    const  Role  = req.query.role;
    const connect = await oracledb.getConnection(CUSR);
    const query = 
    `SELECT DISTINCT M.MENU_ID,
    M.MENU_NAME,
    M.MENU_DESC,
    M.MENU_PARENT_ID,
    M.MENU_SORT
FROM CU_ROLE_USER T
INNER JOIN CU_ROLE_M R ON R.ROLE_ID = T.ROLE_ID
LEFT JOIN CU_ROLE_MENU RM ON RM.ROLE_ID = T.ROLE_ID
LEFT JOIN CU_MENU_M M ON M.MENU_ID = RM.MENU_ID AND M.SYSTEM_ID = R.SYSTEM_ID
WHERE T.USER_LOGIN = '${Userlogin}'
AND R.SYSTEM_ID = '65'
AND M.MENU_PARENT_ID IS NOT NULL 
ORDER BY CAST(M.MENU_ID AS INTEGER),CAST(M.MENU_PARENT_ID AS INTEGER),M.MENU_SORT`;
    const result = await connect.execute(query);
    connect.release();
    res.json(result.rows);
    
  } catch (error) {
    console.error("Data search errors:", error.message);
  }
};
