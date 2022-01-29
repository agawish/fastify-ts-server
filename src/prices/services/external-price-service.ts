import { Service } from "typedi";

@Service()
export class ExternalPriceService {
    moneyFormatter;

    constructor(currency: string) {
        this.moneyFormatter = Intl.NumberFormat('en-GB', {
            style: 'currency',
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
            currency: currency
        });
    }

    async getExternalPrice(numberPlate: string): Promise<string> {
        if (numberPlate === 'AB12CDE') {
            return new Promise((resolve, _reject) => resolve(this.moneyFormatter.format(200_000)));
        } else {
            return new Promise((resolve, _reject) => resolve(this.moneyFormatter.format(70_000)));
        }
    }
}