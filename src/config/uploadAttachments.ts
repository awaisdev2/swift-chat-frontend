import { createClerkSupabaseClient } from "@/config/supabase";

export async function uploadAttachment(
  file: File,
  chatId: string,
  token: string
) {
  const supabase = createClerkSupabaseClient(token);

  const filePath = `${chatId}/${Date.now()}-${file.name}`;

  const { error } = await supabase.storage
    .from("chat-attachments")
    .upload(filePath, file);
  if (error) throw error;

  const { data: urlData } = supabase.storage
    .from("chat-attachments")
    .getPublicUrl(filePath);

  return urlData.publicUrl;
}
