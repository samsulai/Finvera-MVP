import mongoose from 'mongoose';

 const UserSchema = new mongoose.Schema({
    fullName : {
        type : String,
        required : true,

    },
    email : {
        type : String,
        required : true,
        unique : true,
        lowercase : true,
        trim : true,

    },
    passwordHash : {
        type : String,
        required : true,

    },

     virtualAccount: {
         accountNumber: String,
         bankName: String,
     },
     withdrawalBank: {
         accountNumber: String,
         bankCode: String,
         bankName: String,
         accountName: String,
         recipientCode: String,
     },

     isVerified : {
        type : Boolean,
        default : false
    },


},{ timestamps: true })

const User = mongoose.model('User', UserSchema);
 export default User;