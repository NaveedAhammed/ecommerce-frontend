import { create } from "zustand";
import { UserType } from "../types";

interface UserContextStore {
	user: UserType | null;
	setUser: (user: UserType | null) => void;
}

const useRegisterModal = create<UserContextStore>((set) => ({
	user: null,
	setUser: (user) => set({ user: user }),
}));

export default useRegisterModal;
