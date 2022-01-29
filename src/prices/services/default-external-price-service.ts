
import { Inject, Service } from "typedi";
import { ExternalPriceService } from "./external-price-service";

@Service({ id: 'default-price-service' })
export class DefaultExternalPriceService implements ExternalPriceService {
    constructor(@Inject('money-formatter') private moneyFormatter: Intl.NumberFormat) { }

    getExternalPrice(numberPlate: string): Promise<string> {
        if (numberPlate === 'AB12CDE') {
            return Promise.resolve(this.moneyFormatter.format(200_000));
        } else {
            return Promise.resolve(this.moneyFormatter.format(60_000));
        }
    }
}