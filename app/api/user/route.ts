import  {NextRequest, NextResponse} from "next/server";
import {headers, cookies} from "next/headers";

const withUser = async() =>{

}

export const GET = (req: NextRequest) =>{
    return NextResponse.json({data: {message: "User GET request successful"}});
}
export const POST = async (req: NextRequest) =>{
    return NextResponse.json(req.body);
}