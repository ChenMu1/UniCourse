var app = angular.module('Unicourse', ['ngResource','ngRoute']);  // The first argument is the name of the module. The second argument is an array of dependencies. (ngResource, for consuming RESTful APIs and ngRoute for routing.)
app.config(['$routeProvider', function($routeProvider){
    $routeProvider
        .when('/', {
            templateUrl: 'partials/home.html',
            controller: 'HomeCtrl'  //register Home controller as part of the route
        })
        .when('/add-course', {  //tell Angular to present this view when the user navigates to /add-course.
            templateUrl: 'partials/course-form.html',   
            controller: 'AddCourseCtrl' //register AddCourse controller as part of the route
        })
        .when('/course/:id', {
            templateUrl: 'partials/course-form.html',
            controller: 'EditCourseCtrl'    //register EditCourse controller as part of the route
        })
        .when('/course/delete/:id', {
            templateUrl: 'partials/course-delete.html',
            controller: 'DeleteCourseCtrl'  //register DeleteCourse controller as part of the route
        })
        .otherwise({
            redirectTo: '/'
        });
}]);

/*Controller Area*/
/*
$scope to pass data to the view, $resource to consume a RESTful API. The last object in this array of dependencies is a function that represents the body or implementation of the controller
Three dependencies: $scope as the glue between the controller and the view, $resource for working with our RESTful API, and $location for changing the URL in the browser address bar. 
All of these are built-in Angular services.
*/
app.controller('HomeCtrl', ['$scope', '$resource',
    function($scope, $resource){
        var Courses = $resource('/api/courses'); // call the $resource method to get a resource object for the given API endpoint (/api/courses)
        Courses.query(function(courses){    //query method gets a callback method that will be executed when the query result is ready. This function will receive the courses retrieved from the server
            $scope.courses = courses;
        });      
    }]);
app.controller('AddCourseCtrl', ['$scope', '$resource', '$location',
    function($scope, $resource, $location){
        $scope.save = function(){
            var Courses = $resource('/api/courses');
            Courses.save($scope.course, function(){
                $location.path('/');
            });
        };
    }]);
app.controller('EditCourseCtrl', ['$scope', '$resource', '$location', '$routeParams',
    function($scope, $resource, $location, $routeParams){	//$routeParams, which use for accessing parameters in the route (URL). In this case, the ID of the course to edit will be route parameter.
        var Courses = $resource('/api/courses/:id', { id: '@_id' }, {   // ‘@_id’ tells Angular to look for a property called _id in the object included in the body of the request.
            update: { method: 'PUT' }   //The third argument to the $resource method is used for extending the $resource service. Because by default, cannot send HTTP PUT requests using $resource service.
        });

        Courses.get({ id: $routeParams.id }, function(course){  //use $routeParams.id, access to the parameters in the browser’s address bar
            $scope.course = course;
        });

        $scope.save = function(){
            Courses.update($scope.course, function(){   //using Videos.update, the new method that extending the $resource service. This will issue an HTTP PUT request to API endpoint.
                $location.path('/');
            });
        }
    }]);
app.controller('DeleteCourseCtrl', ['$scope', '$resource', '$location', '$routeParams',
    function($scope, $resource, $location, $routeParams){
        var Courses = $resource('/api/courses/:id');
        Courses.get({ id: $routeParams.id }, function(course){
            $scope.course = course;
        })

        $scope.delete = function(){
            Courses.delete({ id: $routeParams.id }, function(course){
                $location.path('/');
            });
        }
    }]);