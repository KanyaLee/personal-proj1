class Course {
    constructor(courseId, courseName, required, credit) {
        this.courseId = courseId;
        this.courseName = courseName;
        if (required){
            this.courseType = 'Compulsory';
        }
        else{
            this.courseType = 'Elective';
        }

        this.credit = credit;
        this.selected = false;
    }
}

class CourseModel {
    constructor(){
        this.courses = [];

        //counter 
        this.counter = 0;
    }

    inclement() {
        this.counter++;
    }

    async getCourses() {
        const response = await fetch('http://localhost:3000/courseList');
        const data = await response.json();
        this.courses = data.map(course => new Course(course.courseId, course.courseName, course.required, course.credit));
        return this.courses;
      }

    
}

class CourseView {
    constructor() {
      //this.courseList = document.getElementById('course-list');
    }
  
    renderCourses(courses) {

        const counter = document.getElementById('counter-count')
        console.log(counter)
        let counterVal = parseInt(counter.innerHTML)
        console.log(counterVal)
        // Render Courses
        const courseList = document.getElementById('course-list');
      courses.forEach(course => {

        const courseItem = document.createElement('div');
        if (course.id % 2 ){
            courseItem.classList.add('course-item-odd');
        } else{
            courseItem.classList.add('course-item-even');
        }
        //courseItem.classList.add('course-item');
        courseItem.innerText = `${course.courseName}\nCourse Type: ${course.courseType}\nCourse Credit: ${course.credit}`;
        courseItem.addEventListener('click', () => {
            console.log('click')
            console.log(course.selected)
            console.log(course.credit)
            course.selected = !course.selected; // select property
            if (course.selected){
                counterVal += parseInt(course.credit)
                if (counterVal > 18){
                    alert('You have exceeded the credit limit')
                    counterVal -= parseInt(course.credit)
                    course.selected = !course.selected;
                }
            }
            else {
                counterVal -= parseInt(course.credit)
            }

            // if counterVal ... is greater than 18, it will show alert 

            counter.innerHTML = counterVal
            // change colour when selected
            if (course.selected) {
                courseItem.style.backgroundColor = ' rgb(25, 170, 196)';
            } else {
                if (course.courseId % 2 == 0){
                    courseItem.style.backgroundColor = 'rgb(221, 239, 221)';
                }
                else{
                    courseItem.style.backgroundColor = 'white';
                }
               
            }

            //this.renderCourses(courses); // re-render the courses to update courses
          });
        courseList.appendChild(courseItem);
      });
    }

    renderSelectedCourses(courses){
        // Render Selected Courses
      const courseList2 = document.getElementById('selected-course-list');
      courseList2.innerHTML = "";
      courses.forEach(course => {
        if (course.selected){
            console.log(course)
            const courseItemSelected = document.createElement('div');
            courseItemSelected.classList.add('course-item-selected');
            courseItemSelected.innerText = `${course.courseName}\nCourse Type: ${course.courseType}\nCourse Credit: ${course.credit}`;
            
            courseList2.appendChild(courseItemSelected);
        }
        
      });
      

    }

    

    
  }

  

class CourseController {
  constructor(model, view) {
    this.model = model;
    this.view = view;
  }

  selectButton() {
    // Get the select button element
    var select = document.getElementById('selected');
    // Add an event listener to the button
    select.addEventListener('click', () => {
      // Call the renderSelectedCourses function with the selected courses
      if (window.confirm("Are you sure ?")) {
        // User clicked OK
        console.log("Item deleted");
        this.view.renderSelectedCourses(this.model.courses);
        select.disabled = true;
      } else {
        // User clicked Cancel
        console.log("Item not deleted");
      }
    
            });
  }
  async showCourses() {
    const courses = await this.model.getCourses();
    this.view.renderCourses(this.model.courses);

  }
}



const courseModel = new CourseModel();
const courseView = new CourseView();
const courseController = new CourseController(courseModel, courseView);
courseController.selectButton(); // add select button functionality

courseController.showCourses();

