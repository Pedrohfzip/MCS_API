
// Controller agrupado para usuário


import users from '../database/models/User.js';

const loginController = {
	// Login do usuário
	async login(req, res) {
		console.log(req.body);
		const { email, senha } = req.body;
		if (!email || !senha) {
			return res.status(400).json({ erro: 'Email e senha são obrigatórios.' });
		}
		// Lógica de autenticação aqui
		return res.status(200).json({ mensagem: 'Login recebido com sucesso', email });
	},

	// Cadastro de usuário
	async register(req, res) {
		console.log(req.body);
		const {email, senha, name } = req.body;
		console.log('Dados recebidos para registro:', { email, senha });
		if (!email || !senha) {
			return res.status(400).json({ erro: 'Email e senha são obrigatórios.' });
		}
		try {
			// Cria o usuário na tabela User
			const novoUsuario = await users.create({ name, email, password: senha });
			if (!novoUsuario) {
				return res.status(500).json({ erro: 'Erro ao cadastrar usuário.' });
			}
			return res.status(200).json({ mensagem: 'Usuário cadastrado com sucesso', usuario: { uuid: novoUsuario.uuid, email: novoUsuario.email } });
		} catch (error) {
			if (error.name === 'SequelizeUniqueConstraintError') {
				return res.status(409).json({ erro: 'Email já cadastrado.' });
			}
			return res.status(500).json({ erro: error });
		}
	}
};

export default loginController;
