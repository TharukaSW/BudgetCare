import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { COLORS } from '@/constants/colors'
import { formatDate } from '../utils/utils'



const CAT_ICONS = {
    "Food & Drink": "fast-food-outline",
    "Shopping": "cart-outline",
    "Transport": "car-outline",
    "Bills": "receipt-outline",
    "Health": "medkit-outline",
    "Other": "ellipsis-horizontal-outline",
    "Salary": "bag-handle-outline",
    "Income": "cash-outline",
}

export const TransactinItem = ({ item, onDelete }) => {
    const isIncome = parseFloat(item.amount) > 0;
    const icName = CAT_ICONS[item.category] || "ellipsis-horizontal-outline";

    return (
        <View style={styles.transactionCard}>
            <View style={styles.transactionContent}>
                <View style={styles.categoryIconContainer}>
                    <Ionicons name={icName} size={24} color={isIncome ? COLORS.income : COLORS.expense} />
                </View>
                <View style={styles.transactionLeft}>
                    <Text style={styles.transactionTitle}>{item.title}</Text>
                    <Text style={styles.transactionCategory}>{item.category}</Text>
                </View>
                <View style={styles.transactionRight}>
                    <Text style={[styles.transactionAmount, { color: isIncome ? COLORS.income : COLORS.expense }]}>
                        {isIncome ? '+' : '-'}${Math.abs(item.amount).toFixed(2)}
                    </Text>
                    <Text style={styles.transactionDate}>{formatDate(item.created_at)}</Text>
                </View>

                <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => onDelete(item.id)}
                >
                    <Ionicons name="trash-outline" size={20} color={COLORS.expense} />
                </TouchableOpacity>
            </View>
        </View>
    )
}

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    content: {
        padding: 20,
        paddingBottom: 0,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
        paddingHorizontal: 0,
        paddingVertical: 12,
    },
    headerLeft: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
    },
    headerLogo: {
        width: 50,
        height: 50,
    },
    welcomeContainer: {
        paddingLeft: 8,
        flex: 1,
    },
    welcomeText: {
        fontSize: 14,
        color: COLORS.textLight,
        marginBottom: 2,
    },
    usernameText: {
        fontSize: 16,
        fontWeight: "600",
        color: COLORS.text,
    },
    headerRight: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: "bold",
        color: COLORS.text,
    },
    addButton: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 24,
        flexDirection: "row",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    addButtonText: {
        color: COLORS.white,
        fontWeight: "600",
        marginLeft: 4,
    },
    logoutButton: {
        padding: 10,
        borderRadius: 20,
        backgroundColor: COLORS.card,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    balanceCard: {
        backgroundColor: COLORS.card,
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
        shadowColor: COLORS.shadow,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    balanceTitle: {
        fontSize: 16,
        color: COLORS.textLight,
        marginBottom: 8,
    },
    balanceAmount: {
        fontSize: 32,
        fontWeight: "bold",
        color: COLORS.text,
        marginBottom: 20,
    },
    balanceStats: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    balanceStatItem: {
        flex: 1,
        alignItems: "center",
    },
    statDivider: {
        borderRightWidth: 1,
        borderColor: COLORS.border,
    },
    balanceStatLabel: {
        fontSize: 14,
        color: COLORS.textLight,
        marginBottom: 4,
    },
    balanceStatAmount: {
        fontSize: 18,
        fontWeight: "600",
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: COLORS.text,
        marginBottom: 15,
    },
    transactionCard: {
        backgroundColor: COLORS.card,
        borderRadius: 12,
        marginBottom: 10,
        flexDirection: "row",
        alignItems: "center",
        shadowColor: COLORS.shadow,
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    transactionContent: {
        flex: 1,
        flexDirection: "row",
        padding: 15,
        alignItems: "center",
    },
    categoryIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#F5F5F5",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    transactionLeft: {
        flex: 1,
    },
    transactionTitle: {
        fontSize: 16,
        fontWeight: "500",
        color: COLORS.text,
        marginBottom: 4,
    },
    transactionCategory: {
        fontSize: 14,
        color: COLORS.textLight,
    },
    transactionRight: {
        paddingRight: 10,
        alignItems: "flex-end",
    },
    transactionAmount: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 4,
    },
    transactionDate: {
        fontSize: 12,
        color: COLORS.textLight,
    },
    deleteButton: {
        padding: 10,
        
    },
    transactionsContainer: {
        marginBottom: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.background,
    },
    emptyState: {
        backgroundColor: COLORS.card,
        borderRadius: 16,
        padding: 30,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 10,
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    emptyStateIcon: {
        marginBottom: 16,
    },
    emptyStateTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: COLORS.text,
        marginBottom: 8,
    },
    emptyStateText: {
        color: COLORS.textLight,
        fontSize: 14,
        textAlign: "center",
        marginBottom: 20,
        lineHeight: 20,
    },
    emptyStateButton: {
        backgroundColor: COLORS.primary,
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    emptyStateButtonText: {
        color: COLORS.white,
        fontWeight: "600",
        marginLeft: 6,
    },
    transactionsHeaderContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
        paddingBottom: 5,
    },
    transactionsList: {
        flex: 1,
        marginHorizontal: 20,
    },
    transactionsListContent: {
        paddingBottom: 20,
    },
});

