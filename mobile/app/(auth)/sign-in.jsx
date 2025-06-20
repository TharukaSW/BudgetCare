import { useSignIn } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import { Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useState } from 'react'
import { StyleSheet } from 'react-native'
import { COLORS } from '@/constants/colors'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { Image } from 'expo-image'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const onSignInPress = async () => {
    if (!isLoaded) {
      setError('Authentication service is not ready. Please try again later.')
      return
    }

    // Basic client-side validation
    if (!emailAddress.trim()) {
      setError('Please enter your email address')
      return
    }

    if (!password) {
      setError('Please enter your password')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      })

      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId })
        router.replace('/')
      } else {
        console.error('Incomplete sign in attempt:', JSON.stringify(signInAttempt, null, 2))
        setError('Authentication process incomplete. Please try again.')
      }
    } catch (err) {
      console.error('Sign in error:', err)
      
      // Handle known Clerk error codes
      if (err.errors) {
        const firstError = err.errors[0]
        
        switch (firstError.code) {
          case 'form_password_incorrect':
            setError('Incorrect password. Please try again or reset your password.')
            break
          case 'form_identifier_not_found':
            setError('No account found with this email. Please sign up first.')
            break
          case 'form_email_address_invalid':
            setError('Please enter a valid email address.')
            break
          case 'form_param_format_invalid':
            setError('Invalid credentials format. Please check your inputs.')
            break
          case 'session_exists':
            setError('You are already signed in.')
            break
          case 'strategy_for_user_invalid':
            setError('Invalid authentication method for this user.')
            break
          default:
            setError('Authentication failed. Please try again.')
        }
      } else if (err.message) {
        // Handle network or other errors
        if (err.message.includes('network')) {
          setError('Network error. Please check your connection and try again.')
        } else {
          setError('An unexpected error occurred. Please try again.')
        }
      } else {
        setError('Authentication failed. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <KeyboardAwareScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ flexGrow: 1 }}
      enableOnAndroid={true}
      enableAutomaticScroll={true}
      extraScrollHeight={100}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.container}>
        <Image
          source={require('../../assets/images/img2.jpg')} 
          style={styles.illustration} 
        />
        <Text style={styles.title}>Welcome Back</Text>

        {error ? (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle" size={20} color={COLORS.expense} />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity 
              onPress={() => setError('')}
              hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
            >
              <Ionicons name="close" size={20} color={COLORS.textLight} />
            </TouchableOpacity>
          </View>
        ) : null}

        <TextInput
          style={[styles.input, error.toLowerCase().includes('email') && styles.errorInput]}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          value={emailAddress}
          placeholder="Email address"
          placeholderTextColor={COLORS.textLight}
          onChangeText={(text) => {
            setEmailAddress(text)
            if (error) setError('')
          }}
        />
        
        <TextInput
          style={[styles.input, error.toLowerCase().includes('password') && styles.errorInput]}
          value={password}
          placeholder="Password"
          placeholderTextColor={COLORS.textLight}
          secureTextEntry={true}
          onChangeText={(text) => {
            setPassword(text)
            if (error) setError('')
          }}
          onSubmitEditing={onSignInPress}
        />

        <TouchableOpacity 
          onPress={onSignInPress} 
          style={[styles.button, isLoading && styles.buttonDisabled]}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.forgotPassword}
          onPress={() => router.push('/reset-password')}
        >
          <Text style={styles.forgotPasswordText}>Forgot password?</Text>
        </TouchableOpacity>

        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>Don't have an account?</Text>
          <TouchableOpacity onPress={() => router.push('sign-up')}>
            <Text style={styles.linkText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAwareScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 20,
    justifyContent: "center",
  },
  illustration: {
    alignSelf: "center",
    width: 300,
    height: 310,
    resizeMode: "contain",
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 30,
    textAlign: "center",
  },
  input: {
    width: "100%",
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    fontSize: 16,
    color: COLORS.text,
  },
  errorInput: {
    borderColor: COLORS.expense,
    backgroundColor: '#FFF0F0',
  },
  button: {
    width: "100%",
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 16,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "600",
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginTop: 20,
  },
  footerText: {
    color: COLORS.textLight,
    fontSize: 16,
  },
  linkText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: "600",
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  errorBox: {
    backgroundColor: "#FFE5E5",
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.expense,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  errorText: {
    color: COLORS.text,
    marginLeft: 8,
    flex: 1,
    fontSize: 14,
  },
})