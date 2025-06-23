import { SupabaseService } from './common/supabase/supabase.service';
export declare class SupabaseExampleController {
    private readonly supabaseService;
    constructor(supabaseService: SupabaseService);
    getUsers(): Promise<any[] | {
        error: string;
    }>;
}
