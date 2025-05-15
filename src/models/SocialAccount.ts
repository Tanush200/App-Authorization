import { Document, Model, Schema, model } from "mongoose";

interface ISocialAccount extends Document {
  userId: Schema.Types.ObjectId;
  platform: string;
  accessToken: string;
  refreshToken?: string;
  expiresAt: Date;
  profileId?: string;
}

const SocialAccountSchema = new Schema<ISocialAccount>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  platform: { type: String, default: "linkedin" },
  accessToken: { type: String, required: true },
  refreshToken: { type: String },
  expiresAt: { type: Date },
  profileId: { type: String },
});

const SocialAccount: Model<ISocialAccount> =
  mongoose.models.SocialAccount || model("SocialAccount", SocialAccountSchema);

export default SocialAccount;
