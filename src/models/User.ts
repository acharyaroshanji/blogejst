import { Document, model, Model, Schema, HookNextFunction } from 'mongoose'
import gravatar from 'gravatar'
import slug from '../utils/slug'

interface IUser extends Document {
  name: string
  email: string
  username: string
  password: string
  avatar: string
  posts: any[]
  comments: any[]
  verified: boolean
  reset: boolean
}

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      unique: true,
    },
    email: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    reset: {
      type: Boolean,
      default: false,
    },
    posts: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Post',
      },
    ],
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  },
  {
    timestamps: true,
  }
)

userSchema.pre('save', function (this: IUser, next: HookNextFunction) {
  if (!this.username) {
    this.username = slug(this.email.split('@')[0] + Date.now())
  }
  if (!this.avatar) {
    this.avatar = gravatar.url(this.email, {
      s: '500',
      r: 'pg',
      d: 'mm',
    })
  }

  next()
})

const User: Model<IUser> = model<IUser>('User', userSchema)
export default User
