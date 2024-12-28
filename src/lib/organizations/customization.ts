import { supabase } from '../supabase';

export interface CustomField {
  id: string;
  name: string;
  type: 'text' | 'number' | 'date' | 'boolean' | 'select';
  required: boolean;
  options?: string[];
  defaultValue?: any;
}

export async function addCustomField(
  organizationId: string,
  field: Omit<CustomField, 'id'>
) {
  const { data, error } = await supabase
    .from('organization_settings')
    .update({
      custom_fields: supabase.sql`custom_fields || ${JSON.stringify({
        [field.name]: {
          type: field.type,
          required: field.required,
          options: field.options,
          defaultValue: field.defaultValue
        }
      })}::jsonb`
    })
    .eq('organization_id', organizationId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function removeCustomField(
  organizationId: string,
  fieldName: string
) {
  const { data, error } = await supabase
    .from('organization_settings')
    .update({
      custom_fields: supabase.sql`custom_fields - ${fieldName}`
    })
    .eq('organization_id', organizationId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateCustomFieldValue(
  organizationId: string,
  userId: string,
  fieldName: string,
  value: any
) {
  const { error } = await supabase
    .from('users')
    .update({
      custom_fields: supabase.sql`custom_fields || ${JSON.stringify({
        [fieldName]: value
      })}::jsonb`
    })
    .eq('id', userId)
    .eq('organization_id', organizationId);

  if (error) throw error;
}