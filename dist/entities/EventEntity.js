"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventEntity = void 0;
const typeorm_1 = require("typeorm");
const Society_1 = require("./Society");
const User_1 = require("./User");
const Registration_1 = require("./Registration");
const Announcement_1 = require("./Announcement");
let EventEntity = class EventEntity extends typeorm_1.BaseEntity {
};
exports.EventEntity = EventEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], EventEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], EventEntity.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], EventEntity.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)('timestamp'),
    __metadata("design:type", Date)
], EventEntity.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Society_1.Society, society => society.events),
    __metadata("design:type", Society_1.Society)
], EventEntity.prototype, "society", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User, user => user.events),
    __metadata("design:type", User_1.User)
], EventEntity.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Registration_1.Registration, registration => registration.event),
    __metadata("design:type", Array)
], EventEntity.prototype, "registrations", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Announcement_1.Announcement, announcement => announcement.event),
    __metadata("design:type", Array)
], EventEntity.prototype, "announcements", void 0);
exports.EventEntity = EventEntity = __decorate([
    (0, typeorm_1.Entity)()
], EventEntity);
