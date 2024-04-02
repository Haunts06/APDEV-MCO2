$(document).ready(function() {
    $('.message a').click(function() {
    $('form').animate({height: "toggle", opacity: "toggle"}, "slow");
    });

    $('#reg-account-switch').click(function() {
        $('.registration-form').show();
        $('.login-form').hide();
    });

    $('#sign-in-switch').on('click', (function() {
        $('.login-form').show();
        $('.registration-form').hide();
    }));
});