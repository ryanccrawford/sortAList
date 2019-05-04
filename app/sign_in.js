//Login to Account
var user;
$(document).ready(function () {

    var errors = [];
    var user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')): false;
    var remember = localStorage.getItem("rememberme") ? localStorage.getItem("rememberme") : false;
    if (user) {
        $("#username").val(user.email)
        $("#password").val(user.password)
        localStorage.clear();
    } else if (remember) {
         var em = localStorage.getItem("email")
        $("#username").val(em);
        
    }

    
    //Grab user input from text fields
    $("#loginBtn").on("click", function (event) {
       
        event.preventDefault();
        $("#errors").hide();
        $('#loginBtn').prop('disabled', true);
        
        if ($("#username").val() != '') {
            var userEmail = $("#username").val().trim();
        } else {
            errors.push("Email can't be empty.")
        }
        if ($("#password").val() != '') {
            var userPassword = $("#password").val().trim();
        } else {
            errors.push("Password can't be empty.")
        }
         if ($('#indeterminate-checkbox').prop('checked') == true) {
             localStorage.setItem("email", userEmail);
             localStorage.setItem("rememberme", 1);
         } else {
             localStorage.setItem("rememberme", 0);
         }
        if (errors.length === 0) {
            data_LogInUser(userEmail, userPassword);
        } else {
            //TODO: DISPLAY ERRORS
            $('#errors').empty();
            errors.forEach(function (error) {
                var p = $('<p>');
                p.text(error);
                $('#errors').append(p);
            })
            $('#errors').show();
            $('#loginBtn').prop('disabled', false);
        }
       
    })

    $(document).on('isLoggedIn', function (response) {

        var auth = response.message
        if (auth.auth_passed.userid) {
            localStorage.setItem('useremail', $("#username").val())
            localStorage.setItem('userid', auth.auth_passed.userid)
            window.location.href = "userInterface.html"
        } else {
            $('#loginBtn').prop('disabled', false)
        }
    })



})