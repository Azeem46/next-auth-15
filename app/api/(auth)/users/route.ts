/* eslint-disable @typescript-eslint/no-explicit-any */
import connect from "@/lib/db";
import User from "@/lib/models/user";
import { NextResponse } from "next/server";
import { Types } from "mongoose";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const ObjectId = require("mongoose").Types.ObjectId;
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

    return new NextResponse(
      JSON.stringify({ message: "User created succesfully", user: addUser }),
      {
        status: 200,
      }
    );
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({ message: "error adding user" + error.message }),
      { status: 500 }
    );
  }
};

export const PATCH = async (request: Request) => {
  try {
    // Parse JSON body
    const body = await request.json();
    console.log(body);
    const { userId, newUsername } = body;
    await connect();
    if (!userId || !newUsername) {
      return new NextResponse(
        JSON.stringify({ error: "Missing userId or newUsername" }),
        {
          status: 400,
        }
      );
    }
    if (!Types.ObjectId.isValid(userId)) {
      return new NextResponse(JSON.stringify({ error: "Invalid userId" }), {
        status: 400,
      });
    }
    const updatedUser = await User.findOneAndUpdate(
      { _id: new ObjectId(userId) },
      { username: newUsername },
      { new: true }
    );
    return new NextResponse(
      JSON.stringify({
        message: "User updated succesfully",
        user: updatedUser,
      }),
      {
        status: 200,
      }
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return new NextResponse("Error in updating user" + error.message, {
      status: 500,
    });
  }
};

export const DELETE = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    if (!userId) {
      return new NextResponse(JSON.stringify({ error: "Missing userId" }), {
        status: 404,
      });
    }
    if (!Types.ObjectId.isValid(userId)) {
      return new NextResponse(JSON.stringify({ error: "Invalid userId" }), {
        status: 400,
      });
    }

    await connect();
    const deleteUser = await User.findByIdAndDelete(new Types.ObjectId(userId));
    if (!deleteUser) {
      return new NextResponse(JSON.stringify({ error: "User not found" }), {
        status: 400,
      });
    }
    return new NextResponse(
      JSON.stringify({ message: "User is deleted", user: deleteUser }),
      {
        status: 200,
      }
    );
  } catch (error: any) {
    return new NextResponse("Error in deleting user" + error.message, {
      status: 500,
    });
  }
};
