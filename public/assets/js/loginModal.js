$(window, document, undefined).ready(function() {
  
  
  // Show overlay & Open modal
  
  $( ".login-modal-overlay" ).click(function() {
    $(this).fadeOut(200);
  });
  $( ".openb" ).click(function() {
    $(".login-modal-overlay").fadeIn(200);
  });
  $(".login-modal").click(function(event) {
    event.stopPropagation();
  });
  
  
  // Input label

  $('input').blur(function() {
    var $this = $(this);
    if ($this.val())
      $this.addClass('used');
    else
      $this.removeClass('used');
  });
  
  
  // Animations

  var $ripples = $('.ripples');

  $ripples.on('click.Ripples', function(e) {

    var $this = $(this);
    var $offset = $this.parent().offset();
    var $circle = $this.find('.ripplesCircle');

    var x = e.pageX - $offset.left;
    var y = e.pageY - $offset.top;

    $circle.css({
      top: y + 'px',
      left: x + 'px'
    });

    $this.addClass('is-active');

  });

  $ripples.on('animationend webkitAnimationEnd mozAnimationEnd oanimationend MSAnimationEnd', function(e) {
  	$(this).removeClass('is-active');
  });

});