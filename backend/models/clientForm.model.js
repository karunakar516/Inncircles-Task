const mongoose = require('mongoose');
const { Schema } = mongoose;

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
  });
  
  const SectionSchema = new mongoose.Schema({
    sectionTitle: {
      type: String,
      required: true,
    },
    fields: [FieldSchema],
  });
const clientForm = mongoose.Schema(
    {
        formId:{
            type: Schema.Types.ObjectId,
            required: true
        },
        sections: [SectionSchema],
    }
);

exports.clientForm = mongoose.model('clientForm', clientForm);