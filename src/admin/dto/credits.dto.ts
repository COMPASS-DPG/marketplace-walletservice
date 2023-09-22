import { IsInt, IsNotEmpty } from "class-validator";


export class CreditsDto {

    // End user ID
    @IsNotEmpty()
    @IsInt()
    userId: number;

    // Number of credits transferred
    @IsInt()
    credits: number;
}