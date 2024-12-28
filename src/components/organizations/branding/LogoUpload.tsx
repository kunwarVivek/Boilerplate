import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Upload, X } from 'lucide-react';
import { uploadBrandingAsset } from '@/lib/organizations/branding';

interface LogoUploadProps {
  type: 'logo' | 'favicon';
  currentUrl?: string;
  organizationId: string;
}

export function LogoUpload({ type, currentUrl, organizationId }: LogoUploadProps) {
  const [loading, setLoading] = useState(false);

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type and size
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error('File size must be less than 2MB');
      return;
    }

    try {
      setLoading(true);
      await uploadBrandingAsset(organizationId, file, type);
      toast.success(`${type === 'logo' ? 'Logo' : 'Favicon'} updated successfully`);
    } catch (error) {
      toast.error(`Failed to upload ${type}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-4">
      <div className="relative w-40 h-20 border rounded-lg overflow-hidden">
        {currentUrl ? (
          <img
            src={currentUrl}
            alt={type === 'logo' ? 'Logo' : 'Favicon'}
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            No {type === 'logo' ? 'logo' : 'favicon'}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={loading}
            onClick={() => document.getElementById(`${type}-upload`)?.click()}
          >
            <Upload className="h-4 w-4 mr-2" />
            {loading ? 'Uploading...' : 'Upload New'}
          </Button>

          {currentUrl && (
            <Button
              variant="outline"
              size="sm"
              disabled={loading}
              onClick={() => {
                // TODO: Implement remove functionality
              }}
            >
              <X className="h-4 w-4 mr-2" />
              Remove
            </Button>
          )}
        </div>

        <input
          id={`${type}-upload`}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        <p className="text-sm text-muted-foreground">
          {type === 'logo'
            ? 'Recommended: PNG or SVG, at least 400px wide'
            : 'Recommended: 32x32px for favicon'}
        </p>
      </div>
    </div>
  );
}