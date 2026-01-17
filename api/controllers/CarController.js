import Car from '../database/models/Car.js';


const CarController = {
  // Criar um novo carro
  async create(req, res) {
    // Os dados vêm como string do FormData, então converta se necessário

    console.log(req.file);
    const name = req.body.name;
    const brand = req.body.brand;
    const year = req.body.year ? Number(req.body.year) : undefined;
    const gas = req.body.gas;
    const color = req.body.color;
    const km = req.body.km ? Number(req.body.km) : undefined;
    const photo = req.file ? req.file.location : null;
    const price = req.body.price ? Number(req.body.price) : null;

    if (!name || !brand || !year || !gas || !color || km === undefined) {
      return res.status(400).json({ erro: 'Name, brand, year, gas, color e km são obrigatórios.' });
    }
    try {
      const novoCarro = await Car.create({ name, brand, year, gas, color, km, photo, price });
      if (!novoCarro) {
        return res.status(500).json({ erro: 'Erro ao cadastrar carro.' });
      }
      return res.status(200).json({ mensagem: 'Carro cadastrado com sucesso', carro: novoCarro });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ erro: error.message || 'Erro ao cadastrar carro.' });
    }
  },
  // Listar todos os carros
  async getAllCars(req, res) {
    try {
      const cars = await Car.findAll();
      console.log(cars);
      return res.status(200).json(cars);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ erro: error.message || 'Erro ao buscar carros.' });
    }
  },
  async getCarById(req, res) {
    const carId = req.params.id;
    try {
      const car = await Car.findByPk(carId);
      if (!car) {
        return res.status(404).json({ erro: 'Carro não encontrado.' });
      }
      return res.status(200).json(car);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ erro: error.message || 'Erro ao buscar carro.' });
    }
  },
  // ... outras funções podem ser adicionadas aqui
};

export default CarController;
