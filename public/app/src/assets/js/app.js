$(function() {
	
	/* ––––– Toggle sidebar ––––– */
	
	$('.toggle-sidebar').click(function() {
		$('.content-wrapper').toggleClass('is-floating');
	});
	
	/* ––––– Label ––––– */
	
	$('.ui.form.style-default .label').click(function() {
		$(this).next().focus();
	});
	
});