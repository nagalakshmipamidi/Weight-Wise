document.addEventListener('DOMContentLoaded', function () {
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    menuToggle.addEventListener('change', function () {
        navLinks.classList.toggle('show', this.checked);
    });

    // Close the menu when a link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function () {
            menuToggle.checked = false;
            navLinks.classList.remove('show');
        });
    });
});


document.addEventListener('DOMContentLoaded', function () {
    // Get the profile picture and dropdown elements
    var profilePicture = document.querySelector('.profile-picture');
    var dropdown = document.getElementById('profile-dropdown');

    // Toggle the dropdown when the profile picture is clicked
    profilePicture.addEventListener('click', function () {
        dropdown.style.display = (dropdown.style.display === 'block') ? 'none' : 'block';
    });

    // Close the dropdown if the user clicks outside of it
    document.addEventListener('click', function (event) {
        if (!profilePicture.contains(event.target) && !dropdown.contains(event.target)) {
            dropdown.style.display = 'none';
        }
    });
});
