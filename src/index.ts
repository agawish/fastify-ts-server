import 'reflect-metadata';
import { fastify } from "fastify";
import Container from "typedi";
import { CarPriceController, ExternalPriceService, ICarPriceRequest } from "./prices";
import { randomUUID } from 'crypto';

const main = async () => {

    const HOST = process.env.HOST || '127.0.0.1';
    const PORT = process.env.PORT || 4000;
    const server = fastify();

    //Dependency Injection definitions
    const moneyFormatter = Intl.NumberFormat('en-GB', {
        style: 'currency',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
        currency: 'GBP'
    });

    Container.set('money-formatter', moneyFormatter);
    Container.set('timeout', 6_000); //Change to 6 seconds to test slow external service
    const externalPriceService = Container.get<ExternalPriceService>('slow-price-service');
    Container.set('uuid-generator', randomUUID);
    Container.set('price-service', externalPriceService);

    const carPriceController = Container.get(CarPriceController);


    //Routes
    server.get<ICarPriceRequest>('/prices/:numberPlate', async (req, _reply) => {
        const numberPlate = req.params.numberPlate;

        return carPriceController.getPrice(numberPlate, false);
    });


    //Server
    server.listen(PORT, HOST, () => {
        console.log(`Server running at http://${HOST}:${PORT}`);
    });

}

main().catch(err => {
    console.error(err);
});