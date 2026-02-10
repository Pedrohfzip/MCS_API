import Cities from '../database/models/City.js';

const CityController = {
    async getAllCitys(req, res) {
        try {
            const response = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/municipios?orderBy=nome');
            if (!response.ok) {
                return res.status(500).json({ error: 'Erro ao buscar dados do IBGE' });
            }
            const cities = await response.json();
            cities.forEach(async (city) => {
                await Cities.create({
                    city: city.nome,
                    state: city['regiao-imediata']['regiao-intermediaria']['UF']['nome']
                });
            });
            // cities.forEach(async (city) => {
            //     console.log(city.nome, city['regiao-imediata']['regiao-intermediaria']['UF']['nome'])
            //     console.log(city)
            // });
            return res.status(200).json(cities);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao buscar dados do IBGE', details: error.message });
        }
    },
}


export default CityController;