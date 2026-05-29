"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const TIMEOUT = 30 * 60 * 1000; // 30 menit

export default function SessionTimeout() {
  const router = useRouter();

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const resetTimer = () => {
      clearTimeout(timeout);

      timeout = setTimeout(async () => {
        const supabase = createClient();

        await supabase.auth.signOut();

        router.replace("/admin/login");
      }, TIMEOUT);
    };

    // activity events
    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];

    events.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    resetTimer();

    return () => {
      clearTimeout(timeout);

      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [router]);

  return null;
}
