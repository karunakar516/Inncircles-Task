const mongoose = require('mongoose');
const { Schema } = mongoose;

const FieldSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true,
    },
    value: [{
      type: mongoose.Schema.Types.Mixed,
      required: true,
    }],
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
        formTitle: {
            type: String,
            required: true,
        },
        sections: [SectionSchema],
    }
);

module.exports = mongoose.model('clientForm', clientForm);