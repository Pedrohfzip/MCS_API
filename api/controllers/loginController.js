
// Controller agrupado para usuário


import users from '../database/models/User.js';
import bcrypt from 'bcryptjs';

const loginController = {
	// Login do usuário
	async login(req, res) {
		console.log(req.body);
		const { email, senha } = req.body;
		if (!email || !senha) {
			return res.status(400).json({ erro: 'Email e senha são obrigatórios.' });
		}
		try {
			// Busca usuário pelo email
			const usuario = await users.findOne({ where: { email } });
			if (!usuario) {
				return res.status(404).json({ erro: 'Usuário não encontrado.' });
			}
			// Compara senha
			const senhaValida = await bcrypt.compare(senha, usuario.password);
			if (!senhaValida) {
				return res.status(401).json({ erro: 'Credenciais inválidas.' });
			}
			// Autenticação bem-sucedida
			return res.status(200).json({ message: 'Login realizado com sucesso', usuario: { id: usuario.id, email: usuario.email, name: usuario.name } });
		} catch (error) {
			return res.status(500).json({ erro: 'Credenciais inválidas.' });
		}
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
			// Criptografa a senha antes de salvar
			const salt = await bcrypt.genSalt(10);
			const hash = await bcrypt.hash(senha, salt);
			// Cria o usuário na tabela User
			const novoUsuario = await users.create({ name, email, password: hash });
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
	},


	// Excluir todos os usuários
	async deleteUser(req, res) {
		try {
			const deleted = await users.destroy({ where: {}, truncate: true });
			return res.status(200).json({ mensagem: 'Todos os usuários foram excluídos.' });
		} catch (error) {
			return res.status(500).json({ erro: 'Erro ao excluir usuários.' });
		}
	}
};

export default loginController;
