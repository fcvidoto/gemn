

// valida o acesso do user
$(".botao-confirmar").on("click", (e) => {
	e.preventDefault();

	var email = $('#email').val();
	var password = $('#password').val();
	
	// verifica se o user esta cadastrado na base de dados
	if (email !== '' && password !== '') {
		verificauser(email, password); 
	} else {
		formMsg('Preencha todos os campos');
	}
});



// --------------------------------------------------------
// verifica se o user esta cadastrado na base de dados
function verificauser(email, password) {

	// $.post('/consulta', {email: email,
	// 					password: password}, function(data, textStatus, xhr) {
	// 	// enviar msg ao servidor e ao site avisando do envio
	// 	// $('.sucesso').text('Comentario enviado com sucesso!');
	// 	// $('.sucesso').slideDown();
	// 	// $('#email').val('');
	// 	// $('.comentario-campo').val('');
	// 	formMsg(data);
	// });

	$.ajax({
	    url: "/consulta", 
	    data: {email: email, password: password},
	    type: 'post',
	    error: function(XMLHttpRequest, textStatus, errorThrown){
				if (XMLHttpRequest.status === 401) {
					formMsg("Senha inválida!");
				} else if (XMLHttpRequest.status === 404) {
					formMsg("Usuário não cadastrado");
				}  else if (XMLHttpRequest.status === 502) {
					formMsg("Usuário não cadastrado!");
				}
	    },
	    success: function(XMLHttpRequest, textStatus){
	    	// valida se a senha do usuario e valida
	    	if (textStatus === 'success') {
	    		window.location = XMLHttpRequest.url.toLowerCase();
	    	}
	    }
	});

};


// --------------------------------------------------------
// muda status dos text para erro
function formMsg(msgErro) {
	// let $formulario =	$(".formulario");
	// $(".glyphicon")
	$(".alerta").text(msgErro);
	$(".alerta").slideDown(600).delay(2000).fadeOut(1000)

}







