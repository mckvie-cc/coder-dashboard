(function() {
	function getUsers(){
		fetch('/users/getUsers', {
			method: 'get'
		}).then(x => x.json())
		.then(function(returnedValue) {
				console.log(returnedValue);
				returnedValue.forEach(function(user){
					document.getElementById('userList').innerHTML=document.getElementById('userList').innerHTML+user.name
					+"<br> "+user.email+"<br> "+user.sex+"<br> "+user.profile+"<hr>";
				})

		}).catch(function(err) {
			//console.log("hummer2");
		});
	}
    getUsers();
})();