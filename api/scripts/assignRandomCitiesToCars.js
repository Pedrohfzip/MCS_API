import Car from '../database/models/Car.js';
import City from '../database/models/City.js';

async function assignRandomCitiesToCars() {
  try {
    // Busca todos os ids das cidades
    const cities = await City.findAll({ attributes: ['id'] });
    if (!cities.length) {
      console.log('Nenhuma cidade encontrada.');
      return;
    }
    const cityIds = cities.map(city => city.id);

    // Busca todos os carros
    const cars = await Car.findAll();
    if (!cars.length) {
      console.log('Nenhum carro encontrado.');
      return;
    }
          console.log(cars);
    // Atualiza cada carro com um cityId aleatório
    for (const car of cars) {
      const randomCityId = cityIds[Math.floor(Math.random() * cityIds.length)];
      console.log(randomCityId);
      await car.update({ cityId: randomCityId });
      await car.save();
      console.log(`Carro ${car.id} atualizado com cityId ${randomCityId}`);
    }
    console.log('Todos os carros receberam cityId aleatório!');
  } catch (error) {
    console.error('Erro ao atualizar cityId dos carros:', error);
  }
}

assignRandomCitiesToCars();
