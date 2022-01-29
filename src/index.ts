import { fastify } from "fastify";
import { CarPriceController, ExternalPriceService, ICarPriceRequest } from "./prices";


const HOST = process.env.HOST || '127.0.0.1';
const PORT = process.env.PORT || 4000;
const server = fastify();

server.get<ICarPriceRequest>('/prices/:numberPlate', async (req, _reply) => {
    const numberPlate = req.params.numberPlate;
    const carPriceController = new CarPriceController(new ExternalPriceService('GBP'));

    return carPriceController.getPrice(numberPlate);
});

server.listen(PORT, HOST, () => {
    console.log(`Server running at http://${HOST}:${PORT}`);
});