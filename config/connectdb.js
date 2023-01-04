import mongoose from "mongoose";

const connectdb = async (DATABASE_URL)=>{
    try {
        const DB_OPTIONS={
            dbname:process.env.DB_NAME,
        }
        await mongoose.connect(DATABASE_URL,DB_OPTIONS)
        console.log('connected successfully');
    } catch (error) {
        console.log(error);
    }
}

export default connectdb