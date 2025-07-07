import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { supabase } from "./supabaseClient";
import type { Session } from "@supabase/supabase-js";

export function useAdminAuth(){
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [session, setSession] = useState<Session | null>(null);

    useEffect(()=>{
        supabase.auth.getSession().then(({data})=> {
            if(!data.session) router.replace('/admin/login');
            else setSession(data.session)
            setLoading(false)
        })
    },[])

    return {session , loading}
}