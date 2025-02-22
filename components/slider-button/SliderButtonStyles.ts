import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        marginVertical: 10,
        alignItems: "center",
    },
    switchContainer: {
        width: 200,
        height: 50,
        borderRadius: 25,
        backgroundColor: "#ddd",
        position: "relative",
        justifyContent: "center",
        paddingHorizontal: 5,
    },
    slider: {
        width: 90,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#fff",
        position: "absolute",
        top: 5,
        left: 5,
        elevation: 3,
    },
    labelContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 10,
    },
    labelWrapper: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    label: {
        fontSize: 16,
        fontWeight: "bold",
    },
    activeLabel: {
        color: "#000",
    },
    inactiveLabel: {
        color: "#888",
    },
});
