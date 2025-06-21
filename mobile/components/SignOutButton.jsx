import { useClerk } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { Alert, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export const SignOutButton = () => {
  const { signOut } = useClerk();
  const router = useRouter();

  const handleSignOut = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await signOut();
            router.replace('/sign-in'); // ✅ replace to prevent going back
          } catch (error) {
            console.error("Sign-out failed:", error);
          }
        },
      },
    ]);
  };

  return (
    <TouchableOpacity onPress={handleSignOut}>
      <Ionicons name="log-out-outline" size={26} color="red" />
    </TouchableOpacity>
  );
};
