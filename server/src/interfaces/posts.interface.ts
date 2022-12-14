import { TMedia } from '@/dtos/posts.dto'
import { User } from './users.interface'

export interface Post {
	_id: string
	message: string
	medias: TMedia[]
	reactions: [{
		reacted_by: string
	}]
	comments: Comment[]
	posted_by: string
	tags: []
	created_at: Date
	updated_at: Date
}
export interface PostFormat {
	_id: string
	message: string
	medias: TMedia[]
	reactions: [{
		reacted_by: User
	}]
	comments: CommentFormat[]
	posted_by: User
	tag: [String]
	created_at: Date
	updated_at: Date
}
export interface Comment {
	comment: string,
	commented_by: string
}
export interface CommentFormat {
	_id: string
	comment: string
	commented_by: User
	created_at: Date
}
export interface Reaction {
	type: number,
	reacted_by: string
}
