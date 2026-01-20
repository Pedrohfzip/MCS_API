
import 'dotenv/config';
import cars from '../database/models/Car.js';
  console.log(process.env.DB_USER, process.env.DB_PASSWORD);
const carsToInsert = [
  { name: 'Civic', brand: 'Honda', year: 2020, gas: 'Gasolina', color: 'Preto', km: 15000, price: 95000 },
  { name: 'Corolla', brand: 'Toyota', year: 2019, gas: 'Flex', color: 'Branco', km: 22000, price: 90000 },
  { name: 'Gol', brand: 'Volkswagen', year: 2018, gas: 'Gasolina', color: 'Prata', km: 35000, price: 45000 },
  { name: 'Onix', brand: 'Chevrolet', year: 2021, gas: 'Flex', color: 'Vermelho', km: 12000, price: 70000 },
  { name: 'HB20', brand: 'Hyundai', year: 2022, gas: 'Flex', color: 'Azul', km: 8000, price: 78000 },
  { name: 'Compass', brand: 'Jeep', year: 2020, gas: 'Diesel', color: 'Cinza', km: 18000, price: 135000 },
  { name: 'Renegade', brand: 'Jeep', year: 2019, gas: 'Flex', color: 'Verde', km: 25000, price: 95000 },
  { name: 'Fiesta', brand: 'Ford', year: 2017, gas: 'Gasolina', color: 'Amarelo', km: 40000, price: 38000 },
  { name: 'Sandero', brand: 'Renault', year: 2018, gas: 'Flex', color: 'Branco', km: 30000, price: 42000 },
  { name: 'Cruze', brand: 'Chevrolet', year: 2021, gas: 'Gasolina', color: 'Preto', km: 10000, price: 99000 }
];

async function insertCars() {

  try {
    for (const car of carsToInsert) {
      await cars.create(car);
      console.log(`Carro ${car.name} inserido.`);
    }
    console.log('Todos os carros foram inseridos com sucesso.');
  } catch (error) {
    console.error('Erro ao inserir carros:', error);
  }
}

insertCars();
