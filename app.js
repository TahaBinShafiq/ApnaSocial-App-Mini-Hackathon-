const userName = document.getElementById("userName");
const userEmail = document.getElementById("userEmail");
const userGender = document.getElementById("userGender");
const userDateOfBirth = document.getElementById("userDateOfBirth");
const userPass = document.getElementById("userPass");
const loginEmail = document.getElementById("loginEmail");
const loginPass = document.getElementById("loginPass");
let para = document.getElementById("para");
let NewPasswordEyeImg = document.getElementById("new-eye-img");
let loginEyeImg = document.getElementById("eye-img");
let error = document.getElementById("error");

function passwordTypeChnge() {
  if (loginPass && loginEyeImg) {
    if (loginPass.type === "password") {
      loginPass.type = "text";
      loginEyeImg.src = "https://cdn-icons-png.flaticon.com/512/159/159604.png";
    } else {
      loginPass.type = "password";
      loginEyeImg.src = "https://cdn-icons-png.flaticon.com/512/709/709612.png";
    }
  }

  if (userPass && NewPasswordEyeImg) {
    if (userPass.type === "password") {
      userPass.type = "text";
      NewPasswordEyeImg.src =
        "https://cdn-icons-png.flaticon.com/128/10812/10812267.png";
    } else {
      userPass.type = "password";
      NewPasswordEyeImg.src =
        "https://cdn-icons-png.flaticon.com/512/709/709612.png";
    }
  }
}

let users = JSON.parse(localStorage.getItem("users")) || [];

class Person {
  constructor(name, email, pass, gender, dateOfBirth, id) {
    (this.name = name),
      (this.email = email),
      (this.password = pass),
      (this.gender = gender),
      (this.dateOfBirth = dateOfBirth),
      (this.id = id),
    this.createdAt = new Date().toISOString();
  }
}

const signUpUser = (event) => {
  event.preventDefault();

  const form = document.getElementById("signupForm");
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  let savedUser = users.find((e) => e.email === userEmail.value);

  if (savedUser?.email) {
    para.style.display = "block";
    para.innerHTML = "Email already in use. Log in instead.";
    return;
  } else {
    const newId = users.length + 1;
    const newUser = new Person(
      userName.value,
      userEmail.value,
      userPass.value,
      userGender.value,
      userDateOfBirth.value,
      newId
    );
    console.log(userDateOfBirth.value);
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("LoginUser", JSON.stringify(newUser));
    console.log("ye user he jo register howa he", newUser);
    userName.value = "";
    userEmail.value = "";
    userPass.value = "";
    userDateOfBirth.value = "";
    userGender.value = "";
    setTimeout(() => {
      window.location.href = "pages/dashboard/dashboard.html";
    }, 2000);
  }
};

const loginUser = (event) => {
  event.preventDefault();
  const form = document.getElementById("signupForm");
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }
  let savedUser = users.find((e) => e.email === loginEmail.value);

  if (
    savedUser?.email === loginEmail.value &&
    savedUser?.password === loginPass.value
  ) {
    localStorage.setItem("LoginUser", JSON.stringify(savedUser));
    loginEmail.value = "";
    loginPass.value = "";
    window.location.href = "dashboard/dashboard.html";
  } else {
    error.style.display = "block";
    error.innerHTML = "Invalid credientials";
  }
};
