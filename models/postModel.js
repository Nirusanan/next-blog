import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  filePath: {
    type: String,
    required: true,
  },
  likes: {
    type: Number,
    default: 0,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { toJSON: {virtuals: true} });

PostSchema.virtual('short_description').get(function() {
  return this.description.substr(0,100)+'....'
});
PostSchema.virtual('created_at_formatted').get(function() {
  return dateFormat(this.createdAt)

});


function dateFormat(createdAt){
  const months = ["Jan", "Feb", "Mar", "April", "May","June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[createdAt.getMonth()]} ${createdAt.getDate()}, ${createdAt.getFullYear()}`
}



const PostModel = mongoose.models.Post || mongoose.model('Post', PostSchema);
export default PostModel;

