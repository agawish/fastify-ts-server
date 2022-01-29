import { RequestGenericInterface } from "fastify";

export interface ICarPrice {
    uid: string,
    price: string
}

export interface ICarPriceRequest extends RequestGenericInterface {
    Params: {
        numberPlate: string
    }
}
