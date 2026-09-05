import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateHackthonDto } from './dto/create-hackthon.dto.js';
import { UpdateHackthonDto } from './dto/update-hackthon.dto.js';
import { InjectModel } from '@nestjs/mongoose';
import { Hackthon } from './entities/hackthon.entity.js';
import { Model, Types } from 'mongoose';
import type { UserDocument } from '../user/schemas/user.schema.js';
@Injectable()
export class HackthonService {

  constructor(
    @InjectModel(Hackthon.name) private readonly hackthonModel: Model<Hackthon>,
  ) { }
  async create(createHackthonDto: CreateHackthonDto, user: UserDocument) {
    const newHackthon = new this.hackthonModel({
      ...createHackthonDto,
      createdBy: user._id,
    });
    return await newHackthon.save();
  }

  async findAll(user: UserDocument, page: string = '1', limit: string = '10') {
    const roles = (user.roles as any[]) || [];
    const isAdmin = roles.some((role) => role.name === 'admin' || role.name === 'user');

    // Admin and users sees all hackathons; Organizer sees only hackathons created by them
    const filter = isAdmin ? {} : { createdBy: user._id };

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    return await this.hackthonModel
      .find(filter)
      .skip(skip)
      .limit(limitNum)
      .exec();
  }

  findOne(id: string) {
    return this.hackthonModel.findById(id).exec();
  }

  async update(id: string, updateHackthonDto: UpdateHackthonDto, user: UserDocument) {
    const hackathon: any = await this.hackthonModel.findById(id).exec();
    if (!hackathon) {
      throw new NotFoundException('Hackthon not found');
    }
    if (hackathon.createdBy.toString() !== user._id.toString()) {
      throw new UnauthorizedException('You are not authorized to update this hackathon');
    }
    return await this.hackthonModel.findByIdAndUpdate(id, updateHackthonDto, { new: true }).exec();
  }

  remove(id: string) {
    return this.hackthonModel.findByIdAndDelete(id).exec();
  }

  // for students 
  async join(hackathonId: string, user: UserDocument) {
    const hackathon: any = await this.hackthonModel.findById(hackathonId);
    if (!hackathon) {
      throw new NotFoundException('Hackthon not found');
    }
    if (hackathon.participants.includes(user._id)) {
      throw new ConflictException('You have already joined this hackathon');
    }
    hackathon.participants.push(new Types.ObjectId(user._id));
    return hackathon.save();
  }
  async leave(hackathonId: string, user: UserDocument) {
    const hackathon: any = await this.hackthonModel.findById(hackathonId);
    if (!hackathon) {
      throw new NotFoundException('Hackthon not found');
    }
    if (!hackathon.participants.includes(user._id)) {
      throw new ConflictException('You have not joined this hackathon');
    }
    hackathon.participants.pull(user._id);
    return hackathon.save();
  }
  async getAllParticipants(hackathonId: string, user: UserDocument) {
    const hackathon: any = await this.hackthonModel.findById(hackathonId).populate('participants');
    if (!hackathon) {
      throw new NotFoundException('Hackthon not found');
    }
    if (hackathon.createdBy.toString() === user._id.toString() || hackathon.participants.includes(user._id)) {
      return hackathon.participants;
    }
    throw new UnauthorizedException('You are not authorized to view participants');
  }
  async getMyHackathons(user: UserDocument) {
    return await this.hackthonModel.find({ participants: user._id }).exec();
  }
}
