import { Inject, Service } from "typedi";
import { ICarPrice } from "../models";
import { ExternalPriceService } from "../services";

@Service()
export class CarPriceController {

    constructor(@Inject('default-price-service') private externalPriceService: ExternalPriceService, @Inject('uuid-generator') private generator: () => string) { }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async getPrice(numberPlate: string, _skipCacheForRead = true): Promise<ICarPrice> {
        return {
            uid: this.generator(),
            price: await this.externalPriceService.getExternalPrice(numberPlate)
        }
    }
}