require("dotenv").config()

const express = require('express');

const app = express();
const logRequest = require('./middleware/logger.js');
const validatetodo = require('./middleware/validator.js')
const errorhandler = require('./middleware/errorHandler.js');
const patchvalidator = require("./middleware/patchValidator.js");
app.use(express.json());
app.use(logRequest);


let todos =[
    {id: 1, task: 'Learn Node.js', completed: false},
    {id: 2, task: 'Build CRUD API', completed: false}
];


app.get('/todos',(req,res,next) => {
  try {
      res.status(200).json(todos);//send array as json
  } catch (error) {
    next(error)
  }
});

app.post('/todos',validatetodo,(req,res,next) =>{
    try {
            const newTodo = { id: todos.length+1, ...req.body};//auto id
    todos.push(newTodo);
    res.status(201).json(newTodo);//echo back
    } catch (error) {
        next(error)
    }
})

app.patch('/todos/:id',patchvalidator, (req,res,next) => {
  try {
      const todo = todos.find((t) => t.id == parseInt(req.params.id));//array find
    if(!todo) return res.status(404).json({message: 'Todo not found' });
    Object.assign(todo, req.body);//merge...e.g (completed:true)
    res.status(200).json(todo);
  } catch (error) {
    next(error)
  }
})

app.put('/todos/:id', (req,res,next) => {
 try {
       const todo = todos.find((t) => t.id == parseInt(req.params.id));//array find
    if(!todo) return res.status(404).json({message: 'Todo not found' });
    Object.assign(todo, req.body);//merge...e.g (completed:true)
    res.status(200).json(todo);
 } catch (error) {
    next(error)
 }
})

app.delete ('/todos/:id',(req,res,next) => {
  try {
      const id = parseInt(req.params.id);
    const initiallength = todos.length;
    todos = todos.filter((t) => t.id!== id);//array filter()  -non-destructive
    if (todos.length==initiallength)
        return res.status(404).json({error: "Not Found"})
    res.status(204).send();//silent success
  } catch (error) {
    next(error)
  }
});

app.get('/todos/:id',(req,res,next) => {
    try {
        const id = parseInt(req.params.id)
        if(isNaN(id)){
            throw new Error("Invalid ID")
        }
        const todo = todos.find((t)=> t.id === id);
        if(!todo){
           return res.status(404).json({message:'todo not found'})
        }
        res.status(200).json(todo)
    } catch (error) {
       next(error) 
    }
})

app.use(errorhandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT,() => {
    console.log(`server is listening on port : ${PORT}`)
});
 
