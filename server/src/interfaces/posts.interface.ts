
export interface Post {
	_id: string
	message: string
	medias: [{
			url: string,
			isVideo: boolean
	}]
	reactions: [{
		type: number,
		reacted_by: string
	}]
	comments: [{
		comment: string,
		commented_by: string,
		created_at: Date
	}]
	posted: string
	created_at: Date
	updated_at: Date
}
