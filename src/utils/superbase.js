import { createClient } from '@supabase/supabase-js';


export const supabase = createClient(
    'https://hhdmeowegwplrpdpyfgm.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhoZG1lb3dlZ3dwbHJwZHB5ZmdtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NDc4NjMzNSwiZXhwIjoyMDYwMzYyMzM1fQ.J7p19BkjEYDvBN7dAQ5rVmE27VBl4-fbSWmf7kW20Bk',
    {
        auth: {
            persistSession: true,
            storage: localStorage
        }
    });

