import Car from '../database/models/Car.js';


const CarController = {
  // Criar um novo carro
  async create(req, res) {
    const { name, brand, year, photo, gas, color, km } = req.body;
    console.log(req.body);
    // if (!name || !brand || !year || !gas || !color || km === undefined) {
    //   return res.status(400).json({ erro: 'Name, brand, year, gas, color e km são obrigatórios.' });
    // }
    // try {
    //   const novoCarro = await Car.create({ name, brand, year, gas, color, km });
    //   if (!novoCarro) {
    //     return res.status(500).json({ erro: 'Erro ao cadastrar carro.' });
    //   }
    //   return res.status(200).json({ mensagem: 'Carro cadastrado com sucesso', carro: novoCarro });
    // } catch (error) {
    //   console.log(error);
    //   return res.status(500).json({ erro: error.message || 'Erro ao cadastrar carro.' });
    // }
  },
  // Listar todos os carros
  async getAllCars(req, res) {
    try {
      const cars = await Car.findAll();
      return res.status(200).json(cars);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ erro: error.message || 'Erro ao buscar carros.' });
    }
  },
  // ... outras funções podem ser adicionadas aqui
};

export default CarController;
