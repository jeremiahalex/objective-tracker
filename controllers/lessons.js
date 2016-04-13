'use strict';

const Lesson = require('../models/lesson');

//Helper function to find a record by id else redirect with an error
function loadLesson(req,res,next){
  Lesson.findById({_id: req.params.id}, (err, lesson) =>{
    if (err) return res.status(404).json({message: `Find failed.`});

    next(lesson);
  });
}

// Restrict access to editors only, redirecting and returning false if user is not an editor
function restrictedToEditors(lesson,req,res){
    if ( lesson.editors.includes(req.user.id) ) return false;
    res.status(401).json({message: "Access Denied"});
    return true;
}

//INDEX
function index(req, res){
  Lesson.find((err,lessons) => {
    if (err) return res.status(404).json({message: `Find failed.`});
    
    res.status(200).json({lessons: lessons});
  });
}

//CREATE
function create(req,res){
  var lesson = new Lesson(req.body);
  lesson.save(err => {
    if (err) res.status(404).json({message: `Save failed.`});

    res.status(201).json({message: "Lesson saved", lesson: lesson});
  });
}

//SHOW
function show(req, res){
  loadLesson(req, res, lesson => {
    res.status(200).json({lesson: lesson});
  });
}

//UPDATE
function update(req, res){
  loadLesson(req, res, lesson => {
    if ( restrictedToEditors(lesson, req, res) ) return;
//    if(request.body.name) agent.name = request.body.name;

    lesson.save(err => {
      if (err) res.status(422).json({message: `Save failed.`});

      res.status(200).json({message: "Lesson updated", lesson: lesson});
    });
    
  });
}

//DELETE
function destroy(req, res){
  loadLesson(req, res, lesson => {
    if ( restrictedToEditors(lesson, req, res) ) return;
    Lesson.remove({_id: req.params.id}, err => {
      if (err) res.status(422).json({message: `Destroy failed.`});

      res.status(200).json({message: "Lesson destroyed"});
    });
  });
}

module.exports = {
  index: index,
  show: show,
  create: create,
  update: update,
  destroy: destroy
};