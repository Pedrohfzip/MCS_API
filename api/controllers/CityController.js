import Cities from '../database/models/City.js';

const CityController = {
    async getAllCitys(req, res) {
        try {
            const response = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/municipios?orderBy=nome')
            // const cities = await Cities.findAll();
            console.log('Cidades encontradas:', response);
            // return res.status(200).json(cities);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao buscar dados do IBGE', details: error.message });
        }
    },
}


export default CityController;