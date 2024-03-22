import { create } from "zustand";
import { UserType } from "../types";

interface UserContextStore {
	user: UserType | null;
	setUser: (user: UserType) => void;
}

const useRegisterModal = create<UserContextStore>((set) => ({
	user: null,
	setUser: (user) => set({ user: user }),
}));

export default useRegisterModal;
