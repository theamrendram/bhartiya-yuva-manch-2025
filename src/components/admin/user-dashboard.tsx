"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  RefreshCw,
  Filter,
  Eye,
  Mail,
  Phone,
  Building,
  Calendar,
  Shield,
  CreditCard,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { UserDetailsDialog } from "./user-details-dialog";

import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
  Row,
  SortingState,
  ColumnFiltersState,
  ColumnDef,
} from '@tanstack/react-table'

type User = {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  institutionCompany: string;
  designation: string;
  ieeeMemberId: string;
  isVerified: boolean;
  isPaymentVerified: boolean;
  isPaid: boolean;
  createdAt: Date;
  paymentScreenshotUrl?: string;
  finalEmailSent?: boolean;
  finalEmailSentAt?: Date;
  gender?: string;
  cvUrl?: string;
  ieeeIdCardUrl?: string;
  isIeeeCSMember?: boolean;
  paymentRequestSent?: boolean;
  paymentRequestSentAt?: Date;
}

export function UserDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [verifyingUsers, setVerifyingUsers] = useState<Set<string>>(new Set());
  const ongoingRequests = useRef<Set<string>>(new Set());
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const defaultColumns: ColumnDef<User>[] = [
    {
      header: "User",
      accessorKey: "fullName",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="space-y-1">
            <div className="font-semibold text-gray-900">{user.fullName}</div>
            <div className="text-sm text-gray-500">
              {user.designation}
            </div>
          </div>
        );
      },
    },
    {
      header: "Contact",
      accessorKey: "email",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="space-y-1.5">
            <div className="flex items-center text-sm text-gray-700">
              <Mail className="w-3 h-3 mr-2 text-gray-400" />
              <span className="truncate">{user.email}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Phone className="w-3 h-3 mr-2 text-gray-400" />
              {user.phone}
            </div>
          </div>
        );
      },
    },
    {
      header: "Institution",
      accessorKey: "institutionCompany",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex items-center text-sm text-gray-700">
            <Building className="w-3 h-3 mr-2 text-gray-400 flex-shrink-0" />
            <span className="truncate">{user.institutionCompany}</span>
          </div>
        );
      },
    },
    {
      header: "IEEE Member ID",
      accessorKey: "ieeeMemberId",
      cell: ({ row }) => {
        const user = row.original;
        return user.ieeeMemberId ? (
          <Badge variant="secondary" className="text-xs font-medium">
            {user.ieeeMemberId}
          </Badge>
        ) : (
          <span className="text-gray-400 text-sm">—</span>
        );
      },
    },
    {
      header: "Status",
      accessorKey: "isVerified",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="space-y-2">
            {getStatusBadge(user)}
            <div className="text-xs text-gray-500 space-y-0.5">
              <div className="flex items-center gap-1">
                {user.isVerified ? (
                  <CheckCircle className="w-3 h-3 text-green-500" />
                ) : (
                  <Clock className="w-3 h-3 text-yellow-500" />
                )}
                <span>{user.isVerified ? "Verified" : "Pending"}</span>
              </div>
              {user.isPaymentVerified && (
                <div className="flex items-center gap-1">
                  <CreditCard className="w-3 h-3 text-green-500" />
                  <span>Payment Verified</span>
                </div>
              )}
              {user.finalEmailSent && (
                <div className="flex items-center gap-1">
                  <Mail className="w-3 h-3 text-orange-500" />
                  <span>Final Email Sent</span>
                </div>
              )}
            </div>
          </div>
        );
      },
    },
    {
      header: "Registration Date",
      accessorKey: "createdAt",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex items-center text-sm text-gray-700">
            <Calendar className="w-3 h-3 mr-2 text-gray-400 flex-shrink-0" />
            <span>{formatDate(user.createdAt)}</span>
          </div>
        );
      },
    },
    {
      header: "Payment Receipt",
      accessorKey: "paymentScreenshotUrl",
      cell: ({ row }) => {
        const user = row.original;
        return user.paymentScreenshotUrl ? (
          <Button
            size="sm"
            variant="outline"
            onClick={() => window.open(user.paymentScreenshotUrl, '_blank')}
            className="text-xs h-7 px-2"
          >
            <Download className="w-3 h-3 mr-1" />
            View
          </Button>
        ) : (
          <span className="text-gray-400 text-xs">—</span>
        );
      },
    },
    {
      header: "Actions",
      accessorKey: "actions",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex flex-col gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setSelectedUser(user);
                setDialogOpen(true);
              }}
              className="text-xs h-7 px-2 w-full"
            >
              <Eye className="w-3 h-3 mr-1" />
              Details
            </Button>
                          {!user.isVerified && !user.finalEmailSent && (
                <div className="flex flex-col gap-1.5">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => handleVerifyUser(user._id)}
                    disabled={verifyingUsers.has(user._id)}
                    className="text-xs h-7 px-2"
                  >
                    {verifyingUsers.has(user._id) ? (
                      <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                    ) : (
                      <Shield className="w-3 h-3 mr-1" />
                    )}
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => handleSendFinalEmail(user._id)}
                    disabled={verifyingUsers.has(user._id)}
                    className="text-xs h-7 px-2"
                  >
                    {verifyingUsers.has(user._id) ? (
                      <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                    ) : (
                      <Mail className="w-3 h-3 mr-1" />
                    )}
                    Final Email
                  </Button>
                </div>
              )}
            {!user.isVerified && user.finalEmailSent && (
              <Badge variant="outline" className="text-xs h-7 px-2">
                <Mail className="w-3 h-3 mr-1" />
                Final Email Sent
              </Badge>
            )}
                          {user.isVerified && !user.isPaymentVerified && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => handleVerifyPayment(user._id)}
                  disabled={verifyingUsers.has(user._id)}
                  className="text-xs h-7 px-2"
                >
                  {verifyingUsers.has(user._id) ? (
                    <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                  ) : (
                    <CreditCard className="w-3 h-3 mr-1" />
                  )}
                  Verify Payment
                </Button>
              )}
            {user.isVerified && user.isPaymentVerified && (
              <Badge variant="secondary" className="text-xs h-7 px-2">
                <CheckCircle className="w-3 h-3 mr-1" />
                Complete
              </Badge>
            )}

          </div>
        );
      },
    },
  ]

  const table = useReactTable({
    data: filteredUsers,
    columns: defaultColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    state: {
      sorting,
      columnFilters,
    },
  })

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/admin/users");
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await response.json();
      setUsers(data);
      setFilteredUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyUser = async (userId: string) => {
    // Prevent multiple clicks and race conditions
    if (verifyingUsers.has(userId) || ongoingRequests.current.has(userId)) {
      return;
    }

    try {
      ongoingRequests.current.add(userId);
      setVerifyingUsers(prev => new Set(prev).add(userId));
      
      // Use the merged approve-registration endpoint
      const response = await fetch("/api/admin/users/approve-registration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to approve and send email");
      }

      const result = await response.json();
      toast.success(`Approval email sent to ${result.user.fullName}`);
      
      // Refresh the users list
      await fetchUsers();
    } catch (error) {
      console.error("Error approving user:", error);
      toast.error(error instanceof Error ? error.message : "Failed to approve and send email");
    } finally {
      ongoingRequests.current.delete(userId);
      setVerifyingUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  };

  const handleVerifyPayment = async (userId: string) => {
    // Prevent multiple clicks and race conditions
    if (verifyingUsers.has(userId) || ongoingRequests.current.has(userId)) {
      return;
    }

    try {
      ongoingRequests.current.add(userId);
      setVerifyingUsers(prev => new Set(prev).add(userId));

      // Call the payment verification endpoint
      const response = await fetch("/api/admin/users/verify-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to verify payment");
      }

      const result = await response.json();
      toast.success(`Payment verified and confirmation email sent to ${result.user.fullName}`);

      // Refresh the users list
      await fetchUsers();
    } catch (error) {
      console.error("Error verifying payment:", error);
      toast.error(error instanceof Error ? error.message : "Failed to verify payment");
    } finally {
      ongoingRequests.current.delete(userId);
      setVerifyingUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  };

  const handleSendFinalEmail = async (userId: string) => {
    // Prevent multiple clicks and race conditions
    if (verifyingUsers.has(userId) || ongoingRequests.current.has(userId)) {
      return;
    }

    try {
      ongoingRequests.current.add(userId);
      setVerifyingUsers(prev => new Set(prev).add(userId));

      // Call the send final email endpoint
      const response = await fetch("/api/admin/users/send-final-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to send final email");
      }

      const result = await response.json();
      toast.success(`Final notification email sent to ${result.user.fullName}`);

      // Refresh the users list
      await fetchUsers();
    } catch (error) {
      console.error("Error sending final email:", error);
      toast.error(error instanceof Error ? error.message : "Failed to send final email");
    } finally {
      ongoingRequests.current.delete(userId);
      setVerifyingUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    let filtered = users;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.phone.includes(searchTerm) ||
          user.institutionCompany.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (filterStatus !== "all") {
      switch (filterStatus) {
        case "verified":
          filtered = filtered.filter((user) => user.isVerified);
          break;
        case "unverified":
          filtered = filtered.filter((user) => !user.isVerified);
          break;
        case "paid":
          filtered = filtered.filter((user) => user.isPaid);
          break;
        case "unpaid":
          filtered = filtered.filter((user) => !user.isPaid);
          break;
        case "payment-verified":
          filtered = filtered.filter((user) => user.isPaymentVerified);
          break;
        case "payment-pending":
          filtered = filtered.filter((user) => !user.isPaymentVerified);
          break;
        case "final-email-sent":
          filtered = filtered.filter((user) => user.finalEmailSent);
          break;
        case "final-email-pending":
          filtered = filtered.filter((user) => !user.finalEmailSent);
          break;
      }
    }

    setFilteredUsers(filtered);
  }, [users, searchTerm, filterStatus]);

  const getStatusBadge = (user: User) => {
    if (user.isVerified && user.isPaymentVerified) {
      return (
        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
          <CheckCircle className="w-3 h-3 mr-1" />
          Complete
        </Badge>
      );
    } else if (user.isVerified && !user.isPaymentVerified) {
      return (
        <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
          <Clock className="w-3 h-3 mr-1" />
          Payment Pending
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
          <XCircle className="w-3 h-3 mr-1" />
          Pending
        </Badge>
      );
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const exportToCSV = () => {
    const headers = [
      "Name",
      "Email",
      "Phone",
      "Institution/Company",
      "Designation",
      "IEEE Member ID",
      "Status",
      "Payment Status",
      "Final Email Sent",
      "Registration Date",
    ];

    const csvData = filteredUsers.map((user) => [
      user.fullName,
      user.email,
      user.phone,
      user.institutionCompany,
      user.designation,
      user.ieeeMemberId || "N/A",
      user.isVerified ? "Verified" : "Pending",
      user.isPaymentVerified ? "Paid" : "Unpaid",
      user.finalEmailSent ? "Yes" : "No",
      formatDate(user.createdAt),
    ]);

    const csvContent = [headers, ...csvData]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `users-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success("CSV exported successfully");
  };

  const stats = {
    total: users.length,
    verified: users.filter((u) => u.isVerified).length,
    paid: users.filter((u) => u.isPaid).length,
    paymentVerified: users.filter((u) => u.isPaymentVerified).length,
    finalEmailSent: users.filter((u) => u.finalEmailSent).length,
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verified</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.verified}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid</CardTitle>
            <CheckCircle className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.paid}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Payment Verified
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {stats.paymentVerified}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Final Emails Sent
            </CardTitle>
            <Mail className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {stats.finalEmailSent}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div>
              <CardTitle>User Management</CardTitle>
              <p className="text-sm text-muted-foreground">
                View and manage user registrations
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={fetchUsers} variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button onClick={exportToCSV} variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by name, email, phone, or institution..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-md bg-white text-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
            >
              <option value="all">All Users</option>
              <option value="verified">Verified Only</option>
              <option value="unverified">Unverified Only</option>
              <option value="paid">Paid Only</option>
              <option value="unpaid">Unpaid Only</option>
              <option value="payment-verified">Payment Verified</option>
              <option value="payment-pending">Payment Pending</option>
              <option value="final-email-sent">Final Email Sent</option>
              <option value="final-email-pending">Final Email Pending</option>
            </select>
          </div>

          {/* Table */}
          <div className="rounded-lg border bg-white shadow-sm">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className="bg-gray-50/50 hover:bg-gray-50/70">
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id} className="font-semibold text-gray-700 py-4">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12">
                      <div className="flex items-center justify-center">
                        <RefreshCw className="w-5 h-5 animate-spin mr-3 text-gray-500" />
                        <span className="text-gray-600">Loading users...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row, index) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      className={`border-b border-gray-100 hover:bg-gray-50/50 transition-colors ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                      }`}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="py-4">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12">
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <Users className="w-8 h-8 mb-2 opacity-50" />
                        <span>No users found</span>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-end space-x-2 py-4">
            <div className="flex-1 text-sm text-muted-foreground">
              Showing {table.getFilteredRowModel().rows.length} of {users.length} users
            </div>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User Details Dialog */}
      <UserDetailsDialog
        user={selectedUser}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onVerifyUser={handleVerifyUser}
        onVerifyPayment={handleVerifyPayment}
        onSendFinalEmail={handleSendFinalEmail}
        isProcessing={verifyingUsers.size > 0}
      />
    </div>
  );
} 