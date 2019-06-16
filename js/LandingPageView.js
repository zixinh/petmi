function showAlert() {
	$("#incorrect-login-alert").show();
	setTimeout(() => $("#incorrect-login-alert").hide(), 3000);
}

$(document).ready(function () {

	$('#viewPetButton').click(() => window.location.href = "CommunityView.html")

	$("#incorrect-login-alert").hide()
	$("#incorrect-registration-alert").hide()
	$("#login-forms").hide()

	$("#loginButton").click(function (event) {
		event.preventDefault()

		$("#viewPetButton").hide()
		$("#loginButton").hide()
		$("#registerButton").hide()
		$("#login-forms").fadeIn()
		$("#goBack").fadeIn()

		$("#loginForm").submit(function (e) {
			e.preventDefault()
			const email = $("#emailName").val();
			const password = $("#password").val();
			if (!email || !password) {
				return showAlert();
			}

			let data = {
				username: email,
				password: password
			};
			$.ajax({
				type: 'POST',
				url: '/user/verify',
				data: data,
				dataType: 'json',
				success: function (res) {
					console.log("on success", res);
					if (res.error) {
						console.log("error found----");
						return showAlert();
					}
					if (res.admin) {
						window.location.href = "AdminView.html";
					} else {
						window.location.href = "HomeView.html";
					}
				},
				error: function (err) {
					console.log("error occurred when login ", err);
				}
			});
		});

		$("#goBack").click(function (e) {
			e.preventDefault()

			$("#login-forms").hide()
			$("#goBack").hide()
			$("#incorrect-login-alert").hide()
			$("#incorrect-registration-alert").hide()

			$("#viewPetButton").fadeIn()
			$("#loginButton").fadeIn()
			$("#registerButton").fadeIn()
		});
	});

	$("#registerButton").click(function (e) {
		e.preventDefault();
		window.location.href = "ProfileSignupView.html";
	});

	$("#join").on("click", () => {
		$("#registerButton").trigger("click");
	});


	(function animationLoop() {
		/* For the like/dislike button click animation. */
		const like = $("button#like")
		const dislike = $("button#dislike")
		const delay = Math.floor((Math.random() * 2600) + 1000);
		var choices = [0, 0, 1, 1, 1];
		var idx = Math.floor(Math.random() * choices.length);
		const decision = choices[idx]

		if (decision) {
			/* Click the like button. */
			setTimeout(function () {

				like.toggleClass("focus active")

				// Wait a bit then toggle off.
				setTimeout(() => {
					like.toggleClass("focus active")
				}, 500)

				animationLoop()
			}, delay);
		} else {
			/* Click the dislike button. */
			setTimeout(function () {
				dislike.toggleClass("focus active")

				// Wait a bit then toggle off.
				setTimeout(() => {
					dislike.toggleClass("focus active")
				}, 470)
				animationLoop()
			}, delay);
		}
	})();

});