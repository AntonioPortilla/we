window.onload = function(){
	/*$('#srv').click(function(){
		$('#srvModal').modal('show');
	});*/
	$('#mision').click(function(){
		$('#miModal').modal('show');
	});
	$('#vision').click(function(){
		$('#viModal').modal('show');
	});
	$('.srv01').click(function(){
		$('#srv01Modal').modal('show');
	});
	$('.srv02').click(function(){
		$('#srv02Modal').modal('show');
	});
	$('.srv03').click(function(){
		$('#srv03Modal').modal('show');
	});
	$('.srv04').click(function(){
		$('#srv04Modal').modal('show');
	});
	$('.srv05').click(function(){
		$('#srv05Modal').modal('show');
	});
	$('.srv06').click(function(){
		$('#srv06Modal').modal('show');
	});
	$('.srv07').click(function(){
		$('#srv07Modal').modal('show');
	});
	$('.srv08').click(function(){
		$('#srv08Modal').modal('show');
	});
	$('.civil3D').click(function(){
		$('#civil3D').modal('show');
	});
	$('.capacitacion').click(function(){
		$('#capacitacion').modal('show');
	});
	$('.arGIS').click(function(){
		$('#arGIS').modal('show');
	});
	$('#srv').click(function(){
		$('html, body').animate({
			scrollTop: $('#block-srv').offset().top
		}, 2000);
	});
	$('#contact').click(function(){
		$('html, body').animate({
			scrollTop: $('#contacto').offset().top
		}, 2000);
	});
	$('#me').click(function(){
		$('html, body').animate({
			scrollTop: $('#block-me').offset().top
		}, 2000);
	});
	$('#mon').click(function(){
		$('html, body').animate({
			scrollTop: $('#block-mon').offset().top
		}, 2000);
	});
	$('#capa').click(function(){
		$('html, body').animate({
			scrollTop: $('#block-capa').offset().top
		}, 2000);
	});
}

$(function(){

	function openDialog() {
		$('#overlay').fadeIn('fast', function() {
			$('#popup').css('display','block');
			$('#popup').animate({'left':'30%'},500);
		});
	}

	/*function closeDialog(id) {
		$('#'+id).css('position','absolute');
		$('#'+id).animate({'left':'-100%'}, 500, function() {
		$('#'+id).css('position','fixed');
		$('#'+id).css('left','100%');
		$('#overlay').fadeOut('fast');
		});
	}*/
	$('.closeDialog').click(function(id){
		console.log('cerrando popup');
		//$('#'+id).css('position','absolute');
		$('.popup').animate({'left':'-100%'}, 500, function() {
			//$('#'+id).css('position','fixed');
			//$('#'+id).css('left','100%');
			$('#overlay').fadeOut('fast');
		});
	});

})