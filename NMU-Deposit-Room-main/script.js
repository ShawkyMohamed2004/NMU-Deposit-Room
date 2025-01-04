class Node {
    constructor(student) {
        this.student = student;
        this.next = null;
    }
}

class LinkedList {
    constructor() {
        this.head = null;
        this.size = 0;
    }

    addStudent(student) {
        const node = new Node(student);
        if (!this.head) {
            this.head = node;
        } else {
            let current = this.head;
            while (current.next) {
                current = current.next;
            }
            current.next = node;
        }
        this.size++;
    }

    deleteStudent(index) {
        if (index < 0 || index >= this.size) return;

        if (index === 0) {
            this.head = this.head.next;
        } else {
            let current = this.head;
            let previous = null;
            let count = 0;

            while (count < index) {
                previous = current;
                current = current.next;
                count++;
            }

            previous.next = current.next;
        }
        this.size--;
        displayStudentList();
    }

    filter(filterFunction) {
        const filteredStudents = [];
        let current = this.head;
        while (current) {
            if (filterFunction(current.student)) {
                filteredStudents.push(current.student);
            }
            current = current.next;
        }
        return filteredStudents;
    }
}

var studentList = new LinkedList();

document.getElementById("registrationForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const faculty = document.getElementById("faculty").value;
    const studentId = document.getElementById("studentId").value;
    const phoneNumber = document.getElementById("phoneNumber").value;
    const picture = document.getElementById("picture").files[0];

    if (picture) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const student = {
                name: name,
                faculty: faculty,
                studentId: studentId,
                phoneNumber: phoneNumber,
                image: e.target.result
            };
            studentList.addStudent(student);
            displayStudentList();
            document.getElementById("registrationForm").reset();
        };
        reader.readAsDataURL(picture);
    }
});

function displayStudentList() {
    const tableBody = document.getElementById("studentTableBody");
    let current = studentList.head;
    let index = 1;

    tableBody.innerHTML = "";

    while (current) {
        const row = tableBody.insertRow();
        
        // Serial Number
        const cell1 = row.insertCell(0);
        const cell2 = row.insertCell(1);
        const cell3 = row.insertCell(2);
        const cell4 = row.insertCell(3);
        const cell5 = row.insertCell(4);
        const cell6 = row.insertCell(5);
        const cell7 = row.insertCell(6);
        const cell8 = row.insertCell(7);

        cell1.innerHTML = index;
        cell2.innerHTML = current.student.name;
        cell3.innerHTML = current.student.studentId;
        cell4.innerHTML = current.student.phoneNumber;
        cell5.innerHTML = current.student.faculty;
        cell6.innerHTML = `<img src="${current.student.image}" alt="Student Image" onclick="showFullImage('${current.student.image}')">`;
        cell7.innerHTML = new Date().toLocaleString();
        cell8.innerHTML = `<button class="deleteButton" onclick="deleteStudent(${index - 1})">Delete</button>`;

        current = current.next;
        index++;
    }
}

let studentToDelete = null;

function deleteStudent(index) {
    studentToDelete = index;
    document.getElementById("deleteModal").style.display = "block";
}

function closeDeleteModal() {
    document.getElementById("deleteModal").style.display = "none";
    studentToDelete = null;
}

function confirmDelete() {
    if (studentToDelete !== null) {
        studentList.deleteStudent(studentToDelete);
        closeDeleteModal();
        displayStudentList();
    }
}

function showFullImage(imageUrl) {
    document.getElementById("fullscreenImage").style.display = "block";
    document.getElementById("fullscreenContent").innerHTML = `
        <img src="${imageUrl}" alt="Full size image">
        <span class="close" onclick="closeFullscreen()">&times;</span>
    `;
}

function closeFullscreen() {
    document.getElementById("fullscreenImage").style.display = "none";
}

function showPasswordBox() {
    document.getElementById("passwordBox").style.display = "block";
    document.getElementById("password").value = ""; // Clear password field
    document.getElementById("password").focus(); // Focus on password field
}

function closePasswordBox() {
    document.getElementById("passwordBox").style.display = "none";
    document.getElementById("password").value = ""; // Clear password field
}

function togglePassword() {
    const passwordField = document.getElementById("password");
    const toggleIcon = document.querySelector(".toggle-password");
    
    if (passwordField.type === "password") {
        passwordField.type = "text";
        toggleIcon.classList.remove("fa-eye");
        toggleIcon.classList.add("fa-eye-slash");
    } else {
        passwordField.type = "password";
        toggleIcon.classList.remove("fa-eye-slash");
        toggleIcon.classList.add("fa-eye");
    }
}

// Add enter key support for password field
document.getElementById("password").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        checkPassword();
    }
});

function showStudentList() {
    document.getElementById("studentList").style.display = "block";
    document.getElementById("toggleButton").textContent = "Hide Student List";
    document.getElementById("toggleButton").onclick = closeStudentList;
    displayStudentList();
}

function closeStudentList() {
    document.getElementById("studentList").style.display = "none";
    document.getElementById("toggleButton").textContent = "Show Student List";
    document.getElementById("toggleButton").onclick = showPasswordBox;
}

function checkPassword() {
    const password = document.getElementById("password").value;
    if (password === "00000") {
        closePasswordBox();
        showStudentList();
    } else {
        alert("Incorrect password!");
        document.getElementById("password").value = ""; // Clear password on error
        document.getElementById("password").focus(); // Focus back on password field
    }
}

function filterStudents() {
    const selectedFaculty = document.getElementById("collegeFilter").value;
    const searchTerm = document.getElementById("searchBar").value.toLowerCase();

    let current = studentList.head;
    const tableBody = document.getElementById("studentTableBody");
    let index = 1;

    tableBody.innerHTML = "";

    while (current) {
        const student = current.student;
        if ((selectedFaculty === "all" || student.faculty === selectedFaculty) &&
            (student.name.toLowerCase().includes(searchTerm) || student.studentId.includes(searchTerm))) {
            
            const row = tableBody.insertRow();
            
            const cell1 = row.insertCell(0);
            const cell2 = row.insertCell(1);
            const cell3 = row.insertCell(2);
            const cell4 = row.insertCell(3);
            const cell5 = row.insertCell(4);
            const cell6 = row.insertCell(5);
            const cell7 = row.insertCell(6);
            const cell8 = row.insertCell(7);

            cell1.innerHTML = index;
            cell2.innerHTML = student.name;
            cell3.innerHTML = student.studentId;
            cell4.innerHTML = student.phoneNumber;
            cell5.innerHTML = student.faculty;
            cell6.innerHTML = `<img src="${student.image}" alt="Student Image" onclick="showFullImage('${student.image}')">`;
            cell7.innerHTML = new Date().toLocaleString();
            cell8.innerHTML = `<button class="deleteButton" onclick="deleteStudent(${index - 1})">Delete</button>`;

            index++;
        }
        current = current.next;
    }
}

function searchStudents() {
    filterStudents();
}

// When user clicks outside the delete modal, close it
window.onclick = function(event) {
    const deleteModal = document.getElementById("deleteModal");
    const passwordModal = document.getElementById("passwordBox");
    if (event.target === deleteModal) {
        closeDeleteModal();
    } else if (event.target === passwordModal) {
        closePasswordBox();
    }
}
