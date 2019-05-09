$(window).on("load", function() {
  if($('.block').length) {
    $('.equal').matchHeight();
  }

  $('.collapse').on('show.bs.collapse', function () {
    $(this).siblings('.panel-heading').addClass('active');
  });

  $('.collapse').on('hide.bs.collapse', function () {
    $(this).siblings('.panel-heading').removeClass('active');
  });
});
