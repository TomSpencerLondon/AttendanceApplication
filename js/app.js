//Model = data structure and methods to retreive data
//Octopus = provide all the methods used by model and view 
//view = broken into 
// - tableview to build html <table> and one <tr> per student record
// - roomview build <td> check boxes based on attendance of specific student
// - countview update number of <td> days missed of each student

$(function(){
    //Model 
    var model = {
        studentName: ["Rugby Captain", "Teenage Horror", "Goody Two Shows", "Dapper Rapper", "Giles Prodigy" ], 
        init: function(){
            //initialize the students array from studentName array 
            var students = [];
            this.studentName.forEach(function(e, i){
                students.push({
                    name: e, 
                    attendance: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], 
                    missed: 0
                }); 
            }); 
            this.students = students; 
        }, 

        getStudents: function(){
            //Populate the students array from local storage
            this.students = JSON.parse(localStorage.students);
        }, 

        putStudents: function(){
            //save students array to local storage
            localStorage.students = JSON.stringify(this.students); 
        }
    }; 

    //OCTOPUS

    var octopus = {
        //student records not in local storage 
        //Generated randomly the Attendance days for each student 
        //Save students to localStorage
        // Otherwise read students from localStorage 
        // initialize HTML <tab>
        // initialize rows based on students' records value
        init: function(){
            if (!localStorage.students){
                model.init();
                model.students.forEach(function(e){
                    for(var j = 0; j <= 11; j++){
                        e.attendance[j] = octopus.getRandom();
                    }
                }); 
                model.putStudents();
            }else{
                model.getStudents();
            }
            tableview.init();
            rowview.init();
        }, 
        getRandom: function(){
            //return true if < 0.5
            return (Math.random() >= 0.5); 
        }, 
        getStudent: function(){
            //get all the students' records
            return model.students; 
        }, 
        saveStudent: function(){
            //save all students records to local storage
            model.putStudents(); 
        }, 
        countAttend: function(student){
            //count missed days
            //update missed counter
            var count = 0; 
            for (var i = 0; i <= 11; i++){
                count += student.attendance[i];
            };
            student.missed = count; 
            return count;
        } 
    };

    //Table view 

    var tableview = {
        //initialize the HTML students table 
        init: function(){
            this.$thead = $('thead');
            this.$tbody = $('tbody');
            this.students = octopus.getStudent();
            this.render(); 
        }, 
        render: function(){
            var $thead = this.$thead; 
            var html = '<tr><th class="name-col">Student Name</th>'; 
            for(var j = 0; j <= 11; j++){
                html = html + '<th>' + (j + 1) + '</th>'; 
            };
            $thead.html(html);
            var html2 = ""; 
            var students = this.students; 
            var $tbody = this.$tbody; 
            students.forEach(function(){
                html2 = html2 + '<tr class="student"></tr>'; 
            }); 
            $tbody.html(html2);
        }
    }; 

    //Row view 

    var rowview = {
        // initialize students' attendance days based on student records
        // initialize checkbox click funtion; 
        init: function(){
            var $students = $('.student'); 
            this.$students = octopus.getStudent(); 
            this.students = octopus.getStudent();
            $students.each(function(i, e){
                rowview.render(i, e);
                $(this).on("click", '.attend-col', function(e){
                    // i is row number
                    var students = rowview.students; 
                    var input = $(this).find('input'); 
                    students[i].attendance[this.id] = $(input).prop("checked");
                    //pass student element and index to the render function
                    var $student = $(this).parent('.student'); 
                    countview.render(students[i], $student); 
                    octopus.saveStudent(); 
                });
            });
        },
        render: function(i, e){
            //display student days 
            //i is teh index, e is the student <tr> element
            var studenti = this.students[i]; 
            var html2 = '<td class="name-col">' + studenti.name + '</td>'; 
            var missed = 0; 
            for(var j= 0; j <= 11; j++){
                var att = studenti.attendance[j];
                checked = ""; 
                if(att){
                    checked = 'checked ="checked"';
                }
                html2 = html2 + '<td id=' + j + ' class= "attend-col"><input type="checkbox"' + checked + '></td>'; 
                missed = missed + att; 
            }; 
            html2 += '<td class="missed-col">' + missed + '</td>'; 
            $(e).html(html2); 
            studenti.missed = missed; 
        }
    };
    //missed counter view 
    var countview = {
        init: function(){
            //nothing to do
        }, 
        render: function(student, $student){
            // is called every time the user clicks the checkbox
            var count = octopus.countAttend(student); 
            var $missedcol = $($student).find('.missed-col');
            $missedcol.html(count);
        }
    };
    octopus.init();

});

