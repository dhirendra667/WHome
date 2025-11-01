import { model, Schema } from 'mongoose';

const listingSchema = new Schema(
  {
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
    },
    type: {
      type: String,
      required: [true, 'Type is required'],
    },
    streetAddress: {
      type: String,
      required: [true, 'Street address is required'],
    },
    aptSuite: {
      type: String,
      required: [true, 'Apartment/Suite is required'],
    },
    city: {
      type: String,
      required: [true, 'City is required'],
    },
    province: {
      type: String,
      required: [true, 'Province is required'],
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
    },
    guestCount: {
      type: Number,
      required: [true, 'Guest count is required'],
    },
    bedroomCount: {
      type: Number,
      required: [true, 'Bedroom count is required'],
    },
    bedCount: {
      type: Number,
      required: [true, 'Bed count is required'],
    },
    bathroomCount: {
      type: Number,
      required: [true, 'Bathroom count is required'],
    },
    amenities: {
      type: Array,
      default: [],
    },
    listingPhotoPaths: [
      {
        type: String,
      },
    ],
    title: {
      type: String,
      required: [true, 'Title is required'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    highlight: {
      type: String,
      required: [true, 'Highlight is required'],
    },
    highlightDesc: {
      type: String,
      required: [true, 'Highlight description is required'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
    },
  },
  {
    timestamps: true,
  }
);

const Listing = model('Listing', listingSchema);

export default Listing;
