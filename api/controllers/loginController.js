
// Controller agrupado para usuário


import users from '../database/models/User.js';
import bcrypt from 'bcryptjs';
import { generateAccessToken, generateRefreshToken } from '../services/generateToken.js';

const loginController = {


	async getAllUsers(req, res) {
		try {
			const allUsers = await users.findAll({});
			return res.status(200).json(allUsers);
		} catch (error) {
			return res.status(500).json({ erro: 'Erro ao buscar usuários.' });
		}
	},
	async getUserById(req, res) {
		const userId = req.params.id;
		try {
			const user = await users.findByPk(userId);
			if (!user) {
				return res.status(404).json({ erro: 'Usuário não encontrado.' });
			}
			return res.status(200).json(user);
		} catch (error) {
			return res.status(500).json({ erro: error.message || 'Erro ao buscar usuário.' });
		}
	},
	async searchUsers(req, res) {
      const { data } = req.query;
      if (!data) {
        return res.status(400).json({ erro: 'O parâmetro data é obrigatório.' });
      }

			// Busca usuários por nome ou email (case-insensitive)
			const { Op } = await import('sequelize');
			const where = {
				[Op.or]: [
					{ name: { [Op.iLike]: `%${data}%` } },
					{ email: { [Op.iLike]: `%${data}%` } }
				]
			};
			try {
				const foundUsers = await users.findAll({ where });
				return res.status(200).json(foundUsers);
			} catch (error) {
				return res.status(500).json({ erro: error.message || 'Erro ao buscar usuários.' });
			}
	},
	// Login do usuário
	async login(req, res) {

		const { email, senha } = req.body;
		if (!email || !senha) {
			return res.status(400).json({ erro: 'Email e senha são obrigatórios.' });
		}
		try {
			// Busca usuário pelo email
			const user = await users.findOne({ where: { email } });
			if (!user) {
				return res.status(404).json({ erro: 'Usuário não encontrado.' });
			}
			// Compara senha
			const senhaValida = await bcrypt.compare(senha, user.password);
			if (!senhaValida) {
				return res.status(401).json({ erro: 'Credenciais inválidas.' });
			}
			const accessToken = generateAccessToken(user);
  			const refreshToken = generateRefreshToken(user);
			res.cookie("accessToken", accessToken, {
				httpOnly: true,
				secure: false, // TRUE em produção
				sameSite: "strict",
				path: "/",
				maxAge: 1000 * 60 * 15
			});
			  res.cookie("refreshToken", refreshToken, {
				httpOnly: true,
				secure: false,
				sameSite: "strict",
				path: "/",
				maxAge: 1000 * 60 * 60 * 24 * 7
			});
			// Autenticação bem-sucedida
			return res.status(200).json({ message: 'Login realizado com sucesso', usuario: { id: user.id, email: user.email, name: user.name } });
		} catch (error) {
			return res.status(500).json({ erro: 'Credenciais inválidas.' });
		}
	},

	// Cadastro de usuário
	async register(req, res) {
		const {email, senha, name, role } = req.body;
		console.log('Dados recebidos para registro:', { email, senha });
		if (!email || !senha) {
			return res.status(400).json({ erro: 'Email e senha são obrigatórios.' });
		}
		try {
			// Criptografa a senha antes de salvar
			const salt = await bcrypt.genSalt(10);
			const hash = await bcrypt.hash(senha, salt);
			// Cria o usuário na tabela User
			const novoUsuario = await users.create({ name, email, password: hash, role });
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
		const { id } = req.params;
		console.log('ID recebido para exclusão:', id);
		if (!id) {
			return res.status(400).json({ erro: 'ID é obrigatório.' });
		}
		try {
			const deleted = await users.destroy({ where: { uuid: id } });
			if (deleted === 0) {
				return res.status(404).json({ erro: 'Usuário não encontrado.' });
			}
			return res.status(200).json({ mensagem: 'Usuário excluído com sucesso.' });
		} catch (error) {
			return res.status(500).json({ erro: 'Erro ao excluir usuário.' });
		}
	},

};

export default loginController;
