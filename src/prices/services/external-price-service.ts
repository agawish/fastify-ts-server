export interface ExternalPriceService {
    getExternalPrice(numberPlate: string): Promise<string>;
}