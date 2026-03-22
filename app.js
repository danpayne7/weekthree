<<<<<<< HEAD
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
 
=======
require("dotenv").config();

const express = require('express');
const app = express();
app.use(express.json()); // Parse JSON bodies

let todos = [
  { id: 1, task: 'Learn Node.js', completed: false },
  { id: 2, task: 'Build CRUD API', completed: false },
  { id: 3, task: 'Learn notes', completed: true},
];

// GET All – Read
app.get('/todos', (req, res) => {
  res.status(200).json(todos); // Send array as JSON
});

app.get('/todos/completed', (req, res) => {
  const completed = todos.filter((t) => t.completed);
  res.json(completed); // Custom Read!
});

app.get('/todos/active', (req,res) => {
  const active = todos.filter(t => t.completed == false);
  res.json(active);
})

app.get('/todos/:id', (req,res) => {
  const id = parseInt(req.params.id);
  const todo = todos.find(t => t.id === id);
  if(!todo){
    return res.status(400).json({message: 'id does not exist'})
  };
  res.status(200).json(todo);
});

// POST New – Create
app.post('/todos', (req, res) => {
  const{task,completed} = req.body
   if (!task){
    return res.status(400).json({message: 'Task field required'})
   }
  const newTodo = { id: todos.length + 1, ...req.body }; // Auto-ID
  todos.push(newTodo);
  res.status(201).json(newTodo); // Echo back
});

// PATCH Update – Partial
app.patch('/todos/:id', (req, res) => {
  const todo = todos.find((t) => t.id === parseInt(req.params.id)); // Array.find()
  if (!todo) return res.status(404).json({ message: 'Todo not found' });
  Object.assign(todo, req.body); // Merge: e.g., {completed: true}
  res.status(200).json(todo);
});

// DELETE Remove
app.delete('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const initialLength = todos.length;
  todos = todos.filter((t) => t.id !== id); // Array.filter() – non-destructive
  if (todos.length === initialLength)
    return res.status(404).json({ error: 'Not found' });
  res.status(204).send(); // Silent success
});

app.use((err, req, res, next) => {
  res.status(500).json({ error: 'Server error!' });
});

const PORT = process.env.PORT || 3002
app.listen(PORT, () =>{ console.log(`Server on port ${PORT}`)});
>>>>>>> c4f6568dddbf770ada854c89a90917c842ecc74d
