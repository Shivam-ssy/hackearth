import { PartialType } from '@nestjs/mapped-types';
import { CreateHackthonDto } from './create-hackthon.dto.js';

export class UpdateHackthonDto extends PartialType(CreateHackthonDto) {}
