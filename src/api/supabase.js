import { createClient } from '@supabase/supabase-js';

// Вставь сюда свои значения
const supabaseUrl = 'https://hxawkpuffitmchddwqpt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh4YXdrcHVmZml0bWNoZGR3cXB0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0ODU5MzcsImV4cCI6MjA4NjA2MTkzN30.xAOmQZz1DBvk-6mJOny3LV4STkzhYVo2vyOUrGF799g';

// Создаём клиент Supabase
export const supabase = createClient(supabaseUrl, supabaseKey);
