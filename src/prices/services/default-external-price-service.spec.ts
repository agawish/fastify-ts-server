import 'reflect-metadata';
import { DefaultExternalPriceService } from '.';



describe('External Price Service test', () => {

    it('Should return price in USD when instructed', async () => {
        const moneyFormatter = Intl.NumberFormat('en-GB', {
            style: 'currency',
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
            currency: 'USD'
        });
        const service = new DefaultExternalPriceService(moneyFormatter);
        const result = await service.getExternalPrice("ABC");
        expect(result).toEqual("US$60,000");
    });

    it('Should return price in GBP when instructed', async () => {
        const moneyFormatter = Intl.NumberFormat('en-GB', {
            style: 'currency',
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
            currency: 'GBP'
        });
        const service = new DefaultExternalPriceService(moneyFormatter);
        const result = await service.getExternalPrice("ABC");
        expect(result).toEqual("£60,000");
    });

});