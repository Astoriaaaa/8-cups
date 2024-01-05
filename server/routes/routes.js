const express = require('express')
const router = express.Router()
const createAcc = require('../controllers/AuthController')
const deleteAcc = require('../controllers/AuthController')
const UpdateAcc = require('../controllers/AuthController') 
const Auth = require('../controllers/AuthController')
const pool = require('../database/connection')

router.route('/').post( async(req, res) => {
    const username = req.body.username
    const password = req.body.password

    let sql = "INSERT INTO userprofiles(username, password, streak, notifications) VALUES( '" + username + "' ," + "'" + password + "'" + ", 0, 'off')"
    let sql2 = "CREATE TABLE " + username +" (record DATE)"
    let sql3 = "SELECT username, password FROM userprofiles WHERE username= '" + username + "'"

    const duplicate = await pool.query(sql3)
    if(duplicate[0].length == 0)
    {
        pool.query(sql)
        pool.query(sql2)
        res.json({"msg": "success"})
    }
    else {
        res.status(404).json({"msg": "fail"})
    }
    

})

router.route('/').delete( (req, res) => {
    const username = req.query.username
    let sql= "DELETE FROM userprofiles WHERE username= '" + username + "'"
    const result = pool.query(sql)
    res.json(result)
    
})

router.route('/').put(async (req, res) => {
    const username = req.body.username
    const currentusername = req.body.currentusername
    let sql = "UPDATE userprofiles SET username ='" + username + "' WHERE username ='" + currentusername + "'"

    await pool.query(sql)
    res.json({"message": "Done"})})

router.route('/').get(async (req, res) => {

    const username = req.query.username
    const password = req.query.password

    let sql = "SELECT username, password FROM userprofiles WHERE username= '" + username + "'and password= '" + password + "'"

    const result = await pool.query(sql)
    console.log(result)
    if (result[0].length == 0) {
        res.json("fail")
    }
    else
    {
        res.status(202).json(result[0])
    }

    })

router.route('/updateStreak').post(async(req, res) => {
    const username = req.body.username
    const newdate = new Date()
    const date = newdate.getFullYear() + '-' + (1 + newdate.getMonth()) + '-' + (newdate.getDate() - 1)
    res = await pool.query("SELECT record from " + username + " WHERE record= '" + date  + "'")
    if (res[0].length < 8) {
        pool.query("UPDATE userprofiles SET streak = 0 WHERE username ='" + username + "'")
        console.log("done")
    }
    else{
        console.log(res[0])
    }
    
})

router.route('/updateData').post(async (req, res) => {
    const username = req.body.username
    const newdate = new Date()
    const date = newdate.getFullYear() + '-' + (1 + newdate.getMonth()) + '-' + newdate.getDate()
    const sql = "INSERT INTO " + username + "(record)" + " VALUES('" + date + "')"
    await pool.query(sql)
    let result = await pool.query("SELECT record from " + username + " WHERE record= '" + date  + "'")
    
    if(result[0].length == 7)
    {
        const date = newdate.getFullYear() + '-' + (1 + newdate.getMonth()) + '-' + (newdate.getDate() - 1)
        let result2 = await pool.query("SELECT record from " + username + " WHERE record= '" + date  + "'")
        if(result2[0].length == 7)
        {
            pool.query("UPDATE userprofiles SET streak = streak + 1 WHERE username ='" + username + "'")
            res.json({"msg": "updated, you're on fire"})
        }
        else {
            pool.query("UPDATE userprofiles SET streak = 1 WHERE username ='" + username + "'")
            res.json({"msg": "updated, one day streak"})
            console.log(result[0].length)
        }
        
    }
    else {
        res.json({"msg": "updated"})
        console.log(newdate.getDate())
    }
    

})

router.route('/getGraphData').get(async (req, res) => {
    const username = req.query.username
    const date = req.query.date
    let response = await pool.query("SELECT record from " + username + " WHERE record= '" + date  + "'")
    res.json(response[0].length)

})

router.route('/getStreaks').get(async (req, res) => {
    const username = req.query.username
    let response = await pool.query("SELECT streak from userprofiles WHERE username='" + username + "'")
    res.json(response[0][0].streak)
})

router.route('/NotificationStatus').get(async (req, res) => {
    const username = req.query.username
    let response = await pool.query("SELECT notifications from userprofiles WHERE username ='" + username + "'")
    res.json(response[0][0].notifications)
})

router.route('/NotificationStatus').put(async (req, res) => {
    const username = req.body.username
    const status = req.body.status
    await pool.query("UPDATE userprofiles SET notifications = '" + status + "' WHERE username ='" + username + "'")
    res.json("updated " + username)
})


module.exports = router