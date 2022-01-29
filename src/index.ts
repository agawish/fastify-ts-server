import 'reflect-metadata';
import { fastify } from "fastify";
import Container from "typedi";
import { CarPriceController, ICarPriceRequest } from "./prices";

const main = async () => {

    const HOST = process.env.HOST || '127.0.0.1';
    const PORT = process.env.PORT || 4000;
    const server = fastify();

    const moneyFormatter = Intl.NumberFormat('en-GB', {
        style: 'currency',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
        currency: 'GBP'
    });
    Container.set('money-formatter', moneyFormatter);
    const carPriceController = Container.get(CarPriceController);


    server.get<ICarPriceRequest>('/prices/:numberPlate', async (req, _reply) => {
        const numberPlate = req.params.numberPlate;

        return carPriceController.getPrice(numberPlate);
    });

    server.listen(PORT, HOST, () => {
        console.log(`Server running at http://${HOST}:${PORT}`);
    });

}

main().catch(err => {
    console.error(err);
});