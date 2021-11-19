const { model, Schema } = require('mongoose');

const inputSchema = new Schema(
  {
    description: {
      type: String,
      trim: true,
    },
    sentBy: {
      type: String,
    },
    file: {
      type: String,
    },
    coordinates: {
      type: {
        long: {
          type: Number,
        },
        lat: {
          type: Number,
        },
      },
    },
  },
  { timestamps: true },
);

const Input = model('Input', inputSchema);

module.exports = { Input };
