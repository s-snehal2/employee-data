"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/axios";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Employee = {
  id: number;
  name: string;
  email: string;
  role: string;
};

export default function EmployeeTable() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch all employees
  const fetchEmployees = async () => {
    try {
      const response = await api.get("/employees");

      setEmployees(response.data.data || []);
    } catch (error) {
      console.error("Fetch error:", error);
      alert("Failed to fetch employees");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchEmployees();
  }, []);

  // Delete employee
  const deleteEmployee = async (id: number) => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this employee?",
    );

    if (!confirmDelete) return;

    try {
      const response = await api.delete(`/employees/${id}`);

      if (response.data.success) {
        setEmployees((prev) => prev.filter((emp) => emp.id !== id));
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete employee");
    }
  };

  // Search employees
  const filteredEmployees = employees.filter((emp) =>
    `${emp.name} ${emp.email} ${emp.role}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  if (loading) {
    return <p className="p-6">Loading employees...</p>;
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Employee Directory</h1>
          <p className="text-muted-foreground">Manage your employee records</p>
        </div>

        <Button>
          <Link href="/employee-data/form">+ Add Employee</Link>
        </Button>
      </div>

      {/* Employee Count */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Employees
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-3xl font-bold">{employees.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Employee List */}
      <Card>
        <CardHeader>
          <CardTitle>Employees</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Search */}
          <Input
            placeholder="Search by name, email or role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />

          {/* Table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredEmployees.map((emp) => (
                  <TableRow key={emp.id}>
                    <TableCell>{emp.id}</TableCell>
                    <TableCell className="font-medium">{emp.name}</TableCell>
                    <TableCell>{emp.email}</TableCell>

                    <TableCell>
                      <Badge variant="secondary">{emp.role}</Badge>
                    </TableCell>

                    <TableCell>
                      <div className="flex justify-end gap-2">
                        {/* Edit */}
                        <Button variant="outline" size="sm">
                          <Link href={`/employee-data/form/${emp.id}`}>
                            Edit
                          </Link>
                        </Button>

                        {/* Delete */}
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteEmployee(emp.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}

                {filteredEmployees.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="h-24 text-center text-muted-foreground"
                    >
                      No employees found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
