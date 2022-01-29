import { CarPriceController } from ".";
import { ExternalPriceService } from '..';

fdescribe('Car Price Controller', () => {

    class FakeExternalService implements ExternalPriceService {
        getExternalPrice(_numberPlate: string): Promise<string> {
            return Promise.resolve('60,000');
        }
    }

    it('Should return price and a unique UUID in GBP when instructed', async () => {
        const service = new CarPriceController(new FakeExternalService());
        const result = await service.getPrice("ABC");
        expect(result.price).toEqual("60,000");
        expect(result.uid).toBeDefined();
    });

});