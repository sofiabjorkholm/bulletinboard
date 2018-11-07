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
    //console.log(input)
    const text = 'INSERT INTO messages(title, body) VALUES($1, $2) RETURNING *'
    const values = [input.title, input.message]
    pool.query(text, values, (err, res) => {
      if (err) {
        console.log(err)
      } else {
       console.log(res.rows[0])
      }
            })
    //res.render('post', {posted: input})
    res.redirect('/post')
  })

  app.get('/post', function(req, res){
      let postedMessages = "SELECT title, body FROM messages"
      let messages = []
      pool.query(postedMessages, messages, (err, response) => {
        if (err) {
          console.log(err)
        } else { 
            // for (let i =0; i<response.length; i++){ // running through the file users.json
            //     console.log(response)
            //   let fullMessage = (response[i].messages)
            //     // messages.push(postedMessages)
            //     console.log(fullMessage)
            console.log(response.rows)
            let result= response.rows
            messages.push(result)
            res.render('post', {posted: result})
            }      
      })
  })

  // for( i = 0; i < response.length; i++) {
  //   // console.log(data.search[i].firstname)
  //           $( "#result" ).append(`<ul>${(response[i].title) + ' ' + (response[i].body)}</ul>`) 
  //           console.log(response[i].title + ' ' + response[i].body) 
  //   }
// let input = process.argv[2]
// console.log(input) //these two lines were the only thing lindesy put in the beginning to test the node and process argv, good to remember
// //pool.query("SELECT * FROM hats WHERE name =$1", [input], (err, res) => { //putting input as name will not work, use $1, and input as an argument thereafter
//   //can alo do the following:
//   pool.query(`SELECT * FROM hats WHERE name ='${input}'`, (err, res) => { 
//   //Database connection pooling is a method used to keep database 
//   //connections open so they can be reused futher down the process.

//   if (err) {
//       throw err
//         }

//    console.log('hat:', res.rows[0])
//       })
//note: if you specify in the command line and argument containing two words, you need the quotes, 
//i.e., 'top hats' now the process argv sees the argument as the second [2] argument, if you do not use quotes, top will be second and hat will be third, thus will not work


app.listen(port, () => console.log(`bulletin board app listening on port ${port}!`)) 
