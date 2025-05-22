
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

// Mock error logs for demonstration
const mockErrorLogs = [
  {
    id: '1',
    timestamp: new Date().toISOString(),
    level: 'error',
    message: 'Failed to fetch user data',
    path: '/api/users',
    status: '500'
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    level: 'warn',
    message: 'Rate limit approaching',
    path: '/api/analytics',
    status: '429'
  },
  {
    id: '3',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    level: 'info',
    message: 'User login successful',
    path: '/auth/login',
    status: '200'
  }
];

const ErrorLogs = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Use mock data instead of querying a non-existent logs table
    setLogs(mockErrorLogs);
    setLoading(false);
  }, []);

  const getBadgeColor = (level: string) => {
    switch (level) {
      case 'error':
        return 'bg-red-500 hover:bg-red-600';
      case 'warn':
        return 'bg-yellow-500 hover:bg-yellow-600';
      case 'info':
        return 'bg-blue-500 hover:bg-blue-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>System Error Logs</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            {logs.length === 0 ? (
              <p className="text-center py-8 text-gray-500">No error logs found.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Path</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        {format(new Date(log.timestamp), 'MMM d, yyyy HH:mm:ss')}
                      </TableCell>
                      <TableCell>
                        <Badge className={getBadgeColor(log.level)}>
                          {log.level}
                        </Badge>
                      </TableCell>
                      <TableCell>{log.message}</TableCell>
                      <TableCell>{log.path}</TableCell>
                      <TableCell>{log.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ErrorLogs;
