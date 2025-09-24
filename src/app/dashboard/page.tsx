// As this is a prototype, this page is a placeholder for a real officer dashboard.
// In a full implementation, this would be a secure page showing escalated queries
// from a database like Firestore, with tools for officers to respond.

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const escalatedQueries = [
  {
    id: '1',
    query: "My vanilla plant's beans are turning black and falling off prematurely. This is happening in the Idukki region after the recent heavy rains. What specific fungus is this and what is the exact dosage for a systemic fungicide?",
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    status: 'New',
    topic: 'Complex Fungal Infection'
  },
  {
    id: '2',
    query: 'മഞ്ഞളിൻ്റെ ഇലകൾ മഞ്ഞളിക്കുന്നു, പക്ഷേ വേരുകൾക്ക് പ്രശ്‌നമൊന്നുമില്ല. സാധാരണ വളം നൽകിയിട്ടും മാറ്റമില്ല. എന്താണ് കാരണം?',
    translation: "Turmeric leaves are yellowing, but the roots seem fine. There's no change even after applying standard fertilizer. What is the reason?",
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    status: 'New',
    topic: 'Nutrient Deficiency'
  },
  {
    id: '3',
    query: 'Is there a new government subsidy for installing solar-powered water pumps for micro-irrigation in Palakkad? I heard about a 90% subsidy but cannot find the details on the official website.',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    status: 'Viewed',
    topic: 'Subsidy Inquiry'
  },
];


export default function OfficerDashboard() {
  return (
    <div className="flex flex-col min-h-screen bg-muted/40">
       <header className="bg-background border-b p-4">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-xl font-semibold">Officer Dashboard</h1>
           <Button variant="outline" asChild>
              <Link href="/chat">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Chat
              </Link>
            </Button>
        </div>
      </header>
      <main className="flex-1 p-4 md:p-6">
        <Card>
          <CardHeader>
            <CardTitle>Escalated Farmer Queries</CardTitle>
            <CardDescription>
              Queries from farmers that require expert review.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>Topic</TableHead>
                  <TableHead>Query</TableHead>
                  <TableHead>Received</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {escalatedQueries.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Badge variant={item.status === 'New' ? 'default' : 'secondary'}>
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{item.topic}</TableCell>
                    <TableCell>
                        <p>{item.query}</p>
                        {item.translation && <p className="text-xs text-muted-foreground italic mt-1">"{item.translation}"</p>}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                        {new Date(item.timestamp).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
