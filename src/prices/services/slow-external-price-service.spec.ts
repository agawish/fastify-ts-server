import { SlowExtrernalPriceService } from ".";

describe('External Slow Price Service test', () => {

    beforeEach(() => jasmine.clock().install());

    afterEach(() => jasmine.clock().uninstall());

    it('Should return value after specific timeout', async () => {
        const moneyFormatter = Intl.NumberFormat('en-GB', {
            style: 'currency',
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
            currency: 'USD'
        });
        const service = new SlowExtrernalPriceService(moneyFormatter, 1_000);
        const result = service.getExternalPrice("ABC");
        jasmine.clock().tick(1_000);
        await expectAsync(result).toBeResolvedTo("US$60,000");
    });

    it('Should return price in GBP when instructed', async () => {
        const moneyFormatter = Intl.NumberFormat('en-GB', {
            style: 'currency',
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
            currency: 'GBP'
        });
        const service = new SlowExtrernalPriceService(moneyFormatter, 1_000);
        const result = service.getExternalPrice("ABC");
        jasmine.clock().tick(1_000);
        await expectAsync(result).toBeResolvedTo("£60,000");
    });

    it('Should return 200,000 when using the Plate AB12CDE', async () => {
        const moneyFormatter = Intl.NumberFormat('en-GB', {
            style: 'currency',
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
            currency: 'GBP'
        });
        const service = new SlowExtrernalPriceService(moneyFormatter, 1_000);
        const result = service.getExternalPrice("AB12CDE");
        jasmine.clock().tick(1_000);
        await expectAsync(result).toBeResolvedTo("£200,000");
    });

});