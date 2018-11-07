const pg = require('pg');
const { Pool, Client } = require('pg')
const connectionString = 'postgres://' + process.env.POSTGRES_USER + ':' + process.env.POSTGRES_PASSWORD + '@localhost/bulletinboard';
const pool = new Pool({
  connectionString: connectionString,
  })

  const express = require('express')
  const app = express()
  const port = 3000
  const fs= require('fs'); // this will include the File System module - file system module allows you to work with the file system on your computer.
  var bodyParser = require('body-parser')
  
  app.set('view engine', 'ejs') // includes the .ejs file in the 'views' folder. 
  app.use(express.static(__dirname + '/views')); //include css
  app.use(bodyParser.urlencoded({ extended: false }))

  app.get('/index', function(req,res){
    res.render('index')
  })

  app.get('/contact', function(req,res){
    res.render('contact')
  })
  app.get('/about', function(req,res){
    res.render('about')
  })

  app.post('/post', function(req, res){
    let input = {
      title: req.body.title,
      message: req.body.message
    }

    const text = 'INSERT INTO messages(title, body) VALUES($1, $2) RETURNING *'
    const values = [input.title, input.message]
    pool.query(text, values, (err, res) => {
      if (err) {
        console.log(err)
      } else {
       console.log(res.rows[0])
      }
            })
    res.redirect('/post')
  })

  app.get('/post', function(req, res){
      let postedMessages = "SELECT title, body FROM messages"
      let messages = []
      pool.query(postedMessages, messages, (err, response) => {
        if (err) {
          console.log(err)
        } else { 
            console.log(response.rows)
            let result= response.rows
            messages.push(result)
            res.render('post', {posted: result})
            }      
      })
  })

app.listen(port, () => console.log(`bulletin board app listening on port ${port}!`)) 
