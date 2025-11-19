
// Controller agrupado para usuário


import User from '../database/models/user.js';

const loginController = {
	// Login do usuário
	async login(req, res) {
		const { email, senha } = req.body;
		if (!email || !senha) {
			return res.status(400).json({ erro: 'Email e senha são obrigatórios.' });
		}
		// Lógica de autenticação aqui
		return res.status(200).json({ mensagem: 'Login recebido com sucesso', email });
	},

	// Cadastro de usuário
	async register(req, res) {
		const { email, senha } = req.body;
		if (!email || !senha) {
			return res.status(400).json({ erro: 'Email e senha são obrigatórios.' });
		}
		try {
			// Cria o usuário na tabela User
			const novoUsuario = await User.create({ email, password: senha });
			return res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso', usuario: { uuid: novoUsuario.uuid, email: novoUsuario.email } });
		} catch (error) {
			if (error.name === 'SequelizeUniqueConstraintError') {
				return res.status(409).json({ erro: 'Email já cadastrado.' });
			}
			return res.status(500).json({ erro: 'Erro ao cadastrar usuário.' });
		}
	}
};

export default loginController;
