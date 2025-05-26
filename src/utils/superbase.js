import { createClient } from '@supabase/supabase-js';


export const supabase = createClient(
    'https://hhdmeowegwplrpdpyfgm.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhoZG1lb3dlZ3dwbHJwZHB5ZmdtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ3ODYzMzUsImV4cCI6MjA2MDM2MjMzNX0.zQ_o5SH5_nFBBBWalWirizsnZ5uSOZHyMKhAmlCsRno',
    {
        auth: {

            detectSessionInUrl: true,
            flowType: 'pkce',

        }
    },);

