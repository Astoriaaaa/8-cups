

const pool = require('../database/connection')

const createAcc = async (req, res) => {
    const username = req.username
    const password = req.password
    let sql = "INSERT INTO userprofiles(username, password) VALUES("+ username + "," + password + ")"
    const result = await pool.query(sql)
    res.json(result)

}

const deleteAcc = async (req, res) => {
    const username = req.username
    let sql= "DELETE FROM userprofiles WHERE username=" + username
    await pool.query(sql)
    
}

const UpdateAcc = async (req, res) => {
    const username = req.username
    const password = req.password
    let sql = "UPDATE userprofiles SET username =" + username + " WHERE password =" + password

    await pool.query(sql)
    res.json({"message": "Done"})
    
}


const Auth =  async (req, res) => {

    let sql= `SELECT password
    FROM userprofiles
    WHERE EXISTS
    (SELECT password FROM userprofiles WHERE userprofiles.password=${req.password} AND userprofiles.username=${req.username})`

    const result = await pool.query(sql)
    res.json(result)

}

module.exports = { createAcc, deleteAcc, UpdateAcc, Auth }