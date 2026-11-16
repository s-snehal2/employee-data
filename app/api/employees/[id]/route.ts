import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

type Context = {
  params: Promise<{ id: string }>;
};

// GET employee by ID
export async function GET(request: NextRequest, { params }: Context) {
  const { id } = await params;

  const { data, error } = await db
    .from("employees")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }

  if (!data) {
    return NextResponse.json(
      { success: false, message: "Employee not found" },
      { status: 404 },
    );
  }

  return NextResponse.json({ success: true, data });
}

// UPDATE employee
export async function PUT(request: NextRequest, { params }: Context) {
  const { id } = await params;
  const { name, email, role } = await request.json();

  if (!name || !email || !role) {
    return NextResponse.json(
      { success: false, message: "All fields are required" },
      { status: 400 },
    );
  }

  const { data, error } = await db
    .from("employees")
    .update({ name, email, role })
    .eq("id", id)
    .select()
    .maybeSingle();

  if (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 },
    );
  }

  if (!data) {
    return NextResponse.json(
      { success: false, message: "Employee not found" },
      { status: 404 },
    );
  }

  return NextResponse.json({
    success: true,
    message: "Employee updated successfully",
    data,
  });
}

// DELETE employee
export async function DELETE(request: NextRequest, { params }: Context) {
  const { id } = await params;

  const { data, error } = await db
    .from("employees")
    .delete()
    .eq("id", id)
    .select()
    .maybeSingle();

  if (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 },
    );
  }

  if (!data) {
    return NextResponse.json(
      { success: false, message: "Employee not found" },
      { status: 404 },
    );
  }

  return NextResponse.json({
    success: true,
    message: "Employee deleted successfully",
  });
}
