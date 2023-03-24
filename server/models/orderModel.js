const mongoose = require("mongoose");


const orderSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        orderItems: [
            {
                name: {
                    type: String,
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                },
                image: {
                    type: String,
                    required: true,
                },
                price: {
                    type: Number,
                    required: true,
                },
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    // required: true,
                    ref: "Product",
                },
            },
        ],
        shippingAddress: {
            address: {
                type: String,
                required: true,
            },
            city: {
                type: String,
                required: true,
            },
            postalCode: {
                type: String,
                required: true,
            },
            district: {
                type: String,
            },
            state: {
                type: String,
            },
            country: {
                type: String,
                required: true,
            },
        },
        total: Number,
        shippingcharge: Number,
        orderstatus: Boolean,
        default: false,
        isDelivered: {
            Type: Boolean,
            default: false,
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Order", orderSchema);

