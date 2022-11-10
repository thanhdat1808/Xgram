
export interface Post {
	_id: string
	message: string
	medias: [{
		url: string,
		isVideo: boolean
	}]
	reactions: [{
		like: boolean,
		reacted_by: string
	}]
	comments: Comment[]
	posted: string
	created_at: Date
	updated_at: Date
}

export interface Comment {
	comment: string,
	commented_by: string
}
