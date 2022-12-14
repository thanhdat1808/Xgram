import { model, Schema, Document } from 'mongoose'
import { Post } from '@interfaces/posts.interface'

const postSchema: Schema = new Schema({
	message: {
		type: String
	},
	medias: {
		type: [{
			url: {
				type: String
			},
			is_video: {
				type: Boolean
			}
		}
		]
	},
	reactions: {
		type: [{
			reacted_by: {
				type: Schema.Types.ObjectId,
				ref: 'User'
			}
		}]
	},
	comments: {
		type: [{
			type: Schema.Types.ObjectId,
			ref: 'Comment'
		}]
	},
	posted_by: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		require: true
	},
	tags: {
		type: [String]
	},
	created_at: {
		type: Date,
		default: Date.now
	},
	updated_at: {
		type: Date,
		default: Date.now
	}
})

const postModel = model<Post & Document>('Post', postSchema)

export default postModel
