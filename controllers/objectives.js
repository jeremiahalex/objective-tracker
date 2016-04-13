'use strict';

const Objective = require('../models/objective');

//Helper function to find a record by id else redirect with an error
function loadobjective(req,res,next){
  Objective.findById({_id: req.params.id}, (err, objective) =>{
    if (err) return res.status(404).json({message: `Find failed.`});

    next(objective);
  });
}

////INDEX
//function index(req, res){
//  objective.find((err,objectives) => {
//    if (err) return res.status(404).json({message: `Find failed.`});
//    
//    res.status(404).json({objectives: objectives});
//  });
//}

//CREATE
function create(req,res){
  var objective = new Objective(req.body);
  objective.save(err => {
    if (err) res.status(422).json({message: `Save failed.`, error: err.errmsg});

    res.status(201).json({message: "objective saved", objective: objective});
  });
}

////SHOW
//function show(req, res){
//  loadobjective(req, res, objective => {
//    res.status(200).json({objective: objective});
//  });
//}

//UPDATE
function update(req, res){
  loadobjective(req, res, objective => {
//    if(request.body.name) agent.name = request.body.name;

    objective.save(err => {
      if (err) res.status(422).json({message: `Save failed.`});

      res.status(200).json({message: "objective updated", objective: objective});
    });
    
  });
}

//DELETE
function destroy(req, res){
  Objective.remove({_id: req.params.id}, err => {
    if (err) res.status(422).json({message: `Destroy failed.`});

    res.status(200).json({message: "objective destroyed"});
  });
}

module.exports = {
//  index: index,
//  show: show,
  create: create,
  update: update,
  destroy: destroy
};