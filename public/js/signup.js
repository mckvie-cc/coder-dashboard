(function() {
  
	function checkAuth(){
		fetch('https://davidwalsh.name/some/url', {
			method: 'get'
		}).then(function(response) {
			
		}).catch(function(err) {
			// Error :(
		});
	}
})();