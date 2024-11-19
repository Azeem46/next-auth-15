import connect from "@/lib/db";
import User from "@/lib/models/user";
import { NextResponse } from "next/server";

const ObjectId = ObjectId
export const GET = async () => {
  try {
    await connect();
    const users = await User.find();
    return new NextResponse(JSON.stringify(users), { status: 200 });
  } catch (error) {
    console.log(error);
  }
};

export const POST = async (request: Request) => {
  try {
    // Parse JSON body
    const body = await request.json();
    console.log(body);

    // Connect to the database
    await connect();

    // Create a new user with the parsed data
    const addUser = await User.create(body);
    await addUser.save();

    return new NextResponse(JSON.stringify(addUser), { status: 200 });
  } catch (error) {
    console.error("Error in POST handler:", error);
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
};

export const PATCH = async (request: Request) => {
  try {
    // Parse JSON body
    const body = await request.json();
    console.log(body); 
    const {userId, newUsername} = body;
    await connect();
    if(!userId || !newUsername){
      return new NextResponse(JSON.stringify({ error: "Missing userId or newUsername" }), {
        status: 400,
      });
    }
    if(!Types.ObjectId.isValid(userId)){
      return new NextResponse(JSON.stringify({ error: "Invalid userId" }), {
        status: 400,
      });
    }
    const user = await User.findOneAndUpdate({ _id: userId }, { username: newUsername }, { new: true });
    return new NextResponse(JSON.stringify(user), { status: 200 });
  } catch (error) {
    console.error("Error in PATCH handler:", error);
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}