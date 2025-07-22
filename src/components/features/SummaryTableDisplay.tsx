import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SummaryData } from "@/hooks/useSummaryTable";

interface SummaryTableDisplayProps {
  summaryData: SummaryData;
}

export function SummaryTableDisplay({ summaryData }: SummaryTableDisplayProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{summaryData.title}</CardTitle>
        <CardDescription>
          טבלת סיכום עם {summaryData.summary.length} מושגים
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-right p-4 font-semibold text-gray-900 bg-gray-50">מושג</th>
                <th className="text-right p-4 font-semibold text-gray-900 bg-gray-50">הגדרה</th>
                <th className="text-right p-4 font-semibold text-gray-900 bg-gray-50">הסבר מפורט</th>
                <th className="text-right p-4 font-semibold text-gray-900 bg-gray-50">דוגמה</th>
              </tr>
            </thead>
            <tbody>
              {summaryData.summary.map((item, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-4 font-medium text-gray-900 align-top">
                    <Badge variant="outline" className="mb-2">
                      {item.concept}
                    </Badge>
                  </td>
                  <td className="p-4 text-gray-800 align-top">
                    {item.definition}
                  </td>
                  <td className="p-4 text-gray-700 align-top leading-relaxed">
                    {item.explanation}
                  </td>
                  <td className="p-4 text-gray-600 align-top">
                    {item.example || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}