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
