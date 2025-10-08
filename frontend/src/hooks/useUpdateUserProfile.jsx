import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

const useUpdateUserProfile = (formData) => {
    const queryClient = useQueryClient();
    const { data: authUser } = useQuery({ queryKey: ["authUser"] });

    const { mutateAsync: updateProfile, isPending: isUpdatingProfile } = useMutation({
        mutationFn: async () => {
            let res;
            if (formData instanceof FormData) {
				res = await fetch(`/api/user/update`, {
					method: "POST",
					body: formData, 
				});
			} else {
				res = await fetch(`/api/user/update`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(formData),
				});
			}
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to update profile");
            return data;
        },
        onSuccess: () => {
            toast.success("Profile updated successfully");
            document.getElementById("edit_profile_modal").close();
            Promise.all([
                queryClient.invalidateQueries({ queryKey: ["authUser"] }),
                queryClient.invalidateQueries({ queryKey: ["userProfile"] })			
            ]);
        },
        onError: (err) => toast.error(err.message),
    });

    return {updateProfile, isUpdatingProfile};
}
export default useUpdateUserProfile;