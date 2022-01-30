import { Inject, Service } from "typedi";
import { ICarPrice } from "../models";
import { ExternalPriceService } from "../services";

@Service()
export class CarPriceController {

    private requestInFlight: { numberPlate: string; expectedResult: Promise<string> }[] = [];

    constructor(@Inject('price-service') private externalPriceService: ExternalPriceService,
        @Inject('uuid-generator') private generator: () => string) { }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async getPrice(numberPlate: string, skipCacheForRead = true): Promise<ICarPrice> {

        if (skipCacheForRead) {
            return this.callExternalService(numberPlate);
        } else {
            //Check if the request is already in flight
            const cachedItem = this.findRequestsInFlightOrCached(numberPlate);
            if (cachedItem !== undefined) { //We have another request in Flight
                return this.getReponseFromPrice(cachedItem);
            } else {
                return this.callExternalService(numberPlate);
            }
        }
    }

    private callExternalService(numberPlate: string): Promise<ICarPrice> {
        const externalServiceCall = this.externalPriceService.getExternalPrice(numberPlate);
        this.requestInFlight.push({
            numberPlate,
            expectedResult: externalServiceCall
        });
        return this.getReponseFromPrice(externalServiceCall);
    }

    private async getReponseFromPrice(price: Promise<string>): Promise<ICarPrice> {
        return {
            uid: this.generator(),
            price: await price
        };
    }

    private findRequestsInFlightOrCached(numberPlate: string): Promise<string> | undefined {
        return this.requestInFlight.find(r => r.numberPlate === numberPlate)?.expectedResult;
    }
}