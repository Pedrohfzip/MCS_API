// Controller para login de usuário
// Espera receber { email, senha } no corpo da requisição
async function loginController(req, res) {
	const { email, senha } = req.body;
	if (!email || !senha) {
		return res.status(400).json({ erro: 'Email e senha são obrigatórios.' });
	}
	// Aqui você pode adicionar a lógica de autenticação, por exemplo, buscar usuário no banco e comparar senha
	// Exemplo de resposta de sucesso (ajuste conforme sua lógica de autenticação)
	return res.status(200).json({ mensagem: 'Login recebido com sucesso', email });
}

export default loginController;
