import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

const useFollow = () => {
	const queryClient = useQueryClient();
	const {mutate: follow, isPending} = useMutation({
		mutationFn: async (userId) => {
			try {
				const res = await fetch(`/api/user/follow/${userId}`, {
					method: "POST",
					credentials: "include",
				});
				const data = await res.json();
				if (!res.ok) throw new Error(data.error || "Failed to follow user");
				return data;
			} catch (error) {
				console.log(error);
				throw error;
			}
		},
		onSuccess: () => {
			Promise.all([
				queryClient.invalidateQueries({queryKey: ["suggestedUsers"]}),
				queryClient.invalidateQueries({queryKey: ["authUser"]}),
			]);
			toast.success("Followed successfully");
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});
	return {follow, isPending};
};
export default useFollow;
