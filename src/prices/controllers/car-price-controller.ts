import { CacheContainer, IStorage } from "node-ts-cache";
import { Inject, Service } from "typedi";
import { ICarPrice } from "../models";
import { ExternalPriceService } from "../services";
@Service()
export class CarPriceController {

    private requestInFlight: { numberPlate: string; expectedResult: Promise<string> }[] = [];
    private longTermCache: CacheContainer;


    constructor(@Inject('price-service') private externalPriceService: ExternalPriceService,
        @Inject('cache-storage') cacheStorage: IStorage,
        @Inject('cache-ttl') private cacheTTL: number,
        @Inject('uuid-generator') private generator: () => string) {
        this.longTermCache = new CacheContainer(cacheStorage);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async getPrice(numberPlate: string, skipCacheForRead = true): Promise<ICarPrice> {
        if (skipCacheForRead) {
            return this.callExternalService(numberPlate);
        } else {
            //First check perm cache
            const permCacheValue = await this.longTermCache.getItem<string>(numberPlate);

            if (permCacheValue) {
                return this.getReponseFromPrice(permCacheValue);
            } else {
                //Then we check if the request is already in flight
                let inFlightItem = this.findRequestsInFlight(numberPlate);
                if (inFlightItem) { //We have another request in Flight
                    return this.getReponseFromPrice(await inFlightItem);
                } else {
                    return this.callExternalService(numberPlate);
                }
            }
        }
    }

    private async callExternalService(numberPlate: string): Promise<ICarPrice> {
        let externalServiceCall = this.externalPriceService.getExternalPrice(numberPlate);
        const index = this.requestInFlight.push({
            numberPlate,
            expectedResult: externalServiceCall
        });
        let evaluatedPrice = await externalServiceCall;
        this.longTermCache.setItem(numberPlate, evaluatedPrice, { ttl: this.cacheTTL });
        this.requestInFlight.splice(index, 1); //Remove from in Flight
        return this.getReponseFromPrice(evaluatedPrice);
    }

    private getReponseFromPrice(price: string): ICarPrice {
        return {
            uid: this.generator(),
            price: price
        };
    }

    private findRequestsInFlight(numberPlate: string): Promise<string> | undefined {
        return this.requestInFlight.find(r => r.numberPlate === numberPlate)?.expectedResult;
    }
}