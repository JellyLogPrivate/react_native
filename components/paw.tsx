import React, { useMemo } from 'react';
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';

type PawProps = {
    width?: number;
    height?: number;

    startColor?: string;
    endColor?: string;
};

export default function Paw({
    width = 47,
    height = 42,

    startColor = '#DDAB97',
    endColor = '#BD877C',
}: PawProps) {
    const gradientId = useMemo(
        () => `paw-gradient-${Math.random().toString(36).slice(2, 11)}`,
        []
    );

    return (
        <Svg width={width} height={height} viewBox="0 0 47 42">
            <Defs>
                <LinearGradient
                    id={gradientId}
                    x1="0"
                    y1="0"
                    x2="47"
                    y2="0"
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset="0%" stopColor={startColor} />

                    <Stop offset="100%" stopColor={endColor} />
                </LinearGradient>
            </Defs>

            <Path
                d="M30.1183 0.217973C25.156 1.45852 23.9153 12.21 28.4641 14.6911C33.013 17.1723 36.8587 11.1779 36.7346 6.83429C36.6336 3.29544 35.0806 -1.02258 30.1183 0.217973Z"
                fill={`url(#${gradientId})`}
            />

            <Path
                d="M40.0407 11.7962C35.0784 14.2774 34.5182 22.9825 38.7268 24.8327C42.9355 26.6829 47.1213 21.3195 46.9973 16.9759C46.8963 13.437 45.003 9.31513 40.0407 11.7962Z"
                fill={`url(#${gradientId})`}
            />

            <Path
                d="M6.9593 11.7965C11.9216 14.2776 12.4818 22.9828 8.27317 24.833C4.06458 26.6832 -0.121343 21.3198 0.00268999 16.9762C0.103741 13.4373 1.99705 9.31539 6.9593 11.7965Z"
                fill={`url(#${gradientId})`}
            />

            <Path
                d="M16.8839 0.217421C21.8463 1.45797 23.087 12.2094 18.5381 14.6906C13.9893 17.1717 10.1436 11.1774 10.2676 6.83374C10.3687 3.29488 11.9216 -1.02313 16.8839 0.217421Z"
                fill={`url(#${gradientId})`}
            />

            <Path
                d="M39.2133 38.2612C42.4238 31.8402 36.3186 27.0962 35.078 25.8556C31.0375 21.8151 29.1051 15.1041 23.4992 15.1041C17.8933 15.1041 14.815 23.788 11.9205 25.8556C10.1838 27.0962 4.73141 32.9492 7.78512 38.6747C11.0934 44.8775 19.364 40.3288 23.0857 40.3288C29.0806 40.3288 35.9051 44.8775 39.2133 38.2612Z"
                fill={`url(#${gradientId})`}
            />
        </Svg>
    );
}
