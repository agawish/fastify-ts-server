import { MemoryStorage } from "node-ts-cache-storage-memory";
import { CarPriceController } from ".";
import { ExternalPriceService } from '..';

describe('Car Price Controller', () => {
    const timeout = 4_000; // 4 seconds

    class FakeExternalService implements ExternalPriceService {
        getExternalPrice(_numberPlate: string): Promise<string> {
            return Promise.resolve('60,000');
        }
    }
    class FakeExternalSlowService implements ExternalPriceService {
        getExternalPrice(_numberPlate: string): Promise<string> {
            return new Promise((res) => setTimeout(() => res('60,000'), timeout)); //Return after 4 seconds
        }
    }

    it('Should return price and a unique UUID in GBP when instructed', async () => {
        const controller = new CarPriceController(new FakeExternalService(), new MemoryStorage(), 8, () => "1234");
        await expectAsync(controller.getPrice("ABC")).toBeResolvedTo({
            uid: "1234",
            price: '60,000'
        });
    });

    it('Should return the result quickly if it is cached', async () => {
        const slowService = new FakeExternalSlowService();
        const storage = new MemoryStorage();
        spyOn(slowService, 'getExternalPrice').and.returnValue(Promise.resolve('60,000'));
        spyOn(storage, 'setItem');
        spyOn(storage, 'getItem');
        const controller = new CarPriceController(slowService, storage, 8, () => "1234");

        controller.getPrice("ABC"); //
        await expectAsync(controller.getPrice("ABC", false)).toBeResolvedTo({
            uid: "1234",
            price: '60,000'
        });
        expect(slowService.getExternalPrice).toHaveBeenCalledTimes(1);
        expect(storage.setItem).toHaveBeenCalledTimes(1);
        expect(storage.getItem).toHaveBeenCalledTimes(1);
    });


    it('Should take the same amount of time to retrieve 2 different requests asking for the same plate', async () => {
        const slowService = new FakeExternalSlowService();
        const storage = new MemoryStorage();
        spyOn(slowService, 'getExternalPrice').and.returnValue(Promise.resolve('60,000'));
        spyOn(storage, 'setItem');
        spyOn(storage, 'getItem');
        const controller = new CarPriceController(slowService, storage, 8, () => "1234");
        
        let request1 = controller.getPrice("ABC", false);
        let request2 = controller.getPrice("ABC", false);
        await expectAsync(request1).toBeResolvedTo({
            uid: "1234",
            price: '60,000'
        });
        await expectAsync(request2).toBeResolvedTo({
            uid: "1234",
            price: '60,000'
        });
        expect(slowService.getExternalPrice).toHaveBeenCalledTimes(1);
        expect(storage.setItem).toHaveBeenCalledTimes(1);
        expect(storage.getItem).toHaveBeenCalledTimes(2);
    });

});