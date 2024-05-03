import { Schema, model, models } from "mongoose";

const contactSchema = new Schema({
    name: String,
    email: String,
    message: String
});

const contactModel = models.Contact || model('Contact', contactSchema);

export default contactModel;