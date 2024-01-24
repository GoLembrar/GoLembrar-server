import { ApiProperty } from "@nestjs/swagger";

export class OkResponseModel {
    @ApiProperty()
    token: string;
}