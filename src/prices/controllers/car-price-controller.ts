import { randomUUID } from "crypto";
import { Inject, Service } from "typedi";
import { ICarPrice } from "../models";
import { ExternalPriceService } from "../services";

@Service()
export class CarPriceController {

    constructor(@Inject('default-price-service') private externalPriceService: ExternalPriceService) {} 

    async getPrice(numberPlate: string, _skipCacheForRead = true): Promise<ICarPrice> {
        return {
            uid: randomUUID(),   
            price: await this.externalPriceService.getExternalPrice(numberPlate)
        }
    }    
}