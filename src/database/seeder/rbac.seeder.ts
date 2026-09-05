import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Role } from "../../role/schemas/role.schema.js";
import { Permission } from "../../permission/schemas/permission.schema.js";
import { User } from "../../user/entities/user.entity.js";
import bycrypt from "bcrypt";

const DEFAULT_PERMISSIONS = [
    { key: 'user:create', description: 'Create users' },
    { key: 'user:read', description: 'View users' },
    { key: 'user:update', description: 'Update users' },
    { key: 'user:delete', description: 'Delete users' },
    { key: 'hackathon:create', description: 'Create hackathons' },
    { key: 'hackathon:read', description: 'View hackathons' },
    { key: 'hackathon:update', description: 'Update hackathons' },
    { key: 'hackathon:join', description: 'Join hackathons' },
    { key: 'hackathon:leave', description: 'Leave hackathons' },
    { key: 'hackathon:delete', description: 'Delete hackathons' },
];

const DEFAULT_ROLES = [
    { name: 'admin', permissionKeys: DEFAULT_PERMISSIONS.map((p) => p.key) }, // all
    { name: 'organizer', permissionKeys: ['hackathon:create', 'hackathon:read'] },
    { name: 'user', permissionKeys: ['hackathon:read', 'hackathon:join', 'hackathon:leave'] },
];

@Injectable()
export class RbacSeeder implements OnModuleInit {
    private readonly logger = new Logger(RbacSeeder.name);
    private readonly password = 'password123'; // Default password for seeded users

    constructor(
        @InjectModel(Role.name) private readonly roleModel: Model<Role>,
        @InjectModel(Permission.name) private readonly permissionModel: Model<Permission>,
        @InjectModel(User.name) private readonly userModel: Model<User>,
    ) { }


    async onModuleInit() {
        // Implementation for seeding RBAC data
        await this.seedPermissions();
        await this.seedRoles();
        await this.seedUsers();
        await this.seedAdminUser();
        await this.seedOrganizers();
    }

    private async seedPermissions() {
        for (const perm of DEFAULT_PERMISSIONS) {
            await this.permissionModel.updateOne(
                { key: perm.key },
                { $setOnInsert: perm },
                { upsert: true }
            );
        }
        this.logger.log('Default permissions seeded successfully.');
    }

    private async seedRoles() {
        for (const role of DEFAULT_ROLES) {
            const permissionDocs = await this.permissionModel.find({ key: { $in: role.permissionKeys } });
            const existing = await this.roleModel.findOne({ name: role.name });

            if (!existing) {
                await this.roleModel.create({
                    name: role.name,
                    permissions: permissionDocs.map((p) => p._id),
                });
            } else {
                existing.permissions = permissionDocs.map((p) => p._id);
                await existing.save();
            }
        }
        this.logger.log('Roles seeded');

    }
    private async seedUsers() {
        for (let i = 0; i < 5; i++) {
            const userRoleId = await this.roleModel.findOne({ name: 'user' }).select('_id');
            await this.userModel.updateOne(
                { email: `user${i + 1}@example.com` },
                {
                    $set: {
                        name: `User ${i + 1}`,
                        email: `user${i + 1}@example.com`,
                        password: await bycrypt.hash(this.password, 10),
                        roles: [userRoleId],
                    }
                },
                { upsert: true }
            );
        }
    }
    private async seedAdminUser() {
        const adminRoleId = await this.roleModel.findOne({ name: 'admin' }).select('_id');
        await this.userModel.updateOne(
            { email: 'admin@example.com' },
            {
                $set: {
                    name: 'Admin',
                    email: 'admin@example.com',
                    password: await bycrypt.hash(this.password, 10),
                    roles: [adminRoleId],
                }
            },
            { upsert: true }
        );
    }
    private async seedOrganizers() {
        for (let i = 0; i < 5; i++) {
            const userRoleId = await this.roleModel.findOne({ name: 'organizer' }).select('_id');
            await this.userModel.updateOne(
                { email: `organizer${i + 1}@example.com` },
                {
                    $set: {
                        name: `Organizer ${i + 1}`,
                        email: `organizer${i + 1}@example.com`,
                        password: await bycrypt.hash(this.password, 10),
                        roles: [userRoleId],
                    }
                },
                { upsert: true }
            );
        }
    }
}