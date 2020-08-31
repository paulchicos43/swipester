import React, {useState, useEffect} from 'react';
import { Text } from 'native-base';
import { Slider, View } from 'react-native';

export default function App(props) {
    const [value, setValue] = useState(0);

    const handleChange = (value) => {
        setValue(value)
        props.propogate(props.title, value);
    }

    useEffect(() => {
        setValue(props.starter)
    }, [])

    return (
        <View>
            <Text>{ value } shares, ($ { value * props.price })</Text>
            <Slider
                step = {1}
                style={{width: 350, height: 40}}
                minimumValue={0}
                maximumValue={100}
                minimumTrackTintColor="#FFFFFF"
                maximumTrackTintColor="#000000"
                value = { props.starter }
                onValueChange = {
                    value => {
                        clearTimeout(sliderTimeoutId)
                        var sliderTimeoutId = setTimeout(() => {
                            handleChange(value)
                        }, 5)
                    }
                }
            />
        </View>
    );
}