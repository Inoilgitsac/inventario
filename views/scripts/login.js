$(document).ready(function () {
    var user, password;
    $("#submit").click(function () {
      user = $("#user").val();
      password = $("#password").val();
      /*
      * Perform some validation here.
      */
      $.post("http://localhost:3000", { user: user, password: password }, function (data) {
        if (data === 'done') {
          window.location.href = "/home";
        }
      });
    });
  });
