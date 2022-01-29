import { Inject, Service } from "typedi";
import { ICarPrice } from "../models";
import { ExternalPriceService } from "../services";

@Service()
export class CarPriceController {

    constructor(@Inject('price-service') private externalPriceService: ExternalPriceService,
        @Inject('uuid-generator') private generator: () => string) { }

    async getPrice(numberPlate: string, _skipCacheForRead = true): Promise<ICarPrice> {
        return {
            uid: this.generator(),
            price: await this.externalPriceService.getExternalPrice(numberPlate)
        }
    }
}