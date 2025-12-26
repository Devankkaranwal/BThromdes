import { Text } from 'react-native';

export default function GlobalText(props) {
    return (
        <Text
            {...props}
            allowFontScaling={false}
            maxFontSizeMultiplier={1}
        >
            {props.children}
        </Text>
    );
}
