/* eslint-disable @typescript-eslint/no-unused-vars */
import { CarPriceController } from ".";
import { ExternalPriceService } from '..';

describe('Car Price Controller', () => {
    const timeout = 4_000; // 4 seconds
    class FakeExternalService implements ExternalPriceService {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        getExternalPrice(_numberPlate: string): Promise<string> {
            return Promise.resolve('60,000');
        }
    }
    class FakeExternalSlowService implements ExternalPriceService {
        getExternalPrice(_numberPlate: string): Promise<string> {
            return new Promise((res) => setTimeout(() => res('60,000'), timeout)); //Return after 4 seconds
        }
    }

    beforeEach(() => jasmine.clock().install());

    afterEach(() => jasmine.clock().uninstall());

    it('Should return price and a unique UUID in GBP when instructed', async () => {
        const controller = new CarPriceController(new FakeExternalService(), () => "1234");
        await expectAsync(controller.getPrice("ABC")).toBeResolvedTo({
            uid: "1234",
            price: '60,000'
        });
    });

    it('Should return the result quickly if it is cached', async () => {
        const controller = new CarPriceController(new FakeExternalSlowService(), () => "1234");

        controller.getPrice("ABC"); //Caching request
        jasmine.clock().tick(4_000);
        await expectAsync(controller.getPrice("ABC", false)).toBeResolvedTo({
            uid: "1234",
            price: '60,000'
        });
    });


    it('Should return take the same amount of time to retrieve 2 different requests asking for the same plate', async () => {
        const controller = new CarPriceController(new FakeExternalSlowService(), () => "1234");

        const request1 = controller.getPrice("ABC", false);
        const request2 = controller.getPrice("ABC", false); 
        jasmine.clock().tick(4_000);
        await expectAsync(request1).toBeResolvedTo({
            uid: "1234",
            price: '60,000'
        });
        await expectAsync(request2).toBeResolvedTo({
            uid: "1234",
            price: '60,000'
        });
    });


});