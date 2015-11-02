'use strict';
apps.controller('CalendarController', function ($scope,$http,$compile,uiCalendarConfig) {
      var default_idleTime = 0;
      var idleTime = 0;
      var idleInterval;
      var data = {};
      var cliName;
      data.emailId = 'testing@mail.com';  

      //console.dir(socket);
    socket.on('eventToEmit', function (data) { 
          console.dir(data);
          angular.forEach(data.Result,function(value, key)
          {  
             //alert(key + '_' + value.Description);
             console.dir(key + '_' + JSON.stringify(value));
          }); 
    }); 

  $scope.events =[]; 
    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();
    
    $scope.changeTo = 'Hungarian';
    /* event source that pulls from google.com */
    $scope.eventSource = {
            url: '',
            className: 'gcal-event',           // an option!
            currentTimezone: 'America/Chicago' // an option!
    };
    $scope.eventsF = function (start, end, timezone, callback) {  
      var s = new Date(start).getTime() / 1000;
      var e = new Date(end).getTime() / 1000;
      var m = new Date(start).getMonth();
      var events = [{title: 'Feed Me ' + m,start: s + (50000),end: s + (100000),allDay: false, className: ['customFeed']}];
     // console.dir(events);
      callback(events);
    };

   
    /* event source that contains custom events on the scope */
    $scope.loadEvents=function(){  
      $scope.frmsearch = {};
      $http.post('caseTracker/calendar/getloadcalendarEvents', $scope.frmsearch).success(function(data) { 

        var arr = [];
        var i = 1;
      angular.forEach(data, function(value, key) { 
        /*var obj={};  
         obj.title=value.subject;
         obj.start=value.startdate;
         obj.end=value.enddate; 
          arr.push(obj); */
        $scope.events.push({
          title: value.subject,
          start: new Date(value.startdate),
          end: new Date(value.enddate)
      });
          i++; 
       }); 
      })
      .error(function(data) {
        console.log('Error: ' + data);
      });
    }; 
     /* event source that contains custom events on the scope */
    // $scope.events = [
    //   {title: 'All Day Event',start: new Date(y, m, 1)},
    //   {title: 'Long Event',start: new Date(y, m, d - 5),end: new Date(y, m, d - 2)}
    // ];
    // console.dir($scope.events);

    $scope.eventSources = [$scope.events, $scope.eventSource, $scope.eventsF];
    $scope.eventSources2 = [$scope.calEventsExt, $scope.eventsF, $scope.events];
    /* event source that calls a function on every view switch */
    

    // $scope.calEventsExt = {
    //    color: '#f00',
    //    textColor: 'yellow',
    //    events: [ 
    //       {type:'party',title: 'Lunch',start: new Date(y, m, d, 12, 0),end: new Date(y, m, d, 14, 0),allDay: false},
    //       {type:'party',title: 'Lunch 2',start: new Date(y, m, d, 12, 0),end: new Date(y, m, d, 14, 0),allDay: false},
    //       {type:'party',title: 'Click for Google',start: new Date(y, m, 28),end: new Date(y, m, 29),url: 'http://google.com/'}
    //     ]
    // };

    /* alert on eventClick */
    $scope.alertOnEventClick = function( date, jsEvent, view){ 
      $scope.title =  date.title;
      $scope.startdate =  date.start._d;
      $('#showCallbackModel').modal('show');
        $scope.alertMessage = (date.title + ' was clicked ');
    };
    /* alert on Drop */
     $scope.alertOnDrop = function(event, delta, revertFunc, jsEvent, ui, view){
       $scope.alertMessage = ('Event Droped to make dayDelta ' + delta);
    };
    /* alert on Resize */
    $scope.alertOnResize = function(event, delta, revertFunc, jsEvent, ui, view ){
       $scope.alertMessage = ('Event Resized to make dayDelta ' + delta);
    };
    /* add and removes an event source of choice */
    $scope.addRemoveEventSource = function(sources,source) {
      var canAdd = 0;
      angular.forEach(sources,function(value, key){
        if(sources[key] === source){
          sources.splice(key,1);
          canAdd = 1;
        }
      });
      if(canAdd === 0){
        sources.push(source);
      }
    };
    /* add custom event*/
    $scope.addEvent = function() {
      $scope.events.push({
        title: 'Open Sesame',
        start: new Date(y, m, 28),
        end: new Date(y, m, 29),
        className: ['openSesame']
      });
    };
    /* remove event */
    $scope.remove = function(index) {
      $scope.events.splice(index,1);
    };
    /* Change View */
    $scope.changeView = function(view,calendar) { 
      uiCalendarConfig.calendars[calendar].fullCalendar('changeView',view);
    };
    /* Change View */
    $scope.renderCalender = function(calendar) { 
      if(uiCalendarConfig.calendars[calendar]){
        uiCalendarConfig.calendars[calendar].fullCalendar('render');
      }
    };
     /* Render Tooltip */
    $scope.eventRender = function( event, element, view ) { 
        element.attr({'tooltip': event.title,
                      'tooltip-append-to-body': true});
        $compile(element)($scope);
    };


     /* config object */
    $scope.uiConfig = { 
      calendar:{
        height: 450,
        editable: true,
        header:{
          left: 'title',
          center: '',
          right: 'today prev,next'
        },
        eventClick: $scope.alertOnEventClick,
        eventDrop: $scope.alertOnDrop,
        eventResize: $scope.alertOnResize,
        eventRender: $scope.eventRender
      }
    };


    $scope.changeLang = function() { 
      if($scope.changeTo === 'Hungarian'){
        $scope.uiConfig.calendar.dayNames = ['Vasárnap', 'Hétfő', 'Kedd', 'Szerda', 'Csütörtök', 'Péntek', 'Szombat'];
        $scope.uiConfig.calendar.dayNamesShort = ['Vas', 'Hét', 'Kedd', 'Sze', 'Csüt', 'Pén', 'Szo'];
        $scope.changeTo= 'English';
      } else {
        $scope.uiConfig.calendar.dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        $scope.uiConfig.calendar.dayNamesShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        $scope.changeTo = 'Hungarian';
      }
    };
   
});
 