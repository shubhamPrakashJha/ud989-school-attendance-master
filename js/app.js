/**
 * Created by sjonl on 25-07-2018.
 */
/* STUDENTS IGNORE THIS FUNCTION
 * All this does is create an initial
 * attendance record if one is not found
 * within localStorage.
 */
(function() {
    if (!localStorage.attendance) {
        console.log('Creating attendance records...');
        function getRandom() {
            return (Math.random() >= 0.5);
        }

        var nameColumns = $('tbody .name-col'),
            attendance = {};

        nameColumns.each(function() {
            var name = this.innerText;
            attendance[name] = [];

            for (var i = 0; i <= 11; i++) {
                attendance[name].push(getRandom());
            }
        });

        localStorage.attendance = JSON.stringify(attendance);
    }
}());


/* STUDENT APPLICATION */
$(function() {

    var model = {

        init: function () {
            this.attendance = JSON.parse(localStorage.attendance);
            this.names = Object.keys(this.attendance);
            // console.log(this.attendance);
            // console.log(this.names);
            // console.log(this.attendance[this.names[0]])
        },
        studentNames: function () {
            return this.names
        }

    };

    var controller = {
        init: function () {
            model.init();
            view.init();
        },
        getAllStudents: function () {
            return  model.studentNames();
        },
        getAttendance: function () {
            return model.attendance;
        },
        updateCheckbox: function () {
            var attendance = this.getAttendance();
            $.each(attendance, function(name, days) { // function(index, element){
                console.log(name, days);
                var studentRow = $('tbody .name-col:contains("' + name + '")').parent('tr'),
                    dayChecks = $(studentRow).children('.attend-col').children('input');
                dayMissed = $(studentRow).children('.missed-col');

                dayChecks.each(function(i) {
                    $(this).prop('checked', days[i]);//days[i] = [true,false,...][i]
                });

            });
        },
        countMissing: function () {
            var $allMissed = $('tbody .missed-col');

            $allMissed.each(function() {
                var studentRow = $(this).parent('tr'),
                    dayChecks = $(studentRow).children('td').children('input'),
                    numMissed = 0;

                dayChecks.each(function() {
                    if (!$(this).prop('checked')) {
                        numMissed++;
                    }
                });

                $(this).text(numMissed);
            });
        },
        updateLocalStorage: function () {
            // When a checkbox is clicked, update localStorage
            var $allCheckboxes = $('tbody input');
            $allCheckboxes.on('click', function() {
                // alert("hello");
                var studentRows = $('tbody .student'),
                    newAttendance = {};

                studentRows.each(function() {
                    var name = $(this).children('.name-col').text(),
                        $allCheckboxes = $(this).children('td').children('input');

                    newAttendance[name] = [];

                    $allCheckboxes.each(function() {
                        newAttendance[name].push($(this).prop('checked'));
                    });
                });

                controller.countMissing();
                localStorage.attendance = JSON.stringify(newAttendance);
            });

        }

    };

    var view = {
        init: function () {
            this.students = controller.getAllStudents();
            this.studentsTemplate = $('script[data-template="student"]').html();
            this.tbody = $("tbody");
            view.render();
        },
        render: function () {
            var students = this.students,
                studentsTemplate = this.studentsTemplate,
                tbody = this.tbody;
            students.forEach(function (names) {
                // console.log(names);
                var newTemplate = studentsTemplate.replace(/{{name}}/g,names);
                tbody.append(newTemplate);
            });
            for(var i=1; i<=12;i++){
                $("thead .name-col").after("<th>"+(13-i)+"</th>");
                $("tbody .name-col").after('<td class="attend-col"><input type="checkbox"></td>');

            }
            // Check boxes, based on attendace records
            controller.updateCheckbox();
            controller.countMissing();
            controller.updateLocalStorage();
        }
    };

    controller.init();
}());
