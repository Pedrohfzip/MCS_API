import Car from '../database/models/Car.js';

const CarController = {
  // Criar um novo carro
  async create(req, res) {
    console.log(req);
    const { name, brand, year, photo } = req.body;
    if (!name || !brand || !year) {
      return res.status(400).json({ erro: 'Name, brand, and year are required.' });
    }
    try {
      const novoCarro = await Car.create({ name, brand, year, photo });
      if (!novoCarro) {
        return res.status(500).json({ erro: 'Erro ao cadastrar carro.' });
      }
      return res.status(200).json({ mensagem: 'Carro cadastrado com sucesso', carro: novoCarro });
    } catch (error) {
      return res.status(500).json({ erro: error.message || 'Erro ao cadastrar carro.' });
    }
  },
  // ... outras funções podem ser adicionadas aqui
};

export default CarController;
