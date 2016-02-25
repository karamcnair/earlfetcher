$(function(){
 $('button').on('click', function(e){

   $('.highlight').removeClass('highlight');

   var toHighlight = $(this).attr('id');

   $('.' + toHighlight).addClass('highlight');
 });
});