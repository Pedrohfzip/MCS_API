import users from '../database/models/User.js';
import cars from '../database/models/Car.js';
import CarsToUser from '../database/models/CarsToUser.js';

async function linkPedroToAllCars() {
  try {
    // Busca o usuário Pedro
    const pedro = await users.findOne({ where: { name: 'Pedro' } });
    if (!pedro) {
      console.log('Usuário Pedro não encontrado.');
      return;
    }
    // Busca todos os carros
    const allCars = await cars.findAll();
    if (!allCars.length) {
      console.log('Nenhum carro cadastrado.');
      return;
    }
    // Cria registros na tabela de ligação
    for (const car of allCars) {
      await CarsToUser.create({ userUuid: pedro.uuid, carId: car.id });
      console.log(`Vínculo criado: Pedro (uuid: ${pedro.uuid}) -> Carro (id: ${car.id})`);
    }
    console.log('Todos os vínculos criados com sucesso!');
  } catch (error) {
    console.error('Erro ao criar vínculos:', error);
  }
}

linkPedroToAllCars();
