import { model, Schema, Document } from 'mongoose';
import { Post } from '@interfaces/posts.interface';

const postSchema: Schema = new Schema({
  message: {
    type: String
  },
  medias: {
		type: [{
			url: {
				type: String
			},
			isVideo: {
				type: Boolean
			}
		}
		]
  },
	reactions: {
		type: [{
			type: {
				type: Number
			},
			reacted_by: {
				type: Schema.Types.ObjectId,
				ref: 'User'
			}
		}]
	},
	comments: {
		type: [{
			comment: {
				type: String
			},
			commented_by: {
				type: Schema.Types.ObjectId,
				ref: 'User'
			},
			created_at: {
				type: Date,
				default: Date.now
			}
		}]
	},
	posted: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		require: true
	},
	created_at: {
		type: Date,
		default: Date.now
	},
	updated_at: {
		type: Date,
		default: Date.now
	}
});

const postModel = model<Post & Document>('Post', postSchema);

export default postModel;
