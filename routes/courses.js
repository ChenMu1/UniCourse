var express = require('express');
var router = express.Router();

var monk = require('monk'); //import Monk, which is a persistence module over MongoDB.
var db = monk('localhost:27017/unicourse'); //the monk variable is a method that call to get access to database.

router.get('/', function(req, res) {
    var collection = db.get('courses'); //call the get method on the db object, passing the name of the collection (courses).
    collection.find({}, function(err, courses){ 
        /*'find' method to get all courses in the collection; 
        The first argument to this method is an object that determines the criteria for filtering. 
        For getting all courses, pass an empty object as the argument.
        The second argument is a callback method that is executed when the result is returned from the database
        This method follows the “error-first” callback pattern, which is the standard protocol for callback methods in Node. */
        if (err) throw err;
      	res.json(courses);
    });
});

/*API Endpoint Area*/
//Building the API Endpoint
router.post('/', function(req, res){
    var collection = db.get('courses');
    collection.insert({
        title: req.body.title,  //read the values for title and description by using req.body; This object represents the data that will be posted in the body of the request.
        description: req.body.description
    }, function(err, course){
        if (err) throw err;    //if don’t get any errors, use the json method of the response (res) to return a JSON representation of the new course document.
        res.json(course);
    });
});

router.get('/:id', function(req, res) { //a route parameter, indicated by a colon (:id). Can access the value of this parameter using req.params.id.
    var collection = db.get('courses');
    collection.findOne({ _id: req.params.id }, function(err, course){
        if (err) throw err;
      	res.json(course);
    });
});

router.put('/:id', function(req, res){
    var collection = db.get('courses');
    collection.update({
        _id: req.params.id
    },
    {
        title: req.body.title,
        description: req.body.description
    }, function(err, course){
        if (err) throw err;
        res.json(course);
    });
});

router.delete('/:id', function(req, res){
    var collection = db.get('courses');
    collection.remove({ _id: req.params.id }, function(err, course){
        if (err) throw err;

        res.json(course);
    });
});

module.exports = router;