/**
 * jQuery Mobile Menu 
 * Turn unordered list menu into dropdown select menu
 * version 1.0(31-OCT-2011)
 * 
 * Built on top of the jQuery library
 *	 http://jquery.com
 * 
 * Documentation
 *	 http://github.com/mambows/mobilemenu
 */
(function($){

// variable for storing the menu count when no ID is present
var menuCount = 0;

$.fn.mobileMenu = function(options) {
	
	var defaults = {
			switchWidth: 481,
			defaultText: 'Navigate to...',
			className: 'mobileMenu',
			subMenuClass: 'mobileMenu-subMenu',
			subMenuDash: '&ndash;'
		},
		settings = $.extend( defaults, options ),
		el = $(this);
	
	// function to check if selector matches a list
	function isList($this){
		return $this.is('ul, ol');
	}


	// function to decide if mobile or not
	function isMobile(){
		return ($(window).width() < settings.switchWidth);
	}
	
	
	// check if dropdown exists for the current element
	function menuExists($this){
		
		// if the list has an ID, use it to give the menu an ID
		if($this.attr('id')){
			return ($('#mobileMenu_'+$this.attr('id')).length > 0);
		} 
		
		// otherwise, give the list and select elements a generated ID
		else {
			menuCount++;
			$this.attr('id', 'mm'+menuCount);
			return ($('#mobileMenu_mm'+menuCount).length > 0);
		}
	}
	
	
	// change page on mobile menu selection
	function goToPage($this){
		if($this.val() !== null){document.location.href = $this.val()}
	}
	
	
	// show the mobile menu
	function showMenu($this){
		$this.hide('display', 'none');
		$('#mobileMenu_'+$this.attr('id')).show();
	}
	
	
	// hide the mobile menu
	function hideMenu($this){
		$this.css('display', '');
		$('#mobileMenu_'+$this.attr('id')).hide();
	}

	function createMenu($this){
		// ad class to submenu list
		el.find('ul').addClass(settings.subMenuClass);

		// Create base menu
		$('<select />',{
			'class' : settings.className,
			'id' : 'mobileMenu_'+$this.attr('id')
		}).insertAfter( el );

		// Create default option
		$('<option />', {
			"value" : '#',
			"text"		: settings.defaultText
		}).appendTo( '.' + settings.className );

		// Create select option from menu
		el.find('a').each(function(){
			var $this = $(this),
					optText = '&nbsp;' + $this.text(),
					optSub	= $this.parents( '.' + settings.subMenuClass ),
					len	 = optSub.length,
					dash;
			
			// if menu has sub menu
			if( $this.parents('ul').hasClass( settings.subMenuClass ) ) {
				dash = Array( len+1 ).join( settings.subMenuDash );
				optText = dash + optText;
			}

			// Now build menu and append it
			$('<option />', {
				"value" : this.href,
				"html"	: optText,
				"selected" : (this.href == window.location.href)
			}).appendTo( '.' + settings.className );

		}); // End el.find('a').each

		// Change event on select element
		$('.' + settings.className).change(function(){
			var locations = $(this).val();
			if( locations !== '#' ) {
				window.location.href = $(this).val();
			};
		});

	} // End this.each
	
	// plugin functionality
	function run($this){
		
		// menu doesn't exist
		if(isMobile() && !menuExists($this)){
			createMenu($this);
		}
		
		// menu already exists
		else if(isMobile() && menuExists($this)){
			showMenu($this);
		}
		
		// not mobile browser
		else if(!isMobile() && menuExists($this)){
			hideMenu($this);
		}

	}
	
	// run plugin on each matched ul/ol
	// maintain chainability by returning "this"
	return this.each(function() {
		
		// cache "this"
		var $this = $(this);
	
		// bind event to browser resize
		$(window).resize(function(){run($this);});

		// run plugin
		run($this);

	});

};
})(jQuery);