(function($){
    $(function(){

        var posted;
        
        $('#trigger').leanModal({
            complete: function() { window.location.href = './index.html'; }
        });

        $('#tos-trigger').leanModal({
            dismissible: false,
            complete: function() {
                posted.done(
                    function(data) { }
                ).fail(
                    function (data) {
                        alert("error: "+JSON.stringify(data));
                    }
                );
                $('#trigger').click();
                setTimeout(function() {
                    $('#modal-dismiss').click();
                }, 5000);
            }
        });
        
        $('.button-collapse').sideNav();
        $('button#form-submit').addClass('disabled').prop('disabled', true);
        $('input').change(
            function() {
                if (all_filled())
                    $('button').removeClass('disabled').prop('disabled', false);
                else
                    $('button').addClass('disabled').prop('disabled', true);
            }
        );
        $('#the_form').submit(
            function(event) {
                event.preventDefault();
                $('button').addClass('disabled').prop('disabled', true);
                $('button').html('Please, wait...');
                $('#tos-trigger').click();
                posted = $.post('https://apaservices.waltermoreira.net/insert',
                       {
                           name: $('#name').val(),
                           email: $('#email').val(),
                           interests: $('div#interests input:checked ~ label').map(clean).get().join(", "),
                           "lives_with": $('div#lives_with input:checked ~ label').map(clean).get().join(", "),
                           lifestyle: $('input[name="lifestyle"]:checked').val(),
                           fostering: $('input[name="fostering"]:checked').val(),
                           newsletter: $('input[name="newsletter"]:checked').val(),
                           _token: "apasaveslives"
                       });
            }
        );

        $("#name, #email").keyup(function (e) {
            if (e.keyCode == 13) {
                $(this).blur();
            }
        });
        
        $('.carousel').carousel({time_constant: 500});
        
        var timer = setInterval(function() { $('.carousel').carousel('next') }, 2000);
        var resume;
        
        function stop_resume() {
            clearInterval(timer);
            clearTimeout(resume);
            resume = setTimeout(function() {
                timer = setInterval(function() {
                    $('.carousel').carousel('next')
                }, 2000);
            }, 5000);
        };
        
        $('.carousel').click(function() {
            stop_resume();
        });

        $('.carousel').on({'touchstart': function() { stop_resume() }});
        $('.carousel').on({'touchmove': function() { stop_resume() }});
        
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

