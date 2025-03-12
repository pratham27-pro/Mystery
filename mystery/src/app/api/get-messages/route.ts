import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET(request: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !session.user) {
        return Response.json(
            {
                success: false,
                message: "User not authenticated!"
            },
            { status: 401 }
        )
    };
    
    // NOTE **
    // Yaha pe options.ts wali file mei (inside auth) humne callbacks mei jwt mei userId ko string mei convert kar liya tha. Lekin abb hum abb usko mongoose agregation pipelines mei use karenge then woh problems create karega because woh cheez as a string pass hogi naaki as a object id which is associated with mongoose. 
    // Isi issue ko solve karne ke liye hum userId ko aise likhte --
    // findbyId and all mei woh khud hi yeh solve kar leta that's why usme problem nahi aati.

    const userId = new mongoose.Types.ObjectId(user._id);
    try {
        
        const user = await UserModel.aggregate([
            { $match: {id: userId} },
            { $unwind: "$messages"}, // Jab bhi mongodb ka koi internal param use karte ho then usko directly aise strings mei likh sakte
            { $sort: {"messages.createdAt": -1} },
            { $group: {_id: "$_id", messages: {$push: "$messages"}} }

        ])

        if (!user || user.length === 0) {
            return Response.json(
                {
                    success: false,
                    message: "User not found!"
                },
                { status: 401 }
            )
        }

        return Response.json(
            {
                success: true,
                message: user[0].messages
            },
            { status: 200 }
        )

    } catch (error) {

        console.log("Oops, unexpected error occurred!", error);

        return Response.json(
            {
                success: false,
                message: "Not authenticated!"
            },
            { status: 500 }
        )
    }
} 