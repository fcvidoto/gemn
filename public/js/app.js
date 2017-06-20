

// ***************************************************************
// LOGIN PAGE
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





// ***************************************************************
// CADASTRO PAGE
$(".botao-registrar").on('click', (e) => {
	e.preventDefault();
	$emailCadastro = $('#email-cadastro').val();
	$senhaCadastro = $('#senha-cadastro').val();
	$senhaCadastroConfirma = $('#senha-cadastro-confirma').val();
	// verifica se os campos de email, senha e confirmar senha estao preenchidos
	if ($emailCadastro == '' && $senhaCadastro == '' && $senhaCadastroConfirma == '') {
		$(".alerta").text('Preencha todos os campos');
		$(".alerta").slideDown(600).delay(2000).fadeOut(1000)
	}
	// verifica se a senha bate com a confirmação de senha
	if ($senhaCadastro !== $senhaCadastroConfirma) {
		$(".alerta").text('A senha e a confirmação de senha estão diferentes');
		$(".alerta").slideDown(600).delay(2000).fadeOut(1000)
	}
	// verifica se o email do user se encontra na base de dados
	$.ajax({
	    url: "/cadastro", 
	    data: {
		    			email: $emailCadastro, 
		    			password: $senhaCadastro
	    			},
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
					formMsg(XMLHttpRequest); // msg de envio de email
					setTimeout(() => {
		    		window.location = '/'; // vai para a pagina principal apos 3s
					}, 3000)
	    	}
	    }
	});
});




