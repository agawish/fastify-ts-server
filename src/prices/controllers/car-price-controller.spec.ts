import { randomUUID } from "crypto";
import { CarPriceController } from ".";
import { ExternalPriceService } from '..';

describe('Car Price Controller', () => {

    class FakeExternalService implements ExternalPriceService {
        getExternalPrice(_numberPlate: string): Promise<string> {
            return Promise.resolve('60,000');
        }
    }

    it('Should return price and a unique UUID in GBP when instructed', async () => {
        const controller = new CarPriceController(new FakeExternalService(), () => "1234");
        await expectAsync(controller.getPrice("ABC")).toBeResolvedTo({
            uid: "1234",
            price: '60,000'
        });
    });

});