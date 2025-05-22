
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, RefreshCw, Search } from 'lucide-react';

// Sample log data
const SAMPLE_LOGS = [
  {
    id: '1',
    level: 'error',
    message: 'Failed to fetch user data',
    source: 'api',
    stack_trace: 'Error: Failed to fetch user data\n    at fetchUserData...',
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    level: 'error',
    message: 'Authentication failed',
    source: 'auth',
    stack_trace: 'Error: Authentication failed\n    at authenticateUser...',
    created_at: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: '3',
    level: 'warning',
    message: 'Image upload was slow',
    source: 'storage',
    stack_trace: null,
    created_at: new Date(Date.now() - 7200000).toISOString()
  },
  {
    id: '4',
    level: 'info',
    message: 'User profile updated successfully',
    source: 'database',
    stack_trace: null,
    created_at: new Date(Date.now() - 10800000).toISOString()
  },
  {
    id: '5',
    level: 'error',
    message: 'Payment processing failed',
    source: 'payment',
    stack_trace: 'Error: Payment processing failed\n    at processPayment...',
    created_at: new Date(Date.now() - 14400000).toISOString()
  }
];

const ErrorLogs = () => {
  const [logs, setLogs] = useState<any[]>(SAMPLE_LOGS);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [logType, setLogType] = useState('all');

  const fetchLogs = async () => {
    setLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      // In a real application, this would fetch from a database
      setLogs(SAMPLE_LOGS);
      setLoading(false);
    }, 800);
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.message?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        log.source?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = logType === 'all' || log.level === logType;
    return matchesSearch && matchesType;
  });

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch (e) {
      return dateString;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'info':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex flex-1 gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search logs..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={logType} onValueChange={setLogType}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Log type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="error">Error</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="info">Info</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button 
          onClick={fetchLogs} 
          disabled={loading}
          className="whitespace-nowrap"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4 mr-2" />
          )}
          Refresh Logs
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Error Logs</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-3">Loading logs...</span>
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No logs found matching your criteria
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead className="w-full">Message</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.map((log) => (
                    <TableRow key={log.id} className="group cursor-pointer hover:bg-gray-50">
                      <TableCell className="whitespace-nowrap font-mono text-xs">
                        {formatDate(log.created_at)}
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(log.level)}`}>
                          {log.level || 'unknown'}
                        </span>
                      </TableCell>
                      <TableCell>{log.source || 'system'}</TableCell>
                      <TableCell className="font-mono text-sm">
                        {log.message}
                        {log.stack_trace && (
                          <div className="hidden group-hover:block mt-2 bg-gray-100 p-2 rounded text-xs overflow-x-auto">
                            <pre>{log.stack_trace}</pre>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ErrorLogs;
