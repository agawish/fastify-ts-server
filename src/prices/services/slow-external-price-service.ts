import { Inject, Service } from "typedi";
import { ExternalPriceService } from ".";

@Service({ id: 'slow-price-service' })
export class SlowExtrernalPriceService implements ExternalPriceService {

    constructor(@Inject('money-formatter') private moneyFormatter: Intl.NumberFormat, @Inject('timeout') private timeoutPeriod: number) { }

    async getExternalPrice(numberPlate: string): Promise<string> {
        if (numberPlate === 'AB12CDE') {
            return this.returnAfterTimeout(this.moneyFormatter.format(200_000));
        } else {
            return this.returnAfterTimeout(this.moneyFormatter.format(60_000));
        }
    }

    private returnAfterTimeout(value: string): Promise<string> {
        return new Promise((resolve) => setTimeout(() => resolve(value), this.timeoutPeriod));
    }

}