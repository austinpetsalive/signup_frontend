(function($){
    $(function(){

        $('.button-collapse').sideNav();
        $('button').addClass('disabled');
        $('input').change(
            function() {
                if (all_filled())
                    $('button').removeClass('disabled');
                else
                    $('button').addClass('disabled');
            }
        );
        $('#the_form').submit(
            function(event) {
                event.preventDefault();
                $('button').addClass('disabled');
                $('button').html('Please, wait...');
                $.post('https://apaservices.waltermoreira.net/insert',
                       {
                           name: $('#name').val(),
                           email: $('#email').val(),
                           interests: $('div#interests input:checked ~ label').map(clean).get().join(", "),
                           "lives_with": $('div#lives_with input:checked ~ label').map(clean).get().join(", "),
                           lifestyle: $('input[name="lifestyle"]:checked').val(),
                           fostering: $('input[name="fostering"]:checked').val(),
                           _token: "apasaveslives"
                       })
                    .done(function(data) {
                        alert('ok: '+JSON.stringify(data)); })
                    .fail(function(data) {
                        alert("error: "+JSON.stringify(data)); });
            }
        );
    }); // end of document ready
})(jQuery); // end of jQuery name space


function all_filled() {
    var filled = true;
    $('input[id="name"], input[id="email"]').each(
        function() {
            if ($(this).val() == '')
                filled = false;
        }
    );
    var fostering = false;
    $('input[name="fostering"]:checked').each(
        function() {
            fostering = true;
        }
    );
    var lifestyle = false;
    $('input[name="lifestyle"]:checked').each(
        function() {
            lifestyle = true;
        }
    );
    return filled && fostering && lifestyle;
}

function clean() {
    return $(this).html().replace(/\s+/g, ' ').trim();
}
