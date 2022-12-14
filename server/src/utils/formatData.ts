import { TMedia } from '@/dtos/posts.dto'
import { ConversationFormatInterface } from '@/interfaces/conversations.interface'
import { MessageFormatInterface } from '@/interfaces/messages.interface'
import { CommentFormat, PostFormat } from '@/interfaces/posts.interface'
import { StoryFormat } from '@/interfaces/stories.interface'
import { User } from '@/interfaces/users.interface'

const formatFollow = (user: User) => {
  return {
    user_id: user._id,
    email: user.email,
    full_name: user.full_name,
    avatar_url: user.avatar_url,
    cover_url: user.cover_url,
    bio: user.bio,
    websites: user.websites,
    gender: user.gender,
    phone_number: user.phone_number,
    date_of_birth: user.date_of_birth,
    followers: user.followers,
    following: user.following,
    created_at: user.created_at,
    updated_at: user.updated_at
  }
}
const formatMedia = (media: TMedia) => {
  return {
    media_id: media._id,
    url: media.url,
    is_video: media.is_video,
    created_at: media.created_at
  }
}
export const formatComment = (comment: CommentFormat) => {
  return {
    comment_id: comment._id,
    comment: comment.comment,
    commented_by: formatUser(comment.commented_by),
    created_at: comment.created_at
  }
}
export const formatUser = (user: User) => {
  return {
    user_id: user._id,
    email: user.email,
    full_name: user.full_name,
    avatar_url: user.avatar_url,
    cover_url: user.cover_url,
    bio: user.bio,
    websites: user.websites,
    gender: user.gender,
    phone_number: user.phone_number,
    date_of_birth: user.date_of_birth,
    followers: user.followers.map(user => formatFollow(user)),
    following: user.following.map(user => formatFollow(user)),
    created_at: user.created_at,
    updated_at: user.updated_at
  }
}
export const formatPost = (post: PostFormat) => {
  return {
    post_id: post._id,
    message: post.message,
    medias: post.medias.map(media => formatMedia(media)),
    posted_by: formatUser(post.posted_by),
    reactions: post.reactions.map(reaction => ({reacted_by: formatUser(reaction.reacted_by)})),
    comments: post.comments.map(comment => formatComment(comment as unknown as CommentFormat)),
    created_at: post.created_at,
    updated_at: post.updated_at
  }
}
export const formatStories = (story: StoryFormat) => {
  return {
    story_id: story._id,
    medias: story.medias.map(media => formatMedia(media)),
    posted_by: formatUser(story.posted_by),
    created_at: story.created_at,
    updated_at: story.updated_at
  }
}
export const formatMessage = (message: MessageFormatInterface) => {
  return {
    message_id: message._id,
    message: message.message,
    status: message.status,
    type: message.type,
    sent_by: formatUser(message.sent_by)
  }
}
export const formatConversation = (conversation: ConversationFormatInterface) => {
  return {
    conversation_id: conversation._id,
    last_message: formatMessage(conversation.last_message),
    user: formatUser(conversation.user),
    created_at: conversation.created_at,
    updated_at: conversation.updated_at
  }
}
