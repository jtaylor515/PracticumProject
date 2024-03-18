import {Stack} from 'expo-router' //when importing what is  

export default function MenuStack () {
    return (
        <Stack>
            <Stack.Screen name = 'index' options = {
                {
                    title: 'Menu'
                }
            }/>
        </Stack>
    )
}