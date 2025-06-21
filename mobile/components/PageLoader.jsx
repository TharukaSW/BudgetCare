import { View, StyleSheet, ActivityIndicator } from 'react-native'
import { COLORS } from '@/constants/colors'

const PageLoader = () => {
  return (
    <View>
      <ActivityIndicator size={"large"} color={COLORS.primary} />
    </View>
  )
}

export default PageLoader

export const styles = StyleSheet.create({
    loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  }
});