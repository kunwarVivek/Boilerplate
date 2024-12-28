import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface BrandingPreviewProps {
  primaryColor: string;
  accentColor: string;
  logoUrl?: string;
}

export function BrandingPreview({ primaryColor, accentColor, logoUrl }: BrandingPreviewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Preview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            {logoUrl && (
              <img
                src={logoUrl}
                alt="Logo Preview"
                className="h-8 object-contain"
              />
            )}
            <h2 className="text-xl font-semibold">Your Organization</h2>
          </div>

          <div className="space-y-2">
            <Button style={{ backgroundColor: primaryColor }}>
              Primary Button
            </Button>
            <Button
              variant="outline"
              style={{ borderColor: accentColor, color: accentColor }}
            >
              Secondary Button
            </Button>
          </div>

          <div
            className="h-20 rounded-lg"
            style={{ backgroundColor: primaryColor }}
          >
            <div
              className="h-full w-1/3 rounded-lg"
              style={{ backgroundColor: accentColor }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}