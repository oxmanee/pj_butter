const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const nodeCouchDB = require('node-couchdb')

const url = require('url')

const app = express()
const couch = new nodeCouchDB({
    auth: {
        user: 'admin',
        password: '1234'
    }
})

couch.listDatabases().then(function (dbs) {
    console.log(dbs)
})

const dbName = 'pm2_5'
const viewUrl = '_design/all_dust/_view/all'


app.set('view engine', 'ejs')
app.set('views', path.join(__dirname), 'views')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', function (req, res) {
    couch.get(dbName, viewUrl).then(function (data, headers, status) {
        console.log(data.data.rows)
    },
        function (err) {
            res.send(err)
        })
})

// เวลาจะส่งค่าให้ส่งเป็น parameters ใน path
app.get('/add', function (req, res) {

    let date = req.query.date
    let time = req.query.time
    let dust = req.query.dust

    couch.uniqid().then(function (ids) {
        const id = ids[0]
        couch.insert('pm2_5', {
            _id: id,
            date: date,
            time: time,
            dust: dust
        }).then(function (data, headers, status) {

        }),
            function (err) {
                res.send(err)
            }
    })
})

app.listen(3000, function () {
    console.log('Server Start....')
})