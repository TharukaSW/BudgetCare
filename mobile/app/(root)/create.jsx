import { View, Text, Alert, TouchableOpacity, TextInput } from 'react-native'
import { useRouter } from 'expo-router'
import { useUser } from '@clerk/clerk-expo'
import { useState } from 'react'
import { StyleSheet } from "react-native";
import { COLORS } from "@/constants/colors";
import { Ionicons } from '@expo/vector-icons';

// Use your actual API endpoint
const API_URL = "http://10.0.2.2:5001/api/transactions";

const CATEGORIES = [
    { id: "food", name: "Food & Drink", icon: "fast-food-outline" },
    { id: "shopping", name: "Shopping", icon: "cart-outline" },
    { id: "transport", name: "Transport", icon: "car-outline" },
    { id: "bills", name: "Bills", icon: "receipt-outline" },
    { id: "health", name: "Health", icon: "medkit-outline" },
    { id: "other", name: "Other", icon: "ellipsis-horizontal-outline" },
    { id: "salary", name: "Salary", icon: "bag-handle-outline" },
    { id: "income", name: "Income", icon: "cash-outline" },
]

const CreateTransactionScreen = () => {
    const router = useRouter()
    const { user } = useUser()
    const [title, setTitle] = useState('')
    const [amount, setAmount] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('')
    const [isExpense, setIsExpense] = useState(true)
    const [isLoading, setIsLoading] = useState(false)

    const handleCreate = async () => {
        // Validate inputs
        if (!title?.trim() || !amount || !selectedCategory) {
            return Alert.alert("Error", "Please fill in all fields");
        }

        const amountNumber = parseFloat(amount);
        if (isNaN(amountNumber) || amountNumber <= 0) {
            return Alert.alert("Error", "Amount must be a valid number greater than zero");
        }

        if (!user) {
            return Alert.alert("Error", "User not authenticated");
        }

        setIsLoading(true);

        try {
            const payload = {
                user_ID: user.id,  // Key change here
                title: title.trim(),
                amount: isExpense ? -Math.abs(parseFloat(amount)) : Math.abs(parseFloat(amount)),
                category: selectedCategory,
            };

            console.log("Final payload:", payload);

            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Transaction failed");
            }

            Alert.alert("Success", "Transaction created!");
            router.back();
        } catch (error) {
            console.error("Creation error:", {
                message: error.message,
                stack: error.stack,
            });
            Alert.alert("Error", error.message);
        }
    };


    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back-outline" size={24} color={COLORS.text} />
                </TouchableOpacity>

                <Text style={styles.headerTitle}>Create Transaction</Text>

                <TouchableOpacity
                    onPress={handleCreate}
                    disabled={!title || !amount || !selectedCategory || isLoading}
                    style={[
                        styles.saveButton,
                        (!title || !amount || !selectedCategory) && styles.disabledButton
                    ]}
                >
                    <Text style={styles.saveButtonText}>
                        {isLoading ? "Saving..." : "Save"}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Transaction Card */}
            <View style={styles.card}>
                {/* Expense/Income Toggle */}
                <View style={styles.typeSelector}>
                    <TouchableOpacity
                        style={[
                            styles.typeButton,
                            isExpense && styles.activeTypeButton
                        ]}
                        onPress={() => setIsExpense(true)}
                    >
                        <Ionicons
                            name='arrow-down-circle'
                            size={22}
                            color={isExpense ? COLORS.white : COLORS.expense}
                        />
                        <Text style={[
                            styles.typeButtonText,
                            isExpense && styles.activeTypeButtonText
                        ]}>
                            Expense
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.typeButton,
                            !isExpense && styles.activeTypeButton
                        ]}
                        onPress={() => setIsExpense(false)}
                    >
                        <Ionicons
                            name='arrow-up-circle'
                            size={22}
                            color={!isExpense ? COLORS.white : COLORS.income}
                        />
                        <Text style={[
                            styles.typeButtonText,
                            !isExpense && styles.activeTypeButtonText
                        ]}>
                            Income
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Amount Input */}
                <View style={styles.amountContainer}>
                    <Text style={styles.currencySymbol}>$</Text>
                    <TextInput
                        style={styles.amountInput}
                        placeholder="0.00"
                        value={amount}
                        onChangeText={setAmount}
                        keyboardType="numeric"
                        placeholderTextColor={COLORS.textLight}
                    />
                </View>

                {/* Title Input */}
                <View style={styles.inputContainer}>
                    <Ionicons
                        name='create-outline'
                        size={20}
                        color={COLORS.textLight}
                        style={styles.inputIcon}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Transaction Title"
                        placeholderTextColor={COLORS.textLight}
                        value={title}
                        onChangeText={setTitle}
                    />
                </View>

                {/* Category Selection */}
                <Text style={styles.sectionTitle}>
                    <Ionicons name='pricetag-outline' size={16} color={COLORS.text} /> Category
                </Text>

                <View style={styles.categoryGrid}>
                    {CATEGORIES.map((category) => (
                        <TouchableOpacity
                            key={category.id}
                            style={[
                                styles.categoryButton,
                                selectedCategory === category.name && styles.activeCategoryButton
                            ]}
                            onPress={() => setSelectedCategory(category.name)}
                        >
                            <Ionicons
                                name={category.icon}
                                size={20}
                                color={selectedCategory === category.name ? COLORS.white : COLORS.text}
                            />
                            <Text style={[
                                styles.categoryButtonText,
                                selectedCategory === category.name && styles.activeCategoryButtonText
                            ]}>
                                {category.name}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: COLORS.text,
    },
    saveButton: {
        padding: 8,
    },
    saveButtonText: {
        color: COLORS.primary,
        fontWeight: '600',
    },
    disabledButton: {
        opacity: 0.5,
    },
    card: {
        backgroundColor: COLORS.card,
        margin: 16,
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    typeSelector: {
        flexDirection: 'row',
        marginBottom: 20,
        gap: 10,
    },
    typeButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    activeTypeButton: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    typeButtonText: {
        color: COLORS.text,
        fontSize: 16,
        fontWeight: '500',
        marginLeft: 8,
    },
    activeTypeButtonText: {
        color: COLORS.white,
    },
    amountContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
        paddingBottom: 16,
        marginBottom: 20,
    },
    currencySymbol: {
        fontSize: 32,
        fontWeight: 'bold',
        color: COLORS.text,
        marginRight: 8,
    },
    amountInput: {
        flex: 1,
        fontSize: 36,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 12,
        padding: 4,
        marginBottom: 20,
        backgroundColor: COLORS.white,
    },
    inputIcon: {
        marginHorizontal: 12,
    },
    input: {
        flex: 1,
        padding: 12,
        fontSize: 16,
        color: COLORS.text,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: 15,
    },
    categoryGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    categoryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: COLORS.border,
        backgroundColor: COLORS.white,
    },
    activeCategoryButton: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    categoryButtonText: {
        color: COLORS.text,
        fontSize: 14,
        marginLeft: 6,
    },
    activeCategoryButtonText: {
        color: COLORS.white,
    },
});

export default CreateTransactionScreen;