"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const User_1 = require("../entities/User");
const data_source_1 = require("../data-source");
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback",
}, async (accessToken, refreshToken, profile, done) => {
    const userRepository = data_source_1.AppDataSource.getRepository(User_1.User);
    let user = await userRepository.findOne({ where: { googleId: profile.id } });
    if (!user) {
        user = userRepository.create({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails?.[0].value,
        });
        await userRepository.save(user);
    }
    return done(null, user);
}));
passport_1.default.serializeUser((user, done) => {
    done(null, user.id);
});
passport_1.default.deserializeUser(async (id, done) => {
    const user = await data_source_1.AppDataSource.getRepository(User_1.User).findOneBy({ id });
    done(null, user);
});
exports.default = passport_1.default;
