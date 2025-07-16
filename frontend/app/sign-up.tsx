import { useRouter } from "expo-router";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import * as Yup from "yup";
import { useAuth } from "../src/context/AuthContext";

const signUpSchema = Yup.object().shape({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
});

type ValidationErrors = {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
};

export default function SignUp() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { signUp } = useAuth();
  const router = useRouter();

  const validateForm = async () => {
    try {
      await signUpSchema.validate(formData, { abortEarly: false });
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        const newErrors: ValidationErrors = {};
        error.inner.forEach((err) => {
          if (err.path) {
            newErrors[err.path as keyof ValidationErrors] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSignUp = async () => {
    try {
      setError(null);
      const isValid = await validateForm();
      if (!isValid) return;

      const { confirmPassword, ...signUpData } = formData;
      await signUp(signUpData);
      router.replace("/(tabs)");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Registration failed");
      }
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user types
    if (errors[field as keyof ValidationErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <View className="flex-1 justify-center p-4">
      <View className="h-12 mb-4">
        {error && (
          <View className="p-3 bg-error/10 rounded-md">
            <Text className="text-error text-center">{error}</Text>
          </View>
        )}
      </View>

      <View className="flex flex-col gap-4">
        <View>
          <Text className="text-secondary-700 text-sm mb-1">First Name</Text>
          <TextInput
            className="input-base-style"
            placeholder="Enter your first name"
            value={formData.firstName}
            onChangeText={(value) => handleChange("firstName", value)}
          />
          {errors.firstName && (
            <Text className="text-error text-xs mt-2">{errors.firstName}</Text>
          )}
        </View>

        <View>
          <TextInput
            className="input-base-style"
            placeholder="Last Name"
            value={formData.lastName}
            onChangeText={(value) => handleChange("lastName", value)}
          />
          {errors.lastName && (
            <Text className="text-error text-sm mt-1">{errors.lastName}</Text>
          )}
        </View>

        <View>
          <TextInput
            className="input-base-style"
            placeholder="Email"
            value={formData.email}
            onChangeText={(value) => handleChange("email", value)}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          {errors.email && (
            <Text className="text-error text-sm mt-1">{errors.email}</Text>
          )}
        </View>

        <View>
          <View className="flex-row items-center">
            <TextInput
              className="input-base-style flex-auto"
              placeholder="Password"
              value={formData.password}
              onChangeText={(value) => handleChange("password", value)}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              className="absolute right-2"
              onPress={() => setShowPassword(!showPassword)}
            >
              <Text className="text-secondary-600">
                {showPassword ? "Hide" : "Show"}
              </Text>
            </TouchableOpacity>
          </View>
          {errors.password && (
            <Text className="text-error text-sm mt-1">{errors.password}</Text>
          )}
        </View>

        <View>
          <View className="flex-row items-center">
            <TextInput
              className="input-base-style flex-auto"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChangeText={(value) => handleChange("confirmPassword", value)}
              secureTextEntry={!showConfirmPassword}
            />
            <TouchableOpacity
              className="absolute right-2"
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <Text className="text-secondary-600">
                {showConfirmPassword ? "Hide" : "Show"}
              </Text>
            </TouchableOpacity>
          </View>
          {errors.confirmPassword && (
            <Text className="text-error text-sm mt-1">
              {errors.confirmPassword}
            </Text>
          )}
        </View>
      </View>

      <View className="flex flex-col items-center gap-5 mt-6">
        <TouchableOpacity
          className="w-full bg-primary-500 py-3 rounded-md"
          onPress={handleSignUp}
        >
          <Text className="text-white text-center font-semibold">Sign Up</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="w-full bg-secondary-200 py-3 rounded-md"
          onPress={() => router.push("/sign-in")}
        >
          <Text className="text-secondary-800 text-center font-semibold">
            Back to Sign In
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
