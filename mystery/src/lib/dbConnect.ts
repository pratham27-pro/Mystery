import mongoose from "mongoose";


type ConnectionObject = {
    isConnected?: number
}

const connection: ConnectionObject = {

}

async function dbConnect(): Promise<void> {
    // Here void means the type of data we're getting, we don't care about that
    if (connection.isConnected) {
        console.log("Already connected to db");
        return;
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || "", {});

        connection.isConnected = db.connections[0].readyState
        // readyState is just a number that we're extracting..
        // Nhi bhi karte toh as such koi dikkat nahi thi

        //:: ASSIGNMENT - 
        // 1. db ko log karke read karo
        // 2. db.connections ko bhi log karke dekho

        console.log("DB connected successfully");
    
    } catch (error) {
        console.log("DB connection failed!", error);
        process.exit(1);        
    }
}

export default dbConnect;