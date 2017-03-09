(function() {
  	
	function checkAuth(){
		var email=param('email');
		var authKey=param('authKey');
		if(email==="" || authKey===""){
			//console.log("hummer");
			//window.location.href='/';
		}else{
			fetch('/varifyEmail/'+email+'/'+authKey, {
			method: 'get'
			}).then(x => x.json())
			.then(function(returnedValue) {
				if (returnedValue.status!=1) {
					//console.log(returnedValue);
					window.location.href='/';
				}
				else{
					document.getElementById('email').value=returnedValue.user.email ; 
					document.getElementById('authKey').value=returnedValue.user.authKey ;
				} 
			}).catch(function(err) {
				//console.log("hummer2");
				window.location.href='/';
			});
		}
		
	}
	 function param(name) {//gets parameters from the url
        return (location.search.split(name + '=')[1] || '').split('&')[0];
    }
    checkAuth();
})();