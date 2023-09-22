import { IsInt, IsNotEmpty } from "class-validator";


export class PurchaseDto {

    // Third party course provider ID
    @IsNotEmpty()
    @IsInt()
    providerId: number;

    // Number of credits involved in purchase
    @IsInt()
    credits: number;
}