// Smooth page switch with animation
function showParentPage(page, el) {
    document.querySelectorAll('.page').forEach(p => {
        p.style.opacity = 0;
        setTimeout(() => p.classList.remove('active'), 200);
    });

    setTimeout(() => {
        const activePage = document.getElementById('parent-' + page);
        activePage.classList.add('active');
        activePage.style.opacity = 1;
    }, 200);

    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    el.classList.add('active');
}


// CHILD SWITCH (with animation feedback)
function switchChild() {
    const select = document.getElementById('childSelector');
    select.style.transform = "scale(1.05)";

    setTimeout(() => select.style.transform = "scale(1)", 200);

    const val = select.value;
    const data = childrenData[val];

    animateValue('.stat-card:nth-child(1) h3', data.cgpa);
    animateValue('.stat-card:nth-child(2) h3', data.attendance, "%");
    animateValue('.stat-card:nth-child(3) h3', data.fee, "₹");

    generateChart(data);
}


// NUMBER ANIMATION (premium feel)
function animateValue(selector, value, suffix = "") {
    const el = document.querySelector(selector);
    let start = 0;
    const duration = 500;

    const step = value / (duration / 16);

    const counter = setInterval(() => {
        start += step;
        if (start >= value) {
            el.innerText = (suffix === "₹" ? "₹" + value : value + suffix);
            clearInterval(counter);
        } else {
            el.innerText = (suffix === "₹" ? "₹" + Math.floor(start) : Math.floor(start) + suffix);
        }
    }, 16);
}


// FLOATING HOVER EFFECT
document.addEventListener("mousemove", (e) => {
    document.querySelectorAll(".stat-card").forEach(card => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        card.style.transform = `
      perspective(1000px)
      rotateX(${-(y - rect.height / 2) / 20}deg)
      rotateY(${(x - rect.width / 2) / 20}deg)
    `;
    });
});


// CHAT SEND (better UI)
function sendMessage() {
    const input = document.querySelector('.chat-window input');
    const msgBox = document.querySelector('.chat-messages');

    if (!input.value.trim()) return;

    const msg = document.createElement('div');
    msg.innerHTML = `<div style="margin:5px 0"><b>You:</b> ${input.value}</div>`;

    msgBox.appendChild(msg);
    msgBox.scrollTop = msgBox.scrollHeight;

    input.value = "";
}