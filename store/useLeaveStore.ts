import { create } from "zustand";
import { createClient } from "@/utils/supabase/client";
import { LeaveRequestWithEmployee } from "@/types";

// Keep your types from earlier!

interface LeaveStore {
  requests: LeaveRequestWithEmployee[];
  lastFetched: number | null;
  isLoading: boolean;
  fetchRequests: (forceRefresh?: boolean) => Promise<void>;
}

export const useLeaveStore = create<LeaveStore>((set, get) => ({
  requests: [],
  lastFetched: null,
  isLoading: false,

  fetchRequests: async (forceRefresh = false) => {
    const { requests, lastFetched } = get();
    const now = Date.now();
    const CACHE_DURATION = 5 * 60 * 1000;

    // 1. CACHE CHECK: If we already have data and we aren't forcing a refresh, do nothing.
    if (!forceRefresh && requests.length > 0) {
      return;
    }

    // 2. COOLDOWN CHECK: If they click the refresh button too soon, block it.
    if (forceRefresh && lastFetched && now - lastFetched < CACHE_DURATION) {
      const secondsLeft = Math.round(
        (CACHE_DURATION - (now - lastFetched)) / 1000,
      );
      alert(`Please wait ${secondsLeft} seconds before refreshing again.`);
      return;
    }

    // 3. ACTUAL API CALL
    set({ isLoading: true });
    const supabase = createClient();

    const { data, error } = await supabase
      .from("time_off_requests")
      .select("*, employee:employees(first_name, last_name)")
      .order("created_at", { ascending: false });

    if (!error && data) {
      // Save data and update the timestamp
      set({
        requests: data as unknown as LeaveRequestWithEmployee[],
        lastFetched: now,
        isLoading: false,
      });
    } else {
      set({ isLoading: false });
    }
  },
}));
