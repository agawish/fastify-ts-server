import { DefaultExternalPriceService } from '.';

describe('External Default Price Service test', () => {

    it('Should return price in USD when instructed', async () => {
        const moneyFormatter = Intl.NumberFormat('en-GB', {
            style: 'currency',
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
            currency: 'USD'
        });
        const service = new DefaultExternalPriceService(moneyFormatter);
        await expectAsync(service.getExternalPrice("ABC")).toBeResolvedTo("US$60,000");
    });

    it('Should return price in GBP when instructed', async () => {
        const moneyFormatter = Intl.NumberFormat('en-GB', {
            style: 'currency',
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
            currency: 'GBP'
        });
        const service = new DefaultExternalPriceService(moneyFormatter);
        await expectAsync(service.getExternalPrice("ABC")).toBeResolvedTo("£60,000");
    });

    it('Should return 200,000 when using the Plate AB12CDE', async () => {
        const moneyFormatter = Intl.NumberFormat('en-GB', {
            style: 'currency',
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
            currency: 'GBP'
        });
        const service = new DefaultExternalPriceService(moneyFormatter);
        await expectAsync(service.getExternalPrice("AB12CDE")).toBeResolvedTo("£200,000");
    });

});