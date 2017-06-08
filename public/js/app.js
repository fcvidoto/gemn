



// valida o acesso do user
$(".botao-confirmar").on("click", (e) => {
	e.preventDefault();

	var email = $('#email').val();
	var password = $('#password').val();
	
	// verifica se o user esta cadastrado na base de dados
	if (email !== '' && password !== '') {
		verificauser(email, password); 
	}
});



// --------------------------------------------------------
// verifica se o user esta cadastrado na base de dados
function verificauser(email, password) {

	$.post('/consulta', {sender: email,
											 password: password}, function(data, textStatus, xhr) {
		// enviar msg ao servidor e ao site avisando do envio
		// $('.sucesso').text('Comentario enviado com sucesso!');
		// $('.sucesso').slideDown();
		// $('#email').val('');
		// $('.comentario-campo').val('');
    alert(textStatus);
	});
};