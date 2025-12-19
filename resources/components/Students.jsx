import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

function Students() {
    const [students, setStudents] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
    } = useForm({
        defaultValues: { name: "", email: "" },
    });

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            setLoading(true);
            const response = await axios.get("/api/students");
            setStudents(response.data);
            setError("");
        } catch (err) {
            setError("Failed to fetch students");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (data) => {
        try {
            setLoading(true);
            if (editingId) {
                await axios.put(`/api/students/${editingId}`, data);
            } else {
                await axios.post("/api/students", data);
            }
            reset();
            setEditingId(null);
            fetchStudents();
            setError("");
        } catch (err) {
            setError(err.response?.data?.message || "Operation failed");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (student) => {
        setValue("name", student.name);
        setValue("email", student.email);
        setEditingId(student.id);
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this student?")) return;

        try {
            setLoading(true);
            await axios.delete(`/api/students/${id}`);
            fetchStudents();
            setError("");
        } catch (err) {
            setError("Failed to delete student");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        reset();
        setEditingId(null);
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Student Management</h1>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {/* Form */}
            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-6">
                <h2 className="text-xl font-semibold mb-4">
                    {editingId ? "Edit Student" : "Add New Student"}
                </h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Name
                        </label>
                        <input
                            type="text"
                            {...register("name", {
                                required: "Name is required",
                                minLength: {
                                    value: 2,
                                    message:
                                        "Name must be at least 2 characters",
                                },
                            })}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                        {errors.name && (
                            <p className="text-red-500 text-xs italic mt-1">
                                {errors.name.message}
                            </p>
                        )}
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            {...register("email", {
                                required: "Email is required",
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: "Invalid email address",
                                },
                            })}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                        {errors.email && (
                            <p className="text-red-500 text-xs italic mt-1">
                                {errors.email.message}
                            </p>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
                        >
                            {loading
                                ? "Processing..."
                                : editingId
                                ? "Update"
                                : "Add"}
                        </button>
                        {editingId && (
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Students List */}
            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8">
                <h2 className="text-xl font-semibold mb-4">Students List</h2>
                {loading && students.length === 0 ? (
                    <p>Loading...</p>
                ) : students.length === 0 ? (
                    <p className="text-gray-500">
                        No students found. Add one above!
                    </p>
                ) : (
                    <table className="min-w-full">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="px-4 py-2 text-left">ID</th>
                                <th className="px-4 py-2 text-left">Name</th>
                                <th className="px-4 py-2 text-left">Email</th>
                                <th className="px-4 py-2 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map((student) => (
                                <tr
                                    key={student.id}
                                    className="border-b hover:bg-gray-50"
                                >
                                    <td className="px-4 py-2">{student.id}</td>
                                    <td className="px-4 py-2">
                                        {student.name}
                                    </td>
                                    <td className="px-4 py-2">
                                        {student.email}
                                    </td>
                                    <td className="px-4 py-2">
                                        <button
                                            onClick={() => handleEdit(student)}
                                            className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-3 rounded mr-2"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleDelete(student.id)
                                            }
                                            className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

export default Students;
