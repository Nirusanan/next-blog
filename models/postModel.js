import { Schema, model, models } from "mongoose";

const postSchema = new Schema({
    title: String,
    description: String,
    image: String,
    created_at: String
}, { toJSON: {virtuals: true} });

postSchema.virtual('short_description').get(function() {
    return this.description.substr(0,100)+'....'
});
postSchema.virtual('created_at_formatted').get(function() {
    return dateFormat(this.created_at)

});

function dateFormat(date_str){
    const date = new Date(date_str)
    const months = ["Jan", "Feb", "Mar", "April", "May","June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
}

// Here, the Post is singular and it is created the Posts collection in the database
const PostModel = models.Post || model('Post', postSchema);

export default PostModel;

