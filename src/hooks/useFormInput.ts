```typescript
import { useState, useCallback } from 'react';

export function useFormInput(initialValue: string = '') {
  const [value, setValue] = useState(initialValue);

  const handleChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setValue(e.target.value);
  }, []);

  return {
    value,
    onChange: handleChange,
    setValue,
  };
}
```