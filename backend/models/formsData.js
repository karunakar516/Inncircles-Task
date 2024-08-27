const mongoose = require("mongoose");

const FieldSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    enum: ["text", "number", "date", "multiSelect", "singleSelect"],
    required: true,
  },
  value: {
    type: mongoose.Schema.Types.Mixed,
    required: false,
  },
  options: [
    {
      type: String,
      required: function () {
        return this.body === "singleSelect" || this.body === "multiSelect";
      },
    },
  ],
  require: {
    type: Boolean,
    default: false,
  },
  showCard: {
    type: Boolean,
    default: false,
  },
  unique: {
    type: Boolean,
    default: false,
  },
});

const SectionSchema = new mongoose.Schema({
  sectionTitle: {
    type: String,
    required: true,
  },
  fields: [FieldSchema],
});

const FormSchema = new mongoose.Schema({
  formTitle: {
    type: String,
    required: true,
  },
  sections: [SectionSchema],
});

const Form = mongoose.model("Form", FormSchema);
module.exports = Form;
