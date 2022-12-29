import { TMedia, TMediaStory } from '@/dtos/posts.dto'
import { ConversationInterface } from '@/interfaces/conversations.interface'
import { MessageFormatInterface } from '@/interfaces/messages.interface'
import { Notification } from '@/interfaces/notifications.interface'
import { CommentFormat, PostFormat } from '@/interfaces/posts.interface'
import { StoryFormat } from '@/interfaces/stories.interface'
import { User, UserFormat } from '@/interfaces/users.interface'

export const formatFollow = (user: User) => {
  return {
    user_id: user._id,
    email: user.email,
    user_name: user.user_name,
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
const formatStoryMedia = (media: TMediaStory) => {
  return {
    story_id: media.story_id,
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
    is_image: comment.is_image,
    commented_by: formatFollow(comment.commented_by),
    created_at: comment.created_at
  }
}
export const formatUser = (user: UserFormat) => {
  return {
    user_id: user._id,
    email: user.email,
    full_name: user.full_name,
    user_name: user.user_name,
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
    tags: post.tags,
    privacy: post.privacy,
    medias: post.medias.map(media => formatMedia(media)),
    posted_by: formatFollow(post.posted_by),
    reactions: post.reactions.map(reaction => ({reacted_by: formatFollow(reaction.reacted_by)})),
    comments: post.comments.map(comment => formatComment(comment as unknown as CommentFormat)),
    created_at: post.created_at,
    updated_at: post.updated_at
  }
}
export const formatStories = (story: StoryFormat) => {
  return {
    story_id: story._id,
    medias: story.medias.map(media => formatStoryMedia(media)),
    posted_by: formatFollow(story.posted_by),
    created_at: story.created_at,
    updated_at: story.updated_at
  }
}
export const formatMessage = (message: MessageFormatInterface) => {
  let content
  switch (message.type) {
    case 'text' ||'image'||'video'||'sticker':
      content = message.message
      break
    case 'post':
      content = message.post
      break
    case 'story':
      content = message.story
      break
    default:
      break
  }
  return {
    message_id: message._id,
    conversation_id: message.conversation_id,
    message: message.message,
    ref_data: content,
    status: message.status,
    type: message.type,
    sent_by: formatFollow(message.sent_by),
    sent_to: formatFollow(message.sent_to)
  }
}
export const formatConversation = (conversation: ConversationInterface) => {
  return {
    conversation_id: conversation._id,
    last_message: conversation.last_message ? formatMessage(conversation.last_message) : null,
    user: formatFollow(conversation.user[0]),
    created_at: conversation.created_at,
    updated_at: conversation.updated_at
  }
}
export const formatNotification = (notif: Notification) => {
  let reference
  switch (notif.type) {
    case 'react':
      reference = notif.ref_post
      break
    case 'comment':
      reference = notif.ref_comment
      break
    case 'follow':
      reference = notif.ref_user
      break
    default:
      break
  }
  return {
    notification_id: notif._id,
    type: notif.type,
    user: notif.user,
    reference: reference,
    post_id: notif.post_id
  }
}
