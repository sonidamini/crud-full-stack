const express = require('express');

const app = express();

var bodyparser = require('body-parser');

const connection = require('./config/db');

app.use(express.static(__dirname+'/public'));
app.use(express.static(__dirname+'/views'));

app.use(bodyparser.urlencoded({extended:true}));
app.use(bodyparser.json());

const dotenv = require('dotenv');
dotenv.config();

app.set("view engine","ejs");

app.get('/',(req,res)=>{
    res.redirect('create.html');
});

app.get('/delete-data',(req,res)=>{
    const deleteQuery = "delete from youtube_table where id=?";
    connection.query(deleteQuery,[req.query.id],(err,rows)=>{
        if(err){
            console.log(err);
        }
        else
        {
            res.redirect("/data");
        }
    });
});



app.get('/update-data',(req,res)=>{
    connection.query("select * from youtube_table where id=?" ,[req.query.id] , (err,eachRow)=>{

        if(err){
            console.log(err);
        }
        else
        {
            result = JSON.parse(JSON.stringify(eachRow[0]));
            console.log(result);
            res.render("edit.ejs",{result});
        }
    });
});

app.get('/data',(req,res)=>{
 connection.query("select * from youtube_table",(err,rows)=>{
    if(err){
        console.log(err);
    }
    else
    {
        res.render("read.ejs",{rows});
    }
 });

});

//update
app.post('/final-update',(req,res)=>{
    const id = req.body.hidden_id;
    const name = req.body.name;
    const email = req.body.email;
 
    console.log("id...."+id);

    const updateQuery = "update youtube_table set name=? , email=?  where id=?";
     try{
         connection.query(updateQuery,[name,email,id],(err,rows)=>{
                 if(err){
                     console.log(err);
                 }
                 else{
                     res.redirect('/data');
                 }
             }
         );
         //console.log('create');
     }
     catch(err){
         console.log(err);
     }
 });
 

//create 
app.post('/create',(req,res)=>{
   const name = req.body.name;
   const email = req.body.email;

    try{
        connection.query(
            "INSERT into youtube_table (name,email) values(?,?)",
            [name,email],
            (err,rows)=>{
                if(err){
                    console.log(err);
                }
                else{
                    res.redirect('/data');
                }
            }
        );
        //console.log('create');
    }
    catch(err){
        console.log(err);
    }
});

app.listen(process.env.PORT || 4000 , (error)=>{
    if(error)throw error;
    console.log(`server running on ${process.env.PORT}`);
});
