import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { DomainSettingsFormData } from '@/lib/organizations/settings/types';

interface DomainFormProps {
  form: UseFormReturn<DomainSettingsFormData>;
}

export function DomainForm({ form }: DomainFormProps) {
  const [newDomain, setNewDomain] = useState('');

  function addDomain() {
    const domains = form.getValues('allowedEmailDomains');
    if (newDomain && !domains.includes(newDomain)) {
      form.setValue('allowedEmailDomains', [...domains, newDomain]);
      setNewDomain('');
    }
  }

  function removeDomain(domain: string) {
    const domains = form.getValues('allowedEmailDomains');
    form.setValue(
      'allowedEmailDomains',
      domains.filter((d) => d !== domain)
    );
  }

  return (
    <div className="space-y-4">
      <FormLabel>Allowed Email Domains</FormLabel>
      <div className="flex gap-2">
        <Input
          value={newDomain}
          onChange={(e) => setNewDomain(e.target.value)}
          placeholder="example.com"
        />
        <Button type="button" onClick={addDomain}>
          Add
        </Button>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {form.watch('allowedEmailDomains').map((domain) => (
          <Badge key={domain} variant="secondary">
            {domain}
            <button
              type="button"
              onClick={() => removeDomain(domain)}
              className="ml-1 hover:text-destructive"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
    </div>
  );
}