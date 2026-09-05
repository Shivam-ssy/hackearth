import { IsNotEmpty, IsString } from "class-validator";

export class CreateHackthonDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    description: string;

    @IsString()
    startDate: Date;

    @IsString()
    endDate: Date;
}
