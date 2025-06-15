const express = require('express');
const TaskRouter = express.Router();
const TaskDBModel = require('./../models/toDoModel');

TaskRouter.get('/', (request, response)=>{
  const currentUserId = request.user._id;
  const statusFilter = request.query.status || 'all';

  const filter = { userId: currentUserId };
  if (statusFilter && statusFilter !== 'all') {
    filter.status = statusFilter;
  }
    //mongoose find all tasks for specific user 

    TaskDBModel.find(filter)
    .then((tasks)=>{
        response.render('index', { 
            user: request.user,
            tasks ,
            selectedStatus: statusFilter ,
            success: request.flash('success'),
            error: request.flash('error')
        });
    })
    .catch((error)=>{
        console.error('Error creating task:', error);
            response.status(400).render('index', {
                error: 'Failed to create task',
                user: request.user,
                tasks: [] ,
                selectedStatus: 'all'  // default
            })
    })

})

TaskRouter.post('/', (request, response)=>{
    
    const task = {
    task: request.body.task,
    priority: request.body.priority,
    status: request.body.status,
    userId: request.user._id};
    console.log(task);

    TaskDBModel.create(task)
    .then((newtask)=>{
        console.log('Task created successfully:', newtask);
        request.flash('success', 'Task created successfully!');
         response.redirect('/tasks');
    })
    .catch((error)=>{
        console.error('Error creating task:', error);
        response.status(400).render('index', {
                error: 'Failed to create task',
                user: request.user,
                tasks: [],
                selectedStatus: 'all' 
            })
    })
    
})

TaskRouter.put('/:id', (request, response)=>{
    const id = request.params.id
    const updateBody = request.body
    const currentUserId = request.user._id; // Get the user ID from the authenticated user
    
    TaskDBModel.findByIdAndUpdate(id, updateBody, {new : true})
    .then((task)=>{
        console.log('Task updated successfully:', task);
        request.flash('success', 'Task updated successfully!');
        response.status(200).redirect('/tasks');
    })
    .catch((error)=>{
        response.status(500).send(error);
    })
})

TaskRouter.delete('/:id', (request, response)=>{
    const id = request.params.id
    const currentUserId = request.user._id;

    TaskDBModel.findByIdAndDelete(id)
    .then((task)=>{
        console.log('Task deleted successfully:', task);
        request.flash('success', 'Task deleted successfully!');
        response.status(200).redirect('/tasks')
    })
    .catch((error)=>{
        console.error('Error creating task:', error);
        response.status(400).render('index', {
                error: 'Failed to create task',
                user: request.user,
                tasks: [] ,
                selectedStatus: 'all' 
            })
    })
})

module.exports = TaskRouter;