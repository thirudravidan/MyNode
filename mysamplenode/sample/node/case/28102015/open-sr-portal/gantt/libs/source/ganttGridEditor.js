/*
 Copyright (c) 2012-2014 Open Lab
 Written by Roberto Bicchierai and Silvia Chelazzi http://roberto.open-lab.com
 Permission is hereby granted, free of charge, to any person obtaining
 a copy of this software and associated documentation files (the
 "Software"), to deal in the Software without restriction, including
 without limitation the rights to use, copy, modify, merge, publish,
 distribute, sublicense, and/or sell copies of the Software, and to
 permit persons to whom the Software is furnished to do so, subject to
 the following conditions:

 The above copyright notice and this permission notice shall be
 included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
function GridEditor(master) {
  this.master = master; // is the a GantEditor instance
  this.gridified = $.gridify($.JST.createFromTemplate({}, "TASKSEDITHEAD"));
  this.element = this.gridified.find(".gdfTable").eq(1);
}


GridEditor.prototype.fillEmptyLines = function () {
  var factory = new TaskFactory();

  //console.debug("GridEditor.fillEmptyLines");
   //var rowsToAdd = 30 - this.element.find(".taskEditRow").size();
    var totrec = this.element.find(".taskEditRow").size();
    // var rowsToAdd = (((totrec >= 15) ? 1 : (15 - totrec)));
    var rowsToAdd = (((totrec >= parseInt(golobalconfigs.ganttRows,10)) ? 1 : (parseInt(golobalconfigs.ganttRows,10) - totrec)));
    var gmaster;

  //fill with empty lines
  for (var i = 0; i < rowsToAdd; i++) {
    var emptyRow = $.JST.createFromTemplate({}, "TASKEMPTYROW");
    //click on empty row create a task and fill above
    var master = this.master;
    emptyRow.click(function (ev) {
      var emptyRow = $(this);
      //add on the first empty row only
      if (!master.canWrite || emptyRow.prevAll(".emptyRow").size() > 0)
        return

      master.beginTransaction();
      var lastTask;
      var start = new Date().getTime();
      var level = 0;
      if (master.tasks[0]) {
        start = master.tasks[0].start;
        level = master.tasks[0].level + 1;
      }

      //fill all empty previouses
      emptyRow.prevAll(".emptyRow").andSelf().each(function () {
        var ch = factory.build("tmp_fk" + new Date().getTime(), "", "", level, start, 1);
        var task = master.addTask(ch);
        lastTask = ch;
      });
      master.endTransaction();
      lastTask.rowElement.click();
      lastTask.rowElement.find("[name=name]").focus()//focus to "name" input
        .blur(function () { //if name not inserted -> undo -> remove just added lines
          var imp = $(this);
          if (imp.val() == "") {
            lastTask.name="Task "+(lastTask.getRow()+1);
            imp.val(lastTask.name);
          }
        });
    });
    this.element.append(emptyRow);
  }


 $('body').on('mouseover', ".gdfTable tbody tr,.gdfWrapper", function () {
        $('.showhidecol').slideUp();
        $('.optionsmnu').slideUp();
        $('.phasemnu').slideUp();
        $('.highlevelplanmnu').slideUp();
    });

 $('body').on('mouseover', "button[title=options],button[title=phaseoptions],#showhidecol,button[title=highlevelplan]", function () {
        var title = $(this).attr('title');
        if (title == 'options') {
            $('.showhidecol').slideUp();
            $('.phasemnu').slideUp();
            $('.highlevelplanmnu').slideUp();
        }
        else if (title == 'phaseoptions') {
            $('.showhidecol').slideUp();
            $('.optionsmnu').slideUp();
            $('.highlevelplanmnu').slideUp();
        }
        else if (title == 'highlevelplan') {
            $('.optionsmnu').slideUp();
            $('.phasemnu').slideUp();
            $('.showhidecol').slideUp();
        }
        else {
            $('.optionsmnu').slideUp();
            $('.phasemnu').slideUp();
            $('.highlevelplanmnu').slideUp();
        }
    });
};

var getAllChildren = function (task) {
    var childen = task.getChildren();
    $.each(childen, function (i, rec) {
        if (rec.hasChild) {
            var child = getAllChildren(rec);
            $.each(child, function (idx, recc) {
                childen.splice((i + 1), 0, recc);
            });
            child = [];
        }
    });
    return childen;
};

GridEditor.prototype.addTask = function (task, row, hideIfParentCollapsed) {
  //console.debug("GridEditor.addTask",task,row);
  //var prof = new Profiler("editorAddTaskHtml");

  //remove extisting row
  this.element.find("[taskId=" + task.id + "]").remove();

  var taskRow = $.JST.createFromTemplate(task, "TASKROW");

  var fixtaskRow;
  //save row element on task
    var statusobj = taskRow.find('select[name=status]');
    statusobj.find('option[value="' + task.status + '"]').attr('selected', true);
    statusobj.attr('data-initval', task.status);

  //PrimaryOwner and SecondaryOwner select
  if ($.type(task.primaryowner) == 'object' || task.primaryowner != null) {
      // $.each(parentgconfig.projectUser, function (idx, rec) {
      //     taskRow.find('select[name=primaryowner]').append("<option value='" + rec.id + "' text='" + rec.value + "'>" + rec.value + "</option>")
      //     taskRow.find('select[name=secondaryowner]').append("<option value='" + rec.id + "' text='" + rec.value + "'>" + rec.value + "</option>");
      // });
      // console.log('task.primaryowner-----',task.primaryowner);
      taskRow.find('select[name=primaryowner]').find('option[value="' + task.primaryowner.userid + '"]').attr('selected', true);
      taskRow.find('select[name=secondaryowner]').find('option[value="' + task.secondaryowner.userid + '"]').attr('selected', true);
  }

  task.rowElement = taskRow;

  this.bindRowEvents(task, taskRow);

  if (typeof(row) != "number") {
    var emptyRow = this.element.find(".emptyRow:first"); //tries to fill an empty row
    if (emptyRow.size() > 0)
      emptyRow.replaceWith(taskRow);
    else
      this.element.append(taskRow);
  } else {
    var tr = this.element.find("tr.taskEditRow").eq(row);
    if (tr.size() > 0) {
      tr.before(taskRow);
    } else {
      this.element.append(taskRow);
    }

  }
  // this.element.find(".taskRowIndex").each(function (i, el) {
  //   $(el).html(i + 1);
  // });
  //prof.stop();


  //[expand]
  if(hideIfParentCollapsed)
  {
    if(task.collapsed) taskRow.find(".exp-controller").removeClass('exp');
    var collapsedDescendant = this.master.getCollapsedDescendant();
    if(collapsedDescendant.indexOf(task) >= 0) taskRow.hide();
  }


   // shwhidcol();

   //  if (task.level != 0 && isneedCxtmenu) {
   //      $(task.rowElement).contextMenu({
   //          menuSelector: "#contextRMenu",
   //          menuSelected: function (invokedOn, selectedMenu) {
   //              var selectedCArr = selectedMenu.text().split('|');
   //              var selectedC = $.trim(selectedCArr[1]);
   //              var nodeId = invokedOn;
   //              //alert(selectedC);
   //          }
   //      });
   //  }

    if (task.level == 0) {
        $(".gdfTable tbody tr[level=0]").addClass("nodrag nodrop root");
        $(".gdfTable tbody tr[level=0] th").removeClass('dragHandle');
        $(".gdfTable tbody tr[level=0] td input").attr("readonly", true);
        $(".gdfTable tbody tr[level=0] td input[name=duration]").attr("readonly", false);
        $(".gdfTable tbody tr[level=0] td input[name=name]").attr("readonly", false);
        $(".gdfTable tbody tr[level=0] td [name=primaryowner]").remove();
        $('.gdfTable tbody tr[level=0] td [name=secondaryowner]').remove();
        $('.gdfTable tbody tr[level=0] td input.chkstyle').remove();
        // $('.gdfTable tbody tr[level=0] td select[name=status]').remove();
        $(".gdfTable tbody tr[level=0] td span").remove();
        $('.gdfTable tbody tr[level=0] td a').remove();
    }
   //  if (!isneedDragdrop) {
   //      $(".gdfTable tbody tr th").removeClass('dragHandle');
   //  }
          

  return taskRow;
};

GridEditor.prototype.refreshExpandStatus = function(task){
  if(!task) return;
  //[expand]
  var child = task.getChildren();
  if(child.length > 0 && task.rowElement.has(".expcoll").length == 0)
  {
    task.rowElement.find(".exp-controller").addClass('expcoll exp');
  }
  else if(child.length == 0 && task.rowElement.has(".expcoll").length > 0)
  {
    task.rowElement.find(".exp-controller").removeClass('expcoll exp');
  }

  var par = task.getParent();
  if(par && par.rowElement.has(".expcoll").length == 0)
  {
    par.rowElement.find(".exp-controller").addClass('expcoll exp');
  }

}

GridEditor.prototype.refreshTaskRow = function (task) {
  console.debug("refreshTaskRow");
  //var profiler = new Profiler("editorRefreshTaskRow");
  var row = task.rowElement;
  row.find(".taskRowIndex").html(task.getRow() + 1);
  row.find(".indentCell").css("padding-left", task.level * 10 +18 );
  row.find("[name=name]").val(task.name);
  row.find("[name=code]").val(task.code);
  

  row.find("[name=duration]").val(task.duration);
  row.find("[name=start]").val(new Date(task.start).format()).updateOldValue(); // called on dates only because for other field is called on focus event
  row.find("[name=end]").val(new Date(task.end).format()).updateOldValue();
   row.find('.status').attr("status", task.status);
   var EndDate1 = row.find("[name=end]").val();
   
    if (task.status == "STATUS_FAILED") {
        var EndDate = row.find("[name=end]").val();
        var dateParts =EndDate.split('/');
        var dateMonth = getMonthval(dateParts[1]);
        // Code commented on for the date format
        // EndDate = Date.parse(new Date(EndDate.split('/')[2], ((EndDate.split('/')[0]) - 1), EndDate.split('/')[1]));
        EndDate = Date.parse(new Date(dateParts[2], parseInt(dateMonth,10), dateParts[0]));
        var today = Date.parse(new Date());

        if (EndDate >= today) {
            task.status = "STATUS_ACTIVE";
            statusobj = row.find(".status");
            statusobj.find('option[value="' + task.status + '"]').attr('selected', true);
            statusobj.attr('data-initval', task.status);
        }
    }


  row.find("[name=depends]").val(task.depends);
  row.find(".taskAssigs").html(task.getAssigsString());

  //profiler.stop();


  $('.exp-controller').each(function () {
        $(this).closest('tr').css({ "font-size": "10", "font-weight": "normal" });
    });
    $('.exp-controller.expcoll').each(function () {
        $(this).closest('tr').css({ "font-size": "12", "font-weight": "bold" });
    });
    var projectdate = task.rowElement.parent().find('tr[level=0]').find('input[name=start]').val();

    var startday = row.find('input[name=startday]');
    var endday = row.find('input[name=endday]');
    var duration = row.find('input[name=duration]').val();
    var startdate = row.find('input[name=start]').val();
    var enddate = row.find('input[name=end]').val();
    var progress = row.find('input[name=progress]');
    var progressbar = row.find('div.progress .progress-bar.progress-bar-info');

    calculateSTARTDAYENDDAY(startdate, enddate, projectdate, startday, endday, duration, progress, progressbar, task.status);
    task.startday = startday.val();
    task.endday = endday.val();
    task.progress = progress.val();
    if (row.find('[name=primaryowner]').attr('type') == 'text') {
        task.primaryowner = row.find('input[name=primaryowner]').val();
        task.secondaryowner = row.find('input[name=secondaryowner]').val();
    }
    else {
        var priid = row.find('select[name=primaryowner]').val();
        var secid = row.find('select[name=secondaryowner]').val();
        priid = priid == '' ? {} : { "userid": priid, "username": "" };
        secid = secid == '' ? {} : { "userid": secid, "username": "" };
        task.primaryowner = priid;
        task.secondaryowner = secid;
    }
    if (!task.hasOwnProperty('comments')) {
        task.comments = [];
    }
    if (!task.hasOwnProperty('files')) {
        task.files = [];
    }
    var self = this;
    // self.master.gantt.refreshGantt();
  //   //parent.$('.loader').hide();
  //   parent.hideloader();
};

function getMonthval(mon) {
    // var pattern = /(.*?)\/(.*?)\/(.*?)$/;
    // var result = input.replace(pattern,function(match,p1,p2,p3){
    //     var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    //     // return (p2<10?"0"+p2:p2) + " " + months[(p1-1)] + " " + p3;         
        
    //      return months.indexOf(p2);
    // });
    // // console.log('getMonth result',result);
    // return result;
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return months.indexOf(mon);
}

function calculateSTARTDAYENDDAY(stdate, enddate, pjtstdate, objstartday, objendday, dur, objprogress, objprogressbar, status) {
    //parent.$('.loader').show();
    // parent.showloader();

    var dtarr = stdate.split('-');
    // var startdate = new Date(dtarr[2], (dtarr[0] - 1), dtarr[1]);
    var stdateMon = getMonthval(dtarr[1]);
    // var startdate = new Date(dtarr[2], (dtarr[1] - 1), dtarr[0]);
    var startdate = new Date(dtarr[2], (parseInt(stdateMon,10)), dtarr[0]);
    // console.log('startdate-------',startdate);
    
    // console.log('momentval' ,moment(stdate));
    // var startdate =moment(stdate);
    dtarr = pjtstdate.split('-');
    var pjtstdateMon = getMonthval(dtarr[1]);
    // var projectdate = new Date(dtarr[2], (dtarr[0] - 1), dtarr[1]);
    // var projectdate = new Date(dtarr[2], (dtarr[1] - 1), dtarr[0]);
    var projectdate = new Date(dtarr[2], (parseInt(pjtstdateMon,10)), dtarr[0]);

    var newdate = new Date(projectdate);
    // var newdate =moment(pjtstdate);
    
    var startday = 1;
    for (; newdate < startdate; ) {
        newdate.setDate(newdate.getDate() + 1);
        if (newdate.getDay() != 0 && newdate.getDay() != 6) {
            startday++;
        }
    }
    // startday++;
    objstartday.val(startday);

    dtarr = enddate.split('-');
    var enddateMon = getMonthval(dtarr[1]);
    // enddate = new Date(dtarr[2], (dtarr[0] - 1), dtarr[1]);
    // enddate = new Date(dtarr[2], (dtarr[1] - 1), dtarr[0]);
    enddate = new Date(dtarr[2], (parseInt(enddateMon,10)), dtarr[0]);
    // enddate =moment(enddate);
    var newdate = new Date(projectdate);
    var endday = 1;
    for (; newdate < enddate; ) {
        newdate.setDate(newdate.getDate() + 1);
        if (newdate.getDay() != 0 && newdate.getDay() != 6) {
            endday++;
        }
    }
    objendday.val(endday);

    var ctDate = new Date();
    var newdate = new Date(projectdate);
    var currentday = 1;
    for (; newdate < ctDate; ) {
        newdate.setDate(newdate.getDate() + 1);
        if (newdate.getDay() != 0 && newdate.getDay() != 6) {
            currentday++;
        }
    }
    
    var progress = 0;
    switch (status) {
        case 'STATUS_UNDEFINED': //Open
            progress = 0;
            break;
        case 'STATUS_SUSPENDED': //Pending
            progress = objprogress.val();
            break;
        case 'STATUS_ACTIVE': //inprogress
            progress = (((currentday - startday)) * 100) / dur;
            break;
        case 'STATUS_DONE': //Closed
            progress = 100;
            break;
    }
    progress = (progress >= 0 ? progress > 100 ? 100 : Math.round(progress) : 0);
    objprogress.val(progress);
    objprogressbar.css("width", progress + "px");
    //parent.$('.loader').hide();
    // parent.hideloader();
}

GridEditor.prototype.redraw = function () {
  for (var i = 0; i < this.master.tasks.length; i++) {
    this.refreshTaskRow(this.master.tasks[i]);
  }
};

GridEditor.prototype.reset = function () {
  this.element.find("[taskid]").remove();
};


GridEditor.prototype.bindRowEvents = function (task, taskRow) {
  var self = this;
  //console.debug("bindRowEvents",this,this.master,this.master.canWrite, task.canWrite);
  if (this.master.canWrite && task.canWrite ) {
    self.bindRowInputEvents(task, taskRow);
    
  } else { //cannot write: disable input
    taskRow.find("input").attr("readonly", true);
    taskRow.find("select").attr("disabled", "disabled");
  }
  if(task.comments != undefined){
    if(task.comments.length == 0) {
    taskRow.find(".comments").removeClass("high-light");
    }
    if(task.files.length == 0) {
    taskRow.find(".paper-clip").hide();
    }
  }
  

  self.bindRowExpandEvents(task, taskRow);

  // taskRow.find(".edit").click(function () {self.openFullEditor(task, taskRow)});
};


GridEditor.prototype.bindRowExpandEvents = function (task, taskRow) {
  var self = this;
  //expand collapse
   taskRow.find(".exp-controller").click(function(){
   //expand?
     var el=$(this);
     var taskId=el.closest("[taskid]").attr("taskid");
     var task=self.master.getTask(taskId);
     var descs=task.getDescendant();
     el.toggleClass('exp');
     task.collapsed = !el.is(".exp");
    var collapsedDescendant = self.master.getCollapsedDescendant();

     if (el.is(".exp")){
        for (var i=0;i<descs.length;i++)
        {
          var childTask = descs[i];
          if(collapsedDescendant.indexOf(childTask) >= 0) continue;
          childTask.rowElement.show();
        }

     } else {
        for (var i=0;i<descs.length;i++)
        descs[i].rowElement.hide();
     }
     self.master.gantt.refreshGantt();

   });
}

var pickstatus = true;
GridEditor.prototype.bindRowInputEvents = function (task, taskRow) {
  var self = this;
  if (taskRow.attr('level') == 0) {
        taskRow.find('[name=primaryowner]').remove();
        taskRow.find('[name=secondaryowner]').remove();
  }
    taskRow.find('input').attr('maxlength', '150px');
    taskRow.find("input[name=primaryowner],input[name=secondaryowner]").keypress(function (evt) {
        var charCode = (evt.which) ? evt.which : event.keyCode;
        if ((charCode < 65 || charCode > 90) && (charCode < 96 || charCode > 122) && charCode != 32)
            return false;
        return true;
    }).bind("paste", function (e) {
        var ctl = $(this);
        var prevtxt = $(this).val();
        setTimeout(function () {
            var VAL = ctl.val();
            var charregex = new RegExp(/^[a-zA-Z',-]+$/);
            if (charregex.test(VAL)) {
            }
            else {
                ctl.val(prevtxt);
            }
        }, 100);
    });

  //bind dateField on dates
  taskRow.find(".date").each(function () {
    var el = $(this);

     el.keypress(function (evt) {
            var charCode = (evt.which) ? evt.which : event.keyCode;
            return false;
        });

    //start is readonly in case of deps
    if (task.depends && el.attr("name") == "start") {
     // el.attr("readonly", "true");
      el.find('input').datepicker('hide');
    } else {
      el.removeAttr("readonly");
      el.find('input').datepicker({
                format: 'dd/mm/yyyy',
                weekStart: 0,
                autoclose: true,
                todayHighlight: true,
                keyboardNavigation: true
            }).on('changeDate', function (date) {
                setdate(this, date);
            }).on('hide', function (date) {
                pickstatus = true;
                setdate(this, date);
            }).on('show', function (date) {
                if (pickstatus == true) {
                    var selDate =$(this).val().split('-');
                    var dateMonth = getMonthval(selDate[1]);     
                    // var realDate = new Date(selDate[2],dateMonth,selDate[0]);         
                    var realDate = selDate[0] + '/' + (parseInt(dateMonth,10)+1) + '/' +selDate[2];
                    // $(this).datepicker('setDate', $(this).val());
                    $(this).datepicker({ dateFormat: 'dd/mm/yyyy' }); // format to show
                    $(this).datepicker('setDate', realDate);
                    pickstatus = false;
                }
                else {
                    return;
                }
            });
            el.find('input').on('keydown', function () {
                $(this).datepicker('hide');
            });
    }

    
  });

 function setdate(lnk, date) {
        // parent.showloader();

        var inp = $(lnk);
        console.log('inp val',inp.val());
        if (inp.val() == "") {
            inp.val(inp.getOldValue());
        }
        if (inp.isValueChanged()) {
            if (!Date.isValid(inp.val())) {
                alert(GanttMaster.messages["INVALID_DATE_FORMAT"]);
                inp.val(inp.getOldValue());

            } else {
                //var date = Date.parseString(inp.val());
                var date = date.date;
                var row = inp.closest("tr");
                var taskId = row.attr("taskId");
                var task = self.master.getTask(taskId);
                var lstart = task.start;
                var lend = task.end;

                if (inp.attr("name") == "start") {
                    lstart = date.getTime();
                    if (lstart >= lend) {
                        var end_as_date = new Date(lstart);
                        lend = end_as_date.add('d', task.duration).getTime();
                    }

                    //update task from editor
                    self.master.beginTransaction();
                    self.master.moveTask(task, lstart);
                    self.master.endTransaction();

                } else {
                    lend = date.getTime();
                    if (lstart >= lend) {
                        lend = lstart;
                    }
                    lend = lend + 3600000 * 20; // this 20 hours are mandatory to reach the correct day end (snap to grid)
                    //update task from editor
                    self.master.beginTransaction();
                    self.master.changeTaskDates(task, lstart, lend);
                    self.master.endTransaction();
                }
                inp.updateOldValue(); //in order to avoid multiple call if nothing changed
            }
        }
        //parent.$('.loader').hide();
        // parent.hideloader();
    }


  //binding on blur for task update (date exluded as click on calendar blur and then focus, so will always return false, its called refreshing the task row)
  taskRow.find("input:not(.date)").focus(function () {
    $(this).updateOldValue();

  }).blur(function () {
      var el = $(this);
      if (el.isValueChanged()) {
        var row = el.closest("tr");
        var taskId = row.attr("taskId");

        var task = self.master.getTask(taskId);

        //update task from editor
        var field = el.attr("name");

        //Actual Code Commented
        self.master.beginTransaction();

        if (field == "depends") {
          var oldDeps = task.depends;
          task.depends = el.val();

          //start is readonly in case of deps
          if (task.depends) {
            row.find("[name=start]").attr("readonly", "true");
          } else {
            row.find("[name=start]").removeAttr("readonly");
          }


          // update links
          var linkOK = self.master.updateLinks(task);
          if (linkOK) {
            //synchronize status from superiors states
            var sups = task.getSuperiors();
            for (var i = 0; i < sups.length; i++) {
              if (!sups[i].from.synchronizeStatus())
                break;
            }
            self.master.changeTaskDates(task, task.start, task.end); // fake change to force date recomputation from dependencies
          }

        } else if (field == "duration") {
          var dur = task.duration;
          dur = parseInt(el.val()) || 1;
          el.val(dur);
          var newEnd = computeEndByDuration(task.start, dur);
          self.master.changeTaskDates(task, task.start, newEnd);

        } else if (field == "name" && el.val() == "") { // remove unfilled task
            task.deleteTask();

        } else {
          task[field] = el.val();
        }
        self.master.endTransaction();
      }
    });

  //cursor key movement
  taskRow.find("input").keydown(function (event) {
    var theCell = $(this);
    var theTd = theCell.parent();
    var theRow = theTd.parent();
    var col = theTd.prevAll("td").size();

    var ret = true;
    switch (event.keyCode) {

      case 37: //left arrow
        if(this.selectionEnd==0)
          theTd.prev().find("input").focus();
        break;
      case 39: //right arrow
        if(this.selectionEnd==this.value.length)
          theTd.next().find("input").focus();
        break;

      case 38: //up arrow
        var prevRow = theRow.prev();
        var td = prevRow.find("td").eq(col);
        var inp = td.find("input");

        if (inp.size()>0)
          inp.focus();
        break;
      case 40: //down arrow
        var nextRow = theRow.next();
        var td = nextRow.find("td").eq(col);
        var inp = td.find("input");
        if (inp.size()>0)
          inp.focus();
        else
          nextRow.click(); //create a new row
        break;
      case 36: //home
        break;
      case 35: //end
        break;

      case 9: //tab
       case 13: //enter
       break;
    }
    return ret;

  }).focus(function () {
    $(this).closest("tr").click();
  });


  //change status
  taskRow.find(".taskStatus").click(function () {
        var el = $(this);
        var tr = el.closest("[taskid]");
        var taskId = tr.attr("taskid");
        var task = self.master.getTask(taskId);

        var changer = $.JST.createFromTemplate({}, "CHANGE_STATUS");
        changer.find("[status=" + task.status + "]").addClass("selected");
        changer.find(".taskStatus").click(function (e) {
            e.stopPropagation();
            var newStatus = $(this).attr("status");
            changer.remove();
            self.master.beginTransaction();
            task.changeStatus(newStatus);
            self.master.endTransaction();
            el.attr("status", task.status);
        });
        el.oneTime(3000, "hideChanger", function () {
            changer.remove();
        });
        el.after(changer);
    });


    taskRow.find(".status").change(function () {
        var newStatus = $(this).val();
        var prevValue = ($.data(this, 'current') == undefined ? $(this).data().initval : $.data(this, 'current'));

        if (prevValue == "STATUS_FAILED") {
            $(this).val(prevValue);
            return false;
        }
        if (newStatus == "STATUS_FAILED") {
            $(this).val(prevValue);
            return false;
        }
        var el = $(this);
        var tr = el.closest("[taskid]");
        var taskId = tr.attr("taskid");
        var task = self.master.getTask(taskId);

        self.master.beginTransaction();
        task.changeStatus(newStatus);
        self.master.endTransaction();

        //var par = task.getChildren();
        var par = task.getDescendant()
        $.each(par, function (idx, tas) {
            $('.gdfTable tbody tr[taskid=' + tas.id + ']').find('select[name=status]').find('option[value="' + newStatus + '"]').attr('selected', true);
            self.master.beginTransaction();
            tas.changeStatus(newStatus);
            self.master.endTransaction();
        });

        $.data(this, 'current', $(this).val());
    });

    taskRow.find("select[name=primaryowner],select[name=secondaryowner]").change(function () {
        var el = $(this);
        var tr = el.closest("[taskid]");
        var taskId = tr.attr("taskid");
        var task = self.master.getTask(taskId);
        var userid = $(this).val();
        var username = $(this).find("option:selected").text();
        self.master.beginTransaction();
        $(this).attr('name') == 'primaryowner' ? task.primaryowner = { "userid": userid, "username": username} : task.secondaryowner = { "userid": userid, "username": username };
        // alert(JSON.stringify(task.primaryowner));
        self.master.endTransaction();
    });

    taskRow.find(".duration").keypress(function (evt) {
        var charCode = (evt.which) ? evt.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57))
            return false;
        return true;
    }).attr('maxlength', '3');

    //check disable
    taskRow.find("input.chkstyle").change(function () {
        var el = $(this);
        var tr = el.closest("[taskid]");
        var taskId = tr.attr("taskid");
        var task = self.master.getTask(taskId);
        var childs = getAllChildren(task);
        var status = task.rowElement.find('input.chkstyle').prop('checked');
        $.each(childs, function (i, rec) {
            if (status) {
                rec.rowElement.find('input.chkstyle').prop('checked', false);
                rec.rowElement.find('input.chkstyle').prop('disabled', true);
            }
            else {
                rec.rowElement.find('input.chkstyle').prop('disabled', false);
            }
        });
    });

//file upload
    taskRow.find(".fileinput-button").click(function () {
        var el = $(this);
        var tr = el.closest("[taskid]");
        var taskId = tr.attr("taskid");
        var task = self.master.getTask(taskId);
        self.master.beginTransaction();
        bindDoc(task.files);
        self.master.endTransaction();
    });

    //fileview 
    taskRow.find(".doclist").click(function () {
        var el = $(this);
        var tr = el.closest("[taskid]");
        var taskId = tr.attr("taskid");
        var task = self.master.getTask(taskId);
        self.master.beginTransaction();
        bindDoc(task.files);
        self.master.endTransaction();
    });

function bindDoc(files) {
    $('#filemodal').modal('show');
    selectedFiles=null;
    selectedFiles=files;
    binddata(files);
}



//     //comments
    taskRow.find(".comments").click(function () {
        var el = $(this);
        var tr = el.closest("[taskid]");
        var taskId = tr.attr("taskid");
        var tasker = self.master.getTask(taskId);
        self.master.beginTransaction();
        $('#commentmodal').modal('show');
        $('#commentmodal .content-prodoc').find("#hdnHiddenTaskID").val(taskId);
        bindcomments(tasker.comments);

        $('#commentmodal').find('#btnSaveComments').click(function () {
            var comments = $('#commentmodal').find('#txtComments').val();
            if (comments == "") {
                $('#commentmodal').find('#txtComments').addClass('error');
                return;
            }
            else {
                $('#commentmodal').find('#txtComments').removeClass('error');
            }
            
            var ttas = self.master.getTask($('#commentmodal').find("#hdnHiddenTaskID").val());
            // console.log("ttas",ttas);
            var comment = {};
            //                comment.CommentsID = '';
            //                comment.ProjectsPlanTaskId = '';
            comment.Comments = comments;
            comment.CommentsBy = parentgconfig.userID;
            comment.commentsUser =alasql("SELECT value FROM ? WHERE id = ?",[parentgconfig.projectUser,parentgconfig.userID])[0].value;
            comment.CommentOn = new Date();
            comment.isInserted =false;
            ttas.comments.splice(0, 0, comment);
            // ttas.comments.push(comment);

            $('#commentmodal').find('#txtComments').val('');
            bindcomments(ttas.comments);
            // $('#commentmodal').find('#btnSaveComments').unbind('click',function(e){});
        });

        // $('.popup').empty();
        // $('.popup').load("../Tab_Page/dialogCommentsview.htm", function () {
        //     bindcomments(task.comments);
        //     $('.popup').find('#btnSaveComments').click(function () {
        //         var comments = $('.popup').find('#txtComments').val();
        //         if (comments == "") {
        //             $('.popup').find('#txtComments').addClass('error');
        //             return;
        //         }
        //         else {
        //             $('.popup').find('#txtComments').removeClass('error');
        //         }
        //         var ttas = task;
        //         var comment = {};
        //         //                comment.CommentsID = '';
        //         //                comment.ProjectsPlanTaskId = '';
        //         comment.Comments = comments
        //         comment.CommentsBy = getCookie('Name');
        //         comment.CommentOn = 'Now';
        //         ttas.comments.push(comment);
        //         $('.popup').find('#txtComments').val('');
        //         bindcomments(ttas.comments);
        //     });
        //     $('.popup').find('.ddclose').click(function () {
        //         $('.popup').fadeOut('slow');
        //         $('.mask').fadeOut('slow');
        //     });
        // });
        // $('.popup').fadeIn('slow');
        // $('.mask').fadeIn('slow');

        self.master.endTransaction();
    });


    function bindcomments(tas) {
        var data = '';
        var ind = 0;
        $('.content-prodoc #tbcomments td').remove();
        $(tas).each(function () {
            var comments = $(this).attr('Comments');
            var Commentedby = $(this).attr('CommentsBy');
            var Commentedon = $(this).attr('CommentOn');
            var Commenteduser = $(this).attr('commentsUser');
            //var Commentedby = ''; var Commentedon = '';
            ind += 1;
            var datta = '';
            datta += '<tr>';
            // datta += '<td>' + ind + '</td>';
            datta += '<td style="word-wrap: break-word;max-width: 500px;">' + comments + '</td>';
            // datta += '<td>' + Commentedby + '</td>';
            datta += '<td>' + Commenteduser + '</td>';
            datta += '<td>' + moment(Commentedon).format('DD-MMM-YYYY HH:mm:ss') + '</td>';
            datta += '</tr>';
            data = data + datta ;
        });
        $('#commentmodal').find('.content-prodoc #tbcomments').append((data == '' ? '<td align="center" colspan="4">No comments available</td>' : data));
        // $('.content-prodoc .scroll').niceScroll();
        $('.modalpopslim').slimScroll();        
    }


  //bind row selection
  taskRow.click(function () {
    var row = $(this);
    //var isSel = row.hasClass("rowSelected");
    row.closest("table").find(".rowSelected").removeClass("rowSelected");
    row.addClass("rowSelected");

    //set current task
    self.master.currentTask = self.master.getTask(row.attr("taskId"));   
    //move highlighter
    self.master.gantt.synchHighlight();

    //if offscreen scroll to element
    var top = row.position().top;
    if (top > self.element.parent().height()) {
      row.offsetParent().scrollTop(top - self.element.parent().height() + 100);
    } else if (top<40){
      row.offsetParent().scrollTop(row.offsetParent().scrollTop()-40+top);
    }
  });

};


GridEditor.prototype.openFullEditor = function (task, taskRow) {

  var self = this;

  //task editor in popup
  var taskId = taskRow.attr("taskId");
  //console.debug(task);

  //make task editor
  var taskEditor = $.JST.createFromTemplate({}, "TASK_EDITOR");

  taskEditor.find("#name").val(task.name);
  taskEditor.find("#description").val(task.description);
  taskEditor.find("#code").val(task.code);
  taskEditor.find("#progress").val(task.progress ? parseFloat(task.progress) : 0);
  taskEditor.find("#status").attr("status", task.status);

  if (task.startIsMilestone)
    taskEditor.find("#startIsMilestone").attr("checked", true);
  if (task.endIsMilestone)
    taskEditor.find("#endIsMilestone").attr("checked", true);

  taskEditor.find("#duration").val(task.duration);
  var startDate = taskEditor.find("#start");
  startDate.val(new Date(task.start).format());
  //start is readonly in case of deps
  if (task.depends) {
    startDate.attr("readonly", "true");
  } else {
    startDate.removeAttr("readonly");
  }

  taskEditor.find("#end").val(new Date(task.end).format());

  //taskEditor.find("[name=depends]").val(task.depends);

  //make assignments table
  var assigsTable = taskEditor.find("#assigsTable");
  assigsTable.find("[assigId]").remove();
  // loop on already assigned resources
  for (var i = 0; i < task.assigs.length; i++) {
    var assig = task.assigs[i];
    var assigRow = $.JST.createFromTemplate({task:task, assig:assig}, "ASSIGNMENT_ROW");
    assigsTable.append(assigRow);
  }

  //define start end callbacks
  function startChangeCallback(date) {
    var dur = parseInt(taskEditor.find("#duration").val());
    date.clearTime();
    taskEditor.find("#end").val(new Date(computeEndByDuration(date.getTime(), dur)).format());
  }

  function endChangeCallback(end) {
    var start = Date.parseString(taskEditor.find("#start").val());
    end.setHours(23, 59, 59, 999);

    if (end.getTime() < start.getTime()) {
      var dur = parseInt(taskEditor.find("#duration").val());
      start = incrementDateByWorkingDays(end.getTime(), -dur);
      taskEditor.find("#start").val(new Date(computeStart(start)).format());
    } else {
      taskEditor.find("#duration").val(recomputeDuration(start.getTime(), end.getTime()));
    }
  }


  if (!self.master.canWrite || !task.canWrite) {
    taskEditor.find("input,textarea").attr("readOnly", true);
    taskEditor.find("input:checkbox,select").attr("disabled", true);
    taskEditor.find("#saveButton").remove();

  } else {

    //bind dateField on dates
    taskEditor.find("#start").click(function () {
      $(this).dateField({
        inputField:$(this),
        callback:  startChangeCallback
      });
    }).blur(function () {
        var inp = $(this);
        if (!Date.isValid(inp.val())) {
          alert(GanttMaster.messages["INVALID_DATE_FORMAT"]);
          inp.val(inp.getOldValue());
        } else {
          startChangeCallback(Date.parseString(inp.val()))
        }
      });

    //bind dateField on dates
    taskEditor.find("#end").click(function () {
      $(this).dateField({
        inputField:$(this),
        callback:  endChangeCallback
      });
    }).blur(function () {
        var inp = $(this);
        if (!Date.isValid(inp.val())) {
          alert(GanttMaster.messages["INVALID_DATE_FORMAT"]);
          inp.val(inp.getOldValue());
        } else {
          endChangeCallback(Date.parseString(inp.val()))
        }
      });

    //bind blur on duration
    taskEditor.find("#duration").change(function () {
      var start = Date.parseString(taskEditor.find("#start").val());
      var el = $(this);
      var dur = parseInt(el.val());
      dur = dur <= 0 ? 1 : dur;
      el.val(dur);
      taskEditor.find("#end").val(new Date(computeEndByDuration(start.getTime(), dur)).format());
    });


    //bind add assignment
    taskEditor.find("#addAssig").click(function () {
      var assigsTable = taskEditor.find("#assigsTable");
      var assigRow = $.JST.createFromTemplate({task:task, assig:{id:"tmp_" + new Date().getTime()}}, "ASSIGNMENT_ROW");
      assigsTable.append(assigRow);
      $("#bwinPopupd").scrollTop(10000);
    });

    // taskEditor.find("#status").click(function () {
    //   var tskStatusChooser = $(this);
    //   var changer = $.JST.createFromTemplate({}, "CHANGE_STATUS");
    //   changer.find("[status=" + task.status + "]").addClass("selected");
    //   changer.find(".taskStatus").click(function (e) {
    //     e.stopPropagation();
    //     tskStatusChooser.attr("status", $(this).attr("status"));
    //     changer.remove();
    //   });
    //   tskStatusChooser.oneTime(3000, "hideChanger", function () {
    //     changer.remove();
    //   });
    //   tskStatusChooser.after(changer);
    // });


var htmldat = "<select class='.status'>";
        $.each(parent.gconfig.projectTaskStatus, function (idx, rec) {
            htmldat += "<option value='" + rec.id + "'>" + rec.value + "</option>";
        });
        htmldat += "</select>";
        taskEditor.find("#status").html(htmldat);
        taskEditor.find("#status .status").find('option[value="' + task.status + '"]').attr('selected', true);
        taskEditor.find("#status .status").change(function () {
            var el = $(this);
            var tr = el.closest("[taskid]");
            var taskId = tr.attr("taskid");
            var task = self.master.getTask(taskId);
            var newStatus = $(this).val();
            self.master.beginTransaction();
            task.changeStatus(newStatus);
            self.master.endTransaction();

            var par = task.getChildren();
            $.each(par, function (idx, tas) {
                $('.gdfTable tbody tr[taskid=' + tas.id + ']').find('select[name=status]').find('option[value="' + newStatus + '"]').attr('selected', true);
                self.master.beginTransaction();
                tas.changeStatus(newStatus);
                self.master.endTransaction();
            });
        });


    //save task
    taskEditor.find("#saveButton").click(function () {
      var task = self.master.getTask(taskId); // get task again because in case of rollback old task is lost

      self.master.beginTransaction();
      task.name = taskEditor.find("#name").val();
      task.description = taskEditor.find("#description").val();
      task.code = taskEditor.find("#code").val();
      task.progress = parseFloat(taskEditor.find("#progress").val());
      task.duration = parseInt(taskEditor.find("#duration").val());
      task.startIsMilestone = taskEditor.find("#startIsMilestone").is(":checked");
      task.endIsMilestone = taskEditor.find("#endIsMilestone").is(":checked");

      //set assignments
      taskEditor.find("tr[assigId]").each(function () {
        var trAss = $(this);
        var assId = trAss.attr("assigId");
        var resId = trAss.find("[name=resourceId]").val();
        var roleId = trAss.find("[name=roleId]").val();
        var effort = millisFromString(trAss.find("[name=effort]").val());


        //check if an existing assig has been deleted and re-created with the same values
        var found = false;
        for (var i = 0; i < task.assigs.length; i++) {
          var ass = task.assigs[i];

          if (assId == ass.id) {
            ass.effort = effort;
            ass.roleId = roleId;
            ass.resourceId = resId;
            ass.touched = true;
            found = true;
            break;

          } else if (roleId == ass.roleId && resId == ass.resourceId) {
            ass.effort = effort;
            ass.touched = true;
            found = true;
            break;

          }
        }

        if (!found) { //insert
          var ass = task.createAssignment("tmp_" + new Date().getTime(), resId, roleId, effort);
          ass.touched = true;
        }

      });

      //remove untouched assigs
      task.assigs = task.assigs.filter(function (ass) {
        var ret = ass.touched;
        delete ass.touched;
        return ret;
      });

      //change dates
      task.setPeriod(Date.parseString(taskEditor.find("#start").val()).getTime(), Date.parseString(taskEditor.find("#end").val()).getTime() + (3600000 * 24));

      //change status
      task.changeStatus(taskEditor.find("#status").attr("status"));

      if (self.master.endTransaction()) {
        $("#__blackpopup__").trigger("close");
      }

    });
  }

  var ndo = createBlackPage(800, 500).append(taskEditor);

};


function binddata(files) {
        var data = '';
        var ind = 0;
        $('.content-prodoc #tbdoclist td').remove();        
        var GetBaseURL=golobalconfigs.downloadURL;
        if (files !== undefined) {
          $.each(files, function (idx, rec) {
              var ext = rec.filename.split('.')[1];                                     
              var typecls;

              switch (ext.toUpperCase()) {
                  case 'PNG': case 'JPEG': case 'JPG': case 'GIF':
                      typecls = 'fa fa-file-image-o';
                      break;
                  case 'PDF':
                      typecls = 'fa fa-file-pdf-o';
                      break;
                   case 'TXT':
                      typecls = 'fa fa-file-text';
                      break;
                  case 'DOC':
                      typecls = 'fa fa-file-word-o';
                      break;
                  case 'XLS': case 'XLSX':
                      typecls = 'fa fa-file-excel-o';
                      break;
              }
              ind += 1;
              var datta = '';
              var uploadedon=moment(rec.uploadedon).format('DD-MMM-YYYY HH:mm:ss');
              datta += '<tr>';
              datta += '<td>' + ind + '</td>';              
              datta += '<td><i class="'+typecls+'"></i>&nbsp;' + rec.filename + '</td>';              
              datta += '<td>' + rec.uploadedbyName + '</td>';
              datta += '<td>' + uploadedon + '</td>';
             
              if (rec.isuploaded == false) {
                  // datta += '<td><img class="remove" title="Remove" index="' + (ind - 1) + '" src="assets/img/removedoc.png" /></td>';
                  datta += '<td><i class="remove fa fa-times-circle-o font-cloud" title="Remove" index="' + (ind - 1) + '"></i></td>';
              }
              else {
                  datta += '<td><a target="_self" href="' + GetBaseURL + rec.filepath + rec.filename + '" title="Download" download="'+ rec.filename + '"><i class="fa fa-cloud-download font-cloud"></i></a> </td>';
              }
              datta += '</tr>';
              data = data + datta ;
          });
        }
        if (data == '') data += '<tr><td colspan="5">Documents not available</td>';

        $('#filemodal').find('.content-prodoc #tbdoclist').append(data);

        $('#filemodal').find('.content-prodoc .download').click(function () {
            //alert($(this).attr('path'));
            var sUrl = $(this).attr('path');
            downloadFile(sUrl);
            return false;
        });

        $('#filemodal').find('.content-prodoc .remove').click(function () {
            files.splice($(this).attr('index'), 1);
            binddata(files);
            return false;
        });
        $('.modalpopslim').slimScroll();


        //        $('.content-prodoc .scroll').slimscroll({
        //            size: '5px',
        //            color: '#5c9ccc',
        //            opacity: 1
        //        });
        // $('.content-prodoc .scroll').niceScroll();
    }