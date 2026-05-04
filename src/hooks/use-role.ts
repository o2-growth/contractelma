import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type AppRole = "super_admin" | "admin" | "user";

export function useRole(role: AppRole) {
  const [hasRole, setHasRole] = useState<boolean | null>(null);

  useEffect(() => {
    let active = true;
    const check = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { if (active) setHasRole(false); return; }
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .eq("role", role)
        .maybeSingle();
      if (active) setHasRole(!error && !!data);
    };
    check();
    const { data: sub } = supabase.auth.onAuthStateChange(() => check());
    return () => { active = false; sub.subscription.unsubscribe(); };
  }, [role]);

  return hasRole;
}