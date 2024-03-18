// this page is to show the details of the product everytime the user clicks on the product

import { useLocalSearchParams } from 'expo-router';
import {View, Text} from 'react-native';
import {Stack} from 'expo-router' //when importing what is  
const ProductDetailsScreen = () => {

    const {id} = useLocalSearchParams(); //this gets the id of the product
    return (
        <View>
            <Stack.Screen options = {
                {
                    title: 'Product Details'
                }
            }/>
            <Text>This is id: {id}</Text>
        </View>
    );
}   






export default ProductDetailsScreen;