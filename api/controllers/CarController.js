
import Car from '../database/models/Car.js';
import CarImage from '../database/models/CarImage.js';
import { Op, where } from 'sequelize';


const CarController = {
  // Buscar carros por qualquer campo dinâmico
  async search(req, res) {
      const { data } = req.query;
      if (!data) {
        return res.status(400).json({ erro: 'O parâmetro data é obrigatório.' });
      }

      // Busca por múltiplos campos
      const where = {
        [Op.or]: [
          { name: { [Op.iLike]: `%${data}%` } },
          { brand: { [Op.iLike]: `%${data}%` } },
          { gas: { [Op.iLike]: `%${data}%` } },
          { color: { [Op.iLike]: `%${data}%` } },
          // Busca exata para ano se for número
          ...(Number.isInteger(Number(data)) ? [{ year: Number(data) }] : [])
        ]
      };
      try {
        const cars = await Car.findAll({ where });
        return res.status(200).json(cars);
      } catch (error) {
        return res.status(500).json({ erro: error.message || 'Erro ao buscar carros.' });
      }
  },
  async create(req, res) {
    // Os dados vêm como string do FormData, então converta se necessário
    const name = req.body.name;
    const brand = req.body.brand;
    const year = req.body.year ? Number(req.body.year) : undefined;
    const gas = req.body.gas;
    const color = req.body.color;
    const km = req.body.km ? Number(req.body.km) : undefined;
    const price = req.body.price ? Number(req.body.price) : null;

    if (!name || !brand || !year || !gas || !color || km === undefined) {
      return res.status(400).json({ erro: 'Name, brand, year, gas, color e km são obrigatórios.' });
    }
    console.log("Arquivos recebidos:", req.files);
    try {
      // Cria o carro sem foto
      const novoCarro = await Car.create({ name, brand, year, gas, color, km, price });
      if (!novoCarro) {
        return res.status(500).json({ erro: 'Erro ao cadastrar carro.' });
      }
      console.log("Novo carro criado:", novoCarro);

      // Salva cada imagem na tabela CarImage

        const carImages = await Promise.all(
          req.files.map(async (file) => {
            return await CarImage.create({ imageUrl: file.location, carId: novoCarro.id });
          })
        );
        console.log("Imagens do carro salvas:", carImages);
        return res.status(200).json({ mensagem: 'Carro cadastrado com sucesso', carro: novoCarro });
      } catch (error) {
      return res.status(500).json({ erro: error.message || 'Erro ao cadastrar carro.' });
    }
  },
  // Listar todos os carros
  async getAllCars(req, res) {
    try {
      let cars = await Car.findAll();
      const images = await CarImage.findAll({
        where: {
          carId: { [Op.in]: cars.map(car => car.id) }
        }
      });
      // Cria um mapa de imagens por carId
      const imagesByCarId = images.reduce((acc, img) => {
        if (!acc[img.carId]) acc[img.carId] = [];
        acc[img.carId].push(img);
        return acc;
      }, {});
      // Adiciona a propriedade images em cada carro
      const carsWithImages = cars.map(car => {
        const carObj = car.toJSON ? car.toJSON() : car;
        return {
          ...carObj,
          images: imagesByCarId[car.id] || []
        };
      });
      return res.status(200).json(carsWithImages);
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
      const images = await CarImage.findAll({ where: { carId: car.id } });
      const carObj = car.toJSON ? car.toJSON() : car;
      return res.status(200).json({ ...carObj, images });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ erro: error.message || 'Erro ao buscar carro.' });
    }
  },
  // Editar um carro
  async update(req, res) {
    const carId = req.params.id;
    const { name, brand, year, gas, color, km, price } = req.body;
    const photo = req.file ? req.file.location : undefined;

    try {
      const car = await Car.findByPk(carId);
      if (!car) {
        return res.status(404).json({ erro: 'Carro não encontrado.' });
      }

      await car.update({
        name: name ?? car.name,
        brand: brand ?? car.brand,
        year: year ? Number(year) : car.year,
        gas: gas ?? car.gas,
        color: color ?? car.color,
        km: km ? Number(km) : car.km,
        price: price ? Number(price) : car.price,
        photo: photo ?? car.photo,
      });

      return res.status(200).json({ mensagem: 'Carro atualizado com sucesso', carro: car });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ erro: error.message || 'Erro ao atualizar carro.' });
    }
  },

  // Excluir um carro
  async delete(req, res) {
    const carId = req.params.id;
    try {
      const car = await Car.findByPk(carId);
      if (!car) {
        return res.status(404).json({ erro: 'Carro não encontrado.' });
      }
      await car.destroy();
      return res.status(200).json({ mensagem: 'Carro excluído com sucesso' });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ erro: error.message || 'Erro ao excluir carro.' });
    }
  },
};

export default CarController;
