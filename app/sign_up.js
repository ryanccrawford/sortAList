//Create user account (Sign Up)
var user = {
    email: "",
    password: "",
    zip: ""
}
var errors = [];
$(document).ready(function () { 
    $('.modal').modal();
    
    $(document).on("addedUser", function (data) {
        var answer = data.message
        if (answer.user_added) {
            user.id = answer.user_added
            localStorage.setItem("user", JSON.stringify(user))
    
            $('.modal').modal('open');
        } else if (answer.error) {
            $("#signupBtn").prop("disabled", false);
            var message = answer.error[0]
            console.log(message)
            var p = $('<p>');
            p.text(message.message);
            $('#errors').empty()
            $('#errors').append(p)
            $('#errors').show();
            $('#loginBtn').prop('disabled', false);
            $("#signupBtn").prop("disabled", false);
            
        }else if (answer[0]){
            
            $('#errors').append(answer[0])
            $('#errors').show();
        }
        $("#signupBtn").prop("disabled", false);
    })
    //Grab user input
    $("#signupBtn").on("click", function (event) {
        event.preventDefault();
        $('#errors').empty();
        $('#errors').hide();
        $("#signupBtn").prop("disabled", true);
        localStorage.clear()
        //Check if email is valid email format, name isn't blank, and zip code is 5 digits
        if (processData()) {
                //Push email to data
            data_AddUser(user.email, user.password, user.zip);
            
        } else {
        
             $("#signupBtn").prop("disabled", false);
        }
       
    })
})


//Validate email
function validateEmail(email) {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}

function processData() {
    var email = $("#email").val().trim(),
        password = $("#password").val().trim(),
        zip = $("#zipCode").val().trim();
        
    if (email == '') {
        errors.push("Email can't be empty.");
    }
    if (!validateEmail(email)) {
        errors.push("Invalid Email");
    }
    if (password == '') {
        errors.push("Password can't be empty.");
    }
    if (zip == '') {
        errors.push("Zip can't be empty.");
    }

    if (errors.length > 0) {
       
        errors.forEach(function (error) {
            var p = $('<p>');
            p.text(error);
            $('#errors').append(p);
        })
        $('#errors').show();
        $('#loginBtn').prop('disabled', false);
        return false;
    } else {
        user.email = $("#email").val().trim();
        user.password = $("#password").val().trim();
        user.zip = $("#zipCode").val().trim();
        return true;
    }
    
}