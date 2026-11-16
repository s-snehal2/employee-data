import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

// GET all employees
export async function GET() {
  try {
    const { data, error } = await db
      .from("employees")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.error("GET employees error:", error.message);

      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      data: data || [],
    });
  } catch (error) {
    console.error("GET API error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to fetch employees" },
      { status: 500 },
    );
  }
}

// POST new employee
export async function POST(request: NextRequest) {
  try {
    console.log("POST EMPLOYEES API HIT");

    const { name, email, role } = await request.json();

    // Validate fields
    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof role !== "string" ||
      !name.trim() ||
      !email.trim() ||
      !role.trim()
    ) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 },
      );
    }

    // Insert employee into Supabase
    const { data, error } = await db
      .from("employees")
      .insert({
        name: name.trim(),
        email: email.trim(),
        role: role.trim(),
      })
      .select()
      .single();

    if (error) {
      console.error("POST employees error:", error.message);

      return NextResponse.json(
        { success: false, message: error.message },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Employee added successfully",
        data,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST API error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to add employee" },
      { status: 500 },
    );
  }
}
