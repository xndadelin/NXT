import { createClient } from "@/app/utils/supabase/client";

export const signInWithPass = async (email: string, password: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const generateRandomUsername = () => {
  const adjectives = [
    "swift",
    "brave",
    "clever",
    "fierce",
    "mighty",
    "noob",
    "pro",
    "ninja",
    "witch",
    "wizard",
  ];
  const nouns = [
    "tiger",
    "eagle",
    "shark",
    "dragon",
    "wolf",
    "cat",
    "dog",
    "fox",
    "bear",
    "lion",
  ];
  const adjectiv = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const number = Math.floor(Math.random() * 1000);
  return `${adjectiv}-${noun}-${number}`;
};

export const checkUser = async (email: string, provider: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("users")
    .select("id")
    .eq("email", email)
    .eq("provider", provider);
  if (error) {
    throw new Error(error.message);
  }
  return data && data.length > 0;
};

export const signUpWithPass = async (email: string, password: string) => {
  const userExists = await checkUser(email, "email");
  if (userExists) {
    throw new Error(
      "User already exists. If you did not verify your email, please check your inbox or spam folder."
    );
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};
