// import { ExternalPriceService } from './external-price-service';

import { ExternalPriceService } from ".";

describe('External Price Service test', () => {

    it('Should return price in USD when instructed', () => {
        const service = new ExternalPriceService("USD");
        service.getExternalPrice("ABC").then((result) => {
            expect(result).toEqual("US$60,000");
        });
    });

    it('Should return price in GBP when instructed', () => {
        const service = new ExternalPriceService("GBP");
        service.getExternalPrice("ABC").then((result) => {
            expect(result).toEqual("£60,000");
        });
    });

});