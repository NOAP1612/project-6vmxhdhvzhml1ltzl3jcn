import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SummaryData } from "@/hooks/useSummaryTable";

interface SummaryTableDisplayProps {
  summaryData: SummaryData;
}

export function SummaryTableDisplay({ summaryData }: SummaryTableDisplayProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center text-2xl">{summaryData.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/4 font-bold text-right">מושג</TableHead>
                <TableHead className="w-1/4 font-bold text-right">הגדרה</TableHead>
                <TableHead className="w-1/2 font-bold text-right">הסבר ופירוט</TableHead>
                <TableHead className="w-1/4 font-bold text-right">דוגמה</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {summaryData.summary.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium text-right">{item.concept}</TableCell>
                  <TableCell className="text-right">{item.definition}</TableCell>
                  <TableCell className="text-right">{item.explanation}</TableCell>
                  <TableCell className="text-right">{item.example || 'N/A'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}