const db = require("../models");

module.exports = function(app) {
    //  Here is the get to pull info for the workouts page
    app.get("/api/workouts", (req, res) => {
        db.Workout.find({}).then(dbWorkout => {
          
          dbWorkout.forEach(workout => {
            var total = 0;
            workout.exercises.forEach(e => {
                total += e.duration;
            });
            workout.totalDuration = total;

        });
            res.json(dbWorkout);
        })
        .catch(err => {
            res.status(400).json(err);
        });
    })
    // App.get to pull up info for the range page
    app.get("/api/workouts/range", ({}, res) => {
      db.Workout.find({}).then((dbWorkout) => {
        res.json(dbWorkout);
      }).catch(err => {
        res.status(400).json(err);
      });
    });
    // App.post to submit new completed workouts
    app.post("/api/workouts/", (req, res) => {
        db.Workout.create(req.body).then((dbWorkout) => {
          res.json(dbWorkout);
        }).catch(err => {
            res.status(400).json(err);
          });
      });
      // App.put to update workouts by MongoDB _id value and update the exercsise body
      app.put("/api/workouts/:id", (req, res) => {
        db.Workout.findOneAndUpdate(
          { _id: req.params.id }, 
          {
            $inc: { totalDuration: req.body.duration },
            $push: { exercises: req.body }
        },
        { new: true }
          ).then((dbWorkout) => {
          res.json(dbWorkout);
        }).catch(err => {
          res.status(400).json(err);
        });
    });
};