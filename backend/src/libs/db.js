import mongoose from 'mongoose';

const db =() => {
    mongoose
    .connect(process.env.MONGO_URI)
.then(()=>{
    console.log("connected to mongodb")
})
.catch((err)=>{
    console.log("Error is connecting to mongodb");
    
});
};

export default db;