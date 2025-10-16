import { createClient } from "@/app/utils/supabase/client";
import { Provider } from "@supabase/supabase-js";

const OAuth = async (provider: Provider) => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: provider,
  });

  return { data, error };
};

export default OAuth;
