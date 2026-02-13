
import Car from '../database/models/Car.js';
import CarImage from '../database/models/CarImage.js';
import { Op, where } from 'sequelize';


const CarController = {
  async getCarsByUserUuid(req, res) {
      const { uuid } = req.params;
      console.log('Requisição para buscar carros do usuário com UUID:', uuid);
      console.log('UUID recebido para busca de carros do usuário:', uuid);
      if (!uuid) {
        return res.status(400).json({ erro: 'UUID do usuário é obrigatório.' });
      }
      try {
        const CarsToUser = (await import('../database/models/CarsToUser.js')).default;
        const carLinks = await CarsToUser.findAll({ where: { userUuid: uuid }, raw: true });
        if (!carLinks.length) {
          return res.status(200).json([]);
        }
        const carIds = carLinks.map(link => link.carId);
        const cars = await Car.findAll({ where: { id: carIds } });
        const images = await CarImage.findAll({ where: { carId: carIds } });
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
        return res.status(500).json({ erro: error.message || 'Erro ao buscar carros do usuário.' });
      }
  },
  async search(req, res) {
      // Suporte a múltiplos filtros: ?name=Corolla&brand=Toyota&year=2022 OU ?data=Corolla Toyota
      const { name, brand, year, data } = req.query;
      console.log('Parâmetros de busca:', req.query);
      let where = {};
      if (data) {
        // Busca por nome OU marca (OR)
        where = {
          [Op.or]: [
            { name: { [Op.iLike]: `%${data}%` } },
            { brand: { [Op.iLike]: `%${data}%` } }
          ]
        };
      } else if (name || brand || year) {
        // Busca combinada (AND) se vierem filtros separados
        if (name) where.name = { [Op.iLike]: `%${name}%` };
        if (brand) where.brand = { [Op.iLike]: `%${brand}%` };
        if (year) where.year = Number(year);
      } else {
        return res.status(400).json({ erro: 'Informe pelo menos um filtro.' });
      }
      try {
        const cars = await Car.findAll({ where });
        // Busca imagens dos carros encontrados
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
    const cityId = req.body.cityId ? Number(req.body.cityId) : null;
    if (!name || !brand || !year || !gas || !color || km === undefined || !cityId) {
      return res.status(400).json({ erro: 'Name, brand, year, gas, color, km e cityId são obrigatórios.' });
    }

    try {
      // Cria o carro sem foto
      const novoCarro = await Car.create({ name, brand, year, gas, color, km, price, cityId });
      if (!novoCarro) {
        return res.status(500).json({ erro: 'Erro ao cadastrar carro.' });
      }


      // Salva cada imagem na tabela CarImage

        const carImages = await Promise.all(
          req.files.map(async (file) => {
            return await CarImage.create({ imageUrl: file.location, carId: novoCarro.id });
          })
        );

        return res.status(200).json({ mensagem: 'Carro cadastrado com sucesso', carro: novoCarro });
      } catch (error) {
      return res.status(500).json({ erro: error.message || 'Erro ao cadastrar carro.' });
    }
  },
  async getAllCars(req, res) {
    try {
      let cars = await Car.findAll();
      const images = await CarImage.findAll({
        where: {
          carId: { [Op.in]: cars.map(car => car.id) }
        }
      });
      // Busca os vínculos de carros para usuários
      const CarsToUser = (await import('../database/models/CarsToUser.js')).default;
      const users = (await import('../database/models/User.js')).default;
      const carLinks = await CarsToUser.findAll({
        where: { carId: { [Op.in]: cars.map(car => car.id) } },
        raw: true
      });
      // Mapeia carId para userUuid
      const carIdToUserUuid = {};
      carLinks.forEach(link => {
        carIdToUserUuid[link.carId] = link.userUuid;
      });
      // Busca nomes dos usuários
      const userUuids = [...new Set(carLinks.map(link => link.userUuid))];
      let userMap = {};
      if (userUuids.length > 0) {
        const userList = await users.findAll({ where: { uuid: userUuids }, raw: true });
        userList.forEach(u => { userMap[u.uuid] = u.name; });
      }
      // Cria um mapa de imagens por carId
      const imagesByCarId = images.reduce((acc, img) => {
        if (!acc[img.carId]) acc[img.carId] = [];
        acc[img.carId].push(img);
        return acc;
      }, {});
      // Adiciona a propriedade images, userUuid e userName em cada carro
      const carsWithImages = cars.map(car => {
        const carObj = car.toJSON ? car.toJSON() : car;
        const userUuid = carIdToUserUuid[car.id] || null;
        const userName = userUuid ? userMap[userUuid] : null;
        return {
          ...carObj,
          images: imagesByCarId[car.id] || [],
          userUuid,
          userName
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
  async update(req, res) {
    const carId = req.params.id;
    const { name, brand, year, gas, color, km, price } = req.body;
    // req.files pode conter múltiplas imagens
    const newImages = req.files;
    console.log('Dados para atualização:', req.body, 'Novas imagens:', newImages);

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
      });

      // Se vieram novas imagens, substitui as antigas
      if (newImages.length > 0) {
        // Remove todas as imagens antigas desse carro
        await CarImage.destroy({ where: { carId } });
        // Adiciona as novas imagens
        await Promise.all(
          newImages.map(async (imageUrl) => {
            console.log('Imagem adicionada:', imageUrl.location);
            await CarImage.create({ imageUrl: imageUrl.location, carId });
          })
        );
      }

      // Busca o carro atualizado e suas imagens
      const updatedCar = await Car.findByPk(carId);
      const images = await CarImage.findAll({ where: { carId } });

      return res.status(200).json({ mensagem: 'Carro atualizado com sucesso', carro: updatedCar, images });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ erro: error.message || 'Erro ao atualizar carro.' });
    }
  },
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
  async deleteCarImage(req, res) {
    console.log(req.params);
    const { carId, imageId } = req.params;
    if (!carId || !imageId) {
      return res.status(400).json({ erro: 'Parâmetros carId e imageId são obrigatórios.' });
    }
    try {
      const image = await CarImage.findOne({ where: { id: imageId, carId: carId } });
      if (!image) {
        return res.status(404).json({ erro: 'Imagem não encontrada para este carro.' });
      }
      await image.destroy();
      return res.status(200).json({ mensagem: 'Imagem excluída com sucesso' });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ erro: error.message || 'Erro ao excluir imagem.' });
    }
  },
};

export default CarController;
