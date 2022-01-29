import { CarPriceController } from ".";
import { ExternalPriceService } from "..";

describe('Car Price Controller', () => {

    it('Should return price and a unique UUID in GBP when instructed', () => {
        const service = new CarPriceController(new ExternalPriceService("GBP"));
        service.getPrice("ABC").then((result) => {
            expect(result.price).toEqual("£60,000");
            expect(result.uid).toBeDefined();
        });
    });

    it('Should return price and a unique UUID in USD when instructed', () => {
        const service = new CarPriceController(new ExternalPriceService("USD"));
        service.getPrice("ABC").then((result) => {
            expect(result.price).toEqual("US$60,000");
            expect(result.uid).toBeDefined();
        });
    });

});