/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { NextResponse } from "next/server";

import { db } from "@acme/db/client";
import { Connection } from "@acme/db/schema";

export function OPTIONS() {
  const response = NextResponse.json({ }, { status: 200 });

  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");

  return response;
}
export async function GET() {
  const allConnections = await db.select().from(Connection);
  return NextResponse.json(allConnections, { status: 200 });
}

export async function POST(request: Request) {
  try {
    const { connections } = await request.json();

    if (!connections || !Array.isArray(connections)) {
      return NextResponse.json({ success: false, error: "Invalid connections" }, { status: 400 });
    }

    await db.insert(Connection).values(connections).onConflictDoNothing();

    const response = NextResponse.json(
      {
        success: true,
        message: "Connections saved successfully",
      },
      { status: 200 }
    );

    response.headers.set("Access-Control-Allow-Origin", "*");
    return response;
  } catch (error) {
    console.error("Error saving connections:", error);
    const response = NextResponse.json(
      { success: false, error: "Internal server error" }, 
      { status: 500 }
    );

    response.headers.set("Access-Control-Allow-Origin", "*");
    return response;
  }
}

