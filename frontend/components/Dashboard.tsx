import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'

export default function Dashboard() {
  return (
    <View style={[styles.container]}>
        <ScrollView contentContainerStyle={[styles.scrollContainer]}>

            <Text style={[styles.titleDash]}>Dashboard</Text>
            <View style={[styles.containerRoom]}>
                <View style={[styles.containerRoomChild, { width:170, height:125 }]}>
                    <Text style={[{color: "white"}]}>Chambre</Text>
                </View>
                <View style={[styles.containerRoomChild, { width:170, height:125 }]}>
                    <Text style={[{color: "white"}]}>Bureau</Text>
                </View>
            </View>

            <View 
                style={[
                    styles.containerRoomChild, { 
                        width:360, 
                        height:120, 
                        marginTop: 20, 
                        marginBottom: 20, 
                        margin: "auto", 
                    }
                ]}
                >
                <Text style={[{color: "white"}]}>Résumé IA de la journée</Text>
                <Text 
                    style={[{
                        color: "gray",
                        padding: 10,
                        margin: 5
                    }]}
                >
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. 
                    Soluta in architecto voluptate fugiat fugit. Provident autem suscipit esse itaque.
                </Text>
            </View>

            <View style={[styles.containerRoom]}>
                <View 
                    style={[
                        styles.containerRoomChild, { 
                            width: 170, 
                            height: 87, 
                            alignItems: "center",
                            justifyContent: "center",
                            padding: 10,
                        }
                    ]}
                    >
                    <Text style={[{color: "white"}]}>Température élevée dans la chambre</Text>
                </View>
                <View 
                    style={[
                        styles.containerRoomChild, { 
                            width: 170, 
                            height: 87,
                            alignItems: "center",
                            justifyContent: "center",
                            padding: 10,
                        }
                    ]}
                    >
                    <Text style={[{color: "white"}]}>Température élevée au bureau</Text>
                </View>
            </View>

            {/* Motions */}
            <View 
                style={[
                    styles.containerRoomChild, {
                        width: 360,
                        height: 160,
                        marginTop: 20,
                        margin: "auto"
                    }
                ]}
                >
                <Text style={[{color: "white"}]}>7 detections aujourd'hui</Text>
            </View>

            {/* motions horaire */}
            <View 
                style={[
                    styles.containerRoomChild, {
                        width: 360,
                        height: 160,
                        marginTop: 20,
                        margin: "auto"
                    }
                ]}
                >
                <Text style={[{color: "white"}]}>8:16 PM</Text>
            </View>

            {/* Statiqueactivite */}
            <View 
                style={[
                    styles.containerRoomChild, {
                        width: 360,
                        height: 160,
                        marginTop: 20,
                        margin: "auto"
                    }
                ]}
                >
                <Text style={[{color: "white"}]}>Activité stat</Text>
            </View>
        </ScrollView>
</View>
  )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
    },
    scrollContainer:{
        margin: 5,
        paddingBottom: 100
    },
    titleDash:{
        margin: 5,
        marginBottom: 20,
    },
    containerRoom: {
        flexDirection: "row",
        justifyContent: "center",
        gap: 22,
    },
    containerRoomChild: {
        backgroundColor: "black",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 15
    },
})