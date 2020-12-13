const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");



const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");
const html = require("./lib/htmlRenderer");
//array to put in all user inputted employee objects
const employees = []
//first 4 questions to manager using inquirer to get manager info
const initialPrompts=[
{
    type:'input',
    name:'managerName',
    message: "Welcome Manager to Team Builder. First off, whats your name?",
    validate: function validateName(name){
        var reg = /^[a-zA-Z ]+$/;
        return reg.test(name) || "Please enter a valid name"
    }
},
{
    type: 'input',
   message: "What's your work Id?",
   name: 'id',
   validate: function validateID(ID){
   var reg = /^\d+$/;
   return reg.test(ID) || "Please enter a valid number";
}
},
{
    type: 'input',
   message: "What's your email?",
   name: 'email',
   validate: function (email) {
    var reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return reg.test(email) || "Please enter a valid email";
}
},
{
    type: 'input',
    name: 'officeNumber',
    message: 'What is your Office Number?',
    validate: function validateNum(num){
        var reg = /^\d+$/;
        return reg.test(num) || "Please enter a valid number";
     }
}]
//prompts for additional team members.
const employeePrompts = [
    {
    type: 'input',
    message: "What's your employee's name?",
    name: 'name',
    validate: function validateName(name){
        var reg = /^[a-zA-Z]+$/;
        return reg.test(name) || "Please enter a valid name"
    }
    },
    {
    type: 'input',
    message: "What's is their work Id?",
    name: 'id',
    validate: function validateID(ID){
        var reg = /^\d+$/;
        return reg.test(ID) || "Please enter a valid number";
     }

    },
    {
    type: 'input',
    message: "What's your employee's email?",
    name: 'email',
    validate: function (email) {
        var reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        return reg.test(email) || "Please enter a valid email";
    }},
    {
    type: 'list',
    name: 'jobtitle',
    message: 'What is their job title?',
    choices: ['Engineer', 'Intern']
}]

//job type specific questions based on job title listed
const engineerPrompt = {
    type: 'input',
    name: 'github',
    message: "what is your engineer's github username?",
    validate: function validateName(name){
        var reg = /^[a-zA-Z0-9]+$/;
        return reg.test(name) || "Please enter a valid username"
    }

};

const internPrompt = {
    type: 'input',
    name: 'school',
    message: 'What school does your intern go to?',
    validate: function validateName(name){
        var reg = /^[a-zA-Z ]+$/;
        return reg.test(name) || "Please enter a valid School name"
    }
};

function managerQuestion(){
    inquirer.prompt(initialPrompts).then(function(answers){
        let employee = new Manager(answers.managerName, answers.id, answers.email, answers.officeNumber)
            employees.push(employee)
            console.log(employees)
            moreEmployees(employees);
    })
}
//function to ask questions and create emplyee objects, then pushed into employees array
function employeeQuestions(){
inquirer.prompt(employeePrompts).then(function(answers) {
    if (answers.jobtitle === 'Engineer'){
        inquirer.prompt(engineerPrompt).then((answers2)=>{
           let employee = new Engineer(answers.name, answers.id, answers.email, answers2.github)
            employees.push(employee)
            console.log(employees)
            moreEmployees(employees);
        })
        
    } else if(answers.jobtitle === 'Intern'){
       inquirer.prompt(internPrompt).then((answers2)=>{
           let employee = new Intern(answers.name, answers.id, answers.email, answers2.school)
           employees.push(employee)
           console.log(employees)
        moreEmployees(employees);
    })
    }
   
})
}

//function to rerun questions until done inputting all employees
function moreEmployees(employees){
    inquirer.prompt({
        type: 'confirm',
        name: 'continue',
        message: 'Do you you have more Employees to enter?'
    }).then((answers) =>{
        if(answers.continue){
            employeeQuestions(); 
         }else{
          fs.writeFile(outputPath, render(employees), (err) => err ? console.log("sorry there was an error!") : console.log("Yay, Your team.html page is ready in the Output folder. Enjoy!"))
         }
    })
    
}

managerQuestion()


//√ Write code to use inquirer to gather information about the development team members,
//and to create objects for each team member (using the correct classes as blueprints!)

// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// √HINT: each employee type (manager, engineer, or intern) has slightly different
// √information; write your code to ask different questions via inquirer depending on
//√ employee type.

//√ HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work!