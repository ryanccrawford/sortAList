//Login to Account
$(document).ready(function () {

    var useremail = localStorage.getItem('email')
    var userid = localStorage.getItem('userid')
    if (useremail && userid) {
        //TODO: AUTO LOGIN
        //if there is local storage value for 'email and 'password', load those values into form

    }
    //Grab user input from text fields
    $("#loginBtn").on("click", function (event) {
        event.preventDefault();
        $('#loginBtn').prop('disabled', true)
        if ($("#username").val() != '') {
            var userEmail = $("#username").val().trim();
        }
        if ($("#password").val() != '') {
            var userPassword = $("#password").val().trim();
        }

        data_LogInUser(userEmail, userPassword);

        if ($('#indeterminate-checkbox') = true) {
            localStorage.setItem("email", userEmail);
            localStorage.setItem("password", userPassword);
        }
    })

    $(document).on('isLoggedIn', function (response) {

        var userinfo = response.message
        if (userinfo.userid) {
            window.location.href = "userInterface.html"
        } else {
            $('#loginBtn').prop('disabled', false)
        }
    })



})

// //Login to Account
// $(document).ready(function () {

//     //Grab user input from text fields
//     $("#login-btn").on("click", function (event) {
//         event.preventDefault();

//         if ($("#emailLogin").val() != '') {
//             var userEmail = $("#emailLogin").val().trim();
//         }
//         if ($("#passwordLogin").val() != '') {
//             var userPassword = $("#passwordLogin").val().trim();
//         }

//         data_LogInUser(userEmail, userPassword);

//         window.location.href = "http://userpage.com";

//     })
// })