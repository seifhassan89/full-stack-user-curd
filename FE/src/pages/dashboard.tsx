import { MainLayout } from "@/components/layout/main-layout";
import { UserAvatar } from "@/components/layout/user-avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { fetchUsers } from "@/lib/auth";
import { formatDate } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, CheckCircle, Users } from "lucide-react";
import { useEffect } from "react";

export default function DashboardPage() {
  const { toast } = useToast();

  const {
    data: users = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  useEffect(() => {
    if (error) {
      toast({
        title: "Error fetching users",
        description: error.message
          ? `${error.message} Your are not authorized to access this page or token is expired logout and login again`
          : "The users could not be fetched",
        variant: "destructive",
      });
    }
  }, [error]);

  const totalUsers = users.length;
  const activeUsers = users.filter((user: any) => user.status).length;
  const inactiveUsers = totalUsers - activeUsers;

  const recentActivities = users.slice(0, 3).map((user: any) => ({
    id: user.id,
    user: user.name,
    action: `Created a new account`,
    status: user.status ? "Completed" : "Pending",
    timestamp: user.createdAt,
  }));

  return (
    <MainLayout>
      <div className="flex-1 pt-16 md:pt-8 px-4 sm:px-6 md:px-8">
        <div className="py-4">
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        </div>

        {/* Stat Cards */}
        <div className="mt-4">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {/* Total Users Card */}
            <Card className="overflow-hidden">
              <CardContent className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-primary rounded-md p-3">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Users
                      </dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">
                          {totalUsers}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </CardContent>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <a
                    href="/users"
                    className="font-medium text-primary hover:text-primary-dark"
                  >
                    View all
                  </a>
                </div>
              </div>
            </Card>

            {/* Active Users Card */}
            <Card className="overflow-hidden">
              <CardContent className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Active Users
                      </dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">
                          {activeUsers}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </CardContent>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <a
                    href="/users"
                    className="font-medium text-primary hover:text-primary-dark"
                  >
                    View details
                  </a>
                </div>
              </div>
            </Card>

            {/* Inactive Users Card */}
            <Card className="overflow-hidden">
              <CardContent className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-red-500 rounded-md p-3">
                    <AlertCircle className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Inactive Users
                      </dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">
                          {inactiveUsers}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </CardContent>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <a
                    href="/users"
                    className="font-medium text-primary hover:text-primary-dark"
                  >
                    View all
                  </a>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8">
          <h2 className="text-lg leading-6 font-medium text-gray-900">
            Recent Activity
          </h2>
          <div className="mt-2 bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {isLoading ? (
                <li className="px-4 py-4 sm:px-6 text-center">
                  Loading activity data...
                </li>
              ) : recentActivities.length === 0 ? (
                <li className="px-4 py-4 sm:px-6 text-center">
                  No recent activities
                </li>
              ) : (
                recentActivities.map((activity: any, index: number) => (
                  <li key={index}>
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <UserAvatar name={activity.user} size="sm" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {activity.user}
                            </div>
                            <div className="text-sm text-gray-500">
                              {activity.action}
                            </div>
                          </div>
                        </div>
                        <div className="ml-2 flex-shrink-0 flex">
                          <Badge
                            variant={
                              activity.status === "Completed"
                                ? "success"
                                : "outline"
                            }
                          >
                            {activity.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="mt-2 text-sm text-gray-500">
                        {formatDate(activity.timestamp)}
                      </div>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
