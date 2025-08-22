import { Loader2 } from "lucide-react";
import { useState } from "react";
import { SERVER_API_URL } from "../../utils/api";
import { Modal } from "../ui/Modal";

interface CreateWorkspaceFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateWorkspaceForm({
  isOpen,
  onClose,
  onSuccess,
}: CreateWorkspaceFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${SERVER_API_URL}/api/workspaces`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.status === 201) {
        onSuccess();
        onClose();
        setFormData({ name: "", description: "" });
      }
    } catch (error: any) {
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("An error occurred while creating the workspace");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create a new workspace">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
            {error}
          </div>
        )}

        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Nom du workspace"
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={3}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Description du workspace"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-500 inline-flex items-center px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Create
          </button>
        </div>
      </form>
    </Modal>
  );
}
