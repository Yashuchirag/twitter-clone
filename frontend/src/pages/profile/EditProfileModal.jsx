import { useState } from "react";
import { toast } from "react-hot-toast";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";


const EditProfileModal = () => {
	const { data: authUser } = useQuery({ queryKey: ["authUser"] });

	const [formData, setFormData] = useState({
		fullName: authUser?.user?.fullName,
		username: authUser?.user?.username,
		email: authUser?.user?.email,
		bio: authUser?.user?.bio,
		link: authUser?.user?.link,
		newPassword: "",
		currentPassword: "",
	});
	const queryClient = useQueryClient();

	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const { mutate: updateProfile, isPending: isUpdatingProfile } = useMutation({
		mutationFn: async (formData) => {
			const res = await fetch(`/api/user/update`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});
			console.log("Res inside EditProfileModal: ", res);
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || "Failed to update profile");
			return data;
		},
		onSuccess: () => {
			toast.success("Profile updated successfully");
			queryClient.invalidateQueries({ queryKey: ["user"] });
			queryClient.invalidateQueries({ queryKey: ["authUser"] });
			document.getElementById("edit_profile_modal").close();
		},
		onError: (err) => toast.error(err.message),
	});

	const handleSubmit = async (e) => {
		e.preventDefault();
		updateProfile(formData);
	};

	return (
		<>
			<button
				className='btn btn-outline rounded-full btn-sm'
				onClick={() => document.getElementById("edit_profile_modal").showModal()}
			>
				Edit profile
			</button>
			<dialog id='edit_profile_modal' className='modal'>
				<div className='modal-box border rounded-md border-gray-700 shadow-md'>
					<h3 className='font-bold text-lg my-3'>Update Profile</h3>
					<form
						className='flex flex-col gap-4'
						onSubmit={handleSubmit}
					>
						<div className='flex flex-wrap gap-2'>
							<input
								type='text'
								placeholder='Full Name'
								className='flex-1 input border border-gray-700 rounded p-2 input-md'
								value={formData.fullName}
								name='fullName'
								onChange={handleInputChange}
							/>
							<input
								type='text'
								placeholder='Username'
								className='flex-1 input border border-gray-700 rounded p-2 input-md'
								value={formData.username}
								name='username'
								onChange={handleInputChange}
							/>
						</div>
						<div className='flex flex-wrap gap-2'>
							<input
								type='email'
								placeholder='Email'
								className='flex-1 input border border-gray-700 rounded p-2 input-md'
								value={formData.email}
								name='email'
								onChange={handleInputChange}
							/>
							<textarea
								placeholder='Bio'
								className='flex-1 input border border-gray-700 rounded p-2 input-md'
								value={formData.bio}
								name='bio'
								onChange={handleInputChange}
							/>
						</div>
						<div className='flex flex-wrap gap-2'>
							<input
								type='password'
								placeholder='Current Password'
								className='flex-1 input border border-gray-700 rounded p-2 input-md'
								value={formData.currentPassword}
								name='currentPassword'
								onChange={handleInputChange}
							/>
							<input
								type='password'
								placeholder='New Password'
								className='flex-1 input border border-gray-700 rounded p-2 input-md'
								value={formData.newPassword}
								name='newPassword'
								onChange={handleInputChange}
							/>
						</div>
						<input
							type='text'
							placeholder='Link'
							className='flex-1 input border border-gray-700 rounded p-2 input-md'
							value={formData.link}
							name='link'
							onChange={handleInputChange}
						/>
						<button className='btn btn-primary rounded-full btn-sm text-white'>
							{isUpdatingProfile ? "Updating..." : "Update"}
						</button>
					</form>
				</div>
				<form method='dialog' className='modal-backdrop'>
					<button className='outline-none'>close</button>
				</form>
			</dialog>
		</>
	);
};
export default EditProfileModal;