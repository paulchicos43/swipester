import React, {useState} from 'react';
import { Text } from 'native-base';
import { Slider } from 'react-native';

export default function App(props) {
    const [value, setValue] = useState(0);

    const handleChange = (value) => {
        setValue(value)
        props.propogate(props.title, value);
    }

    return (
        <>
            <Text>{ props.fullTitle }: { value } shares</Text>
            <Slider
            step = {1}
            style={{width: 400, height: 40}}
            minimumValue={0}
            maximumValue={100}
            minimumTrackTintColor="#FFFFFF"
            maximumTrackTintColor="#000000"
            value = { 0 }
            onValueChange = {
                value => {
                    clearTimeout(sliderTimeoutId)
                    var sliderTimeoutId = setTimeout(() => {
                        handleChange(value)
                    }, 1)
                }
            }
            />
         </>
    );
}