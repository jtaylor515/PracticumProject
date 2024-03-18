import { StyleSheet, Pressable } from 'react-native';
import EditScreenInfo from '@/src/components/EditScreenInfo';
import { Text, View} from '@/src/components/Themed';

import Color from '../constants/Colors';
import products from '../../assets/data/products';
import {Product} from '../types'
import {Link} from 'expo-router';

type ProductListItemProps = {
    product: Product; //need to define that
    
}

 const defaultPizzaImage =
'https://cdn.pixabay.com/photo/2017/12/09/08/18/pizza-3007395_960_720.jpg';

 
import { Image } from 'react-native';
 
export const ProductListItem = ({product}: ProductListItemProps) => {
return ( 
    // below the link passess the id (number) of the product to the product details screen
    <Link href={`/menu/${product.id}`} asChild> 
  <Pressable style={styles.container}>
      <Image 
      source={{ uri: product.image || defaultPizzaImage }} 
      style={styles.image} 
      resizeMode = "contain"
      />
      <Text style={styles.title}>{product.name}</Text>
      <Text style={styles.price}>${product.price}</Text>
      
    </Pressable>
    </Link>
);
}

export default ProductListItem;

//create object created styles 
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding:10,
    borderRadius: 10,
    flex: 1, 
    maxWidth: "50%",
   
  
  },
  title: { //nested object?
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  price: {
    color: Color.light.tint,
    fontWeight: 'bold',
  },
  image: {

    width: '100%',
    aspectRatio: 1,
  },
});
