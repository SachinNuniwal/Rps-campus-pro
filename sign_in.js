let currentRole = "student";

const tabs = document.querySelectorAll(".tab");
const roleText = document.getElementById("roleText");
const email = document.getElementById("email");

// Tab Click
tabs.forEach(tab => {
    tab.addEventListener("click", () => {

        // remove active
        tabs.forEach(t => t.classList.remove("active"));

        // add active
        tab.classList.add("active");

        // set role
        currentRole = tab.dataset.role;

        // update UI
        roleText.innerText = "Login as " + currentRole.charAt(0).toUpperCase() + currentRole.slice(1);

        // change placeholder
        email.placeholder = currentRole + "@rps.edu";
    });
});

// Form Submit
document.getElementById("loginForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const userEmail = email.value;
    const password = document.getElementById("password").value;

    alert(`Logged in as ${currentRole}\nEmail: ${userEmail}`);
});
