import 'reflect-metadata';
import { fastify } from "fastify";
import Container from "typedi";
import { CarPriceController, ExternalPriceService, ICarPriceRequest } from "./prices";
import { randomUUID } from 'crypto';

import cluster from 'cluster';
import { cpus } from 'os';
import { NodeFsStorage } from 'node-ts-cache-storage-node-fs';

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
    Container.set('cache-storage', new NodeFsStorage(`${__dirname}/db/prices.json`));
    Container.set('cache-ttl', 60 * 60); //1 hour
    Container.set('price-service', externalPriceService);

    const carPriceController = Container.get(CarPriceController);

  // Routes
  server.get<ICarPriceRequest>('/prices/:numberPlate', async (req) => {
    const { numberPlate } = req.params;

        return carPriceController.getPrice(numberPlate, false);
    });
    //Server
    server.listen(PORT, HOST, () => {
        console.log(`Worker server running on Process:${process.pid} at http://${HOST}:${PORT}`);
    });
}


if (cluster.isPrimary) {
    console.log(`Primary Process: ${process.pid} is running`);

    for (let i = 0; i < cpus().length; i++) {
        cluster.fork();
    }
} else {
    main().catch(err => {
        console.error(err);
    });
};