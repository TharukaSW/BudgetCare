import { useState } from 'react'
import { Text, TextInput, TouchableOpacity, View, ActivityIndicator } from 'react-native'
import { useSignUp } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import { StyleSheet } from 'react-native'
import { COLORS } from '@/constants/colors'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { Image } from 'expo-image'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

export default function SignUpScreen() {
    const { isLoaded, signUp, setActive } = useSignUp()
    const router = useRouter()

    const [emailAddress, setEmailAddress] = useState('')
    const [password, setPassword] = useState('')
    const [pendingVerification, setPendingVerification] = useState(false)
    const [code, setCode] = useState('')
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const onSignUpPress = async () => {
        if (!isLoaded) {
            setError('Authentication service is not ready. Please try again later.')
            return
        }

        // Client-side validation
        if (!emailAddress.trim()) {
            setError('Please enter your email address')
            return
        }

        if (!password) {
            setError('Please enter a password')
            return
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters')
            return
        }

        setIsLoading(true)
        setError('')

        try {
            await signUp.create({
                emailAddress,
                password,
            })

            await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })
            setPendingVerification(true)
        } catch (err) {
            console.error('Sign up error:', err)
            
            if (err.errors) {
                const firstError = err.errors[0]
                
                switch (firstError.code) {
                    case 'form_identifier_exists':
                        setError('An account with this email already exists. Please sign in.')
                        break
                    case 'form_password_length_too_short':
                        setError('Password must be at least 8 characters')
                        break
                    case 'form_password_pwned':
                        setError('This password has been compromised in a data breach. Please choose a different one.')
                        break
                    case 'form_email_address_invalid':
                        setError('Please enter a valid email address')
                        break
                    case 'form_param_format_invalid':
                        setError('Invalid email or password format')
                        break
                    default:
                        setError('Registration failed. Please try again.')
                }
            } else if (err.message?.includes('network')) {
                setError('Network error. Please check your connection.')
            } else {
                setError('An unexpected error occurred during registration.')
            }
        } finally {
            setIsLoading(false)
        }
    }

    const onVerifyPress = async () => {
        if (!isLoaded) {
            setError('Authentication service is not ready. Please try again later.')
            return
        }

        if (!code.trim()) {
            setError('Please enter your verification code')
            return
        }

        setIsLoading(true)
        setError('')

        try {
            const signUpAttempt = await signUp.attemptEmailAddressVerification({
                code,
            })

            if (signUpAttempt.status === 'complete') {
                await setActive({ session: signUpAttempt.createdSessionId })
                router.replace('/')
            } else {
                setError('Verification incomplete. Please try again.')
                console.error('Incomplete verification:', JSON.stringify(signUpAttempt, null, 2))
            }
        } catch (err) {
            console.error('Verification error:', err)
            
            if (err.errors) {
                const firstError = err.errors[0]
                
                switch (firstError.code) {
                    case 'form_code_incorrect':
                        setError('Incorrect verification code. Please check your email and try again.')
                        break
                    case 'form_code_expired':
                        setError('Verification code has expired. Please request a new one.')
                        break
                    default:
                        setError('Verification failed. Please try again.')
                }
            } else {
                setError('An error occurred during verification. Please try again.')
            }
        } finally {
            setIsLoading(false)
        }
    }

    if (pendingVerification) {
        return (
            <KeyboardAwareScrollView
                style={{ flex: 1 }}
                contentContainerStyle={styles.verificationContainer}
                enableOnAndroid={true}
                enableAutomaticScroll={true}
                extraScrollHeight={100}
                keyboardShouldPersistTaps="handled"
            >
                <Image
                    source={require('../../assets/images/img1.jpg')}
                    style={[styles.illustration, { height: 200 }]} 
                />
                <Text style={styles.verificationTitle}>Verify Your Email</Text>
                <Text style={styles.verificationSubtitle}>
                    We've sent a verification code to {emailAddress}
                </Text>

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
                    style={[styles.verificationInput, error && styles.errorInput]}
                    value={code}
                    placeholder="Enter 6-digit code"
                    placeholderTextColor={COLORS.textLight}
                    keyboardType="number-pad"
                    onChangeText={(text) => {
                        setCode(text)
                        if (error) setError('')
                    }}
                    maxLength={6}
                    autoFocus={true}
                />

                <TouchableOpacity 
                    onPress={onVerifyPress} 
                    style={[styles.button, isLoading && styles.buttonDisabled]}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator color={COLORS.white} />
                    ) : (
                        <Text style={styles.buttonText}>Verify Email</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.resendCode}
                    onPress={async () => {
                        try {
                            await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })
                        } catch (err) {
                            setError('Failed to resend code. Please try again.')
                        }
                    }}
                >
                    <Text style={styles.resendCodeText}>
                        Didn't receive a code? <Text style={styles.resendCodeLink}>Resend</Text>
                    </Text>
                </TouchableOpacity>
            </KeyboardAwareScrollView>
        )
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
                    source={require('../../assets/images/img1.jpg')}
                    style={styles.illustration}
                />
                <Text style={styles.title}>Create Account</Text>

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
                    placeholder="Create password (min 8 characters)"
                    placeholderTextColor={COLORS.textLight}
                    secureTextEntry={true}
                    onChangeText={(text) => {
                        setPassword(text)
                        if (error) setError('')
                    }}
                    onSubmitEditing={onSignUpPress}
                />

                <TouchableOpacity 
                    onPress={onSignUpPress} 
                    style={[styles.button, isLoading && styles.buttonDisabled]}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator color={COLORS.white} />
                    ) : (
                        <Text style={styles.buttonText}>Sign Up</Text>
                    )}
                </TouchableOpacity>

                <View style={styles.footerContainer}>
                    <Text style={styles.footerText}>Already have an account?</Text>
                    <TouchableOpacity onPress={() => router.push('/sign-in')}>
                        <Text style={styles.linkText}>Sign In</Text>
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
    verificationContainer: {
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
    verificationTitle: {
        fontSize: 24,
        fontWeight: "bold",
        color: COLORS.text,
        marginBottom: 10,
        textAlign: "center",
    },
    verificationSubtitle: {
        fontSize: 16,
        color: COLORS.textLight,
        marginBottom: 30,
        textAlign: "center",
        paddingHorizontal: 20,
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
    verificationInput: {
        backgroundColor: COLORS.white,
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: COLORS.border,
        fontSize: 18,
        color: COLORS.text,
        width: "100%",
        textAlign: "center",
        letterSpacing: 4,
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
    resendCode: {
        marginTop: 20,
        alignSelf: 'center',
    },
    resendCodeText: {
        color: COLORS.textLight,
        fontSize: 14,
    },
    resendCodeLink: {
        color: COLORS.primary,
        fontWeight: '600',
    },
})