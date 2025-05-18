import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "../entities/User";
import { AppDataSource } from "../data-source";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      const userRepository = AppDataSource.getRepository(User);

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
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  const user = await AppDataSource.getRepository(User).findOneBy({ id });
  done(null, user);
});

export default passport;
