import { Schema, model, models } from "mongoose";

const postSchema = new Schema({
    title: String,
    description: String,
    image: String
}, { toJSON: {virtuals: true} });

postSchema.virtual('short_description').get(function() {
    return this.description.substr(0,100)+'....'
});

// Here, the Post is singular and it is created the Posts collection in the database
const PostModel = models.Post || model('Post', postSchema);

export default PostModel;

