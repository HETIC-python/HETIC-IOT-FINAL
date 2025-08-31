import { useEffect, useState } from "react";
import { SERVER_API_URL } from "../utils/api";

function SuccessModal({
    isVisible,
    onClose,
}: {
    isVisible: boolean;
    onClose: () => void;
}) {
    if (!isVisible) return null;

    return (
        <div style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 50
        }}>
            <div style={{
                background: "#fff",
                width: "90%",
                maxWidth: "400px",
                borderRadius: "1rem",
                padding: "1.5rem",
                margin: "1rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
            }}>
                <div style={{
                    width: "4rem",
                    height: "4rem",
                    background: "rgba(34,197,94,0.1)",
                    borderRadius: "9999px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "1rem"
                }}>
                    <span style={{ fontSize: "2rem" }}>✓</span>
                </div>

                <div style={{
                    fontSize: "1.25rem",
                    fontWeight: 600,
                    textAlign: "center",
                    marginBottom: "0.5rem"
                }}>
                    Email Verified Successfully!
                </div>

                <div style={{
                    color: "#64748b",
                    textAlign: "center",
                    marginBottom: "1.5rem"
                }}>
                    Your account has been verified. You can now sign in to access your account.
                </div>

                <button
                    onClick={onClose}
                    style={{
                        background: "#0072ff",
                        padding: "0.75rem 2rem",
                        borderRadius: "9999px",
                        width: "100%",
                        color: "#fff",
                        fontWeight: 600,
                        border: "none",
                        cursor: "pointer"
                    }}
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
                    }
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

    if (isLoading) {
        return (
            <div style={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                padding: "1rem"
            }}>
                <div className="spinner" style={{
                    width: "3rem",
                    height: "3rem",
                    border: "4px solid #eee",
                    borderTop: "4px solid #0072ff",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite"
                }} />
                <div style={{ color: "#64748b", marginTop: "1rem" }}>
                    Validating your account...
                </div>
                <style>
                    {`@keyframes spin { 0% { transform: rotate(0deg);} 100% { transform: rotate(360deg);} }`}
                </style>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                padding: "1rem"
            }}>
                <div style={{
                    padding: "1.5rem",
                    background: "#fff",
                    borderRadius: "1rem",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
                }}>
                    <div style={{
                        fontSize: "1.25rem",
                        fontWeight: 600,
                        textAlign: "center",
                        color: "#ef4444",
                        marginBottom: "1rem"
                    }}>
                        Validation Failed
                    </div>
                    <div style={{
                        color: "#64748b",
                        textAlign: "center",
                        marginBottom: "1.5rem"
                    }}>{error}</div>
                    <button
                        onClick={() => window.location.replace("/sign-in")}
                        style={{
                            background: "#0072ff",
                            padding: "0.75rem 1.5rem",
                            borderRadius: "9999px",
                            color: "#fff",
                            fontWeight: 600,
                            border: "none",
                            cursor: "pointer",
                            width: "100%"
                        }}
                    >
                        Back to Sign In
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={{
            minHeight: "100vh",
            display: "flex",
            justifyContent: "center",
            padding: "1rem"
        }}>
            <SuccessModal
                isVisible={showSuccess}
                onClose={() => {
                    setShowSuccess(false);
                    window.location.replace("/sign-in");
                }}
            />
        </div>
    );
}
