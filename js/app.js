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
        }
    };

    controller.init();
}());
