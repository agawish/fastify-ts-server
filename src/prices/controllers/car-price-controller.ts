import { randomUUID } from "crypto";
import { ICarPrice } from "../models";
import { ExternalPriceService } from "../services";

export class CarPriceController {

    constructor(private readonly externalPriceService: ExternalPriceService) {
        this.externalPriceService = externalPriceService;
    }

    async getPrice(numberPlate: string, _skipCacheForRead = true): Promise<ICarPrice> {
        return {
            uid: randomUUID(),   
            price: await this.externalPriceService.getExternalPrice(numberPlate)
        }
    }    
}