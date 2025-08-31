import { useEffect, useState } from "react";
import { SERVER_API_URL } from "../utils/api";
import { useNavigate } from "react-router-dom";

function SuccessModal({
  isVisible,
  onClose,
}: {
  isVisible: boolean;
  onClose: () => void;
}) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="m-4 flex w-full max-w-sm flex-col items-center rounded-2xl bg-white p-6">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <span className="text-4xl">✓</span>
        </div>

        <h2 className="mb-2 text-center text-xl font-semibold">
          Email Verified Successfully!
        </h2>

        <p className="mb-6 text-center text-slate-500">
          Your account has been verified. You can now sign in to access your
          account.
        </p>

        <button
          onClick={onClose}
          className="w-full rounded-full bg-blue-600 px-8 py-3 font-semibold text-white hover:bg-blue-700"
        >
          Continue to Sign In
        </button>
      </div>
    </div>
  );
}

function getTokenFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("token");
}

export default function ValidateAccount() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const token = getTokenFromUrl();

    const validateAccount = async () => {
      try {
        if (!token) {
          setError("Invalid validation link");
          return;
        }

        const response = await fetch(
          `${SERVER_API_URL}/api/auth/validate/${token}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to validate account");
        }

        setShowSuccess(true);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("An unexpected error occurred");
        }
      } finally {
        setIsLoading(false);
      }
    };

    validateAccount();
  }, []);

  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
        <p className="mt-4 text-slate-500">Validating your account...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-start justify-center p-4 pt-20">
        <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-lg">
          <h2 className="mb-4 text-center text-xl font-semibold text-red-500">
            Validation Failed
          </h2>
          <p className="mb-6 text-center text-slate-500">{error}</p>
          <button
            onClick={() => (window.location.href = "/sign-in")}
            className="w-full rounded-full bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Back to Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen justify-center p-4">
      <SuccessModal
        isVisible={showSuccess}
        onClose={() => {
          setShowSuccess(false);
          navigate("/");
        }}
      />
    </div>
  );
}
